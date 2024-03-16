from crypt import methods
from urllib import response
from flask import Flask, request, jsonify, session
from flask_cors import CORS, cross_origin
import pandas as pd
import numpy as np
import json
from werkzeug.utils import secure_filename
import os
from config import config
import psycopg2
import psycopg2.extras as extras
from psycopg2.extras import RealDictCursor
import datetime
from src.context import context
from src.util import generate_token
from flask_jwt_extended import JWTManager, jwt_required, create_access_token, get_jwt_identity
import yfinance as yf
import requests_cache
from flask_session import Session
import redis
# from requests_cache import CacheMixin, SQLiteCache
# from requests_ratelimiter import LimiterMixin, MemoryQueueBucket
# from pyrate_limiter import Duration, RequestRate, Limiter

# class CachedLimiterSession(CacheMixin, LimiterMixin, Session):
#     pass

# session = CachedLimiterSession(
#     limiter=Limiter(RequestRate(2, Duration.SECOND*5)),  # max 2 requests per 5 seconds
#     bucket_class=MemoryQueueBucket,
#     backend=SQLiteCache("yfinance.cache"),
# )

requests_cache.install_cache(
    'yfinance.cache', backend='sqlite', expire_after=3600)

app = Flask(__name__)

cors = CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}} ,supports_credentials=True)
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = datetime.timedelta(hours=1)
jwt = JWTManager(app)
app.config['SECRET_KEY'] = 'secret_key'
app.config['CORS_HEADERS'] = 'Content-Type'
app.config['UPLOAD_FOLDER'] = './back/data'
app.config['PROPAGATE_EXCEPTIONS'] = True

# Configure Flask to use Redis for session storage
app.config['SESSION_TYPE'] = 'redis'
app.config['SESSION_PERMANENT'] = False
app.config['SESSION_REDIS'] = redis.Redis(host='redis', port=6379, password='omni', db=0)

Session(app)

# @app.before_request
# def option_autoreply():
#     """ Always reply 200 on OPTIONS request """

#     if request.method == 'OPTIONS':
#         resp = app.make_default_options_response()

#         headers = None
#         if 'ACCESS_CONTROL_REQUEST_HEADERS' in request.headers:
#             headers = request.headers['ACCESS_CONTROL_REQUEST_HEADERS']

#         h = resp.headers

#         # Allow the origin which made the XHR
#         h['Access-Control-Allow-Origin'] = request.headers['Origin']
#         # Allow the actual method
#         h['Access-Control-Allow-Methods'] = request.headers[
#             'Access-Control-Request-Method']
#         # Allow for 10 seconds
#         h['Access-Control-Max-Age'] = "10"

#         h['Content-Type'] = 'application/json'
#         print("type of request" + str(type(h['Access-Control-Allow-Origin'])))
#         # We also keep current headers
#         if headers is not None:
#             h['Access-Control-Allow-Headers'] = headers

#         return resp

# @app.after_request
# def middleware_for_response(response):
#     # Allowing the credentials in the response.
#     response.headers.add('Access-Control-Allow-Credentials', 'true')
#     return response

equity_headers = ['symbol', 'isin', 'sector', 'quantity_available', 'quantity_discrepant', 'quantity_long_term',
                  'quantity_pledged_margin', 'quantity_pledged_loan', 'average_price', 'previous_closing_price', 'unrealized_pl', 'unrealized_pl_pct']
bank_transactions_headers = ['date', 'narration', 'ref_number',
                             'value_date', 'debit_amount', 'credit_amount', 'balance']
bank_accounts_headers = ['bank', 'account', 'ifsc']
filename_holdings = 'holdings.xlsx'
filename_tradebook = 'tradebook.csv'
filename_ledger = 'ledger.csv'
filename_bank_transactions = 'bank_transactions.xls'
recommendations_headers = ['buy_price', 'isin', 'recommendation_date',
                           'target_price', 'sector', 'symbol', 'duration']

# initialize the context and database
context().init()

# Decorator to require a valid Bearer token


@jwt.expired_token_loader
def expired_token_callback(jwt_header, jwt_payload):
    print(jwt_header)
    print(jwt_payload)
    return jsonify({
        'message': 'The token has expired',
        'error': 'token_expired'
    }), 401


@jwt.invalid_token_loader
def invalid_token_callback(error):
    return jsonify({
        'message': 'Signature verification failed',
        'error': 'invalid_token'
    }), 401


def connect_db():
    conn = None
    try:
        # read connection parameters
        params = config()

        # connect to the PostgreSQL server
        print('Connecting to the PostgreSQL database...')
        conn = psycopg2.connect(**params)

        # create a cursor
        cur = conn.cursor()

        # execute a statement
        print('PostgreSQL database version:')
        cur.execute('SELECT version()')

        # display the PostgreSQL database server version
        db_version = cur.fetchone()
        print(db_version, 'connected')

        # close the communication with the PostgreSQL
        # cur.close()
        return conn
    except (Exception) as error:
        print(error)


def insert_into_db(query, data):
    conn = connect_db()
    cursor = conn.cursor()
    try:
        extras.execute_values(cursor, query, data)
        conn.commit()
    except (Exception, psycopg2.DatabaseError) as error:
        print("Error: %s" % error)
        conn.rollback()
        cursor.close()
        return 1
    print("the data is inserted")
    cursor.close()


def insert_tradebook_db(filename):

    ledger_unformatted = pd.read_csv('./data/'+filename)
    ledger = extract_tradebook(ledger_unformatted)
    data = [tuple(x) for x in ledger.to_numpy()]
    cols = ','.join(ledger.columns)
    # SQL query to execute
    query = "INSERT INTO %s(%s) VALUES %%s" % ('tradebook', cols)
    context().db.insert_into_db(query, data)
    # insert_into_db(query,data)


def insert_ledger_db(filename):

    ledger_unformatted = pd.read_csv('./data/'+filename)
    ledger = extract_ledgers(ledger_unformatted)
    data = [tuple(x) for x in ledger.to_numpy()]
    cols = ','.join(ledger.columns)
    # SQL query to execute
    query = "INSERT INTO %s(%s) VALUES %%s" % ('ledger', cols)
    insert_into_db(query, data)


def insert_holdings_db():

    holdings = pd.read_excel(
        app.config['UPLOAD_FOLDER']+'/'+filename_holdings, sheet_name='Equity')
    equity = extract_holdings(holdings)
    equity['user_name'] = extract_client_id(holdings)
    data = [tuple(x) for x in equity.to_numpy()]
    cols = ','.join(equity.columns)
    cols_to_update = 'quantity_available,quantity_discrepant,quantity_long_term,quantity_pledged_margin,quantity_pledged_loan,average_price,previous_closing_price,unrealized_pl,unrealized_pl_pct,record_date'
    set_cols = 'isin, record_date, user_name'
    set_ref_cols = 'omni.stock_data.isin, omni.stock_data.record_date, omni.stock_data.user_name'
    # SQL query to execute
    upsert_query = "INSERT INTO %s(%s) VALUES %%s ON CONFLICT (isin, record_date, user_name) DO UPDATE SET (%s) = (%s) RETURNING *;" % (
        'omni.stock_data', cols, set_cols, set_ref_cols)
    # query = "INSERT INTO %s(%s) VALUES %%s" % ('omni.stock_data', cols)
    # insert_into_db(query,data)
    status = context().db.insert_into_db(upsert_query, data)
    return status


def insert_bank_transactions_db(filename):
    """
    Inserts bank transactions into the database.

    Parameters:
        filename (str): The name of the file containing the bank transactions.

    Returns:
        None
    """
    bank_transactions_unformatted = pd.read_excel(
        app.config['UPLOAD_FOLDER']+'/'+filename)
    bank_transactions = extract_bank_transactions(
        bank_transactions_unformatted, filename.split('.')[0])
    data = [tuple(x) for x in bank_transactions.to_numpy()]
    cols = ','.join(bank_transactions.columns)
    query = "INSERT INTO %s(%s) VALUES %%s" % ('omni.bank_transactions', cols)
    context().db.insert_into_db(query, data)


def extract_holdings(holdings):
    df = holdings.iloc[22:, 1:]
    df.columns = equity_headers
    df['record_date'] = datetime.datetime.strptime(
        holdings.iloc[9][1].split(' ')[-1], '%Y-%m-%d').date()
    return df


def extract_client_id(holdings):
    return holdings.iat[5, 2]


def extract_summary(holdings):
    df = holdings.iloc[13:17, 1:3]
    print(df)


def extract_ledgers(ledger):
    ledger = ledger.iloc[1:]
    ledger = ledger.iloc[:-1]
    return ledger


def extract_tradebook(tradebook):
    return tradebook


def extract_bank_transactions(bank_transactions, account):
    """
    Extracts bank transactions and assigns the given account to each transaction.

    Parameters:
    - bank_transactions: DataFrame containing the bank transactions data.
    - account: The account to be assigned to each transaction.

    Returns:
    - bank_transactions: DataFrame with the updated account column.
    """
    bank_transactions.columns = bank_transactions_headers
    bank_transactions.drop(columns=['date'], inplace=True, axis=1)
    bank_transactions['value_date'] = bank_transactions['value_date'].str.strip()
    bank_transactions['narration'] = bank_transactions['narration'].str.strip()
    bank_transactions['ref_number'] = bank_transactions['ref_number'].str.strip()
    bank_transactions['value_date'] = pd.to_datetime(
        bank_transactions['value_date'], infer_datetime_format=True)
    bank_transactions['account'] = account
    bank_transactions['debit_amount'] = bank_transactions['debit_amount'].fillna(
        0.0)
    bank_transactions['credit_amount'] = bank_transactions['credit_amount'].fillna(
        0.0)
    print(account)
    return bank_transactions


def select_all_from_bank_accounts():
    conn = connect_db()
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    query = "select * from bank_accounts"
    try:
        cursor.execute(query)
        records = cursor.fetchall()

    except (Exception, psycopg2.DatabaseError) as error:
        print("Error: %s" % error)
        conn.rollback()
        cursor.close()
        return 1
    print("the data is inserted")
    cursor.close()
    return json.dumps(records)


# ***************************** Routes *********************************

@app.route('/')
def hello():
    return 'Hello, World!'


@app.route('/upload_holdings', methods=['POST'])
# @cross_origin()
def upload_holdings():
    """
    Upload holdings from a file.

    Parameters:
        None

    Returns:
        - 'file uploaded successfully' (str): If the file was successfully uploaded.
        - 'no file provided' (str): If no file was provided.
    """
    file = request.files.get('file')
    if file:
        file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename_holdings))
        status = insert_holdings_db()
        if status:
            return 'file uploaded successfully', 200
        else:
            return 'file not uploaded successfully', 400
    else:
        return 'no file provided', 400


@app.route('/upload_tradebook', methods=['GET', 'POST'])
# @cross_origin()
def upload_tradebook():
    """
    Uploads a tradebook file to the server.

    Parameters:
        None

    Returns:
        - 'file uploaded successfully' if the file is uploaded successfully.
        - 'file not found' if the file is not found or if the request method is not POST.
    """
    if request.method == 'POST':
        f = request.files.get('file')
        if f:
            f.save(os.path.join(
                app.config['UPLOAD_FOLDER'], filename_tradebook))
            insert_tradebook_db(secure_filename(filename_tradebook))
            return 'file uploaded successfully'
    return 'file not found'


@app.route('/upload_ledger', methods=['GET', 'POST'])
# @cross_origin()
def upload_ledger():
    if request.method == 'POST':
        f = request.files['file']
        f.save(os.path.join(app.config['UPLOAD_FOLDER'], filename_ledger))
        insert_ledger_db(filename_ledger)
        return 'file uploaded successfully'


@app.route('/upload_bank_transactions', methods=['GET', 'POST'])
# @cross_origin()
def upload_bank_transactions():
    if request.method == 'POST':
        file = request.files['file']
        bank = request.args.get('bank')
        account = request.args.get('account')

        filename = secure_filename(file.filename.split('_')[0] + '.xls')
        file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))

        insert_bank_transactions_db(filename)

        return 'File uploaded successfully', 200

    if request.method == 'GET':
        return 'File not found'


@app.route('/bank_accounts', methods=['GET', 'POST'])
@jwt_required()
# @cross_origin()
def bank_accounts():
    current_user = get_jwt_identity()
    if request.method == 'GET':
        try:
            sql = "SELECT * FROM omni.bank_accounts"
            # data = context().db.select_all_from_bank_accounts()
            records = context().db.select_from_db(sql, as_dataframe=True)
            if len(records):
                data = {
                    'bank_accounts': json.loads(records.to_json(orient='records'))
                }
            else:
                data = {
                    'bank_accounts': []
                }
            return data, 200
        except Exception as e:
            return str(e), 500

    if request.method == 'POST':
        try:
            data = request.get_json(force=True)
            bank = data['bank']
            account = data['account']
            ifsc = data['ifsc']

            data = [tuple([bank, account, ifsc])]
            cols = ','.join(bank_accounts_headers)
            query = "INSERT INTO %s(%s) VALUES %%s" % (
                'omni.bank_accounts', cols)
            context().db.insert_into_db(query, data)
            response = 'account added successfully'
            return response, 200
        except Exception as e:
            return str(e), 500


@app.route('/holdings')
# @cross_origin()
def get_holdings():

    record_date = request.args.get('date')

    if record_date is None:
        # get latest record-date from the database
        sql = "SELECT max(record_date) FROM omni.stock_data"
        record_date = context().db.select_from_db(sql, as_dataframe=True).iloc[0][0]
    else:
        record_date = datetime.datetime.fromisoformat(
            record_date.replace("Z", "+00:00"))
        # Format the datetime object as a date string
        record_date = record_date.strftime("%Y-%m-%d")



    sql = "SELECT * FROM omni.stock_data WHERE record_date = '%s'" % (
        record_date)
    equity = context().db.select_from_db(sql, as_dataframe=True)

    if not equity.empty:
        equity['invested'] = equity['average_price'] * \
            equity['quantity_available']
        equity['value'] = equity['previous_closing_price'] * \
            equity['quantity_available']
        total_invested = equity['invested'].sum()
        total_value = equity['value'].sum()
        equity['weight'] = (equity['value']/total_value)*100
        total_pl = total_value - total_invested
        total_pl_pct = (total_pl/total_invested)*100

        equity = equity.sort_values(by=['weight'], ascending=False)

        data = {
            'holdings': json.loads(equity.to_json(orient='records')),
            'summary': {
                'invested': total_invested,
                'value': total_value,
                'pl': total_pl,
                'pl_pct': total_pl_pct,
            },
            'record_date': record_date

        }
    else:
        data = {
            'holdings': [],
            'summary': {}
        }
    # extract_summary(holdings)
    return data


@app.route('/register', methods=['POST'])
# @cross_origin()
def register_user():
    """
    Register a new user.

    This function handles the POST request to '/register' endpoint and registers a new user in the system.

    Parameters:
    - None

    Returns:
    - A JSON response with either an error message and HTTP status code 400 if the data is incomplete,
      or a success message and HTTP status code 202 if the user is created successfully.
    """
    data = request.json

    username = data.get('username')
    email = data.get('email')
    password = data.get('password')

    if not all([username, email, password]):
        return jsonify({'error': 'Incomplete data'}), 400

    try:
        context().db.insert_user(username, email, password)
        return jsonify({'message': 'User created successfully'}), 202
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# todo: add login route


@app.route('/login', methods=['POST'])
# @cross_origin()
def login_user():
    if request.method == 'POST':
        username = request.json.get('username')
        password = request.json.get('password')
        valid_user, user = context().db.validate_username_password(username, password)

        if valid_user:
            session['user_id'] = user['id']
            session.modified = True
            session.permanent = True
            token = create_access_token(username)
            response = jsonify({'token': token, 'user': user})
            return response, 200
        else:
            return "Invalid username or password", 400
    else:
        return "Method not allowed", 405


@app.route('/stocks', methods=['GET'])
# @cross_origin()
def get_stocks():
    symbol = request.args.get('symbol')+'.NS'
    stock = yf.Ticker(symbol)
    price_summary = stock.history(period='1d')
    price_summary = price_summary.reset_index()
    return price_summary.to_json(orient='records')

def recommendation_profit_loss(id,ltp):
    trades = context().db.select_from_db('SELECT client_id, symbol, sum(quantity) as quantity, sum(quantity*buy_price)/sum(quantity) as avg_cost, trade_type  FROM omni.stock_trades_recommendation WHERE recommendations = %s group by client_id, symbol, trade_type ;' % (id), as_dataframe=True)
    trades['profit_loss'] = trades['quantity']*(ltp - trades['avg_cost'])
    trades['profit_loss_pct'] = (trades['profit_loss']/(trades['avg_cost']*trades['quantity']))*100
    return trades


@app.route('/recommendations', methods=['GET', 'POST'])
# @cross_origin()
@jwt_required()
def recommendations():

    if request.method == 'GET':
        try:
            recommendations = context().db.select_from_db(
                'SELECT * FROM omni.stock_recommendations', as_dataframe=True)
            # tick = yf.Ticker(recommendations['symbol'].iloc[0]+'.NS')
            # recommendations['ltp'] =  tick.info.get('currentPrice')
            recommendations['ltp'] = recommendations['symbol'].apply(
                lambda x: yf.Ticker(x+'.NS').info.get('currentPrice'))
            recommendations['previous_close'] = recommendations['symbol'].apply(
                lambda x: yf.Ticker(x+'.NS').info.get('previousClose'))
            recommendations['trades'] = recommendations.apply(lambda x: recommendation_profit_loss(x['id'],x['ltp']), axis=1)
            recommendations['profit_loss'] = recommendations['trades'].apply(lambda x: x['profit_loss'].sum())
            recommendations['profit_loss_pct'] = recommendations['trades'].apply(lambda x: x['profit_loss_pct'].mean())
            recommendations['chart'] = recommendations.apply(lambda x: yf.Ticker(x['symbol']+'.NS').history(start=x['recommendation_date']).reset_index(), axis=1)
            # recommendations['trades'] = recommendations['id'].apply(
            #     lambda x: context().db.select_from_db('SELECT client_id, symbol, sum(quantity) as quantity, sum(quantity*buy_price)/sum(quantity) as avg_cost, trade_type  FROM omni.stock_trades_recommendation WHERE recommendations = %s group by client_id, symbol, trade_type ;' % (x), as_dataframe=True))
            
            return recommendations.to_json(orient='records')
        except Exception as e:
            return str(e), 500

    if request.method == 'POST':
        try:
            data = request.get_json(force=True)
            symbol = data['symbol']
            buy_price = data['buyprice']
            target_price = data['targetprice']
            recommendation_date = data['recommendationdate']
            duration = data['duration']
            recommendations_headers = [
                'buy_price', 'isin', 'recommendation_date', 'target_price', 'sector', 'symbol', 'duration']

            tick = yf.Ticker(symbol+'.NS')
            isin = tick.isin
            sector = tick.info['sector']

            data = [tuple([buy_price, isin, recommendation_date,
                          target_price, sector, symbol, duration])]
            cols = ','.join(recommendations_headers)
            query = "INSERT INTO %s(%s) VALUES %%s" % (
                'omni.stock_recommendations', cols)
            context().db.insert_into_db(query, data)
            response = 'recommendation added successfully'
            return response, 200
        except Exception as e:
            return str(e), 500


@app.route('/brokers', methods=['POST'])
@jwt_required()
# @cross_origin()
def brokers():
    if request.method == 'POST':

        data = request.get_json(force=True)
        user_id = session['user_id']
        client_id = data['client_id']
        broker_id = data['broker_id']
        data = [tuple([user_id, client_id, broker_id])]
        cols = ','.join(['user_id', 'client_id', 'broker_id'])
        query = "INSERT INTO %s(%s) VALUES %%s" % ('omni.trading_accounts', cols)
        context().db.insert_into_db(query, data)
        response = 'broker added successfully'
        return response, 200

@app.route('/recommendations_trades', methods=['POST'])
@jwt_required()
def recommendations_trades():
    if request.method == 'POST':
        data = request.get_json(force=True)
        symbol = data['symbol']
        buy_price = data['buy_price']
        recommendations = data['recommendation_id']
        sell_price = data['sell_price']
        trade_date = data['trade_date']
        client_id = data['client_id']
        quantity = data['quantity']
        trade_type = data['trade_type']
        isin = yf.Ticker(symbol+'.NS').isin


        data = [tuple([symbol, buy_price, recommendations, sell_price, trade_date, client_id, quantity, trade_type, isin])]
        cols = ','.join(['symbol', 'buy_price', 'recommendations', 'sell_price', 'trade_date', 'client_id', 'quantity', 'trade_type', 'isin'])
        query = "INSERT INTO %s(%s) VALUES %%s" % ('omni.stock_trades_recommendation', cols)         
        
        context().db.insert_into_db(query, data)     

        response = 'Trade recommendation added successfully'
        return response, 200


if __name__ == "__main__":
    app.run(host='0.0.0.0', port=8000, debug=True)
    


from crypt import methods
from urllib import response
from flask import Flask, request
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

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'
app.config['UPLOAD_FOLDER'] = './data'

equity_headers = ['symbol','isin','sector','quantity_available','quantity_discrepant','quantity_long_term','quantity_pledged_margin','quantity_pledged_loan','average_price','previous_closing_price','unrealized_pl','unrealized_pl_pct']
bank_transactions_headers = ['date','narration','value_date','debit_amount','credit_amount','ref_number','balance']
bank_accounts_headers = ['bank','account','ifsc']
filename_holdings = 'holdings.xlsx'
filename_tradebook = 'tradebook.csv'
filename_ledger = 'ledger.csv'
filename_bank_transactions = 'bank_transactions.csv'

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

def insert_into_db(query,data):
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
    insert_into_db(query,data)

def insert_ledger_db(filename):
    
    ledger_unformatted = pd.read_csv('./data/'+filename)
    ledger = extract_ledgers(ledger_unformatted)
    data = [tuple(x) for x in ledger.to_numpy()]
    cols = ','.join(ledger.columns)
    # SQL query to execute
    query = "INSERT INTO %s(%s) VALUES %%s" % ('ledger', cols)
    insert_into_db(query,data)

def insert_holdings_db():
    
    holdings = pd.read_excel('./data/'+filename_holdings,sheet_name='Equity')
    equity = extract_holdings(holdings)
    data = [tuple(x) for x in equity.to_numpy()]
    cols = ','.join(equity.columns)
    # SQL query to execute
    query = "INSERT INTO %s(%s) VALUES %%s" % ('equity', cols)
    insert_into_db(query,data)


def insert_bank_transactions_db(filename):
    bank_transactions_unformatted = pd.read_csv('./data/'+filename)
    bank_transactions = extract_bank_transactions(bank_transactions_unformatted,filename.split('.')[0])
    data = [tuple(x) for x in bank_transactions.to_numpy()]
    cols = ','.join(bank_transactions.columns)
    # SQL query to execute
    query = "INSERT INTO %s(%s) VALUES %%s" % ('bank_transactions', cols)
    insert_into_db(query,data)

def extract_holdings(holdings):
    df = holdings.iloc[22:,1:]
    df.columns = equity_headers
    df['record_date'] = datetime.datetime.strptime(holdings.iloc[9][1].split(' ')[-1], '%Y-%m-%d').date()
    return df

def extract_ledgers(ledger):
    ledger = ledger.iloc[1:]
    ledger = ledger.iloc[:-1]
    return ledger

def extract_tradebook(tradebook):
    return tradebook

def extract_bank_transactions(bank_transactions,account):
    bank_transactions.columns = bank_transactions_headers
    bank_transactions.date = bank_transactions.date.apply(lambda x: x.strip())
    bank_transactions.value_date = bank_transactions.value_date.apply(lambda x: x.strip())
    bank_transactions.narration = bank_transactions.narration.apply(lambda x: x.strip())
    bank_transactions.ref_number = bank_transactions.ref_number.apply(lambda x: x.strip())
    bank_transactions['date'] = pd.to_datetime(bank_transactions['date'], infer_datetime_format=True)
    bank_transactions['value_date'] = pd.to_datetime(bank_transactions['value_date'], infer_datetime_format=True)
    bank_transactions['account'] = account
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


@app.route('/upload_holdings', methods = ['GET', 'POST'])
@cross_origin()
def upload_holdings():
   if request.method == 'POST':
      f = request.files['file']
      f.save(os.path.join(app.config['UPLOAD_FOLDER'], filename_holdings))
      insert_holdings_db()
      return 'file uploaded successfully'

@app.route('/upload_tradebook', methods = ['GET', 'POST'])
@cross_origin()
def upload_tradebook():
   if request.method == 'POST':
      f = request.files['file']
      f.save(os.path.join(app.config['UPLOAD_FOLDER'], filename_tradebook))
      insert_tradebook_db(secure_filename(filename_tradebook))
      return 'file uploaded successfully'

@app.route('/upload_ledger', methods = ['GET', 'POST'])
@cross_origin()
def upload_ledger():
   if request.method == 'POST':
      f = request.files['file']
      f.save(os.path.join(app.config['UPLOAD_FOLDER'], filename_ledger))
      insert_ledger_db(filename_ledger)
      return 'file uploaded successfully'

@app.route('/upload_bank_transactions', methods = ['GET', 'POST'])
@cross_origin()
def upload_bank_transactions():
   if request.method == 'POST':
        f = request.files['file']
        print(request.data)
        bank = request.args.get('bank')
        account = request.args.get('account')
        print(bank,account)
        filename = secure_filename(f.filename.split('_')[0]+'.csv')
        f.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
        insert_bank_transactions_db(filename)
        return 'file uploaded successfully'

@app.route('/bank_accounts', methods= ['GET', 'POST'])
@cross_origin()
def bank_accounts():
    if request.method == 'GET':
        data = select_all_from_bank_accounts()
        response = data
    if request.method == 'POST':
        data = request.get_json(force=True)
        bank = data['bank']
        account = data['account']
        ifsc = data['ifsc']

        data = [tuple([bank,account,ifsc])]
        cols = ','.join(bank_accounts_headers)
        # SQL query to execute
        query = "INSERT INTO %s(%s) VALUES %%s" % ('bank_accounts', cols)
        insert_into_db(query,data)
        response = 'ok'
    return response

@app.route('/holdings')
@cross_origin()
def get_holdings():
    holdings = pd.read_excel('./data/holdings.xlsx',sheet_name='Equity')
    equity = extract_holdings(holdings)
    data = {
        'holdings':json.loads(equity.to_json(orient='records')),
        'summary':{
            'invested':'4,86,532.79',
            'value':'5,14,784.57',
            'pl':'28,251.78',
            'pl_pct':'5.81',
        }

    }
    return data

if __name__ == "__main__":
    app.run(host='0.0.0.0',port=8000,debug=True)
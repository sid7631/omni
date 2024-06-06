from . import bp
from decimal import Decimal
from flask import request, jsonify
from app.models.models import db, Stock, Account, MarketData, Transaction, Portfolio, PortfolioStocks, Valuation
import yfinance as yf
from datetime import datetime, date, timedelta
import time


@bp.route('/accounts', methods=['POST'])
def add_account():
    data = request.get_json()
    account_name = data.get('account_name')
    account_type = data.get('account_type')
    
    if not account_name or not account_type:
        return jsonify({'error': 'Missing account_name or account_type'}), 400

    new_account = Account(account_name=account_name, account_type=account_type)
    db.session.add(new_account)
    db.session.commit()
    return jsonify({
        'account_id': new_account.account_id,
        'account_name': new_account.account_name,
        'account_type': new_account.account_type
    }), 201

@bp.route('/stocks', methods=['POST'])
def add_stock():
    symbol = request.json.get('symbol')
    company_name = request.json.get('symbol')
    if symbol and company_name:
        new_stock = Stock(symbol=symbol, company_name=company_name)
        db.session.add(new_stock)
        db.session.commit()
        return jsonify(new_stock.id), 201
    else:
        return jsonify({"error": "Missing data for symbol or company name"}), 400

@bp.route('/update_stock/<string:symbol>/<string:start_date>', methods=['POST'])
def update_stock(symbol, start_date):
    # Check if additional suffix needs to be added
    add_suffix = request.args.get('add_suffix', 'false').lower() == 'true'
    if add_suffix:
        symbol += request.args.get('add_suffix')  # Append the suffix for Indian stocks on NSE

    # Parse start date
    try:
        start_date = datetime.strptime(start_date, "%Y-%m-%d").date()
    except ValueError:
        return jsonify({'error': 'Invalid date format. Use YYYY-MM-DD.'}), 400

    # Check if start date is in the past
    if start_date > date.today():
        return jsonify({'error': 'Start date cannot be in the future.'}), 400

    # Fetch stock data from yfinance
    stock = yf.Ticker(symbol)
    try:
        # Fetch data from start date to the most recent date
        hist = stock.history(start=start_date)
        if hist.empty:
            return jsonify({'error': 'No data found from the start date onwards'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

    # Update or insert stock information in Stock table
    stock_entry = Stock.query.filter_by(symbol=symbol).first()
    if not stock_entry:
        stock_entry = Stock(symbol=symbol)
        db.session.add(stock_entry)
        db.session.commit()

    # Update the MarketData table day by day
    updates = []
    for idx, row in hist.iterrows():
        data_date = idx.date()
        market_data_entry = MarketData.query.filter_by(stock_id=stock_entry.stock_id, data_date=data_date).first()
        if not market_data_entry:
            market_data_entry = MarketData(
                stock_id=stock_entry.stock_id,
                price=row['Close'],
                eps=stock.info.get('epsTrailingTwelveMonths'),
                pe_ratio=stock.info.get('trailingPE'),
                market_cap=stock.info.get('marketCap'),
                data_date=data_date
            )
            db.session.add(market_data_entry)
        else:
            market_data_entry.price = row['Close']
            market_data_entry.eps = stock.info.get('epsTrailingTwelveMonths')
            market_data_entry.pe_ratio = stock.info.get('trailingPE')
            market_data_entry.market_cap = stock.info.get('marketCap')
            market_data_entry.data_date = data_date

        db.session.commit()
        updates.append({
            'date': data_date.isoformat(),
            'price': row['Close']
        })

    return jsonify({
        'stock_id': stock_entry.stock_id,
        'symbol': stock_entry.symbol,
        'updates': updates
    }), 200

@bp.route('/insert_transaction', methods=['POST'])
def insert_transaction():

    transactions_data = request.get_json()
    responses = []

    for data in transactions_data:
        time.sleep(1)  # Sleep for 1 second to avoid rate limiting from yfinance

        symbol = data['symbol']
        add_suffix = data.get('add_suffix', False)
        if add_suffix:
            symbol += data['suffix']
        account_id = data['account_id']  # Account identifier from the request
        quantity = data['quantity']
        transaction_price = data['price']
        transaction_type = data['transaction_type']
        transaction_date_str = data.get('transaction_date', datetime.today().strftime('%Y-%m-%d'))

        try:
            transaction_date = datetime.strptime(transaction_date_str, '%Y-%m-%d').date()
        except ValueError:
            return jsonify({'error': 'Invalid transaction date format. Use YYYY-MM-DD.'}), 400

        # Validate and retrieve the account
        account = Account.query.get(account_id)
        if not account:
            return jsonify({'error': 'Account not found'}), 404

        # Validate and retrieve or update the stock
        stock = Stock.query.filter_by(symbol=symbol).first()
        if not stock:
            stock = Stock(symbol=symbol)
            db.session.add(stock)
            db.session.commit()

        # Ensure Market Data is up to date from the transaction date to today
        update_market_data(symbol, transaction_date)

        portfolio = Portfolio.query.filter_by(account_id=account_id).first()
        if not portfolio:
            portfolio = Portfolio(account_id=account_id)
            db.session.add(portfolio)
            db.session.commit()
        
        # Handle the specific stock in the portfolio
        pstock = PortfolioStocks.query.filter_by(portfolio_id=portfolio.portfolio_id, stock_id=stock.stock_id).first()
        if not pstock:
            if transaction_type.lower() == 'sell':
                return jsonify({'error': 'Cannot sell stock not in portfolio'}), 400
            pstock = PortfolioStocks(portfolio_id=portfolio.portfolio_id, stock_id=stock.stock_id, quantity=0, average_price=0, invested_amount=0)
            db.session.add(pstock)

        # Update quantities based on the transaction type
        if transaction_type.lower() == 'buy':
            total_invested = Decimal(pstock.invested_amount) + Decimal((quantity * transaction_price))
            total_quantity = pstock.quantity + quantity
            pstock.average_price = total_invested / total_quantity
        elif transaction_type.lower() == 'sell':
            if pstock.quantity < quantity:
                return jsonify({'error': 'Not enough stock quantity to sell'}), 400
            total_invested = pstock.invested_amount - (quantity * pstock.average_price)
            total_quantity = pstock.quantity - quantity
            pstock.average_price = total_invested / total_quantity if total_quantity > 0 else 0
        
        pstock.quantity = total_quantity
        pstock.invested_amount = total_invested
        # get the last traded price from the market data with latest price as transaction_date
        #get latest market data for the stock on current date or last available date

        # Fetch the latest available market data price
        market_data = MarketData.query.filter_by(stock_id=stock.stock_id).order_by(MarketData.data_date.desc()).first()
        if market_data:
            pstock.last_traded_price = market_data.price
        else:
            pstock.last_traded_price = transaction_price 

        # Update the valuation for the portfolio
        valuation = Valuation.query.filter_by(portfolio_id=portfolio.portfolio_id).first()
        if not valuation:
            valuation = Valuation(portfolio_id=portfolio.portfolio_id, valuation_date=datetime.now())
            db.session.add(valuation)

        total_portfolio_value = sum(Decimal(ps.quantity) * Decimal(ps.last_traded_price) for ps in PortfolioStocks.query.filter_by(portfolio_id=portfolio.portfolio_id))
        total_invested_portfolio = sum(Decimal(ps.invested_amount) for ps in PortfolioStocks.query.filter_by(portfolio_id=portfolio.portfolio_id))

        valuation.current_value = total_portfolio_value
        valuation.unrealized_pnl = total_portfolio_value - total_invested_portfolio
        valuation.unrealized_pnl_pct = ((total_portfolio_value - total_invested_portfolio) / total_invested_portfolio * 100) if total_invested_portfolio != 0 else 0
        valuation.valuation_date = datetime.now()    

        # Record the transaction
        transaction = Transaction(stock_id=stock.stock_id, account_id=account_id, quantity=quantity, price=transaction_price, transaction_type=transaction_type, transaction_date=transaction_date)
        db.session.add(transaction)
        db.session.commit()

        response = {
            'transaction_id': transaction.transaction_id,
            'portfolio_id': portfolio.portfolio_id,
            'valuation': {
                'current_value': str(valuation.current_value),
                'unrealized_pnl': str(valuation.unrealized_pnl),
                'unrealized_pnl_pct': str(valuation.unrealized_pnl_pct),
                'valuation_date': valuation.valuation_date.strftime('%Y-%m-%d')
            }
        }

        responses.append(response)
    
    return jsonify(responses), 201


def update_market_data(symbol, start_date):
    time.sleep(1)  # Sleep for 1 second to avoid rate limiting from yfinance
    current_date = date.today()
    yf_stock = yf.Ticker(symbol)  # This is the yfinance Ticker object
    hist = yf_stock.history(start=start_date, end=current_date)
    
    # Convert hist.index to just date part for comparison
    try:
        hist_dates = hist.index.normalize().date
    except Exception as e:
        print(f'Error: {e}')
    # Retrieve the Stock object from the database
    stock = Stock.query.filter_by(symbol=symbol).first()
    if not stock:
        # If the stock isn't found, we need to create it (or handle this case appropriately)
        stock = Stock(symbol=symbol)
        db.session.add(stock)
        db.session.commit()

    for single_date in (start_date + timedelta(days=n) for n in range((current_date - start_date).days + 1)):
        # Check if the date is in the history index
        if single_date not in hist_dates:
            continue  # Skip days for which yfinance did not return data (e.g., weekends, holidays)
        
        day_data = hist[hist.index.normalize().date == single_date]
        
        if day_data.empty:
            continue  # Skip if no data is available for this day
        
        day_data = day_data.iloc[0]  # In case of duplicates, take the first one
        
        # Check if market data already exists for this date
        if MarketData.query.filter_by(stock_id=stock.stock_id, data_date=single_date).first():
            continue  # Skip this date if data already exists
        
        # If not, create new market data entry
        market_data_entry = MarketData(
            stock_id=stock.stock_id,
            price=day_data['Close'],
            eps=yf_stock.info.get('epsTrailingTwelveMonths', None),
            pe_ratio=yf_stock.info.get('trailingPE', None),
            market_cap=yf_stock.info.get('marketCap', None),
            data_date=single_date
        )
        db.session.add(market_data_entry)
        db.session.commit()


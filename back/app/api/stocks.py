from . import bp
from decimal import Decimal
from flask import request, jsonify
from app.models.models import db, Stock, Account, MarketData, Transaction, Portfolio, PortfolioStocks, Valuation, StockFundamentals
import yfinance as yf
from datetime import datetime, date, timedelta
import time


def update_market_data(symbol, stock_id):
    """
    Updates market data for a stock. If no new data is available, it skips.
    """
    latest_entry = db.session.query(MarketData.data_date).filter_by(
        stock_id=stock_id).order_by(MarketData.data_date.desc()).first()

    stock = yf.Ticker(symbol+'.NS')
    stock_info = stock.info
    listing_date = stock_info.get('firstTradeDateMilliseconds')

    if listing_date:
        listing_date = datetime.utcfromtimestamp(listing_date / 1000).date()
    else:
        listing_date = date(2000, 1, 1)  # Fallback

    start_date = listing_date if not latest_entry else latest_entry[0]

    # Fetch historical data
    hist = stock.history(start=start_date)
    if hist.empty:
        print(f"No new market data for {symbol}.")
        return

    hist.reset_index(inplace=True)
    hist["Date"] = hist["Date"].dt.date

    # Calculate indicators
    hist["SMA_50"] = hist["Close"].rolling(window=50).mean()
    hist["SMA_200"] = hist["Close"].rolling(window=200).mean()
    hist["ATR"] = (hist["High"] - hist["Low"]).rolling(window=14).mean()

    new_entries = []
    for _, row in hist.iterrows():
        existing_entry = db.session.query(MarketData).filter_by(
            stock_id=stock_id, data_date=row["Date"]).first()

        if not existing_entry:
            new_entries.append(MarketData(
                stock_id=stock_id,
                data_date=row["Date"],
                open_price=row["Open"],
                high_price=row["High"],
                low_price=row["Low"],
                close_price=row["Close"],
                volume=row["Volume"],
                sma_50=row["SMA_50"],
                sma_200=row["SMA_200"],
                atr=row["ATR"],
            ))

    # Perform batch insert
    if new_entries:
        db.session.bulk_save_objects(new_entries)
        db.session.commit()
        print(f"Inserted {len(new_entries)} new market data records for {symbol}.")
    else:
        print(f"No new market data to update for {symbol}.")


@bp.route('/stocks', methods=['POST', 'GET'])
def add_or_update_stock():

    if request.method == 'POST':
        """
        Adds a new stock if it doesn't exist, updates fundamentals if already present,
        and updates market data efficiently.
        """
        data = request.get_json()
        symbol = data.get('symbol')

        if not symbol:
            return {"error": "Symbol is required"}, 400

        with db.session.begin():  # Ensures atomic transaction
            # Fetch stock data from Yahoo Finance
            stock_data = yf.Ticker(symbol+'.NS')
            stock_info = stock_data.info

            # Check if stock already exists
            stock = Stock.query.filter_by(symbol=symbol).first()

            if stock:
                # Update stock details if they exist
                stock.company_name = stock_info.get('longName', stock.company_name)
                stock.sector = stock_info.get('sector', stock.sector)
                stock.industry = stock_info.get('industry', stock.industry)
                stock.exchange = stock_info.get('exchange', stock.exchange)
                print(f"Updated stock: {symbol}")
            else:
                # Insert new stock
                stock = Stock(
                    symbol=symbol,
                    company_name=stock_info.get('longName', 'Unknown'),
                    sector=stock_info.get('sector', 'Unknown'),
                    industry=stock_info.get('industry', 'Unknown'),
                    exchange=stock_info.get('exchange', 'Unknown')
                )
                db.session.add(stock)
                db.session.flush()  # Get stock_id
                print(f"Inserted new stock: {symbol}")

            # Update or insert fundamentals
            existing_fundamentals = StockFundamentals.query.filter_by(
                stock_id=stock.stock_id, data_date=date.today()
            ).first()

            if existing_fundamentals:
                existing_fundamentals.eps = stock_info.get('trailingEps', existing_fundamentals.eps)
                existing_fundamentals.pe_ratio = stock_info.get('trailingPE', existing_fundamentals.pe_ratio)
                existing_fundamentals.market_cap = stock_info.get('marketCap', existing_fundamentals.market_cap)
                existing_fundamentals.source = 'yahoo'
                print(f"Updated fundamentals for {symbol}")
            else:
                new_fundamentals = StockFundamentals(
                    stock_id=stock.stock_id,
                    eps=stock_info.get('trailingEps', 0.0),
                    pe_ratio=stock_info.get('trailingPE', 0.0),
                    market_cap=stock_info.get('marketCap', 0.0),
                    data_date=date.today(),
                    source='yahoo'
                )
                db.session.add(new_fundamentals)
                print(f"Inserted new fundamentals for {symbol}")

        # After stock & fundamentals are updated, fetch & update market data
        update_market_data(symbol, stock.stock_id)

        return {"message": f"Stock {symbol} and related data updated successfully."}, 200
    
    if request.method == 'GET':
        """
        Retrieve stock details, fundamentals, and historical market data from the database.
        :param symbol: Stock ticker symbol (e.g., "AAPL")
        :return: JSON response containing stock info, fundamentals, and market data.
        """

        symbol = request.args.get('symbol')

        # Fetch stock details
        stock = Stock.query.filter_by(symbol=symbol).first()
        
        if not stock:
            return jsonify({"error": f"Stock '{symbol}' not found."}), 404

        # Fetch latest fundamentals (most recent data_date)
        latest_fundamentals = StockFundamentals.query.filter_by(stock_id=stock.stock_id)\
            .order_by(StockFundamentals.data_date.desc()).first()

        # Fetch market data (latest 100 entries for performance)
        market_data = MarketData.query.filter_by(stock_id=stock.stock_id)\
            .order_by(MarketData.data_date.desc()).limit(100).all()

        # Construct response
        stock_info = {
            "symbol": stock.symbol,
            "company_name": stock.company_name,
            "sector": stock.sector,
            "industry": stock.industry,
            "exchange": stock.exchange
        }

        fundamentals_info = {
            "eps": latest_fundamentals.eps if latest_fundamentals else None,
            "pe_ratio": latest_fundamentals.pe_ratio if latest_fundamentals else None,
            "market_cap": latest_fundamentals.market_cap if latest_fundamentals else None,
            "data_date": latest_fundamentals.data_date.strftime("%Y-%m-%d") if latest_fundamentals else None,
            "source": latest_fundamentals.source if latest_fundamentals else None,
        }

        market_data_list = [{
            "date": entry.data_date.strftime("%Y-%m-%d"),
            "open": float(entry.open_price),
            "high": float(entry.high_price),
            "low": float(entry.low_price),
            "close": float(entry.close_price),
            "volume": int(entry.volume),
            "sma_50": float(entry.sma_50) if entry.sma_50 else None,
            "sma_200": float(entry.sma_200) if entry.sma_200 else None,
            "atr": float(entry.atr) if entry.atr else None
        } for entry in market_data]

        return jsonify({
            "stock": stock_info,
            "fundamentals": fundamentals_info,
            "market_data": market_data_list
        })



@bp.route('/update_stock/<string:symbol>/<string:start_date>', methods=['POST'])
def update_stock(symbol, start_date):
    # Check if additional suffix needs to be added
    add_suffix = request.args.get('add_suffix', 'false').lower() == 'true'
    if add_suffix:
        # Append the suffix for Indian stocks on NSE
        symbol += request.args.get('add_suffix')

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
        market_data_entry = MarketData.query.filter_by(
            stock_id=stock_entry.stock_id, data_date=data_date).first()
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
        # Sleep for 1 second to avoid rate limiting from yfinance
        time.sleep(1)

        symbol = data['symbol']
        add_suffix = data.get('add_suffix', False)
        if add_suffix:
            symbol += data['suffix']
        account_id = data['account_id']  # Account identifier from the request
        quantity = data['quantity']
        transaction_price = data['price']
        transaction_type = data['transaction_type']
        transaction_date_str = data.get(
            'transaction_date', datetime.today().strftime('%Y-%m-%d'))

        try:
            transaction_date = datetime.strptime(
                transaction_date_str, '%Y-%m-%d').date()
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
        update_market_data_old(symbol, transaction_date)

        portfolio = Portfolio.query.filter_by(account_id=account_id).first()
        if not portfolio:
            portfolio = Portfolio(account_id=account_id)
            db.session.add(portfolio)
            db.session.commit()

        # Handle the specific stock in the portfolio
        pstock = PortfolioStocks.query.filter_by(
            portfolio_id=portfolio.portfolio_id, stock_id=stock.stock_id).first()
        if not pstock:
            if transaction_type.lower() == 'sell':
                return jsonify({'error': 'Cannot sell stock not in portfolio'}), 400
            pstock = PortfolioStocks(portfolio_id=portfolio.portfolio_id,
                                     stock_id=stock.stock_id, quantity=0, average_price=0, invested_amount=0)
            db.session.add(pstock)

        # Update quantities based on the transaction type
        if transaction_type.lower() == 'buy':
            total_invested = Decimal(
                pstock.invested_amount) + Decimal((quantity * transaction_price))
            total_quantity = pstock.quantity + quantity
            pstock.average_price = total_invested / total_quantity
        elif transaction_type.lower() == 'sell':
            if pstock.quantity < quantity:
                return jsonify({'error': 'Not enough stock quantity to sell'}), 400
            total_invested = pstock.invested_amount - \
                (quantity * pstock.average_price)
            total_quantity = pstock.quantity - quantity
            pstock.average_price = total_invested / \
                total_quantity if total_quantity > 0 else 0

        pstock.quantity = total_quantity
        pstock.invested_amount = total_invested
        # get the last traded price from the market data with latest price as transaction_date
        # get latest market data for the stock on current date or last available date

        # Fetch the latest available market data price
        market_data = MarketData.query.filter_by(
            stock_id=stock.stock_id).order_by(MarketData.data_date.desc()).first()
        if market_data:
            pstock.last_traded_price = market_data.price
        else:
            pstock.last_traded_price = transaction_price

        # Update the valuation for the portfolio
        valuation = Valuation.query.filter_by(
            portfolio_id=portfolio.portfolio_id).first()
        if not valuation:
            valuation = Valuation(
                portfolio_id=portfolio.portfolio_id, valuation_date=datetime.now())
            db.session.add(valuation)

        total_portfolio_value = sum(Decimal(ps.quantity) * Decimal(ps.last_traded_price)
                                    for ps in PortfolioStocks.query.filter_by(portfolio_id=portfolio.portfolio_id))
        total_invested_portfolio = sum(Decimal(
            ps.invested_amount) for ps in PortfolioStocks.query.filter_by(portfolio_id=portfolio.portfolio_id))

        valuation.current_value = total_portfolio_value
        valuation.unrealized_pnl = total_portfolio_value - total_invested_portfolio
        valuation.unrealized_pnl_pct = ((total_portfolio_value - total_invested_portfolio) /
                                        total_invested_portfolio * 100) if total_invested_portfolio != 0 else 0
        valuation.valuation_date = datetime.now()

        # Record the transaction
        transaction = Transaction(stock_id=stock.stock_id, account_id=account_id, quantity=quantity,
                                  price=transaction_price, transaction_type=transaction_type, transaction_date=transaction_date)
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


def update_market_data_old(symbol, start_date):
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
            # Skip days for which yfinance did not return data (e.g., weekends, holidays)
            continue

        day_data = hist[hist.index.normalize().date == single_date]

        if day_data.empty:
            continue  # Skip if no data is available for this day

        # In case of duplicates, take the first one
        day_data = day_data.iloc[0]

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

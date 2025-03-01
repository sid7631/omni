from flask_sqlalchemy import SQLAlchemy
from datetime import date

db = SQLAlchemy()

### 📌 STOCK TABLE (Tracks Stocks and Their Market Info)
class Stock(db.Model):
    __tablename__ = "stocks"
    
    stock_id = db.Column(db.Integer, primary_key=True)
    symbol = db.Column(db.String(255), unique=True, nullable=False, index=True)
    company_name = db.Column(db.String(255), nullable=False)
    sector = db.Column(db.String(255))  # Categorization
    industry = db.Column(db.String(255))  # Industry Classification
    exchange = db.Column(db.String(100))  # NYSE, NASDAQ, etc.

    # Relationships
    transactions = db.relationship("Transaction", backref="stock", lazy=True)
    portfolio_stocks = db.relationship("PortfolioStocks", backref="stock", lazy=True)
    market_data = db.relationship("MarketData", backref="stock", lazy=True)
    fundamentals = db.relationship("StockFundamentals", backref="stock", lazy=True)


### 📌 ACCOUNT TABLE (Holds Trading Accounts)
class Account(db.Model):
    __tablename__ = "accounts"
    
    account_id = db.Column(db.Integer, primary_key=True)
    account_name = db.Column(db.String(255), nullable=False)
    account_type = db.Column(db.String(100), nullable=False)  # Cash, Margin, Retirement, etc.
    created_at = db.Column(db.Date, default=date.today)

    # Relationships
    transactions = db.relationship("Transaction", backref="account", lazy=True)
    portfolios = db.relationship("Portfolio", backref="account", lazy=True)


### 📌 TRANSACTIONS TABLE (Unchanged from Original)
class Transaction(db.Model):
    __tablename__ = "transactions"
    
    transaction_id = db.Column(db.Integer, primary_key=True)
    stock_id = db.Column(db.Integer, db.ForeignKey("stocks.stock_id"), nullable=False)
    account_id = db.Column(db.Integer, db.ForeignKey("accounts.account_id"), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    price = db.Column(db.Numeric(10, 2), nullable=False)
    transaction_type = db.Column(db.String(50), nullable=False)  # Buy/Sell
    transaction_date = db.Column(db.Date, default=date.today, nullable=False)


### 📌 PORTFOLIO TABLE (Now Includes Risk & Strategy)
class Portfolio(db.Model):
    __tablename__ = "portfolio"
    
    portfolio_id = db.Column(db.Integer, primary_key=True)
    account_id = db.Column(db.Integer, db.ForeignKey("accounts.account_id"), nullable=False)
    risk_profile = db.Column(db.String(50))  # Low, Medium, High
    strategy = db.Column(db.String(100))  # Growth, Value, Index, etc.

    # Relationships
    portfolio_stocks = db.relationship("PortfolioStocks", backref="portfolio", lazy=True)
    valuations = db.relationship("Valuation", backref="portfolio", lazy=True)


### 📌 PORTFOLIO STOCKS (Many-to-Many Between Portfolio & Stocks)
class PortfolioStocks(db.Model):
    __tablename__ = "portfolio_stocks"

    id = db.Column(db.Integer, primary_key=True)
    portfolio_id = db.Column(db.Integer, db.ForeignKey("portfolio.portfolio_id"), nullable=False)
    stock_id = db.Column(db.Integer, db.ForeignKey("stocks.stock_id"), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    average_price = db.Column(db.Numeric(10, 2), nullable=False)
    last_traded_price = db.Column(db.Numeric(10, 2), nullable=False)
    invested_amount = db.Column(db.Numeric(14, 2), nullable=False)
    record_date = db.Column(db.Date, default=date.today, nullable=False, index=True)  # Tracks holding history



### 📌 VALUATION TABLE (Tracks Portfolio Performance)
class Valuation(db.Model):
    __tablename__ = "valuations"
    
    valuation_id = db.Column(db.Integer, primary_key=True)
    portfolio_id = db.Column(db.Integer, db.ForeignKey("portfolio.portfolio_id"), nullable=False)
    current_value = db.Column(db.Numeric(14, 2), nullable=False)
    unrealized_pnl = db.Column(db.Numeric(14, 2), nullable=False)
    unrealized_pnl_pct = db.Column(db.Numeric(5, 2), nullable=False)
    valuation_date = db.Column(db.Date, default=date.today, nullable=False)


### 📌 MARKET DATA TABLE (Now Includes OHLC & Volume)
class MarketData(db.Model):
    __tablename__ = "market_data"

    data_id = db.Column(db.Integer, primary_key=True)
    stock_id = db.Column(db.Integer, db.ForeignKey("stocks.stock_id"), nullable=False)
    open_price = db.Column(db.Numeric(10, 2))
    high_price = db.Column(db.Numeric(10, 2))
    low_price = db.Column(db.Numeric(10, 2))
    close_price = db.Column(db.Numeric(10, 2))
    volume = db.Column(db.BigInteger)
    sma_50 = db.Column(db.Numeric(10, 2))  # 50-day Simple Moving Average
    sma_200 = db.Column(db.Numeric(10, 2))  # 200-day SMA
    atr = db.Column(db.Numeric(10, 2))  # Average True Range for Volatility
    data_date = db.Column(db.Date, default=date.today, nullable=False)



### 📌 STOCK FUNDAMENTALS TABLE (Stores Financial Metrics Separately)
class StockFundamentals(db.Model):
    __tablename__ = "stock_fundamentals"

    id = db.Column(db.Integer, primary_key=True)
    stock_id = db.Column(db.Integer, db.ForeignKey("stocks.stock_id"), nullable=False)
    eps = db.Column(db.Numeric(10, 2), nullable=False)
    pe_ratio = db.Column(db.Numeric(10, 2), nullable=False)
    market_cap = db.Column(db.Numeric(20, 2), nullable=False)
    data_date = db.Column(db.Date, default=date.today, nullable=False)
    source = db.Column(db.String(100), nullable=False)  # Tracks data provider (Yahoo, Bloomberg, etc.)

class CashTransaction(db.Model):
    __tablename__ = "cash_transactions"

    id = db.Column(db.Integer, primary_key=True)
    account_id = db.Column(db.Integer, db.ForeignKey("accounts.account_id"), nullable=False)
    transaction_type = db.Column(db.String(50), nullable=False)  # Deposit, Withdrawal, Dividend
    amount = db.Column(db.Numeric(14, 2), nullable=False)
    transaction_date = db.Column(db.Date, default=date.today, nullable=False)


class AccountPerformance(db.Model):
    __tablename__ = "account_performance"

    id = db.Column(db.Integer, primary_key=True)
    account_id = db.Column(db.Integer, db.ForeignKey("accounts.account_id"), nullable=False)
    date = db.Column(db.Date, default=date.today, nullable=False, index=True)
    portfolio_value = db.Column(db.Numeric(14, 2), nullable=False)
    invested_amount = db.Column(db.Numeric(14, 2), nullable=False)
    cash_balance = db.Column(db.Numeric(14, 2), nullable=False)
    xirr = db.Column(db.Numeric(10, 4))  # Annualized XIRR Value
    benchmark_return = db.Column(db.Numeric(10, 2))  # Performance vs. Index (e.g., S&P 500)





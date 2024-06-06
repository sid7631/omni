from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Stock(db.Model):
    __tablename__ = 'stocks'
    stock_id = db.Column(db.Integer, primary_key=True)
    symbol = db.Column(db.String(255))
    company_name = db.Column(db.String(255))

class Transaction(db.Model):
    __tablename__ = 'transactions'
    transaction_id = db.Column(db.Integer, primary_key=True)
    stock_id = db.Column(db.Integer, db.ForeignKey('stocks.stock_id'))
    account_id = db.Column(db.Integer, db.ForeignKey('accounts.account_id'))  # Reference to Account
    quantity = db.Column(db.Integer)
    price = db.Column(db.Numeric(10, 2))
    transaction_type = db.Column(db.String(50))
    transaction_date = db.Column(db.Date)

class Account(db.Model):
    __tablename__ = 'accounts'
    account_id = db.Column(db.Integer, primary_key=True)
    account_name = db.Column(db.String(255))
    account_type = db.Column(db.String(100))

class Portfolio(db.Model):
    __tablename__ = 'portfolio'
    portfolio_id = db.Column(db.Integer, primary_key=True)
    account_id = db.Column(db.Integer, db.ForeignKey('accounts.account_id'))

class PortfolioStocks(db.Model):
    __tablename__ = 'portfolio_stocks'
    id = db.Column(db.Integer, primary_key=True)
    portfolio_id = db.Column(db.Integer, db.ForeignKey('portfolio.portfolio_id'))
    stock_id = db.Column(db.Integer, db.ForeignKey('stocks.stock_id'))
    quantity = db.Column(db.Integer)
    average_price = db.Column(db.Numeric(10, 2))
    last_traded_price = db.Column(db.Numeric(10, 2))
    invested_amount = db.Column(db.Numeric(14, 2))

class Valuation(db.Model):
    __tablename__ = 'valuations'
    valuation_id = db.Column(db.Integer, primary_key=True)
    portfolio_id = db.Column(db.Integer, db.ForeignKey('portfolio.portfolio_id'))
    current_value = db.Column(db.Numeric(14, 2))
    unrealized_pnl = db.Column(db.Numeric(14, 2))
    unrealized_pnl_pct = db.Column(db.Numeric(5, 2))
    valuation_date = db.Column(db.Date)

class MarketData(db.Model):
    __tablename__ = 'market_data'
    data_id = db.Column(db.Integer, primary_key=True)
    stock_id = db.Column(db.Integer, db.ForeignKey('stocks.stock_id'))
    price = db.Column(db.Numeric(10, 2))
    eps = db.Column(db.Numeric(10, 2))
    pe_ratio = db.Column(db.Numeric(10, 2))
    market_cap = db.Column(db.Numeric(20, 2))
    data_date = db.Column(db.Date)

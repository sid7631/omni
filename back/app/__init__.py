from flask import Flask
from app.models.models import db
from app.config.config import Config
from app.api import bp as api
import requests_cache
import psycopg2
from flask_cors import CORS

def create_database_if_not_exists():
    """Create the database if it doesn't exist."""
    config = Config()
    db_url = config.SQLALCHEMY_DATABASE_URI
    db_name = db_url.rsplit('/', 1)[-1]  # Extract database name

    # Remove database name from the connection string to connect to `postgres`
    base_db_url = db_url.rsplit('/', 1)[0] + '/postgres'

    try:
        conn = psycopg2.connect(base_db_url)
        conn.autocommit = True
        cursor = conn.cursor()
        cursor.execute(f"SELECT 1 FROM pg_database WHERE datname = '{db_name}'")
        exists = cursor.fetchone()
        if not exists:
            cursor.execute(f'CREATE DATABASE {db_name}')
            print(f"Database '{db_name}' created successfully.")
        cursor.close()
        conn.close()
    except Exception as e:
        print(f"Error while checking/creating database: {e}")


def create_app():
    requests_cache.install_cache(
    'yfinance.cache', backend='sqlite', expire_after=3600)
    app = Flask(__name__)
    app.config.from_object(Config)

    create_database_if_not_exists()

    db.init_app(app)

    with app.app_context():
        if not db.engine.table_names():
            db.create_all()

    app.register_blueprint(api, url_prefix='/api/v3')

    CORS(app,resources={r"/api/*": {"origins": "http://localhost:3001"}}, supports_credentials=True)

    return app

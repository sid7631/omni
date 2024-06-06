from flask import Flask
from app.models.models import db
from app.config.config import Config
from app.api import bp as api
import requests_cache

def create_app():
    requests_cache.install_cache(
    'yfinance.cache', backend='sqlite', expire_after=3600)
    app = Flask(__name__)
    app.config.from_object(Config)
    db.init_app(app)

    with app.app_context():
        db.create_all()

    app.register_blueprint(api, url_prefix='/api/v3')
    return app

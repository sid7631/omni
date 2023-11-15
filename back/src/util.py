import os
from src.context import config, context

import os
import jwt
import datetime
from functools import wraps
from flask import current_app

def instance_id():
    """
    Returns the instance ID.

    Returns:
        str: The instance ID, which is either 'OMNI' if the environment is a development environment, or the value of the 'HOSTNAME' environment variable.
    """
    return 'OMNI' if config().dev_env else os.environ['HOSTNAME']

def generate_token(username):
    expiration_time = datetime.datetime.utcnow() + datetime.timedelta(hours=1)
    payload = {'username': username, 'exp': expiration_time}
    token = jwt.encode(payload, current_app.config['SECRET_KEY'], algorithm='HS256')
    return token

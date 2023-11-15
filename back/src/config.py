import os
import subprocess

class Config:
    def __init__(self):
        self.initialized = False
        self.dev_env = os.environ.get('DEV_ENV') and True or False

        self.app_id = 'omni'
        self.pg_dbname = os.environ.get('PG_DB_NAME') or 'omni'

    def load(self):
        self.pg_host = os.environ.get('PG_HOST') 
        self.pg_port = os.environ.get('PG_PORT')
        self.pg_user = os.environ.get('PG_USER')
        self.pg_password = os.environ.get('PG_PASSWORD')

        self.redis_host = os.environ.get('REDIS_HOST') or 'host.docker.internal'
        self.redis_port = os.environ.get('REDIS_PORT') or '6379'
        self.redis_password = os.environ.get('REDIS_PASSWORD') or 'omni'

        self.initialized = True
        print('Config initialized.')
    
    
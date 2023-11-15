from src.db import Database

from src.context import config, context
import psycopg2
from pathlib import Path
from datetime import datetime, timedelta
from src.util import instance_id
import psycopg2.extras as extras
from psycopg2.extras import RealDictCursor
import pandas as pd
from werkzeug.security import generate_password_hash, check_password_hash

db_schema_version = '11'

from pathlib import Path


def load_sql(fname):
    """
    Load the content of a SQL file.

    Parameters:
        fname (str): The name of the SQL file to load.

    Returns:
        str: The content of the SQL file.
    """
    file_path = Path(__file__).with_name(fname)
    with file_path.open('r') as file:
        return file.read()

class PgDatabase(Database):
    _instance = None

    def __init__(self) -> None:
        super().__init__()
        PgDatabase._instance = self
    

    def init(self):
        config = context().config
        self.connection_db()
        self.init_tables()

            
    def connection_db(self):
        print('Connecting to the database...')
        config = context().config
        try:
            self.connection = psycopg2.connect(
                dbname=config.pg_dbname,
                user=config.pg_user,
                password=config.pg_password,
                host=config.pg_host,
                port=config.pg_port
            )
            self.cursor = self.connection.cursor()
            print('Connected to the database.')
        except Exception as e:
            print(f'Error: Unable to connect to the database. {e}')
        
    def init_tables(self):
        if self.connection is None:
            self.connection_db()
        try:
            self.cursor.execute(
                "SELECT value FROM omni.system_data WHERE name = 'SchemaVersion'"
            )
            version = self.cursor.fetchone()[0]
        except Exception as e:
            version = '0'

        if version != db_schema_version:
            print('Creating Postgres tables')
            self.connection.rollback()
            sql = load_sql('tables.sql').replace(
                '{schemaVersion}',
                db_schema_version
            ).replace(
                '{createdOn}',
                str(datetime.utcnow())
            )
            self.cursor.execute(sql)
            self.connection.commit()
            print('Table initialised successfully')


    def insert_into_db(self, query, data):
        if self.connection is None:
            self.connection_db()
        
        try:
            self.cursor = self.connection.cursor()
            with self.cursor as cursor:
                extras.execute_values(cursor, query, data)
            self.connection.commit()
            print('data inserted into db successfully')
            return True
        except (Exception, psycopg2.DatabaseError) as error:
            print(f"Error: {error}")
            self.connection.rollback()
            self.cursor.close()
            self.connection = None
            return False
    
    def select_from_db(self, query, cursor_factory=None, as_dataframe=False):
        if self.connection is None:
            self.connection_db()
        try:
            if as_dataframe:
                return pd.read_sql(query, con=self.connection)
            
            cursor = self.connection.cursor(cursor_factory=cursor_factory)
            cursor.execute(query)
            data = cursor.fetchall()
            return data
        except (Exception, psycopg2.DatabaseError) as error:
            print(f"Error: {error}")
            self.connection.rollback()
            cursor.close()
            self.connection = None
            return []
        
    def insert_user(self, username, email, password):
        
        hashed_password = generate_password_hash(password)

        columns = ['username', 'email', 'password']
        cols = ','.join(columns)
        query = "INSERT INTO %s(%s) VALUES %%s" % ('omni.users', cols)
        data = [(username, email, hashed_password)]

        if self.connection == None:
            self.connection_db()
        try:
            self.insert_into_db(query, data)
            print('User inserted into table users successfully')
        except (Exception, psycopg2.DatabaseError) as error:
            print(f"Error: {error}")
            self.connection.rollback()
            self.cursor.close()
            self.connection = None
        
    def validate_username_password(self, username, password):
        query = "SELECT * FROM omni.users WHERE username = %s"
        data = (username,)
        if self.connection == None:
            self.connection_db()
        try:
            self.cursor.execute(query, data)
            user = self.cursor.fetchone()
            if user and check_password_hash(user[3], password):
                response = {
                    'id': user[0],
                    'username': user[1],
                    'email': user[2],
                    'cliendId': user[4],
                    'full_name': user[5],
                    'birthdate': user[6]
                }
                return True, response
            else:
                return False, {}
        except (Exception, psycopg2.DatabaseError) as error:
            print(f"Error: {error}")
            self.connection.rollback()
            self.cursor.close()
            self.connection = None
            return False, data
        
    def select_all_from_bank_accounts(self):
        if self.connection == None:
            self.connection_db()
        try:
            query = "SELECT * FROM omni.bank_accounts"
            cursor = self.connection.cursor(cursor_factory=RealDictCursor)
            cursor.execute(query)
            data = cursor.fetchall()
            cursor.close()
            return data
        except (Exception, psycopg2.DatabaseError) as error:
            print(f"Error: {error}")
            self.connection.rollback()
            cursor.close()
            self.connection = None
            return []
         


    def reset(self):
        sql = 'DROP SCHEMA IF EXISTS omni CASCADE'
        self.cursor.execute(sql)
    
    def close(self):
        self.cursor.close()
        self.connection.close()
        self.cursor = None
        self.connection = None
import os

class Config:
    SQLALCHEMY_DATABASE_URI = 'postgresql://postgres:postgres@localhost/omni'
    SQLALCHEMY_TRACK_MODIFICATIONS = False

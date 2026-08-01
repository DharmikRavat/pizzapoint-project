import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SECRET_KEY = os.getenv('SECRET_KEY', 'default-secret-key')
    SQLALCHEMY_DATABASE_URI = os.getenv('SQLALCHEMY_DATABASE_URI', 'sqlite:///mahadev_pizza.db')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY', 'default-jwt-secret-key')
    JWT_ACCESS_TOKEN_EXPIRES = 3600  # 1 hour
    JWT_REFRESH_TOKEN_EXPIRES = 2592000  # 30 days
    DEBUG = os.getenv('FLASK_DEBUG', '0') == '1'

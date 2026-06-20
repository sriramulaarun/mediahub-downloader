import os
from datetime import timedelta

class Config:
    # Basic Flask Settings
    SECRET_KEY = os.environ.get('SECRET_KEY', 'mediahub-super-secret-dev-key')
    
    # Database Settings
    # Supports SQLite local development, and automatically falls back to PostgreSQL on Railway
    BASE_DIR = os.path.abspath(os.path.dirname(__file__))
    DB_PATH = os.path.abspath(os.path.join(BASE_DIR, '..', 'database', 'mediahub.db'))
    
    # Ensure database folder exists
    os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)
    
    SQLALCHEMY_DATABASE_URI = os.environ.get(
        'DATABASE_URL', 
        f'sqlite:///{DB_PATH}'
    )
    # Fix for Heroku/Railway DATABASE_URL using "postgres://" instead of "postgresql://"
    if SQLALCHEMY_DATABASE_URI.startswith("postgres://"):
        SQLALCHEMY_DATABASE_URI = SQLALCHEMY_DATABASE_URI.replace("postgres://", "postgresql://", 1)
        
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # JWT Settings
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY', 'jwt-mediahub-secret-key')
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(days=7)
    
    # File Download Settings
    DOWNLOAD_FOLDER = os.environ.get(
        'DOWNLOAD_FOLDER', 
        os.path.join(BASE_DIR, 'downloads')
    )
    
    # Cleanup Scheduler Settings
    CLEANUP_INTERVAL_SECONDS = 60
    MAX_FILE_AGE_SECONDS = 600  # Delete downloads older than 10 minutes
    
    # Ensure downloads folder exists
    os.makedirs(DOWNLOAD_FOLDER, exist_ok=True)

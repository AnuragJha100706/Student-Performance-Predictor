import os

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'super-secret-key-change-this'
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY') or 'jwt-secret-key-change-this'
    DATA_FOLDER = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'data')
    MODELS_FOLDER = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'models')
    UPLOAD_FOLDER = os.path.join(DATA_FOLDER, 'datasets')
    
    # Ensure directories exist
    os.makedirs(DATA_FOLDER, exist_ok=True)
    os.makedirs(MODELS_FOLDER, exist_ok=True)
    os.makedirs(UPLOAD_FOLDER, exist_ok=True)

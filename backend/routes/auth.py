from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token
import bcrypt
import os
from utils.csv_utils import read_csv, append_row, init_csv
from config import Config

auth_bp = Blueprint('auth', __name__)
USERS_FILE = os.path.join(Config.DATA_FOLDER, 'users.csv')

# Initialize users file
init_csv(USERS_FILE, ['username', 'password'])

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({"msg": "Username and password required"}), 400

    users_df = read_csv(USERS_FILE)
    if not users_df.empty and username in users_df['username'].values:
        return jsonify({"msg": "Username already exists"}), 400

    hashed = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    
    append_row({'username': username, 'password': hashed}, USERS_FILE)
    
    return jsonify({"msg": "User registered successfully"}), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    users_df = read_csv(USERS_FILE)
    if users_df.empty:
        return jsonify({"msg": "Invalid credentials"}), 401

    user_row = users_df[users_df['username'] == username]
    if user_row.empty:
        return jsonify({"msg": "Invalid credentials"}), 401

    stored_hash = user_row.iloc[0]['password']
    if bcrypt.checkpw(password.encode('utf-8'), stored_hash.encode('utf-8')):
        access_token = create_access_token(identity=username)
        return jsonify(access_token=access_token), 200
    else:
        return jsonify({"msg": "Invalid credentials"}), 401

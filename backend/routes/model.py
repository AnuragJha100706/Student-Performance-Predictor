from flask import Blueprint, request, jsonify
import os
import json
import pandas as pd
from utils.ml_utils import train_model
from utils.csv_utils import read_csv, append_row, init_csv, write_csv
from config import Config

model_bp = Blueprint('model', __name__)
MODELS_CSV = os.path.join(Config.DATA_FOLDER, 'models.csv')

# Initialize models.csv
init_csv(MODELS_CSV, ['model_id', 'algorithm', 'hyperparams', 'metrics', 'filepath', 'timestamp', 'rules', 'feature_importance'])

@model_bp.route('/train', methods=['POST'])
def train():
    data = request.get_json()
    dataset_name = data.get('dataset')
    algorithm = data.get('algorithm')
    hyperparams = data.get('hyperparams', {})
    
    if not dataset_name or not algorithm:
        return jsonify({"msg": "Dataset and algorithm are required"}), 400
        
    dataset_path = os.path.join(Config.UPLOAD_FOLDER, dataset_name)
    if not os.path.exists(dataset_path):
        return jsonify({"msg": "Dataset not found"}), 404
        
    try:
        result = train_model(dataset_path, algorithm, hyperparams)
        append_row(result, MODELS_CSV)
        return jsonify(result), 201
    except Exception as e:
        return jsonify({"msg": str(e)}), 500

@model_bp.route('/list', methods=['GET'])
def list_models():
    df = read_csv(MODELS_CSV)
    if df.empty:
        return jsonify([]), 200
    
    # Replace NaN with None to ensure valid JSON
    df = df.astype(object).where(pd.notnull(df), None)
    
    # Parse JSON strings back to objects for the response
    models = df.to_dict(orient='records')
    for m in models:
        try:
            m['hyperparams'] = json.loads(m['hyperparams'])
            m['metrics'] = json.loads(m['metrics'])
            if m.get('feature_importance'):
                m['feature_importance'] = json.loads(m['feature_importance'])
        except:
            pass
    return jsonify(models), 200

@model_bp.route('/delete/<model_id>', methods=['DELETE'])
def delete_model(model_id):
    try:
        df = read_csv(MODELS_CSV)
        if df.empty:
            return jsonify({"msg": "Model not found"}), 404
            
        # Find model to delete
        model_row = df[df['model_id'] == model_id]
        if model_row.empty:
            return jsonify({"msg": "Model not found"}), 404
            
        # Delete file
        filename = model_row.iloc[0]['filepath']
        file_path = os.path.join(Config.MODELS_FOLDER, filename)
        if os.path.exists(file_path):
            os.remove(file_path)
            
        # Remove from CSV
        df = df[df['model_id'] != model_id]
        write_csv(df, MODELS_CSV, mode='w')
        
        return jsonify({"msg": "Model deleted successfully"}), 200
    except Exception as e:
        return jsonify({"msg": str(e)}), 500

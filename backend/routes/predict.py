from flask import Blueprint, request, jsonify
import os
import pandas as pd
from datetime import datetime
from utils.ml_utils import load_model, predict_single
from utils.csv_utils import read_csv, append_row, init_csv, write_csv
from config import Config

predict_bp = Blueprint('predict', __name__)
PREDICTIONS_CSV = os.path.join(Config.DATA_FOLDER, 'predictions.csv')

# Initialize predictions.csv
# Columns: timestamp, model_id, input_data (json), prediction, probability
init_csv(PREDICTIONS_CSV, ['timestamp', 'model_id', 'input_data', 'prediction', 'probability'])

@predict_bp.route('/', methods=['POST'])
def predict():
    data = request.get_json()
    model_id = data.get('model_id')
    input_data = data.get('input_data')
    save = data.get('save', False)
    
    if not model_id or not input_data:
        return jsonify({"msg": "Model ID and input data required"}), 400
        
    # Find model filename from models.csv
    models_df = read_csv(os.path.join(Config.DATA_FOLDER, 'models.csv'))
    if models_df.empty:
        return jsonify({"msg": "No models found"}), 404
        
    model_row = models_df[models_df['model_id'] == model_id]
    if model_row.empty:
        return jsonify({"msg": "Model not found"}), 404
        
    model_filename = model_row.iloc[0]['filepath']
    
    try:
        model = load_model(model_filename)
        prediction, probability = predict_single(model, input_data)
        
        result = {
            'timestamp': datetime.now().isoformat(),
            'model_id': model_id,
            'input_data': str(input_data),
            'prediction': prediction,
            'probability': probability
        }
        
        if save:
            append_row(result, PREDICTIONS_CSV)
            
        return jsonify(result), 200
    except Exception as e:
        return jsonify({"msg": str(e)}), 500

@predict_bp.route('/batch', methods=['POST'])
def batch_predict():
    if 'file' not in request.files:
        return jsonify({"msg": "No file part"}), 400
    file = request.files['file']
    model_id = request.form.get('model_id')
    
    if not model_id:
        return jsonify({"msg": "Model ID required"}), 400
        
    # Find model
    models_df = read_csv(os.path.join(Config.DATA_FOLDER, 'models.csv'))
    model_row = models_df[models_df['model_id'] == model_id]
    if model_row.empty:
        return jsonify({"msg": "Model not found"}), 404
    model_filename = model_row.iloc[0]['filepath']
    
    try:
        model = load_model(model_filename)
        # Use sep=None to auto-detect separator
        df = pd.read_csv(file, sep=None, engine='python')
        
        # Predict
        # Ensure columns match. Pipeline handles it usually if names match.
        predictions = model.predict(df)
        probabilities = model.predict_proba(df).max(axis=1) if hasattr(model, 'predict_proba') else [0]*len(df)
        
        df['prediction'] = predictions
        df['probability'] = probabilities
        
        # Sanitize
        df = df.astype(object).where(pd.notnull(df), None)
        
        # Return as JSON
        return jsonify(df.to_dict(orient='records')), 200
    except Exception as e:
        return jsonify({"msg": str(e)}), 500

@predict_bp.route('/history', methods=['GET'])
def history():
    df = read_csv(PREDICTIONS_CSV)
    if df.empty:
        return jsonify([]), 200
    
    # Replace NaN with None
    df = df.astype(object).where(pd.notnull(df), None)
    
    return jsonify(df.to_dict(orient='records')), 200

@predict_bp.route('/feedback', methods=['POST'])
def feedback():
    data = request.get_json()
    timestamp = data.get('timestamp')
    model_id = data.get('model_id')
    actual_result = data.get('actual_result')
    
    if not timestamp or not model_id or actual_result is None:
        return jsonify({"msg": "Missing data"}), 400
        
    # We need to find the row in predictions.csv and update it
    # Since we don't have a unique ID for predictions other than timestamp+model_id (which might not be unique enough if high traffic)
    # But for this project, timestamp is likely unique enough or we just append to a feedback.csv
    
    # Let's append to feedback.csv for simplicity and robustness
    FEEDBACK_CSV = os.path.join(Config.DATA_FOLDER, 'feedback.csv')
    init_csv(FEEDBACK_CSV, ['timestamp', 'model_id', 'actual_result', 'feedback_time'])
    
    feedback_entry = {
        'timestamp': timestamp,
        'model_id': model_id,
        'actual_result': actual_result,
        'feedback_time': datetime.now().isoformat()
    }
    
    try:
        append_row(feedback_entry, FEEDBACK_CSV)
        return jsonify({"msg": "Feedback received"}), 200
    except Exception as e:
        return jsonify({"msg": str(e)}), 500

from flask import Blueprint, request, jsonify
import os
import pandas as pd
from werkzeug.utils import secure_filename
from config import Config
from utils.csv_utils import read_csv

dataset_bp = Blueprint('dataset', __name__)

@dataset_bp.route('/upload', methods=['POST'])
def upload_dataset():
    if 'file' not in request.files:
        return jsonify({"msg": "No file part"}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({"msg": "No selected file"}), 400
    
    if file and file.filename.endswith('.csv'):
        filename = secure_filename(file.filename)
        filepath = os.path.join(Config.UPLOAD_FOLDER, filename)
        file.save(filepath)
        return jsonify({"msg": "File uploaded successfully", "filename": filename}), 201
    else:
        return jsonify({"msg": "Only CSV files are allowed"}), 400

@dataset_bp.route('/list', methods=['GET'])
def list_datasets():
    files = [f for f in os.listdir(Config.UPLOAD_FOLDER) if f.endswith('.csv')]
    return jsonify(files), 200

@dataset_bp.route('/preview/<filename>', methods=['GET'])
def preview_dataset(filename):
    filepath = os.path.join(Config.UPLOAD_FOLDER, secure_filename(filename))
    if not os.path.exists(filepath):
        return jsonify({"msg": "File not found"}), 404
    
    try:
        # Use sep=None to auto-detect separator
        df = pd.read_csv(filepath, sep=None, engine='python')
        # Sanitize preview
        preview_df = df.head(10).astype(object).where(pd.notnull(df.head(10)), None)
        preview = preview_df.to_dict(orient='records')
        
        # Sanitize description
        desc_df = df.describe()
        desc_df = desc_df.astype(object).where(pd.notnull(desc_df), None)
        
        stats = {
            "rows": len(df),
            "columns": list(df.columns),
            "description": desc_df.to_dict()
        }
        
        # Class distribution for G3 if exists
        if 'G3' in df.columns:
            stats['class_distribution'] = df['G3'].value_counts().to_dict()
            
        return jsonify({"preview": preview, "stats": stats}), 200
    except Exception as e:
        return jsonify({"msg": str(e)}), 500

@dataset_bp.route('/correlation/<filename>', methods=['GET'])
def get_correlation(filename):
    filepath = os.path.join(Config.UPLOAD_FOLDER, secure_filename(filename))
    if not os.path.exists(filepath):
        return jsonify({"msg": "File not found"}), 404
    
    try:
        df = pd.read_csv(filepath, sep=None, engine='python')
        
        # Select only numeric columns for correlation
        numeric_df = df.select_dtypes(include=['number'])
        
        if numeric_df.empty:
            return jsonify({"msg": "No numeric columns found for correlation"}), 400
            
        corr_matrix = numeric_df.corr().round(2)
        
        # Replace NaN with None for JSON serialization
        corr_matrix = corr_matrix.where(pd.notnull(corr_matrix), None)
        
        data = {
            "columns": list(corr_matrix.columns),
            "values": corr_matrix.values.tolist()
        }
        
        return jsonify(data), 200
    except Exception as e:
        return jsonify({"msg": str(e)}), 500

@dataset_bp.route('/distributions/<filename>', methods=['GET'])
def get_distributions(filename):
    filepath = os.path.join(Config.UPLOAD_FOLDER, secure_filename(filename))
    if not os.path.exists(filepath):
        return jsonify({"msg": "File not found"}), 404
    
    try:
        df = pd.read_csv(filepath, sep=None, engine='python')
        
        distributions = {}
        
        # Categorical columns to analyze
        categorical_cols = ['sex', 'address', 'famsize', 'Pstatus', 'Mjob', 'Fjob', 'reason', 'guardian', 'schoolsup', 'famsup', 'paid', 'activities', 'nursery', 'higher', 'internet', 'romantic']
        # Numeric columns to analyze
        numeric_cols = ['age', 'Medu', 'Fedu', 'traveltime', 'studytime', 'failures', 'famrel', 'freetime', 'goout', 'Dalc', 'Walc', 'health', 'absences', 'G1', 'G2', 'G3']
        
        for col in categorical_cols:
            if col in df.columns:
                distributions[col] = df[col].value_counts().to_dict()
                
        for col in numeric_cols:
            if col in df.columns:
                # For numeric, we might want bins or just counts if discrete enough
                if df[col].nunique() < 20:
                    distributions[col] = df[col].value_counts().sort_index().to_dict()
                else:
                    # For continuous, maybe just basic stats or histogram bins?
                    # Let's just return value counts for now, frontend can handle or we limit
                    distributions[col] = df[col].value_counts(bins=10).sort_index().to_dict()
                    # Convert Interval index to string
                    distributions[col] = {str(k): v for k, v in distributions[col].items()}

        return jsonify(distributions), 200
    except Exception as e:
        return jsonify({"msg": str(e)}), 500

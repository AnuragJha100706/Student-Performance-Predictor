import joblib
import os
import json
import pandas as pd
from sklearn.tree import DecisionTreeClassifier, export_text
from sklearn.naive_bayes import GaussianNB
from sklearn.linear_model import LogisticRegression
from sklearn.svm import SVC
from sklearn.pipeline import Pipeline
from sklearn.model_selection import cross_validate
from sklearn.metrics import accuracy_score, precision_score, recall_score, confusion_matrix, roc_auc_score
from .preprocessing import get_preprocessor, prepare_data
from config import Config
from datetime import datetime

def get_model_instance(algorithm, hyperparams):
    if algorithm == 'Decision Tree':
        return DecisionTreeClassifier(**hyperparams)
    elif algorithm == 'Naive Bayes':
        return GaussianNB(**hyperparams) # NB doesn't take many params usually
    elif algorithm == 'Logistic Regression':
        return LogisticRegression(**hyperparams, max_iter=1000)
    elif algorithm == 'SVM':
        return SVC(**hyperparams, probability=True)
    else:
        raise ValueError(f"Unknown algorithm: {algorithm}")

def train_model(dataset_path, algorithm, hyperparams):
    # Use sep=None to auto-detect separator (e.g. ; vs ,)
    df = pd.read_csv(dataset_path, sep=None, engine='python')
    X, y = prepare_data(df)
    
    preprocessor = get_preprocessor(X)
    clf = get_model_instance(algorithm, hyperparams)
    
    pipeline = Pipeline(steps=[('preprocessor', preprocessor),
                               ('classifier', clf)])
    
    # Cross-validation
    scoring = ['accuracy', 'precision', 'recall', 'roc_auc']
    cv_results = cross_validate(pipeline, X, y, cv=5, scoring=scoring)
    
    # Train on full dataset for saving
    pipeline.fit(X, y)
    
    # Metrics
    metrics = {
        'accuracy': cv_results['test_accuracy'].mean(),
        'precision': cv_results['test_precision'].mean(),
        'recall': cv_results['test_recall'].mean(),
        'roc_auc': cv_results['test_roc_auc'].mean()
    }
    
    # Generate Model ID and Path
    model_id = f"{algorithm.replace(' ', '_')}_{datetime.now().strftime('%Y%m%d%H%M%S')}"
    model_filename = f"{model_id}.joblib"
    model_path = os.path.join(Config.MODELS_FOLDER, model_filename)
    
    # Save Model
    joblib.dump(pipeline, model_path)
    
    # Extract Rules if Decision Tree
    rules = None
    if algorithm == 'Decision Tree':
        try:
            # We need to get feature names after preprocessing
            # This is tricky with pipelines, but possible
            # For simplicity, we might skip detailed feature names or try best effort
            rules = export_text(pipeline.named_steps['classifier'], feature_names=list(pipeline.named_steps['preprocessor'].get_feature_names_out()))
        except:
            rules = "Could not extract rules."

    # Extract Feature Importance
    feature_importance = {}
    try:
        feature_names = list(pipeline.named_steps['preprocessor'].get_feature_names_out())
        classifier = pipeline.named_steps['classifier']
        
        if hasattr(classifier, 'feature_importances_'):
            importances = classifier.feature_importances_
            feature_importance = dict(zip(feature_names, importances))
        elif hasattr(classifier, 'coef_'):
            # For Logistic Regression and Linear SVM
            # coef_ is shape (1, n_features) for binary classification
            importances = classifier.coef_[0]
            feature_importance = dict(zip(feature_names, importances))
            
        # Sort by absolute value of importance
        feature_importance = dict(sorted(feature_importance.items(), key=lambda item: abs(item[1]), reverse=True))
        
        # Convert numpy types to python types for JSON serialization
        feature_importance = {k: float(v) for k, v in feature_importance.items()}
        
    except Exception as e:
        print(f"Could not extract feature importance: {e}")
        feature_importance = {}

    return {
        'model_id': model_id,
        'algorithm': algorithm,
        'hyperparams': json.dumps(hyperparams),
        'metrics': json.dumps(metrics),
        'filepath': model_filename,
        'timestamp': datetime.now().isoformat(),
        'rules': rules,
        'feature_importance': json.dumps(feature_importance)
    }

def load_model(model_filename):
    path = os.path.join(Config.MODELS_FOLDER, model_filename)
    if not os.path.exists(path):
        raise FileNotFoundError("Model file not found")
    return joblib.load(path)

def predict_single(model, input_data):
    # input_data is a dict
    df = pd.DataFrame([input_data])
    # Ensure columns match what the pipeline expects (preprocessing handles missing cols if robust, but better to have them)
    # The pipeline expects raw columns.
    
    prediction = model.predict(df)[0]
    probability = model.predict_proba(df)[0].max() if hasattr(model, 'predict_proba') else 0.0
    
    return int(prediction), float(probability)

from flask import Flask, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from config import Config
from routes.auth import auth_bp
from routes.dataset import dataset_bp
from routes.model import model_bp
from routes.predict import predict_bp

app = Flask(__name__)
app.config.from_object(Config)

CORS(app)
JWTManager(app)

# Register Blueprints
app.register_blueprint(auth_bp, url_prefix='/api/auth')
app.register_blueprint(dataset_bp, url_prefix='/api/datasets')
app.register_blueprint(model_bp, url_prefix='/api/models')
app.register_blueprint(predict_bp, url_prefix='/api/predict')

@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({"status": "ok"}), 200

if __name__ == '__main__':
    app.run(debug=True, port=5000)

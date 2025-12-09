# Student Academic Performance Predictor

A full-stack web application to predict student academic performance using Machine Learning. Built with React, Flask, and CSV-based storage.

## Features

- **Frontend**: React, Tailwind CSS, Framer Motion for a modern, animated UI.
- **Backend**: Flask API with JWT authentication.
- **ML**: Scikit-learn for training Decision Trees, Naive Bayes, Logistic Regression, and SVM models.
- **Storage**: Zero-database architecture; all data is stored in CSV files.
- **Functionality**:
  - User Authentication (Login/Register)
  - Dataset Upload & Preview
  - Model Training with Hyperparameter tuning
  - Single & Batch Predictions
  - Prediction History & Dashboard

## Project Structure

```
/backend
  /data          # CSV storage (users, models, predictions, datasets)
  /models        # Saved .joblib models
  /routes        # API endpoints
  /utils         # Helper functions (CSV handling, ML logic)
  app.py         # Flask entry point
  config.py      # Configuration

/frontend
  /public
  /src
    /components  # Reusable UI components
    /context     # Auth context
    /pages       # Application pages
    /services    # API calls
  App.js         # Main component & Routing
```

## Prerequisites

- Python 3.8+
- Node.js 14+

## Setup & Running

### 1. Backend Setup

1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Create a virtual environment:
   ```bash
   python -m venv venv
   ```
3. Activate the virtual environment:
   - Windows: `venv\Scripts\activate`
   - Mac/Linux: `source venv/bin/activate`
4. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
5. Run the Flask server:
   ```bash
   python app.py
   ```
   The backend will run on `http://localhost:5000`.

### 2. Frontend Setup

1. Open a new terminal and navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the React development server:
   ```bash
   npm start
   ```
   The frontend will run on `http://localhost:3000`.

## Usage Guide

1. **Register/Login**: Create an account to access the dashboard.
2. **Datasets**: The `student-mat.csv` dataset is pre-loaded. You can upload other compatible CSVs.
3. **Training**: Go to the Training page, select a dataset and an algorithm (e.g., Decision Tree), and click "Start Training".
4. **Prediction**: Once a model is trained, go to the Prediction page. Select your trained model and enter student details to predict if they will Pass or Fail. You can also upload a CSV for batch predictions.
5. **History**: View past predictions in the History page.

## Testing

To run backend tests:
```bash
cd backend
python test_app.py
```

## License

MIT

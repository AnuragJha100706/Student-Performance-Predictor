import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer

def get_preprocessor(X):
    """
    Creates a ColumnTransformer for preprocessing.
    Identifies categorical and numerical columns automatically.
    """
    categorical_cols = X.select_dtypes(include=['object', 'category']).columns
    numerical_cols = X.select_dtypes(include=['int64', 'float64']).columns

    numerical_transformer = Pipeline(steps=[
        ('imputer', SimpleImputer(strategy='median'))
    ])

    categorical_transformer = Pipeline(steps=[
        ('imputer', SimpleImputer(strategy='most_frequent')),
        ('onehot', OneHotEncoder(handle_unknown='ignore'))
    ])

    preprocessor = ColumnTransformer(
        transformers=[
            ('num', numerical_transformer, numerical_cols),
            ('cat', categorical_transformer, categorical_cols)
        ]
    )

    return preprocessor

def prepare_data(df, target_column='G3'):
    """
    Splits data into X and y.
    Assumes 'G3' is the target for student performance (final grade).
    If classification is needed (pass/fail), we can transform y here.
    """
    if target_column not in df.columns:
        raise ValueError(f"Target column {target_column} not found in dataset")
    
    # For this specific student dataset, G3 is often predicted.
    # Sometimes we want binary classification (Pass/Fail) where G3 >= 10 is Pass.
    # Let's assume we want to predict the grade itself or a class.
    # The prompt mentions "Probability", implying classification.
    # Let's convert G3 to binary: 1 (Pass) if G3 >= 10, else 0 (Fail).
    
    y = df[target_column].apply(lambda x: 1 if x >= 10 else 0)
    X = df.drop(columns=[target_column, 'G1', 'G2']) # G1 and G2 are highly correlated with G3, usually removed for prediction from start
    
    return X, y

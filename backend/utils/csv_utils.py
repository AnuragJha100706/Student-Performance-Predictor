import os
import pandas as pd
import shutil
from threading import Lock

csv_lock = Lock()

def read_csv(filepath):
    """Reads a CSV file into a DataFrame. Returns empty DataFrame if file doesn't exist."""
    if not os.path.exists(filepath):
        return pd.DataFrame()
    try:
        return pd.read_csv(filepath)
    except pd.errors.EmptyDataError:
        return pd.DataFrame()

def write_csv(df, filepath, mode='w'):
    """Writes a DataFrame to a CSV file safely using a temp file."""
    directory = os.path.dirname(filepath)
    if not os.path.exists(directory):
        os.makedirs(directory)

    temp_filepath = filepath + '.tmp'
    
    with csv_lock:
        if mode == 'a' and os.path.exists(filepath):
            # If appending, we need to read existing, append, then write back? 
            # Or just open in append mode. Pandas to_csv with mode='a' is easier but not atomic.
            # For safety/atomicity with pandas, it's often better to read-append-write if size allows,
            # or just use standard file append.
            # Given requirements: "Always write via temp file then rename for safety"
            # This implies we should read full, append, write temp, rename.
            
            # However, for logs/history, appending is frequent.
            # Let's try to be efficient. If mode is 'a', we append to the file directly?
            # The prompt says: "Always write via temp file then rename for safety"
            # So we will follow that strictly.
            
            existing_df = read_csv(filepath)
            if not existing_df.empty:
                df = pd.concat([existing_df, df], ignore_index=True)
            
        df.to_csv(temp_filepath, index=False)
        shutil.move(temp_filepath, filepath)

def append_row(data_dict, filepath):
    """Appends a single row (dict) to a CSV file."""
    df = pd.DataFrame([data_dict])
    write_csv(df, filepath, mode='a')

def init_csv(filepath, columns):
    """Initializes a CSV file with headers if it doesn't exist."""
    if not os.path.exists(filepath):
        df = pd.DataFrame(columns=columns)
        write_csv(df, filepath)


import pandas as pd
import random

# Load the dataset
try:
    df = pd.read_csv('student/student-mat.csv', sep=';')
except:
    try:
        df = pd.read_csv('student/student-por.csv', sep=';')
    except:
        print("Could not find student datasets.")
        exit()

# Define the input fields expected by the frontend
fields = [
    'school', 'sex', 'age', 'address', 'famsize', 'Pstatus', 'Medu', 'Fedu',
    'Mjob', 'Fjob', 'reason', 'guardian', 'traveltime', 'studytime', 'failures',
    'schoolsup', 'famsup', 'paid', 'activities', 'nursery', 'higher', 'internet',
    'romantic', 'famrel', 'freetime', 'goout', 'Dalc', 'Walc', 'health', 'absences'
]

# Pick a random row
random_index = random.randint(0, len(df) - 1)
row = df.iloc[random_index]

# Print the values for the expected fields
print(f"--- Random Student Sample (Row {random_index}) ---")
print(f"Target (G3): {row.get('G3', 'N/A')} ({'Pass' if row.get('G3', 0) >= 10 else 'Fail'})")
print("-" * 40)
for field in fields:
    if field in row:
        print(f"{field}: {row[field]}")
    else:
        print(f"{field}: N/A")

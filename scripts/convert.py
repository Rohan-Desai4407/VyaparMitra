import pandas as pd
import os

data_dir = os.path.join(os.path.dirname(__file__), '..', 'data')
xlsx_path = os.path.join(data_dir, 'All_Villagesof_India_2026-08-27_12-18-08.xlsx')
csv_path = os.path.join(data_dir, 'data.csv')

print("Loading Excel file...")
# Use openpyxl engine to read the xlsx file
df = pd.read_excel(xlsx_path, engine='openpyxl')

print(f"Loaded {len(df)} rows. Saving to actual CSV format...")
df.to_csv(csv_path, index=False)
print("Saved to data.csv successfully!")


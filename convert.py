import pandas as pd
import os

print("Restoring .xlsx extension...")
if os.path.exists('All_Villagesof_India_2026-08-27_12-18-08.csv'):
    os.rename('All_Villagesof_India_2026-08-27_12-18-08.csv', 'All_Villagesof_India_2026-08-27_12-18-08.xlsx')

print("Loading Excel file...")
# Use openpyxl engine to read the xlsx file
df = pd.read_excel('All_Villagesof_India_2026-08-27_12-18-08.xlsx', engine='openpyxl')

print(f"Loaded {len(df)} rows. Saving to actual CSV format...")
df.to_csv('data.csv', index=False)
print("Saved to data.csv successfully!")

import pandas as pd

data = pd.read_csv("ML & RISK/data/cybercrime_data.csv")

print("Dataset:")
print(data)

print("\nColumns:")
print(data.columns.tolist())

print("\nMissing values:")
print(data.isnull().sum())
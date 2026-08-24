import pandas as pd
import joblib

from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error

data = pd.read_csv("ML & RISK/data/cybercrime_data.csv")

X = data.drop("risk", axis=1)
y = data["risk"]

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

model = RandomForestRegressor(
    n_estimators=100,
    random_state=42
)

model.fit(X_train, y_train)

joblib.dump(model, "ML & RISK/trained_model.pkl")

predictions = model.predict(X_test)

error = mean_absolute_error(y_test, predictions)

print("Actual risk scores:")
print(y_test.tolist())

print("\nPredicted risk scores:")
print([round(float(value), 2) for value in predictions])

print("\nMean Absolute Error:", round(error, 2))

print("\nModel saved successfully:")
print("ML & RISK/trained_model.pkl")
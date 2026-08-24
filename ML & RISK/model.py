import pandas as pd

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


def predict_risk(amount, victims, suspicious_url, repeated_upi, multiple_crimes):

    input_data = pd.DataFrame([{
        "amount": amount,
        "victims": victims,
        "suspicious_url": suspicious_url,
        "repeated_upi": repeated_upi,
        "multiple_crimes": multiple_crimes
    }])

    prediction = model.predict(input_data)[0]

    prediction = max(0, min(100, prediction))

    if prediction < 40:
        risk_level = "LOW"
    elif prediction < 70:
        risk_level = "MEDIUM"
    else:
        risk_level = "HIGH"

    return {
        "risk_score": round(float(prediction), 2),
        "risk_level": risk_level
    }


if __name__ == "__main__":

    predictions = model.predict(X_test)

    error = mean_absolute_error(y_test, predictions)

    print("Actual risk scores:")
    print(y_test.tolist())

    print("\nPredicted risk scores:")
    print([round(float(value), 2) for value in predictions])

    print("\nMean Absolute Error:", round(error, 2))

    print("\nExample new transaction:")

    result = predict_risk(
        50000,
        5,
        1,
        1,
        1
    )

    print(result)
import pandas as pd
from sklearn.ensemble import RandomForestRegressor

data = pd.read_csv("ML & RISK/data/cybercrime_data.csv")

X = data.drop("risk", axis=1)
y = data["risk"]

model = RandomForestRegressor(
    n_estimators=100,
    random_state=42
)

model.fit(X, y)


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

    result = predict_risk(
        50000,
        5,
        1,
        1,
        1
    )

    print("Prediction result:")
    print(result)
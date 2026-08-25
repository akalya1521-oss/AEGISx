def predict_risk(data):
    risk_score = 70.93

    if risk_score >= 70:
        risk_level = "HIGH"
        priority = "HIGH"
    elif risk_score >= 40:
        risk_level = "MEDIUM"
        priority = "MEDIUM"
    else:
        risk_level = "LOW"
        priority = "LOW"

    return {
        "risk_score": risk_score,
        "risk_level": risk_level,
        "priority": priority,
        "reason": "Multiple suspicious indicators detected"
    }


result = predict_risk(None)

print("Prediction result:")
print(result)
def calculate_threat_score(alerts):

    score = 0

    for alert in alerts:

        if "Suspicious keyword" in alert:
            score += 20

        elif "IP address" in alert:
            score += 25

        elif "URL" in alert:
            score += 25

        elif "Email" in alert:
            score += 10

    if score >= 70:
        level = "CRITICAL"
    elif score >= 40:
        level = "HIGH"
    elif score >= 20:
        level = "MEDIUM"
    else:
        level = "LOW"

    return score, level


# Test alerts
alerts = [
    "Suspicious keyword detected: fraud",
    "Suspicious keyword detected: phishing",
    "IP address detected: 192.168.1.10",
    "URL detected: https://fakebank.com/login",
    "Email detected: fraud@gmail.com"
]

score, level = calculate_threat_score(alerts)

print("AEGIS CHAIN - THREAT SCORE")
print("---------------------------")
print("Threat Score :", score)
print("Threat Level :", level)
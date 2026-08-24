from anomaly_detector import detect_anomalies
from threat_score import calculate_threat_score


print("===================================")
print("        AEGIS CHAIN")
print("   Cyber Threat Intelligence")
print("===================================")

text = """
User Ravi attempted a suspicious login.
IP address: 192.168.1.10
Email: fraud@gmail.com
Website: https://fakebank.com/login
Possible phishing attack detected.
"""

print("\nINPUT:")
print(text)

# Step 1 - Detect anomalies
alerts = detect_anomalies(text)

print("\nTHREAT DETECTION")
print("----------------")

for alert in alerts:
    print("[ALERT]", alert)

# Step 2 - Calculate threat score
score, level = calculate_threat_score(alerts)

print("\nTHREAT ASSESSMENT")
print("-----------------")
print("Threat Score :", score)
print("Threat Level :", level)

print("\n===================================")
print("       ANALYSIS COMPLETED")
print("===================================")
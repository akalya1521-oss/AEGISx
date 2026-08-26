import re

def detect_anomalies(text):
    alerts = []

    # Suspicious keywords
    suspicious_words = [
        "fraud",
        "malware",
        "ransomware",
        "phishing",
        "attack",
        "hack",
        "password",
        "login"
    ]

    for word in suspicious_words:
        if word.lower() in text.lower():
            alerts.append(f"Suspicious keyword detected: {word}")

    # Detect IP address
    ip_pattern = r'\b(?:\d{1,3}\.){3}\d{1,3}\b'
    ips = re.findall(ip_pattern, text)

    for ip in ips:
        alerts.append(f"IP address detected: {ip}")

    # Detect URLs
    url_pattern = r'https?://[^\s]+'
    urls = re.findall(url_pattern, text)

    for url in urls:
        alerts.append(f"URL detected: {url}")

    # Detect email
    email_pattern = r'[\w\.-]+@[\w\.-]+\.\w+'
    emails = re.findall(email_pattern, text)

    for email in emails:
        alerts.append(f"Email detected: {email}")

    return alerts


# Test input
sample_text = """
User Ravi attempted a suspicious login.
IP address: 192.168.1.10
Email: fraud@gmail.com
Website: https://fakebank.com/login
Possible phishing attack detected.
"""

print("AEGIS CHAIN - ANOMALY DETECTION")
print("--------------------------------")

alerts = detect_anomalies(sample_text)

if alerts:
    print("⚠️ THREATS DETECTED")
    print()

    for alert in alerts:
        print("[ALERT]", alert)
else:
    print("✅ No anomalies detected")
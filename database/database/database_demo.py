# AEGISx Cybersecurity Demo

threat_logs = [
    {
        "source_ip": "192.168.1.10",
        "destination_ip": "10.0.0.5",
        "protocol": "TCP",
        "threat": "Port Scan",
        "severity": "High",
        "status": "Detected"
    },
    {
        "source_ip": "172.16.0.20",
        "destination_ip": "10.0.0.8",
        "protocol": "UDP",
        "threat": "Suspicious Traffic",
        "severity": "Medium",
        "status": "Detected"
    },
    {
        "source_ip": "192.168.1.15",
        "destination_ip": "10.0.0.9",
        "protocol": "TCP",
        "threat": "Brute Force Attack",
        "severity": "Critical",
        "status": "Detected"
    },
    {
        "source_ip": "192.168.1.25",
        "destination_ip": "10.0.0.10",
        "protocol": "HTTP",
        "threat": "Normal Traffic",
        "severity": "Low",
        "status": "Safe"
    }
]


print("=" * 60)
print("             AEGISx CYBERSECURITY DEMO")
print("=" * 60)

print("\nTHREAT LOGS")
print("-" * 60)

for i, log in enumerate(threat_logs, start=1):
    print(f"\nThreat #{i}")
    print(f"Source IP      : {log['source_ip']}")
    print(f"Destination IP : {log['destination_ip']}")
    print(f"Protocol       : {log['protocol']}")
    print(f"Threat         : {log['threat']}")
    print(f"Severity       : {log['severity']}")
    print(f"Status         : {log['status']}")


# Calculate statistics
detected = sum(1 for log in threat_logs if log["status"] == "Detected")
safe = sum(1 for log in threat_logs if log["status"] == "Safe")

critical = sum(1 for log in threat_logs if log["severity"] == "Critical")
high = sum(1 for log in threat_logs if log["severity"] == "High")
medium = sum(1 for log in threat_logs if log["severity"] == "Medium")

print("\n" + "=" * 60)
print("              SECURITY SUMMARY")
print("=" * 60)

print(f"Total Events       : {len(threat_logs)}")
print(f"Threats Detected   : {detected}")
print(f"Safe Events        : {safe}")
print(f"Critical Threats   : {critical}")
print(f"High Threats       : {high}")
print(f"Medium Threats     : {medium}")

print("\nRisk Assessment:")

if critical > 0:
    print("🚨 CRITICAL RISK - Immediate action required!")
elif high > 0:
    print("⚠️ HIGH RISK - Investigation recommended.")
elif medium > 0:
    print("⚠️ MEDIUM RISK - Monitor the network.")
else:
    print("✅ LOW RISK - Network appears safe.")

print("\n" + "=" * 60)
print("              DEMO COMPLETED")
print("=" * 60)
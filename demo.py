print("=" * 50)
print("        AEGISx CYBERSECURITY DEMO")
print("=" * 50)

threats = [
    ("192.168.1.10", "10.0.0.5", "TCP", "Port Scan", "High"),
    ("172.16.0.20", "10.0.0.8", "UDP", "Suspicious Traffic", "Medium"),
    ("192.168.1.15", "10.0.0.9", "TCP", "Brute Force Attack", "Critical"),
    ("192.168.1.25", "10.0.0.10", "HTTP", "Normal Traffic", "Low")
]

print("\nTHREAT LOGS")
print("-" * 50)

for i, threat in enumerate(threats, 1):
    print(f"\nThreat #{i}")
    print(f"Source IP      : {threat[0]}")
    print(f"Destination IP : {threat[1]}")
    print(f"Protocol       : {threat[2]}")
    print(f"Threat         : {threat[3]}")
    print(f"Severity       : {threat[4]}")

print("\n" + "=" * 50)
print("             SECURITY SUMMARY")
print("=" * 50)

print(f"Total Events    : {len(threats)}")
print("Threats Detected: 3")
print("Safe Events     : 1")
print("Critical        : 1")
print("High            : 1")
print("Medium          : 1")

print("\nRisk Assessment: CRITICAL RISK")
print("Immediate investigation required.")

print("\n" + "=" * 50)
print("              DEMO COMPLETED")
print("=" * 50)
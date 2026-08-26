import sqlite3

# ==============================
# AEGISx CYBERSECURITY DATABASE
# ==============================

DATABASE = "cyber_threat.db"

# Connect to database
connection = sqlite3.connect(DATABASE)
cursor = connection.cursor()

# Remove old table if it exists
cursor.execute("DROP TABLE IF EXISTS threat_logs")

# Create new threat_logs table
cursor.execute("""
CREATE TABLE threat_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    source_ip TEXT NOT NULL,
    destination_ip TEXT NOT NULL,
    protocol TEXT NOT NULL,
    threat TEXT NOT NULL,
    severity TEXT NOT NULL,
    status TEXT NOT NULL
)
""")

# ==============================
# SAMPLE DATASET
# ==============================

threat_logs = [
    (
        "192.168.1.10",
        "10.0.0.5",
        "TCP",
        "Port Scan",
        "High",
        "Detected"
    ),
    (
        "172.16.0.20",
        "10.0.0.8",
        "UDP",
        "Suspicious Traffic",
        "Medium",
        "Detected"
    ),
    (
        "192.168.1.15",
        "10.0.0.9",
        "TCP",
        "Brute Force Attack",
        "Critical",
        "Detected"
    ),
    (
        "192.168.1.25",
        "10.0.0.10",
        "HTTP",
        "Normal Traffic",
        "Low",
        "Safe"
    )
]

# Insert dataset into database
cursor.executemany("""
INSERT INTO threat_logs
(source_ip, destination_ip, protocol, threat, severity, status)
VALUES (?, ?, ?, ?, ?, ?)
""", threat_logs)

# Save changes
connection.commit()

# ==============================
# DISPLAY DATABASE RECORDS
# ==============================

print("=" * 70)
print("             AEGISx CYBERSECURITY DATABASE")
print("=" * 70)

cursor.execute("SELECT * FROM threat_logs")
records = cursor.fetchall()

for record in records:
    print(f"""
ID              : {record[0]}
Source IP       : {record[1]}
Destination IP  : {record[2]}
Protocol        : {record[3]}
Threat          : {record[4]}
Severity        : {record[5]}
Status          : {record[6]}
----------------------------------------------
""")

# ==============================
# SECURITY STATISTICS
# ==============================

cursor.execute(
    "SELECT COUNT(*) FROM threat_logs WHERE status = 'Detected'"
)
detected = cursor.fetchone()[0]

cursor.execute(
    "SELECT COUNT(*) FROM threat_logs WHERE status = 'Safe'"
)
safe = cursor.fetchone()[0]

cursor.execute(
    "SELECT COUNT(*) FROM threat_logs WHERE severity = 'Critical'"
)
critical = cursor.fetchone()[0]

cursor.execute(
    "SELECT COUNT(*) FROM threat_logs WHERE severity = 'High'"
)
high = cursor.fetchone()[0]

cursor.execute(
    "SELECT COUNT(*) FROM threat_logs WHERE severity = 'Medium'"
)
medium = cursor.fetchone()[0]

cursor.execute(
    "SELECT COUNT(*) FROM threat_logs"
)
total = cursor.fetchone()[0]

# ==============================
# SECURITY SUMMARY
# ==============================

print("=" * 70)
print("                 SECURITY SUMMARY")
print("=" * 70)

print(f"Total Events       : {total}")
print(f"Threats Detected   : {detected}")
print(f"Safe Events        : {safe}")
print(f"Critical Threats   : {critical}")
print(f"High Threats       : {high}")
print(f"Medium Threats     : {medium}")

print("\nRisk Assessment:")

if critical > 0:
    print("CRITICAL RISK - Immediate action required!")
elif high > 0:
    print("HIGH RISK - Investigation recommended.")
elif medium > 0:
    print("MEDIUM RISK - Monitor the network.")
else:
    print("LOW RISK - Network appears safe.")

print("=" * 70)
print("             DATABASE TEST COMPLETED")
print("=" * 70)

# Close connection
connection.close()
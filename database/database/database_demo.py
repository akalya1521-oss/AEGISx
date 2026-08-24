import sqlite3

# Create database
connection = sqlite3.connect("cyber_threat.db")

cursor = connection.cursor()

# Create table
cursor.execute("""
CREATE TABLE IF NOT EXISTS threat_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    source_ip TEXT,
    destination_ip TEXT,
    protocol TEXT,
    threat_type TEXT,
    severity TEXT,
    status TEXT
)
""")

# Add sample cyber-threat data
data = [
    ("192.168.1.10", "10.0.0.5", "TCP", "Port Scan", "High", "Detected"),
    ("172.16.0.20", "10.0.0.8", "UDP", "Suspicious Traffic", "Medium", "Detected"),
    ("192.168.1.15", "10.0.0.9", "TCP", "Brute Force", "High", "Blocked"),
    ("10.10.1.5", "10.0.0.7", "ICMP", "Abnormal Traffic", "Low", "Monitoring")
]

cursor.executemany("""
INSERT INTO threat_logs
(source_ip, destination_ip, protocol, threat_type, severity, status)
VALUES (?, ?, ?, ?, ?, ?)
""", data)

connection.commit()

# Display database records
print("===== ALL THREAT LOGS =====")

cursor.execute("SELECT * FROM threat_logs")

for row in cursor.fetchall():
    print(row)

# Display high severity threats
print("\n===== HIGH SEVERITY THREATS =====")

cursor.execute("SELECT * FROM threat_logs WHERE severity = 'High'")

for row in cursor.fetchall():
    print(row)

# Count threats
cursor.execute("SELECT COUNT(*) FROM threat_logs")

total = cursor.fetchone()[0]

print("\nTotal threats:", total)

connection.close()
import spacy
import re

nlp = spacy.load("en_core_web_sm")

text = """
The victim Ravi received a phishing email from fraud@gmail.com.
The attacker used IP address 192.168.1.10 and phone number 9876543210.
The attacker sent the malicious URL https://fakebank.com/login
and demanded Rs.25000.
"""

doc = nlp(text)

print("CYBERCRIME ENTITIES")
print("-------------------")

# Normal NLP entities
for entity in doc.ents:
    print(entity.text, "->", entity.label_)

# Email
emails = re.findall(r'\b[\w.-]+@[\w.-]+\.\w+\b', text)

# IP address
ips = re.findall(r'\b(?:\d{1,3}\.){3}\d{1,3}\b', text)

# Phone number
phones = re.findall(r'\b[6-9]\d{9}\b', text)

# URL
urls = re.findall(r'https?://[^\s]+', text)

print("\nCYBERCRIME-SPECIFIC ENTITIES")
print("----------------------------")

for email in emails:
    print(email, "-> EMAIL")

for ip in ips:
    print(ip, "-> IP_ADDRESS")

for phone in phones:
    print(phone, "-> PHONE")

for url in urls:
    print(url, "-> URL")
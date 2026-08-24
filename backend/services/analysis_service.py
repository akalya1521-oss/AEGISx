import re


def extract_entities(text: str):
    # IP addresses
    ip_addresses = re.findall(
        r'\b(?:\d{1,3}\.){3}\d{1,3}\b',
        text
    )

    # Email addresses
    emails = re.findall(
        r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b',
        text
    )

    # URLs
    urls = re.findall(
        r'https?://[^\s]+',
        text
    )

    # Domains
    domains = re.findall(
        r'\b(?:[A-Za-z0-9-]+\.)+[A-Za-z]{2,}\b',
        text
    )

    return {
        "ip_addresses": list(set(ip_addresses)),
        "emails": list(set(emails)),
        "urls": list(set(urls)),
        "domains": list(set(domains))
    }


def build_relationships(entities):
    relationships = []
    all_entities = []

    for entity_type, values in entities.items():
        for value in values:
            all_entities.append({
                "type": entity_type,
                "value": value
            })

    # Connect entities that appear in the same analysis
    for i in range(len(all_entities)):
        for j in range(i + 1, len(all_entities)):
            entity_a = all_entities[i]
            entity_b = all_entities[j]

            relationships.append({
                "source": entity_a["value"],
                "source_type": entity_a["type"],
                "target": entity_b["value"],
                "target_type": entity_b["type"],
                "relationship": "associated_with"
            })

    return relationships


def build_graph(entities):
    nodes = []
    edges = []

    # Create graph nodes
    for entity_type, values in entities.items():
        for value in values:
            nodes.append({
                "id": value,
                "type": entity_type
            })

    # Create graph edges
    for i in range(len(nodes)):
        for j in range(i + 1, len(nodes)):
            edges.append({
                "source": nodes[i]["id"],
                "target": nodes[j]["id"],
                "label": "associated_with"
            })

    return {
        "nodes": nodes,
        "edges": edges
    }


def analyze_data(text: str):
    text_lower = text.lower()

    suspicious_keywords = [
        "malware",
        "phishing",
        "ransomware",
        "botnet",
        "fraud",
        "scam",
        "trojan",
        "exploit",
        "credential",
        "hacking",
        "ddos",
        "suspicious"
    ]

    # Detect suspicious keywords
    detected_keywords = [
        keyword
        for keyword in suspicious_keywords
        if keyword in text_lower
    ]

    # Calculate risk score
    keyword_count = len(detected_keywords)
    risk_score = min(keyword_count * 20, 100)

    # Calculate risk level
    if risk_score >= 90:
        risk_level = "CRITICAL"
    elif risk_score >= 70:
        risk_level = "HIGH"
    elif risk_score >= 40:
        risk_level = "MEDIUM"
    elif risk_score >= 20:
        risk_level = "LOW"
    else:
        risk_level = "SAFE"

    # Extract entities
    entities = extract_entities(text)

    # Build relationships
    relationships = build_relationships(entities)

    # Build graph
    graph = build_graph(entities)

    return {
        "input": text,
        "status": "analyzed",
        "risk_level": risk_level,
        "risk_score": risk_score,
        "detected_keywords": detected_keywords,
        "keyword_count": keyword_count,
        "entities": entities,
        "relationships": relationships,
        "graph": graph
    }
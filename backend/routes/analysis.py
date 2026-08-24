from fastapi import APIRouter
from pydantic import BaseModel
import re
import uuid
from datetime import datetime, timezone
from routes.investigations import investigations
router = APIRouter(
    prefix="/analysis",
    tags=["Analysis"]
)


class AnalysisRequest(BaseModel):
    input: str


@router.get("/")
def analysis_home():
    return "AEGISx Analysis API is running"


@router.post("/")
def analyze_text(request: AnalysisRequest):

    text = request.input
    text_lower = text.lower()
        # ==========================================
    # INVESTIGATION INFORMATION
    # ==========================================

    investigation_id = (
        f"AEGIS-{datetime.now(timezone.utc).strftime('%Y%m%d')}-"
        f"{uuid.uuid4().hex[:6].upper()}"
    )

    timestamp = datetime.now(timezone.utc).isoformat()
    # ==========================================
    # 1. THREAT KEYWORD DETECTION
    # ==========================================

    keywords = {
        "phishing": "phishing",
        "ransomware": "ransomware",
        "botnet": "botnet",
        "ddos": "ddos",
        "credential theft": "credential theft",
        "malware": "malware",
        "trojan": "trojan",
        "spyware": "spyware",
        "brute force": "brute force",
        "data breach": "data breach"
    }

    detected_keywords = []

    for keyword, result in keywords.items():
        if keyword in text_lower:
            detected_keywords.append(result)

    keyword_count = len(detected_keywords)

    # ==========================================
    # 2. ENTITY EXTRACTION
    # ==========================================

    ip_pattern = r"\b(?:\d{1,3}\.){3}\d{1,3}\b"
    ip_addresses = list(dict.fromkeys(re.findall(ip_pattern, text)))

    email_pattern = r"\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b"
    emails = list(dict.fromkeys(re.findall(email_pattern, text)))

    url_pattern = r"https?://[^\s]+"
    urls = list(dict.fromkeys(re.findall(url_pattern, text)))

    domain_pattern = r"\b(?:[a-zA-Z0-9-]+\.)+(?:com|org|net|edu|gov|in|io|co|xyz)\b"
    domains = list(dict.fromkeys(re.findall(domain_pattern, text)))

    # ==========================================
    # 3. RISK SCORE
    # ==========================================

    risk_score = 0
    risk_factors = []

    keyword_scores = {
        "phishing": 15,
        "ransomware": 30,
        "botnet": 25,
        "ddos": 20,
        "credential theft": 25,
        "malware": 20,
        "trojan": 20,
        "spyware": 20,
        "brute force": 15,
        "data breach": 25
    }

    for keyword in detected_keywords:
        risk_score += keyword_scores.get(keyword, 10)

        risk_factors.append(
            f"{keyword.title()} activity detected"
        )

    if ip_addresses:
        risk_score += 10
        risk_factors.append(
            "IP address identified"
        )

    if emails:
        risk_score += 5
        risk_factors.append(
            "Email address identified"
        )

    if urls:
        risk_score += 10
        risk_factors.append(
            "URL identified"
        )

    if domains:
        risk_score += 10
        risk_factors.append(
            "Domain identified"
        )

    risk_score = min(risk_score, 100)

    # ==========================================
    # 4. RISK LEVEL
    # ==========================================

    if risk_score >= 60:
        risk_level = "HIGH"
    elif risk_score >= 20:
        risk_level = "MEDIUM"
    else:
        risk_level = "LOW"

    # ==========================================
    # 5. CONFIDENCE
    # ==========================================

    if keyword_count >= 3:
        confidence = 0.95
    elif keyword_count == 2:
        confidence = 0.88
    elif keyword_count == 1:
        confidence = 0.80
    elif ip_addresses or emails or urls or domains:
        confidence = 0.65
    else:
        confidence = 0.50

    # ==========================================
    # 6. CREATE GRAPH NODES
    # ==========================================

    nodes = []

    # Threat nodes
    for threat in detected_keywords:
        nodes.append({
            "id": f"threat_{threat}",
            "type": "threat",
            "label": threat.title()
        })

    # IP nodes
    for ip in ip_addresses:
        nodes.append({
            "id": ip,
            "type": "ip",
            "label": ip
        })

    # Email nodes
    for email in emails:
        nodes.append({
            "id": email,
            "type": "email",
            "label": email
        })

    # URL nodes
    for url in urls:
        nodes.append({
            "id": url,
            "type": "url",
            "label": url
        })

    # Domain nodes
    for domain in domains:
        nodes.append({
            "id": domain,
            "type": "domain",
            "label": domain
        })

    # ==========================================
    # 7. CREATE RELATIONSHIPS
    # ==========================================

    relationships = []
    edges = []
        # Threat -> Threat relationships
    for i in range(len(detected_keywords)):
        for j in range(i + 1, len(detected_keywords)):

            source_threat = detected_keywords[i]
            target_threat = detected_keywords[j]

            relationship = {
                "source": f"threat_{source_threat}",
                "target": f"threat_{target_threat}",
                "relationship": "related_to"
            }

            relationships.append(relationship)

            edges.append({
                "source": f"threat_{source_threat}",
                "target": f"threat_{target_threat}",
                "label": "related_to"
            })
    # Threat -> IP
    for threat in detected_keywords:
        for ip in ip_addresses:

            relationship = {
                "source": f"threat_{threat}",
                "target": ip,
                "relationship": "associated_with"
            }

            relationships.append(relationship)

            edges.append({
                "source": f"threat_{threat}",
                "target": ip,
                "label": "associated_with"
            })

    # Email -> IP
    for email in emails:
        for ip in ip_addresses:

            relationship = {
                "source": email,
                "target": ip,
                "relationship": "associated_with"
            }

            relationships.append(relationship)

            edges.append({
                "source": email,
                "target": ip,
                "label": "associated_with"
            })

    # IP -> URL
    for ip in ip_addresses:
        for url in urls:

            relationship = {
                "source": ip,
                "target": url,
                "relationship": "connected_to"
            }

            relationships.append(relationship)

            edges.append({
                "source": ip,
                "target": url,
                "label": "connected_to"
            })

    # URL -> Domain
    for url in urls:
        for domain in domains:

            if domain in url:

                relationship = {
                    "source": url,
                    "target": domain,
                    "relationship": "resolves_to"
                }

                relationships.append(relationship)

                edges.append({
                    "source": url,
                    "target": domain,
                    "label": "resolves_to"
                })

    # Email -> Domain
    for email in emails:

        email_domain = email.split("@")[-1]

        if email_domain in domains:

            relationship = {
                "source": email,
                "target": email_domain,
                "relationship": "uses_domain"
            }

            relationships.append(relationship)

            edges.append({
                "source": email,
                "target": email_domain,
                "label": "uses_domain"
            })

    # ==========================================
    # 8. FINAL RESPONSE
    # ==========================================

    result = {
    "investigation_id": investigation_id,
    "timestamp": timestamp,

    "input": request.input,
    "status": "analyzed",
        "risk_level": risk_level,
        "risk_score": risk_score,
        "confidence": confidence,

        "risk_factors": risk_factors,

      "detected_keywords": detected_keywords,
"keyword_count": keyword_count,

"summary": {
    "threat_count": len(detected_keywords),
    "entity_count": (
        len(ip_addresses)
        + len(emails)
        + len(urls)
        + len(domains)
    ),
    "relationship_count": len(relationships)
},

"entities": {
    "ip_addresses": ip_addresses,
    "emails": emails,
    "urls": urls,
    "domains": domains
}, 

        "relationships": relationships,

        "graph": {
            "nodes": nodes,
            "edges": edges
        }
    }
    investigations[investigation_id] = result

    return result
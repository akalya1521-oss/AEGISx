from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
from datetime import datetime, timezone
import re


# ============================================================
# AEGISx - FastAPI Backend
# ============================================================

app = FastAPI(
    title="AEGISx Cyber Threat Intelligence API",
    description="AI-based cybercrime and threat analysis backend",
    version="1.0.0"
)


# ============================================================
# CORS
# ============================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:3001",
        "http://localhost:3002",
        "http://localhost:3003",
        "http://localhost:3004",
        "http://localhost:3005",
        "http://localhost:3006",
        "http://localhost:3007",
        "http://localhost:3008",
        "http://localhost:3009",
        "http://localhost:3010",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:3001",
        "http://127.0.0.1:3002",
        "http://127.0.0.1:3003",
        "http://127.0.0.1:3004",
        "http://127.0.0.1:3005",
        "http://127.0.0.1:3006",
        "http://127.0.0.1:3007",
        "http://127.0.0.1:3008",
        "http://127.0.0.1:3009",
        "http://127.0.0.1:3010",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================
# REQUEST MODEL
# ============================================================

class AnalysisRequest(BaseModel):
    text: str


# ============================================================
# RESPONSE MODELS
# ============================================================

class Relationship(BaseModel):
    source: str
    source_type: str
    target: str
    target_type: str
    relationship: str


class GraphNode(BaseModel):
    id: str
    type: str


class GraphEdge(BaseModel):
    source: str
    target: str
    label: str


class AnalysisResponse(BaseModel):
    input: str
    status: str
    risk_level: str
    risk_score: int
    detected_keywords: List[str]
    relationships: List[Relationship]
    graph: dict


# ============================================================
# THREAT KEYWORDS
# ============================================================

THREAT_KEYWORDS = {
    "ransomware": 40,
    "phishing": 30,
    "malware": 35,
    "trojan": 35,
    "virus": 30,
    "botnet": 35,
    "ddos": 30,
    "attack": 20,
    "hacking": 25,
    "hack": 25,
    "exploit": 30,
    "credential theft": 35,
    "steal credentials": 35,
    "password theft": 35,
    "brute force": 30,
    "suspicious login": 20,
    "fraud": 25,
    "scam": 20,
    "spyware": 35,
    "keylogger": 35,
    "data breach": 40,
    "cyberattack": 30,
    "cyber attack": 30,
    "unauthorized access": 30,
    "identity theft": 35,
}


# ============================================================
# ENTITY PATTERNS
# ============================================================

IP_PATTERN = r"\b(?:\d{1,3}\.){3}\d{1,3}\b"

EMAIL_PATTERN = (
    r"\b[A-Za-z0-9._%+-]+@"
    r"[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b"
)

URL_PATTERN = (
    r"https?://[^\s]+"
)


# ============================================================
# DETECT THREATS
# ============================================================

def detect_threats(text: str):

    text_lower = text.lower()

    detected_keywords = []
    threat_score = 0

    # -----------------------------------------
    # Keyword detection
    # -----------------------------------------

    for keyword, score in THREAT_KEYWORDS.items():

        if keyword in text_lower:

            detected_keywords.append(
                f"Suspicious keyword detected: {keyword}"
            )

            threat_score += score

    # -----------------------------------------
    # IP detection
    # -----------------------------------------

    ip_addresses = re.findall(
        IP_PATTERN,
        text
    )

    for ip in ip_addresses:

        detected_keywords.append(
            f"IP address detected: {ip}"
        )

        threat_score += 20

    # -----------------------------------------
    # Email detection
    # -----------------------------------------

    emails = re.findall(
        EMAIL_PATTERN,
        text
    )

    for email in emails:

        detected_keywords.append(
            f"Email detected: {email}"
        )

        threat_score += 10

    # -----------------------------------------
    # URL detection
    # -----------------------------------------

    urls = re.findall(
        URL_PATTERN,
        text
    )

    for url in urls:

        detected_keywords.append(
            f"URL detected: {url}"
        )

        threat_score += 15

    # -----------------------------------------
    # Limit score
    # -----------------------------------------

    threat_score = min(
        threat_score,
        100
    )

    # -----------------------------------------
    # Risk level
    # -----------------------------------------

    if threat_score >= 70:

        risk_level = "HIGH"

    elif threat_score >= 40:

        risk_level = "MEDIUM"

    else:

        risk_level = "LOW"

    return (
        detected_keywords,
        threat_score,
        risk_level,
        ip_addresses,
        emails,
        urls
    )


# ============================================================
# CREATE RELATIONSHIPS
# ============================================================

def create_relationships(
    text: str,
    detected_keywords: List[str],
    ip_addresses: List[str],
    emails: List[str],
    urls: List[str]
):

    relationships = []

    # -----------------------------------------
    # Threat keyword relationships
    # -----------------------------------------

    for keyword in detected_keywords:

        if keyword.startswith(
            "Suspicious keyword detected:"
        ):

            threat = keyword.split(
                ":",
                1
            )[1].strip()

            relationships.append(
                Relationship(
                    source="Input Text",
                    source_type="TEXT",
                    target=threat,
                    target_type="THREAT",
                    relationship="CONTAINS"
                )
            )

    # -----------------------------------------
    # IP relationships
    # -----------------------------------------

    for ip in ip_addresses:

        relationships.append(
            Relationship(
                source="Input Text",
                source_type="TEXT",
                target=ip,
                target_type="IP_ADDRESS",
                relationship="MENTIONS"
            )
        )

    # -----------------------------------------
    # Email relationships
    # -----------------------------------------

    for email in emails:

        relationships.append(
            Relationship(
                source="Input Text",
                source_type="TEXT",
                target=email,
                target_type="EMAIL",
                relationship="MENTIONS"
            )
        )

    # -----------------------------------------
    # URL relationships
    # -----------------------------------------

    for url in urls:

        relationships.append(
            Relationship(
                source="Input Text",
                source_type="TEXT",
                target=url,
                target_type="URL",
                relationship="MENTIONS"
            )
        )

    return relationships


# ============================================================
# CREATE GRAPH
# ============================================================

def create_graph(
    relationships: List[Relationship]
):

    nodes = []
    edges = []

    # Input node
    nodes.append(
        GraphNode(
            id="Input Text",
            type="TEXT"
        )
    )

    existing_nodes = {
        "Input Text"
    }

    for relationship in relationships:

        target = relationship.target

        if target not in existing_nodes:

            nodes.append(
                GraphNode(
                    id=target,
                    type=relationship.target_type
                )
            )

            existing_nodes.add(
                target
            )

        edges.append(
            GraphEdge(
                source=relationship.source,
                target=relationship.target,
                label=relationship.relationship
            )
        )

    return {
        "nodes": [
            node.model_dump()
            for node in nodes
        ],
        "edges": [
            edge.model_dump()
            for edge in edges
        ]
    }


# ============================================================
# ROOT ENDPOINT
# ============================================================

@app.get("/")
def root():

    return {
        "status": "online",
        "backend": "AEGISx",
        "message": "AEGISx Cyber Threat Intelligence API is running",
        "docs": "/docs",
        "health": "/health"
    }


# ============================================================
# HEALTH ENDPOINT
# ============================================================

@app.get("/health")
def health():

    return {
        "status": "healthy",
        "backend": "AEGISx",
        "ai_analysis": True,
        "threat_score": True,
        "timestamp": datetime.now(
            timezone.utc
        ).isoformat()
    }


# ============================================================
# ANALYSIS ENDPOINT
# ============================================================

@app.post(
    "/api/analysis/analyze",
    response_model=AnalysisResponse
)
def analyze_text(
    request: AnalysisRequest
):

    text = request.text.strip()

    # -----------------------------------------
    # Empty input
    # -----------------------------------------

    if not text:

        return AnalysisResponse(
            input="",
            status="analyzed",
            risk_level="LOW",
            risk_score=0,
            detected_keywords=[],
            relationships=[],
            graph={
                "nodes": [],
                "edges": []
            }
        )

    # -----------------------------------------
    # Detect threats
    # -----------------------------------------

    (
        detected_keywords,
        risk_score,
        risk_level,
        ip_addresses,
        emails,
        urls
    ) = detect_threats(text)

    # -----------------------------------------
    # Relationships
    # -----------------------------------------

    relationships = create_relationships(
        text,
        detected_keywords,
        ip_addresses,
        emails,
        urls
    )

    # -----------------------------------------
    # Graph
    # -----------------------------------------

    graph = create_graph(
        relationships
    )

    # -----------------------------------------
    # Console output
    # -----------------------------------------

    print()
    print("=" * 45)
    print("        AEGISx THREAT ANALYSIS")
    print("=" * 45)

    print("INPUT:")
    print(text)

    print()
    print("THREATS DETECTED")
    print("-" * 30)

    if detected_keywords:

        for item in detected_keywords:

            print(
                f"[ALERT] {item}"
            )

    else:

        print(
            "[INFO] No suspicious indicators detected"
        )

    print()
    print("THREAT ASSESSMENT")
    print("-" * 30)

    print(
        f"Threat Score : {risk_score}"
    )

    print(
        f"Threat Level : {risk_level}"
    )

    print("=" * 45)
    print()

    # -----------------------------------------
    # Return response
    # -----------------------------------------

    return AnalysisResponse(
        input=text,
        status="analyzed",
        risk_level=risk_level,
        risk_score=risk_score,
        detected_keywords=detected_keywords,
        relationships=relationships,
        graph=graph
    )


# ============================================================
# RUN DIRECTLY
# ============================================================

if __name__ == "__main__":

    import uvicorn

    uvicorn.run(
        "main:app",
        host="127.0.0.1",
        port=8001,
        reload=False
    )
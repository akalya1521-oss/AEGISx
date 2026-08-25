from typing import List

from fastapi import APIRouter
from pydantic import BaseModel


router = APIRouter(
    prefix="/api/analysis",
    tags=["Analysis"]
)


class AnalysisRequest(BaseModel):
    text: str


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


@router.get("/")
def analysis_home():
    return {
        "message": "AEGISx Analysis API is running",
        "status": "online"
    }


@router.post("/analyze")
def analyze(request: AnalysisRequest):

    text = request.text.lower()

    keywords = [
        "phishing",
        "ransomware",
        "botnet",
        "ddos",
        "malware",
        "credential",
        "attack"
    ]

    detected_keywords = [
        keyword
        for keyword in keywords
        if keyword in text
    ]

    # Determine risk level
    if any(
        word in detected_keywords
        for word in ["ransomware", "botnet", "ddos"]
    ):
        risk_level = "HIGH"

    elif any(
        word in detected_keywords
        for word in ["phishing", "malware"]
    ):
        risk_level = "MEDIUM"

    else:
        risk_level = "LOW"

    relationships: List[Relationship] = []

    # Botnet → DDoS
    if "botnet" in detected_keywords and "ddos" in detected_keywords:

        relationships.append(
            Relationship(
                source="Botnet",
                source_type="Threat",
                target="DDoS Attack",
                target_type="Attack",
                relationship="performs"
            )
        )

    # Phishing → Credentials
    if "phishing" in detected_keywords and "credential" in detected_keywords:

        relationships.append(
            Relationship(
                source="Phishing",
                source_type="Technique",
                target="Credentials",
                target_type="Target",
                relationship="steals"
            )
        )

    # Create graph nodes and edges
    nodes: List[GraphNode] = []
    edges: List[GraphEdge] = []

    for relationship in relationships:

        nodes.append(
            GraphNode(
                id=relationship.source,
                type=relationship.source_type
            )
        )

        nodes.append(
            GraphNode(
                id=relationship.target,
                type=relationship.target_type
            )
        )

        edges.append(
            GraphEdge(
                source=relationship.source,
                target=relationship.target,
                label=relationship.relationship
            )
        )

    # Remove duplicate nodes
    unique_nodes = {
        node.id: node
        for node in nodes
    }

    return {
        "input": request.text,
        "status": "analyzed",
        "risk_level": risk_level,
        "detected_keywords": detected_keywords,
        "relationships": [
            relationship.model_dump()
            for relationship in relationships
        ],
        "graph": {
            "nodes": [
                node.model_dump()
                for node in unique_nodes.values()
            ],
            "edges": [
                edge.model_dump()
                for edge in edges
            ]
        }
    }
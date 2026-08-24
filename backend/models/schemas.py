from pydantic import BaseModel
from typing import List, Dict


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


class GraphData(BaseModel):
    nodes: List[GraphNode]
    edges: List[GraphEdge]


class AnalysisResponse(BaseModel):
    input: str
    status: str
    risk_level: str
    detected_keywords: List[str]
    keyword_count: int
    entities: Dict[str, List[str]]
    relationships: List[Relationship]
    graph: GraphData
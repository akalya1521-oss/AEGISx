import json
from pathlib import Path
from typing import Any, Dict, List, Optional

from fastapi import FastAPI, HTTPException, Query
from fastapi.responses import FileResponse, Response
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, Field

from src.graph.loader import build_network
from src.graph.network import CriminalNetwork
from src.graph.pdf_report import build_case_report
from src.graph.storage import NetworkStorage
from src.graph.timeline import add_event, get_events
from src.graph.engine import GraphIntelligenceEngine
from src.graph.analysis import (
    most_connected_nodes,
    find_clusters,
    get_relationship,
    find_connection,
    centrality_analysis,
)
from src.graph.intelligence import (
    risk_assessment,
    explain_risk,
    suspicious_patterns,
)


app = FastAPI(
    title="AEGIS-X Graph Intelligence API",
    description="Scalable, explainable Graph & Network Intelligence Engine for Criminal Network Analysis (SIH26189)",
    version="2.0.0"
)

BASE_DIR = Path(__file__).resolve().parent
STATIC_DIR = BASE_DIR / "static"
if STATIC_DIR.exists():
    app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")


def load_seed_network() -> CriminalNetwork:
    """Create the bundled investigation network for a new local database."""
    with (BASE_DIR / "data" / "network_data.json").open(encoding="utf-8") as source:
        return build_network(json.load(source))


storage = NetworkStorage(BASE_DIR / "network.db")
if storage.is_empty():
    storage.seed(load_seed_network())

network = storage.load_network()
engine = GraphIntelligenceEngine(network)


# =====================================================================
# Pydantic Request Models
# =====================================================================

class Entity(BaseModel):
    id: str = Field(..., description="Unique entity identifier (e.g. P001)")
    name: str = Field(..., description="Entity name or alias")
    type: str = Field(..., description="Entity category (e.g. Person, Organization, Bank Account)")


class Relationship(BaseModel):
    source: str = Field(..., description="Source entity ID")
    target: str = Field(..., description="Target entity ID")
    relation: str = Field(..., description="Relationship type (e.g. associate, communicates, owns)")
    weight: Optional[float] = Field(1.0, description="Optional relationship weight")
    timestamp: Optional[str] = Field(None, description="Optional ISO timestamp")


# =====================================================================
# Home & Legacy Ingestion Endpoints
# =====================================================================

@app.get("/", include_in_schema=False)
def home():
    if (STATIC_DIR / "index.html").exists():
        return FileResponse(STATIC_DIR / "index.html")
    return {"message": "AEGIS-X Graph Intelligence API running"}


@app.post("/entities", tags=["Entities & Relationships"])
def add_entity(entity: Entity):
    if entity.id in network.graph:
        raise HTTPException(status_code=409, detail=f"Entity '{entity.id}' already exists")
    storage.add_entity(entity.id, entity.name, entity.type)
    network.add_entity(entity.id, entity.name, entity.type)
    engine.invalidate()
    add_event(
        "ENTITY ADDED",
        f"{entity.name} ({entity.id})",
        entity.id
    )
    return {
        "message": "Entity added",
        "id": entity.id
    }


@app.post("/relationships", tags=["Entities & Relationships"])
def add_relationship(rel: Relationship):
    if rel.source not in network.graph or rel.target not in network.graph:
        raise HTTPException(
            status_code=400,
            detail="Both source and target entities must exist before adding a relationship",
        )
    if network.graph.has_edge(rel.source, rel.target):
        raise HTTPException(
            status_code=409,
            detail="A relationship already exists between these entities",
        )
    storage.add_relationship(rel.source, rel.target, rel.relation)
    network.add_relationship(
        rel.source,
        rel.target,
        rel.relation,
        weight=rel.weight or 1.0,
        timestamp=rel.timestamp
    )
    engine.invalidate()
    add_event(
        "RELATIONSHIP ADDED",
        f"{rel.source} → {rel.target} ({rel.relation})",
        rel.source
    )
    return {
        "message": "Relationship added",
        "source": rel.source,
        "target": rel.target
    }


@app.get("/network", tags=["Network Snapshot"])
def get_network():
    return {
        "nodes": [
            {"id": node_id, **attributes}
            for node_id, attributes in network.graph.nodes(data=True)
        ],
        "edges": [
            {"source": source, "target": target, **attributes}
            for source, target, attributes in network.graph.edges(data=True)
        ]
    }


@app.get("/reports/case.pdf", include_in_schema=False)
def case_report():
    """Download an intelligence report for the current saved network."""
    return Response(
        content=build_case_report(network.graph),
        media_type="application/pdf",
        headers={"Content-Disposition": "attachment; filename=aegisx-case-report.pdf"},
    )


# =====================================================================
# GRAPH INTELLIGENCE API ENDPOINTS (/graph/*)
# =====================================================================

@app.get("/graph/summary", tags=["Graph Intelligence"])
def get_graph_summary():
    """Return comprehensive network statistics (nodes, edges, density, components, isolates, diameter)."""
    return engine.get_summary()


@app.get("/graph/nodes/importance", tags=["Graph Intelligence"])
def get_graph_importance(
    limit: Optional[int] = Query(None, description="Limit number of ranked entities returned")
):
    """
    Return advanced centrality metrics (degree, betweenness, closeness, PageRank)
    and composite structural importance rankings.
    """
    return {
        "centrality_metrics": engine.get_centrality(),
        "structural_rankings": engine.get_importance_rankings(limit=limit)
    }


@app.get("/graph/communities", tags=["Graph Intelligence"])
def get_graph_communities():
    """
    Return detected communities with cluster metrics (size, internal/external edges, density, core entity).
    """
    communities = engine.get_communities()
    return {
        "total_communities": len(communities),
        "communities": communities
    }


@app.get("/graph/bridges", tags=["Graph Intelligence"])
def get_graph_bridges():
    """
    Return bridge intelligence: bridge edges, articulation points, and bridge entities
    with fragmentation and removal impact analysis.
    """
    return engine.get_bridges()


@app.get("/graph/roles", tags=["Graph Intelligence"])
def get_graph_roles():
    """
    Return entity structural role classifications (NETWORK_HUB, BRIDGE_CONNECTOR,
    COMMUNITY_CORE, LOCAL_CONNECTOR, PERIPHERAL_ENTITY, ISOLATED_ENTITY) with metrics and reasons.
    """
    roles = engine.get_roles()
    return {
        "total_classified": len(roles),
        "roles": roles
    }


@app.get("/graph/patterns", tags=["Graph Intelligence"])
def get_graph_patterns():
    """
    Return detected network structural patterns (HUB_AND_SPOKE, CLOSED_TRIAD,
    DENSE_COMMUNITY, BRIDGE_PATTERN, ISOLATED_ENTITY).
    """
    patterns = engine.get_patterns()
    return {
        "total_patterns": len(patterns),
        "patterns": patterns
    }


@app.get("/graph/potential-links", tags=["Graph Intelligence"])
def get_potential_links(
    top_k: int = Query(20, description="Maximum number of candidate structural links to return")
):
    """
    Discover potential structural links between unconnected entities using graph proximity
    (Common Neighbors, Jaccard, Adamic-Adar, Preferential Attachment).
    """
    links = engine.get_potential_links(top_k=top_k)
    return {
        "label": "POTENTIAL_STRUCTURAL_LINK",
        "total_discovered": len(links),
        "candidates": links,
        "disclaimer": "Potential investigative lead based on network structure, not a confirmed relationship."
    }


@app.get("/graph/entity/{entity_id}", tags=["Graph Intelligence"])
def get_graph_entity(entity_id: str):
    """
    Return comprehensive aggregated graph intelligence for an entity:
    connections, importance metrics, role, community, bridge status, and explanation facts.
    """
    profile = engine.get_entity_profile(entity_id)
    if profile is None:
        raise HTTPException(
            status_code=404,
            detail=f"Entity '{entity_id}' not found in active network"
        )
    return profile


@app.get("/graph/path", tags=["Graph Intelligence"])
def get_graph_path(
    source: str = Query(..., description="Source entity ID"),
    target: str = Query(..., description="Target entity ID"),
    include_alternatives: bool = Query(False, description="Include alternative simple paths")
):
    """
    Find shortest relationship path with edge types and step-by-step traversal.
    """
    if source not in network.graph:
        raise HTTPException(status_code=404, detail=f"Source entity '{source}' not found")
    if target not in network.graph:
        raise HTTPException(status_code=404, detail=f"Target entity '{target}' not found")

    result = engine.get_shortest_path(source, target)
    if include_alternatives and result.get("exists"):
        result["alternative_paths"] = engine.get_all_paths(source, target, max_paths=3)
    return result


@app.get("/graph/visualization-data", tags=["Graph Intelligence"])
def get_visualization_data():
    """
    Return clean, frontend-ready JSON for interactive graph visualizers.
    """
    return engine.get_visualization_data()


# =====================================================================
# BACKWARD COMPATIBILITY ENDPOINTS (/analysis/*)
# =====================================================================

@app.get("/analysis/centrality", tags=["Legacy Analysis"])
def centrality():
    return centrality_analysis(network.graph)


@app.get("/analysis/clusters", tags=["Legacy Analysis"])
def clusters():
    result = find_clusters(network.graph)
    return {"clusters": [list(c) for c in result]}


@app.get("/analysis/risk", tags=["Legacy Analysis"])
def risk():
    return {"entities": risk_assessment(network.graph)}


@app.get("/analysis/risk/{node_id}", tags=["Legacy Analysis"])
def risk_details(node_id: str):
    result = explain_risk(network.graph, node_id)
    if result is None:
        raise HTTPException(
            status_code=404,
            detail=f"Entity '{node_id}' not found"
        )
    return result


@app.get("/analysis/most-connected", tags=["Legacy Analysis"])
def most_connected():
    return most_connected_nodes(network.graph)


@app.get("/analysis/relationship", tags=["Legacy Analysis"])
def relationship(node1: str, node2: str):
    return {
        "node1": node1,
        "node2": node2,
        "relationship": get_relationship(network.graph, node1, node2)
    }


@app.get("/analysis/connection", tags=["Legacy Analysis"])
def connection(node1: str, node2: str):
    return {
        "node1": node1,
        "node2": node2,
        "connection": find_connection(network.graph, node1, node2)
    }


@app.get("/analysis/timeline", tags=["Legacy Analysis"])
def timeline():
    return {
        "events": get_events()
    }


@app.get("/analysis/entity/{node_id}", tags=["Legacy Analysis"])
def entity_profile(node_id: str):
    if node_id not in network.graph:
        raise HTTPException(
            status_code=404,
            detail=f"Entity '{node_id}' not found"
        )

    node = network.graph.nodes[node_id]
    risks = risk_assessment(network.graph)

    risk_entry = next(
        (item for item in risks if item["id"] == node_id),
        None
    )

    connections = []
    for neighbor in network.graph.neighbors(node_id):
        edge = network.graph[node_id][neighbor]
        connections.append({
            "id": neighbor,
            "name": network.graph.nodes[neighbor].get("name", neighbor),
            "type": network.graph.nodes[neighbor].get("type", "Unknown"),
            "relationship": edge.get("relation", "linked")
        })

    degree_rank = sorted(
        network.graph.degree(),
        key=lambda item: item[1],
        reverse=True
    )

    rank = next(
        index + 1
        for index, (entity_id, _) in enumerate(degree_rank)
        if entity_id == node_id
    )

    events = get_events()
    related_events = [
        event for event in events
        if node_id.lower() in str(event).lower()
        or node.get("name", "").lower() in str(event).lower()
    ]

    return {
        "id": node_id,
        "name": node.get("name", node_id),
        "type": node.get("type", "Unknown"),
        "connections": connections,
        "connection_count": network.graph.degree(node_id),
        "influence_rank": rank,
        "risk": risk_entry,
        "recent_activity": related_events[:5]
    }


@app.get("/analysis/patterns", tags=["Legacy Analysis"])
def patterns():
    return {
        "patterns": suspicious_patterns(network.graph)
    }
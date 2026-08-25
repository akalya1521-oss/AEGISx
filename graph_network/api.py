import json
from pathlib import Path

from fastapi import FastAPI
from fastapi import HTTPException
from fastapi.responses import FileResponse, Response
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

from src.graph.loader import build_network
from src.graph.network import CriminalNetwork
from src.graph.pdf_report import build_case_report
from src.graph.storage import NetworkStorage
from src.graph.intelligence import risk_assessment, explain_risk, suspicious_patterns
from src.graph.analysis import (
    most_connected_nodes,
    find_clusters,
    get_relationship,
    find_connection,
    centrality_analysis
)
from src.graph.intelligence import risk_assessment
from src.graph.timeline import add_event, get_events
app = FastAPI(title="Criminal Network Analysis API")

BASE_DIR = Path(__file__).resolve().parent
STATIC_DIR = BASE_DIR / "static"
app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")


def load_seed_network() -> CriminalNetwork:
    """Create the bundled investigation network for a new local database."""
    with (BASE_DIR / "data" / "network_data.json").open(encoding="utf-8") as source:
        return build_network(json.load(source))


storage = NetworkStorage(BASE_DIR / "network.db")
if storage.is_empty():
    storage.seed(load_seed_network())
network = storage.load_network()


class Entity(BaseModel):
    id: str
    name: str
    type: str


class Relationship(BaseModel):
    source: str
    target: str
    relation: str


@app.get("/", include_in_schema=False)
def home():
    return FileResponse(STATIC_DIR / "index.html")


@app.post("/entities")
def add_entity(entity: Entity):
    if entity.id in network.graph:
        raise HTTPException(status_code=409, detail=f"Entity '{entity.id}' already exists")
    storage.add_entity(entity.id, entity.name, entity.type)
    network.add_entity(entity.id, entity.name, entity.type)
    add_event(
    "ENTITY ADDED",
    f"{entity.name} ({entity.id})",
    entity.id
)
    return {
        "message": "Entity added",
        "id": entity.id
    }


@app.post("/relationships")
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
        rel.relation
    )
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


@app.get("/network")
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


@app.get("/analysis/centrality")
def centrality():
    return centrality_analysis(network.graph)


@app.get("/analysis/clusters")
def clusters():
    result = find_clusters(network.graph)
    return {"clusters": [list(c) for c in result]}


@app.get("/analysis/risk")
def risk():
    return {"entities": risk_assessment(network.graph)}

@app.get("/analysis/risk/{node_id}")
def risk_details(node_id: str):
    result = explain_risk(
        network.graph,
        node_id
    )

    if result is None:
        raise HTTPException(
            status_code=404,
            detail=f"Entity '{node_id}' not found"
        )

    return result
@app.get("/analysis/most-connected")
def most_connected():
    return most_connected_nodes(network.graph)


@app.get("/analysis/relationship")
def relationship(node1: str, node2: str):
    return {
        "node1": node1,
        "node2": node2,
        "relationship": get_relationship(
            network.graph,
            node1,
            node2
        )
    }


@app.get("/analysis/connection")
def connection(node1: str, node2: str):
    return {
        "node1": node1,
        "node2": node2,
        "connection": find_connection(
            network.graph,
            node1,
            node2
        )
    }
@app.get("/analysis/timeline")
def timeline():
    return {
        "events": get_events()
    }
@app.get("/analysis/entity/{node_id}")
def entity_profile(node_id: str):
    if node_id not in network.graph:
        raise HTTPException(
            status_code=404,
            detail=f"Entity '{node_id}' not found"
        )

    node = network.graph.nodes[node_id]
    risks = risk_assessment(network.graph)

    risk = next(
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

    # Get timeline events related to this entity
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
        "risk": risk,
        "recent_activity": related_events[:5]
    }
@app.get("/analysis/patterns")
def patterns():
    return {
        "patterns": suspicious_patterns(network.graph)
    }
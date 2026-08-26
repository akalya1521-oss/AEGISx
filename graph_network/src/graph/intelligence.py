import networkx as nx
from typing import Any, Dict, List, Optional
from src.graph.centrality import calculate_centrality_metrics
from src.graph.pattern_detector import detect_structural_patterns


def top_influential_nodes(graph: nx.Graph, limit: int = 3):
    scores = nx.degree_centrality(graph)
    return sorted(
        scores.items(),
        key=lambda x: x[1],
        reverse=True
    )[:limit]


def bridge_nodes(graph: nx.Graph, limit: int = 3):
    if graph.number_of_nodes() <= 2:
        return [(str(n), 0.0) for n in list(graph.nodes())[:limit]]
    scores = nx.betweenness_centrality(graph)
    return sorted(
        scores.items(),
        key=lambda x: x[1],
        reverse=True
    )[:limit]


def high_risk_nodes(graph: nx.Graph, threshold: float = 0.5):
    if graph.number_of_nodes() == 0:
        return []
    degree = nx.degree_centrality(graph)
    betweenness = nx.betweenness_centrality(graph) if graph.number_of_nodes() > 2 else {n: 0.0 for n in graph.nodes()}

    risk_nodes = []
    for node in graph.nodes():
        risk_score = (
            degree.get(node, 0.0) * 0.6
            + betweenness.get(node, 0.0) * 0.4
        )
        if risk_score >= threshold:
            risk_nodes.append({
                "id": node,
                "risk_score": round(risk_score, 2)
            })

    return sorted(
        risk_nodes,
        key=lambda x: x["risk_score"],
        reverse=True
    )


def explain_risk(graph: nx.Graph, node: str):
    if node not in graph:
        return None

    degree = nx.degree_centrality(graph)
    betweenness = nx.betweenness_centrality(graph) if graph.number_of_nodes() > 2 else {n: 0.0 for n in graph.nodes()}

    connectivity = round(degree.get(node, 0.0) * 100)
    bridge = round(betweenness.get(node, 0.0) * 100)

    score = round(
        degree.get(node, 0.0) * 0.6 +
        betweenness.get(node, 0.0) * 0.4
    * 100)

    level = (
        "High"
        if score >= 65
        else "Medium"
        if score >= 30
        else "Low"
    )

    reasons = []
    if connectivity >= 60:
        reasons.append("Highly connected entity")
    elif connectivity >= 30:
        reasons.append("Moderately connected entity")
    else:
        reasons.append("Limited direct connections")

    if bridge >= 60:
        reasons.append("Strong bridge influence")
    elif bridge >= 30:
        reasons.append("Moderate bridge influence")
    else:
        reasons.append("Low bridge influence")

    if graph.degree(node) >= 3:
        reasons.append("Connects multiple entities")

    return {
        "id": node,
        "score": score,
        "level": level,
        "connections": graph.degree(node),
        "connectivity_score": connectivity,
        "bridge_influence": bridge,
        "reasons": reasons
    }


def risk_assessment(graph: nx.Graph):
    """Rank every entity using transparent network signals."""
    if graph.number_of_nodes() == 0:
        return []

    degree = nx.degree_centrality(graph)
    betweenness = nx.betweenness_centrality(graph) if graph.number_of_nodes() > 2 else {n: 0.0 for n in graph.nodes()}

    assessment = []
    for node in graph.nodes():
        connectivity = round(degree.get(node, 0.0) * 100)
        bridge = round(betweenness.get(node, 0.0) * 100)

        score = round(
            degree.get(node, 0.0) * 0.6 +
            betweenness.get(node, 0.0) * 0.4
        * 100)

        level = (
            "High"
            if score >= 65
            else "Medium"
            if score >= 30
            else "Low"
        )

        assessment.append({
            "id": node,
            "score": score,
            "level": level,
            "connections": graph.degree(node),
            "connectivity_score": connectivity,
            "bridge_influence": bridge
        })

    return sorted(
        assessment,
        key=lambda item: item["score"],
        reverse=True
    )


def network_summary(graph: nx.Graph):
    if graph.number_of_nodes() == 0:
        return {
            "total_entities": 0,
            "total_relationships": 0,
            "connected_groups": 0,
            "density": 0.0
        }
    undirected_g = graph.to_undirected() if graph.is_directed() else graph
    return {
        "total_entities": graph.number_of_nodes(),
        "total_relationships": graph.number_of_edges(),
        "connected_groups": nx.number_connected_components(undirected_g),
        "density": round(nx.density(graph), 3)
    }


def suspicious_patterns(graph: nx.Graph):
    """Legacy pattern detector adapter."""
    if graph.number_of_nodes() == 0:
        return []

    patterns_detected = detect_structural_patterns(graph)
    legacy_format = []

    for p in patterns_detected:
        ptype = p["pattern_type"]
        central = p.get("central_entity")
        node_name = graph.nodes[central].get("name", central) if central and central in graph else str(central)

        if ptype == "HUB_AND_SPOKE":
            legacy_format.append({
                "type": "High-connectivity hub",
                "severity": "High",
                "entity": central,
                "message": f"{node_name} has {p.get('connection_count', 0)} direct connections"
            })
        elif ptype == "BRIDGE_PATTERN":
            legacy_format.append({
                "type": "Network bridge",
                "severity": "High",
                "entity": central,
                "message": f"{node_name} connects otherwise separated parts of the network"
            })

    return legacy_format
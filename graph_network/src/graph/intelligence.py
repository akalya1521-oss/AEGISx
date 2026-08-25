import networkx as nx


def top_influential_nodes(graph, limit=3):
    scores = nx.degree_centrality(graph)

    return sorted(
        scores.items(),
        key=lambda x: x[1],
        reverse=True
    )[:limit]


def bridge_nodes(graph, limit=3):
    scores = nx.betweenness_centrality(graph)

    return sorted(
        scores.items(),
        key=lambda x: x[1],
        reverse=True
    )[:limit]


def high_risk_nodes(graph, threshold=0.5):
    degree = nx.degree_centrality(graph)
    betweenness = nx.betweenness_centrality(graph)

    risk_nodes = []

    for node in graph.nodes():
        risk_score = (
            degree[node] * 0.6
            + betweenness[node] * 0.4
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


def explain_risk(graph, node):
    if node not in graph:
        return None

    degree = nx.degree_centrality(graph)
    betweenness = nx.betweenness_centrality(graph)

    connectivity = round(degree[node] * 100)
    bridge = round(betweenness[node] * 100)

    score = round(
        degree[node] * 0.6 +
        betweenness[node] * 0.4
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
        reasons.append(
            "Highly connected entity"
        )
    elif connectivity >= 30:
        reasons.append(
            "Moderately connected entity"
        )
    else:
        reasons.append(
            "Limited direct connections"
        )

    if bridge >= 60:
        reasons.append(
            "Strong bridge influence"
        )
    elif bridge >= 30:
        reasons.append(
            "Moderate bridge influence"
        )
    else:
        reasons.append(
            "Low bridge influence"
        )

    if graph.degree(node) >= 3:
        reasons.append(
            "Connects multiple entities"
        )

    return {
        "id": node,
        "score": score,
        "level": level,
        "connections": graph.degree(node),
        "connectivity_score": connectivity,
        "bridge_influence": bridge,
        "reasons": reasons
    }


def risk_assessment(graph):
    """Rank every entity using transparent network signals."""

    if graph.number_of_nodes() == 0:
        return []

    degree = nx.degree_centrality(graph)
    betweenness = nx.betweenness_centrality(graph)

    assessment = []

    for node in graph.nodes():

        connectivity = round(
            degree[node] * 100
        )

        bridge = round(
            betweenness[node] * 100
        )

        score = round(
            degree[node] * 0.6 +
            betweenness[node] * 0.4
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


def network_summary(graph):
    return {
        "total_entities": graph.number_of_nodes(),
        "total_relationships": graph.number_of_edges(),
        "connected_groups": nx.number_connected_components(graph),
        "density": round(nx.density(graph), 3)
    }
def suspicious_patterns(graph):
    if graph.number_of_nodes() == 0:
        return []

    degree = nx.degree_centrality(graph)
    betweenness = nx.betweenness_centrality(graph)

    patterns = []

    for node in graph.nodes():
        name = graph.nodes[node].get("name", node)
        connections = graph.degree(node)

        # High connectivity hub
        if degree[node] >= 0.5:
            patterns.append({
                "type": "High-connectivity hub",
                "severity": "High",
                "entity": node,
                "message": f"{name} has {connections} direct connections"
            })

        # Bridge entity
        if betweenness[node] >= 0.3:
            patterns.append({
                "type": "Network bridge",
                "severity": "High",
                "entity": node,
                "message": f"{name} connects otherwise separated parts of the network"
            })

        # Moderate connector
        elif degree[node] >= 0.3:
            patterns.append({
                "type": "Key connector",
                "severity": "Medium",
                "entity": node,
                "message": f"{name} has {connections} network connections"
            })

        # Financial relationship
        for neighbor in graph.neighbors(node):
            relation = graph[node][neighbor].get("relation", "").lower()
            neighbor_type = graph.nodes[neighbor].get("type", "")

            if (
                relation == "owns"
                and neighbor_type == "Bank Account"
            ):
                patterns.append({
                    "type": "Financial connection",
                    "severity": "Medium",
                    "entity": node,
                    "message": f"{name} is connected to bank account {neighbor}"
                })

    return patterns
"""Feature 1: Advanced Centrality Analysis and Network Structural Importance."""

from typing import Any, Dict, List, Optional
import networkx as nx


def calculate_centrality_metrics(
    graph: nx.Graph,
    round_digits: int = 4
) -> Dict[str, Dict[str, float]]:
    """
    Calculate degree, betweenness, closeness centralities and PageRank for all nodes.

    Handles empty graphs, single-node graphs, and disconnected graphs safely.
    Returns:
        Dict mapping node_id -> {
            "degree_centrality": float,
            "betweenness_centrality": float,
            "closeness_centrality": float,
            "pagerank": float
        }
    """
    if graph.number_of_nodes() == 0:
        return {}

    n_nodes = graph.number_of_nodes()

    # Degree centrality
    deg_cent = nx.degree_centrality(graph)

    # Betweenness centrality
    if n_nodes <= 2:
        bet_cent = {node: 0.0 for node in graph.nodes()}
    else:
        bet_cent = nx.betweenness_centrality(graph, normalized=True)

    # Closeness centrality
    clo_cent = nx.closeness_centrality(graph)

    # PageRank
    if n_nodes == 1:
        pr = {list(graph.nodes())[0]: 1.0}
    else:
        try:
            pr = nx.pagerank(graph, alpha=0.85, max_iter=500)
        except Exception:
            # Fallback if power iteration does not converge or for unusual graph topologies
            pr = {node: round(1.0 / max(1, n_nodes), round_digits) for node in graph.nodes()}

    results: Dict[str, Dict[str, float]] = {}
    for node in graph.nodes():
        results[str(node)] = {
            "degree_centrality": round(deg_cent.get(node, 0.0), round_digits),
            "betweenness_centrality": round(bet_cent.get(node, 0.0), round_digits),
            "closeness_centrality": round(clo_cent.get(node, 0.0), round_digits),
            "pagerank": round(pr.get(node, 0.0), round_digits),
        }

    return results


def rank_structural_importance(
    graph: nx.Graph,
    limit: Optional[int] = None,
    weights: Optional[Dict[str, float]] = None
) -> List[Dict[str, Any]]:
    """
    Rank network entities based on composite structural importance score.

    Composite score combines degree, betweenness, closeness, and pagerank.
    Terminology strictly adheres to network structural metrics (Influence, Connectivity, Importance).
    """
    if graph.number_of_nodes() == 0:
        return []

    metrics = calculate_centrality_metrics(graph)
    w = weights or {
        "degree": 0.35,
        "betweenness": 0.35,
        "closeness": 0.15,
        "pagerank": 0.15,
    }

    # Normalize sum of weights
    w_sum = sum(w.values()) or 1.0
    w_norm = {k: v / w_sum for k, v in w.items()}

    ranked = []
    for node_id, m in metrics.items():
        node_data = graph.nodes.get(node_id, {})
        composite_score = (
            m["degree_centrality"] * w_norm["degree"]
            + m["betweenness_centrality"] * w_norm["betweenness"]
            + m["closeness_centrality"] * w_norm["closeness"]
            + m["pagerank"] * w_norm["pagerank"]
        )

        ranked.append({
            "id": node_id,
            "name": node_data.get("name", node_id),
            "type": node_data.get("type", "Unknown"),
            "direct_connections": graph.degree(node_id),
            "structural_importance_score": round(composite_score, 4),
            "metrics": m,
            "connectivity_rank_label": (
                "Primary Network Hub" if composite_score >= 0.5
                else "Key Structural Node" if composite_score >= 0.25
                else "Standard Network Member"
            )
        })

    ranked.sort(key=lambda x: (x["structural_importance_score"], x["direct_connections"]), reverse=True)

    for rank, entry in enumerate(ranked, start=1):
        entry["rank"] = rank

    if limit is not None and limit > 0:
        return ranked[:limit]
    return ranked

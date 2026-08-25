"""Feature 6: Potential Structural Link Discovery (Graph Topology Based)."""

from typing import Any, Dict, List, Optional, Tuple
import networkx as nx

INVESTIGATIVE_DISCLAIMER = (
    "Potential investigative lead based on network structure, not a confirmed relationship."
)


def discover_potential_links(
    graph: nx.Graph,
    min_common_neighbors: int = 1,
    min_score: float = 0.0,
    top_k: int = 20
) -> List[Dict[str, Any]]:
    """
    Discover potential structural links between currently unconnected entities
    using explainable graph-theoretic similarity metrics:
      - Common Neighbors
      - Jaccard Coefficient
      - Adamic-Adar Index
      - Preferential Attachment
      - Resource Allocation Index

    IMPORTANT:
      This output reflects structural graph proximity only.
      It does NOT prove real-world relationships, threat, or risk.
    """
    if graph.number_of_nodes() < 3:
        return []

    undirected_g = graph.to_undirected() if graph.is_directed() else graph

    # Non-edges in undirected graph
    non_edges: List[Tuple[Any, Any]] = list(nx.non_edges(undirected_g))
    if not non_edges:
        return []

    # 1. Jaccard Coefficient
    try:
        jaccard_scores = {
            (u, v): p for u, v, p in nx.jaccard_coefficient(undirected_g, non_edges)
        }
    except Exception:
        jaccard_scores = {}

    # 2. Adamic-Adar Index
    try:
        adamic_scores = {
            (u, v): p for u, v, p in nx.adamic_adar_index(undirected_g, non_edges)
        }
    except Exception:
        adamic_scores = {}

    # 3. Preferential Attachment
    try:
        pref_scores = {
            (u, v): p for u, v, p in nx.preferential_attachment(undirected_g, non_edges)
        }
    except Exception:
        pref_scores = {}

    # 4. Resource Allocation Index
    try:
        ra_scores = {
            (u, v): p for u, v, p in nx.resource_allocation_index(undirected_g, non_edges)
        }
    except Exception:
        ra_scores = {}

    candidates: List[Dict[str, Any]] = []

    for u, v in non_edges:
        pair = (u, v)
        # Common neighbors
        common = sorted(list(nx.common_neighbors(undirected_g, u, v)))
        num_common = len(common)

        if num_common < min_common_neighbors:
            continue

        j_score = jaccard_scores.get(pair, 0.0)
        aa_score = adamic_scores.get(pair, 0.0)
        pa_score = pref_scores.get(pair, 0.0)
        ra_score = ra_scores.get(pair, 0.0)

        # Composite structural similarity score normalized [0.0 - 1.0]
        # Weighting: 40% Jaccard, 30% Adamic-Adar normalized, 30% Resource Allocation normalized
        norm_aa = min(1.0, aa_score / 3.0) if aa_score > 0 else 0.0
        norm_ra = min(1.0, ra_score / 2.0) if ra_score > 0 else 0.0
        composite_score = round(0.4 * j_score + 0.3 * norm_aa + 0.3 * norm_ra, 3)

        # If zero composite due to edge cases, fallback to min score from common neighbors
        if composite_score == 0.0 and num_common > 0:
            composite_score = round(min(1.0, num_common * 0.25), 3)

        if composite_score < min_score:
            continue

        u_name = graph.nodes[u].get("name", u)
        v_name = graph.nodes[v].get("name", v)

        reasons = [
            f"Shares {num_common} common neighbor(s): {', '.join(common)}",
            f"Jaccard similarity: {j_score:.2f}",
        ]
        if aa_score > 0:
            reasons.append(f"Adamic-Adar structural proximity index: {aa_score:.2f}")
        if ra_score > 0:
            reasons.append(f"Resource allocation index: {ra_score:.2f}")

        candidates.append({
            "source": str(u),
            "source_name": u_name,
            "target": str(v),
            "target_name": v_name,
            "label": "POTENTIAL_STRUCTURAL_LINK",
            "score": composite_score,
            "structural_similarity_score": composite_score,
            "common_neighbors": [str(c) for c in common],
            "common_neighbors_count": num_common,
            "metrics": {
                "common_neighbors": num_common,
                "jaccard_coefficient": round(j_score, 4),
                "adamic_adar_index": round(aa_score, 4),
                "preferential_attachment": pa_score,
                "resource_allocation_index": round(ra_score, 4)
            },
            "reason": reasons,
            "reasons": reasons,
            "disclaimer": INVESTIGATIVE_DISCLAIMER
        })

    # Sort candidates by score descending
    candidates.sort(key=lambda x: (x["score"], x["common_neighbors_count"]), reverse=True)

    if top_k > 0:
        return candidates[:top_k]
    return candidates

"""Feature 7: Network Structural Pattern Detection."""

from typing import Any, Dict, List, Optional
import networkx as nx
from src.graph.centrality import calculate_centrality_metrics
from src.graph.community_analysis import detect_communities


def detect_structural_patterns(
    graph: nx.Graph,
    centrality_cache: Optional[Dict[str, Dict[str, float]]] = None,
    communities_cache: Optional[List[Dict[str, Any]]] = None
) -> List[Dict[str, Any]]:
    """
    Identify structural graph motifs and network patterns:
      1. HUB_AND_SPOKE (star-like topology with central anchor)
      2. TRIANGLE / CLOSED_TRIAD (tripartite mutual relationships)
      3. DENSE_COMMUNITY (clusters with high internal edge density >= 0.6)
      4. BRIDGE_PATTERN (critical connector node/edge between components)
      5. ISOLATED_ENTITY (disconnected nodes with degree 0)

    Terminology adheres strictly to graph theory and structural network analysis.
    """
    if graph.number_of_nodes() == 0:
        return []

    undirected_g = graph.to_undirected() if graph.is_directed() else graph
    metrics = centrality_cache or calculate_centrality_metrics(graph)
    communities = communities_cache if communities_cache is not None else detect_communities(graph)

    patterns: List[Dict[str, Any]] = []

    # 1. ISOLATED_ENTITY Patterns
    isolates = list(nx.isolates(undirected_g))
    for iso in isolates:
        iso_id = str(iso)
        patterns.append({
            "pattern": "ISOLATED_ENTITY",
            "pattern_type": "ISOLATED_ENTITY",
            "central_entity": iso_id,
            "involved_entities": [iso_id],
            "connection_count": 0,
            "supporting_metrics": {
                "degree": 0,
                "centrality": 0.0
            },
            "explanation": f"Entity {iso_id} is completely disconnected from the network (degree = 0)."
        })

    # 2. HUB_AND_SPOKE Patterns
    degrees = dict(undirected_g.degree())
    for node, deg in degrees.items():
        if deg >= 3:
            neighbors = list(undirected_g.neighbors(node))
            # Check spoke cross-connectivity (density among neighbors)
            neighbor_subg = undirected_g.subgraph(neighbors)
            neighbor_density = nx.density(neighbor_subg) if len(neighbors) > 1 else 0.0

            # Hub and spoke is characterized by high degree to neighbors with low internal cross-links
            if neighbor_density < 0.5:
                node_id = str(node)
                patterns.append({
                    "pattern": "HUB_AND_SPOKE",
                    "pattern_type": "HUB_AND_SPOKE",
                    "central_entity": node_id,
                    "connected_entities": [str(n) for n in neighbors],
                    "involved_entities": [node_id] + [str(n) for n in neighbors],
                    "connection_count": deg,
                    "supporting_metrics": {
                        "degree": deg,
                        "degree_centrality": metrics.get(node_id, {}).get("degree_centrality", 0.0),
                        "spoke_internal_density": round(neighbor_density, 3)
                    },
                    "explanation": f"Entity {node_id} acts as a central hub connecting {deg} peripheral entities with minimal cross-connections among spokes ({neighbor_density:.0%} density)."
                })

    # 3. TRIANGLE / CLOSED_TRIAD Patterns
    try:
        # Find all 3-cliques
        cliques_3 = [clq for clq in nx.enumerate_all_cliques(undirected_g) if len(clq) == 3]
        for clq in cliques_3:
            sorted_clq = sorted(str(n) for n in clq)
            patterns.append({
                "pattern": "CLOSED_TRIAD",
                "pattern_type": "CLOSED_TRIAD",
                "central_entity": sorted_clq[0],
                "involved_entities": sorted_clq,
                "connection_count": 3,
                "supporting_metrics": {
                    "clique_size": 3,
                    "triad_edges": 3
                },
                "explanation": f"Closed triad formed by mutually connected entities: {', '.join(sorted_clq)}."
            })
    except Exception:
        pass

    # 4. BRIDGE_PATTERN Patterns
    try:
        art_points = list(nx.articulation_points(undirected_g))
        for art in art_points:
            art_id = str(art)
            bet = metrics.get(art_id, {}).get("betweenness_centrality", 0.0)
            neighbors = [str(n) for n in undirected_g.neighbors(art)]
            patterns.append({
                "pattern": "BRIDGE_PATTERN",
                "pattern_type": "BRIDGE_PATTERN",
                "central_entity": art_id,
                "involved_entities": [art_id] + neighbors,
                "connection_count": len(neighbors),
                "supporting_metrics": {
                    "is_articulation_point": True,
                    "betweenness_centrality": bet
                },
                "explanation": f"Entity {art_id} serves as a structural bottleneck (articulation point with betweenness {bet:.2f}) bridging disconnected network regions."
            })
    except Exception:
        pass

    # 5. DENSE_COMMUNITY Patterns
    for comm in communities:
        if comm["size"] >= 3 and comm["density"] >= 0.5:
            patterns.append({
                "pattern": "DENSE_COMMUNITY",
                "pattern_type": "DENSE_COMMUNITY",
                "community_id": comm["community_id"],
                "central_entity": comm["central_entity"],
                "involved_entities": comm["members"],
                "connection_count": comm["internal_edges"],
                "supporting_metrics": {
                    "size": comm["size"],
                    "density": comm["density"],
                    "internal_edges": comm["internal_edges"]
                },
                "explanation": f"High density community {comm['community_id']} ({comm['density']:.0%} edge density) comprising {comm['size']} tightly knit entities around {comm['central_entity']}."
            })

    return patterns

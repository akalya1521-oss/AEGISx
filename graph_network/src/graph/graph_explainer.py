"""Feature 9: Rule-Based Graph Explanation Facts Generator."""

from typing import Any, Dict, List, Optional
import networkx as nx
from src.graph.centrality import calculate_centrality_metrics
from src.graph.role_classifier import classify_entity_roles
from src.graph.bridge_analysis import analyze_bridges
from src.graph.community_analysis import detect_communities


def generate_entity_facts(
    graph: nx.Graph,
    entity_id: str,
    centrality_cache: Optional[Dict[str, Dict[str, float]]] = None,
    roles_cache: Optional[Dict[str, Dict[str, Any]]] = None,
    bridges_cache: Optional[Dict[str, Any]] = None,
    communities_cache: Optional[List[Dict[str, Any]]] = None
) -> Dict[str, Any]:
    """
    Generate verifiable, structured graph explanation facts for an entity without requiring an LLM.
    These structured facts can be consumed by downstream AI/ML modules.
    """
    if entity_id not in graph:
        return {
            "entity": entity_id,
            "exists": False,
            "role": "UNKNOWN",
            "facts": [f"Entity '{entity_id}' is not present in the active network."]
        }

    metrics_map = centrality_cache or calculate_centrality_metrics(graph)
    roles_map = roles_cache or classify_entity_roles(graph, centrality_cache=metrics_map)
    bridge_info = bridges_cache or analyze_bridges(graph, centrality_cache=metrics_map)
    communities = communities_cache if communities_cache is not None else detect_communities(graph)

    node_data = graph.nodes[entity_id]
    name = node_data.get("name", entity_id)
    node_type = node_data.get("type", "Unknown")
    deg = graph.degree(entity_id)

    node_m = metrics_map.get(entity_id, {
        "degree_centrality": 0.0,
        "betweenness_centrality": 0.0,
        "closeness_centrality": 0.0,
        "pagerank": 0.0
    })
    deg_cent = node_m["degree_centrality"]
    bet_cent = node_m["betweenness_centrality"]
    clo_cent = node_m["closeness_centrality"]
    pr = node_m["pagerank"]

    role_info = roles_map.get(entity_id, {})
    role = role_info.get("role", "LOCAL_CONNECTOR")

    facts: List[str] = []

    # 1. Basic Connectivity Fact
    if deg == 0:
        facts.append("Completely isolated node with 0 direct relationships.")
    elif deg == 1:
        neighbor = list(graph.neighbors(entity_id))[0]
        neighbor_name = graph.nodes[neighbor].get("name", neighbor)
        facts.append(f"Peripheral node connected exclusively to {neighbor_name} ({neighbor}).")
    else:
        facts.append(f"Directly connected to {deg} entities in the network (degree centrality: {deg_cent:.2f}).")

    # 2. Structural Role & Betweenness Fact
    if bet_cent >= 0.3:
        facts.append(
            f"Exhibits dominant structural betweenness ({bet_cent:.2f}), making it a key path gateway."
        )
    elif bet_cent >= 0.15:
        facts.append(f"Moderate betweenness centrality ({bet_cent:.2f}), facilitating cross-cluster flow.")

    # 3. Bridge & Articulation Point Fact
    is_art = entity_id in bridge_info.get("articulation_points", [])
    bridge_match = next((b for b in bridge_info.get("bridge_entities", []) if b["entity"] == entity_id), None)
    if is_art:
        facts.append(
            f"Acts as an articulation point; removing this entity fragments the network into {bridge_match.get('components_after', 2)} disconnected components."
        )
    elif bridge_match:
        facts.append(
            f"Connects {bridge_match.get('connects_groups', 2)} structural network groups."
        )

    # 4. Community Context Fact
    comm_found = next((c for c in communities if entity_id in c.get("members", [])), None)
    if comm_found:
        is_core = comm_found.get("central_entity") == entity_id
        if is_core and comm_found.get("size", 0) > 2:
            facts.append(
                f"Serves as the structural core of Community {comm_found['community_id']} ({comm_found['size']} members, density {comm_found['density']:.2f})."
            )
        else:
            facts.append(
                f"Member of Community {comm_found['community_id']} alongside {comm_found['size'] - 1} other entities."
            )

    # 5. PageRank & Global Influence Fact
    if pr > 0.2:
        facts.append(f"High PageRank score of {pr:.3f}, indicating strong structural authority across recursive links.")

    # 6. Relationship Breakdown Fact
    neighbors = list(graph.neighbors(entity_id))
    rel_types = set()
    for nb in neighbors:
        rel = graph.get_edge_data(entity_id, nb, default={}).get("relation")
        if rel:
            rel_types.add(rel)
    if rel_types:
        facts.append(f"Involved in {len(rel_types)} relationship type(s): {', '.join(sorted(rel_types))}.")

    return {
        "entity": entity_id,
        "name": name,
        "type": node_type,
        "role": role,
        "role_label": role.replace("_", " ").title(),
        "structural_metrics": {
            "degree": deg,
            "degree_centrality": deg_cent,
            "betweenness_centrality": bet_cent,
            "closeness_centrality": clo_cent,
            "pagerank": pr,
            "is_articulation_point": is_art
        },
        "facts": facts
    }


def generate_all_explanation_facts(
    graph: nx.Graph,
    centrality_cache: Optional[Dict[str, Dict[str, float]]] = None,
    roles_cache: Optional[Dict[str, Dict[str, Any]]] = None,
    bridges_cache: Optional[Dict[str, Any]] = None,
    communities_cache: Optional[List[Dict[str, Any]]] = None
) -> Dict[str, Dict[str, Any]]:
    """Generate graph explanation facts for all nodes in the network."""
    metrics_map = centrality_cache or calculate_centrality_metrics(graph)
    roles_map = roles_cache or classify_entity_roles(graph, centrality_cache=metrics_map)
    bridge_info = bridges_cache or analyze_bridges(graph, centrality_cache=metrics_map)
    communities = communities_cache if communities_cache is not None else detect_communities(graph)

    return {
        str(node): generate_entity_facts(
            graph,
            str(node),
            centrality_cache=metrics_map,
            roles_cache=roles_map,
            bridges_cache=bridge_info,
            communities_cache=communities
        )
        for node in graph.nodes()
    }

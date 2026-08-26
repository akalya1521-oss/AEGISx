"""Feature 2: Entity Role Classification based solely on Graph Structure."""

from typing import Any, Dict, List, Optional
import networkx as nx
from src.graph.centrality import calculate_centrality_metrics


def classify_entity_roles(
    graph: nx.Graph,
    centrality_cache: Optional[Dict[str, Dict[str, float]]] = None,
    communities_cache: Optional[List[List[str]]] = None
) -> Dict[str, Dict[str, Any]]:
    """
    Automatically classify entities based solely on graph structure.

    Roles:
      - NETWORK_HUB: High degree centrality compared with network.
      - BRIDGE_CONNECTOR: High betweenness centrality and/or articulation point connecting groups.
      - COMMUNITY_CORE: Most central entity inside a dense community.
      - LOCAL_CONNECTOR: Moderate connectivity and local importance.
      - PERIPHERAL_ENTITY: Low connectivity, degree 1, connected at network edge.
      - ISOLATED_ENTITY: Degree 0.

    Returns:
      Dict mapping node_id -> {
        "entity": str,
        "role": str,
        "role_label": str,
        "metrics": dict,
        "reasons": list[str]
      }
    """
    if graph.number_of_nodes() == 0:
        return {}

    metrics = centrality_cache or calculate_centrality_metrics(graph)
    articulation_points = set()
    if graph.number_of_nodes() > 2:
        try:
            # Articulation points on undirected graph
            undirected_g = graph.to_undirected() if graph.is_directed() else graph
            articulation_points = set(nx.articulation_points(undirected_g))
        except Exception:
            articulation_points = set()

    # Find community core candidates if communities available
    community_cores = set()
    if communities_cache:
        for comm in communities_cache:
            if len(comm) >= 3:
                # Find member with highest degree inside subgraph
                subg = graph.subgraph(comm)
                best_internal = max(subg.nodes(), key=lambda n: subg.degree(n), default=None)
                if best_internal and subg.degree(best_internal) >= 2:
                    community_cores.add(best_internal)

    n_nodes = graph.number_of_nodes()
    degrees = dict(graph.degree())
    max_deg = max(degrees.values()) if degrees else 0
    avg_deg = sum(degrees.values()) / max(1, n_nodes)

    roles: Dict[str, Dict[str, Any]] = {}

    for node in graph.nodes():
        node_id = str(node)
        deg = degrees.get(node, 0)
        node_m = metrics.get(node_id, {
            "degree_centrality": 0.0,
            "betweenness_centrality": 0.0,
            "closeness_centrality": 0.0,
            "pagerank": 0.0
        })
        deg_cent = node_m["degree_centrality"]
        bet_cent = node_m["betweenness_centrality"]
        clo_cent = node_m["closeness_centrality"]

        role = "LOCAL_CONNECTOR"
        reasons: List[str] = []

        # 1. ISOLATED ENTITY
        if deg == 0:
            role = "ISOLATED_ENTITY"
            reasons.append("Zero active connections (degree = 0)")
            reasons.append("Disconnected from all other network entities")

        # 2. PERIPHERAL ENTITY
        elif deg == 1 and not (node in articulation_points and bet_cent > 0.3):
            role = "PERIPHERAL_ENTITY"
            reasons.append("Low connectivity with only 1 direct connection")
            reasons.append("Positioned on the outer boundary/periphery of the network")

        # 3. BRIDGE CONNECTOR
        # High betweenness or articulation point with substantial betweenness
        elif (bet_cent >= 0.25 and bet_cent > 0.0) or (node in articulation_points and bet_cent >= 0.15):
            role = "BRIDGE_CONNECTOR"
            reasons.append(f"High betweenness centrality ({bet_cent:.2f})")
            if node in articulation_points:
                reasons.append("Critical articulation point; removal may fragment the network")
            reasons.append("Sits on major structural paths connecting otherwise separated groups")

        # 4. NETWORK HUB
        # High degree compared to network or degree centrality >= 0.5
        elif (deg_cent >= 0.5 and deg >= 3) or (deg == max_deg and deg >= 3 and deg > avg_deg * 1.3):
            role = "NETWORK_HUB"
            reasons.append(f"High direct connectivity with {deg} connections (degree centrality {deg_cent:.2f})")
            reasons.append("Acts as a primary structural anchor in the network")
            if deg == max_deg:
                reasons.append("Holds the highest number of direct links in the graph")

        # 5. COMMUNITY CORE
        elif node in community_cores and deg >= 2:
            role = "COMMUNITY_CORE"
            reasons.append("Highest internal connectivity inside its local community cluster")
            reasons.append("Serves as a structural nucleus for surrounding cluster members")

        # 6. LOCAL CONNECTOR
        else:
            role = "LOCAL_CONNECTOR"
            reasons.append(f"Moderate connectivity with {deg} direct relationships")
            reasons.append("Facilitates local information flow within its immediate neighborhood")

        roles[node_id] = {
            "entity": node_id,
            "role": role,
            "role_label": role.replace("_", " ").title(),
            "metrics": {
                "degree": deg,
                "degree_centrality": deg_cent,
                "betweenness_centrality": bet_cent,
                "closeness_centrality": clo_cent,
                "is_articulation_point": node in articulation_points,
            },
            "reasons": reasons
        }

    return roles

"""Feature 4: Scalable Community Detection and Cluster Analysis."""

from typing import Any, Dict, List, Optional
import networkx as nx


def detect_communities(
    graph: nx.Graph,
    seed: int = 42
) -> List[Dict[str, Any]]:
    """
    Detect communities in the network using Louvain modularity optimization
    with fallback to greedy modularity or connected components for small/disconnected graphs.

    Returns for each community:
      - community_id: e.g. 'C1'
      - members: list of entity IDs
      - size: number of members
      - density: internal subgraph density
      - internal_edges: count of edges within the community
      - external_edges: count of edges connecting to outside members
      - central_entity: entity with highest internal connectivity
    """
    if graph.number_of_nodes() == 0:
        return []

    undirected_g = graph.to_undirected() if graph.is_directed() else graph

    # Use Louvain communities algorithm; fallback if not applicable
    raw_communities = []
    if undirected_g.number_of_edges() > 0:
        try:
            raw_communities = list(nx.community.louvain_communities(undirected_g, seed=seed))
        except Exception:
            try:
                raw_communities = list(nx.community.greedy_modularity_communities(undirected_g))
            except Exception:
                raw_communities = list(nx.connected_components(undirected_g))
    else:
        # Isolated nodes: each node forms its own community
        raw_communities = [{node} for node in undirected_g.nodes()]

    # Sort communities by size descending
    raw_communities.sort(key=lambda c: len(c), reverse=True)

    result: List[Dict[str, Any]] = []

    for index, comm_set in enumerate(raw_communities, start=1):
        members = sorted(str(m) for m in comm_set)
        subg = undirected_g.subgraph(members)

        size = len(members)
        internal_edges = subg.number_of_edges()

        # External edges: count edges incident to members going outside
        external_count = 0
        for m in members:
            for neighbor in undirected_g.neighbors(m):
                if neighbor not in comm_set:
                    external_count += 1
        # In undirected graph, each external edge is counted once per member
        external_edges = external_count

        density = round(float(nx.density(subg)), 4) if size > 1 else 1.0

        # Central entity within community: highest internal degree
        if size == 1:
            central_entity = members[0]
        else:
            central_entity = max(
                members,
                key=lambda n: (subg.degree(n), undirected_g.degree(n))
            )

        core_name = graph.nodes[central_entity].get("name", central_entity)

        result.append({
            "community_id": f"C{index}",
            "size": size,
            "members": members,
            "density": density,
            "internal_edges": internal_edges,
            "external_edges": external_edges,
            "central_entity": central_entity,
            "central_entity_name": core_name,
            "description": f"Community C{index} comprises {size} entities centered around {core_name} ({central_entity}) with internal density {density:.2f}."
        })

    return result


def get_node_community_map(communities: List[Dict[str, Any]]) -> Dict[str, str]:
    """Map each node ID to its community ID."""
    node_to_comm = {}
    for comm in communities:
        for member in comm.get("members", []):
            node_to_comm[member] = comm["community_id"]
    return node_to_comm

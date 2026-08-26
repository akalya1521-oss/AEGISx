"""Feature 8: Network Structural Statistics and Global Topology Metrics."""

from typing import Any, Dict, Optional
import networkx as nx
from src.graph.community_analysis import detect_communities


def calculate_network_statistics(
    graph: nx.Graph,
    communities_cache: Optional[Any] = None
) -> Dict[str, Any]:
    """
    Compute comprehensive graph topology statistics.

    Safely handles:
      - Empty graphs (0 nodes)
      - Single-node graphs (1 node)
      - Disconnected graphs with multiple components
      - Directed and undirected structures
    """
    total_nodes = graph.number_of_nodes()
    total_edges = graph.number_of_edges()

    if total_nodes == 0:
        return {
            "total_nodes": 0,
            "total_edges": 0,
            "average_degree": 0.0,
            "graph_density": 0.0,
            "number_of_connected_components": 0,
            "largest_component_size": 0,
            "number_of_isolated_nodes": 0,
            "number_of_communities": 0,
            "average_clustering_coefficient": 0.0,
            "diameter": None,
            "average_shortest_path_length": None,
            "is_connected": False,
            "status": "Empty network"
        }

    undirected_g = graph.to_undirected() if graph.is_directed() else graph

    # Degree metrics
    degrees = [d for _, d in graph.degree()]
    avg_degree = round(sum(degrees) / total_nodes, 3)
    density = round(float(nx.density(graph)), 4)

    # Connected components
    components = list(nx.connected_components(undirected_g))
    num_components = len(components)
    largest_comp_nodes = max(components, key=len) if components else set()
    largest_comp_size = len(largest_comp_nodes)
    num_isolates = len(list(nx.isolates(undirected_g)))
    is_connected = (num_components == 1 and total_nodes > 0)

    # Communities count
    if communities_cache is not None:
        num_communities = len(communities_cache)
    else:
        num_communities = len(detect_communities(graph))

    # Clustering coefficient
    try:
        avg_clustering = round(float(nx.average_clustering(undirected_g)), 4)
    except Exception:
        avg_clustering = 0.0

    # Diameter and average shortest path length
    # Computed safely on the largest connected component if size > 1
    diameter = None
    avg_path_length = None

    if largest_comp_size > 1:
        largest_subg = undirected_g.subgraph(largest_comp_nodes)
        try:
            diameter = int(nx.diameter(largest_subg))
            avg_path_length = round(float(nx.average_shortest_path_length(largest_subg)), 3)
        except Exception:
            diameter = None
            avg_path_length = None

    return {
        "total_nodes": total_nodes,
        "total_edges": total_edges,
        "average_degree": avg_degree,
        "graph_density": density,
        "number_of_connected_components": num_components,
        "largest_component_size": largest_comp_size,
        "largest_component_percentage": round((largest_comp_size / total_nodes) * 100, 1),
        "number_of_isolated_nodes": num_isolates,
        "number_of_communities": num_communities,
        "average_clustering_coefficient": avg_clustering,
        "diameter": diameter,
        "average_shortest_path_length": avg_path_length,
        "is_connected": is_connected,
    }

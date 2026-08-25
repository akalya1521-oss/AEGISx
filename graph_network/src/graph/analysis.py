import networkx as nx
from typing import Any, Dict, List, Optional
from src.graph.centrality import calculate_centrality_metrics
from src.graph.community_analysis import detect_communities
from src.graph.path_analysis import find_shortest_path


def most_connected_nodes(graph: nx.Graph) -> List[tuple]:
    """Return nodes ordered by degree descending."""
    return sorted(graph.degree(), key=lambda x: x[1], reverse=True)


def find_clusters(graph: nx.Graph) -> List[set]:
    """Return connected components / clusters of the graph."""
    if graph.number_of_nodes() == 0:
        return []
    undirected_g = graph.to_undirected() if graph.is_directed() else graph
    return list(nx.connected_components(undirected_g))


def get_relationship(graph: nx.Graph, node1: str, node2: str) -> Optional[str]:
    """Return relationship label between two entities if edge exists."""
    if graph.has_edge(node1, node2):
        return graph[node1][node2].get("relation")
    return None


def find_connection(graph: nx.Graph, node1: str, node2: str) -> Optional[List[str]]:
    """Return shortest path node list between node1 and node2 or None."""
    result = find_shortest_path(graph, node1, node2)
    if result.get("exists") and result.get("path_nodes"):
        return result["path_nodes"]
    return None


def centrality_analysis(graph: nx.Graph) -> Dict[str, Dict[str, float]]:
    """Legacy centrality analysis format returning degree, betweenness, closeness rounded to 2 decimals."""
    if graph.number_of_nodes() == 0:
        return {}

    metrics = calculate_centrality_metrics(graph, round_digits=2)
    results = {}
    for node, values in metrics.items():
        results[node] = {
            "degree": values["degree_centrality"],
            "betweenness": values["betweenness_centrality"],
            "closeness": values["closeness_centrality"],
        }
    return results
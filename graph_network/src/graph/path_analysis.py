"""Feature 5: Relationship Path Analysis and Multi-Hop Traversal."""

from typing import Any, Dict, List, Optional
import networkx as nx


def find_shortest_path(
    graph: nx.Graph,
    source: str,
    target: str
) -> Dict[str, Any]:
    """
    Find the shortest relationship path between two entities, including edge metadata.

    Returns:
      - exists: bool
      - source: str
      - target: str
      - path: list of detailed steps
      - path_nodes: list of node IDs in sequence
      - path_length: number of hops
      - total_weight: sum of edge weights
    """
    if source not in graph:
        return {
            "exists": False,
            "error": f"Source entity '{source}' not found in network",
            "source": source,
            "target": target,
            "path": [],
            "path_nodes": [],
            "path_length": 0
        }

    if target not in graph:
        return {
            "exists": False,
            "error": f"Target entity '{target}' not found in network",
            "source": source,
            "target": target,
            "path": [],
            "path_nodes": [],
            "path_length": 0
        }

    if source == target:
        node_name = graph.nodes[source].get("name", source)
        return {
            "exists": True,
            "source": source,
            "target": target,
            "path": [{"node": source, "name": node_name}],
            "path_nodes": [source],
            "path_length": 0,
            "total_weight": 0.0
        }

    try:
        raw_path = nx.shortest_path(graph, source=source, target=target)
    except (nx.NetworkXNoPath, nx.NodeNotFound):
        return {
            "exists": False,
            "message": f"No connected relationship path exists between '{source}' and '{target}'.",
            "source": source,
            "target": target,
            "path": [],
            "path_nodes": [],
            "path_length": 0
        }

    # Format structured path steps
    steps: List[Dict[str, Any]] = [
        {
            "node": raw_path[0],
            "name": graph.nodes[raw_path[0]].get("name", raw_path[0]),
            "type": graph.nodes[raw_path[0]].get("type", "Unknown")
        }
    ]

    total_weight = 0.0
    for i in range(len(raw_path) - 1):
        u = raw_path[i]
        v = raw_path[i + 1]
        edge_data = graph.get_edge_data(u, v, default={})
        rel = edge_data.get("relation", "linked")
        w = float(edge_data.get("weight", 1.0))
        total_weight += w

        steps.append({
            "relationship": rel,
            "weight": w,
            "target": v,
            "target_name": graph.nodes[v].get("name", v),
            "target_type": graph.nodes[v].get("type", "Unknown")
        })

    return {
        "exists": True,
        "source": source,
        "target": target,
        "path": steps,
        "path_nodes": raw_path,
        "path_length": len(raw_path) - 1,
        "total_weight": round(total_weight, 2)
    }


def find_all_paths(
    graph: nx.Graph,
    source: str,
    target: str,
    max_paths: int = 5,
    cutoff: int = 5
) -> List[Dict[str, Any]]:
    """
    Find multiple alternative simple paths with safe computational limits.
    """
    if source not in graph or target not in graph or source == target:
        return []

    try:
        path_generator = nx.all_simple_paths(graph, source=source, target=target, cutoff=cutoff)
        collected_paths: List[Dict[str, Any]] = []

        for p_nodes in path_generator:
            steps: List[Dict[str, Any]] = [
                {
                    "node": p_nodes[0],
                    "name": graph.nodes[p_nodes[0]].get("name", p_nodes[0])
                }
            ]
            for i in range(len(p_nodes) - 1):
                u = p_nodes[i]
                v = p_nodes[i + 1]
                edge_data = graph.get_edge_data(u, v, default={})
                steps.append({
                    "relationship": edge_data.get("relation", "linked"),
                    "target": v,
                    "target_name": graph.nodes[v].get("name", v)
                })

            collected_paths.append({
                "path_nodes": p_nodes,
                "path_length": len(p_nodes) - 1,
                "path": steps
            })

            if len(collected_paths) >= max_paths:
                break

        return collected_paths
    except Exception:
        return []

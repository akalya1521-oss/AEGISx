"""Feature 3: Advanced Bridge Intelligence and Cut-Vertex Analysis."""

from typing import Any, Dict, List, Optional
import networkx as nx
from src.graph.centrality import calculate_centrality_metrics


def analyze_bridges(
    graph: nx.Graph,
    centrality_cache: Optional[Dict[str, Dict[str, float]]] = None
) -> Dict[str, Any]:
    """
    Detect bridge edges, articulation points, and structural bridge entities.

    Evaluates:
      - Bridge edges (edges whose removal increases connected components).
      - Articulation points / cut-vertices.
      - Impact on component count before vs after removal.
      - Communities/neighborhood groups bridged.
    """
    if graph.number_of_nodes() == 0:
        return {
            "bridge_entities": [],
            "bridge_edges": [],
            "articulation_points": [],
            "total_bridges": 0,
            "total_articulation_points": 0
        }

    undirected_g = graph.to_undirected() if graph.is_directed() else graph.copy()
    metrics = centrality_cache or calculate_centrality_metrics(graph)

    # 1. Bridge Edges
    raw_bridges = list(nx.bridges(undirected_g))
    bridge_edges = []
    for u, v in raw_bridges:
        edge_data = graph.get_edge_data(u, v, default={})
        bridge_edges.append({
            "source": str(u),
            "target": str(v),
            "relation": edge_data.get("relation", "linked"),
            "weight": edge_data.get("weight", 1.0),
            "explanation": f"Removing link between {u} and {v} disconnects network clusters."
        })

    # 2. Articulation Points (Cut-Vertices)
    art_points = list(nx.articulation_points(undirected_g))
    art_set = set(art_points)

    base_components = nx.number_connected_components(undirected_g)

    # 3. Structural Bridge Entities
    bridge_entities = []
    for node in graph.nodes():
        node_id = str(node)
        bet_cent = metrics.get(node_id, {}).get("betweenness_centrality", 0.0)
        is_art = node in art_set

        # Consider as bridge entity if it's an articulation point or has significant betweenness
        if is_art or bet_cent >= 0.2:
            # Simulate removal impact
            temp_g = undirected_g.copy()
            temp_g.remove_node(node)
            components_after = nx.number_connected_components(temp_g)
            components_delta = components_after - base_components

            # Determine distinct neighbor components after node removal
            neighbors = list(undirected_g.neighbors(node))
            connected_subgroups = set()
            for neighbor in neighbors:
                for c_idx, comp in enumerate(nx.connected_components(temp_g)):
                    if neighbor in comp:
                        connected_subgroups.add(c_idx)
                        break

            connects_groups = max(len(connected_subgroups), 2 if is_art else 1)

            if is_art or components_delta > 0:
                removal_impact = "Network will fragment into separate components"
                severity = "HIGH"
            elif bet_cent >= 0.3:
                removal_impact = "Increases path lengths significantly across clusters"
                severity = "MODERATE"
            else:
                removal_impact = "Minor structural path disruption"
                severity = "LOW"

            reasons = []
            if is_art:
                reasons.append(
                    f"Removing this entity directly fractures the network from {base_components} to {components_after} components"
                )
            if bet_cent > 0:
                reasons.append(f"High betweenness centrality of {bet_cent:.2f}")
            reasons.append(f"Bridges {connects_groups} distinct local network groups")

            bridge_entities.append({
                "entity": node_id,
                "name": graph.nodes[node].get("name", node_id),
                "type": "BRIDGE_CONNECTOR",
                "is_articulation_point": is_art,
                "betweenness_centrality": bet_cent,
                "connects_groups": connects_groups,
                "components_before": base_components,
                "components_after": components_after,
                "removal_impact": removal_impact,
                "impact_severity": severity,
                "reason": "; ".join(reasons),
                "reasons": reasons
            })

    # Sort bridge entities by betweenness and component fragmentation impact
    bridge_entities.sort(
        key=lambda x: (x["is_articulation_point"], x["components_after"], x["betweenness_centrality"]),
        reverse=True
    )

    return {
        "bridge_entities": bridge_entities,
        "bridge_edges": bridge_edges,
        "articulation_points": [str(n) for n in art_points],
        "total_bridges": len(bridge_edges),
        "total_articulation_points": len(art_points)
    }

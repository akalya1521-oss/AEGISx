"""Unified Graph Intelligence Engine providing lazy evaluation, caching, and analytics aggregation."""

from typing import Any, Dict, List, Optional
import networkx as nx
from src.graph.network import CriminalNetwork
from src.graph.centrality import calculate_centrality_metrics, rank_structural_importance
from src.graph.role_classifier import classify_entity_roles
from src.graph.bridge_analysis import analyze_bridges
from src.graph.community_analysis import detect_communities, get_node_community_map
from src.graph.path_analysis import find_shortest_path, find_all_paths
from src.graph.link_prediction import discover_potential_links
from src.graph.pattern_detector import detect_structural_patterns
from src.graph.graph_statistics import calculate_network_statistics
from src.graph.graph_explainer import generate_entity_facts, generate_all_explanation_facts


class GraphIntelligenceEngine:
    """
    High-performance, explainable Graph Intelligence Engine.
    Implements intelligent in-memory caching to scale across large queries.
    """

    def __init__(self, network: CriminalNetwork):
        self.network = network
        self._cached_version = -1
        self._cache: Dict[str, Any] = {}

    @property
    def graph(self) -> nx.Graph:
        return self.network.get_network()

    def _ensure_cache(self) -> None:
        """Lazily compute and cache core graph metrics if graph version has changed."""
        current_version = self.network.version
        if self._cached_version != current_version:
            g = self.graph
            centrality = calculate_centrality_metrics(g)
            importance = rank_structural_importance(g)
            communities = detect_communities(g)
            node_community = get_node_community_map(communities)
            roles = classify_entity_roles(
                g,
                centrality_cache=centrality,
                communities_cache=[c["members"] for c in communities]
            )
            bridges = analyze_bridges(g, centrality_cache=centrality)
            patterns = detect_structural_patterns(
                g,
                centrality_cache=centrality,
                communities_cache=communities
            )
            statistics = calculate_network_statistics(g, communities_cache=communities)
            potential_links = discover_potential_links(g)
            facts = generate_all_explanation_facts(
                g,
                centrality_cache=centrality,
                roles_cache=roles,
                bridges_cache=bridges,
                communities_cache=communities
            )

            self._cache = {
                "centrality": centrality,
                "importance": importance,
                "communities": communities,
                "node_community": node_community,
                "roles": roles,
                "bridges": bridges,
                "patterns": patterns,
                "statistics": statistics,
                "potential_links": potential_links,
                "facts": facts,
            }
            self._cached_version = current_version

    def invalidate(self) -> None:
        """Force cache invalidation."""
        self._cached_version = -1
        self._cache.clear()

    # Public API query methods
    def get_summary(self) -> Dict[str, Any]:
        """Return comprehensive network statistics."""
        self._ensure_cache()
        return self._cache["statistics"]

    def get_centrality(self) -> Dict[str, Dict[str, float]]:
        """Return raw centrality metrics for all nodes."""
        self._ensure_cache()
        return self._cache["centrality"]

    def get_importance_rankings(self, limit: Optional[int] = None) -> List[Dict[str, Any]]:
        """Return ranked list of structurally important entities."""
        self._ensure_cache()
        rankings = self._cache["importance"]
        return rankings[:limit] if limit else rankings

    def get_communities(self) -> List[Dict[str, Any]]:
        """Return detected communities and cluster metrics."""
        self._ensure_cache()
        return self._cache["communities"]

    def get_bridges(self) -> Dict[str, Any]:
        """Return bridge intelligence and articulation points."""
        self._ensure_cache()
        return self._cache["bridges"]

    def get_roles(self) -> Dict[str, Dict[str, Any]]:
        """Return structural roles for all entities."""
        self._ensure_cache()
        return self._cache["roles"]

    def get_patterns(self) -> List[Dict[str, Any]]:
        """Return detected structural network patterns."""
        self._ensure_cache()
        return self._cache["patterns"]

    def get_potential_links(self, top_k: int = 20) -> List[Dict[str, Any]]:
        """Return potential structural link leads with investigative disclaimers."""
        self._ensure_cache()
        links = self._cache["potential_links"]
        return links[:top_k] if top_k > 0 else links

    def get_shortest_path(self, source: str, target: str) -> Dict[str, Any]:
        """Compute shortest relationship path between two entities."""
        return find_shortest_path(self.graph, source, target)

    def get_all_paths(self, source: str, target: str, max_paths: int = 5) -> List[Dict[str, Any]]:
        """Compute bounded alternative simple paths."""
        return find_all_paths(self.graph, source, target, max_paths=max_paths)

    def get_entity_profile(self, entity_id: str) -> Optional[Dict[str, Any]]:
        """
        Aggregate comprehensive structural intelligence for a single entity.
        Combines connections, importance metrics, role, community, bridge status, and explanation facts.
        """
        if entity_id not in self.graph:
            return None

        self._ensure_cache()
        g = self.graph
        node_data = g.nodes[entity_id]

        # Direct connections with edge metadata
        connections = []
        for neighbor in g.neighbors(entity_id):
            edge_data = g.get_edge_data(entity_id, neighbor, default={})
            connections.append({
                "id": str(neighbor),
                "name": g.nodes[neighbor].get("name", neighbor),
                "type": g.nodes[neighbor].get("type", "Unknown"),
                "relationship": edge_data.get("relation", "linked"),
                "weight": edge_data.get("weight", 1.0)
            })

        # Community info
        comm_id = self._cache["node_community"].get(entity_id, "N/A")
        comm_obj = next((c for c in self._cache["communities"] if c["community_id"] == comm_id), None)

        # Bridge info
        bridge_match = next((b for b in self._cache["bridges"]["bridge_entities"] if b["entity"] == entity_id), None)
        is_art = entity_id in self._cache["bridges"]["articulation_points"]

        return {
            "entity": entity_id,
            "id": entity_id,
            "name": node_data.get("name", entity_id),
            "type": node_data.get("type", "Unknown"),
            "connection_count": g.degree(entity_id),
            "connections": connections,
            "importance_metrics": self._cache["centrality"].get(entity_id, {}),
            "role": self._cache["roles"].get(entity_id, {}),
            "community": comm_obj or {"community_id": comm_id},
            "bridge_information": {
                "is_bridge": bridge_match is not None,
                "is_articulation_point": is_art,
                "connects_groups": bridge_match.get("connects_groups", 1) if bridge_match else 1,
                "removal_impact": bridge_match.get("removal_impact", "None") if bridge_match else "None",
            },
            "explanation_facts": self._cache["facts"].get(entity_id, {}).get("facts", [])
        }

    def get_visualization_data(self) -> Dict[str, Any]:
        """
        Return clean, structured JSON ready for frontend graph visualizers.
        Nodes contain ID, label, type, role, community, and degree.
        Edges contain source, target, relationship, and weight.
        """
        self._ensure_cache()
        g = self.graph
        roles_map = self._cache["roles"]
        node_comm_map = self._cache["node_community"]
        importance_map = self._cache["centrality"]

        nodes = []
        for node_id, data in g.nodes(data=True):
            nid = str(node_id)
            role_entry = roles_map.get(nid, {})
            nodes.append({
                "id": nid,
                "label": data.get("name", nid),
                "name": data.get("name", nid),
                "type": data.get("type", "Unknown"),
                "role": role_entry.get("role", "LOCAL_CONNECTOR"),
                "role_label": role_entry.get("role_label", "Local Connector"),
                "community": node_comm_map.get(nid, "C1"),
                "degree": g.degree(node_id),
                "importance_score": importance_map.get(nid, {}).get("degree_centrality", 0.0)
            })

        edges = []
        for u, v, data in g.edges(data=True):
            edges.append({
                "source": str(u),
                "target": str(v),
                "relationship": data.get("relation", "linked"),
                "weight": data.get("weight", 1.0),
                "timestamp": data.get("timestamp") or data.get("created_at")
            })

        return {
            "nodes": nodes,
            "edges": edges,
            "summary": {
                "total_nodes": len(nodes),
                "total_edges": len(edges),
                "total_communities": len(self._cache["communities"]),
            }
        }

"""Comprehensive test suite for AEGIS-X Graph Intelligence Engine (SIH26189)."""

import json
import unittest
from pathlib import Path
import networkx as nx
from fastapi.testclient import TestClient

from src.graph.network import CriminalNetwork
from src.graph.loader import build_network
from src.graph.centrality import calculate_centrality_metrics, rank_structural_importance
from src.graph.role_classifier import classify_entity_roles
from src.graph.bridge_analysis import analyze_bridges
from src.graph.community_analysis import detect_communities
from src.graph.path_analysis import find_shortest_path, find_all_paths
from src.graph.link_prediction import discover_potential_links
from src.graph.pattern_detector import detect_structural_patterns
from src.graph.graph_statistics import calculate_network_statistics
from src.graph.graph_explainer import generate_entity_facts
from src.graph.temporal import filter_graph_by_time
from src.graph.engine import GraphIntelligenceEngine
import api


class TestGraphIntelligenceEngine(unittest.TestCase):

    def setUp(self):
        self.base_dir = Path(__file__).resolve().parent.parent
        with open(self.base_dir / "data" / "network_data.json", "r", encoding="utf-8") as f:
            self.raw_data = json.load(f)
        self.network = build_network(self.raw_data)
        self.engine = GraphIntelligenceEngine(self.network)

    # -----------------------------------------------------------------
    # Feature 1: Centrality & PageRank
    # -----------------------------------------------------------------
    def test_centrality_calculation(self):
        metrics = calculate_centrality_metrics(self.network.graph)
        self.assertIn("P002", metrics)
        self.assertIn("degree_centrality", metrics["P002"])
        self.assertIn("betweenness_centrality", metrics["P002"])
        self.assertIn("closeness_centrality", metrics["P002"])
        self.assertIn("pagerank", metrics["P002"])

        # P002 has 3 connections in a 5-node graph -> degree centrality = 3 / 4 = 0.75
        self.assertEqual(metrics["P002"]["degree_centrality"], 0.75)
        self.assertGreater(metrics["P002"]["betweenness_centrality"], 0.5)

    def test_structural_importance_rankings(self):
        rankings = rank_structural_importance(self.network.graph)
        self.assertEqual(len(rankings), 5)
        # P002 should be the top ranked entity
        self.assertEqual(rankings[0]["id"], "P002")
        self.assertEqual(rankings[0]["rank"], 1)
        self.assertIn("structural_importance_score", rankings[0])

    # -----------------------------------------------------------------
    # Feature 2: Role Classification
    # -----------------------------------------------------------------
    def test_role_classification(self):
        roles = classify_entity_roles(self.network.graph)
        self.assertIn("P002", roles)
        # P002 bridges P001, O001, and P003->B001 and has highest betweenness and degree
        self.assertIn(roles["P002"]["role"], ["BRIDGE_CONNECTOR", "NETWORK_HUB"])
        self.assertTrue(len(roles["P002"]["reasons"]) > 0)

        # Isolated node test
        g_iso = nx.Graph()
        g_iso.add_node("ISO_1", name="Isolated One", type="Person")
        roles_iso = classify_entity_roles(g_iso)
        self.assertEqual(roles_iso["ISO_1"]["role"], "ISOLATED_ENTITY")

    # -----------------------------------------------------------------
    # Feature 3: Bridge Intelligence
    # -----------------------------------------------------------------
    def test_bridge_analysis(self):
        bridges = analyze_bridges(self.network.graph)
        self.assertGreater(bridges["total_bridges"], 0)
        self.assertIn("P002", bridges["articulation_points"])

        bridge_p002 = next((b for b in bridges["bridge_entities"] if b["entity"] == "P002"), None)
        self.assertIsNotNone(bridge_p002)
        self.assertTrue(bridge_p002["is_articulation_point"])
        self.assertGreater(bridge_p002["components_after"], bridge_p002["components_before"])
        self.assertIn("fragment", bridge_p002["removal_impact"].lower())

    # -----------------------------------------------------------------
    # Feature 4: Community Detection
    # -----------------------------------------------------------------
    def test_community_detection(self):
        communities = detect_communities(self.network.graph)
        self.assertGreater(len(communities), 0)
        c1 = communities[0]
        self.assertIn("community_id", c1)
        self.assertIn("members", c1)
        self.assertIn("size", c1)
        self.assertIn("density", c1)
        self.assertIn("internal_edges", c1)
        self.assertIn("central_entity", c1)

    # -----------------------------------------------------------------
    # Feature 5: Relationship Path Analysis
    # -----------------------------------------------------------------
    def test_shortest_path_found(self):
        res = find_shortest_path(self.network.graph, "P001", "B001")
        self.assertTrue(res["exists"])
        self.assertEqual(res["path_length"], 3)
        self.assertEqual(res["path_nodes"], ["P001", "P002", "P003", "B001"])
        self.assertEqual(len(res["path"]), 4)
        self.assertEqual(res["path"][1]["relationship"], "associate")

    def test_shortest_path_disconnected(self):
        g_disc = nx.Graph()
        g_disc.add_node("A")
        g_disc.add_node("B")
        res = find_shortest_path(g_disc, "A", "B")
        self.assertFalse(res["exists"])
        self.assertEqual(res["path_length"], 0)

    def test_shortest_path_missing_node(self):
        res = find_shortest_path(self.network.graph, "P001", "NONEXISTENT")
        self.assertFalse(res["exists"])
        self.assertIn("error", res)

    # -----------------------------------------------------------------
    # Feature 6: Potential Structural Link Discovery
    # -----------------------------------------------------------------
    def test_potential_links(self):
        links = discover_potential_links(self.network.graph)
        self.assertIsInstance(links, list)
        # P001 and P003 both connect to P002, so (P001, P003) is a potential link candidate
        p001_p003 = next((l for l in links if (l["source"] == "P001" and l["target"] == "P003") or (l["source"] == "P003" and l["target"] == "P001")), None)
        self.assertIsNotNone(p001_p003)
        self.assertIn("P002", p001_p003["common_neighbors"])
        self.assertIn("disclaimer", p001_p003)
        self.assertEqual(p001_p003["label"], "POTENTIAL_STRUCTURAL_LINK")

    # -----------------------------------------------------------------
    # Feature 7: Pattern Detection
    # -----------------------------------------------------------------
    def test_pattern_detection(self):
        patterns = detect_structural_patterns(self.network.graph)
        self.assertGreater(len(patterns), 0)
        pattern_types = [p["pattern_type"] for p in patterns]
        # P002 connects to P001, P003, O001 -> HUB_AND_SPOKE and BRIDGE_PATTERN
        self.assertTrue("HUB_AND_SPOKE" in pattern_types or "BRIDGE_PATTERN" in pattern_types)

    # -----------------------------------------------------------------
    # Feature 8: Network Statistics
    # -----------------------------------------------------------------
    def test_network_statistics(self):
        stats = calculate_network_statistics(self.network.graph)
        self.assertEqual(stats["total_nodes"], 5)
        self.assertEqual(stats["total_edges"], 4)
        self.assertEqual(stats["number_of_connected_components"], 1)
        self.assertTrue(stats["is_connected"])
        self.assertEqual(stats["largest_component_size"], 5)
        self.assertIsNotNone(stats["diameter"])

    def test_empty_graph_statistics(self):
        empty_g = nx.Graph()
        stats = calculate_network_statistics(empty_g)
        self.assertEqual(stats["total_nodes"], 0)
        self.assertEqual(stats["total_edges"], 0)
        self.assertFalse(stats["is_connected"])
        self.assertIsNone(stats["diameter"])

    # -----------------------------------------------------------------
    # Feature 9: Graph Explanation Facts
    # -----------------------------------------------------------------
    def test_explanation_facts(self):
        facts = generate_entity_facts(self.network.graph, "P002")
        self.assertEqual(facts["entity"], "P002")
        self.assertGreater(len(facts["facts"]), 0)
        fact_text = " ".join(facts["facts"])
        self.assertTrue("P002" in fact_text or "connected" in fact_text.lower() or "betweenness" in fact_text.lower())

    # -----------------------------------------------------------------
    # Feature 10: Temporal Filter
    # -----------------------------------------------------------------
    def test_temporal_filter(self):
        g = nx.Graph()
        g.add_node("N1")
        g.add_node("N2")
        g.add_edge("N1", "N2", timestamp="2026-01-01 10:00:00")
        filtered = filter_graph_by_time(g, start_time="2026-01-02 00:00:00")
        self.assertEqual(filtered.number_of_edges(), 0)

        filtered_in = filter_graph_by_time(g, start_time="2025-12-31 00:00:00", end_time="2026-01-02 00:00:00")
        self.assertEqual(filtered_in.number_of_edges(), 1)

    # -----------------------------------------------------------------
    # Engine Caching & Entity Profile
    # -----------------------------------------------------------------
    def test_engine_caching_and_profile(self):
        profile = self.engine.get_entity_profile("P002")
        self.assertIsNotNone(profile)
        self.assertEqual(profile["entity"], "P002")
        self.assertEqual(profile["connection_count"], 3)
        self.assertEqual(len(profile["connections"]), 3)
        self.assertIn("role", profile)
        self.assertIn("community", profile)
        self.assertIn("bridge_information", profile)
        self.assertIn("explanation_facts", profile)

        vis = self.engine.get_visualization_data()
        self.assertEqual(len(vis["nodes"]), 5)
        self.assertEqual(len(vis["edges"]), 4)


class TestFastAPIEndpoints(unittest.TestCase):

    def setUp(self):
        # Reset network in api to seed network for deterministic endpoint testing
        api.network = api.load_seed_network()
        api.engine = GraphIntelligenceEngine(api.network)
        self.client = TestClient(api.app)

    def test_graph_summary_endpoint(self):
        response = self.client.get("/graph/summary")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("total_nodes", data)
        self.assertIn("total_edges", data)
        self.assertIn("is_connected", data)

    def test_graph_importance_endpoint(self):
        response = self.client.get("/graph/nodes/importance")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("centrality_metrics", data)
        self.assertIn("structural_rankings", data)

    def test_graph_communities_endpoint(self):
        response = self.client.get("/graph/communities")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("communities", data)
        self.assertIn("total_communities", data)

    def test_graph_bridges_endpoint(self):
        response = self.client.get("/graph/bridges")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("bridge_entities", data)
        self.assertIn("bridge_edges", data)
        self.assertIn("articulation_points", data)

    def test_graph_roles_endpoint(self):
        response = self.client.get("/graph/roles")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("roles", data)
        self.assertIn("total_classified", data)

    def test_graph_patterns_endpoint(self):
        response = self.client.get("/graph/patterns")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("patterns", data)

    def test_graph_potential_links_endpoint(self):
        response = self.client.get("/graph/potential-links")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["label"], "POTENTIAL_STRUCTURAL_LINK")
        self.assertIn("candidates", data)
        self.assertIn("disclaimer", data)

    def test_graph_entity_endpoint(self):
        response = self.client.get("/graph/entity/P002")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["entity"], "P002")
        self.assertIn("importance_metrics", data)
        self.assertIn("explanation_facts", data)

    def test_graph_entity_404(self):
        response = self.client.get("/graph/entity/UNKNOWN_NODE")
        self.assertEqual(response.status_code, 404)

    def test_graph_path_endpoint(self):
        response = self.client.get("/graph/path?source=P001&target=B001&include_alternatives=true")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertTrue(data["exists"])
        self.assertEqual(data["path_length"], 3)
        self.assertIn("alternative_paths", data)

    def test_graph_visualization_data_endpoint(self):
        response = self.client.get("/graph/visualization-data")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("nodes", data)
        self.assertIn("edges", data)
        self.assertIn("summary", data)

    def test_backward_compatibility_endpoints(self):
        # /network
        r_net = self.client.get("/network")
        self.assertEqual(r_net.status_code, 200)

        # /analysis/centrality
        r_cent = self.client.get("/analysis/centrality")
        self.assertEqual(r_cent.status_code, 200)

        # /analysis/clusters
        r_clus = self.client.get("/analysis/clusters")
        self.assertEqual(r_clus.status_code, 200)

        # /analysis/risk
        r_risk = self.client.get("/analysis/risk")
        self.assertEqual(r_risk.status_code, 200)

        # /analysis/connection
        r_conn = self.client.get("/analysis/connection?node1=P001&node2=B001")
        self.assertEqual(r_conn.status_code, 200)
        self.assertIsNotNone(r_conn.json()["connection"])


if __name__ == "__main__":
    unittest.main()

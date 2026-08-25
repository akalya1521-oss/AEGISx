import json
import sys
from pathlib import Path
from src.graph.loader import build_network
from src.graph.engine import GraphIntelligenceEngine
from src.graph.visualization import draw_network
from src.graph.analysis import (
    most_connected_nodes,
    find_clusters,
    get_relationship,
    find_connection,
    centrality_analysis,
)


def load_network_data(file_path: str):
    with open(file_path, "r", encoding="utf-8") as file:
        return json.load(file)


def main():
    base_dir = Path(__file__).resolve().parent
    data_path = base_dir / "data" / "network_data.json"
    data = load_network_data(str(data_path))
    network = build_network(data)
    engine = GraphIntelligenceEngine(network)

    print("=" * 60)
    print("      AEGIS-X -- GRAPH INTELLIGENCE ENGINE (SIH26189)")
    print("=" * 60)

    # 1. NETWORK STATISTICS
    print("\n[FEATURE 8] Network Structural Statistics:")
    stats = engine.get_summary()
    for k, v in stats.items():
        print(f"  * {k.replace('_', ' ').title()}: {v}")

    # 2. CENTRALITY ANALYSIS
    print("\n[FEATURE 1] Advanced Centrality & PageRank:")
    centrality = engine.get_centrality()
    for node, m in centrality.items():
        print(f"  * {node} | Deg: {m['degree_centrality']:.2f} | Bet: {m['betweenness_centrality']:.2f} | Clo: {m['closeness_centrality']:.2f} | PR: {m['pagerank']:.3f}")

    print("\n[FEATURE 1] Structural Importance Rankings:")
    rankings = engine.get_importance_rankings(limit=5)
    for r in rankings:
        print(f"  Rank #{r['rank']} {r['name']} ({r['id']}) | Score: {r['structural_importance_score']} | {r['connectivity_rank_label']}")

    # 3. ENTITY ROLE CLASSIFICATION
    print("\n[FEATURE 2] Entity Structural Roles:")
    roles = engine.get_roles()
    for node, r in roles.items():
        print(f"  * {node}: {r['role']} ({r['role_label']})")
        for reason in r["reasons"]:
            print(f"      - {reason}")

    # 4. BRIDGE INTELLIGENCE
    print("\n[FEATURE 3] Bridge Intelligence & Articulation Points:")
    bridges = engine.get_bridges()
    print(f"  Bridge Edges ({bridges['total_bridges']}):")
    for be in bridges["bridge_edges"]:
        print(f"    * {be['source']} <-> {be['target']} ({be['relation']})")
    print(f"  Articulation Points ({bridges['total_articulation_points']}): {', '.join(bridges['articulation_points']) or 'None'}")
    for be in bridges["bridge_entities"]:
        print(f"    * Entity {be['entity']} ({be['name']}): {be['removal_impact']} (Connects {be['connects_groups']} groups)")

    # 5. COMMUNITY DETECTION
    print("\n[FEATURE 4] Scalable Community Detection:")
    communities = engine.get_communities()
    for comm in communities:
        print(f"  * {comm['community_id']} (Size: {comm['size']}, Core: {comm['central_entity_name']}, Density: {comm['density']:.2f}): {', '.join(comm['members'])}")

    # 6. RELATIONSHIP PATH ANALYSIS
    print("\n[FEATURE 5] Relationship Path Analysis (P001 -> B001):")
    path_result = engine.get_shortest_path("P001", "B001")
    if path_result.get("exists"):
        path_str = " -> ".join(path_result["path_nodes"])
        print(f"  Shortest Path (Hops: {path_result['path_length']}): {path_str}")
        for step in path_result["path"][1:]:
            print(f"    [+] [{step['relationship']}] --> {step['target_name']} ({step['target']})")
    else:
        print("  No path exists.")

    # 7. POTENTIAL STRUCTURAL LINK DISCOVERY
    print("\n[FEATURE 6] Potential Structural Link Discovery:")
    links = engine.get_potential_links(top_k=5)
    if links:
        for link in links:
            print(f"  * Lead: {link['source']} <--> {link['target']} | Proximity Score: {link['score']}")
            print(f"    Common Neighbors: {', '.join(link['common_neighbors'])}")
            print(f"    Disclaimer: {link['disclaimer']}")
    else:
        print("  No potential structural links found.")

    # 8. STRUCTURAL PATTERN DETECTION
    print("\n[FEATURE 7] Network Structural Pattern Detection:")
    patterns = engine.get_patterns()
    for p in patterns:
        print(f"  * [{p['pattern_type']}] Central: {p.get('central_entity', 'N/A')} - {p['explanation']}")

    # 9. GRAPH EXPLANATION FACTS
    print("\n[FEATURE 9] Graph Explanation Facts (P002):")
    profile = engine.get_entity_profile("P002")
    if profile:
        for fact in profile["explanation_facts"]:
            print(f"  * {fact}")

    print("\n" + "=" * 60)
    print("Analysis complete. To launch API: uvicorn api:app --reload")
    print("=" * 60)

    if "--visualize" in sys.argv:
        draw_network(network.graph)


if __name__ == "__main__":
    main()
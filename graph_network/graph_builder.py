import json
from src.graph.loader import build_network
from src.graph.network import CriminalNetwork
from src.graph.analysis import (
    most_connected_nodes,
    find_clusters,
    get_relationship,
    find_connection,
    centrality_analysis
)
from src.graph.visualization import draw_network
from src.graph.intelligence import (
    top_influential_nodes,
    bridge_nodes,
    high_risk_nodes,
    network_summary
)
from src.graph.report import generate_report
def load_network_data(file_path):
    with open(file_path, "r") as file:
        return json.load(file)


data = load_network_data("data/network_data.json")
network = build_network(data)

# ================= GRAPH ANALYSIS =================

print("Key nodes:", most_connected_nodes(network.graph))

print("Clusters:", find_clusters(network.graph))

print(
    "P002-P003:",
    get_relationship(network.graph, "P002", "P003")
)

print(
    "P001-P002:",
    get_relationship(network.graph, "P001", "P002")
)

print(
    "Connection:",
    find_connection(network.graph, "P001", "P003")
)


print("\nCentrality Analysis:")

results = centrality_analysis(network.graph)

for node, values in results.items():
    print(
        f"{node} | "
        f"Degree: {values['degree']} | "
        f"Betweenness: {values['betweenness']} | "
        f"Closeness: {values['closeness']}"
    )
print("\n===== NETWORK INTELLIGENCE =====")

print("\nTop Influential Nodes:")
for node, score in top_influential_nodes(network.graph):
    print(node, "| Score:", round(score, 2))

print("\nBridge Nodes:")
for node, score in bridge_nodes(network.graph):
    print(node, "| Score:", round(score, 2))

print("\nHigh Risk Nodes:")
for item in high_risk_nodes(network.graph):
    print(
        item["id"],
        "| Risk Score:",
        item["risk_score"]
    )

print("\nNetwork Summary:")
summary = network_summary(network.graph)

for key, value in summary.items():
    print(
        key.replace("_", " ").title(),
        ":",
        value
    )
print("\n===== API READY REPORT =====")

report = generate_report(network.graph)

print(json.dumps(report, indent=4))
# ================= VISUALIZATION =================

draw_network(network.graph)
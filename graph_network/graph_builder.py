from src.graph.network import CriminalNetwork
from src.graph.analysis import (
    most_connected_nodes,
    find_clusters,
    get_relationship,
    find_connection,
    centrality_analysis
)
from src.graph.visualization import draw_network


network = CriminalNetwork()

# Persons
network.add_entity("P001", "Person A", "Person")
network.add_entity("P002", "Person B", "Person")
network.add_entity("P003", "Person C", "Person")

# Organization
network.add_entity("O001", "ABC Organization", "Organization")

# Bank Account
network.add_entity("B001", "Bank Account 101", "Bank Account")
network.add_relationship("P001", "P002", "associate")
network.add_relationship("P002", "P003", "communicates")
network.add_relationship("P002", "O001", "works_for")
network.add_relationship("P003", "B001", "owns")

# Existing analysis
print("Key nodes:", most_connected_nodes(network.graph))
print("Clusters:", find_clusters(network.graph))
print("P002-P003:", get_relationship(network.graph, "P002", "P003"))
print("P001-P002:", get_relationship(network.graph, "P001", "P002"))
print("Connection:", find_connection(network.graph, "P001", "P003"))

# Centrality Analysis
centrality = centrality_analysis(network.graph)

print("\nCentrality Analysis:")

for node in network.graph.nodes():
    print(
        node,
        "| Degree:", round(centrality["degree"][node], 2),
        "| Betweenness:", round(centrality["betweenness"][node], 2),
        "| Closeness:", round(centrality["closeness"][node], 2)
    )

# Visualization
draw_network(network.graph)
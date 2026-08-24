from src.graph.network import CriminalNetwork
from src.graph.analysis import most_connected_nodes, find_clusters, get_relationship, find_connection
from src.graph.visualization import draw_network

network = CriminalNetwork()

network.add_entity("P001", "Person A", "Person")
network.add_entity("P002", "Person B", "Person")
network.add_entity("P003", "Person C", "Person")
network.add_entity("P004", "Person D", "Person")
network.add_entity("P005", "Person E", "Person")

network.add_relationship("P001", "P002", "associate")
network.add_relationship("P002", "P003", "communicates")
network.add_relationship("P004", "P005", "associate")

print("Key nodes:", most_connected_nodes(network.graph))
print("Clusters:", find_clusters(network.graph))

print("P002-P003:", get_relationship(network.graph, "P002", "P003"))
print("P001-P002:", get_relationship(network.graph, "P001", "P002"))

print("Connection:", find_connection(network.graph, "P001", "P003"))

draw_network(network.graph)
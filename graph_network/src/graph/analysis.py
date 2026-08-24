import networkx as nx


def most_connected_nodes(graph):
    return sorted(graph.degree(), key=lambda x: x[1], reverse=True)


def find_clusters(graph):
    return list(nx.connected_components(graph))


def get_relationship(graph, node1, node2):
    if graph.has_edge(node1, node2):
        return graph[node1][node2].get("relation")
    return None



def find_connection(graph, node1, node2):
    try:
        return nx.shortest_path(graph, node1, node2)
    except (nx.NetworkXNoPath, nx.NodeNotFound):
        return None

def centrality_analysis(graph):
    degree = nx.degree_centrality(graph)
    betweenness = nx.betweenness_centrality(graph)
    closeness = nx.closeness_centrality(graph)

    results = {}

    for node in graph.nodes():
        results[node] = {
            "degree": round(degree[node], 2),
            "betweenness": round(betweenness[node], 2),
            "closeness": round(closeness[node], 2)
        }

    return results
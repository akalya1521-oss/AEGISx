import networkx as nx


def most_connected_nodes(graph):
    return sorted(graph.degree, key=lambda x: x[1], reverse=True)


def find_clusters(graph):
    return list(nx.connected_components(graph))


def get_relationship(graph, entity1, entity2):
    if graph.has_edge(entity1, entity2):
        return graph[entity1][entity2]["relation"]
    return None


def find_connection(graph, entity1, entity2):
    try:
        return nx.shortest_path(graph, entity1, entity2)
    except nx.NetworkXNoPath:
        return None
    except nx.NodeNotFound:
        return None
def centrality_analysis(graph):
    return {
        "degree": nx.degree_centrality(graph),
        "betweenness": nx.betweenness_centrality(graph),
        "closeness": nx.closeness_centrality(graph)
    }
import matplotlib.pyplot as plt
import networkx as nx


def draw_network(graph):
    # Better layout for demo
    pos = nx.spring_layout(
        graph,
        seed=42,
        k=1.5,
        iterations=100
    )

    # Get entity names
    node_labels = {}
    for node, data in graph.nodes(data=True):
        node_labels[node] = data.get("name", str(node))

    # Detect clusters
    clusters = list(nx.connected_components(graph))

    # Draw nodes cluster-wise
    for i, cluster in enumerate(clusters):
        nx.draw_networkx_nodes(
            graph,
            pos,
            nodelist=list(cluster),
            node_size=2200,
            alpha=0.9
        )

    # Draw relationships
    nx.draw_networkx_edges(
        graph,
        pos,
        width=2,
        alpha=0.7,
        arrows=True
    )

    # Entity names
    nx.draw_networkx_labels(
        graph,
        pos,
        labels=node_labels,
        font_size=10,
        font_weight="bold"
    )

    # Relationship labels
    edge_labels = nx.get_edge_attributes(graph, "relation")

    nx.draw_networkx_edge_labels(
        graph,
        pos,
        edge_labels=edge_labels,
        font_size=8,
        label_pos=0.5
    )

    plt.title("Criminal Network Relationship Graph", fontsize=14)
    plt.axis("off")
    plt.tight_layout()
    plt.show()
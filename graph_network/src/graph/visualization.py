import networkx as nx
import matplotlib.pyplot as plt


def draw_network(graph):

    pos = nx.spring_layout(graph, seed=42, k=2.0)

    # Find clusters
    clusters = list(nx.connected_components(graph))

    cluster_colors = ["gold", "skyblue"]
    node_colors = {}

    for i, cluster in enumerate(clusters):
        for node in cluster:
            node_colors[node] = cluster_colors[i % len(cluster_colors)]

    # Degree centrality
    centrality = nx.degree_centrality(graph)

    # Most important node
    key_node = max(centrality, key=centrality.get)

    # Entity shapes
    shapes = {
        "Person": "o",
        "Organization": "s",
        "Bank Account": "D"
    }

    # Draw nodes
    for entity_type, shape in shapes.items():

        nodes = [
            n for n in graph.nodes()
            if graph.nodes[n].get("type") == entity_type
        ]

        if not nodes:
            continue

        sizes = [
            1500 + centrality[n] * 2500
            for n in nodes
        ]

        colors = [
            node_colors[n]
            for n in nodes
        ]

        borders = [
            "red" if n == key_node else "black"
            for n in nodes
        ]

        nx.draw_networkx_nodes(
            graph,
            pos,
            nodelist=nodes,
            node_color=colors,
            node_size=sizes,
            node_shape=shape,
            edgecolors=borders,
            linewidths=4
        )

    # Draw edges
    nx.draw_networkx_edges(
        graph,
        pos,
        arrows=True,
        edge_color="gray",
        width=2
    )

    # Entity names
    labels = {
        node: graph.nodes[node].get("name", node)
        for node in graph.nodes()
    }

    nx.draw_networkx_labels(
        graph,
        pos,
        labels=labels,
        font_weight="bold"
    )

    # Relationship labels
    edge_labels = nx.get_edge_attributes(graph, "relation")

    nx.draw_networkx_edge_labels(
        graph,
        pos,
        edge_labels=edge_labels,
        rotate=False,
        bbox=dict(
            facecolor="white",
            edgecolor="gray",
            boxstyle="round,pad=0.2"
        ),
        font_weight="bold"
    )

    # Cluster legend
    for i, color in enumerate(cluster_colors[:len(clusters)]):
        plt.scatter(
            [],
            [],
            color=color,
            s=100,
            edgecolors="black",
            label=f"Cluster {i + 1}"
        )

    # Entity type legend
    plt.scatter(
        [], [], marker="o", color="white",
        edgecolors="black", s=100, label="Person"
    )

    plt.scatter(
        [], [], marker="s", color="white",
        edgecolors="black", s=100, label="Organization"
    )

    plt.scatter(
        [], [], marker="D", color="white",
        edgecolors="black", s=100, label="Bank Account"
    )

    plt.legend(
        title="Network / Entity Types",
        loc="upper left",
        bbox_to_anchor=(1.02, 1)
    )

    plt.title(
        "AI-Powered Criminal Network Analysis",
        fontsize=20,
        fontweight="bold"
    )

    plt.axis("off")
    plt.tight_layout()
    plt.show()
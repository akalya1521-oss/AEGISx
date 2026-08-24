import networkx as nx
import matplotlib.pyplot as plt
import textwrap
from matplotlib.patches import FancyBboxPatch


def draw_network(graph):

    fig = plt.figure(figsize=(14, 8), facecolor="#10151c")

    ax = fig.add_axes([0.03, 0.10, 0.72, 0.78])
    ax.set_facecolor("#10151c")

    default_pos = {
        "O001": (0.8, 4.2),
        "P002": (3.2, 3.6),
        "P001": (5.8, 4.3),
        "P003": (3.2, 1.8),
        "B001": (3.2, 0.1)
    }

    pos = {}
    extra_nodes = []

    for node in graph.nodes():
        if node in default_pos:
            pos[node] = default_pos[node]
        else:
            extra_nodes.append(node)

    if extra_nodes:
        dynamic_pos = nx.spring_layout(graph.subgraph(extra_nodes), seed=42)

        for node in extra_nodes:
            pos[node] = dynamic_pos[node]

    colors = {
        "Person": "#4fa3c7",
        "Organization": "#7bb77a",
        "Bank Account": "#ffd166"
    }

    shapes = {
        "Person": "o",
        "Organization": "s",
        "Bank Account": "D"
    }

    edge_colors = {
        "owns": "#ffd166",
        "communicates": "#5bc0de",
        "works_for": "#7bb77a",
        "associate": "#c678dd"
    }

    edge_styles = {
        "owns": "solid",
        "communicates": "dashed",
        "works_for": "solid",
        "associate": "dotted"
    }

    degrees = dict(graph.degree())

    # Draw edges
    for u, v, data in graph.edges(data=True):
        relation = data.get("relation", "")

        nx.draw_networkx_edges(
            graph,
            pos,
            edgelist=[(u, v)],
            width=2.5,
            edge_color=edge_colors.get(relation, "#aaaaaa"),
            style=edge_styles.get(relation, "solid"),
            ax=ax
        )

    # Draw nodes
    for entity_type in colors:

        nodes = [
            node for node, data in graph.nodes(data=True)
            if data.get("type") == entity_type
        ]

        if nodes:
            sizes = []

            for node in nodes:
                if entity_type == "Organization":
                    sizes.append(4000)
                elif entity_type == "Bank Account":
                    sizes.append(2800)
                else:
                    sizes.append(1500 + degrees[node] * 350)

            nx.draw_networkx_nodes(
                graph,
                pos,
                nodelist=nodes,
                node_color=colors[entity_type],
                node_shape=shapes[entity_type],
                node_size=sizes,
                edgecolors="#dce3ea",
                linewidths=2,
                ax=ax
            )

    # Node labels
    labels = {}

    for node, data in graph.nodes(data=True):
        name = str(data.get("name", node))
        if data.get("type") == "Organization":
            name = "\n".join(textwrap.wrap(name, width=14))
        elif data.get("type") == "Bank Account":
            name = "\n".join(textwrap.wrap(name, width=10))
        else:
           name = "\n".join(textwrap.wrap(name, width=14))

        labels[node] = f"{node}\n{name}"

    nx.draw_networkx_labels(
        graph,
        pos,
        labels=labels,
        font_size=8,
        font_weight="bold",
        font_color="#17212b",
        ax=ax
    )

    # Edge labels
    for u, v, data in graph.edges(data=True):
        relation = data.get("relation", "")

        x1, y1 = pos[u]
        x2, y2 = pos[v]

        x = (x1 + x2) / 2
        y = (y1 + y2) / 2

        if relation == "communicates":
            y = (y1 + y2) / 2
        else:
            y += 0.12

        ax.text(
            x,
            y,
            relation.replace("_", " "),
            fontsize=9,
            fontweight="bold",
            color="#d0d7de",
            ha="center",
            va="center",
            rotation=0,
            bbox={
                "boxstyle": "round,pad=0.25",
                "fc": "#1b222c",
                "ec": "#3a4553",
                "alpha": 0.95
            }
        )

    ax.set_xlim(-0.2, 7.0)
    ax.set_ylim(-0.7, 5.0)
    ax.axis("off")

    # Title
    fig.text(
        0.38,
        0.95,
        "CRIMINAL NETWORK ANALYSIS",
        ha="center",
        fontsize=24,
        fontweight="bold",
        color="#dce3ea"
    )

    fig.text(
        0.38,
        0.915,
        "AI-POWERED CRIMINAL NETWORK ANALYSIS SYSTEM",
        ha="center",
        fontsize=10,
        color="#8d98a5"
    )

    total_entities = graph.number_of_nodes()
    total_relationships = graph.number_of_edges()

    key_entity = max(degrees, key=degrees.get) if degrees else "N/A"
    max_connections = degrees.get(key_entity, 0)

    # Side panel
    panel = fig.add_axes([0.78, 0.16, 0.20, 0.70])
    panel.set_facecolor("#10151c")
    panel.axis("off")

    panel.text(
        0.05,
        0.96,
        "NETWORK",
        fontsize=18,
        fontweight="bold",
        color="#dce3ea"
    )

    panel.text(
        0.05,
        0.925,
        "INTELLIGENCE",
        fontsize=10,
        color="#8d98a5"
    )

    stats_box = FancyBboxPatch(
        (0.03, 0.66),
        0.94,
        0.22,
        boxstyle="round,pad=0.02",
        facecolor="#1b222c",
        edgecolor="#3a4553"
    )

    panel.add_patch(stats_box)

    panel.text(
        0.08,
        0.84,
        "STATISTICS",
        fontsize=10,
        fontweight="bold",
        color="#8ecbff"
    )

    stats = [
        ("ENTITIES", total_entities),
        ("RELATIONSHIPS", total_relationships),
        ("KEY ENTITY", key_entity),
        ("CONNECTIONS", max_connections)
    ]

    y = 0.79

    for label, value in stats:
        panel.text(
            0.08,
            y,
            label,
            fontsize=8,
            color="#9aa4af"
        )

        panel.text(
            0.90,
            y,
            str(value),
            fontsize=9,
            fontweight="bold",
            ha="right",
            color="#c7cdd4"
        )

        y -= 0.045

    # Entity types
    panel.text(
        0.05,
        0.57,
        "ENTITY TYPES",
        fontsize=11,
        fontweight="bold",
        color="#9ad49a"
    )

    y = 0.52

    for entity_type, color in colors.items():
        panel.scatter(
            0.12,
            y,
            s=70,
            color=color,
            edgecolors="#dce3ea"
        )

        panel.text(
            0.22,
            y,
            entity_type,
            fontsize=9,
            va="center",
            color="#c7cdd4"
        )

        y -= 0.055

    # Relationships
    panel.text(
        0.05,
        0.29,
        "RELATIONSHIPS",
        fontsize=11,
        fontweight="bold",
        color="#d39be8"
    )

    y = 0.24

    for relation, color in edge_colors.items():
        panel.plot(
            [0.08, 0.20],
            [y, y],
            color=color,
            linewidth=2.5,
            linestyle=edge_styles[relation]
        )

        panel.text(
            0.25,
            y,
            relation.replace("_", " ").title(),
            fontsize=9,
            va="center",
            color="#c7cdd4"
        )

        y -= 0.055

    panel.text(
        0.08,
        0.02,
        "Node size = connection importance",
        fontsize=7,
        color="#7f8a96"
    )

    fig.text(
        0.38,
        0.055,
        f"{total_entities} ENTITIES    •    {total_relationships} RELATIONSHIPS",
        ha="center",
        fontsize=10,
        fontweight="bold",
        color="#8d98a5"
    )

    plt.show()
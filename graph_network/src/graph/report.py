from src.graph.analysis import (
    most_connected_nodes,
    find_clusters,
    centrality_analysis
)

from src.graph.intelligence import (
    top_influential_nodes,
    bridge_nodes,
    high_risk_nodes,
    network_summary
)


def generate_report(graph):

    clusters = [
        list(cluster)
        for cluster in find_clusters(graph)
    ]

    influential = [
        {
            "id": node,
            "score": round(score, 2)
        }
        for node, score in top_influential_nodes(graph)
    ]

    bridges = [
        {
            "id": node,
            "score": round(score, 2)
        }
        for node, score in bridge_nodes(graph)
    ]

    return {
        "summary": network_summary(graph),

        "key_nodes": [
            {
                "id": node,
                "connections": connections
            }
            for node, connections in most_connected_nodes(graph)
        ],

        "clusters": clusters,

        "centrality": centrality_analysis(graph),

        "intelligence": {
            "top_influential": influential,
            "bridge_nodes": bridges,
            "high_risk": high_risk_nodes(graph)
        }
    }
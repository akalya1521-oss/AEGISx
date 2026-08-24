import networkx as nx


class CriminalNetwork:
    def __init__(self):
        self.graph = nx.Graph()

    def add_entity(self, entity_id, name, entity_type):
        self.graph.add_node(
            entity_id,
            name=name,
            type=entity_type
        )

    def add_relationship(self, entity1, entity2, relation):
        self.graph.add_edge(
            entity1,
            entity2,
            relation=relation
        )

    def get_network(self):
        return self.graph
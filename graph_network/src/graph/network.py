import networkx as nx
from typing import Any, Dict, Optional, Union
from src.graph.temporal import filter_graph_by_time


class CriminalNetwork:
    """Core network representation for entities and relationships with time-ready metadata."""

    def __init__(self, is_directed: bool = False):
        self.is_directed = is_directed
        self.graph = nx.DiGraph() if is_directed else nx.Graph()
        self._version = 0

    def add_entity(
        self,
        entity_id: str,
        name: str,
        entity_type: str,
        **metadata: Any
    ) -> None:
        """Add or update an entity node in the network."""
        attrs = {
            "name": name,
            "type": entity_type,
            **metadata
        }
        self.graph.add_node(entity_id, **attrs)
        self._version += 1

    def add_relationship(
        self,
        entity1: str,
        entity2: str,
        relation: str,
        weight: float = 1.0,
        timestamp: Optional[Any] = None,
        created_at: Optional[Any] = None,
        updated_at: Optional[Any] = None,
        **metadata: Any
    ) -> None:
        """Add or update a relationship edge between two entities."""
        attrs: Dict[str, Any] = {
            "relation": relation,
            "weight": float(weight) if weight is not None else 1.0,
            **metadata
        }
        if timestamp is not None:
            attrs["timestamp"] = timestamp
        if created_at is not None:
            attrs["created_at"] = created_at
        if updated_at is not None:
            attrs["updated_at"] = updated_at

        self.graph.add_edge(entity1, entity2, **attrs)
        self._version += 1

    def get_network(self) -> nx.Graph:
        """Return the underlying NetworkX graph instance."""
        return self.graph

    def get_temporal_subgraph(
        self,
        start_time: Optional[Union[str, Any]] = None,
        end_time: Optional[Union[str, Any]] = None
    ) -> nx.Graph:
        """Return a subgraph filtered to edges within the specified time range."""
        return filter_graph_by_time(self.graph, start_time=start_time, end_time=end_time)

    @property
    def version(self) -> int:
        """Monotonic version integer incremented upon every graph mutation."""
        return self._version
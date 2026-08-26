"""Temporal analysis utilities and time-ready graph helpers."""

from datetime import datetime
from typing import Any, Dict, Optional, Union
import networkx as nx


def parse_timestamp(value: Any) -> Optional[datetime]:
    """Parse various timestamp representations into a datetime object."""
    if value is None:
        return None
    if isinstance(value, datetime):
        return value
    if isinstance(value, (int, float)):
        try:
            return datetime.fromtimestamp(value)
        except (ValueError, OSError):
            return None
    if isinstance(value, str):
        for fmt in (
            "%Y-%m-%dT%H:%M:%S.%f",
            "%Y-%m-%dT%H:%M:%S",
            "%Y-%m-%d %H:%M:%S",
            "%Y-%m-%d",
            "%d-%m-%Y",
            "%H:%M:%S",
        ):
            try:
                return datetime.strptime(value.strip(), fmt)
            except ValueError:
                continue
    return None


def filter_graph_by_time(
    graph: nx.Graph,
    start_time: Optional[Union[str, datetime]] = None,
    end_time: Optional[Union[str, datetime]] = None,
) -> nx.Graph:
    """
    Return a subgraph containing only edges active within the specified time window.
    Edges without timestamp attributes are included by default.
    """
    dt_start = parse_timestamp(start_time) if start_time else None
    dt_end = parse_timestamp(end_time) if end_time else None

    if dt_start is None and dt_end is None:
        return graph.copy()

    subgraph = graph.copy()
    edges_to_remove = []

    for u, v, data in subgraph.edges(data=True):
        ts_val = data.get("timestamp") or data.get("created_at") or data.get("time")
        if ts_val is not None:
            edge_dt = parse_timestamp(ts_val)
            if edge_dt:
                if dt_start and edge_dt < dt_start:
                    edges_to_remove.append((u, v))
                    continue
                if dt_end and edge_dt > dt_end:
                    edges_to_remove.append((u, v))
                    continue

    subgraph.remove_edges_from(edges_to_remove)
    return subgraph

from typing import Any, Dict
from src.graph.network import CriminalNetwork


def validate_data(data: Dict[str, Any]) -> bool:
    if not isinstance(data, dict):
        raise ValueError("Data must be a dictionary")

    if "entities" not in data:
        raise ValueError("Missing 'entities'")

    if "relationships" not in data:
        raise ValueError("Missing 'relationships'")

    if not isinstance(data["entities"], list):
        raise ValueError("'entities' must be a list")

    if not isinstance(data["relationships"], list):
        raise ValueError("'relationships' must be a list")

    entity_ids = set()

    for entity in data["entities"]:
        required_fields = ["id", "name", "type"]

        for field in required_fields:
            if field not in entity:
                raise ValueError(
                    f"Entity missing '{field}'"
                )

        if entity["id"] in entity_ids:
            raise ValueError(
                f"Duplicate entity ID: {entity['id']}"
            )

        entity_ids.add(entity["id"])

    for relationship in data["relationships"]:
        required_fields = ["source", "target", "relation"]

        for field in required_fields:
            if field not in relationship:
                raise ValueError(
                    f"Relationship missing '{field}'"
                )

        if relationship["source"] not in entity_ids:
            raise ValueError(
                f"Unknown source: {relationship['source']}"
            )

        if relationship["target"] not in entity_ids:
            raise ValueError(
                f"Unknown target: {relationship['target']}"
            )

    return True


def build_network(data: Dict[str, Any]) -> CriminalNetwork:
    validate_data(data)

    network = CriminalNetwork()

    for entity in data["entities"]:
        extra = {k: v for k, v in entity.items() if k not in ("id", "name", "type")}
        network.add_entity(
            entity["id"],
            entity["name"],
            entity["type"],
            **extra
        )

    for relationship in data["relationships"]:
        extra = {
            k: v for k, v in relationship.items()
            if k not in ("source", "target", "relation", "weight", "timestamp", "created_at", "updated_at")
        }
        network.add_relationship(
            relationship["source"],
            relationship["target"],
            relationship["relation"],
            weight=relationship.get("weight", 1.0),
            timestamp=relationship.get("timestamp"),
            created_at=relationship.get("created_at"),
            updated_at=relationship.get("updated_at"),
            **extra
        )

    return network
"""Small SQLite persistence layer for the network investigation data."""

import sqlite3
from pathlib import Path

from src.graph.network import CriminalNetwork


class NetworkStorage:
    def __init__(self, database_path: Path):
        self.database_path = database_path
        self._create_tables()

    def _connection(self):
        connection = sqlite3.connect(self.database_path)
        connection.row_factory = sqlite3.Row
        connection.execute("PRAGMA foreign_keys = ON")
        return connection

    def _create_tables(self):
        with self._connection() as connection:
            connection.executescript(
                """
                CREATE TABLE IF NOT EXISTS entities (
                    id TEXT PRIMARY KEY,
                    name TEXT NOT NULL,
                    type TEXT NOT NULL
                );

                CREATE TABLE IF NOT EXISTS relationships (
                    source TEXT NOT NULL,
                    target TEXT NOT NULL,
                    relation TEXT NOT NULL,
                    PRIMARY KEY (source, target),
                    FOREIGN KEY (source) REFERENCES entities(id),
                    FOREIGN KEY (target) REFERENCES entities(id)
                );
                """
            )

    def is_empty(self) -> bool:
        with self._connection() as connection:
            return connection.execute("SELECT COUNT(*) FROM entities").fetchone()[0] == 0

    def add_entity(self, entity_id: str, name: str, entity_type: str):
        with self._connection() as connection:
            connection.execute(
                "INSERT INTO entities (id, name, type) VALUES (?, ?, ?)",
                (entity_id, name, entity_type),
            )

    def add_relationship(self, source: str, target: str, relation: str):
        with self._connection() as connection:
            connection.execute(
                "INSERT INTO relationships (source, target, relation) VALUES (?, ?, ?)",
                (source, target, relation),
            )

    def load_network(self) -> CriminalNetwork:
        network = CriminalNetwork()
        with self._connection() as connection:
            for entity in connection.execute("SELECT id, name, type FROM entities"):
                network.add_entity(entity["id"], entity["name"], entity["type"])
            for relationship in connection.execute(
                "SELECT source, target, relation FROM relationships"
            ):
                network.add_relationship(
                    relationship["source"],
                    relationship["target"],
                    relationship["relation"],
                )
        return network

    def seed(self, network: CriminalNetwork):
        with self._connection() as connection:
            connection.executemany(
                "INSERT INTO entities (id, name, type) VALUES (?, ?, ?)",
                [
                    (node_id, data["name"], data["type"])
                    for node_id, data in network.graph.nodes(data=True)
                ],
            )
            connection.executemany(
                "INSERT INTO relationships (source, target, relation) VALUES (?, ?, ?)",
                [
                    (source, target, data["relation"])
                    for source, target, data in network.graph.edges(data=True)
                ],
            )

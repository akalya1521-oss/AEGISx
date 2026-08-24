from datetime import datetime


events = []


def add_event(event_type, message, entity=None):
    events.insert(0, {
        "time": datetime.now().strftime("%H:%M:%S"),
        "type": event_type,
        "message": message,
        "entity": entity
    })


def get_events(limit=20):
    return events[:limit]
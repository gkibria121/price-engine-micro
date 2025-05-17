# Simulated database
users = [
    {"id": 1, "name": "Alice"},
    {"id": 2, "name": "Bob"}
]

def get_user_by_id(user_id):
    return next((u for u in users if u["id"] == user_id), None)

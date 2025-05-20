import os
from app import create_app

MONGO_URI = os.getenv("MONGO_URI")
NATS_URL = os.getenv("NATS_URL")

if not MONGO_URI:
    raise RuntimeError("❌ MONGO_URI not set")
if not NATS_URL:
    raise RuntimeError("❌ NATS_URL not set")

app = create_app()

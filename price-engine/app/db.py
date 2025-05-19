# app/db.py
from odmantic import AIOEngine
import os
from motor.motor_asyncio import AsyncIOMotorClient
MONGO_URL = os.getenv("MONGO_URL")
client = AsyncIOMotorClient(MONGO_URL)
engine = AIOEngine(client=client, database="price-engine")

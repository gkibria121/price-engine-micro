# app/db.py
from odmantic import AIOEngine
import os
from motor.motor_asyncio import AsyncIOMotorClient
MONGO_URI = os.getenv("MONGO_URI") 
parts = MONGO_URI.split("/")
db_name = parts[-1] if  parts[-1] != "" else "price-engine"
client = AsyncIOMotorClient(MONGO_URI)
engine = AIOEngine(client=client,database=db_name)

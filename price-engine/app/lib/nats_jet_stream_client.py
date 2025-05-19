import os
import asyncio
from nats.aio.client import Client as NATS
from nats.js.client import JetStreamContext
from nats.js.manager import JetStreamManager
from nats.js.api import StreamConfig
from app.events.subject import Subject
STEAM_NAME = "PRODUCT_EVENTS"
class JetStreamWrapper:
    def __init__(self, url: str):
        self.url = url
        self.nc: NATS = NATS()
        self.js: JetStreamContext = None
        self.jsm_admin: JetStreamManager = None

    async def connect(self):
        await self.nc.connect(servers=[self.url])
        self.js = self.nc.jetstream() 

        stream_name = STEAM_NAME
        subjects = Subject.values()

        try:
            await  self.js.stream_info(stream_name)
        except:
            config = StreamConfig(
                name=stream_name,
                subjects=subjects,
                max_msgs=100_000,
                max_bytes=100 * 1024 * 1024  # 100 MB
            )
            await self.jsm_admin.add_stream(config)
            print(f"Created stream: {stream_name}")

    async def disconnect(self):
        await self.nc.close()

    @property
    def client(self) -> JetStreamContext:
        if not self.js:
            raise RuntimeError("Please connect before accessing client")
        return self.js
 
js_wrapper = JetStreamWrapper(os.getenv("NATS_URL"))
 

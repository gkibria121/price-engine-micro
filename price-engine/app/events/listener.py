# listener.py
import asyncio
from abc import ABC, abstractmethod
from nats.aio.client import Client as NATS
from nats.js.client import JetStreamContext
from nats.js.api import ConsumerConfig, DeliverPolicy, AckPolicy
import random
import string

def generate_random_string(length=12):
    chars = string.ascii_letters + string.digits  # A-Z, a-z, 0-9
    return ''.join(random.choices(chars, k=length))

# Base listener class
class Listener(ABC):
    def __init__(self, js: JetStreamContext, subject: str, durable: str):
        self.subject = subject
        self.durable = durable
        self.js: JetStreamContext = js  # ✅ No separate NATS client

    @abstractmethod
    async def on_message(self, msg):
        pass

    async def listen(self):
        if not self.js:
            raise RuntimeError("❌ JetStream client not connected.")

        consumer_config = ConsumerConfig(
            durable_name=f"{self.durable}:{self.subject}",
            deliver_policy=DeliverPolicy.ALL,
            ack_policy=AckPolicy.EXPLICIT,
            ack_wait=5,  # seconds
            max_deliver=5,
                 )

        await self.js.subscribe(
            subject=self.subject,
            cb=self.on_message,
            config=consumer_config,
            manual_ack=True,
            queue="price-engine"
        ) 
        print(f"✅ Subscribed to {self.subject} with durable '{self.durable}'")
        while True:
            await asyncio.sleep(1)
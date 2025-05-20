# listener.py
import asyncio
from abc import ABC, abstractmethod
from nats.aio.client import Client as NATS
from nats.aio.msg import Msg
from nats.js.client import JetStreamContext
from nats.js.api import ConsumerConfig, DeliverPolicy, AckPolicy
import random
import string
import json
def generate_random_string(length=12):
    chars = string.ascii_letters + string.digits  # A-Z, a-z, 0-9
    return ''.join(random.choices(chars, k=length))

# Base listener class
class Listener(ABC):
    def __init__(self, js: JetStreamContext, subject: str, queue: str):
        self.subject = subject
        self.queue = queue
        self.js: JetStreamContext = js  # ✅ No separate NATS client

    @abstractmethod
    async def on_message(self, msg:Msg , data:dict):
        pass
    
    async def handle_message(self,msg:Msg):
        data = {}
        try:
            data = json.loads(msg.data.decode() )
        except: 
            print("Data cannot be converted to dict")
        await self.on_message(msg,data)
        

    async def listen(self):
        if not self.js:
            raise RuntimeError("❌ JetStream client not connected.")

        consumer_config = ConsumerConfig(
            durable_name=f"{self.queue}:{self.subject}",
            deliver_policy=DeliverPolicy.ALL, 
            ack_policy=AckPolicy.EXPLICIT,
            deliver_group=self.queue,  # important to match queue below
            ack_wait=10,  # seconds
            max_deliver=10,
        )

        await self.js.subscribe(
            subject=self.subject,
            cb=self.handle_message, 
            config=consumer_config,
            manual_ack=True, 
            queue=self.queue,  # must match deliver_group in config
        ) 

        print(f"✅ Subscribed to {self.subject} with durable '{self.queue}:{self.subject}'")
        while True:
            await asyncio.sleep(1)
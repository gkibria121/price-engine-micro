# listener.py
import asyncio
from abc import ABC, abstractmethod
from nats.aio.client import Client as NATS
from nats.js.client import JetStreamContext
from nats.js.api import ConsumerConfig, DeliverPolicy, AckPolicy

class Listener(ABC):
    
    def __init__(self,js, subject: str, durable: str):
        self.subject = subject
        self.durable = durable 
        self.nc = NATS()
        self.js: JetStreamContext = js

    @abstractmethod
    async def on_message(self, msg):
        pass

    async def listen(self): 
        if  not self.js:
            raise RuntimeError("Please connect jet stream.")
        
        consumer_config = ConsumerConfig(
            durable_name=self.durable,
            deliver_policy=DeliverPolicy.ALL,
            ack_policy=AckPolicy.EXPLICIT,
            ack_wait=5,      # seconds
            max_deliver=5
        )
        await self.js.subscribe(
            subject=self.subject,
            cb=self.on_message,
            config=consumer_config,
            manual_ack=True, 
        )

        print(f"Subscribed to {self.subject} with durable '{self.durable}'")
 

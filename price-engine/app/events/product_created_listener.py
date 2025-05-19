# product_created_listener.py
import asyncio
from .listener import Listener
from .subject import Subject
class ProductCreatedListener(Listener):
    
    def __init__(self,js):
        super().__init__(
            js,
            subject=Subject.PRODUCT_CREATED,
            durable="price-engine-service"
        )

    async def on_message(self, msg):
        print(f"Received product creation event: {msg.data.decode()}")
        await msg.ack()  # Manual acknowledgment

if __name__ == "__main__":
    listener = ProductCreatedListener()
    asyncio.run(listener.listen())

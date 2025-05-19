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
        try:
            data = msg.data.decode()
            print(f"Received product creation event: {data}") 
            # If processing succeeds, acknowledge the message:
            await msg.ack()
        except Exception as e:
            print(f"Error processing message: {e}")
            # Terminate the message to trigger redelivery
            await msg.term()
if __name__ == "__main__":
    listener = ProductCreatedListener()
    asyncio.run(listener.listen())

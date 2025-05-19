from .listener import Listener
from .subject import Subject
class VendorProductDeletedListener(Listener):
    
    def __init__(self,js):
        super().__init__(
            js,
            subject=Subject.VENDOR_PRODUCT_DELETED,
            durable="price-engine-service"
        ) 
    async def on_message(self, msg):
        try:
            data = msg.data.decode()
            print(f"Received vendor product deleted event: {data}") 
            # If processing succeeds, acknowledge the message:
            await msg.ack()
        except Exception as e:
            print(f"Error processing message: {e}")
            # Terminate the message to trigger redelivery
            await msg.term()
 
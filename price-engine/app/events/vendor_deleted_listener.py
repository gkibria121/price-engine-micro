# product_created_listener.py
from .listener import Listener
from .subject import Subject
class VendorDeletedListener(Listener):
    
    def __init__(self,js):
        super().__init__(
            js,
            subject=Subject.VENDOR_DELETED,
            queue="price-engine-service"
        )

    async def on_message(self, msg,data:dict):
        try:
            data = msg.data.decode()
            print(f"Received vendor deleted event: {data}") 
            # If processing succeeds, acknowledge the message:
            await msg.ack()
        except Exception as e:
            print(f"Error processing message: {e}")
            # Terminate the message to trigger redelivery
            await msg.term()
 
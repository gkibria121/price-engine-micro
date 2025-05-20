from .listener import Listener
from .subject import Subject
from app.models import VendorProduct
from app.db import engine
class VendorProductCreatedListener(Listener):
    
    def __init__(self,js,engine=engine):
        super().__init__(
            js,
            subject=Subject.VENDOR_PRODUCT_CREATED,
            queue="price-engine-service"
        ) 
        self.engine= engine
    async def on_message(self, msg,data:dict):
        try: 
            print(f"Received vendor product creation event") 
            vendor_product = VendorProduct(**data)
        
            await self.engine.save(vendor_product)
            print("vendor product added!")
            # If processing succeeds, acknowledge the message:
            await msg.ack()
        except Exception as e:
            print(f"Error processing message: {e}")
            # Terminate the message to trigger redelivery
            
 
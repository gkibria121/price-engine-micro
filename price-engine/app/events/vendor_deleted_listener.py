# product_created_listener.py
from .listener import Listener
from .subject import Subject
from app.db import engine 
from app.models import VendorProduct 
class VendorDeletedListener(Listener):
    
    def __init__(self,js,engine=engine):
        super().__init__(
            js,
            subject=Subject.VENDOR_DELETED,
            queue="price-engine-service"
        )
        self.engine=engine

    async def on_message(self, msg,data:dict):
        try:
            import json
            data = msg.data.decode()
            print(f"Received vendor deleted event: { data}") 
            from bson import ObjectId 
            parsed = json.loads(data)
            # Make sure the id is valid (ObjectId)
            vendor_id = parsed.get("id")   # or however you get it
            vendor_products = await self.engine.find(
                VendorProduct,{"vendor.id": vendor_id}
            )   
            if vendor_products:
                for vendor_product in vendor_products:
                    await self.engine.delete(vendor_product)
                
                print(f"VendorProduct related to  {vendor_id} deleted.")
            else:
                print(f"No VendorProduct found with vendor id {vendor_id}") 
            # If processing succeeds, acknowledge the message:
            await msg.ack()
        except Exception as e:
            print(f"Error processing message: {e}")
            # Terminate the message to trigger redelivery
            await msg.term()
 
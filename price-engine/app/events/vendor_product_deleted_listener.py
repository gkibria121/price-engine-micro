from .listener import Listener
from .subject import Subject
from app.models import VendorProduct
from app.db import engine
class VendorProductDeletedListener(Listener):
    
    def __init__(self,js,engine=engine):
        super().__init__(
            js,
            subject=Subject.VENDOR_PRODUCT_DELETED,
            queue="price-engine-service"
        ) 
        self.engine=engine
    async def on_message(self, msg,data:dict):
        try: 
            import json
            data = msg.data.decode()
            print(f"Received vendor product deleted event: { data}") 
            from bson import ObjectId 
            parsed = json.loads(data)
            # Make sure the id is valid (ObjectId)
            id = ObjectId(parsed.get("id")) 
            print("id",id)
            # Find the existing document first
            vendor_product = await self.engine.find_one(VendorProduct, VendorProduct.id == id) 
            if vendor_product:
                await self.engine.delete(vendor_product)
                print(f"VendorProduct {id} deleted.")
            else:
                RuntimeError(f"No VendorProduct found with id {id}")
     
            # If processing succeeds, acknowledge the message:
            await msg.ack()
        except Exception as e:
            print(f"Error processing message: {e}")
            # Terminate the message to trigger redelivery
            
 
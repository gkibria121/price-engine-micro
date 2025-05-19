# product_created_listener.py
import asyncio
from .listener import Listener
from .subject import Subject
from app.db import engine
from app.models import VendorProduct,Product
class ProductUpdatedListener(Listener):
    
    def __init__(self,js,engine=engine):
        super().__init__(
            js,
            subject=Subject.PRODUCT_UPDATED,
            queue="price-engine-service"
        )
        self.engine=engine
    async def on_message(self, msg,data:dict):
        try:
            import json
            from bson import ObjectId

            data = msg.data.decode()
            print(f"Received product update event: {data}") 

            parsed = json.loads(data)
            product_id = parsed.get("id")                # string 

            

            # Find all VendorProduct docs where product.id matches
            vendor_products = await self.engine.find(
                VendorProduct, {"product.id": product_id}
            )

            if vendor_products:
                 
                for vendor_product in vendor_products:
                    vendor_product.product  = Product(**parsed)  # update nested field
                    await self.engine.save(vendor_product)     # persist changes

                print(f"Updated product  for product.id {product_id}")
            else:
                print(f"No VendorProduct found with product.id {product_id}")

            # Acknowledge the message
            await msg.ack()
        except Exception as e:
            print(f"Error processing message: {e}")
            # Terminate the message to trigger redelivery
            await msg.term()
 
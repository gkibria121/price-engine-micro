import sys 
import asyncio
from app.lib.nats_jet_stream_client import js_wrapper
from app.events.product_created_listener import      ProductCreatedListener  
from app.events.product_updated_listener import      ProductUpdatedListener  
from app.events.product_deleted_listener import      ProductDeletedListener  
from app.events.vendor_deleted_listener import      VendorDeletedListener  
from app.events.vendor_updated_listener import      VendorUpdatedListener  
from app.events.vendor_product_created_listener import VendorProductCreatedListener
from app.events.vendor_product_updated_listener import VendorProductUpdatedListener
from app.events.vendor_product_deleted_listener import VendorProductDeletedListener
async def start_nats_listeners():
    try:
        await js_wrapper.connect()

        listeners = [
            ProductCreatedListener(js_wrapper.client),
            ProductUpdatedListener(js_wrapper.client),
            ProductDeletedListener(js_wrapper.client),
            VendorDeletedListener(js_wrapper.client),
            VendorUpdatedListener(js_wrapper.client),
            VendorProductCreatedListener(js_wrapper.client),
            VendorProductUpdatedListener(js_wrapper.client),
            VendorProductDeletedListener(js_wrapper.client)
        ]

        # Create tasks and wait for all of them
        tasks = [listener.listen() for listener in listeners]
        await asyncio.gather(*tasks, return_exceptions=False)  # Will raise if any listener fails

    except Exception as e:
        print(f"❌ NATS listeners failed: {e}", file=sys.stderr)
        sys.exit(1)
 
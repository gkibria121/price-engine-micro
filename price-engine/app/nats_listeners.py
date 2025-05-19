import sys
from app.lib.nats_jet_stream_client import js_wrapper
from app.events.product_created_listener import ProductCreatedListener
from app.events.vendor_product_created_listener import VendorProductCreatedListener
from app.events.vendor_product_updated_listener import VendorProductUpdatedListener
from app.events.vendor_product_deleted_listener import VendorProductDeletedListener

import asyncio
# import other listeners here
# from app.events.other_listener import OtherListener

async def start_nats_listeners():
    try:
        await js_wrapper.connect()

        listeners = [
            # ProductCreatedListener(js_wrapper.client),
            # VendorProductCreatedListener(js_wrapper.client),
            VendorProductUpdatedListener(js_wrapper.client),
            VendorProductDeletedListener(js_wrapper.client)
            
            # OtherListener(js_wrapper.client),
            # add more listeners here
        ]

        # Create tasks for all listeners
        tasks = [asyncio.create_task(listener.listen()) for listener in listeners] 
        while True:
            await asyncio.sleep(1)
    except Exception as e:
        print(f"❌ NATS listeners failed: {e}", file=sys.stderr)
        sys.exit(1)

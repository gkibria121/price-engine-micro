import sys 
import asyncio
from app.lib.nats_jet_stream_client import js_wrapper
from app.events.product_created_listener import ProductCreatedListener
from app.events.vendor_product_created_listener import VendorProductCreatedListener
from app.events.vendor_product_updated_listener import VendorProductUpdatedListener
from app.events.vendor_product_deleted_listener import VendorProductDeletedListener

async def start_nats_listeners():
    try:
        await js_wrapper.connect()

        listeners = [
            ProductCreatedListener(js_wrapper.client),
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

# To start it (if this is the main entry point):
if __name__ == "__main__":
    asyncio.run(start_nats_listeners())

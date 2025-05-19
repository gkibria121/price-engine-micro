from app.lib.nats_jet_stream_client import js_wrapper
from app.events.product_created_listener import ProductCreatedListener
import asyncio
# import other listeners here
# from app.events.other_listener import OtherListener

async def start_nats_listeners():
    await js_wrapper.connect()

    listeners = [
        ProductCreatedListener(js_wrapper.client),
        # OtherListener(js_wrapper.client),
        # add more listeners here
    ]

    # Create tasks for all listeners
    tasks = [asyncio.create_task(listener.listen()) for listener in listeners]

    # Await all listeners indefinitely (or until cancelled)
    await asyncio.gather(*tasks)

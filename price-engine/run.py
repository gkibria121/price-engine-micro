
import os
import sys
import asyncio
import uvicorn


# Load from environment
MONGO_URI = os.getenv("MONGO_URI") 
NATS_URL =  os.getenv("NATS_URL") 
print(NATS_URL)
if not MONGO_URI:
    sys.exit("❌ Environment variable MONGO_URL is not set. Please define it before starting the app.")
if not NATS_URL:
    sys.exit("❌ Environment variable NATS_URL is not set. Please define it before starting the app.")

from app import create_app
from app.nats_listeners import start_nats_listeners
app = create_app()



async def main():
    try:
        # Start NATS listener in background
        asyncio.create_task(start_nats_listeners())

        # Start FastAPI app
        config = uvicorn.Config(app, host="0.0.0.0", port=8000, log_level="info")
        server = uvicorn.Server(config)
        await server.serve()
    except Exception as e:
        print(f"❌ Fatal error during startup: {e}", file=sys.stderr)
        sys.exit(1)

if __name__ == '__main__':
    asyncio.run(main())
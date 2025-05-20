from fastapi import FastAPI
from .middleware import register_middleware
from .controllers import api_router  # Assuming you rename api_blueprint to api_router for FastAPI
from .nats_listeners import start_nats_listeners
from contextlib import asynccontextmanager

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup logic
    print("🔄 Starting NATS listener...")
    import asyncio
    asyncio.create_task(start_nats_listeners())

    yield  # Application runs during this period

    # Optional: Shutdown logic
    print("🛑 Shutting down...")
    
def create_app():
    app = FastAPI(lifespan=lifespan)
    
    register_middleware(app)
    
    app.include_router(api_router, prefix='/api/v1/price-engine')
    
    return app

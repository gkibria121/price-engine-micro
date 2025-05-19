from fastapi import FastAPI
from .middleware import register_middleware
from .controllers import api_router  # Assuming you rename api_blueprint to api_router for FastAPI

def create_app():
    app = FastAPI()
    
    register_middleware(app)
    
    app.include_router(api_router, prefix='/api/v1/price-engine')
    
    return app

from flask import Flask
from .middleware import register_middleware 
from app.db import mongo
def create_app():
    app = Flask(__name__)
     # Replace with your MongoDB URI
    app.config["MONGO_URI"] = "mongodb://localhost:27017/price-engine"
    mongo.__init__(app)
    register_middleware(app)

    from .controllers import api_blueprint
   
    app.register_blueprint(api_blueprint, url_prefix='/api/v1/price-engine')

    return app

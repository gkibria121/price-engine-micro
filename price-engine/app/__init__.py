from flask import Flask
from .middleware import register_middleware

def create_app():
    app = Flask(__name__)
    
    register_middleware(app)

    from .controllers import api_blueprint
    app.register_blueprint(api_blueprint, url_prefix='/api/v1/price-engine')

    return app

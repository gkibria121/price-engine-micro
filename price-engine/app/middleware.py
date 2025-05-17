from flask import request, jsonify
from .exceptions.ValidationException import ValidationException
def register_middleware(app):
    @app.before_request
    def log_request_info():
        print(f"[Middleware] {request.method} {request.path}")

    @app.errorhandler(ValidationException)
    def handle_value_error(e):
        print(f"[ErrorHandler] ValueError: {str(e)}")
        return jsonify({ "message": e.message,'errors': e.errors }), 422
 
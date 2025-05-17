from flask import request, jsonify
from .exceptions.ValidationException import ValidationException

def register_middleware(app):
    @app.before_request
    def log_request_info():
        print(f"[Middleware] {request.method} {request.path}")

    @app.errorhandler(ValidationException)
    def handle_validation_error(e):
        message = getattr(e, 'message', str(e))
        errors = getattr(e, 'errors', {})
        print({"message": message, "errors": errors})
        return jsonify({"message": message, "errors": errors}), 422

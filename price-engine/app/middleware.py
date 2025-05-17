from flask import request

def register_middleware(app):
    @app.before_request
    def log_request_info():
        print(f"[Middleware] {request.method} {request.path}")

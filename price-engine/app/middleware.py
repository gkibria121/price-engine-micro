from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware
from app.exceptions.ValidationException import ValidationException
from app.exceptions.CustomException import CustomException

# Logging middleware using BaseHTTPMiddleware
class LoggingMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        print(f"[Middleware] {request.method} {request.url.path}")
        response = await call_next(request)
        return response

def register_middleware(app: FastAPI):
    # Add logging middleware
    app.add_middleware(LoggingMiddleware)

    # Exception handler for ValidationException
    @app.exception_handler(ValidationException)
    async def validation_exception_handler(request: Request, exc: ValidationException):
        message = getattr(exc, 'message', str(exc))
        errors = getattr(exc, 'errors', {})
        print({"message": message, "errors": errors})
        return JSONResponse(
            status_code=422,
            content={"message": message, "errors": errors}
        )

    # Exception handler for CustomException
    @app.exception_handler(CustomException)
    async def custom_exception_handler(request: Request, exc: CustomException):
        message = getattr(exc, 'message', str(exc))
        status = getattr(exc, 'status', 500)
        print({"message": message, "status": status})
        return JSONResponse(
            status_code=status,
            content={"message": message}
        )

    # Exception handler for ValueError
    @app.exception_handler(ValueError)
    async def value_error_handler(request: Request, exc: ValueError):
        message = getattr(exc, 'message', str(exc))
        status = 500
        print({"message": message, "status": status})
        return JSONResponse(
            status_code=status,
            content={"message": message}
        )

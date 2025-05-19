from .CustomException import CustomException
class ValidationException(CustomException):
    def __init__(self, message, errors=None):
        super().__init__(message)
        self.message = message
        self.errors = errors or {}
        self.status = 422

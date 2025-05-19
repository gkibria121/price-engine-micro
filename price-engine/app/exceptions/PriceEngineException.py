from .CustomException import CustomException
class PriceEngineException(CustomException):
    def __init__(self, message  ):
        super().__init__(message)
        self.message = message 
        self.status = 500

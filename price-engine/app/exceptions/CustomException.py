from abc import ABC, abstractmethod

class CustomException(Exception, ABC):
    def __init__(self, message: str):
        super().__init__(message)
        self.message = message
        self.status = 500

    @abstractmethod
    def handle(self):
        """Handle the exception (to be implemented by subclasses)."""
        pass

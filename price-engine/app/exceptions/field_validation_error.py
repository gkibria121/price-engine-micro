from .ValidationException import ValidationException
class FieldValidationError(ValidationException):
    def __init__(self, name, error):
        
        super().__init__(error, { f"{name}" : [ error]})
from pydantic import ValidationError
from .schemas.calculation_schema import CalculationRequest
from .exceptions.ValidationException import ValidationException
from .utils.functions import format_pydantic_errors
def validate_calculation_request(data:dict):
    try:
        json_data =  data
        validated_data = CalculationRequest(**json_data)
        return validated_data.dict()
    except ValidationError as e:
        error_response = format_pydantic_errors(e.errors())
        raise ValidationException(error_response['message'], error_response['errors'])

from flask import request, jsonify
from pydantic import ValidationError
from .schemas.calculation_schema import CalculationRequest
from .exceptions.ValidationException import ValidationException
from .utils.functions import format_pydantic_errors
def validate_calculation_request():
    try:
        json_data = request.get_json()
        validated_data = CalculationRequest(**json_data)
        return validated_data.dict(), None, 200
    except ValidationError as e:
        error_response = format_pydantic_errors(e.errors())
        print(error_response)
        raise ValidationException(error_response['message'], error_response['errors'])

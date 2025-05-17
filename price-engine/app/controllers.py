from flask import Blueprint, jsonify, request 
from .validators import  validate_calculation_request

api_blueprint = Blueprint('api', __name__)
 
@api_blueprint.route('/calculate-price', methods=['POST'])
def calculate_price(): 
    data, error_response, status = validate_calculation_request()
    if error_response:
        return  error_response , status
    result  =  {
      "productName": "Product 1",
      "quantity": 5,
      "totalPrice": 547.32125,
      "breakdown": {
        "basePrice": 51.375,
        "attributeCost": 352.94625,
        "deliveryCharge": 143,
      },
    }
    if result:
        return jsonify(result)
    else: 
        return jsonify({"error": "User not found"}), 404
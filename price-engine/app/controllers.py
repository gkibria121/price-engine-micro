from flask import Blueprint, jsonify, request
from .models import get_user_by_id
from .validators import validate_user_id

api_blueprint = Blueprint('api', __name__)

@api_blueprint.route('/user', methods=['GET'])
def get_user():

    user_id, error_response, status = validate_user_id()
    print(user_id)
    if error_response:
        return error_response, status

    user = get_user_by_id(user_id)
    if user:
        return jsonify({"success": True, "user": user})
    else:
        return jsonify({"error": "User not found"}), 404

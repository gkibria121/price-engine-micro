from flask import request, jsonify

def validate_user_id():
    try:
        print(request.args)
        user_id = int(request.args.get('id'))
        if user_id <= 0:
            raise ValueError
        return user_id, None,200
    except (TypeError, ValueError):
        return None, jsonify({"error": "Invalid or missing 'id' query parameter"}), 400

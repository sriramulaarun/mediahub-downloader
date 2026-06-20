from werkzeug.security import generate_password_hash, check_password_hash
from functools import wraps
from flask_jwt_extended import get_jwt_identity, verify_jwt_in_request
from flask import jsonify

def hash_password(password):
    return generate_password_hash(password)

def verify_password(password, hashed_password):
    return check_password_hash(hashed_password, password)

def admin_required():
    def wrapper(fn):
        @wraps(fn)
        def decorator(*args, **kwargs):
            verify_jwt_in_request()
            current_user = get_jwt_identity()
            # Expecting identity to be a dict containing role
            if not current_user or current_user.get('role') != 'admin':
                return jsonify({'error': 'Admin privileges required'}), 403
            return fn(*args, **kwargs)
        return decorator
    return wrapper

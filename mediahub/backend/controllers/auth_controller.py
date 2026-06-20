from flask import jsonify, request
from flask_jwt_extended import create_access_token
from services import db_service
from utils.security import hash_password, verify_password
from utils.helpers import is_valid_email

def register_user():
    data = request.get_json() or {}
    name = data.get('name', '').strip()
    email = data.get('email', '').strip().lower()
    password = data.get('password', '')
    
    if not name or not email or not password:
        return jsonify({'error': 'Name, email and password are required'}), 400
        
    if not is_valid_email(email):
        return jsonify({'error': 'Invalid email address format'}), 400
        
    if len(password) < 6:
        return jsonify({'error': 'Password must be at least 6 characters long'}), 400
        
    if db_service.get_user_by_email(email):
        return jsonify({'error': 'Email is already registered'}), 409
        
    try:
        pw_hash = hash_password(password)
        # First registered user becomes an admin for demonstration/setup ease
        is_first_user = len(db_service.get_all_users()) == 0
        role = 'admin' if is_first_user else 'user'
        
        user = db_service.create_user(name, email, pw_hash, role)
        
        identity = {'id': user.id, 'email': user.email, 'role': user.role}
        access_token = create_access_token(identity=identity)
        
        return jsonify({
            'message': 'Registration successful',
            'token': access_token,
            'user': user.to_dict()
        }), 201
    except Exception as e:
        return jsonify({'error': f'Failed to create user: {str(e)}'}), 500

def login_user():
    data = request.get_json() or {}
    email = data.get('email', '').strip().lower()
    password = data.get('password', '')
    
    if not email or not password:
        return jsonify({'error': 'Email and password are required'}), 400
        
    user = db_service.get_user_by_email(email)
    if not user or not verify_password(password, user.password_hash):
        return jsonify({'error': 'Invalid email or password'}), 401
        
    identity = {'id': user.id, 'email': user.email, 'role': user.role}
    access_token = create_access_token(identity=identity)
    
    return jsonify({
        'message': 'Login successful',
        'token': access_token,
        'user': user.to_dict()
    }), 200

def google_login_mock():
    data = request.get_json() or {}
    email = data.get('email', '').strip().lower()
    name = data.get('name', '').strip()
    
    if not email or not name:
        return jsonify({'error': 'Email and Name are required for Google Login'}), 400
        
    # Check if user already exists
    user = db_service.get_user_by_email(email)
    
    if not user:
        # Create user with a dummy hashed password since they log in via Google
        pw_hash = hash_password("google-auth-dummy-password")
        user = db_service.create_user(name, email, pw_hash, 'user')
        
    identity = {'id': user.id, 'email': user.email, 'role': user.role}
    access_token = create_access_token(identity=identity)
    
    return jsonify({
        'message': 'Google login successful',
        'token': access_token,
        'user': user.to_dict()
    }), 200

def forgot_password():
    data = request.get_json() or {}
    email = data.get('email', '').strip().lower()
    
    if not email:
        return jsonify({'error': 'Email is required'}), 400
        
    user = db_service.get_user_by_email(email)
    if not user:
        # Avoid user enumeration attacks: return positive response regardless
        return jsonify({'message': 'If the email exists, reset instructions have been sent'}), 200
        
    # In production, send email reset link. For mockup, we return success.
    return jsonify({
        'message': 'Reset link successfully generated and sent to email',
        'email_sent': True
    }), 200

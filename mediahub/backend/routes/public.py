from flask import Blueprint, jsonify, request
from services import db_service

public_bp = Blueprint('public', __name__)

@public_bp.route('/blog', methods=['GET'])
def get_blog():
    slug = request.args.get('slug')
    if slug:
        post = db_service.get_blog_post_by_slug(slug)
        if not post:
            return jsonify({'error': 'Blog post not found'}), 404
        return jsonify(post.to_dict()), 200
        
    posts = db_service.get_all_blog_posts()
    return jsonify([p.to_dict() for p in posts]), 200

@public_bp.route('/contact', methods=['POST'])
def submit_contact():
    data = request.get_json() or {}
    name = data.get('name', '').strip()
    email = data.get('email', '').strip().lower()
    message = data.get('message', '').strip()
    
    if not name or not email or not message:
        return jsonify({'error': 'Name, email, and message are required'}), 400
        
    try:
        msg = db_service.add_contact_message(name, email, message)
        return jsonify({
            'message': 'Your message has been submitted successfully!',
            'contact': msg.to_dict()
        }), 201
    except Exception as e:
        return jsonify({'error': f'Failed to submit message: {str(e)}'}), 500

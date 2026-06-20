from flask import jsonify, request
from services import db_service
from models.database import db, User, Download, Subscription
from datetime import datetime

def get_admin_stats():
    users = db_service.get_all_users()
    downloads = db_service.get_all_downloads()
    subscriptions = db_service.get_all_subscriptions()
    
    total_users = len(users)
    total_downloads = len(downloads)
    
    # Calculate premium subscriptions
    active_premium_subs = sum(1 for s in subscriptions if s.plan == 'premium' and s.status == 'active')
    
    # Calculate simulated revenue ($9.99 per active premium subscription per month)
    revenue = active_premium_subs * 9.99
    
    # Map users list with subscriptions
    user_list = []
    for u in users:
        sub = db_service.get_user_subscription(u.id)
        user_list.append({
            'id': u.id,
            'name': u.name,
            'email': u.email,
            'role': u.role,
            'created_at': u.created_at.isoformat(),
            'subscription': sub.to_dict() if sub else {'plan': 'free', 'status': 'active'}
        })
        
    # Group downloads by platform
    platform_stats = {}
    for d in downloads:
        platform_stats[d.platform] = platform_stats.get(d.platform, 0) + 1
        
    platforms = [{'name': k, 'value': v} for k, v in platform_stats.items()]
    
    return jsonify({
        'metrics': {
            'total_users': total_users,
            'total_downloads': total_downloads,
            'active_premium_subscriptions': active_premium_subs,
            'estimated_monthly_revenue': round(revenue, 2)
        },
        'users': user_list,
        'platforms': platforms
    }), 200

def update_user_role(user_id):
    user = db_service.get_user_by_id(user_id)
    if not user:
        return jsonify({'error': 'User not found'}), 404
        
    data = request.get_json() or {}
    new_role = data.get('role')
    
    if new_role not in ['user', 'admin']:
        return jsonify({'error': 'Invalid role specification'}), 400
        
    user.role = new_role
    db.session.commit()
    return jsonify({'message': f'User role updated to {new_role}', 'user': user.to_dict()}), 200

def update_user_subscription(user_id):
    user = db_service.get_user_by_id(user_id)
    if not user:
        return jsonify({'error': 'User not found'}), 404
        
    data = request.get_json() or {}
    plan = data.get('plan') # 'free', 'premium'
    status = data.get('status', 'active') # 'active', 'expired'
    
    if plan not in ['free', 'premium']:
        return jsonify({'error': 'Invalid plan specification'}), 400
        
    sub = db_service.create_or_update_subscription(user_id, plan, status, expiry_days=30)
    return jsonify({'message': 'User subscription updated successfully', 'subscription': sub.to_dict()}), 200

def delete_user(user_id):
    user = db_service.get_user_by_id(user_id)
    if not user:
        return jsonify({'error': 'User not found'}), 404
        
    db.session.delete(user)
    db.session.commit()
    return jsonify({'message': 'User and associated data deleted successfully'}), 200

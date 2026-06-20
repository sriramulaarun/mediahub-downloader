from flask import jsonify, request
from flask_jwt_extended import get_jwt_identity
from services import db_service
from collections import Counter
from datetime import datetime, timedelta

def get_history():
    identity = get_jwt_identity()
    user_id = identity.get('id')
    
    downloads = db_service.get_downloads_by_user(user_id)
    return jsonify([d.to_dict() for d in downloads]), 200

def get_favorites():
    identity = get_jwt_identity()
    user_id = identity.get('id')
    
    favorites = db_service.get_favorites_by_user(user_id)
    return jsonify([f.to_dict() for f in favorites]), 200

def toggle_favorite():
    identity = get_jwt_identity()
    user_id = identity.get('id')
    
    # Support query parameter fallback (especially useful for DELETE requests)
    data = request.get_json() or {}
    download_id = request.args.get('download_id', type=int) or data.get('download_id')
    
    if not download_id:
        return jsonify({'error': 'download_id is required'}), 400
        
    assoc = db_service.get_favorite_assoc(user_id, download_id)
    
    if request.method == 'DELETE':
        if assoc:
            db_service.remove_favorite(user_id, download_id)
            return jsonify({'message': 'Removed from favorites', 'is_favorite': False}), 200
        return jsonify({'message': 'Item was not favorited', 'is_favorite': False}), 200
        
    # POST Method: Toggle behavior
    if assoc:
        db_service.remove_favorite(user_id, download_id)
        return jsonify({'message': 'Removed from favorites', 'is_favorite': False}), 200
    else:
        db_service.add_favorite(user_id, download_id)
        return jsonify({'message': 'Added to favorites', 'is_favorite': True}), 200

def get_dashboard_stats():
    identity = get_jwt_identity()
    user_id = identity.get('id')
    
    downloads = db_service.get_downloads_by_user(user_id)
    favorites = db_service.get_favorites_by_user(user_id)
    sub = db_service.get_user_subscription(user_id)
    
    total_downloads = len(downloads)
    total_favorites = len(favorites)
    total_size = sum([d.file_size for d in downloads if d.file_size])
    
    # Platform counts
    platform_counter = Counter([d.platform for d in downloads])
    platforms_chart = [{'name': k, 'value': v} for k, v in platform_counter.items()]
    
    # Download stats over the last 7 days for the chart
    days_chart = []
    now = datetime.utcnow()
    for i in range(6, -1, -1):
        day_date = now - timedelta(days=i)
        day_str = day_date.strftime('%Y-%m-%d')
        # Count downloads on this day
        day_count = sum(1 for d in downloads if d.created_at.date() == day_date.date())
        days_chart.append({
            'date': day_date.strftime('%b %d'),
            'downloads': day_count
        })
        
    # Activity timeline
    timeline = []
    for d in downloads[:10]: # limit to 10
        timeline.append({
            'id': d.id,
            'title': d.title,
            'platform': d.platform,
            'format': d.format,
            'time': d.created_at.isoformat()
        })
        
    return jsonify({
        'stats': {
            'total_downloads': total_downloads,
            'total_favorites': total_favorites,
            'storage_used_bytes': total_size,
            'subscription': sub.to_dict() if sub else {'plan': 'free', 'status': 'active'}
        },
        'charts': {
            'platforms': platforms_chart,
            'days': days_chart
        },
        'timeline': timeline
    }), 200

def manage_subscription():
    identity = get_jwt_identity()
    user_id = identity.get('id')
    
    data = request.get_json() or {}
    plan = data.get('plan') # 'free' or 'premium'
    
    if plan not in ['free', 'premium']:
        return jsonify({'error': 'Invalid subscription plan'}), 400
        
    expiry_days = 30 if plan == 'premium' else 365
    sub = db_service.create_or_update_subscription(user_id, plan, 'active', expiry_days)
    
    return jsonify({
        'message': f'Subscription plan updated to {plan}',
        'subscription': sub.to_dict()
    }), 200

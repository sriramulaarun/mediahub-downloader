from flask import jsonify, request, send_file, current_app
from flask_jwt_extended import get_jwt_identity, verify_jwt_in_request
from services import ytdlp_service, db_service
import os

def analyze_media():
    data = request.get_json() or {}
    url = data.get('url', '').strip()
    
    if not url:
        return jsonify({'error': 'URL is required'}), 400
        
    try:
        metadata = ytdlp_service.analyze_url(url)
        return jsonify(metadata), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400

def download_media():
    # We want optional JWT authentication.
    # verify_jwt_in_request(optional=True) checks for token but doesn't fail if absent.
    try:
        verify_jwt_in_request(optional=True)
        identity = get_jwt_identity()
    except Exception:
        identity = None
        
    data = request.get_json() or {}
    url = data.get('url', '').strip()
    format_id = data.get('format', '720p').strip() # default to 720p
    
    if not url:
        return jsonify({'error': 'URL is required'}), 400
        
    # Enforce premium limits on 1080p
    if format_id == '1080p':
        if not identity:
            return jsonify({
                'error': '1080p Full HD download is a premium feature. Please register or log in.',
                'premium_required': True
            }), 403
            
        user_id = identity.get('id')
        sub = db_service.get_user_subscription(user_id)
        if not sub or sub.plan != 'premium' or sub.status != 'active':
            return jsonify({
                'error': '1080p Full HD download requires an active Premium Subscription.',
                'premium_required': True
            }), 403
            
    # Clean output downloads folder path
    download_dir = current_app.config['DOWNLOAD_FOLDER']
    
    try:
        # Download media file using yt-dlp service
        result = ytdlp_service.download_media(url, format_id, download_dir)
        filepath = result['filepath']
        filename = result['filename']
        file_size = result['file_size']
        platform = result['platform']
        title = result['title']
        
        # Save download log in the database if user is logged in
        user_id = identity.get('id') if identity else None
        db_service.add_download(
            user_id=user_id,
            url=url,
            platform=platform,
            title=title,
            format=format_id,
            file_size=file_size
        )
        
        # Check if file exists before sending
        if not os.path.exists(filepath):
            return jsonify({'error': 'The downloaded file was not found on the server'}), 500
            
        # Send the file to client as attachment
        # Note: Clean up is managed by the background timer task in app.py
        return send_file(
            filepath,
            as_attachment=True,
            download_name=filename,
            mimetype='application/octet-stream'
        )
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

import os
import time
import threading
from flask import Flask, jsonify, send_from_directory
from flask_cors import CORS
from flask_jwt_extended import JWTManager

from config import Config
from models.database import db
from routes.auth import auth_bp
from routes.media import media_bp
from routes.dashboard import dashboard_bp
from routes.admin import admin_bp
from routes.public import public_bp

def seed_database():
    from services.db_service import get_all_blog_posts, create_blog_post
    try:
        if len(get_all_blog_posts()) == 0:
            create_blog_post(
                title="How to Download YouTube Videos in 1080p Quality",
                slug="download-youtube-1080p",
                content="Downloading YouTube videos in Full HD (1080p) or 4K resolution can be tricky. This is because YouTube streams high-resolution video and audio files separately. To merge them, you need a transcoding library like FFmpeg. With MediaHub Downloader Premium, we handle this merging process on our servers automatically, delivering a single, combined MP4 file directly to your device. Simply paste the link, choose 1080p format, and download in seconds!",
                image="https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=800&auto=format&fit=crop&q=60"
            )
            create_blog_post(
                title="Instagram Reels Downloader: Save Reels to Your Phone",
                slug="save-instagram-reels",
                content="Instagram Reels are a great source of entertainment, education, and inspiration. However, Instagram doesn't offer an official way to download Reels directly to your camera roll. MediaHub Downloader allows you to easily parse any Instagram URL and download Reels directly. Our downloader bypasses speed restrictions to save reels as high-quality MP4 videos. Best of all, it works directly on mobile browsers without installing third-party apps!",
                image="https://images.unsplash.com/photo-1611262588024-d12430b98920?w=800&auto=format&fit=crop&q=60"
            )
            create_blog_post(
                title="Why a Unified Media Downloader SaaS is the Future",
                slug="unified-downloader-saas",
                content="Managing multiple media downloader apps or using sketchy sites filled with pop-up ads can be frustrating. MediaHub offers a unified, secure, and modern SaaS dashboard experience. By centralizing downloader tools for YouTube, Instagram, Facebook, and Twitter under one roof, we provide content creators, marketers, and students a seamless workspace. With Premium features like download analytics, bulk downloads, and history sync, MediaHub is the ultimate download manager.",
                image="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=60"
            )
            print("Database seeded with default blog posts.")
    except Exception as e:
        print(f"Error seeding database: {str(e)}")

def start_cleanup_scheduler(app):
    def cleanup_loop():
        # Keep clean-up running in the background
        download_folder = app.config['DOWNLOAD_FOLDER']
        max_age = app.config['MAX_FILE_AGE_SECONDS']
        interval = app.config['CLEANUP_INTERVAL_SECONDS']
        
        while True:
            try:
                now = time.time()
                if os.path.exists(download_folder):
                    for filename in os.listdir(download_folder):
                        filepath = os.path.join(download_folder, filename)
                        if os.path.isfile(filepath):
                            file_modified = os.path.getmtime(filepath)
                            # Remove file if it is older than max_age
                            if (now - file_modified) > max_age:
                                os.remove(filepath)
                                print(f"Cleaned up expired media file: {filename}")
            except Exception as e:
                # Silently catch exceptions to keep daemon alive
                pass
            time.sleep(interval)
            
    thread = threading.Thread(target=cleanup_loop, daemon=True)
    thread.start()

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    
    # Enable CORS for all routes (important for React integration)
    CORS(app, resources={r"/api/*": {"origins": "*"}})
    
    # Initialize DB & JWT
    db.init_app(app)
    jwt = JWTManager(app)
    
    # Register API Blueprints
    app.register_blueprint(auth_bp, url_prefix='/api')
    app.register_blueprint(media_bp, url_prefix='/api')
    app.register_blueprint(dashboard_bp, url_prefix='/api')
    app.register_blueprint(public_bp, url_prefix='/api')
    app.register_blueprint(admin_bp, url_prefix='/api/admin')
    
    # Serve React Frontend Static Assets
    dist_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'frontend', 'dist'))
    
    @app.route('/api/debug-ffmpeg')
    def debug_ffmpeg():
        import shutil
        import subprocess
        ffmpeg_shutil = shutil.which('ffmpeg')
        ffmpeg_exe = shutil.which('ffmpeg.exe')
        
        # Try running which ffmpeg
        try:
            which_out = subprocess.check_output(['which', 'ffmpeg'], stderr=subprocess.STDOUT).decode().strip()
        except Exception as e:
            which_out = f"Error running which: {str(e)}"
            
        try:
            where_out = subprocess.check_output(['whereis', 'ffmpeg'], stderr=subprocess.STDOUT).decode().strip()
        except Exception as e:
            where_out = f"Error running whereis: {str(e)}"
            
        return jsonify({
            'ffmpeg_shutil': ffmpeg_shutil,
            'ffmpeg_exe': ffmpeg_exe,
            'which_out': which_out,
            'where_out': where_out,
            'path_env': os.environ.get('PATH', ''),
            'nixpacks_exists': os.path.exists('nixpacks.toml'),
            'nixpacks_root_exists': os.path.exists('../nixpacks.toml')
        }), 200

    @app.route('/', defaults={'path': ''})
    @app.route('/<path:path>')
    def serve_frontend(path):
        if path.startswith('api/'):
            return jsonify({'error': 'Endpoint not found'}), 404
            
        # Serve file if it exists in dist directory
        if path != "" and os.path.exists(os.path.join(dist_dir, path)):
            return send_from_directory(dist_dir, path)
            
        # Serve index.html for History routing fallback
        if os.path.exists(os.path.join(dist_dir, 'index.html')):
            return send_from_directory(dist_dir, 'index.html')
            
        # Status fallback if static assets are not built yet
        return jsonify({
            'status': 'healthy',
            'service': 'MediaHub Downloader API (Frontend Build Missing)',
            'version': '1.0.0'
        }), 200
        
    # Global JWT custom error responses
    @jwt.unauthorized_loader
    def unauthorized_response(callback):
        return jsonify({'error': 'Missing Authorization Header or Token'}), 401
        
    @jwt.expired_token_loader
    def expired_token_response(jwt_header, jwt_payload):
        return jsonify({'error': 'Authorization Token has expired'}), 401
        
    # Database Initialization & Scheduler Startup
    with app.app_context():
        db.create_all()
        seed_database()
        start_cleanup_scheduler(app)
        
    return app

if __name__ == '__main__':
    app = create_app()
    # Read environment variables for port or fallback to 5000
    port = int(os.environ.get('PORT', 5093))
    app.run(host='0.0.0.0', port=port, debug=True)

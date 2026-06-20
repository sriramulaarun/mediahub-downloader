from flask import Blueprint
from controllers.media_controller import analyze_media, download_media

media_bp = Blueprint('media', __name__)

media_bp.route('/analyze', methods=['POST'])(analyze_media)
media_bp.route('/download', methods=['POST'])(download_media)

from flask import Blueprint
from flask_jwt_extended import jwt_required
from controllers.dashboard_controller import (
    get_history, get_favorites, toggle_favorite, get_dashboard_stats, manage_subscription
)

dashboard_bp = Blueprint('dashboard', __name__)

dashboard_bp.route('/history', methods=['GET'])(jwt_required()(get_history))
dashboard_bp.route('/favorites', methods=['GET'])(jwt_required()(get_favorites))
dashboard_bp.route('/favorite', methods=['POST', 'DELETE'])(jwt_required()(toggle_favorite))
dashboard_bp.route('/dashboard', methods=['GET'])(jwt_required()(get_dashboard_stats))
dashboard_bp.route('/subscription', methods=['POST'])(jwt_required()(manage_subscription))

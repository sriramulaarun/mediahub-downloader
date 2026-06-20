from flask import Blueprint
from utils.security import admin_required
from controllers.admin_controller import (
    get_admin_stats, update_user_role, update_user_subscription, delete_user
)

admin_bp = Blueprint('admin', __name__)

admin_bp.route('/stats', methods=['GET'])(admin_required()(get_admin_stats))
admin_bp.route('/users/<int:user_id>/role', methods=['PUT'])(admin_required()(update_user_role))
admin_bp.route('/users/<int:user_id>/subscription', methods=['PUT'])(admin_required()(update_user_subscription))
admin_bp.route('/users/<int:user_id>', methods=['DELETE'])(admin_required()(delete_user))

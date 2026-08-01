from flask import Blueprint
from app.controllers.category_controller import category_bp
from app.controllers.product_controller import product_bp
from app.controllers.admin_controller import admin_bp
from app.controllers.auth_controller import auth_bp
from app.controllers.order_controller import order_bp

api_bp = Blueprint('api', __name__)

api_bp.register_blueprint(category_bp, url_prefix='/categories')
api_bp.register_blueprint(product_bp, url_prefix='/products')
api_bp.register_blueprint(admin_bp, url_prefix='/admin')
api_bp.register_blueprint(auth_bp, url_prefix='/auth')
api_bp.register_blueprint(order_bp, url_prefix='/orders')

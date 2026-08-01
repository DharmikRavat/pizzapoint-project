from flask import Blueprint, jsonify
from app.models import User, Product, Category, Order
from app.extensions import db

admin_bp = Blueprint('admin', __name__)

@admin_bp.route('/dashboard', methods=['GET'])
def get_dashboard_stats():
    try:
        total_users = User.query.count()
        total_products = Product.query.count()
        total_categories = Category.query.count()
        
        total_orders = Order.query.count()
        
        # Calculate total revenue
        revenue_query = db.session.query(db.func.sum(Order.total_amount)).scalar()
        total_revenue = float(revenue_query) if revenue_query else 0.0

        return jsonify({
            'status': 'success',
            'data': {
                'totalUsers': total_users,
                'totalProducts': total_products,
                'totalCategories': total_categories,
                'totalOrders': total_orders,
                'totalRevenue': total_revenue
            }
        }), 200
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500

@admin_bp.route('/customers', methods=['GET'])
def get_all_customers():
    try:
        # Fetch users with role 'Customer' or 'customer', case insensitive if possible
        # Actually in auth_controller it is set as "Customer", and in models default is 'customer'
        users = User.query.filter(db.or_(User.role == 'Customer', User.role == 'customer')).order_by(User.created_at.desc()).all()
        return jsonify({
            'status': 'success',
            'data': [user.to_dict() for user in users]
        }), 200
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500

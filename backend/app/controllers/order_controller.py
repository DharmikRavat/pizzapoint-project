from flask import Blueprint, jsonify, request
from app.extensions import db
from app.models import Order, OrderItem, Product
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt

order_bp = Blueprint('orders', __name__)

def admin_required():
    claims = get_jwt()
    if claims.get('role') != 'Admin':
        return jsonify({'status': 'error', 'message': 'Admin access required'}), 403

@order_bp.route('/', methods=['GET'])
@jwt_required()
def get_all_orders():
    admin_check = admin_required()
    if admin_check: return admin_check
    try:
        orders = Order.query.order_by(Order.created_at.desc()).all()
        return jsonify({
            'status': 'success',
            'data': [order.to_dict() for order in orders]
        }), 200
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500

@order_bp.route('/', methods=['POST'])
@jwt_required()
def create_order():
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        
        items = data.get('items', [])
        delivery_address = data.get('deliveryAddress', 'Store Pickup')
        payment_method = data.get('paymentMethod', 'COD')
        promo_code = data.get('promoCode', '').upper()
        
        if not items:
            return jsonify({'status': 'error', 'message': 'No items in order'}), 400
            
        subtotal = 0
        order = Order(user_id=user_id, delivery_address=delivery_address, payment_method=payment_method, total_amount=0)
        db.session.add(order)
        db.session.flush() # To get order.id
        
        for item in items:
            product_id = item.get('productId')
            quantity = item.get('quantity', 1)
            
            product = Product.query.get(product_id)
            if not product:
                db.session.rollback()
                return jsonify({'status': 'error', 'message': f'Product {product_id} not found'}), 404
                
            price = product.discount_price if product.discount_price else product.price
            subtotal += (price * quantity)
            
            order_item = OrderItem(
                order_id=order.id,
                product_id=product.id,
                quantity=quantity,
                price_at_time=price
            )
            db.session.add(order_item)
            
        # Calculate Delivery and Discount
        delivery_fee = 2.99
        discount = 0.0
        
        if promo_code == 'WELCOME5':
            discount = 5.0
        elif promo_code == 'WEEKEND20':
            discount = subtotal * 0.20
        elif promo_code == 'MIDNIGHT':
            delivery_fee = 0.0
            
        # Add a note about the promo code to the payment method if one was used
        if promo_code and discount > 0 or promo_code == 'MIDNIGHT':
            order.payment_method = f"{payment_method} (Promo: {promo_code})"
            
        final_total = subtotal - discount + delivery_fee
        order.total_amount = max(0, final_total) # Ensure it doesn't go below 0
        
        db.session.commit()
        
        return jsonify({
            'status': 'success',
            'message': 'Order placed successfully',
            'data': order.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'status': 'error', 'message': str(e)}), 500


@order_bp.route('/me', methods=['GET'])
@jwt_required()
def get_my_orders():
    try:
        user_id = get_jwt_identity()
        orders = Order.query.filter_by(user_id=user_id).order_by(Order.created_at.desc()).all()
        
        return jsonify({
            'status': 'success',
            'data': [order.to_dict() for order in orders]
        }), 200
        
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500

@order_bp.route('/<int:order_id>/status', methods=['PUT'])
@jwt_required()
def update_order_status(order_id):
    admin_check = admin_required()
    if admin_check: return admin_check
    
    try:
        data = request.get_json()
        new_status = data.get('status')
        if not new_status:
            return jsonify({'status': 'error', 'message': 'Status is required'}), 400
            
        order = Order.query.get(order_id)
        if not order:
            return jsonify({'status': 'error', 'message': 'Order not found'}), 404
            
        order.status = new_status
        db.session.commit()
        
        return jsonify({
            'status': 'success',
            'message': 'Order status updated successfully',
            'data': order.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'status': 'error', 'message': str(e)}), 500

@order_bp.route('/<int:order_id>/cancel', methods=['PUT'])
@jwt_required()
def cancel_order(order_id):
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        cancel_reason = data.get('reason', 'No reason provided')
        
        order = Order.query.get(order_id)
        if not order:
            return jsonify({'status': 'error', 'message': 'Order not found'}), 404
            
        if str(order.user_id) != str(user_id):
            return jsonify({'status': 'error', 'message': 'Unauthorized to cancel this order'}), 403
            
        if order.status in ['Delivered', 'Cancelled']:
            return jsonify({'status': 'error', 'message': f'Cannot cancel order in {order.status} status'}), 400
            
        order.status = 'Cancelled'
        order.cancel_reason = cancel_reason
        db.session.commit()
        
        return jsonify({
            'status': 'success',
            'message': 'Order cancelled successfully',
            'data': order.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'status': 'error', 'message': str(e)}), 500

from flask import Blueprint, jsonify, request
from app.extensions import db
from app.models import Offer
from flask_jwt_extended import jwt_required, get_jwt

offer_bp = Blueprint('offer', __name__)

def admin_required():
    claims = get_jwt()
    if claims.get('role') != 'Admin':
        return jsonify({'status': 'error', 'message': 'Admin access required'}), 403

# GET /api/v1/offers
@offer_bp.route('/', methods=['GET'])
def get_offers():
    # If admin, return all. If customer, return only active.
    # To keep it simple, we just return all active ones for public, and all for admin route
    is_admin = False
    try:
        from flask_jwt_extended import verify_jwt_in_request
        verify_jwt_in_request(optional=True)
        claims = get_jwt()
        if claims and claims.get('role') == 'Admin':
            is_admin = True
    except:
        pass

    if is_admin:
        offers = Offer.query.all()
    else:
        offers = Offer.query.filter_by(is_active=True).all()
        
    return jsonify({
        'status': 'success',
        'data': [o.to_dict() for o in offers]
    }), 200

# POST /api/v1/offers
@offer_bp.route('/', methods=['POST'])
@jwt_required()
def create_offer():
    admin_check = admin_required()
    if admin_check: return admin_check
    
    try:
        data = request.get_json()
        new_offer = Offer(
            title=data.get('title'),
            description=data.get('description'),
            discount_code=data.get('discountCode'),
            discount_percentage=data.get('discountPercentage'),
            image_url=data.get('imageUrl'),
            is_active=data.get('isActive', True)
        )
        db.session.add(new_offer)
        db.session.commit()
        
        return jsonify({
            'status': 'success',
            'data': new_offer.to_dict()
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'status': 'error', 'message': str(e)}), 500

# PUT /api/v1/offers/<id>
@offer_bp.route('/<int:offer_id>', methods=['PUT'])
@jwt_required()
def update_offer(offer_id):
    admin_check = admin_required()
    if admin_check: return admin_check
    
    try:
        offer = Offer.query.get(offer_id)
        if not offer:
            return jsonify({'status': 'error', 'message': 'Offer not found'}), 404
            
        data = request.get_json()
        offer.title = data.get('title', offer.title)
        offer.description = data.get('description', offer.description)
        offer.discount_code = data.get('discountCode', offer.discount_code)
        offer.discount_percentage = data.get('discountPercentage', offer.discount_percentage)
        offer.image_url = data.get('imageUrl', offer.image_url)
        if 'isActive' in data:
            offer.is_active = data['isActive']
            
        db.session.commit()
        return jsonify({
            'status': 'success',
            'data': offer.to_dict()
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'status': 'error', 'message': str(e)}), 500

# DELETE /api/v1/offers/<id>
@offer_bp.route('/<int:offer_id>', methods=['DELETE'])
@jwt_required()
def delete_offer(offer_id):
    admin_check = admin_required()
    if admin_check: return admin_check
    
    try:
        offer = Offer.query.get(offer_id)
        if not offer:
            return jsonify({'status': 'error', 'message': 'Offer not found'}), 404
            
        db.session.delete(offer)
        db.session.commit()
        return jsonify({'status': 'success', 'message': 'Offer deleted'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'status': 'error', 'message': str(e)}), 500

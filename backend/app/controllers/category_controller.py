from flask import Blueprint, jsonify, request
from app.models import Category
from app.extensions import db
from flask_jwt_extended import jwt_required, get_jwt

category_bp = Blueprint('categories', __name__)

def admin_required():
    claims = get_jwt()
    if claims.get('role') != 'Admin':
        return jsonify({'status': 'error', 'message': 'Admin access required'}), 403

@category_bp.route('/', methods=['GET'])
def get_categories():
    try:
        fetch_all = request.args.get('all', 'false').lower() == 'true'
        if fetch_all:
            categories = Category.query.all()
        else:
            categories = Category.query.filter_by(status='active').all()
            
        categories_json = [cat.to_dict() for cat in categories]
        
        return jsonify({
            'status': 'success',
            'data': categories_json
        }), 200
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500

@category_bp.route('/', methods=['POST'])
@jwt_required()
def add_category():
    admin_check = admin_required()
    if admin_check: return admin_check
    
    try:
        data = request.get_json()
        name = data.get('name')
        
        if not name:
            return jsonify({'status': 'error', 'message': 'Category name is required'}), 400
            
        new_cat = Category(
            name=name,
            slug=name.lower().replace(' ', '-'),
            description=data.get('description', ''),
            status=data.get('status', 'active')
        )
        db.session.add(new_cat)
        db.session.commit()
        return jsonify({'status': 'success', 'data': new_cat.to_dict()}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'status': 'error', 'message': str(e)}), 500

@category_bp.route('/<int:id>', methods=['PUT'])
@jwt_required()
def edit_category(id):
    admin_check = admin_required()
    if admin_check: return admin_check
    
    try:
        cat = Category.query.get(id)
        if not cat:
            return jsonify({'status': 'error', 'message': 'Not found'}), 404
            
        data = request.get_json()
        cat.name = data.get('name', cat.name)
        cat.slug = cat.name.lower().replace(' ', '-')
        cat.description = data.get('description', cat.description)
        cat.status = data.get('status', cat.status)
        
        db.session.commit()
        return jsonify({'status': 'success', 'data': cat.to_dict()}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'status': 'error', 'message': str(e)}), 500

@category_bp.route('/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_category(id):
    admin_check = admin_required()
    if admin_check: return admin_check
    
    try:
        cat = Category.query.get(id)
        if not cat:
            return jsonify({'status': 'error', 'message': 'Not found'}), 404
        db.session.delete(cat)
        db.session.commit()
        return jsonify({'status': 'success'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'status': 'error', 'message': str(e)}), 500

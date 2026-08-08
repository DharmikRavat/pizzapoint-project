from flask import Blueprint, jsonify, request, current_app
from app.models import Product, Category
from app.extensions import db
from flask_jwt_extended import jwt_required, get_jwt
import os
from werkzeug.utils import secure_filename
import time

product_bp = Blueprint('products', __name__)

def admin_required():
    claims = get_jwt()
    if claims.get('role') != 'Admin':
        return jsonify({'status': 'error', 'message': 'Admin access required'}), 403

def save_image(image_file):
    if image_file and image_file.filename != '':
        filename = secure_filename(image_file.filename)
        # Add timestamp to make filename unique
        unique_filename = f"{int(time.time())}_{filename}"
        
        # Ensure uploads dir exists
        upload_folder = os.path.join(current_app.root_path, 'static', 'uploads')
        os.makedirs(upload_folder, exist_ok=True)
        
        file_path = os.path.join(upload_folder, unique_filename)
        image_file.save(file_path)
        
        # Return the public URL using the dynamic host
        return f"{request.host_url}static/uploads/{unique_filename}"
    return None

@product_bp.route('/', methods=['GET'])
def get_products():
    try:
        category_slug = request.args.get('category')
        query = Product.query
        
        if category_slug:
            category = Category.query.filter_by(slug=category_slug).first()
            if category:
                query = query.filter_by(category_id=category.id)
            else:
                return jsonify({'status': 'success', 'data': []}), 200
        
        products = query.all()
        products_json = [prod.to_dict() for prod in products]
        
        return jsonify({'status': 'success', 'data': products_json}), 200
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500

@product_bp.route('/', methods=['POST'])
@jwt_required()
def add_product():
    admin_check = admin_required()
    if admin_check: return admin_check
    
    try:
        data = request.form
        image_url = data.get('imageUrl')
        if 'image' in request.files and request.files['image'].filename != '':
            image_url = save_image(request.files['image'])
        
        new_prod = Product(
            category_id=int(data.get('categoryId', 1)),
            name=data.get('name'),
            slug=data.get('name', '').lower().replace(' ', '-'),
            description=data.get('description', ''),
            price=float(data.get('price', 0)),
            discount_price=float(data.get('discountPrice')) if data.get('discountPrice') else None,
            is_available=data.get('isAvailable') == 'true',
            is_veg=data.get('isVeg') == 'true',
            image=image_url
        )
        db.session.add(new_prod)
        db.session.commit()
        return jsonify({'status': 'success', 'data': new_prod.to_dict()}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'status': 'error', 'message': str(e)}), 500

@product_bp.route('/<int:id>', methods=['PUT'])
@jwt_required()
def edit_product(id):
    admin_check = admin_required()
    if admin_check: return admin_check
    
    try:
        prod = Product.query.get(id)
        if not prod:
            return jsonify({'status': 'error', 'message': 'Not found'}), 404
            
        data = request.form
        
        if data.get('imageUrl'):
            prod.image = data.get('imageUrl')
            
        if 'image' in request.files and request.files['image'].filename != '':
            new_image_url = save_image(request.files['image'])
            if new_image_url:
                prod.image = new_image_url
                
        prod.name = data.get('name', prod.name)
        prod.slug = prod.name.lower().replace(' ', '-')
        prod.description = data.get('description', prod.description)
        prod.category_id = int(data.get('categoryId', prod.category_id))
        prod.price = float(data.get('price', prod.price))
        prod.discount_price = float(data.get('discountPrice')) if data.get('discountPrice') else None
        prod.is_available = data.get('isAvailable') == 'true'
        prod.is_veg = data.get('isVeg') == 'true'
        
        db.session.commit()
        return jsonify({'status': 'success', 'data': prod.to_dict()}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'status': 'error', 'message': str(e)}), 500

@product_bp.route('/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_product(id):
    admin_check = admin_required()
    if admin_check: return admin_check
    
    try:
        prod = Product.query.get(id)
        if not prod:
            return jsonify({'status': 'error', 'message': 'Not found'}), 404
        db.session.delete(prod)
        db.session.commit()
        return jsonify({'status': 'success'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'status': 'error', 'message': str(e)}), 500

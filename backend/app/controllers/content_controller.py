from flask import Blueprint, jsonify, request
from app.extensions import db
from app.models import AboutContent
from flask_jwt_extended import jwt_required, get_jwt

content_bp = Blueprint('content', __name__)

def admin_required():
    claims = get_jwt()
    if claims.get('role') != 'Admin':
        return jsonify({'status': 'error', 'message': 'Admin access required'}), 403

# GET /api/v1/content
@content_bp.route('/', methods=['GET'])
def get_all_content():
    try:
        contents = AboutContent.query.all()
        return jsonify({
            'status': 'success',
            'data': [c.to_dict() for c in contents]
        }), 200
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500

# POST /api/v1/content
@content_bp.route('/', methods=['POST'])
@jwt_required()
def create_content():
    admin_check = admin_required()
    if admin_check: return admin_check
    
    try:
        data = request.get_json()
        new_content = AboutContent(
            section=data.get('section'),
            title=data.get('title'),
            content=data.get('content'),
            image_url=data.get('imageUrl'),
            icon=data.get('icon')
        )
        db.session.add(new_content)
        db.session.commit()
        return jsonify({'status': 'success', 'data': new_content.to_dict()}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'status': 'error', 'message': str(e)}), 500

# PUT /api/v1/content/<id>
@content_bp.route('/<int:content_id>', methods=['PUT'])
@jwt_required()
def update_content(content_id):
    admin_check = admin_required()
    if admin_check: return admin_check
    
    try:
        item = AboutContent.query.get(content_id)
        if not item:
            return jsonify({'status': 'error', 'message': 'Content not found'}), 404
            
        data = request.get_json()
        item.section = data.get('section', item.section)
        item.title = data.get('title', item.title)
        item.content = data.get('content', item.content)
        item.image_url = data.get('imageUrl', item.image_url)
        item.icon = data.get('icon', item.icon)
            
        db.session.commit()
        return jsonify({'status': 'success', 'data': item.to_dict()}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'status': 'error', 'message': str(e)}), 500

# DELETE /api/v1/content/<id>
@content_bp.route('/<int:content_id>', methods=['DELETE'])
@jwt_required()
def delete_content(content_id):
    admin_check = admin_required()
    if admin_check: return admin_check
    
    try:
        item = AboutContent.query.get(content_id)
        if not item:
            return jsonify({'status': 'error', 'message': 'Content not found'}), 404
            
        db.session.delete(item)
        db.session.commit()
        return jsonify({'status': 'success', 'message': 'Content deleted'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'status': 'error', 'message': str(e)}), 500

from flask import Blueprint, jsonify, request
from app.extensions import db
from app.models import ContactMessage
from flask_jwt_extended import jwt_required, get_jwt

contact_bp = Blueprint('contact', __name__)

def admin_required():
    claims = get_jwt()
    if claims.get('role') != 'Admin':
        return jsonify({'status': 'error', 'message': 'Admin access required'}), 403

# POST /api/v1/contact
# Public route for customers to submit a message
@contact_bp.route('/', methods=['POST'])
def submit_contact():
    try:
        data = request.get_json()
        name = data.get('name')
        email = data.get('email')
        subject = data.get('subject', 'General Inquiry')
        message = data.get('message')

        if not name or not email or not message:
            return jsonify({'status': 'error', 'message': 'Name, email, and message are required'}), 400

        contact = ContactMessage(
            name=name,
            email=email,
            subject=subject,
            message=message
        )
        db.session.add(contact)
        db.session.commit()

        return jsonify({
            'status': 'success',
            'message': 'Message sent successfully. We will get back to you soon!',
            'data': contact.to_dict()
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({'status': 'error', 'message': str(e)}), 500

# GET /api/v1/contact
# Admin route to get all messages
@contact_bp.route('/', methods=['GET'])
@jwt_required()
def get_all_contacts():
    admin_check = admin_required()
    if admin_check: return admin_check
    
    try:
        contacts = ContactMessage.query.order_by(ContactMessage.created_at.desc()).all()
        return jsonify({
            'status': 'success',
            'data': [c.to_dict() for c in contacts]
        }), 200
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500

# PUT /api/v1/contact/<id>/status
# Admin route to update message status
@contact_bp.route('/<int:contact_id>/status', methods=['PUT'])
@jwt_required()
def update_contact_status(contact_id):
    admin_check = admin_required()
    if admin_check: return admin_check
    
    try:
        data = request.get_json()
        new_status = data.get('status')
        
        contact = ContactMessage.query.get(contact_id)
        if not contact:
            return jsonify({'status': 'error', 'message': 'Contact message not found'}), 404
            
        contact.status = new_status
        db.session.commit()
        
        return jsonify({
            'status': 'success',
            'message': 'Status updated successfully',
            'data': contact.to_dict()
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'status': 'error', 'message': str(e)}), 500

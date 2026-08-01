from flask import Blueprint, jsonify, request
from app.extensions import db, bcrypt
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from datetime import datetime, timezone
from app.models import User

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        full_name = data.get('fullName')
        email = data.get('email')
        password = data.get('password')
        phone = data.get('phone', '')

        if not full_name or not email or not password:
            return jsonify({'status': 'error', 'message': 'Missing required fields'}), 400

        # Check if user exists
        if User.query.filter_by(email=email).first():
            return jsonify({'status': 'error', 'message': 'Email already registered'}), 409

        # Hash password
        hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')

        new_user = User(
            full_name=full_name,
            email=email,
            phone=phone,
            password=hashed_password,
            role="Customer",
            is_verified=False
        )

        db.session.add(new_user)
        db.session.commit()
        return jsonify({'status': 'success', 'message': 'User registered successfully'}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'status': 'error', 'message': str(e)}), 500


@auth_bp.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')

        if not email or not password:
            return jsonify({'status': 'error', 'message': 'Missing required fields'}), 400

        user = User.query.filter_by(email=email).first()
        if not user or not bcrypt.check_password_hash(user.password, password):
            return jsonify({'status': 'error', 'message': 'Invalid email or password'}), 401

        access_token = create_access_token(identity=str(user.id), additional_claims={'role': user.role})

        return jsonify({
            'status': 'success',
            'token': access_token,
            'user': {
                'id': str(user.id),
                'fullName': user.full_name,
                'email': user.email,
                'phone': user.phone,
                'role': user.role,
                'address': user.address
            }
        }), 200
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500

@auth_bp.route('/profile', methods=['PUT'])
@jwt_required()
def update_profile():
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        if not user:
            return jsonify({'status': 'error', 'message': 'User not found'}), 404
            
        data = request.get_json()
        
        new_name = data.get('fullName')
        new_phone = data.get('phone')
        new_address = data.get('address')
        
        if new_name is not None:
            user.full_name = new_name
        if new_phone is not None:
            user.phone = new_phone
        if new_address is not None:
            user.address = new_address
            
        db.session.commit()
            
        return jsonify({
            'status': 'success', 
            'message': 'Profile updated',
            'user': {
                'id': str(user.id),
                'fullName': user.full_name,
                'email': user.email,
                'phone': user.phone,
                'role': user.role,
                'address': user.address
            }
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'status': 'error', 'message': str(e)}), 500

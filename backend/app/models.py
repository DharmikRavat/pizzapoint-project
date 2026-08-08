from app.extensions import db
from datetime import datetime

from typing import Any

class User(db.Model):
    def __init__(self, **kwargs: Any) -> None:
        super().__init__(**kwargs)
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    full_name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    phone = db.Column(db.String(20), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)
    role = db.Column(db.String(20), default='customer') # 'customer' or 'admin'
    is_verified = db.Column(db.Boolean, default=False)
    address = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            '_id': str(self.id), # for frontend compatibility
            'fullName': self.full_name,
            'email': self.email,
            'phone': self.phone,
            'role': self.role,
            'isVerified': self.is_verified,
            'address': self.address,
            'createdAt': self.created_at.isoformat()
        }

class Category(db.Model):
    def __init__(self, **kwargs: Any) -> None:
        super().__init__(**kwargs)
    __tablename__ = 'categories'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    slug = db.Column(db.String(100), unique=True, nullable=False)
    description = db.Column(db.String(255))
    status = db.Column(db.String(20), default='active') # 'active' or 'inactive'
    
    # Relationship
    products = db.relationship('Product', backref='category', lazy=True)

    def to_dict(self):
        return {
            '_id': str(self.id), # keeping _id format for frontend compatibility
            'name': self.name,
            'slug': self.slug,
            'description': self.description,
            'status': self.status
        }

class Product(db.Model):
    def __init__(self, **kwargs: Any) -> None:
        super().__init__(**kwargs)
    __tablename__ = 'products'
    id = db.Column(db.Integer, primary_key=True)
    category_id = db.Column(db.Integer, db.ForeignKey('categories.id'), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    slug = db.Column(db.String(100), unique=True, nullable=False)
    description = db.Column(db.Text)
    price = db.Column(db.Float, nullable=False)
    discount_price = db.Column(db.Float)
    image = db.Column(db.String(255))
    is_veg = db.Column(db.Boolean, default=True)
    is_available = db.Column(db.Boolean, default=True)

    def to_dict(self):
        return {
            '_id': str(self.id),
            'categoryId': str(self.category_id),
            'name': self.name,
            'slug': self.slug,
            'description': self.description,
            'price': self.price,
            'discountPrice': self.discount_price,
            'image': self.image,
            'isVeg': self.is_veg,
            'isAvailable': self.is_available
        }

class Settings(db.Model):
    def __init__(self, **kwargs: Any) -> None:
        super().__init__(**kwargs)
    __tablename__ = 'settings'
    id = db.Column(db.Integer, primary_key=True)
    restaurant_name = db.Column(db.String(100), nullable=False)
    contact_email = db.Column(db.String(100))
    contact_phone = db.Column(db.String(20))
    address = db.Column(db.Text)
    currency = db.Column(db.String(10), default='INR')
    currency_symbol = db.Column(db.String(5), default='₹')
    delivery_charge = db.Column(db.Float, default=0.0)
    tax_percentage = db.Column(db.Float, default=0.0)
    
    def to_dict(self):
        return {
            '_id': str(self.id),
            'restaurantName': self.restaurant_name,
            'contactEmail': self.contact_email,
            'contactPhone': self.contact_phone,
            'address': self.address,
            'currency': self.currency,
            'currencySymbol': self.currency_symbol,
            'deliveryCharge': self.delivery_charge,
            'taxPercentage': self.tax_percentage
        }

class Order(db.Model):
    def __init__(self, **kwargs: Any) -> None:
        super().__init__(**kwargs)
    __tablename__ = 'orders'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    total_amount = db.Column(db.Float, nullable=False)
    status = db.Column(db.String(50), default='Pending') # Pending, Processing, Delivered, Cancelled
    delivery_address = db.Column(db.Text, nullable=False)
    payment_method = db.Column(db.String(50), default='COD')
    cancel_reason = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    user = db.relationship('User', backref=db.backref('orders', lazy=True))
    items = db.relationship('OrderItem', backref='order', lazy=True, cascade="all, delete-orphan")

    def to_dict(self):
        return {
            '_id': str(self.id),
            'userId': str(self.user_id),
            'totalAmount': self.total_amount,
            'status': self.status,
            'deliveryAddress': self.delivery_address,
            'paymentMethod': self.payment_method,
            'cancelReason': self.cancel_reason,
            'createdAt': self.created_at.isoformat(),
            'items': [item.to_dict() for item in self.items]
        }

class OrderItem(db.Model):
    def __init__(self, **kwargs: Any) -> None:
        super().__init__(**kwargs)
    __tablename__ = 'order_items'
    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.Integer, db.ForeignKey('orders.id'), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey('products.id'), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    price_at_time = db.Column(db.Float, nullable=False)
    
    product = db.relationship('Product')

    def to_dict(self):
        return {
            'id': self.id,
            'productId': str(self.product_id),
            'productName': self.product.name if self.product else "Unknown",
            'quantity': self.quantity,
            'price': self.price_at_time
        }

class ContactMessage(db.Model):
    def __init__(self, **kwargs: Any) -> None:
        super().__init__(**kwargs)
    __tablename__ = 'contact_messages'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), nullable=False)
    subject = db.Column(db.String(200))
    message = db.Column(db.Text, nullable=False)
    status = db.Column(db.String(20), default='Unread') # Unread, Read, Resolved
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            '_id': str(self.id),
            'name': self.name,
            'email': self.email,
            'subject': self.subject,
            'message': self.message,
            'status': self.status,
            'createdAt': self.created_at.isoformat()
        }

class Offer(db.Model):
    def __init__(self, **kwargs: Any) -> None:
        super().__init__(**kwargs)
    __tablename__ = 'offers'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.String(255))
    discount_code = db.Column(db.String(50))
    discount_percentage = db.Column(db.Integer)
    image_url = db.Column(db.String(255))
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            '_id': str(self.id),
            'title': self.title,
            'description': self.description,
            'discountCode': self.discount_code,
            'discountPercentage': self.discount_percentage,
            'imageUrl': self.image_url,
            'isActive': self.is_active,
            'createdAt': self.created_at.isoformat()
        }

class AboutContent(db.Model):
    def __init__(self, **kwargs: Any) -> None:
        super().__init__(**kwargs)
    __tablename__ = 'about_content'
    id = db.Column(db.Integer, primary_key=True)
    section = db.Column(db.String(50), nullable=False, unique=True) # e.g. 'main', 'mission', 'features'
    title = db.Column(db.String(150), nullable=False)
    content = db.Column(db.Text, nullable=False)
    image_url = db.Column(db.String(255))
    icon = db.Column(db.String(50)) # For feature grid
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        return {
            '_id': str(self.id),
            'section': self.section,
            'title': self.title,
            'content': self.content,
            'imageUrl': self.image_url,
            'icon': self.icon,
            'updatedAt': self.updated_at.isoformat()
        }

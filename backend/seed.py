import os
from datetime import datetime, timezone
from app import create_app
from app.extensions import db, bcrypt
from app.models import User, Category, Product, Settings, Order, OrderItem
app = create_app()

def seed_database():
    with app.app_context():
        print("Dropping existing tables and creating new ones...")
        db.drop_all()
        db.create_all()

        print("Seeding Settings...")
        settings = Settings(
            restaurant_name="Mahadev Pizza Point",
            contact_email="hello@mahadevpizza.com",
            contact_phone="+1 234 567 8900",
            address="123 Pizza Street, Food City",
            currency="INR",
            delivery_charge=49,
            tax_percentage=5.0
        )
        db.session.add(settings)

        print("Seeding Users...")
        hashed_admin_pwd = bcrypt.generate_password_hash('admin123').decode('utf-8')
        admin = User(
            full_name="Admin User",
            email="admin@gmail.com",
            password=hashed_admin_pwd,
            role="Admin",
            phone="9876543210",
            is_verified=True
        )
        db.session.add(admin)

        hashed_cust_pwd = bcrypt.generate_password_hash('customer123').decode('utf-8')
        customer = User(
            full_name="Test Customer",
            email="customer@gmail.com",
            password=hashed_cust_pwd,
            role="Customer",
            phone="9876543211",
            is_verified=True
        )
        db.session.add(customer)

        print("Seeding Categories & Products...")
        veg_pizza = Category(
            name="Veg Pizza",
            slug="veg-pizza",
            description="Delicious 100% vegetarian pizzas",
            status="active"
        )
        db.session.add(veg_pizza)
        db.session.commit() # Commit to get veg_pizza.id

        prod1 = Product(
            category_id=veg_pizza.id,
            name="Margherita Extra",
            slug="margherita-extra",
            description="Classic delight with 100% real mozzarella cheese.",
            price=1078,
            discount_price=912,
            is_veg=True,
            is_available=True,
            image="https://images.unsplash.com/photo-1574071318508-1cdbab80d002?q=80&w=500&auto=format&fit=crop"
        )
        
        prod2 = Product(
            category_id=veg_pizza.id,
            name="Veggie Supreme",
            slug="veggie-supreme",
            description="Black olives, capsicum, onion, grilled mushroom, corn.",
            price=1244,
            discount_price=1078,
            is_veg=True,
            is_available=True,
            image="https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=500&auto=format&fit=crop"
        )
        
        db.session.add(prod1)
        db.session.add(prod2)

        db.session.commit()
        print("Database seeded successfully with SQLite!")

if __name__ == '__main__':
    seed_database()

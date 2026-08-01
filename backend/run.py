from app import create_app
import os

app = create_app()

from app.extensions import db, bcrypt
from app.models import User

with app.app_context():
    db.create_all()
    admin = User.query.filter_by(email="admin@gmail.com").first()
    if not admin:
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
        db.session.commit()
    elif admin.role != "Admin":
        admin.role = "Admin"
        db.session.commit()

    from app.models import Category, Product, Settings
    if not Category.query.first():
        print("Seeding Categories & Products & Settings...")
        settings = Settings(
            restaurant_name="Mahadev Pizza Point",
            contact_email="hello@mahadevpizza.com",
            contact_phone="+1 234 567 8900",
            address="123 Pizza Street, Food City",
            currency="USD",
            delivery_charge=2.99,
            tax_percentage=5.0
        )
        db.session.add(settings)

        veg_pizza = Category(
            name="Veg Pizza",
            slug="veg-pizza",
            description="Delicious 100% vegetarian pizzas",
            status="active"
        )
        db.session.add(veg_pizza)
        db.session.commit()

        prod1 = Product(
            category_id=veg_pizza.id,
            name="Margherita Extra",
            slug="margherita-extra",
            description="Classic delight with 100% real mozzarella cheese.",
            price=12.99,
            discount_price=10.99,
            is_veg=True,
            is_available=True,
            image="https://images.unsplash.com/photo-1574071318508-1cdbab80d002?q=80&w=500&auto=format&fit=crop"
        )
        prod2 = Product(
            category_id=veg_pizza.id,
            name="Veggie Supreme",
            slug="veggie-supreme",
            description="Black olives, capsicum, onion, grilled mushroom, corn.",
            price=14.99,
            discount_price=12.99,
            is_veg=True,
            is_available=True,
            image="https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=500&auto=format&fit=crop"
        )
        db.session.add(prod1)
        db.session.add(prod2)
        db.session.commit()

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=app.config.get('DEBUG', False))

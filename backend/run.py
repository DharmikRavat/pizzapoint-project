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
        
    from app.models import AboutContent, Offer
    if not AboutContent.query.first():
        print("Seeding About Content...")
        about_hero = AboutContent(
            section='hero',
            title='The Story Behind Pizzapoint',
            content="It all started with a simple idea: bringing the authentic taste of Italian pizza right to your neighborhood. At Pizzapoint, we believe that pizza is more than just food; it's an experience that brings people together.\n\nFrom hand-tossed dough made fresh every morning to our signature rich tomato sauce and premium cheese blends, every ingredient is carefully selected to deliver perfection.",
            image_url="https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
        )
        about_feature1 = AboutContent(
            section='feature1',
            title='Made with Love',
            content='Every pizza is crafted with passion using authentic recipes passed down through generations.',
            icon='FiHeart'
        )
        about_feature2 = AboutContent(
            section='feature2',
            title='Fast Delivery',
            content="We understand cravings. That's why we ensure your pizza reaches you piping hot in under 30 minutes.",
            icon='FiClock'
        )
        about_feature3 = AboutContent(
            section='feature3',
            title='Quality Guaranteed',
            content='We use only the freshest, locally sourced ingredients to guarantee the highest quality in every bite.',
            icon='FiShield'
        )
        db.session.add_all([about_hero, about_feature1, about_feature2, about_feature3])

    if not Offer.query.first():
        print("Seeding Offers...")
        offer1 = Offer(
            title='Buy 1 Get 1 Free',
            description='Order any Large Pizza and get a Medium Pizza absolutely free! Valid all week.',
            discount_code='BOGO50'
        )
        offer2 = Offer(
            title='Weekend Fiesta: 20% OFF',
            description='Enjoy a flat 20% discount on all orders above $50. Only on Saturdays and Sundays.',
            discount_code='WEEKEND20'
        )
        offer3 = Offer(
            title='Free Midnight Delivery',
            description='Craving a midnight snack? Get free delivery between 11 PM and 3 AM every day.',
            discount_code='MIDNIGHT'
        )
        offer4 = Offer(
            title='First Order Discount',
            description='New to Pizzapoint? Get $5 off on your very first order when you sign up.',
            discount_code='WELCOME5'
        )
        db.session.add_all([offer1, offer2, offer3, offer4])

    db.session.commit()

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=app.config.get('DEBUG', False))

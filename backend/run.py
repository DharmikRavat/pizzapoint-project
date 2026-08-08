# pyright: reportCallIssue=false, reportGeneralTypeIssues=false
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
        admin = User()
        admin.full_name = "Admin User"
        admin.email = "admin@gmail.com"
        admin.password = hashed_admin_pwd
        admin.role = "Admin"
        admin.phone = "9876543210"
        admin.is_verified = True
        db.session.add(admin)
        db.session.commit()
    elif admin.role != "Admin":
        admin.role = "Admin"
        db.session.commit()

    from app.models import Category, Product, Settings
    if not Category.query.first():
        print("Seeding Categories & Products & Settings...")
        settings = Settings()
        settings.restaurant_name = "Mahadev Pizza Point"
        settings.contact_email = "hello@mahadevpizza.com"
        settings.contact_phone = "+1 234 567 8900"
        settings.address = "123 Pizza Street, Food City"
        settings.currency = "INR"
        settings.delivery_charge = 49
        settings.tax_percentage = 5.0
        db.session.add(settings)

        veg_pizza = Category()
        veg_pizza.name = "Veg Pizza"
        veg_pizza.slug = "veg-pizza"
        veg_pizza.description = "Delicious 100% vegetarian pizzas"
        veg_pizza.status = "active"
        db.session.add(veg_pizza)
        db.session.commit()

        prod1 = Product()
        prod1.category_id = veg_pizza.id
        prod1.name = "Margherita Extra"
        prod1.slug = "margherita-extra"
        prod1.description = "Classic delight with 100% real mozzarella cheese."
        prod1.price = 1078
        prod1.discount_price = 912
        prod1.is_veg = True
        prod1.is_available = True
        prod1.image = "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?q=80&w=500&auto=format&fit=crop"
        prod2 = Product()
        prod2.category_id = veg_pizza.id
        prod2.name = "Veggie Supreme"
        prod2.slug = "veggie-supreme"
        prod2.description = "Black olives, capsicum, onion, grilled mushroom, corn."
        prod2.price = 1244
        prod2.discount_price = 1078
        prod2.is_veg = True
        prod2.is_available = True
        prod2.image = "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=500&auto=format&fit=crop"
        db.session.add(prod1)
        db.session.add(prod2)
        
    from app.models import AboutContent, Offer
    if not AboutContent.query.first():
        print("Seeding About Content...")
        about_hero = AboutContent()
        about_hero.section = 'hero'
        about_hero.title = 'The Story Behind Pizzapoint'
        about_hero.content = "It all started with a simple idea: bringing the authentic taste of Italian pizza right to your neighborhood. At Pizzapoint, we believe that pizza is more than just food; it's an experience that brings people together.\n\nFrom hand-tossed dough made fresh every morning to our signature rich tomato sauce and premium cheese blends, every ingredient is carefully selected to deliver perfection."
        about_hero.image_url = "https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
        about_feature1 = AboutContent()
        about_feature1.section = 'feature1'
        about_feature1.title = 'Made with Love'
        about_feature1.content = 'Every pizza is crafted with passion using authentic recipes passed down through generations.'
        about_feature1.icon = 'FiHeart'
        about_feature2 = AboutContent()
        about_feature2.section = 'feature2'
        about_feature2.title = 'Fast Delivery'
        about_feature2.content = "We understand cravings. That's why we ensure your pizza reaches you piping hot in under 30 minutes."
        about_feature2.icon = 'FiClock'
        about_feature3 = AboutContent()
        about_feature3.section = 'feature3'
        about_feature3.title = 'Quality Guaranteed'
        about_feature3.content = 'We use only the freshest, locally sourced ingredients to guarantee the highest quality in every bite.'
        about_feature3.icon = 'FiShield'
        db.session.add_all([about_hero, about_feature1, about_feature2, about_feature3])

    if not Offer.query.first():
        print("Seeding Offers...")
        offer1 = Offer()
        offer1.title = 'Buy 1 Get 1 Free'
        offer1.description = 'Order any Large Pizza and get a Medium Pizza absolutely free! Valid all week.'
        offer1.discount_code = 'BOGO50'
        offer2 = Offer()
        offer2.title = 'Weekend Fiesta: 20% OFF'
        offer2.description = 'Enjoy a flat 20% discount on all orders above $50. Only on Saturdays and Sundays.'
        offer2.discount_code = 'WEEKEND20'
        offer3 = Offer()
        offer3.title = 'Free Midnight Delivery'
        offer3.description = 'Craving a midnight snack? Get free delivery between 11 PM and 3 AM every day.'
        offer3.discount_code = 'MIDNIGHT'
        offer4 = Offer()
        offer4.title = 'First Order Discount'
        offer4.description = 'New to Pizzapoint? Get $5 off on your very first order when you sign up.'
        offer4.discount_code = 'WELCOME5'
        db.session.add_all([offer1, offer2, offer3, offer4])

    db.session.commit()

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    try:
        app.run(host='0.0.0.0', port=port, debug=app.config.get('DEBUG', False))
    except OSError as e:
        print(f"\n[ERROR] Failed to start server on port {port}.")
        print(f"Details: {e}")
        print("Tip: If the port is already in use, try stopping the existing process or changing the PORT environment variable.\n")

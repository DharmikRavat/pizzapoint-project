import os
from app import create_app
from app.extensions import db
from app.models import Offer, AboutContent

app = create_app()

def seed_exact_data():
    with app.app_context():
        print("Clearing old offers and about content...")
        Offer.query.delete()
        AboutContent.query.delete()
        
        print("Seeding Exact Offers...")
        offer1 = Offer(
            title="Buy 1 Get 1 Free",
            description="Order any Large Pizza and get a Medium Pizza absolutely free! Valid all week.",
            discount_code="BOGO50",
            discount_percentage=0,
            is_active=True
        )
        offer2 = Offer(
            title="Weekend Fiesta: 20% OFF",
            description="Enjoy a flat 20% discount on all orders above $50. Only on Saturdays and Sundays.",
            discount_code="WEEKEND20",
            discount_percentage=20,
            is_active=True
        )
        offer3 = Offer(
            title="Free Midnight Delivery",
            description="Craving a midnight snack? Get free delivery between 11 PM and 3 AM every day.",
            discount_code="MIDNIGHT",
            discount_percentage=0,
            is_active=True
        )
        offer4 = Offer(
            title="First Order Discount",
            description="New to Pizzapoint? Get $5 off on your very first order when you sign up.",
            discount_code="WELCOME5",
            discount_percentage=0,
            is_active=True
        )
        db.session.add_all([offer1, offer2, offer3, offer4])

        print("Seeding Exact About Content...")
        about_hero = AboutContent(
            section="hero",
            title="The Story Behind Pizzapoint",
            content="It all started with a simple idea: bringing the authentic taste of Italian pizza right to your neighborhood. At Pizzapoint, we believe that pizza is more than just food; it's an experience that brings people together.\n\nFrom hand-tossed dough made fresh every morning to our signature rich tomato sauce and premium cheese blends, every ingredient is carefully selected to deliver perfection.",
            image_url="https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
        )
        about_val1 = AboutContent(
            section="value1",
            title="Made with Love",
            content="Every pizza is crafted with passion using authentic recipes passed down through generations.",
            icon="FiHeart"
        )
        about_val2 = AboutContent(
            section="value2",
            title="Fast Delivery",
            content="We understand cravings. That's why we ensure your pizza reaches you piping hot in under 30 minutes.",
            icon="FiClock"
        )
        about_val3 = AboutContent(
            section="value3",
            title="Quality Guaranteed",
            content="We use only the freshest, locally sourced ingredients to guarantee the highest quality in every bite.",
            icon="FiShield"
        )
        db.session.add_all([about_hero, about_val1, val2:=about_val2, val3:=about_val3])
        
        db.session.commit()
        print("Database seeded with exact screenshot data!")

if __name__ == '__main__':
    seed_exact_data()

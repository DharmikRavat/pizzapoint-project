import os
from app import create_app
from app.extensions import db
from app.models import Offer, AboutContent

app = create_app()

def seed_offers_about():
    with app.app_context():
        print("Seeding Offers...")
        if Offer.query.count() == 0:
            offer1 = Offer(
                title="Weekend Bonanza",
                description="Get 20% off on all Veg Pizzas this weekend!",
                discount_code="WEEKEND20",
                discount_percentage=20,
                image_url="https://images.unsplash.com/photo-1576458088443-04a19bb13da6?q=80&w=500&auto=format&fit=crop",
                is_active=True
            )
            offer2 = Offer(
                title="First Order Promo",
                description="Use code WELCOME10 to get 10% off on your first order.",
                discount_code="WELCOME10",
                discount_percentage=10,
                image_url="https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?q=80&w=500&auto=format&fit=crop",
                is_active=True
            )
            db.session.add(offer1)
            db.session.add(offer2)

        print("Seeding About Content...")
        if AboutContent.query.count() == 0:
            about_main = AboutContent(
                section="main",
                title="Our Story",
                content="Mahadev Pizza Point was founded with a simple goal: to serve the most delicious and authentic pizzas. We use only the freshest ingredients and traditional recipes to bring you a taste you'll never forget.",
                image_url="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=500&auto=format&fit=crop"
            )
            about_mission = AboutContent(
                section="mission",
                title="Our Mission",
                content="To deliver joy in every slice by providing high-quality, mouth-watering pizzas with excellent customer service.",
                icon="target"
            )
            about_feature = AboutContent(
                section="features",
                title="Why Choose Us",
                content="100% Fresh Dough, Locally Sourced Ingredients, Fast Delivery.",
                icon="star"
            )
            db.session.add(about_main)
            db.session.add(about_mission)
            db.session.add(about_feature)
        
        db.session.commit()
        print("Offers and About content seeded successfully!")

if __name__ == '__main__':
    seed_offers_about()

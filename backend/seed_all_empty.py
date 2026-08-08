import os
from app import create_app
from app.extensions import db
from app.models import Category, Product

app = create_app()

def seed_empty():
    with app.app_context():
        # Move burgers from 'burger' to 'Burgers'
        burger_old = Category.query.filter_by(name='burger').first()
        burger_new = Category.query.filter_by(name='Burgers').first()
        if burger_old and burger_new:
            products = Product.query.filter_by(category_id=burger_old.id).all()
            for p in products:
                p.category_id = burger_new.id
            db.session.commit()
            db.session.delete(burger_old)
            db.session.commit()
            
        non_veg = Category.query.filter_by(name='Non-Veg').first()
        cheese_burst = Category.query.filter_by(name='Cheese Burst').first()
        combos = Category.query.filter_by(name='Combos').first()
        garlic_bread = Category.query.filter_by(name='Garlic Bread').first()
        pasta = Category.query.filter_by(name='Pasta').first()
        drinks = Category.query.filter_by(name='Drinks').first()
        
        products_data = [
            # Non-Veg
            {
                "category_id": non_veg.id,
                "name": "Chicken Tikka Pizza",
                "slug": "chicken-tikka-pizza",
                "description": "Chicken tikka chunks with onion and capsicum.",
                "price": 450,
                "discount_price": 399,
                "is_veg": False,
                "is_available": True,
                "image": "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=500&auto=format&fit=crop"
            },
            {
                "category_id": non_veg.id,
                "name": "Chicken Pepperoni",
                "slug": "chicken-pepperoni",
                "description": "Loaded with chicken pepperoni and cheese.",
                "price": 550,
                "discount_price": 499,
                "is_veg": False,
                "is_available": True,
                "image": "https://images.unsplash.com/photo-1590947132387-155cc02f3212?q=80&w=500&auto=format&fit=crop"
            },
            # Cheese Burst
            {
                "category_id": cheese_burst.id,
                "name": "Margherita Cheese Burst",
                "slug": "margherita-cheese-burst",
                "description": "Classic Margherita with a liquid cheese filled crust.",
                "price": 399,
                "discount_price": 349,
                "is_veg": True,
                "is_available": True,
                "image": "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?q=80&w=500&auto=format&fit=crop"
            },
            # Combos
            {
                "category_id": combos.id,
                "name": "Meal for 2",
                "slug": "meal-for-2",
                "description": "2 Medium Pizzas + 1 Garlic Bread + 2 Pepsi",
                "price": 899,
                "discount_price": 799,
                "is_veg": True,
                "is_available": True,
                "image": "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?q=80&w=500&auto=format&fit=crop"
            },
            # Garlic Bread
            {
                "category_id": garlic_bread.id,
                "name": "Stuffed Garlic Bread",
                "slug": "stuffed-garlic-bread",
                "description": "Freshly baked garlic bread stuffed with cheese and corn.",
                "price": 199,
                "discount_price": 149,
                "is_veg": True,
                "is_available": True,
                "image": "https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?q=80&w=500&auto=format&fit=crop"
            },
            # Pasta
            {
                "category_id": pasta.id,
                "name": "Arrabiata Pasta",
                "slug": "arrabiata-pasta",
                "description": "Penne pasta in spicy tomato herb sauce.",
                "price": 249,
                "discount_price": 199,
                "is_veg": True,
                "is_available": True,
                "image": "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?q=80&w=500&auto=format&fit=crop"
            },
            # Drinks
            {
                "category_id": drinks.id,
                "name": "Pepsi 500ml",
                "slug": "pepsi-500ml",
                "description": "Refreshing chilled Pepsi.",
                "price": 60,
                "discount_price": 50,
                "is_veg": True,
                "is_available": True,
                "image": "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?q=80&w=500&auto=format&fit=crop"
            }
        ]

        count = 0
        for data in products_data:
            existing = Product.query.filter_by(slug=data["slug"]).first()
            if not existing:
                p = Product()
                p.category_id = data["category_id"]
                p.name = data["name"]
                p.slug = data["slug"]
                p.description = data["description"]
                p.price = data["price"]
                p.discount_price = data["discount_price"]
                p.is_veg = data["is_veg"]
                p.is_available = data["is_available"]
                p.image = data["image"]
                db.session.add(p)
                count += 1
                
        db.session.commit()
        print(f"Successfully added {count} products!")

if __name__ == '__main__':
    seed_empty()

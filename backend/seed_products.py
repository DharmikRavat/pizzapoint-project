import os
from app import create_app
from app.extensions import db
from app.models import Category, Product
import random

app = create_app()

def seed_products():
    with app.app_context():
        # Ensure categories exist
        veg_pizza_cat = Category.query.filter_by(name="Veg Pizza").first()
        if not veg_pizza_cat:
            veg_pizza_cat = Category()
            veg_pizza_cat.name = "Veg Pizza"
            veg_pizza_cat.slug = "veg-pizza"
            veg_pizza_cat.description = "Delicious 100% vegetarian pizzas"
            veg_pizza_cat.status = "active"
            db.session.add(veg_pizza_cat)
        
        burger_cat = Category.query.filter_by(name="burger").first()
        if not burger_cat:
            burger_cat = Category()
            burger_cat.name = "burger"
            burger_cat.slug = "burger"
            burger_cat.description = "Juicy and delicious veg burgers"
            burger_cat.status = "active"
            db.session.add(burger_cat)
            
        test_cat = Category.query.filter_by(name="Test Category").first()
        if not test_cat:
            test_cat = Category()
            test_cat.name = "Test Category"
            test_cat.slug = "test-category"
            test_cat.description = "Test Category for testing"
            test_cat.status = "active"
            db.session.add(test_cat)

        db.session.commit()

        print("Categories ensured. Adding 15 products...")

        products_data = [
            # Veg Pizzas
            {
                "category_id": veg_pizza_cat.id,
                "name": "Paneer Tikka Pizza",
                "slug": "paneer-tikka-pizza",
                "description": "Spicy paneer tikka chunks with onion and capsicum.",
                "price": 350,
                "discount_price": 299,
                "is_veg": True,
                "is_available": True,
                "image": "https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?q=80&w=500&auto=format&fit=crop"
            },
            {
                "category_id": veg_pizza_cat.id,
                "name": "Farmhouse Pizza",
                "slug": "farmhouse-pizza",
                "description": "Loaded with fresh vegetables - onion, tomato, capsicum, mushroom.",
                "price": 450,
                "discount_price": 399,
                "is_veg": True,
                "is_available": True,
                "image": "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?q=80&w=500&auto=format&fit=crop"
            },
            {
                "category_id": veg_pizza_cat.id,
                "name": "Peppy Paneer",
                "slug": "peppy-paneer",
                "description": "Flavorful trio of juicy paneer, crisp capsicum with spicy red paprika.",
                "price": 399,
                "discount_price": 349,
                "is_veg": True,
                "is_available": True,
                "image": "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=500&auto=format&fit=crop"
            },
            {
                "category_id": veg_pizza_cat.id,
                "name": "Mexican Green Wave",
                "slug": "mexican-green-wave",
                "description": "A pizza loaded with crunchy onions, crisp capsicum, juicy tomatoes and jalapeno.",
                "price": 420,
                "discount_price": 379,
                "is_veg": True,
                "is_available": True,
                "image": "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=500&auto=format&fit=crop"
            },
            {
                "category_id": veg_pizza_cat.id,
                "name": "Cheese n Corn",
                "slug": "cheese-n-corn",
                "description": "Sweet and juicy golden corn with rich mozzarella cheese.",
                "price": 300,
                "discount_price": 249,
                "is_veg": True,
                "is_available": True,
                "image": "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?q=80&w=500&auto=format&fit=crop"
            },
            
            # Burgers
            {
                "category_id": burger_cat.id,
                "name": "Classic Veg Burger",
                "slug": "classic-veg-burger",
                "description": "Crispy vegetable patty with fresh lettuce, tomato, and mayo.",
                "price": 120,
                "discount_price": 99,
                "is_veg": True,
                "is_available": True,
                "image": "https://images.unsplash.com/photo-1585238342024-78d387f4a707?q=80&w=500&auto=format&fit=crop"
            },
            {
                "category_id": burger_cat.id,
                "name": "Aloo Tikki Burger",
                "slug": "aloo-tikki-burger",
                "description": "Spiced potato patty with tangy sauce and fresh onions.",
                "price": 90,
                "discount_price": 79,
                "is_veg": True,
                "is_available": True,
                "image": "https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=500&auto=format&fit=crop"
            },
            {
                "category_id": burger_cat.id,
                "name": "Paneer Supreme Burger",
                "slug": "paneer-supreme-burger",
                "description": "Thick slice of grilled paneer with tandoori mayo and veggies.",
                "price": 180,
                "discount_price": 149,
                "is_veg": True,
                "is_available": True,
                "image": "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=500&auto=format&fit=crop"
            },
            {
                "category_id": burger_cat.id,
                "name": "Double Cheese Burger",
                "slug": "double-cheese-burger",
                "description": "Double the cheese, double the fun! With a crispy veg patty.",
                "price": 160,
                "discount_price": 129,
                "is_veg": True,
                "is_available": True,
                "image": "https://images.unsplash.com/photo-1605206497722-e42bc56b3e8e?q=80&w=500&auto=format&fit=crop"
            },
            {
                "category_id": burger_cat.id,
                "name": "Spicy Jalapeno Burger",
                "slug": "spicy-jalapeno-burger",
                "description": "For those who like it hot! Loaded with jalapenos and spicy sauce.",
                "price": 140,
                "discount_price": 119,
                "is_veg": True,
                "is_available": True,
                "image": "https://images.unsplash.com/photo-1553979459-d2229ba7433b?q=80&w=500&auto=format&fit=crop"
            },
            
            # Test Category
            {
                "category_id": test_cat.id,
                "name": "Pasta Alfredo Test",
                "slug": "pasta-alfredo-test",
                "description": "Test item representing white sauce pasta.",
                "price": 250,
                "discount_price": 220,
                "is_veg": True,
                "is_available": True,
                "image": "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?q=80&w=500&auto=format&fit=crop"
            },
            {
                "category_id": test_cat.id,
                "name": "Garlic Breadsticks",
                "slug": "garlic-breadsticks-test",
                "description": "Test item for freshly baked garlic bread.",
                "price": 150,
                "discount_price": 130,
                "is_veg": True,
                "is_available": True,
                "image": "https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?q=80&w=500&auto=format&fit=crop"
            },
            {
                "category_id": test_cat.id,
                "name": "Choco Lava Cake",
                "slug": "choco-lava-cake-test",
                "description": "Test item for dessert menu.",
                "price": 120,
                "discount_price": 100,
                "is_veg": True,
                "is_available": True,
                "image": "https://images.unsplash.com/photo-1624353365286-3f8d62daad51?q=80&w=500&auto=format&fit=crop"
            },
            {
                "category_id": test_cat.id,
                "name": "French Fries",
                "slug": "french-fries-test",
                "description": "Test item for classic salted fries.",
                "price": 99,
                "discount_price": 89,
                "is_veg": True,
                "is_available": True,
                "image": "https://images.unsplash.com/photo-1576107232684-1279f3908594?q=80&w=500&auto=format&fit=crop"
            },
            {
                "category_id": test_cat.id,
                "name": "Cold Coffee",
                "slug": "cold-coffee-test",
                "description": "Test item for beverages.",
                "price": 110,
                "discount_price": 90,
                "is_veg": True,
                "is_available": True,
                "image": "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?q=80&w=500&auto=format&fit=crop"
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
    seed_products()

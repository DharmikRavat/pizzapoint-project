import os
from app import create_app
from app.extensions import db
from app.models import Category

app = create_app()

def seed_categories():
    with app.app_context():
        categories_to_add = [
            {'name': 'Veg Pizza', 'description': 'Delicious 100% vegetarian pizzas'},
            {'name': 'Non-Veg', 'description': 'Meat lovers paradise'},
            {'name': 'Cheese Burst', 'description': 'Extra cheese loaded pizzas'},
            {'name': 'Combos', 'description': 'Perfect meals for groups'},
            {'name': 'Garlic Bread', 'description': 'Freshly baked garlic breads and sides'},
            {'name': 'Burgers', 'description': 'Juicy and delicious burgers'},
            {'name': 'Pasta', 'description': 'Authentic Italian pastas'},
            {'name': 'Drinks', 'description': 'Refreshing beverages and shakes'},
        ]
        
        count = 0
        for cat_data in categories_to_add:
            existing = Category.query.filter_by(name=cat_data['name']).first()
            if not existing:
                # also check by a normalized slug just in case
                slug = cat_data['name'].lower().replace(' ', '-')
                existing_slug = Category.query.filter_by(slug=slug).first()
                if not existing_slug:
                    new_cat = Category()
                    new_cat.name = cat_data['name']
                    new_cat.slug = slug
                    new_cat.description = cat_data['description']
                    new_cat.status = "active"
                    db.session.add(new_cat)
                    count += 1
        
        db.session.commit()
        print(f"Successfully added {count} new categories!")

if __name__ == '__main__':
    seed_categories()

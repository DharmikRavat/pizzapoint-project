import os
from app import create_app
from app.extensions import db
from app.models import Product

app = create_app()

PIZZA_IMAGES = [
    "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=500&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=500&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?q=80&w=500&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?q=80&w=500&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1590947132387-155cc02f3212?q=80&w=500&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?q=80&w=500&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1588315029754-2dd089d39a1a?q=80&w=500&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?q=80&w=500&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1555072956-7758afb20e8f?q=80&w=500&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1595854341625-f33ee10dbf94?q=80&w=500&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1628840042765-356cda07504e?q=80&w=500&auto=format&fit=crop"
]

BURGER_IMAGES = [
    "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=500&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1585238342024-78d387f4a707?q=80&w=500&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=500&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1594212848116-b8335dc1572c?q=80&w=500&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1605206497722-e42bc56b3e8e?q=80&w=500&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1553979459-d2229ba7433b?q=80&w=500&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?q=80&w=500&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1618449840665-9ed506d73a34?q=80&w=500&auto=format&fit=crop"
]

PASTA_IMAGES = [
    "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?q=80&w=500&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1621996316565-4299b90875e5?q=80&w=500&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1516685018646-54919852fdff?q=80&w=500&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1551183053-bf91a1d81141?q=80&w=500&auto=format&fit=crop"
]

SIDES_IMAGES = [
    "https://images.unsplash.com/photo-1576107232684-1279f3908594?q=80&w=500&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1623297686737-023a9a7a149c?q=80&w=500&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1585109649139-366815a0d713?q=80&w=500&auto=format&fit=crop"
]

DESSERT_DRINK_IMAGES = [
    "https://images.unsplash.com/photo-1624353365286-3f8d62daad51?q=80&w=500&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?q=80&w=500&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?q=80&w=500&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1551024601-bec78aea704b?q=80&w=500&auto=format&fit=crop"
]

def seed_diverse_images():
    with app.app_context():
        products = Product.query.all()
        
        p_idx = 0
        b_idx = 0
        pa_idx = 0
        s_idx = 0
        d_idx = 0
        
        for p in products:
            name = p.name.lower()
            if 'burger' in name or 'aloo' in name or 'supreme' in name:
                p.image = BURGER_IMAGES[b_idx % len(BURGER_IMAGES)]
                b_idx += 1
            elif 'pizza' in name or 'margherita' in name or 'wave' in name or 'pepperoni' in name or 'cheese burst' in name or 'paneer' in name:
                p.image = PIZZA_IMAGES[p_idx % len(PIZZA_IMAGES)]
                p_idx += 1
            elif 'pasta' in name:
                p.image = PASTA_IMAGES[pa_idx % len(PASTA_IMAGES)]
                pa_idx += 1
            elif 'fries' in name or 'bread' in name or 'meal' in name:
                p.image = SIDES_IMAGES[s_idx % len(SIDES_IMAGES)]
                s_idx += 1
            elif 'cake' in name or 'drink' in name or 'pepsi' in name or 'coffee' in name:
                p.image = DESSERT_DRINK_IMAGES[d_idx % len(DESSERT_DRINK_IMAGES)]
                d_idx += 1
            else:
                p.image = PIZZA_IMAGES[p_idx % len(PIZZA_IMAGES)]
                p_idx += 1
                
        db.session.commit()
        print(f"Successfully applied diverse images to {len(products)} products!")

if __name__ == '__main__':
    seed_diverse_images()

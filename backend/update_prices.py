from app import create_app
from app.extensions import db
from app.models import Product, Settings, Order

app = create_app()

with app.app_context():
    products = Product.query.all()
    for p in products:
        if p.price < 100: # if it looks like USD
            p.price = round(p.price * 83)
            if p.discount_price:
                p.discount_price = round(p.discount_price * 83)
    
    settings = Settings.query.first()
    if settings and settings.delivery_charge < 50:
        settings.delivery_charge = round(settings.delivery_charge * 83)

    orders = Order.query.all()
    for o in orders:
        if o.total_amount < 1000:
            o.total_amount = round(o.total_amount * 83)
            for item in o.items:
                item.price_at_time = round(item.price_at_time * 83)

    db.session.commit()
    print("Prices updated successfully!")

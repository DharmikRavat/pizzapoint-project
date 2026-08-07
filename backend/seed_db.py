import os
import json
from datetime import datetime, timezone
from pymongo import MongoClient, ASCENDING, DESCENDING
from pymongo.errors import CollectionInvalid
from dotenv import load_dotenv

# Load environment variables
load_dotenv()
MONGO_URI = os.getenv('MONGO_URI')

if not MONGO_URI:
    print("ERROR: MONGO_URI not found in .env file.")
    exit(1)

print(f"Connecting to MongoDB Atlas...")
import certifi
client = MongoClient(MONGO_URI, tlsCAFile=certifi.where())
db = client.get_default_database() # Uses the db name from URI, e.g., mahadev_pizza

def create_collection_with_schema(db, name, schema):
    try:
        db.create_collection(name, validator={'$jsonSchema': schema})
        print(f"Created collection '{name}' with validation schema.")
    except CollectionInvalid:
        print(f"Collection '{name}' already exists. Updating schema...")
        db.command("collMod", name, validator={'$jsonSchema': schema})

def setup_database():
    # 1. Users Schema
    users_schema = {
        "bsonType": "object",
        "required": ["fullName", "email", "password", "role"],
        "properties": {
            "fullName": {"bsonType": "string"},
            "email": {"bsonType": "string"},
            "phone": {"bsonType": "string"},
            "password": {"bsonType": "string"},
            "role": {"enum": ["Admin", "Manager", "Customer"]},
            "isVerified": {"bsonType": "bool"},
            "createdAt": {"bsonType": "date"}
        }
    }
    create_collection_with_schema(db, "users", users_schema)
    db.users.create_index([("email", ASCENDING)], unique=True)

    # 2. Categories Schema
    categories_schema = {
        "bsonType": "object",
        "required": ["categoryName", "slug"],
        "properties": {
            "categoryName": {"bsonType": "string"},
            "slug": {"bsonType": "string"},
            "status": {"enum": ["active", "inactive"]}
        }
    }
    create_collection_with_schema(db, "categories", categories_schema)
    db.categories.create_index([("slug", ASCENDING)], unique=True)

    # 3. Products Schema
    products_schema = {
        "bsonType": "object",
        "required": ["categoryId", "productName", "slug", "price"],
        "properties": {
            "categoryId": {"bsonType": "objectId"},
            "productName": {"bsonType": "string"},
            "slug": {"bsonType": "string"},
            "price": {"bsonType": "number"},
            "isVeg": {"bsonType": "bool"},
            "isAvailable": {"bsonType": "bool"}
        }
    }
    create_collection_with_schema(db, "products", products_schema)
    db.products.create_index([("slug", ASCENDING)], unique=True)
    db.products.create_index([("categoryId", ASCENDING)])

    # 4. Settings Schema
    settings_schema = {
        "bsonType": "object",
        "required": ["restaurantName", "email", "currency"],
        "properties": {
            "restaurantName": {"bsonType": "string"},
            "email": {"bsonType": "string"},
            "currency": {"bsonType": "string"}
        }
    }
    create_collection_with_schema(db, "restaurant_settings", settings_schema)

    # Seed Data
    print("Seeding sample data...")
    
    # Settings
    if db.restaurant_settings.count_documents({}) == 0:
        db.restaurant_settings.insert_one({
            "restaurantName": "Mahadev Pizza Point",
            "email": "hello@mahadevpizza.com",
            "phone": "+1 234 567 8900",
            "address": "123 Pizza Street, Food City",
            "currency": "INR",
            "deliveryCharge": 49,
            "GST": 5.0
        })

    # Categories
    if db.categories.count_documents({}) == 0:
        veg_pizza_id = db.categories.insert_one({
            "categoryName": "Veg Pizza",
            "slug": "veg-pizza",
            "description": "Delicious 100% vegetarian pizzas",
            "status": "active",
            "createdAt": datetime.now(timezone.utc)
        }).inserted_id

        # Products
        if db.products.count_documents({}) == 0:
            db.products.insert_many([
                {
                    "categoryId": veg_pizza_id,
                    "productName": "Margherita Extra",
                    "slug": "margherita-extra",
                    "description": "Classic delight with 100% real mozzarella cheese.",
                    "price": 1078,
                    "discountPrice": 912,
                    "isVeg": True,
                    "isAvailable": True,
                    "rating": 4.8,
                    "reviewCount": 120,
                    "stock": 50,
                    "createdAt": datetime.now(timezone.utc)
                },
                {
                    "categoryId": veg_pizza_id,
                    "productName": "Veggie Supreme",
                    "slug": "veggie-supreme",
                    "description": "Black olives, capsicum, onion, grilled mushroom, corn.",
                    "price": 1244,
                    "discountPrice": 1078,
                    "isVeg": True,
                    "isAvailable": True,
                    "rating": 4.7,
                    "reviewCount": 85,
                    "stock": 30,
                    "createdAt": datetime.now(timezone.utc)
                }
            ])
            
    print("Database schema setup and seeding completed successfully!")

if __name__ == '__main__':
    setup_database()

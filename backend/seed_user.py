import os
import bcrypt
from pymongo import MongoClient
from dotenv import load_dotenv
from datetime import datetime, timezone
import sys

load_dotenv()
MONGO_URI = os.getenv('MONGO_URI')

if not MONGO_URI:
    print("ERROR: MONGO_URI not found.")
    sys.exit(1)

try:
    import certifi
    client = MongoClient(MONGO_URI, tlsCAFile=certifi.where())
    db = client.get_default_database()

    print("Checking if admin user exists...")
    admin = db.users.find_one({"email": "admin@gmail.com"})
    if not admin:
        print("Admin user not found, creating one...")
        # using the same bcrypt that Flask-Bcrypt uses (gensalt 12)
        hashed_password = bcrypt.hashpw('admin123'.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        db.users.insert_one({
            "fullName": "Admin User",
            "email": "admin@gmail.com",
            "password": hashed_password,
            "role": "Admin",
            "phone": "9876543210",
            "isVerified": True,
            "createdAt": datetime.now(timezone.utc)
        })
        print("Admin user created! (Email: admin@gmail.com, Password: admin123)")
    else:
        print("Admin user already exists.")

    print("Checking if customer user exists...")
    customer = db.users.find_one({"email": "customer@gmail.com"})
    if not customer:
        print("Customer user not found, creating one...")
        hashed_password = bcrypt.hashpw('customer123'.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        db.users.insert_one({
            "fullName": "Test Customer",
            "email": "customer@gmail.com",
            "password": hashed_password,
            "role": "Customer",
            "phone": "9876543211",
            "isVerified": True,
            "createdAt": datetime.now(timezone.utc)
        })
        print("Customer user created! (Email: customer@gmail.com, Password: customer123)")
    else:
        print("Customer user already exists.")

    print("User setup complete!")
except Exception as e:
    print(f"Error connecting or seeding users: {e}")

import requests
import json
import sys

BASE_URL = 'http://127.0.0.1:5000/api/v1'

def print_result(step, response):
    status = response.status_code
    try:
        data = response.json()
        print(f"[{status}] {step}: {data.get('status')} - {data.get('message', 'OK')}")
        return data
    except:
        print(f"[{status}] {step}: Failed to parse JSON. Content: {response.text[:100]}")
        return None

def test_flows():
    print("=== STARTING ADMIN FLOW ===")
    
    # 1. Admin Login
    res = requests.post(f"{BASE_URL}/auth/login", json={
        "email": "admin@gmail.com",
        "password": "admin123"
    })
    admin_data = print_result("Admin Login", res)
    if not admin_data or admin_data.get('status') != 'success':
        print("Admin login failed, aborting admin flow.")
        sys.exit(1)
        
    admin_token = admin_data['token']
    admin_headers = {'Authorization': f'Bearer {admin_token}'}
    
    # 2. Get Admin Dashboard Stats
    res = requests.get(f"{BASE_URL}/admin/dashboard/stats", headers=admin_headers)
    print_result("Admin Dashboard Stats", res)
    
    # 3. Create a Category
    res = requests.post(f"{BASE_URL}/categories/", headers=admin_headers, json={
        "name": "Test Category",
        "description": "A category for testing"
    })
    cat_data = print_result("Create Category", res)
    
    # 4. Create a Product
    res = requests.post(f"{BASE_URL}/products/", headers=admin_headers, data={
        "name": "Test Product",
        "price": 9.99,
        "categoryId": cat_data['data']['_id'] if cat_data and 'data' in cat_data else 1,
        "description": "Test product description"
    })
    print_result("Create Product", res)
    
    print("\n=== STARTING CUSTOMER FLOW ===")
    
    # 5. Customer Login
    res = requests.post(f"{BASE_URL}/auth/login", json={
        "email": "customer@gmail.com",
        "password": "customer123"
    })
    cust_data = print_result("Customer Login", res)
    if not cust_data or cust_data.get('status') != 'success':
        print("Customer login failed. Trying to register...")
        # Register if not exists
        res = requests.post(f"{BASE_URL}/auth/register", json={
            "fullName": "Test Customer",
            "email": "customer@gmail.com",
            "password": "customer123",
            "phone": "9876543211"
        })
        print_result("Customer Registration", res)
        # Login again
        res = requests.post(f"{BASE_URL}/auth/login", json={
            "email": "customer@gmail.com",
            "password": "customer123"
        })
        cust_data = print_result("Customer Login Retry", res)

    cust_token = cust_data['token']
    cust_headers = {'Authorization': f'Bearer {cust_token}'}
    
    # 6. Get Products
    res = requests.get(f"{BASE_URL}/products/")
    products_data = print_result("Get Products", res)
    
    # 7. Create Order
    if products_data and 'data' in products_data and len(products_data['data']) > 0:
        product_id = products_data['data'][0]['_id']
        price = products_data['data'][0]['price']
        res = requests.post(f"{BASE_URL}/orders/", headers=cust_headers, json={
            "items": [
                {"productId": product_id, "quantity": 2, "price": price}
            ],
            "totalAmount": price * 2,
            "deliveryAddress": "123 Test Street",
            "paymentMethod": "COD"
        })
        order_data = print_result("Create Order", res)
    else:
        print("No products found to create an order.")
        
    print("\n=== ADMIN FLOW: CHECK ORDERS ===")
    res = requests.get(f"{BASE_URL}/orders/", headers=admin_headers)
    print_result("Admin Get All Orders", res)
    
    print("\nAll flows tested!")

if __name__ == '__main__':
    test_flows()

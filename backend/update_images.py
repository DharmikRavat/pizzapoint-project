import sqlite3

updates = {
    12: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=500&auto=format&fit=crop',
    13: 'https://images.unsplash.com/photo-1585238342024-78d387f4a707?q=80&w=500&auto=format&fit=crop',
    17: 'https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?q=80&w=500&auto=format&fit=crop',
    19: 'https://images.unsplash.com/photo-1576107232684-1279f3908594?q=80&w=500&auto=format&fit=crop',
    21: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=500&auto=format&fit=crop',
    22: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?q=80&w=500&auto=format&fit=crop',
    23: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?q=80&w=500&auto=format&fit=crop',
    24: 'https://images.unsplash.com/photo-1615719413546-198b25453f85?q=80&w=500&auto=format&fit=crop',
    25: 'https://images.unsplash.com/photo-1619531040589-980a373b569e?q=80&w=500&auto=format&fit=crop',
    26: 'https://images.unsplash.com/photo-1473093226795-af9932fe5856?q=80&w=500&auto=format&fit=crop',
    27: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?q=80&w=500&auto=format&fit=crop'
}

conn = sqlite3.connect('instance/mahadev_pizza.db')
cursor = conn.cursor()

for prod_id, img_url in updates.items():
    cursor.execute('UPDATE products SET image = ? WHERE id = ?', (img_url, prod_id))

conn.commit()
print("Updated images for products!")
conn.close()

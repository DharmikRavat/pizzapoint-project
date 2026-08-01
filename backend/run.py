from app import create_app
import os

app = create_app()

from app.extensions import db, bcrypt
from app.models import User

with app.app_context():
    db.create_all()
    admin = User.query.filter_by(email="admin@gmail.com").first()
    if not admin:
        hashed_admin_pwd = bcrypt.generate_password_hash('admin123').decode('utf-8')
        admin = User(
            full_name="Admin User",
            email="admin@gmail.com",
            password=hashed_admin_pwd,
            role="Admin",
            phone="9876543210",
            is_verified=True
        )
        db.session.add(admin)
        db.session.commit()
    elif admin.role != "Admin":
        admin.role = "Admin"
        db.session.commit()

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=app.config.get('DEBUG', False))

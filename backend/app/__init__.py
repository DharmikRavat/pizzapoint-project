from flask import Flask
from .config import Config
from .extensions import db, jwt, cors, bcrypt

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    # Initialize Flask extensions here
    db.init_app(app)
    jwt.init_app(app)
    cors.init_app(app)
    bcrypt.init_app(app)

    # Register blueprints here
    from app.routes import api_bp
    from app.controllers.contact_controller import contact_bp
    from app.controllers.offer_controller import offer_bp
    from app.controllers.content_controller import content_bp
    
    app.register_blueprint(api_bp, url_prefix='/api/v1')
    app.register_blueprint(contact_bp, url_prefix='/api/v1/contact')
    app.register_blueprint(offer_bp, url_prefix='/api/v1/offers')
    app.register_blueprint(content_bp, url_prefix='/api/v1/content')

    @app.route('/')
    def index():
        return {'status': 'success', 'message': 'Welcome to Mahadev Pizza Point API!'}, 200

    @app.route('/health')
    def health_check():
        return {'status': 'healthy', 'message': 'Mahadev Pizza Point API is running!'}, 200

    return app

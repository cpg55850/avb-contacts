import os

from dotenv import load_dotenv
from flask import Flask, render_template
from flask_cors import CORS
from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy

# Base DB setup
db = SQLAlchemy()
migrate = Migrate()


def _database_uri() -> str:
    """Build the database URI from .env settings, defaulting to local SQLite."""
    db_path = os.getenv("DATABASE_PATH", "app/db/app.sqlite")
    return f"sqlite:///{db_path}"


def create_app() -> Flask:
    load_dotenv()

    # Get the parent directory (flask/) where static folder is
    static_path = os.path.join(os.path.dirname(__file__), "../templates")
    
    app = Flask(__name__, static_folder=static_path, static_url_path="", template_folder=static_path)
    app.config.update(
        SECRET_KEY=os.getenv("SECRET_KEY", "secret-key"),
        SQLALCHEMY_DATABASE_URI=_database_uri(),
        SQLALCHEMY_TRACK_MODIFICATIONS=False,
    )

    CORS(app)
    db.init_app(app)
    migrate.init_app(app, db)

    from app.routes import api_bp

    app.register_blueprint(api_bp, url_prefix="/api")

    # Serve frontend
    @app.route("/")
    def index():
        return render_template("index.html", test="Hello, World")

    return app

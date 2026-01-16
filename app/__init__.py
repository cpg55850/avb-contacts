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
    from pathlib import Path

    # Get the absolute path to this __init__.py file
    base_dir = Path(__file__).resolve().parent  # /Users/charliegraham/code/projects/contacts/app
    db_file = Path(os.getenv("DATABASE_PATH", "db/app.sqlite"))
    full_path = base_dir / db_file

    # Ensure folder exists
    full_path.parent.mkdir(parents=True, exist_ok=True)

    return f"sqlite:///{full_path}"


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

    from app.routes import api, frontend

    app.register_blueprint(api, url_prefix="/api")
    app.register_blueprint(frontend)

    return app

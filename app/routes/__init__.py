from flask import Blueprint, jsonify

api = Blueprint("api", __name__)


@api.route("/health", methods=["GET"])
def health() -> tuple:
    return jsonify({"status": "ok"}), 200

from app.routes.contacts import contacts
from app.routes.emails import emails
from app.routes.frontend import frontend

api.register_blueprint(contacts)
api.register_blueprint(emails)

__all__ = ["api", "frontend", "contacts", "emails"]

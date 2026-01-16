from flask import Blueprint, jsonify

api = Blueprint("api", __name__)


@api.route("/health", methods=["GET"])
def health() -> tuple:
    return jsonify({"status": "ok"}), 200

from app.routes.contacts import contacts

api.register_blueprint(contacts)

api_bp = api
__all__ = ["api_bp"]

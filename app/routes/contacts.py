from flask import Blueprint, request, jsonify
from sqlalchemy.exc import IntegrityError

from app import db
from app.models import Contact
from app.helpers.validation import require_fields

contacts = Blueprint("contacts", __name__, url_prefix="/contacts")

# TODO: AI generated, need to review
@contacts.route("", methods=["GET"])
def list_contacts() -> tuple:
    contacts = Contact.query.order_by(Contact.created_at.desc()).all()
    return jsonify([contact.to_dict() for contact in contacts]), 200

# TODO: AI generated, need to review
@contacts.route("", methods=["POST"])
def create_contact() -> tuple:
    data = request.get_json(silent=True) or {}
    missing = require_fields(data, ["name", "email"])
    if missing:
        return jsonify({"error": f"Missing required field(s): {', '.join(missing)}"}), 400

    contact = Contact(
        name=data["name"],
        email=data["email"],
        phone=data.get("phone"),
    )
    db.session.add(contact)

    try:
        db.session.commit()
    except IntegrityError:
        db.session.rollback()
        return jsonify({"error": "A contact with that email already exists."}), 400

    return jsonify(contact.to_dict()), 201

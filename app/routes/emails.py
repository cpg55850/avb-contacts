from flask import Blueprint, request, jsonify
from sqlalchemy.exc import IntegrityError

from app import db
from app.models import Contact, ContactEmail
from app.helpers.validation import require_fields

emails = Blueprint("emails", __name__, url_prefix="/contacts/<int:contactId>/emails")

@emails.route("", methods=["POST"])
def add_email(contactId: int) -> tuple:
    contact = Contact.query.get(contactId)
    if not contact:
        return jsonify({"error": "Contact not found."}), 404

    data = request.get_json(silent=True) or {}
    missing = require_fields(data, ["email"])
    if missing:
        return jsonify({"error": f"Missing required field(s): {', '.join(missing)}"}), 400

    email = data["email"]
    contact_email = ContactEmail(contact_id=contact.id, email=email)
    db.session.add(contact_email)

    try:
        db.session.commit()
    except IntegrityError:
        db.session.rollback()
        return jsonify({"error": "A contact with that email already exists."}), 400

    return jsonify(contact_email.to_dict()), 201

@emails.route("/<int:emailId>", methods=["DELETE"])
def delete_email(contactId: int, emailId: int) -> tuple:
    contact = Contact.query.get(contactId)
    if not contact:
        return jsonify({"error": "Contact not found."}), 404

    contact_email = ContactEmail.query.get(emailId)
    if not contact_email or contact_email.contact_id != contact.id:
        return jsonify({"error": "Email not found for this contact."}), 404

    db.session.delete(contact_email)
    db.session.commit()

    return jsonify({"message": "Email deleted successfully."}), 200
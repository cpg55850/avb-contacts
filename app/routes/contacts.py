from flask import Blueprint, request, jsonify
from sqlalchemy.exc import IntegrityError

from app import db
from app.models import Contact, ContactEmail
from app.helpers.validation import require_fields

contacts = Blueprint("contacts", __name__, url_prefix="/contacts")

# TODO: AI generated, need to review
@contacts.route("", methods=["GET"])
def list_contacts() -> tuple:
    contacts = Contact.query.order_by(Contact.created_at.desc()).all()
    return jsonify([contact.to_dict() for contact in contacts]), 200

# Get a single contact by ID
@contacts.route("/<int:contact_id>", methods=["GET"])
def get_contact(contact_id: int) -> tuple:
    contact = Contact.query.get(contact_id)
    if not contact:
        return jsonify({"error": "Contact not found."}), 404
    return jsonify(contact.to_dict()), 200

@contacts.route("", methods=["POST"])
def create_contact() -> tuple:
    data = request.get_json(silent=True) or {}
    missing = require_fields(data, ["name", "emails"])
    if missing:
        return jsonify({"error": f"Missing required field(s): {', '.join(missing)}"}), 400

    contact = Contact(
        name=data["name"],
        phone=data.get("phone"),
    )
    db.session.add(contact)
    db.session.flush()  # Get contact.id before adding emails

    # Add emails
    emails = data["emails"]
    if not isinstance(emails, list) or not emails:
        return jsonify({"error": "Emails must be a non-empty list."}), 400
    for email in emails:
        db.session.add(ContactEmail(contact_id=contact.id, email=email))

    try:
        db.session.commit()
    except IntegrityError:
        db.session.rollback()
        return jsonify({"error": "A contact with one of those emails already exists."}), 400

    return jsonify(contact.to_dict()), 201

@contacts.route("/<int:contact_id>", methods=["PATCH"])
def update_contact(contact_id: int) -> tuple:
    contact = Contact.query.get(contact_id)
    if not contact:
        return jsonify({"error": "Contact not found."}), 404

    data = request.get_json(silent=True) or {}

    if "name" in data:
        contact.name = data["name"]
    if "phone" in data:
        contact.phone = data["phone"]
    
    # Handle emails if provided
    if "emails" in data:
        emails = data["emails"]
        if not isinstance(emails, list) or not emails:
            return jsonify({"error": "Emails must be a non-empty list."}), 400
        
        # Remove existing emails
        ContactEmail.query.filter_by(contact_id=contact.id).delete()
        
        # Add new emails
        for email in emails:
            db.session.add(ContactEmail(contact_id=contact.id, email=email))

    try:
        db.session.commit()
    except IntegrityError:
        db.session.rollback()
        return jsonify({"error": "A contact with that email already exists."}), 400

    return jsonify(contact.to_dict()), 200
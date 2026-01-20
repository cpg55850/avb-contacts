from flask import Blueprint, request, jsonify
from sqlalchemy.exc import IntegrityError

from app import db
from app.models import Contact, ContactEmail
from app.helpers.validation import require_fields, validate_contact_data

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
    
    # Validate contact data
    validation_error = validate_contact_data(data, is_update=False)
    if validation_error:
        return jsonify({"error": validation_error}), 400

    contact = Contact(
        first_name=data["firstName"].strip(),
        last_name=data["lastName"].strip(),
        phone=data.get("phone", "").strip() or None,
    )
    db.session.add(contact)
    db.session.flush()  # Get contact.id before adding emails

    # Add emails
    emails = data["emails"]
    for email in emails:
        db.session.add(ContactEmail(contact_id=contact.id, email=email.strip()))

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
    
    # Validate contact data
    validation_error = validate_contact_data(data, is_update=True)
    if validation_error:
        return jsonify({"error": validation_error}), 400

    if "firstName" in data:
        contact.first_name = data["firstName"].strip()
    if "lastName" in data:
        contact.last_name = data["lastName"].strip()
    if "phone" in data:
        contact.phone = data["phone"].strip() or None
    
    # Handle emails if provided
    if "emails" in data:
        emails = data["emails"]
        
        # Remove existing emails
        ContactEmail.query.filter_by(contact_id=contact.id).delete()
        
        # Add new emails
        for email in emails:
            db.session.add(ContactEmail(contact_id=contact.id, email=email.strip()))

    try:
        db.session.commit()
    except IntegrityError:
        db.session.rollback()
        return jsonify({"error": "A contact with that email already exists."}), 400

    return jsonify(contact.to_dict()), 200

@contacts.route("/<int:contact_id>", methods=["DELETE"])
def delete_contact(contact_id: int) -> tuple:
    contact = Contact.query.get(contact_id)
    if not contact:
        return jsonify({"error": "Contact not found."}), 404

    # Delete associated emails first due to foreign key constraint
    ContactEmail.query.filter_by(contact_id=contact.id).delete()
    db.session.delete(contact)
    db.session.commit()

    return jsonify({"message": "Contact deleted successfully."}), 200
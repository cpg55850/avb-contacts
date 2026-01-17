from datetime import datetime, timezone

from app import db

class ContactEmail(db.Model):
    __tablename__ = "contact_emails"

    id = db.Column(db.Integer, primary_key=True)
    contact_id = db.Column(db.Integer, db.ForeignKey("contacts.id"), nullable=False)
    email = db.Column(db.String(120), nullable=False, index=True)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)

    contact = db.relationship("Contact", back_populates="emails")

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "contact_id": self.contact_id,
            "email": self.email,
            "created_at": self.created_at.isoformat(),
        }
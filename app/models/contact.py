from datetime import datetime

from app import db


# TODO: AI generated, need to review
class Contact(db.Model):
    __tablename__ = "contacts"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    phone = db.Column(db.String(50))
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    emails = db.relationship("ContactEmail", back_populates="contact", lazy=True, cascade="all, delete-orphan")

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "name": self.name,
            "emails": [email.email for email in self.emails],
            "phone": self.phone,
            "created_at": self.created_at.isoformat(),
        }

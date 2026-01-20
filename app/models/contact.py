from datetime import datetime

from app import db


# TODO: AI generated, need to review
class Contact(db.Model):
    __tablename__ = "contacts"

    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(60), nullable=False)
    last_name = db.Column(db.String(60), nullable=False)
    phone = db.Column(db.String(50))
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    emails = db.relationship("ContactEmail", back_populates="contact", lazy=True, cascade="all, delete-orphan")

    @property
    def name(self) -> str:
        """Computed property"""
        return f"{self.first_name} {self.last_name}"

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "firstName": self.first_name,
            "lastName": self.last_name,
            "name": self.name,  # Use the property
            "emails": [email.email for email in self.emails],
            "phone": self.phone,
            "created_at": self.created_at.isoformat(),
        }

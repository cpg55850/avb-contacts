"""
Seed script to populate the database with dummy contact data.

Usage:
    python seed.py              # Adds 20 dummy contacts
    python seed.py --reset      # Drops all data and creates 20 new contacts
    python seed.py --count 50   # Adds 50 dummy contacts
"""

import os
import sys
from faker import Faker
from app import create_app, db
from app.models import Contact
from app.models import ContactEmail

# Load environment variables
from dotenv import load_dotenv
load_dotenv()

fake = Faker()
app = create_app()


def seed_contacts(n=20):
    """Seed n fake contacts into the database."""
    contacts_added = 0
    
    for _ in range(n):
        try:
            # Generate phone in consistent format: (XXX) XXX-XXXX
            phone_number = fake.numerify('(###) ###-####')
            
            contact = Contact(
                first_name=fake.first_name(),
                last_name=fake.last_name(),
                phone=phone_number,
            )

            contact_email = ContactEmail(
                email=fake.unique.email(),
            )

            contact.emails.append(contact_email)

            db.session.add(contact)
            db.session.flush()  # ensures IDs assigned
            contacts_added += 1
        except Exception as e:
            # Skip if unique constraint fails
            print(f"Skipping duplicate: {e}")
            db.session.rollback()
            continue
    
    db.session.commit()
    print(f"✅ Seeded {contacts_added} contacts!")


def reset_database():
    """Drop all tables and recreate them."""
    print("⚠️  Dropping all tables...")
    db.drop_all()
    print("✅ Creating all tables...")
    db.create_all()
    print("✅ Database reset complete!")


if __name__ == "__main__":
    with app.app_context():
        # Parse command line arguments
        reset = "--reset" in sys.argv
        count = 20
        
        if "--count" in sys.argv:
            try:
                count_index = sys.argv.index("--count")
                count = int(sys.argv[count_index + 1])
            except (IndexError, ValueError):
                print("❌ Invalid --count value. Using default of 20.")
        
        # Reset database if requested
        if reset:
            reset_database()
        
        # Seed the database
        print(f"🌱 Seeding {count} contacts...")
        seed_contacts(count)
        
        # Show total count
        total = Contact.query.count()
        print(f"📊 Total contacts in database: {total}")

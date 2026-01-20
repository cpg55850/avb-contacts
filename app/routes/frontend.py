from flask import Blueprint, render_template
from sqlalchemy import func
from app.models import Contact

frontend = Blueprint("frontend", __name__)

@frontend.route("/")
def index():
    contacts = Contact.query.order_by(func.lower(Contact.last_name).asc(), func.lower(Contact.first_name).asc()).all()
    return render_template("index.html", test="Hello, World!", contacts=contacts)
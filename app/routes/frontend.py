from flask import Blueprint, render_template
from app.models import Contact

frontend = Blueprint("frontend", __name__)

@frontend.route("/")
def index():
    contacts = Contact.query.all()
    return render_template("index.html", test="Hello, World!", contacts=contacts)
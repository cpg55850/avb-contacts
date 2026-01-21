# Contacts Manager

A full-stack contacts/address book web application built with Flask and vanilla JavaScript. Create, view, edit, and delete contacts with support for multiple email addresses per contact. Developoment in progress.

## 🛠️ Tech Stack

**Frontend:**

- Vanilla JavaScript (ES6+)
- Tailwind CSS for styling
- Jinja2 templates

**Backend:**

- Python 3.11+
- Flask web framework
- Flask-SQLAlchemy (ORM)
- Flask-CORS
- Flask-Migrate (database migrations)

**Database:**

- SQLite3

## 📋 Prerequisites

- Python 3.11 or higher
- Node.js 18+ and npm (for Tailwind CSS)

## 🚦 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/contacts.git
cd contacts
```

### 2. Set up Python virtual environment

```bash
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 3. Configure environment variables

Create a `.env` file in the `flask/` directory:

```env
FLASK_ENV=development
SECRET_KEY=your-secret-key-here
DATABASE_PATH=app/db/app.sqlite
```

### 4. Install frontend dependencies

```bash
npm install
```

### 5. Initialize the database

Initialize the database and run migrations:

```bash
# Initialize migration repository (only needed once)
flask db init

# Create initial migration
flask db migrate -m "Initial migration"

# Apply migrations to create tables
flask db upgrade
```

### 6. Seed the database (optional)

Populate the database with dummy contact data for testing:

```bash
# Add 20 dummy contacts
python seed.py

# Reset database and add 50 contacts
python seed.py --reset --count 50
```

**Seed script options:**

- `--reset`: Drops all tables and recreates them (⚠️ destroys all data)
- `--count N`: Specify number of contacts to generate (default: 20)

### 7. Run the development server

```bash
npm run dev
```

This will:

- Start the Flask backend on `http://localhost:8000`
- Watch and compile Tailwind CSS automatically
- Enable hot-reload for both frontend and backend changes

### 8. Open the app

Navigate to `http://localhost:8000` in your browser.

## 🎨 Design Decisions

- **Single-Server Architecture**: Flask serves both API and static files for simplified deployment
- **Vanilla JavaScript**: No framework overhead, faster load times, easier to understand
- **Tailwind CSS**: Utility-first approach for rapid UI development
- **SQLite**: Lightweight, zero-configuration database perfect for this use case
- **Flask Blueprints**: Modular route organization for scalability

## 📝 Notes

- No authentication required (per project specifications)
- Input validation on both client and server side
- CORS enabled for API flexibility
- Database migrations supported via Flask-Migrate

## �👤 Author

**Charlie Graham**

- Email: contact@charliegraham.dev
- Website: [charliegraham.dev](https://charliegraham.dev)

---

Built as a technical assessment for AVB Marketing.

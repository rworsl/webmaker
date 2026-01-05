# Quick Start Guide

Get DragMeHome running in 3 minutes! ⚡

## Method 1: Automatic Setup (Recommended)

### Linux/Mac
```bash
chmod +x setup.sh
./setup.sh
```

### Windows
```bash
setup.bat
```

Then run:
```bash
python app.py
```

Open http://localhost:5000 in your browser! 🎉

---

## Method 2: Manual Setup

### 1. Install Dependencies
```bash
pip install -r requirements.txt
```

### 2. Run the Application
```bash
python app.py
```

### 3. Open Browser
Navigate to http://localhost:5000

---

## First Steps

1. **Register**: Create your account
2. **Create Project**: Click "New Project" in dashboard
3. **Build**: Drag components onto canvas
4. **Customize**: Click components to edit properties
5. **Export**: Download as HTML, React, Vue, or ZIP

---

## Default Accounts

For testing, you can create any account. There are no pre-configured accounts.

---

## Troubleshooting

### Port Already in Use
```python
# Edit app.py, change the last line to:
app.run(debug=True, port=5001)  # or any available port
```

### Database Error
```bash
# Delete and recreate database
rm website_builder.db
python app.py
```

### Module Not Found
```bash
# Make sure you're in the virtual environment
source venv/bin/activate  # Linux/Mac
venv\Scripts\activate     # Windows

# Reinstall dependencies
pip install -r requirements.txt
```

---

## Quick Demo

1. Register at http://localhost:5000/register
2. Create a project
3. Drag "Hero Section" to canvas
4. Click it and edit the title
5. Click "Preview" to see your website
6. Click "Export" and choose HTML

That's it! You've built your first website! 🚀

---

## Need Help?

- Read the full [README.md](README.md) for detailed documentation
- Check the [API endpoints](#) for integration options
- Review the code in `app.py` and `static/js/builder.js`

---

**Happy Building!** 🎨

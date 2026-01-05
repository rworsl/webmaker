# DragMeHome - Professional Drag & Drop Website Builder

A full-featured, subscription-based website builder with drag-and-drop functionality built with Flask and vanilla JavaScript.

## 🚀 Features

### Core Features
- **Drag & Drop Builder**: Intuitive interface for building websites without code
- **Rich Component Library**: 
  - Hero sections
  - Text blocks
  - Images
  - Feature grids
  - Call-to-action sections
  - Image galleries
  - Premium components (Pro tier)
- **Real-time Preview**: See changes instantly as you build
- **Theme Customization**: Full control over colors, fonts, and styling
- **Responsive Design**: All components are mobile-friendly

### Subscription Tiers

#### Free Tier
- Up to 3 projects
- 10 components per page
- HTML export
- Basic components
- Theme customization

#### Pro Tier ($19/month)
- Unlimited projects
- Unlimited components
- HTML, React, Vue exports
- ZIP package downloads
- Premium components
- Custom code editor
- Priority support

### Export Options
- **HTML**: Single-file HTML export
- **ZIP Package**: Complete package with HTML, CSS, and JS files
- **React**: Generate React component code (Pro)
- **Vue**: Generate Vue component code (Pro)

## 🛠 Tech Stack

- **Backend**: Flask (Python)
- **Database**: SQLite with SQLAlchemy ORM
- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **Authentication**: Werkzeug password hashing
- **Session Management**: Flask sessions

## 📋 Requirements

- Python 3.8+
- pip (Python package manager)

## 🚀 Installation

1. **Clone or download the project**
   ```bash
   cd website-builder
   ```

2. **Create a virtual environment** (recommended)
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Run the application**
   ```bash
   python app.py
   ```

5. **Open your browser**
   Navigate to `http://localhost:5000`

## 🎯 Quick Start

1. **Register an account**: Click "Get Started" and create your account
2. **Create a project**: From the dashboard, click "New Project"
3. **Build your website**: 
   - Drag components from the left panel onto the canvas
   - Click components to select and edit their properties
   - Customize theme colors and fonts
4. **Preview**: Click the preview button to see your website
5. **Export**: Choose your export format and download

## 📁 Project Structure

```
website-builder/
├── app.py                 # Main Flask application
├── requirements.txt       # Python dependencies
├── static/
│   ├── css/
│   │   └── style.css     # Main stylesheet
│   └── js/
│       ├── builder.js     # Drag & drop functionality
│       └── main.js        # General JavaScript
├── templates/
│   ├── base.html         # Base template
│   ├── index.html        # Landing page
│   ├── login.html        # Login page
│   ├── register.html     # Registration page
│   ├── dashboard.html    # User dashboard
│   ├── builder.html      # Main builder interface
│   └── pricing.html      # Pricing page
└── README.md
```

## 🔐 Security Features

- **Password Hashing**: Werkzeug secure password hashing
- **Session Management**: Secure Flask sessions with secret keys
- **Input Validation**: Server-side validation for all user inputs
- **SQL Injection Protection**: SQLAlchemy ORM prevents SQL injection
- **CSRF Protection**: Built-in Flask CSRF protection

## 🎨 Customization

### Adding New Components

1. Edit `static/js/builder.js`
2. Add your component template to `componentTemplates`
3. Add rendering logic in `renderComponent()`
4. Add the component to the UI in `templates/builder.html`

### Modifying Themes

Theme settings are stored in the project settings. Edit the theme panel in `templates/builder.html` or modify default values in `static/js/builder.js`.

## 🌐 Deployment

### Production Considerations

1. **Change Secret Key**: Generate a secure secret key
   ```python
   import secrets
   app.config['SECRET_KEY'] = secrets.token_hex(32)
   ```

2. **Use Production Database**: Switch from SQLite to PostgreSQL or MySQL
   ```python
   app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://user:pass@localhost/dbname'
   ```

3. **Enable HTTPS**: Use SSL certificates

4. **Set Debug to False**
   ```python
   app.run(debug=False)
   ```

5. **Use Production Server**: Deploy with Gunicorn or uWSGI
   ```bash
   pip install gunicorn
   gunicorn app:app
   ```

### Deployment Options

- **Heroku**: Easy deployment with Heroku Postgres
- **AWS**: EC2 with RDS for database
- **DigitalOcean**: App Platform or Droplets
- **PythonAnywhere**: Simple Flask hosting

## 💳 Payment Integration

The current implementation includes a demo upgrade system. For production:

1. Integrate Stripe or another payment processor
2. Implement webhook handlers for subscription events
3. Add subscription management (cancel, upgrade, downgrade)
4. Set up automated billing

Example Stripe integration:
```python
import stripe
stripe.api_key = 'your_secret_key'

@app.route('/create-checkout-session', methods=['POST'])
def create_checkout_session():
    session = stripe.checkout.Session.create(
        payment_method_types=['card'],
        line_items=[{
            'price': 'price_xxxxx',
            'quantity': 1,
        }],
        mode='subscription',
        success_url=url_for('success', _external=True),
        cancel_url=url_for('cancel', _external=True),
    )
    return redirect(session.url)
```

## 🧪 Testing

Run tests (create test files first):
```bash
python -m pytest tests/
```

## 📝 API Endpoints

### Projects
- `POST /api/projects` - Create new project
- `PUT /api/projects/<id>` - Update project
- `DELETE /api/projects/<id>` - Delete project

### Export
- `GET /api/export/<id>/html` - Export as HTML
- `GET /api/export/<id>/zip` - Export as ZIP
- `GET /api/export/<id>/react` - Export as React
- `GET /api/export/<id>/vue` - Export as Vue

### Subscription
- `POST /api/upgrade` - Upgrade to Pro

## 🐛 Troubleshooting

### Database Issues
```bash
# Reset database
rm website_builder.db
python app.py  # Will recreate database
```

### Port Already in Use
```bash
# Change port in app.py
app.run(debug=True, port=5001)
```

## 📄 License

This project is for educational and commercial use.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit pull requests.

## 📧 Support

For questions or issues, please open an issue on GitHub or contact support.

## 🎉 Acknowledgments

- Built with Flask and vanilla JavaScript
- Icons from Unicode emoji
- Images from Unsplash

---

**DragMeHome** - Build beautiful websites with drag and drop 🚀

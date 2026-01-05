from flask import Flask, render_template, request, jsonify, session, redirect, url_for, send_file
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from functools import wraps
import os
import json
import secrets
from datetime import datetime, timedelta
import zipfile
from io import BytesIO
from werkzeug.utils import secure_filename
import uuid

app = Flask(__name__)
app.config['SECRET_KEY'] = secrets.token_hex(32)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///website_builder.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(days=7)
app.config['UPLOAD_FOLDER'] = 'static/uploads'
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'webp', 'svg'}

# Create upload folder if it doesn't exist
import os
if not os.path.exists(app.config['UPLOAD_FOLDER']):
    os.makedirs(app.config['UPLOAD_FOLDER'])

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

db = SQLAlchemy(app)

# Database Models
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(200), nullable=False)
    subscription_tier = db.Column(db.String(20), default='free')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    projects = db.relationship('Project', backref='owner', lazy=True, cascade='all, delete-orphan')

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)
    
    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

class Project(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    content = db.Column(db.Text, default='[]')
    settings = db.Column(db.Text, default='{}')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

# Subscription Limits
SUBSCRIPTION_LIMITS = {
    'free': {
        'max_projects': 3,
        'max_components_per_page': 10,
        'export_formats': ['html'],
        'custom_code': False,
        'premium_components': False
    },
    'pro': {
        'max_projects': 999,
        'max_components_per_page': 999,
        'export_formats': ['html', 'react', 'vue', 'zip'],
        'custom_code': True,
        'premium_components': True
    }
}

# Decorators
def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user_id' not in session:
            return redirect(url_for('login'))
        return f(*args, **kwargs)
    return decorated_function

def subscription_check(feature):
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            user = User.query.get(session.get('user_id'))
            if not user:
                return jsonify({'error': 'Unauthorized'}), 401
            
            limits = SUBSCRIPTION_LIMITS[user.subscription_tier]
            
            if feature == 'project_limit':
                if len(user.projects) >= limits['max_projects']:
                    return jsonify({'error': 'Project limit reached. Upgrade to Pro for unlimited projects.'}), 403
            
            return f(*args, **kwargs)
        return decorated_function
    return decorator

# Routes
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        data = request.json
        username = data.get('username', '').strip()
        email = data.get('email', '').strip()
        password = data.get('password', '')
        
        # Validation
        if not username or not email or not password:
            return jsonify({'error': 'All fields are required'}), 400
        
        if len(password) < 8:
            return jsonify({'error': 'Password must be at least 8 characters'}), 400
        
        if User.query.filter_by(username=username).first():
            return jsonify({'error': 'Username already exists'}), 400
        
        if User.query.filter_by(email=email).first():
            return jsonify({'error': 'Email already registered'}), 400
        
        # Create user
        user = User(username=username, email=email)
        user.set_password(password)
        db.session.add(user)
        db.session.commit()
        
        return jsonify({'success': True, 'message': 'Account created successfully'})
    
    return render_template('register.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        data = request.json
        username = data.get('username', '').strip()
        password = data.get('password', '')
        
        user = User.query.filter_by(username=username).first()
        
        if user and user.check_password(password):
            session.permanent = True
            session['user_id'] = user.id
            session['username'] = user.username
            session['subscription_tier'] = user.subscription_tier
            return jsonify({'success': True})
        
        return jsonify({'error': 'Invalid credentials'}), 401
    
    return render_template('login.html')

@app.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('index'))

@app.route('/dashboard')
@login_required
def dashboard():
    user = User.query.get(session['user_id'])
    projects = Project.query.filter_by(user_id=user.id).order_by(Project.updated_at.desc()).all()
    limits = SUBSCRIPTION_LIMITS[user.subscription_tier]
    return render_template('dashboard.html', user=user, projects=projects, limits=limits)

@app.route('/builder/<int:project_id>')
@login_required
def builder(project_id):
    project = Project.query.get_or_404(project_id)
    if project.user_id != session['user_id']:
        return redirect(url_for('dashboard'))
    
    user = User.query.get(session['user_id'])
    limits = SUBSCRIPTION_LIMITS[user.subscription_tier]
    return render_template('builder.html', project=project, limits=limits)

@app.route('/pricing')
def pricing():
    return render_template('pricing.html')

# API Routes
@app.route('/api/projects', methods=['POST'])
@login_required
@subscription_check('project_limit')
def create_project():
    data = request.json
    name = data.get('name', 'Untitled Project').strip()
    
    project = Project(name=name, user_id=session['user_id'])
    db.session.add(project)
    db.session.commit()
    
    return jsonify({'id': project.id, 'name': project.name})

@app.route('/api/projects/<int:project_id>', methods=['GET'])
@login_required
def get_project(project_id):
    project = Project.query.get_or_404(project_id)
    if project.user_id != session['user_id']:
        return jsonify({'error': 'Unauthorized'}), 403
    
    return jsonify({
        'id': project.id,
        'name': project.name,
        'content': project.content,
        'settings': project.settings
    })

@app.route('/api/projects/<int:project_id>', methods=['PUT'])
@login_required
def update_project(project_id):
    project = Project.query.get_or_404(project_id)
    if project.user_id != session['user_id']:
        return jsonify({'error': 'Unauthorized'}), 403
    
    data = request.json
    
    if 'name' in data:
        project.name = data['name'].strip()
    
    if 'content' in data:
        user = User.query.get(session['user_id'])
        limits = SUBSCRIPTION_LIMITS[user.subscription_tier]
        
        components = json.loads(data['content'])
        if len(components) > limits['max_components_per_page']:
            return jsonify({'error': f'Component limit exceeded. {user.subscription_tier.title()} tier allows {limits["max_components_per_page"]} components.'}), 403
        
        project.content = data['content']
    
    if 'settings' in data:
        project.settings = data['settings']
    
    db.session.commit()
    return jsonify({'success': True})

@app.route('/api/projects/<int:project_id>', methods=['DELETE'])
@login_required
def delete_project(project_id):
    project = Project.query.get_or_404(project_id)
    if project.user_id != session['user_id']:
        return jsonify({'error': 'Unauthorized'}), 403
    
    db.session.delete(project)
    db.session.commit()
    return jsonify({'success': True})

@app.route('/api/export/<int:project_id>/<format>')
@login_required
def export_project(project_id, format):
    project = Project.query.get_or_404(project_id)
    if project.user_id != session['user_id']:
        return jsonify({'error': 'Unauthorized'}), 403
    
    user = User.query.get(session['user_id'])
    limits = SUBSCRIPTION_LIMITS[user.subscription_tier]
    
    if format not in limits['export_formats']:
        return jsonify({'error': f'{format.upper()} export requires Pro subscription'}), 403
    
    components = json.loads(project.content)
    settings = json.loads(project.settings)
    
    if format == 'html':
        html = generate_html(components, settings)
        return jsonify({'html': html})
    
    elif format == 'zip':
        # Create a complete package
        memory_file = BytesIO()
        with zipfile.ZipFile(memory_file, 'w', zipfile.ZIP_DEFLATED) as zf:
            # HTML
            html = generate_html(components, settings)
            zf.writestr('index.html', html)
            
            # CSS
            css = generate_css(components, settings)
            zf.writestr('styles.css', css)
            
            # JS
            js = generate_js(components, settings)
            zf.writestr('script.js', js)
            
            # README
            readme = f"""# {project.name}

Created with Website Builder

## Files
- index.html - Main HTML file
- styles.css - Stylesheet
- script.js - JavaScript functionality

## Usage
Open index.html in your browser or deploy to any web hosting service.
"""
            zf.writestr('README.md', readme)
        
        memory_file.seek(0)
        return send_file(
            memory_file,
            mimetype='application/zip',
            as_attachment=True,
            download_name=f'{project.name.replace(" ", "_")}.zip'
        )
    
    elif format == 'react':
        react_code = generate_react(components, settings)
        return jsonify({'code': react_code})
    
    elif format == 'vue':
        vue_code = generate_vue(components, settings)
        return jsonify({'code': vue_code})
    
    return jsonify({'error': 'Invalid format'}), 400

@app.route('/api/upload', methods=['POST'])
@login_required
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400
    
    file = request.files['file']
    
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400
    
    if file and allowed_file(file.filename):
        # Generate unique filename
        ext = file.filename.rsplit('.', 1)[1].lower()
        filename = f"{uuid.uuid4().hex}.{ext}"
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        
        file.save(filepath)
        
        # Return URL path
        file_url = url_for('static', filename=f'uploads/{filename}', _external=False)
        return jsonify({'url': file_url})
    
    return jsonify({'error': 'Invalid file type. Allowed: png, jpg, jpeg, gif, webp, svg'}), 400

@app.route('/api/upgrade', methods=['POST'])
@login_required
def upgrade_subscription():
    # In production, this would integrate with Stripe/payment processor
    user = User.query.get(session['user_id'])
    user.subscription_tier = 'pro'
    session['subscription_tier'] = 'pro'
    db.session.commit()
    return jsonify({'success': True, 'message': 'Upgraded to Pro! (Demo mode - no payment processed)'})

@app.route('/admin/subscription')
@login_required
def admin_subscription():
    return '''
    <!DOCTYPE html>
    <html>
    <head>
        <title>Change Subscription</title>
        <style>
            body { font-family: sans-serif; max-width: 600px; margin: 50px auto; padding: 20px; }
            button { padding: 10px 20px; margin: 10px; font-size: 16px; cursor: pointer; border: none; border-radius: 5px; }
            .free { background: #94a3b8; color: white; }
            .pro { background: #0066cc; color: white; }
            .current { font-weight: bold; color: #0066cc; }
        </style>
    </head>
    <body>
        <h1>Subscription Manager</h1>
        <p>Current Plan: <span class="current">''' + session.get('subscription_tier', 'free').upper() + '''</span></p>
        
        <form method="POST" action="/admin/subscription/change">
            <button type="submit" name="tier" value="free" class="free">Switch to FREE</button>
            <button type="submit" name="tier" value="pro" class="pro">Switch to PRO</button>
        </form>
        
        <p><a href="/dashboard">← Back to Dashboard</a></p>
    </body>
    </html>
    '''

@app.route('/admin/subscription/change', methods=['POST'])
@login_required
def admin_subscription_change():
    tier = request.form.get('tier')
    if tier in ['free', 'pro']:
        user = User.query.get(session['user_id'])
        user.subscription_tier = tier
        session['subscription_tier'] = tier
        db.session.commit()
        return redirect('/dashboard')
    return redirect('/admin/subscription')

# Helper Functions
def generate_html(components, settings):
    """Generate complete HTML from components"""
    html = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{settings.get('title', 'My Website')}</title>
    <style>
{generate_inline_css(components, settings)}
    </style>
</head>
<body>
"""
    
    for component in components:
        html += render_component(component)
    
    html += """
</body>
</html>"""
    return html

def generate_inline_css(components, settings):
    """Generate CSS for components"""
    theme = settings.get('theme', {})
    css = f"""
        * {{
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }}
        
        body {{
            font-family: {theme.get('font', 'system-ui, -apple-system, sans-serif')};
            color: {theme.get('textColor', '#1a1a1a')};
            background: {theme.get('backgroundColor', '#ffffff')};
        }}
        
        .container {{
            max-width: 1200px;
            margin: 0 auto;
            padding: 2rem;
        }}
        
        .section {{
            padding: 4rem 2rem;
        }}
        
        h1 {{ font-size: 3rem; margin-bottom: 1rem; font-weight: 800; }}
        h2 {{ font-size: 2rem; margin-bottom: 1rem; font-weight: 700; }}
        h3 {{ font-size: 1.5rem; margin-bottom: 0.75rem; font-weight: 600; }}
        p {{ font-size: 1.125rem; line-height: 1.6; }}
        
        .button {{
            display: inline-block;
            padding: 0.75rem 2rem;
            background: {theme.get('primaryColor', '#0066cc')};
            color: white;
            text-decoration: none;
            border-radius: 0.5rem;
            font-weight: 600;
            transition: transform 0.2s;
        }}
        
        .button:hover {{
            transform: translateY(-2px);
        }}
        
        img {{
            max-width: 100%;
            height: auto;
        }}
        
        input, textarea {{
            font-family: inherit;
        }}
        
        @media (max-width: 768px) {{
            .container {{
                padding: 1rem;
            }}
            .section {{
                padding: 2rem 1rem;
            }}
            h1 {{ font-size: 2rem; }}
            h2 {{ font-size: 1.5rem; }}
        }}
    """
    return css

def render_component(component):
    """Render individual component to HTML"""
    comp_type = component.get('type')
    data = component.get('data', {})
    
    if comp_type == 'hero':
        bg = 'linear-gradient(135deg, ' + data.get('gradientStart', '#667eea') + ', ' + data.get('gradientEnd', '#764ba2') + ')' if data.get('backgroundType') == 'gradient' else data.get('background', '#f5f5f5')
        text_color = data.get('textColor', '#1a1a1a')
        button_color = data.get('buttonColor', '#0066cc')
        button_text_color = data.get('buttonTextColor', '#ffffff')
        
        return f"""
    <section style="min-height: {data.get('minHeight', '400px')}; display: flex; align-items: center; justify-content: center; text-align: {data.get('textAlign', 'center')}; padding: 4rem 2rem; background: {bg}; color: {text_color};">
        <div style="max-width: 800px;">
            <h1 style="font-size: 3rem; margin-bottom: 1rem;">{data.get('title', 'Welcome')}</h1>
            <p style="font-size: 1.25rem; margin-bottom: 2rem; opacity: 0.8;">{data.get('subtitle', 'Your subtitle here')}</p>
            {f'<a href="{data.get("buttonUrl", "#")}" style="display: inline-block; padding: 0.75rem 2rem; background: {button_color}; color: {button_text_color}; text-decoration: none; border-radius: 0.5rem; font-weight: 600;">{data.get("buttonText", "Learn More")}</a>' if data.get('buttonText') else ''}
        </div>
    </section>
"""
    
    elif comp_type == 'text':
        return f"""
    <section class="section">
        <div class="container">
            <h2>{data.get('heading', 'Heading')}</h2>
            <p>{data.get('content', 'Your content here')}</p>
        </div>
    </section>
"""
    
    elif comp_type == 'image':
        return f"""
    <section class="section">
        <div class="container">
            <img src="{data.get('src', 'https://via.placeholder.com/800x400')}" alt="{data.get('alt', 'Image')}">
        </div>
    </section>
"""
    
    elif comp_type == 'features':
        features_html = ''
        for feature in data.get('features', []):
            features_html += f"""
                <div style="background: white; padding: 2rem; border-radius: 1rem; text-align: center; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                    <div style="font-size: 3rem; margin-bottom: 1rem;">{feature.get('icon', '⭐')}</div>
                    <h3 style="font-size: 1.25rem; margin-bottom: 0.5rem;">{feature.get('title', 'Feature')}</h3>
                    <p style="opacity: 0.7;">{feature.get('description', 'Description')}</p>
                </div>
            """
        
        return f"""
    <section class="section" style="background: #f8fafc;">
        <div class="container">
            <h2 style="text-align: center; margin-bottom: 3rem;">{data.get('heading', 'Our Features')}</h2>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 2rem;">
                {features_html}
            </div>
        </div>
    </section>
"""
    
    elif comp_type == 'cta':
        return f"""
    <section class="section" style="background: linear-gradient(135deg, #0066cc, #00a8ff); color: white; text-align: center; padding: 6rem 2rem;">
        <div class="container">
            <h2 style="font-size: 2.5rem; margin-bottom: 1rem;">{data.get('heading', 'Ready to Get Started?')}</h2>
            <p style="font-size: 1.25rem; margin-bottom: 2rem; opacity: 0.9;">{data.get('subtitle', 'Join us today')}</p>
            <a href="{data.get('buttonUrl', '#')}" style="display: inline-block; padding: 1rem 2.5rem; background: white; color: #0066cc; text-decoration: none; border-radius: 0.5rem; font-weight: 700;">{data.get('buttonText', 'Get Started')}</a>
        </div>
    </section>
"""
    
    elif comp_type == 'gallery':
        images_html = ''
        for img_url in data.get('images', []):
            images_html += f'<img src="{img_url}" style="width: 100%; height: 250px; object-fit: cover; border-radius: 0.5rem;">'
        
        return f"""
    <section class="section">
        <div class="container">
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">
                {images_html}
            </div>
        </div>
    </section>
"""
    
    elif comp_type == 'testimonials':
        testimonials_html = ''
        for testimonial in data.get('testimonials', []):
            stars = '⭐' * testimonial.get('rating', 5)
            testimonials_html += f"""
                <div style="background: white; padding: 2rem; border-radius: 1rem; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                    <div style="margin-bottom: 1rem;">{stars}</div>
                    <p style="font-style: italic; margin-bottom: 1rem;">"{testimonial.get('text', 'Great service!')}"</p>
                    <p style="font-weight: 600;">{testimonial.get('name', 'Customer')}</p>
                    <p style="font-size: 0.875rem; opacity: 0.7;">{testimonial.get('role', 'User')}</p>
                </div>
            """
        
        return f"""
    <section class="section" style="background: #f8fafc;">
        <div class="container">
            <h2 style="text-align: center; margin-bottom: 3rem;">{data.get('heading', 'What Our Customers Say')}</h2>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem;">
                {testimonials_html}
            </div>
        </div>
    </section>
"""

    elif comp_type == 'team':
        members_html = ''
        for member in data.get('members', []):
            members_html += f"""
                <div style="background: white; padding: 2rem; border-radius: 1rem; text-align: center; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                    <img src="{member.get('image', '')}" style="width: 120px; height: 120px; border-radius: 50%; object-fit: cover; margin-bottom: 1rem;">
                    <h3 style="font-size: 1.25rem; margin-bottom: 0.25rem;">{member.get('name', 'Name')}</h3>
                    <p style="color: #0066cc; font-weight: 600; margin-bottom: 0.75rem;">{member.get('role', 'Role')}</p>
                    <p style="opacity: 0.7; font-size: 0.875rem;">{member.get('bio', 'Bio')}</p>
                </div>
            """
        
        return f"""
    <section class="section" style="background: #f8fafc;">
        <div class="container">
            <h2 style="text-align: center; margin-bottom: 3rem;">{data.get('heading', 'Meet Our Team')}</h2>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 2rem; max-width: 1000px; margin: 0 auto;">
                {members_html}
            </div>
        </div>
    </section>
"""
    
    elif comp_type == 'stats':
        stats_html = ''
        for stat in data.get('stats', []):
            stats_html += f"""
                <div>
                    <div style="font-size: 3rem; font-weight: 800; color: #0066cc; margin-bottom: 0.5rem;">{stat.get('number', '0')}</div>
                    <div style="font-size: 1rem; color: #64748b;">{stat.get('label', 'Label')}</div>
                </div>
            """
        
        return f"""
    <section class="section" style="background: {data.get('backgroundColor', '#f8fafc')};">
        <div class="container">
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 3rem; text-align: center; max-width: 1000px; margin: 0 auto;">
                {stats_html}
            </div>
        </div>
    </section>
"""
    
    elif comp_type == 'faq':
        faqs_html = ''
        for faq in data.get('faqs', []):
            faqs_html += f"""
                <div style="background: #f8fafc; padding: 1.5rem; border-radius: 0.75rem; margin-bottom: 1rem;">
                    <h3 style="font-size: 1.125rem; margin-bottom: 0.75rem; color: #0f172a;">{faq.get('question', 'Question?')}</h3>
                    <p style="color: #64748b; line-height: 1.6;">{faq.get('answer', 'Answer')}</p>
                </div>
            """
        
        return f"""
    <section class="section">
        <div class="container">
            <h2 style="text-align: center; margin-bottom: 3rem; max-width: 800px; margin-left: auto; margin-right: auto;">{data.get('heading', 'FAQ')}</h2>
            <div style="max-width: 800px; margin: 0 auto;">
                {faqs_html}
            </div>
        </div>
    </section>
"""
    
    elif comp_type == 'contact':
        return f"""
    <section class="section" style="background: {data.get('backgroundColor', '#ffffff')};">
        <div class="container">
            <h2 style="font-size: 2rem; text-align: center; margin-bottom: 1rem; max-width: 600px; margin-left: auto; margin-right: auto;">{data.get('heading', 'Get In Touch')}</h2>
            <p style="text-align: center; color: #64748b; margin-bottom: 2rem; max-width: 600px; margin-left: auto; margin-right: auto;">{data.get('subtitle', 'Contact us')}</p>
            <form style="display: flex; flex-direction: column; gap: 1rem; max-width: 600px; margin: 0 auto;">
                <input type="text" placeholder="Your Name" style="padding: 0.875rem; border: 2px solid #e2e8f0; border-radius: 0.5rem; font-size: 1rem;">
                <input type="email" placeholder="Your Email" style="padding: 0.875rem; border: 2px solid #e2e8f0; border-radius: 0.5rem; font-size: 1rem;">
                <textarea placeholder="Your Message" rows="5" style="padding: 0.875rem; border: 2px solid #e2e8f0; border-radius: 0.5rem; font-size: 1rem; resize: vertical;"></textarea>
                <button type="submit" style="padding: 1rem; background: #0066cc; color: white; border: none; border-radius: 0.5rem; font-weight: 600; cursor: pointer;">Send Message</button>
            </form>
        </div>
    </section>
"""
    
    elif comp_type == 'newsletter':
        bg = 'linear-gradient(135deg, ' + data.get('gradientStart', '#667eea') + ', ' + data.get('gradientEnd', '#764ba2') + ')' if data.get('backgroundType') == 'gradient' else data.get('backgroundColor', '#0066cc')
        
        return f"""
    <section class="section" style="background: {bg}; color: white;">
        <div class="container">
            <div style="max-width: 600px; margin: 0 auto; text-align: center;">
                <h2 style="font-size: 2rem; margin-bottom: 1rem;">{data.get('heading', 'Subscribe')}</h2>
                <p style="font-size: 1.125rem; margin-bottom: 2rem; opacity: 0.9;">{data.get('subtitle', 'Get updates')}</p>
                <form style="display: flex; gap: 0.75rem;">
                    <input type="email" placeholder="Enter your email" style="flex: 1; padding: 0.875rem; border: none; border-radius: 0.5rem; font-size: 1rem;">
                    <button type="submit" style="padding: 0.875rem 2rem; background: white; color: #0066cc; border: none; border-radius: 0.5rem; font-weight: 600; cursor: pointer; white-space: nowrap;">{data.get('buttonText', 'Subscribe')}</button>
                </form>
            </div>
        </div>
    </section>
"""
    
    elif comp_type == 'logos':
        logos_html = ''
        for logo in data.get('logos', []):
            logos_html += f'<img src="{logo}" style="width: 100%; height: auto; filter: grayscale(100%);">'
        
        return f"""
    <section class="section" style="background: #f8fafc;">
        <div class="container">
            <h2 style="font-size: 1.5rem; text-align: center; margin-bottom: 3rem; color: #64748b; text-transform: uppercase; letter-spacing: 0.1em; font-weight: 600;">{data.get('heading', 'Trusted By')}</h2>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 3rem; align-items: center; opacity: 0.6; max-width: 1000px; margin: 0 auto;">
                {logos_html}
            </div>
        </div>
    </section>
"""
    
    elif comp_type == 'timeline':
        events_html = ''
        for event in data.get('events', []):
            events_html += f"""
                <div style="display: flex; gap: 2rem; margin-bottom: 2rem; position: relative; padding-left: 3rem;">
                    <div style="position: absolute; left: 0; top: 0; width: 3rem; height: 3rem; background: #0066cc; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 0.875rem;">{event.get('year', '2025')}</div>
                    <div style="flex: 1; background: #f8fafc; padding: 1.5rem; border-radius: 0.75rem;">
                        <h3 style="font-size: 1.25rem; margin-bottom: 0.5rem;">{event.get('title', 'Event')}</h3>
                        <p style="color: #64748b;">{event.get('description', 'Description')}</p>
                    </div>
                </div>
            """
        
        return f"""
    <section class="section">
        <div class="container">
            <h2 style="text-align: center; margin-bottom: 3rem; max-width: 800px; margin-left: auto; margin-right: auto;">{data.get('heading', 'Our Journey')}</h2>
            <div style="max-width: 800px; margin: 0 auto;">
                {events_html}
            </div>
        </div>
    </section>
"""
    
    elif comp_type == 'video':
        return f"""
    <section class="section">
        <div class="container">
            <h2 style="font-size: 2rem; text-align: center; margin-bottom: 2rem; max-width: {data.get('maxWidth', '800px')}; margin-left: auto; margin-right: auto;">{data.get('title', 'Watch Our Video')}</h2>
            <div style="max-width: {data.get('maxWidth', '800px')}; margin: 0 auto;">
                <div style="position: relative; width: 100%; aspect-ratio: {data.get('aspectRatio', '16/9')}; background: #000; border-radius: 1rem; overflow: hidden;">
                    <iframe src="{data.get('url', '')}" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: none;" allowfullscreen></iframe>
                </div>
            </div>
        </div>
    </section>
"""
    
    elif comp_type == 'footer':
        columns_html = ''
        for col in data.get('columns', []):
            links_html = ''.join([f'<li style="margin-bottom: 0.5rem;"><a href="#" style="color: #94a3b8; text-decoration: none;">{link}</a></li>' for link in col.get('links', [])])
            columns_html += f"""
                <div>
                    <h4 style="font-size: 1rem; margin-bottom: 1rem; font-weight: 600;">{col.get('title', 'Title')}</h4>
                    <ul style="list-style: none; padding: 0;">
                        {links_html}
                    </ul>
                </div>
            """
        
        return f"""
    <footer style="padding: 4rem 2rem 2rem; background: #0f172a; color: white;">
        <div class="container">
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 2rem; margin-bottom: 3rem; max-width: 1000px; margin-left: auto; margin-right: auto;">
                <div>
                    <h3 style="font-size: 1.5rem; margin-bottom: 0.5rem;">{data.get('companyName', 'Company')}</h3>
                    <p style="color: #94a3b8;">{data.get('tagline', 'Tagline')}</p>
                </div>
                {columns_html}
            </div>
            <div style="border-top: 1px solid #334155; padding-top: 2rem; text-align: center; color: #64748b;">
                {data.get('copyright', '© 2025 Company')}
            </div>
        </div>
    </footer>
"""
    
    elif comp_type == 'navbar':
        links_html = ''.join([f'<a href="#" style="color: #64748b; text-decoration: none; font-weight: 500;">{link}</a>' for link in data.get('links', [])])
        sticky = 'position: sticky; top: 0; z-index: 100;' if data.get('sticky', True) else ''
        
        return f"""
    <nav style="background: {data.get('backgroundColor', '#ffffff')}; padding: 1rem 2rem; border-bottom: 1px solid #e2e8f0; {sticky}">
        <div class="container">
            <div style="display: flex; justify-content: space-between; align-items: center; max-width: 1200px; margin: 0 auto;">
                <div style="font-size: 1.5rem; font-weight: 700;">{data.get('brand', 'Brand')}</div>
                <div style="display: flex; align-items: center; gap: 2rem;">
                    {links_html}
                    <a href="{data.get('ctaUrl', '#')}" style="padding: 0.5rem 1.5rem; background: #0066cc; color: white; text-decoration: none; border-radius: 0.5rem; font-weight: 600;">{data.get('ctaText', 'Get Started')}</a>
                </div>
            </div>
        </div>
    </nav>
"""
    
    elif comp_type == 'pricing':
        plans_html = ''
        for plan in data.get('plans', []):
            features_list = ''.join([f'<li style="padding: 0.5rem 0;">✓ {feature}</li>' for feature in plan.get('features', [])])
            
            plans_html += f"""
                <div style="background: white; padding: 2rem; border-radius: 1rem; box-shadow: 0 4px 6px rgba(0,0,0,0.1); text-align: center;">
                    <h3 style="font-size: 1.5rem; margin-bottom: 1rem;">{plan.get('name', 'Plan')}</h3>
                    <div style="font-size: 2.5rem; font-weight: 800; margin-bottom: 1rem;">${plan.get('price', '0')}<span style="font-size: 1rem; font-weight: normal;">/mo</span></div>
                    <ul style="list-style: none; margin-bottom: 2rem; text-align: left;">
                        {features_list}
                    </ul>
                    <a href="{plan.get('buttonUrl', '#')}" style="display: block; padding: 0.75rem; background: #0066cc; color: white; text-decoration: none; border-radius: 0.5rem; font-weight: 600;">{plan.get('buttonText', 'Choose Plan')}</a>
                </div>
            """
        
        return f"""
    <section class="section">
        <div class="container">
            <h2 style="text-align: center; margin-bottom: 3rem;">{data.get('heading', 'Choose Your Plan')}</h2>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 2rem; max-width: 900px; margin: 0 auto;">
                {plans_html}
            </div>
        </div>
    </section>
"""

    elif comp_type == 'accordion':
        items_html = ''.join([f"""
            <div style="background: white; border: 1px solid #e2e8f0; border-radius: 0.5rem; margin-bottom: 1rem; overflow: hidden;">
                <div style="padding: 1.25rem; font-weight: 600; cursor: pointer; display: flex; justify-content: space-between; align-items: center;">
                    <span>{item['title']}</span>
                    <span style="font-size: 1.5rem;">+</span>
                </div>
                <div style="padding: 0 1.25rem 1.25rem; color: #64748b; line-height: 1.6;">{item['content']}</div>
            </div>
        """ for item in data.get('items', [])])
        
        return f"""
    <section class="section">
        <div class="container" style="max-width: 800px;">
            <h2 style="font-size: 2rem; text-align: center; margin-bottom: 3rem;">{data.get('heading', 'FAQ')}</h2>
            {items_html}
        </div>
    </section>
"""

    elif comp_type == 'tabs':
        tabs_html = ''.join([f"""
            <button style="padding: 1rem 0; border: none; background: none; font-weight: 600; color: {'#0066cc' if i == 0 else '#64748b'}; border-bottom: 3px solid {'#0066cc' if i == 0 else 'transparent'}; cursor: pointer;">{tab['title']}</button>
        """ for i, tab in enumerate(data.get('tabs', []))])
        
        return f"""
    <section class="section">
        <div class="container" style="max-width: 800px;">
            <div style="border-bottom: 2px solid #e2e8f0; margin-bottom: 2rem; display: flex; gap: 2rem;">
                {tabs_html}
            </div>
            <div style="padding: 2rem; background: #f8fafc; border-radius: 0.5rem;">
                {data.get('tabs', [{}])[0].get('content', '')}
            </div>
        </div>
    </section>
"""

    elif comp_type == 'cards':
        cards_html = ''.join([f"""
            <div style="background: white; padding: 2.5rem; border-radius: 1rem; text-align: center; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                <div style="font-size: 3.5rem; margin-bottom: 1rem;">{card['icon']}</div>
                <h3 style="font-size: 1.5rem; margin-bottom: 1rem; font-weight: 700;">{card['title']}</h3>
                <p style="color: #64748b; line-height: 1.6;">{card['description']}</p>
            </div>
        """ for card in data.get('cards', [])])
        
        return f"""
    <section class="section" style="background: #f8fafc;">
        <div class="container">
            <h2 style="font-size: 2rem; text-align: center; margin-bottom: 3rem;">{data.get('heading', 'Our Services')}</h2>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 2rem;">
                {cards_html}
            </div>
        </div>
    </section>
"""

    elif comp_type == 'countdown':
        countdown_id = f"countdown-{hash(str(data))}"
        return f"""
    <section style="padding: 6rem 2rem; background: {data.get('backgroundColor', '#667eea')}; color: {data.get('textColor', '#ffffff')}; text-align: center;">
        <div style="max-width: 800px; margin: 0 auto;">
            <h2 style="font-size: 2.5rem; margin-bottom: 0.5rem; font-weight: 800;">{data.get('heading', 'Coming Soon')}</h2>
            <p style="font-size: 1.25rem; margin-bottom: 3rem; opacity: 0.9;">{data.get('subtitle', 'Stay tuned')}</p>
            <div id="{countdown_id}" style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 2rem; max-width: 600px; margin: 0 auto;">
                <div style="background: rgba(255,255,255,0.1); padding: 2rem 1rem; border-radius: 1rem; backdrop-filter: blur(10px);">
                    <div class="countdown-days" style="font-size: 3rem; font-weight: 800; margin-bottom: 0.5rem;">--</div>
                    <div style="font-size: 0.875rem; opacity: 0.8; text-transform: uppercase;">Days</div>
                </div>
                <div style="background: rgba(255,255,255,0.1); padding: 2rem 1rem; border-radius: 1rem; backdrop-filter: blur(10px);">
                    <div class="countdown-hours" style="font-size: 3rem; font-weight: 800; margin-bottom: 0.5rem;">--</div>
                    <div style="font-size: 0.875rem; opacity: 0.8; text-transform: uppercase;">Hours</div>
                </div>
                <div style="background: rgba(255,255,255,0.1); padding: 2rem 1rem; border-radius: 1rem; backdrop-filter: blur(10px);">
                    <div class="countdown-minutes" style="font-size: 3rem; font-weight: 800; margin-bottom: 0.5rem;">--</div>
                    <div style="font-size: 0.875rem; opacity: 0.8; text-transform: uppercase;">Minutes</div>
                </div>
                <div style="background: rgba(255,255,255,0.1); padding: 2rem 1rem; border-radius: 1rem; backdrop-filter: blur(10px);">
                    <div class="countdown-seconds" style="font-size: 3rem; font-weight: 800; margin-bottom: 0.5rem;">--</div>
                    <div style="font-size: 0.875rem; opacity: 0.8; text-transform: uppercase;">Seconds</div>
                </div>
            </div>
        </div>
    </section>
    <script>
        (function() {{
            const targetDate = new Date('{data.get("targetDate", "2025-12-31")}T{data.get("targetTime", "23:59:59")}').getTime();
            const container = document.getElementById('{countdown_id}');
            
            function updateCountdown() {{
                const now = new Date().getTime();
                const distance = targetDate - now;
                
                if (distance < 0) {{
                    container.querySelector('.countdown-days').textContent = '00';
                    container.querySelector('.countdown-hours').textContent = '00';
                    container.querySelector('.countdown-minutes').textContent = '00';
                    container.querySelector('.countdown-seconds').textContent = '00';
                    return;
                }}
                
                const days = Math.floor(distance / (1000 * 60 * 60 * 24));
                const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((distance % (1000 * 60)) / 1000);
                
                container.querySelector('.countdown-days').textContent = String(days).padStart(2, '0');
                container.querySelector('.countdown-hours').textContent = String(hours).padStart(2, '0');
                container.querySelector('.countdown-minutes').textContent = String(minutes).padStart(2, '0');
                container.querySelector('.countdown-seconds').textContent = String(seconds).padStart(2, '0');
            }}
            
            updateCountdown();
            setInterval(updateCountdown, 1000);
        }})();
    </script>
"""

    elif comp_type == 'quote':
        return f"""
    <section class="section" style="background: {data.get('backgroundColor', '#f8fafc')};">
        <div class="container" style="max-width: 800px; text-align: center;">
            <div style="font-size: 4rem; color: #0066cc; margin-bottom: 1rem;">"</div>
            <p style="font-size: {data.get('quoteSize', '2rem')}; font-style: italic; line-height: 1.6; margin-bottom: 2rem;">{data.get('quote', 'Quote text here')}</p>
            <p style="font-weight: 600; color: #64748b;">— {data.get('author', 'Author')}</p>
        </div>
    </section>
"""

    elif comp_type == 'steps':
        steps_html = ''.join([f"""
            <div style="text-align: center; position: relative;">
                <div style="width: 80px; height: 80px; border-radius: 50%; background: linear-gradient(135deg, #667eea, #764ba2); color: white; display: flex; align-items: center; justify-content: center; font-size: 2rem; font-weight: 800; margin: 0 auto 1.5rem;">{step['number']}</div>
                <h3 style="font-size: 1.25rem; margin-bottom: 0.75rem; font-weight: 700;">{step['title']}</h3>
                <p style="color: #64748b; line-height: 1.6;">{step['description']}</p>
            </div>
        """ for step in data.get('steps', [])])
        
        return f"""
    <section class="section">
        <div class="container">
            <h2 style="font-size: 2rem; text-align: center; margin-bottom: 4rem;">{data.get('heading', 'How It Works')}</h2>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 3rem;">
                {steps_html}
            </div>
        </div>
    </section>
"""

    elif comp_type == 'banner':
        button_html = f'<a href="{data.get("buttonUrl", "#")}" style="padding: 0.5rem 1.5rem; background: white; color: {data.get("backgroundColor", "#0066cc")}; text-decoration: none; border-radius: 0.5rem; font-weight: 600;">{data.get("buttonText", "Learn More")}</a>' if data.get('buttonText') else ''
        dismiss_html = '<button style="background: none; border: none; color: white; cursor: pointer; font-size: 1.5rem; margin-left: auto;">×</button>' if data.get('dismissible') else ''
        
        return f"""
    <div style="padding: 1rem 2rem; background: {data.get('backgroundColor', '#0066cc')}; color: {data.get('textColor', '#ffffff')}; text-align: center; display: flex; align-items: center; justify-content: center; gap: 2rem; flex-wrap: wrap;">
        <p style="font-weight: 600; margin: 0;">{data.get('text', 'Announcement text')}</p>
        {button_html}
        {dismiss_html}
    </div>
"""

    elif comp_type == 'metrics':
        metrics_html = ''.join([f"""
            <div style="text-align: center;">
                <div style="font-size: 3rem; margin-bottom: 0.5rem;">{metric['icon']}</div>
                <div style="font-size: 3rem; font-weight: 800; color: #0066cc; margin-bottom: 0.5rem;">{metric['number']}</div>
                <div style="color: #64748b; font-weight: 500;">{metric['label']}</div>
            </div>
        """ for metric in data.get('metrics', [])])
        
        return f"""
    <section class="section" style="background: {data.get('backgroundColor', '#ffffff')};">
        <div class="container">
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 3rem; text-align: center;">
                {metrics_html}
            </div>
        </div>
    </section>
"""

    elif comp_type == 'portfolio':
        projects_html = ''.join([f"""
            <div style="position: relative; overflow: hidden; border-radius: 1rem; cursor: pointer; aspect-ratio: 4/3;">
                <img src="{project['image']}" style="width: 100%; height: 100%; object-fit: cover;">
                <div style="position: absolute; bottom: 0; left: 0; right: 0; background: linear-gradient(to top, rgba(0,0,0,0.8), transparent); padding: 2rem 1.5rem 1.5rem; color: white;">
                    <div style="font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; opacity: 0.8; margin-bottom: 0.25rem;">{project['category']}</div>
                    <h3 style="font-size: 1.25rem; font-weight: 700;">{project['title']}</h3>
                </div>
            </div>
        """ for project in data.get('projects', [])])
        
        return f"""
    <section class="section" style="background: #f8fafc;">
        <div class="container">
            <h2 style="font-size: 2rem; text-align: center; margin-bottom: 3rem;">{data.get('heading', 'Our Work')}</h2>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem;">
                {projects_html}
            </div>
        </div>
    </section>
"""

    elif comp_type == 'columns':
        columns_html = ''.join([f"""
            <div style="padding: 2rem; background: #f8fafc; border-radius: 0.5rem;">
                <p style="line-height: 1.7; color: #334155;">{col['content']}</p>
            </div>
        """ for col in data.get('columns', [])])
        
        return f"""
    <section class="section" style="background: {data.get('backgroundColor', '#ffffff')};">
        <div class="container">
            <div style="display: grid; grid-template-columns: repeat({data.get('columnCount', 2)}, 1fr); gap: 2rem;">
                {columns_html}
            </div>
        </div>
    </section>
"""

    elif comp_type == 'separator':
        return f"""
    <div style="padding: {data.get('spacing', '3rem')} 2rem;">
        <div class="container">
            <hr style="border: none; border-top: {data.get('thickness', '2px')} {data.get('style', 'solid')} {data.get('color', '#e2e8f0')}; width: {data.get('width', '50%')}; margin: 0 auto;">
        </div>
    </div>
"""

    elif comp_type == 'graph':
        labels = data.get('labels', [])
        datasets = data.get('datasets', [])
        
        if datasets:
            max_value = max([max(ds.get('data', [1])) for ds in datasets]) if datasets else 100
            bars_html = ''.join([f"""
                <div style="flex: 1; display: flex; flex-direction: column; align-items: center; gap: 0.5rem;">
                    <div style="width: 100%; height: {(datasets[0]['data'][i] / max_value * 100) if i < len(datasets[0]['data']) else 0}%; background: {datasets[0].get('color', '#0066cc')}; border-radius: 0.5rem 0.5rem 0 0; min-height: 20px;"></div>
                    <div style="font-size: 0.875rem; font-weight: 600;">{label}</div>
                </div>
            """ for i, label in enumerate(labels)])
            
            legend_html = ''.join([f"""
                <div style="display: flex; align-items: center; gap: 0.5rem;">
                    <div style="width: 20px; height: 20px; background: {ds.get('color', '#0066cc')}; border-radius: 0.25rem;"></div>
                    <span style="font-size: 0.875rem;">{ds.get('label', '')}</span>
                </div>
            """ for ds in datasets]) if data.get('showLegend') else ''
        else:
            bars_html = ''
            legend_html = ''
        
        return f"""
    <section class="section" style="background: #f8fafc;">
        <div class="container" style="max-width: 800px;">
            <h2 style="font-size: 2rem; text-align: center; margin-bottom: 3rem;">{data.get('heading', 'Chart')}</h2>
            <div style="background: white; padding: 2rem; border-radius: 1rem; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                <div style="height: {data.get('height', '400px')}; display: flex; align-items: flex-end; justify-content: space-around; gap: 1rem; padding: 2rem;">
                    {bars_html}
                </div>
                {f'<div style="margin-top: 2rem; display: flex; gap: 2rem; justify-content: center; flex-wrap: wrap;">{legend_html}</div>' if legend_html else ''}
            </div>
        </div>
    </section>
"""
    
    return ''

def generate_css(components, settings):
    """Generate separate CSS file"""
    return generate_inline_css(components, settings)

def generate_js(components, settings):
    """Generate JavaScript file"""
    return """
// Add your custom JavaScript here
console.log('Website loaded successfully!');
"""

def generate_react(components, settings):
    """Generate React component code"""
    return f"""import React from 'react';

function App() {{
  return (
    <div className="app">
      {chr(10).join([f'      <{comp.get("type").title()}Component data={{{comp.get("data")}}} />' for comp in components])}
    </div>
  );
}}

export default App;
"""

def generate_vue(components, settings):
    """Generate Vue component code"""
    return f"""<template>
  <div class="app">
    <!-- Components will be rendered here -->
  </div>
</template>

<script>
export default {{
  name: 'App',
  data() {{
    return {{
      components: {json.dumps(components, indent=6)}
    }}
  }}
}}
</script>
"""

# Initialize database
with app.app_context():
    db.create_all()

if __name__ == '__main__':
    app.run(debug=True, port=5000)

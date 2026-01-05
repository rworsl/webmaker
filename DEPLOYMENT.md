# Deployment Guide

Complete guide for deploying DragMeHome to production.

## 🚀 Pre-Deployment Checklist

- [ ] Change SECRET_KEY to a secure random value
- [ ] Set DEBUG = False
- [ ] Configure production database (PostgreSQL/MySQL)
- [ ] Set up SSL certificate
- [ ] Configure email service (optional)
- [ ] Set up payment processor (Stripe)
- [ ] Configure CDN for static files
- [ ] Set up backup system
- [ ] Configure monitoring/logging

---

## 🔧 Configuration

### 1. Environment Variables

Create a `.env` file:

```bash
# Flask
SECRET_KEY=generate-with-secrets.token_hex(32)
FLASK_ENV=production
FLASK_DEBUG=False

# Database
DATABASE_URI=postgresql://user:password@localhost/DragMeHome

# Email (SendGrid example)
MAIL_SERVER=smtp.sendgrid.net
MAIL_PORT=587
MAIL_USE_TLS=True
MAIL_USERNAME=apikey
MAIL_PASSWORD=your-sendgrid-api-key
MAIL_DEFAULT_SENDER=noreply@yourdomain.com

# Stripe
STRIPE_PUBLIC_KEY=pk_live_xxxxx
STRIPE_SECRET_KEY=sk_live_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx
STRIPE_PRICE_ID=price_xxxxx

# AWS S3 (optional)
AWS_ACCESS_KEY_ID=your-key
AWS_SECRET_ACCESS_KEY=your-secret
S3_BUCKET=DragMeHome-exports
S3_REGION=us-east-1
```

### 2. Update app.py

```python
import os
from dotenv import load_dotenv

load_dotenv()

app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URI')
app.config['DEBUG'] = os.getenv('FLASK_DEBUG', 'False') == 'True'
```

---

## 🗄️ Database Setup

### PostgreSQL (Recommended)

```bash
# Install PostgreSQL
sudo apt-get install postgresql postgresql-contrib

# Create database and user
sudo -u postgres psql
CREATE DATABASE DragMeHome;
CREATE USER DragMeHome_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE DragMeHome TO DragMeHome_user;
\q

# Install Python adapter
pip install psycopg2-binary

# Update DATABASE_URI
DATABASE_URI=postgresql://DragMeHome_user:your_password@localhost/DragMeHome
```

### MySQL Alternative

```bash
# Install MySQL
sudo apt-get install mysql-server

# Create database
mysql -u root -p
CREATE DATABASE DragMeHome CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'DragMeHome_user'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON DragMeHome.* TO 'DragMeHome_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;

# Install Python adapter
pip install mysqlclient

# Update DATABASE_URI
DATABASE_URI=mysql://DragMeHome_user:your_password@localhost/DragMeHome
```

---

## 🌐 Deployment Options

### Option 1: Heroku

```bash
# Install Heroku CLI
curl https://cli-assets.heroku.com/install.sh | sh

# Login
heroku login

# Create app
heroku create DragMeHome-app

# Add PostgreSQL
heroku addons:create heroku-postgresql:hobby-dev

# Set environment variables
heroku config:set SECRET_KEY=your-secret-key
heroku config:set FLASK_ENV=production

# Create Procfile
echo "web: gunicorn app:app" > Procfile

# Deploy
git init
git add .
git commit -m "Initial commit"
git push heroku main

# Run migrations
heroku run python
>>> from app import db
>>> db.create_all()
>>> exit()
```

### Option 2: DigitalOcean App Platform

```bash
# Create account at digitalocean.com

# Install doctl
snap install doctl

# Authenticate
doctl auth init

# Create app.yaml
cat > .do/app.yaml << EOF
name: DragMeHome
services:
- name: web
  github:
    repo: your-username/DragMeHome
    branch: main
  run_command: gunicorn --workers 2 app:app
  envs:
  - key: SECRET_KEY
    value: \${SECRET_KEY}
  http_port: 8080
databases:
- engine: PG
  name: DragMeHome-db
  version: "14"
EOF

# Deploy
doctl apps create --spec .do/app.yaml
```

### Option 3: AWS EC2

```bash
# Launch EC2 instance (Ubuntu 22.04)
# Security Group: Allow HTTP (80), HTTPS (443), SSH (22)

# SSH into instance
ssh -i your-key.pem ubuntu@your-ip

# Update system
sudo apt update && sudo apt upgrade -y

# Install Python and dependencies
sudo apt install python3-pip python3-venv nginx -y

# Clone repository
git clone https://github.com/your-username/DragMeHome.git
cd DragMeHome

# Set up virtual environment
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
pip install gunicorn

# Install PostgreSQL (or use RDS)
sudo apt install postgresql postgresql-contrib
# Configure database as shown above

# Create systemd service
sudo nano /etc/systemd/system/DragMeHome.service
```

`/etc/systemd/system/DragMeHome.service`:
```ini
[Unit]
Description=DragMeHome Website Builder
After=network.target

[Service]
User=ubuntu
WorkingDirectory=/home/ubuntu/DragMeHome
Environment="PATH=/home/ubuntu/DragMeHome/venv/bin"
EnvironmentFile=/home/ubuntu/DragMeHome/.env
ExecStart=/home/ubuntu/DragMeHome/venv/bin/gunicorn --workers 3 --bind 0.0.0.0:8000 app:app

[Install]
WantedBy=multi-user.target
```

```bash
# Start service
sudo systemctl daemon-reload
sudo systemctl start DragMeHome
sudo systemctl enable DragMeHome

# Configure Nginx
sudo nano /etc/nginx/sites-available/DragMeHome
```

`/etc/nginx/sites-available/DragMeHome`:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /static {
        alias /home/ubuntu/DragMeHome/static;
        expires 30d;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/DragMeHome /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# SSL with Let's Encrypt
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

### Option 4: Docker

Create `Dockerfile`:
```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 5000

CMD ["gunicorn", "--bind", "0.0.0.0:5000", "--workers", "3", "app:app"]
```

Create `docker-compose.yml`:
```yaml
version: '3.8'

services:
  web:
    build: .
    ports:
      - "5000:5000"
    environment:
      - SECRET_KEY=${SECRET_KEY}
      - DATABASE_URI=postgresql://DragMeHome:password@db:5432/DragMeHome
    depends_on:
      - db

  db:
    image: postgres:14
    environment:
      - POSTGRES_DB=DragMeHome
      - POSTGRES_USER=DragMeHome
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

Deploy:
```bash
docker-compose up -d
```

---

## 💳 Payment Integration (Stripe)

### Setup

```python
# Install Stripe
pip install stripe

# Add to app.py
import stripe
stripe.api_key = os.getenv('STRIPE_SECRET_KEY')

@app.route('/create-checkout-session', methods=['POST'])
@login_required
def create_checkout_session():
    try:
        checkout_session = stripe.checkout.Session.create(
            payment_method_types=['card'],
            line_items=[{
                'price': os.getenv('STRIPE_PRICE_ID'),
                'quantity': 1,
            }],
            mode='subscription',
            success_url=url_for('upgrade_success', _external=True),
            cancel_url=url_for('pricing', _external=True),
            customer_email=User.query.get(session['user_id']).email,
        )
        return jsonify({'id': checkout_session.id})
    except Exception as e:
        return jsonify(error=str(e)), 403

@app.route('/webhook', methods=['POST'])
def webhook():
    payload = request.data
    sig_header = request.headers.get('Stripe-Signature')
    
    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, os.getenv('STRIPE_WEBHOOK_SECRET')
        )
    except ValueError:
        return 'Invalid payload', 400
    except stripe.error.SignatureVerificationError:
        return 'Invalid signature', 400
    
    if event['type'] == 'checkout.session.completed':
        session = event['data']['object']
        # Update user subscription
        user = User.query.filter_by(email=session['customer_email']).first()
        if user:
            user.subscription_tier = 'pro'
            db.session.commit()
    
    return jsonify(success=True)
```

---

## 📊 Monitoring & Logging

### Sentry (Error Tracking)

```bash
pip install sentry-sdk[flask]
```

```python
import sentry_sdk
from sentry_sdk.integrations.flask import FlaskIntegration

sentry_sdk.init(
    dsn="your-sentry-dsn",
    integrations=[FlaskIntegration()],
    traces_sample_rate=1.0
)
```

### Application Logs

```python
import logging

logging.basicConfig(
    filename='DragMeHome.log',
    level=logging.INFO,
    format='%(asctime)s %(levelname)s: %(message)s'
)

app.logger.info('Application started')
```

---

## 🔒 Security Hardening

### 1. HTTPS Only
```python
from flask_talisman import Talisman

Talisman(app, force_https=True)
```

### 2. Rate Limiting
```bash
pip install flask-limiter
```

```python
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

limiter = Limiter(
    app,
    key_func=get_remote_address,
    default_limits=["200 per day", "50 per hour"]
)
```

### 3. CORS
```bash
pip install flask-cors
```

```python
from flask_cors import CORS

CORS(app, origins=['https://yourdomain.com'])
```

---

## 📦 Backup Strategy

### Database Backups

```bash
# PostgreSQL backup script
#!/bin/bash
BACKUP_DIR="/backups"
DATE=$(date +%Y%m%d_%H%M%S)
pg_dump DragMeHome > "$BACKUP_DIR/DragMeHome_$DATE.sql"

# Keep last 30 days
find $BACKUP_DIR -name "DragMeHome_*.sql" -mtime +30 -delete

# Add to crontab (daily at 2 AM)
0 2 * * * /path/to/backup.sh
```

---

## 🎯 Performance Optimization

### 1. CDN for Static Files
- Use CloudFlare or AWS CloudFront
- Configure in Nginx or application

### 2. Caching
```bash
pip install flask-caching
```

```python
from flask_caching import Cache

cache = Cache(app, config={'CACHE_TYPE': 'simple'})

@app.route('/dashboard')
@cache.cached(timeout=300)
def dashboard():
    # ...
```

### 3. Database Connection Pooling
```python
app.config['SQLALCHEMY_ENGINE_OPTIONS'] = {
    'pool_size': 10,
    'pool_recycle': 3600,
    'pool_pre_ping': True
}
```

---

## ✅ Post-Deployment Checklist

- [ ] Test all user flows
- [ ] Verify payment processing
- [ ] Check email delivery
- [ ] Test exports in all formats
- [ ] Verify SSL certificate
- [ ] Set up monitoring alerts
- [ ] Configure backup jobs
- [ ] Test disaster recovery
- [ ] Update DNS records
- [ ] Set up status page

---

## 🆘 Troubleshooting

### Application won't start
```bash
# Check logs
sudo journalctl -u DragMeHome -n 50

# Check Gunicorn
gunicorn --check-config app:app
```

### Database connection errors
```bash
# Test connection
psql -h localhost -U DragMeHome_user -d DragMeHome

# Check permissions
GRANT ALL PRIVILEGES ON DATABASE DragMeHome TO DragMeHome_user;
```

### 502 Bad Gateway
```bash
# Check if application is running
sudo systemctl status DragMeHome

# Check Nginx config
sudo nginx -t
```

---

## 📞 Support

For deployment issues:
- Check application logs
- Review Nginx/Apache logs
- Monitor database performance
- Check firewall settings

---

**Happy Deploying!** 🚀

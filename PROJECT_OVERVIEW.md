# 🎨 DragMeHome - Professional Website Builder

**A complete, production-ready drag-and-drop website builder with subscription management**

---

## 📦 What's Included

This is a **fully functional, professional website builder** with:

✅ **Drag & Drop Builder** - Intuitive interface for creating websites  
✅ **Subscription System** - Free and Pro tiers with limits  
✅ **User Authentication** - Secure login and registration  
✅ **Project Management** - Create, edit, delete projects  
✅ **Component Library** - 6+ pre-built components  
✅ **Theme Customization** - Colors, fonts, and styling  
✅ **Multiple Export Formats** - HTML, React, Vue, ZIP packages  
✅ **Responsive Design** - Works on all devices  
✅ **Security Features** - Password hashing, session management  
✅ **Professional UI** - Modern, clean design  

---

## 🗂 Project Structure

```
website-builder/
├── 📄 app.py                    Main Flask application (588 lines)
├── 📄 requirements.txt          Python dependencies
├── 📁 static/
│   ├── 📁 css/
│   │   └── style.css           Complete styling (800+ lines)
│   └── 📁 js/
│       ├── builder.js           Drag & drop logic (450+ lines)
│       └── main.js              General functionality
├── 📁 templates/
│   ├── base.html               Base template with nav/footer
│   ├── index.html              Landing page
│   ├── login.html              Login page
│   ├── register.html           Registration page
│   ├── dashboard.html          Project dashboard
│   ├── builder.html            Main builder interface
│   └── pricing.html            Pricing page
├── 📄 README.md                Comprehensive documentation
├── 📄 QUICKSTART.md            Quick start guide
├── 📄 FEATURES.md              Detailed feature list
├── 📄 DEPLOYMENT.md            Production deployment guide
├── 📄 SAMPLE_EXPORT.html       Example output
├── 📄 setup.sh                 Linux/Mac setup script
├── 📄 setup.bat                Windows setup script
└── 📄 .env.example             Environment variables template
```

**Total Lines of Code: ~3,500+**

---

## ⚡ Quick Start

### Automatic Setup (Recommended)

**Linux/Mac:**
```bash
cd website-builder
chmod +x setup.sh
./setup.sh
python app.py
```

**Windows:**
```bash
cd website-builder
setup.bat
python app.py
```

### Manual Setup

```bash
pip install -r requirements.txt
python app.py
```

Then open: **http://localhost:5000**

---

## 🎯 Key Features

### 1. Drag & Drop Builder
- Drag components from sidebar to canvas
- Click to edit properties
- Reorder with arrow buttons
- Real-time preview

### 2. Component Library
**Basic (Free & Pro):**
- Hero Section - Large headers with CTA
- Text Block - Headings and paragraphs
- Image - Responsive images
- Features Grid - Icon cards
- Call to Action - Conversion sections
- Gallery - Image grids

**Premium (Pro Only):**
- Testimonials - Customer reviews
- Pricing Table - Plans comparison

### 3. Subscription Tiers

| Feature | Free | Pro |
|---------|------|-----|
| Projects | 3 | Unlimited |
| Components/Page | 10 | Unlimited |
| HTML Export | ✅ | ✅ |
| React Export | ❌ | ✅ |
| Vue Export | ❌ | ✅ |
| ZIP Packages | ❌ | ✅ |
| Premium Components | ❌ | ✅ |

### 4. Export Formats

**HTML** - Single file, ready to deploy  
**React** - JSX component code  
**Vue** - SFC component  
**ZIP** - Complete package (HTML + CSS + JS + README)  

### 5. Security
- Werkzeug password hashing
- Session-based authentication
- SQLAlchemy ORM (prevents SQL injection)
- Input validation
- Secure file exports

---

## 🎨 Design Philosophy

**Professional & Distinctive**
- Custom color scheme (no generic purple gradients)
- Smooth animations and transitions
- Clean, modern typography
- Intuitive three-panel layout
- Responsive on all devices

**User Experience**
- Auto-save functionality
- Visual feedback for all actions
- Context-aware properties panel
- Real-time preview
- One-click exports

---

## 📊 Technical Highlights

### Backend (Flask)
- **MVC Architecture** - Clean separation of concerns
- **SQLAlchemy ORM** - Type-safe database queries
- **RESTful API** - Well-structured endpoints
- **Session Management** - Secure user sessions
- **Error Handling** - Comprehensive error messages

### Frontend (Vanilla JS)
- **No Framework Overhead** - Fast and lightweight
- **Native Drag & Drop API** - Smooth interactions
- **Modular Code** - Easy to extend
- **Responsive CSS** - Mobile-first design
- **Progressive Enhancement** - Works everywhere

### Database Schema
```sql
User
  - id, username, email, password_hash
  - subscription_tier, created_at
  - projects (relationship)

Project
  - id, name, user_id
  - content (JSON), settings (JSON)
  - created_at, updated_at
```

---

## 🚀 Production Ready

### Included
✅ Environment variable support  
✅ Database configuration examples  
✅ Security best practices  
✅ Deployment documentation  
✅ Setup scripts  
✅ Error handling  
✅ Input validation  

### Deployment Options Documented
- Heroku (quick deploy)
- DigitalOcean App Platform
- AWS EC2 (full control)
- Docker (containerized)

### Ready for Integration
- Stripe payments (code examples provided)
- Email services (configuration ready)
- CDN for static files
- PostgreSQL/MySQL databases

---

## 📚 Documentation

| File | Purpose |
|------|---------|
| README.md | Complete project documentation |
| QUICKSTART.md | Get running in 3 minutes |
| FEATURES.md | Detailed feature breakdown |
| DEPLOYMENT.md | Production deployment guide |
| SAMPLE_EXPORT.html | Example output quality |

---

## 🔧 Customization & Extension

### Adding Components
1. Edit `static/js/builder.js`
2. Add template to `componentTemplates`
3. Add rendering in `renderComponent()`
4. Add UI element in `templates/builder.html`

### Changing Themes
- Modify CSS variables in `static/css/style.css`
- Update default theme in `static/js/builder.js`

### Adding Export Formats
- Add generator function in `app.py`
- Update export modal in `templates/builder.html`

---

## 💡 Use Cases

### For Freelancers
- Build client websites quickly
- Export as HTML for hosting
- Professional results

### For Agencies
- Rapid prototyping
- Client presentations
- Template generation

### For Developers
- Learn Flask architecture
- Study drag & drop implementation
- Base for SaaS products

### For Businesses
- Landing pages
- Marketing sites
- Product showcases

---

## 🎯 Next Steps

1. **Run the app**: Follow Quick Start guide
2. **Explore features**: Create a test account
3. **Build a website**: Try the drag & drop builder
4. **Export**: Download in different formats
5. **Customize**: Modify components and themes
6. **Deploy**: Use deployment guide for production

---

## 📈 Statistics

- **Total Code**: ~3,500+ lines
- **Files**: 20+ files
- **Components**: 8 built-in components
- **Export Formats**: 4 formats
- **Documentation**: 6 comprehensive guides
- **Features**: 30+ features

---

## 🌟 Highlights

**What Makes This Special:**

1. **Complete Solution** - Not just code, but full documentation and setup scripts
2. **Production Ready** - Security, validation, error handling included
3. **Extensible** - Easy to add components and features
4. **Professional Design** - Modern UI following best practices
5. **Well Documented** - README, guides, comments throughout
6. **Multiple Export Options** - HTML, React, Vue, ZIP
7. **Subscription Management** - Free and Pro tiers built-in
8. **Real-time Features** - Auto-save, live preview

---

## 🤝 Support & Resources

### Getting Help
- Read QUICKSTART.md for immediate setup
- Check FEATURES.md for what's included
- See DEPLOYMENT.md for production
- Review code comments for understanding

### Learning Resources
- Study `app.py` for Flask patterns
- Explore `builder.js` for drag & drop
- Review CSS for design patterns

---

## 📜 License

Free to use, modify, and deploy for personal or commercial projects.

---

## 🎉 You're All Set!

You now have a complete, professional website builder ready to:
- Run locally for development
- Deploy to production
- Customize and extend
- Use for client projects
- Learn from and build upon

**Start building amazing websites!** 🚀

---

Built with ❤️ using Flask, JavaScript, and modern web technologies.

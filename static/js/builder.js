// Builder State
let components = [];
let selectedComponent = null;
let settings = {
    title: 'My Website',
    theme: {
        primaryColor: '#0066cc',
        backgroundColor: '#ffffff',
        textColor: '#1a1a1a',
        font: 'system-ui, -apple-system, sans-serif'
    }
};

// DOM Elements
const canvas = document.getElementById('canvas');
const propertiesPanel = document.getElementById('propertiesPanel');
const themePanel = document.getElementById('themePanel');
const projectTitle = document.getElementById('projectTitle');
const saveStatus = document.getElementById('saveStatus');

// Component Templates
const componentTemplates = {
    hero: {
        type: 'hero',
        data: {
            title: 'Welcome to Your Website',
            subtitle: 'Build amazing things with drag and drop',
            buttonText: 'Get Started',
            buttonUrl: '#',
            background: '#f5f5f5',
            backgroundType: 'solid',
            gradientStart: '#667eea',
            gradientEnd: '#764ba2',
            textAlign: 'center',
            minHeight: '400px',
            textColor: '#1a1a1a',
            buttonColor: '#0066cc',
            buttonTextColor: '#ffffff'
        }
    },
    text: {
        type: 'text',
        data: {
            heading: 'About Us',
            content: 'Tell your story here. Add your content and customize it to match your brand.',
            headingSize: '2rem',
            textAlign: 'left',
            backgroundColor: '#ffffff'
        }
    },
    image: {
        type: 'image',
        data: {
            src: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800',
            alt: 'Featured Image',
            width: '100%',
            maxWidth: '1000px',
            borderRadius: '1rem',
            alignment: 'center'
        }
    },
    features: {
        type: 'features',
        data: {
            heading: 'Our Features',
            backgroundColor: '#f8fafc',
            features: [
                { icon: '⚡', title: 'Fast', description: 'Lightning quick performance' },
                { icon: '🔒', title: 'Secure', description: 'Your data is safe' },
                { icon: '📱', title: 'Responsive', description: 'Works on all devices' }
            ]
        }
    },
    cta: {
        type: 'cta',
        data: {
            heading: 'Ready to Get Started?',
            subtitle: 'Join thousands of users today',
            buttonText: 'Sign Up Now',
            buttonUrl: '#',
            backgroundType: 'gradient',
            backgroundColor: '#0066cc',
            gradientStart: '#0066cc',
            gradientEnd: '#00a8ff',
            textColor: '#ffffff',
            buttonColor: '#ffffff',
            buttonTextColor: '#0066cc'
        }
    },
    gallery: {
        type: 'gallery',
        data: {
            images: [
                'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400',
                'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400',
                'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=400',
                'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400'
            ],
            columns: 'auto-fit',
            gap: '1rem',
            imageHeight: '250px'
        }
    },
    team: {
        type: 'team',
        data: {
            heading: 'Meet Our Team',
            members: [
                { name: 'John Doe', role: 'CEO & Founder', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400', bio: 'Leading the company vision' },
                { name: 'Jane Smith', role: 'CTO', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400', bio: 'Technology expert' },
                { name: 'Mike Johnson', role: 'Designer', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400', bio: 'Creative director' }
            ]
        }
    },
    stats: {
        type: 'stats',
        data: {
            backgroundColor: '#f8fafc',
            stats: [
                { number: '10K+', label: 'Happy Customers' },
                { number: '50+', label: 'Team Members' },
                { number: '99%', label: 'Satisfaction Rate' },
                { number: '24/7', label: 'Support' }
            ]
        }
    },
    faq: {
        type: 'faq',
        data: {
            heading: 'Frequently Asked Questions',
            faqs: [
                { question: 'How does it work?', answer: 'Our platform is easy to use and intuitive. Simply sign up and start building.' },
                { question: 'What are the pricing plans?', answer: 'We offer flexible pricing plans to suit every need and budget.' },
                { question: 'Is there a free trial?', answer: 'Yes! We offer a 14-day free trial with no credit card required.' }
            ]
        }
    },
    contact: {
        type: 'contact',
        data: {
            heading: 'Get In Touch',
            subtitle: 'We\'d love to hear from you',
            backgroundColor: '#ffffff'
        }
    },
    newsletter: {
        type: 'newsletter',
        data: {
            heading: 'Subscribe to Our Newsletter',
            subtitle: 'Get the latest updates and news',
            buttonText: 'Subscribe',
            backgroundType: 'gradient',
            gradientStart: '#667eea',
            gradientEnd: '#764ba2'
        }
    },
    logos: {
        type: 'logos',
        data: {
            heading: 'Trusted By Leading Companies',
            logos: [
                'https://via.placeholder.com/150x60?text=Company+1',
                'https://via.placeholder.com/150x60?text=Company+2',
                'https://via.placeholder.com/150x60?text=Company+3',
                'https://via.placeholder.com/150x60?text=Company+4'
            ]
        }
    },
    timeline: {
        type: 'timeline',
        data: {
            heading: 'Our Journey',
            events: [
                { year: '2020', title: 'Company Founded', description: 'Started our journey' },
                { year: '2021', title: 'First Product', description: 'Launched our flagship product' },
                { year: '2022', title: '10K Users', description: 'Reached major milestone' },
                { year: '2023', title: 'Global Expansion', description: 'Expanded to 50 countries' }
            ]
        }
    },
    video: {
        type: 'video',
        data: {
            url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            title: 'Watch Our Video',
            aspectRatio: '16/9',
            maxWidth: '800px'
        }
    },
    footer: {
        type: 'footer',
        data: {
            companyName: 'Your Company',
            tagline: 'Building amazing products',
            columns: [
                { title: 'Product', links: ['Features', 'Pricing', 'Security'] },
                { title: 'Company', links: ['About', 'Blog', 'Careers'] },
                { title: 'Support', links: ['Help Center', 'Contact', 'Status'] }
            ],
            copyright: '© 2025 Your Company. All rights reserved.'
        }
    },
    navbar: {
        type: 'navbar',
        data: {
            brand: 'Your Brand',
            links: ['Home', 'About', 'Services', 'Contact'],
            ctaText: 'Get Started',
            ctaUrl: '#',
            backgroundColor: '#ffffff',
            sticky: true
        }
    },
    blog: {
        type: 'blog',
        data: {
            heading: 'Latest Articles',
            posts: [
                {
                    image: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=400',
                    title: 'Getting Started with Web Development',
                    excerpt: 'Learn the basics of modern web development and build your first website.',
                    date: 'Jan 15, 2025',
                    readTime: '5 min read',
                    link: '#'
                },
                {
                    image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400',
                    title: 'Design Tips for Beginners',
                    excerpt: 'Master the fundamentals of good design with these simple tips.',
                    date: 'Jan 10, 2025',
                    readTime: '4 min read',
                    link: '#'
                },
                {
                    image: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=400',
                    title: 'Building Responsive Layouts',
                    excerpt: 'Create websites that look great on any device with responsive design.',
                    date: 'Jan 5, 2025',
                    readTime: '6 min read',
                    link: '#'
                }
            ]
        }
    },
    imagetext: {
        type: 'imagetext',
        data: {
            image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600',
            heading: 'Our Story',
            text: 'We are passionate about creating amazing experiences. Our team works tirelessly to deliver the best products and services to our customers.',
            buttonText: 'Learn More',
            buttonUrl: '#',
            imagePosition: 'left',
            backgroundColor: '#ffffff',
            textColor: '#1a1a1a',
            buttonColor: '#0066cc',
            buttonTextColor: '#ffffff'
        }
    },
    callout: {
        type: 'callout',
        data: {
            icon: '💡',
            heading: 'Pro Tip',
            text: 'This is important information that you should pay attention to. Use callouts to highlight key points.',
            backgroundColor: '#fef3c7',
            borderColor: '#f59e0b'
        }
    },
    progress: {
        type: 'progress',
        data: {
            heading: 'Our Skills',
            skills: [
                { name: 'Web Development', percentage: 90 },
                { name: 'UI/UX Design', percentage: 85 },
                { name: 'Marketing', percentage: 75 },
                { name: 'Project Management', percentage: 80 }
            ]
        }
    },
    social: {
        type: 'social',
        data: {
            heading: 'Follow Us',
            links: [
                { platform: 'Facebook', url: 'https://facebook.com', icon: 'f' },
                { platform: 'Twitter', url: 'https://twitter.com', icon: '𝕏' },
                { platform: 'Instagram', url: 'https://instagram.com', icon: '📷' },
                { platform: 'LinkedIn', url: 'https://linkedin.com', icon: 'in' },
                { platform: 'YouTube', url: 'https://youtube.com', icon: '▶' }
            ]
        }
    },
    map: {
        type: 'map',
        data: {
            heading: 'Visit Us',
            address: '123 Main Street, City, State 12345',
            embedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3024.2219901290355!2d-74.00369368400567!3d40.71312937933185!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25a23e28c1191%3A0x49f75d3281df052a!2sBroadway%2C%20New%20York%2C%20NY%2C%20USA!5e0!3m2!1sen!2s!4v1234567890'
        }
    },
    testimonials: {
        type: 'testimonials',
        data: {
            heading: 'What Our Customers Say',
            testimonials: [
                { rating: 5, text: 'Absolutely amazing service! Highly recommend.', name: 'Sarah Johnson', role: 'CEO, TechCorp' },
                { rating: 5, text: 'Great experience from start to finish.', name: 'Mike Davis', role: 'Founder, StartupXYZ' },
                { rating: 5, text: 'Professional and reliable. Will use again!', name: 'Emily Chen', role: 'Marketing Director' }
            ]
        }
    },
    pricing: {
        type: 'pricing',
        data: {
            heading: 'Choose Your Plan',
            plans: [
                { 
                    name: 'Basic', 
                    price: '9', 
                    features: ['Feature 1', 'Feature 2', 'Feature 3'],
                    buttonText: 'Get Started',
                    buttonUrl: '#'
                },
                { 
                    name: 'Pro', 
                    price: '29', 
                    features: ['All Basic features', 'Feature 4', 'Feature 5', 'Priority Support'],
                    buttonText: 'Get Started',
                    buttonUrl: '#'
                },
                { 
                    name: 'Enterprise', 
                    price: '99', 
                    features: ['All Pro features', 'Custom integrations', 'Dedicated support', 'SLA'],
                    buttonText: 'Contact Us',
                    buttonUrl: '#'
                }
            ]
        }
    },
    accordion: {
        type: 'accordion',
        data: {
            heading: 'Frequently Asked Questions',
            items: [
                { title: 'What is your return policy?', content: 'We offer a 30-day money-back guarantee on all purchases.' },
                { title: 'How long does shipping take?', content: 'Standard shipping takes 5-7 business days. Express shipping is 2-3 days.' },
                { title: 'Do you ship internationally?', content: 'Yes, we ship to over 100 countries worldwide.' }
            ]
        }
    },
    tabs: {
        type: 'tabs',
        data: {
            tabs: [
                { title: 'Features', content: 'Discover all the amazing features our product offers.' },
                { title: 'Pricing', content: 'Simple and transparent pricing for everyone.' },
                { title: 'Support', content: 'Get help when you need it with our 24/7 support team.' }
            ]
        }
    },
    cards: {
        type: 'cards',
        data: {
            heading: 'Our Services',
            cards: [
                { icon: '🎨', title: 'Design', description: 'Beautiful, modern designs that convert.' },
                { icon: '💻', title: 'Development', description: 'Clean, scalable code built to last.' },
                { icon: '🚀', title: 'Marketing', description: 'Strategies that drive real results.' }
            ]
        }
    },
    countdown: {
        type: 'countdown',
        data: {
            heading: 'Product Launch',
            subtitle: 'Coming Soon',
            targetDate: '2025-12-31',
            targetTime: '23:59:59',
            backgroundColor: '#667eea',
            textColor: '#ffffff'
        }
    },
    quote: {
        type: 'quote',
        data: {
            quote: 'The best way to predict the future is to create it.',
            author: 'Peter Drucker',
            backgroundColor: '#f8fafc',
            quoteSize: '2rem'
        }
    },
    steps: {
        type: 'steps',
        data: {
            heading: 'How It Works',
            steps: [
                { number: '1', title: 'Sign Up', description: 'Create your free account in seconds' },
                { number: '2', title: 'Customize', description: 'Choose your design and settings' },
                { number: '3', title: 'Launch', description: 'Go live with your new website' }
            ]
        }
    },
    banner: {
        type: 'banner',
        data: {
            text: 'Special Offer: Get 50% off for a limited time!',
            buttonText: 'Learn More',
            buttonUrl: '#',
            backgroundColor: '#0066cc',
            textColor: '#ffffff',
            dismissible: true
        }
    },
    metrics: {
        type: 'metrics',
        data: {
            metrics: [
                { number: '99%', label: 'Customer Satisfaction', icon: '😊' },
                { number: '10K+', label: 'Active Users', icon: '👥' },
                { number: '50M+', label: 'Downloads', icon: '📥' },
                { number: '24/7', label: 'Support', icon: '🛟' }
            ],
            backgroundColor: '#ffffff'
        }
    },
    portfolio: {
        type: 'portfolio',
        data: {
            heading: 'Our Work',
            projects: [
                { image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500', title: 'Project Alpha', category: 'Web Design' },
                { image: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=500', title: 'Project Beta', category: 'Branding' },
                { image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500', title: 'Project Gamma', category: 'Development' },
                { image: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=500', title: 'Project Delta', category: 'Marketing' }
            ]
        }
    },
    columns: {
        type: 'columns',
        data: {
            columnCount: 2,
            columns: [
                { content: 'This is the first column content. You can add any text here.' },
                { content: 'This is the second column content. Great for side-by-side comparisons.' }
            ],
            backgroundColor: '#ffffff'
        }
    },
    separator: {
        type: 'separator',
        data: {
            style: 'solid',
            width: '50%',
            color: '#e2e8f0',
            thickness: '2px',
            spacing: '3rem'
        }
    },
    graph: {
        type: 'graph',
        data: {
            heading: 'Sales Performance',
            chartType: 'bar',
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [
                {
                    label: 'Sales 2024',
                    data: [65, 59, 80, 81, 56, 55],
                    color: '#0066cc'
                },
                {
                    label: 'Sales 2023',
                    data: [45, 49, 60, 71, 46, 45],
                    color: '#764ba2'
                }
            ],
            showLegend: true,
            height: '400px'
        }
    },
};

// Load Project
async function loadProject() {
    try {
        const response = await fetch(`/api/projects/${projectId}`);
        if (response.ok) {
            const data = await response.json();
            components = JSON.parse(data.content || '[]');
            settings = JSON.parse(data.settings || JSON.stringify(settings));
            applyTheme();
            renderCanvas();
        }
    } catch (error) {
        console.error('Failed to load project:', error);
    }
}

// Save Project
let saveTimeout;
async function saveProject() {
    clearTimeout(saveTimeout);
    saveTimeout = setTimeout(async () => {
        try {
            saveStatus.textContent = 'Saving...';
            saveStatus.style.color = '#f59e0b';
            
            const response = await fetch(`/api/projects/${projectId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: projectTitle.value,
                    content: JSON.stringify(components),
                    settings: JSON.stringify(settings)
                })
            });
            
            if (response.ok) {
                saveStatus.textContent = 'Saved';
                saveStatus.style.color = '#10b981';
            } else {
                const data = await response.json();
                saveStatus.textContent = 'Error';
                saveStatus.style.color = '#ef4444';
                if (data.error) alert(data.error);
            }
        } catch (error) {
            saveStatus.textContent = 'Error';
            saveStatus.style.color = '#ef4444';
        }
    }, 1000);
}

// Setup Drag and Drop
// Setup Drag and Drop
function setupDragAndDrop() {
    console.log('Setting up drag and drop...');
    
    // Re-attach dragstart to all component items
    const componentItems = document.querySelectorAll('.component-item');
    
    console.log('Found component items:', componentItems.length);
    
    componentItems.forEach((item, index) => {
        const type = item.dataset.type;
        console.log(`Component ${index}: ${type}`);
        
        // Remove old listeners by cloning
        const newItem = item.cloneNode(true);
        item.parentNode.replaceChild(newItem, item);
        
        newItem.addEventListener('dragstart', (e) => {
            e.dataTransfer.effectAllowed = 'copy';
            e.dataTransfer.setData('componentType', newItem.dataset.type);
            console.log('Dragging:', newItem.dataset.type);
        });
        
        // Add visual feedback
        newItem.addEventListener('dragend', (e) => {
            console.log('Drag ended');
        });
    });
    
    // Canvas drop zone
    canvas.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy';
        canvas.style.border = '3px dashed #0066ff';
    });
    
    canvas.addEventListener('dragleave', (e) => {
        // Only remove border if we're actually leaving the canvas
        if (e.target === canvas) {
            canvas.style.border = '';
        }
    });
    
    canvas.addEventListener('drop', (e) => {
        e.preventDefault();
        canvas.style.border = '';
        
        const type = e.dataTransfer.getData('componentType');
        console.log('Dropped:', type);
        
        if (type && componentTemplates[type]) {
            console.log('Adding component:', type);
            addComponent(type);
        } else {
            console.error('Component template not found for:', type);
            console.log('Available templates:', Object.keys(componentTemplates));
        }
    });
}

// Add Component
function addComponent(type) {
    console.log('addComponent called with type:', type);
    console.log('componentTemplates has this type?', !!componentTemplates[type]);
    
    if (components.length >= limits.max_components_per_page) {
        alert(`Component limit reached. Your plan allows ${limits.max_components_per_page} components per page.`);
        return;
    }
    
    if (!componentTemplates[type]) {
        console.error('Template not found for:', type);
        console.log('Available templates:', Object.keys(componentTemplates));
        alert('Component template not found: ' + type);
        return;
    }
    
    const component = {
        id: Date.now(),
        ...JSON.parse(JSON.stringify(componentTemplates[type]))
    };
    
    console.log('Created component:', component);
    
    components.push(component);
    renderCanvas();
    saveProject();
}

// Move Component
function moveComponent(id, direction) {
    const index = components.findIndex(c => c.id === id);
    if (index === -1) return;
    
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= components.length) return;
    
    [components[index], components[newIndex]] = [components[newIndex], components[index]];
    renderCanvas();
    saveProject();
}

// Remove Component
function removeComponent(id) {
    if (!confirm('Delete this component?')) return;
    
    components = components.filter(c => c.id !== id);
    if (selectedComponent?.id === id) {
        selectedComponent = null;
        hidePropertiesPanel();
    }
    renderCanvas();
    saveProject();
}

// Render Canvas
function renderCanvas() {
    console.log('=== renderCanvas called ===');
    console.log('Number of components:', components.length);
    
    if (components.length === 0) {
        canvas.innerHTML = `
            <div class="canvas-placeholder" style="min-height: 400px; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 4rem 2rem; color: var(--text-tertiary);">
                <div class="placeholder-icon" style="font-size: 4rem; margin-bottom: 1rem;">👆</div>
                <p>Drag components here to start building</p>
            </div>
        `;
        return;
    }
    
    // Clear canvas and add components
    canvas.innerHTML = '';
    
    components.forEach((component, index) => {
        console.log(`Rendering component ${index}:`, component.type);
        const componentEl = document.createElement('div');
        componentEl.innerHTML = renderComponent(component);
        canvas.appendChild(componentEl.firstElementChild);
    });
    
    // Attach event listeners after rendering
    document.querySelectorAll('.canvas-component').forEach(el => {
        const id = parseInt(el.dataset.id);
        
        el.addEventListener('click', (e) => {
            if (e.target.closest('.component-controls')) return;
            selectComponent(id);
        });
        
        // Show controls on hover
        el.addEventListener('mouseenter', function() {
            const controls = this.querySelector('.component-controls');
            if (controls) {
                controls.style.opacity = '1';
            }
        });
        
        el.addEventListener('mouseleave', function() {
            const controls = this.querySelector('.component-controls');
            const isSelected = this.classList.contains('selected');
            if (controls && !isSelected) {
                controls.style.opacity = '0';
            }
        });
    });
    
    console.log('=== renderCanvas complete ===');
}

// Render Component
// Render Component
function renderComponent(component) {
    const isSelected = selectedComponent?.id === component.id;
    let content = '';
    
    switch (component.type) {
        case 'hero':
            const heroBackground = component.data.backgroundType === 'gradient' 
                ? `linear-gradient(135deg, ${component.data.gradientStart}, ${component.data.gradientEnd})`
                : component.data.background;
            
            content = `
                <div style="min-height: ${component.data.minHeight}; display: flex; align-items: center; justify-content: center; text-align: ${component.data.textAlign}; padding: 4rem 2rem; background: ${heroBackground}; color: ${component.data.textColor || '#1a1a1a'};">
                    <div style="max-width: 800px;">
                        <h1 style="font-size: 3rem; margin-bottom: 1rem;">${component.data.title}</h1>
                        <p style="font-size: 1.25rem; margin-bottom: 2rem; opacity: 0.8;">${component.data.subtitle}</p>
                        ${component.data.buttonText ? `<a href="${component.data.buttonUrl}" style="display: inline-block; padding: 0.75rem 2rem; background: ${component.data.buttonColor || '#0066cc'}; color: ${component.data.buttonTextColor || '#ffffff'}; text-decoration: none; border-radius: 0.5rem; font-weight: 600;">${component.data.buttonText}</a>` : ''}
                    </div>
                </div>
            `;
            break;
            
        case 'text':
            content = `
                <div style="padding: 4rem 2rem; text-align: ${component.data.textAlign}; background: ${component.data.backgroundColor};">
                    <div style="max-width: 800px; margin: 0 auto;">
                        <h2 style="font-size: ${component.data.headingSize}; margin-bottom: 1rem;">${component.data.heading}</h2>
                        <p style="font-size: 1.125rem; line-height: 1.7; color: #64748b;">${component.data.content}</p>
                    </div>
                </div>
            `;
            break;
            
        case 'image':
            const alignment = component.data.alignment === 'center' ? 'margin: 0 auto;' : 
                            component.data.alignment === 'right' ? 'margin-left: auto;' : '';
            content = `
                <div style="padding: 4rem 2rem;">
                    <img src="${component.data.src}" alt="${component.data.alt}" style="width: ${component.data.width}; max-width: ${component.data.maxWidth}; border-radius: ${component.data.borderRadius}; display: block; ${alignment}">
                </div>
            `;
            break;
            
        case 'features':
            content = `
                <div style="padding: 4rem 2rem; background: ${component.data.backgroundColor};">
                    <div style="max-width: 1000px; margin: 0 auto;">
                        <h2 style="font-size: 2rem; text-align: center; margin-bottom: 3rem;">${component.data.heading}</h2>
                        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 2rem;">
                            ${component.data.features.map(f => `
                                <div style="text-align: center; padding: 2rem;">
                                    <div style="font-size: 3rem; margin-bottom: 1rem;">${f.icon}</div>
                                    <h3 style="font-size: 1.25rem; margin-bottom: 0.5rem;">${f.title}</h3>
                                    <p style="color: #64748b;">${f.description}</p>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            `;
            break;
            
        case 'cta':
            const ctaBackground = component.data.backgroundType === 'gradient'
                ? `linear-gradient(135deg, ${component.data.gradientStart}, ${component.data.gradientEnd})`
                : component.data.backgroundColor;
            
            content = `
                <div style="padding: 6rem 2rem; background: ${ctaBackground}; color: ${component.data.textColor || '#ffffff'}; text-align: center;">
                    <div style="max-width: 800px; margin: 0 auto;">
                        <h2 style="font-size: 2.5rem; margin-bottom: 1rem;">${component.data.heading}</h2>
                        <p style="font-size: 1.25rem; margin-bottom: 2rem; opacity: 0.9;">${component.data.subtitle}</p>
                        <a href="${component.data.buttonUrl}" style="display: inline-block; padding: 1rem 2.5rem; background: ${component.data.buttonColor || '#ffffff'}; color: ${component.data.buttonTextColor || component.data.gradientStart || '#0066cc'}; text-decoration: none; border-radius: 0.5rem; font-weight: 700;">${component.data.buttonText}</a>
                    </div>
                </div>
            `;
            break;
            
        case 'gallery':
            const columns = component.data.columns === 'auto-fit' 
                ? 'repeat(auto-fit, minmax(250px, 1fr))' 
                : `repeat(${component.data.columns}, 1fr)`;
            
            content = `
                <div style="padding: 4rem 2rem;">
                    <div style="max-width: 1200px; margin: 0 auto;">
                        <div style="display: grid; grid-template-columns: ${columns}; gap: ${component.data.gap};">
                            ${component.data.images.map(img => `
                                <img src="${img}" style="width: 100%; height: ${component.data.imageHeight}; object-fit: cover; border-radius: 0.5rem;">
                            `).join('')}
                        </div>
                    </div>
                </div>
            `;
            break;
            
        case 'team':
            content = `
                <div style="padding: 4rem 2rem;">
                    <div style="max-width: 1000px; margin: 0 auto;">
                        <h2 style="font-size: 2rem; text-align: center; margin-bottom: 3rem;">${component.data.heading}</h2>
                        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 2rem;">
                            ${component.data.members.map(m => `
                                <div style="text-align: center;">
                                    <img src="${m.image}" style="width: 150px; height: 150px; border-radius: 50%; object-fit: cover; margin-bottom: 1rem;">
                                    <h3 style="font-size: 1.25rem; margin-bottom: 0.25rem;">${m.name}</h3>
                                    <p style="color: #0066cc; font-weight: 600; margin-bottom: 0.5rem;">${m.role}</p>
                                    <p style="color: #64748b; font-size: 0.9rem;">${m.bio}</p>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            `;
            break;
            
        case 'stats':
            content = `
                <div style="padding: 4rem 2rem; background: ${component.data.backgroundColor};">
                    <div style="max-width: 1000px; margin: 0 auto;">
                        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 3rem; text-align: center;">
                            ${component.data.stats.map(s => `
                                <div>
                                    <div style="font-size: 3rem; font-weight: 800; color: #0066cc; margin-bottom: 0.5rem;">${s.number}</div>
                                    <div style="color: #64748b; font-weight: 500;">${s.label}</div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            `;
            break;
            
        case 'faq':
            content = `
                <div style="padding: 4rem 2rem;">
                    <div style="max-width: 800px; margin: 0 auto;">
                        <h2 style="font-size: 2rem; text-align: center; margin-bottom: 3rem;">${component.data.heading}</h2>
                        ${component.data.faqs.map(faq => `
                            <div style="background: #f8fafc; padding: 1.5rem; border-radius: 0.5rem; margin-bottom: 1rem;">
                                <h3 style="font-size: 1.125rem; font-weight: 700; margin-bottom: 0.5rem;">${faq.question}</h3>
                                <p style="color: #64748b; line-height: 1.6;">${faq.answer}</p>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
            break;
            
        case 'contact':
            content = `
                <div style="padding: 4rem 2rem; background: ${component.data.backgroundColor};">
                    <div style="max-width: 600px; margin: 0 auto;">
                        <h2 style="font-size: 2rem; text-align: center; margin-bottom: 1rem;">${component.data.heading}</h2>
                        <p style="text-align: center; color: #64748b; margin-bottom: 2rem;">${component.data.subtitle}</p>
                        <form style="display: flex; flex-direction: column; gap: 1rem;" action="mailto:${component.data.email || 'hello@example.com'}" method="post" enctype="text/plain">
                            <input type="text" name="name" placeholder="Your Name" style="padding: 0.875rem; border: 2px solid #e2e8f0; border-radius: 0.5rem; font-size: 1rem;">
                            <input type="email" name="email" placeholder="Your Email" style="padding: 0.875rem; border: 2px solid #e2e8f0; border-radius: 0.5rem; font-size: 1rem;">
                            <textarea name="message" placeholder="Your Message" rows="5" style="padding: 0.875rem; border: 2px solid #e2e8f0; border-radius: 0.5rem; font-size: 1rem; resize: vertical;"></textarea>
                            <button type="submit" style="padding: 1rem; background: #0066cc; color: white; border: none; border-radius: 0.5rem; font-weight: 600; cursor: pointer;">Send Message</button>
                        </form>
                        <p style="text-align: center; margin-top: 1rem; font-size: 0.875rem; color: #64748b;">Sends to: ${component.data.email || 'hello@example.com'}</p>
                    </div>
                </div>
            `;
            break;
            
        case 'newsletter':
            content = `
                <div style="padding: 6rem 2rem; background: linear-gradient(135deg, ${component.data.gradientStart}, ${component.data.gradientEnd}); color: white; text-align: center;">
                    <div style="max-width: 600px; margin: 0 auto;">
                        <h2 style="font-size: 2.5rem; margin-bottom: 1rem;">${component.data.heading}</h2>
                        <p style="font-size: 1.125rem; margin-bottom: 2rem; opacity: 0.9;">${component.data.subtitle}</p>
                        <form style="display: flex; gap: 1rem;">
                            <input type="email" placeholder="Enter your email" style="flex: 1; padding: 1rem; border: none; border-radius: 0.5rem; font-size: 1rem;">
                            <button type="submit" style="padding: 1rem 2rem; background: white; color: ${component.data.gradientStart}; border: none; border-radius: 0.5rem; font-weight: 700; cursor: pointer;">${component.data.buttonText}</button>
                        </form>
                    </div>
                </div>
            `;
            break;
            
        case 'logos':
            content = `
                <div style="padding: 4rem 2rem; background: #f8fafc;">
                    <div style="max-width: 1000px; margin: 0 auto;">
                        <h2 style="font-size: 2rem; text-align: center; margin-bottom: 3rem;">${component.data.heading}</h2>
                        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 2rem; align-items: center;">
                            ${component.data.logos.map(logo => `
                                <img src="${logo}" style="width: 100%; height: 60px; object-fit: contain; filter: grayscale(100%); opacity: 0.6; transition: all 0.3s;">
                            `).join('')}
                        </div>
                    </div>
                </div>
            `;
            break;
            
        case 'timeline':
            content = `
                <div style="padding: 4rem 2rem;">
                    <div style="max-width: 800px; margin: 0 auto;">
                        <h2 style="font-size: 2rem; text-align: center; margin-bottom: 3rem;">${component.data.heading}</h2>
                        ${component.data.events.map((event, i) => `
                            <div style="display: flex; gap: 2rem; margin-bottom: 2rem;">
                                <div style="flex-shrink: 0; width: 80px; height: 80px; border-radius: 50%; background: linear-gradient(135deg, #667eea, #764ba2); color: white; display: flex; align-items: center; justify-content: center; font-size: 1.25rem; font-weight: 800;">${event.year}</div>
                                <div style="flex: 1; padding-top: 0.5rem;">
                                    <h3 style="font-size: 1.25rem; margin-bottom: 0.5rem; font-weight: 700;">${event.title}</h3>
                                    <p style="color: #64748b; line-height: 1.6;">${event.description}</p>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
            break;
            
        case 'video':
            content = `
                <div style="padding: 4rem 2rem;">
                    <div style="max-width: ${component.data.maxWidth}; margin: 0 auto;">
                        <h2 style="font-size: 2rem; text-align: center; margin-bottom: 2rem;">${component.data.title}</h2>
                        <div style="position: relative; width: 100%; padding-bottom: ${component.data.aspectRatio === '16/9' ? '56.25%' : component.data.aspectRatio === '4/3' ? '75%' : component.data.aspectRatio === '1/1' ? '100%' : '42.857%'}; border-radius: 1rem; overflow: hidden;">
                            <iframe src="${component.data.url}" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: none;" allowfullscreen></iframe>
                        </div>
                    </div>
                </div>
            `;
            break;
            
        case 'footer':
            content = `
                <footer style="background: #1e293b; color: white; padding: 4rem 2rem 2rem;">
                    <div style="max-width: 1200px; margin: 0 auto;">
                        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 3rem; margin-bottom: 3rem;">
                            <div>
                                <h3 style="font-size: 1.5rem; margin-bottom: 0.5rem; font-weight: 700;">${component.data.companyName}</h3>
                                <p style="opacity: 0.7; margin-bottom: 1rem;">${component.data.tagline}</p>
                            </div>
                            ${component.data.columns.map(col => `
                                <div>
                                    <h4 style="font-weight: 700; margin-bottom: 1rem;">${col.title}</h4>
                                    <ul style="list-style: none; padding: 0;">
                                        ${col.links.map(link => `
                                            <li style="margin-bottom: 0.5rem;"><a href="#" style="color: white; opacity: 0.7; text-decoration: none;">${link}</a></li>
                                        `).join('')}
                                    </ul>
                                </div>
                            `).join('')}
                        </div>
                        <div style="border-top: 1px solid rgba(255,255,255,0.1); padding-top: 2rem; text-align: center; opacity: 0.7;">
                            ${component.data.copyright}
                        </div>
                    </div>
                </footer>
            `;
            break;
            
        case 'navbar':
            content = `
                <nav style="background: ${component.data.backgroundColor}; padding: 1rem 2rem; border-bottom: 1px solid #e2e8f0; ${component.data.sticky ? 'position: sticky; top: 0; z-index: 100;' : ''} min-height: 60px;">
                    <div style="max-width: 1200px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center;">
                        <div style="font-size: 1.5rem; font-weight: 700;">${component.data.brand}</div>
                        <div style="display: flex; align-items: center; gap: 2rem;">
                            ${component.data.links.map(link => `
                                <a href="#" style="color: #64748b; text-decoration: none; font-weight: 500;">${link}</a>
                            `).join('')}
                            <a href="${component.data.ctaUrl}" style="padding: 0.5rem 1.5rem; background: #0066cc; color: white; text-decoration: none; border-radius: 0.5rem; font-weight: 600;">${component.data.ctaText}</a>
                        </div>
                    </div>
                </nav>
            `;
            break;
            
        case 'testimonials':
            content = `
                <div style="padding: 4rem 2rem; background: #f8fafc;">
                    <div style="max-width: 1000px; margin: 0 auto;">
                        <h2 style="font-size: 2rem; text-align: center; margin-bottom: 3rem;">${component.data.heading}</h2>
                        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem;">
                            ${component.data.testimonials.map(t => `
                                <div style="background: white; padding: 2rem; border-radius: 1rem; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                                    <div style="margin-bottom: 1rem;">${'⭐'.repeat(t.rating)}</div>
                                    <p style="font-style: italic; margin-bottom: 1rem;">"${t.text}"</p>
                                    <p style="font-weight: 600;">${t.name}</p>
                                    <p style="font-size: 0.875rem; opacity: 0.7;">${t.role}</p>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            `;
            break;
            
        case 'pricing':
            content = `
                <div style="padding: 4rem 2rem;">
                    <div style="max-width: 1000px; margin: 0 auto;">
                        <h2 style="font-size: 2rem; text-align: center; margin-bottom: 3rem;">${component.data.heading}</h2>
                        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 2rem;">
                            ${component.data.plans.map(plan => `
                                <div style="background: white; padding: 2rem; border-radius: 1rem; box-shadow: 0 4px 6px rgba(0,0,0,0.1); text-align: center;">
                                    <h3 style="font-size: 1.5rem; margin-bottom: 1rem;">${plan.name}</h3>
                                    <div style="font-size: 2.5rem; font-weight: 800; margin-bottom: 1rem;">$${plan.price}<span style="font-size: 1rem; font-weight: normal;">/mo</span></div>
                                    <ul style="list-style: none; margin-bottom: 2rem; text-align: left; padding: 0;">
                                        ${plan.features.map(f => `<li style="padding: 0.5rem 0;">✓ ${f}</li>`).join('')}
                                    </ul>
                                    <a href="${plan.buttonUrl}" style="display: block; padding: 0.75rem; background: #0066cc; color: white; text-decoration: none; border-radius: 0.5rem; font-weight: 600;">${plan.buttonText}</a>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            `;
            break;
            
        case 'blog':
            content = `
                <div style="padding: 4rem 2rem;">
                    <div style="max-width: 1000px; margin: 0 auto;">
                        <h2 style="font-size: 2rem; text-align: center; margin-bottom: 3rem;">${component.data.heading}</h2>
                        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem;">
                            ${component.data.posts.map(post => `
                                <article style="background: white; border-radius: 1rem; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); transition: transform 0.2s;">
                                    <img src="${post.image}" style="width: 100%; height: 200px; object-fit: cover;">
                                    <div style="padding: 1.5rem;">
                                        <div style="display: flex; gap: 1rem; font-size: 0.875rem; color: #64748b; margin-bottom: 0.75rem;">
                                            <span>${post.date}</span>
                                            <span>•</span>
                                            <span>${post.readTime}</span>
                                        </div>
                                        <h3 style="font-size: 1.25rem; margin-bottom: 0.75rem;">${post.title}</h3>
                                        <p style="color: #64748b; margin-bottom: 1rem; line-height: 1.6;">${post.excerpt}</p>
                                        <a href="${post.link}" style="color: #0066cc; font-weight: 600; text-decoration: none;">Read More →</a>
                                    </div>
                                </article>
                            `).join('')}
                        </div>
                    </div>
                </div>
            `;
            break;
            
        case 'imagetext':
            const flexDirection = component.data.imagePosition === 'left' ? 'row' : 'row-reverse';
            content = `
                <div style="padding: 4rem 2rem; background: ${component.data.backgroundColor};">
                    <div style="max-width: 1000px; margin: 0 auto; display: flex; flex-direction: ${flexDirection}; gap: 3rem; align-items: center;">
                        <div style="flex: 1;">
                            <img src="${component.data.image}" style="width: 100%; border-radius: 1rem;">
                        </div>
                        <div style="flex: 1; color: ${component.data.textColor || '#1a1a1a'};">
                            <h2 style="font-size: 2rem; margin-bottom: 1rem;">${component.data.heading}</h2>
                            <p style="font-size: 1.125rem; line-height: 1.7; opacity: 0.8; margin-bottom: 1.5rem;">${component.data.text}</p>
                            ${component.data.buttonText ? `<a href="${component.data.buttonUrl}" style="display: inline-block; padding: 0.75rem 2rem; background: ${component.data.buttonColor || '#0066cc'}; color: ${component.data.buttonTextColor || '#ffffff'}; text-decoration: none; border-radius: 0.5rem; font-weight: 600;">${component.data.buttonText}</a>` : ''}
                        </div>
                    </div>
                </div>
            `;
            break;
            
        case 'callout':
            content = `
                <div style="padding: 4rem 2rem;">
                    <div style="max-width: 800px; margin: 0 auto; background: ${component.data.backgroundColor}; border-left: 4px solid ${component.data.borderColor}; padding: 2rem; border-radius: 0.5rem;">
                        <div style="display: flex; gap: 1rem; align-items: start;">
                            <div style="font-size: 2rem;">${component.data.icon}</div>
                            <div style="flex: 1;">
                                <h3 style="font-size: 1.25rem; margin-bottom: 0.5rem; font-weight: 700;">${component.data.heading}</h3>
                                <p style="line-height: 1.6;">${component.data.text}</p>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            break;
            
        case 'progress':
            content = `
                <div style="padding: 4rem 2rem; background: #f8fafc;">
                    <div style="max-width: 800px; margin: 0 auto;">
                        <h2 style="font-size: 2rem; text-align: center; margin-bottom: 3rem;">${component.data.heading}</h2>
                        ${component.data.skills.map(skill => `
                            <div style="margin-bottom: 2rem;">
                                <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                                    <span style="font-weight: 600;">${skill.name}</span>
                                    <span style="color: #0066cc; font-weight: 600;">${skill.percentage}%</span>
                                </div>
                                <div style="background: #e2e8f0; height: 12px; border-radius: 9999px; overflow: hidden;">
                                    <div style="background: linear-gradient(90deg, #0066cc, #00a8ff); height: 100%; width: ${skill.percentage}%; border-radius: 9999px; transition: width 1s;"></div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
            break;
            
        case 'social':
            content = `
                <div style="padding: 4rem 2rem;">
                    <div style="max-width: 600px; margin: 0 auto; text-align: center;">
                        <h2 style="font-size: 2rem; margin-bottom: 2rem;">${component.data.heading}</h2>
                        <div style="display: flex; justify-content: center; gap: 1rem; flex-wrap: wrap;">
                            ${component.data.links.map(link => `
                                <a href="${link.url}" target="_blank" style="display: flex; align-items: center; justify-content: center; width: 50px; height: 50px; background: #0066cc; color: white; text-decoration: none; border-radius: 50%; font-size: 1.25rem; font-weight: 700; transition: transform 0.2s;" onmouseover="this.style.transform='scale(1.1)'" onmouseout="this.style.transform='scale(1)'">${link.icon}</a>
                            `).join('')}
                        </div>
                    </div>
                </div>
            `;
            break;
            
        case 'map':
            content = `
                <div style="padding: 4rem 2rem;">
                    <div style="max-width: 1000px; margin: 0 auto;">
                        <h2 style="font-size: 2rem; text-align: center; margin-bottom: 1rem;">${component.data.heading}</h2>
                        <p style="text-align: center; color: #64748b; margin-bottom: 2rem;">${component.data.address}</p>
                        <div style="position: relative; width: 100%; height: 450px; border-radius: 1rem; overflow: hidden;">
                            <iframe src="${component.data.embedUrl}" style="width: 100%; height: 100%; border: none;" allowfullscreen="" loading="lazy"></iframe>
                        </div>
                    </div>
                </div>
            `;
            break;
            
        case 'accordion':
            content = `
                <div style="padding: 4rem 2rem;">
                    <div style="max-width: 800px; margin: 0 auto;">
                        <h2 style="font-size: 2rem; text-align: center; margin-bottom: 3rem;">${component.data.heading}</h2>
                        ${component.data.items.map((item, i) => `
                            <div style="background: white; border: 1px solid #e2e8f0; border-radius: 0.5rem; margin-bottom: 1rem; overflow: hidden;">
                                <div style="padding: 1.25rem; font-weight: 600; cursor: pointer; display: flex; justify-content: space-between; align-items: center;">
                                    <span>${item.title}</span>
                                    <span style="font-size: 1.5rem;">+</span>
                                </div>
                                <div style="padding: 0 1.25rem 1.25rem; color: #64748b; line-height: 1.6;">${item.content}</div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
            break;
            
        case 'tabs':
            content = `
                <div style="padding: 4rem 2rem;">
                    <div style="max-width: 800px; margin: 0 auto;">
                        <div style="border-bottom: 2px solid #e2e8f0; margin-bottom: 2rem; display: flex; gap: 2rem;">
                            ${component.data.tabs.map((tab, i) => `
                                <button style="padding: 1rem 0; border: none; background: none; font-weight: 600; color: ${i === 0 ? '#0066cc' : '#64748b'}; border-bottom: 3px solid ${i === 0 ? '#0066cc' : 'transparent'}; cursor: pointer;">${tab.title}</button>
                            `).join('')}
                        </div>
                        <div style="padding: 2rem; background: #f8fafc; border-radius: 0.5rem;">
                            ${component.data.tabs[0].content}
                        </div>
                    </div>
                </div>
            `;
            break;
            
        case 'cards':
            content = `
                <div style="padding: 4rem 2rem; background: #f8fafc;">
                    <div style="max-width: 1000px; margin: 0 auto;">
                        <h2 style="font-size: 2rem; text-align: center; margin-bottom: 3rem;">${component.data.heading}</h2>
                        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 2rem;">
                            ${component.data.cards.map(card => `
                                <div style="background: white; padding: 2.5rem; border-radius: 1rem; text-align: center; box-shadow: 0 4px 6px rgba(0,0,0,0.1); transition: transform 0.2s;">
                                    <div style="font-size: 3.5rem; margin-bottom: 1rem;">${card.icon}</div>
                                    <h3 style="font-size: 1.5rem; margin-bottom: 1rem; font-weight: 700;">${card.title}</h3>
                                    <p style="color: #64748b; line-height: 1.6;">${card.description}</p>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            `;
            break;
            
        case 'countdown':
            const countdownId = `countdown-${component.id}`;
            content = `
                <div style="padding: 6rem 2rem; background: ${component.data.backgroundColor}; color: ${component.data.textColor}; text-align: center;">
                    <div style="max-width: 800px; margin: 0 auto;">
                        <h2 style="font-size: 2.5rem; margin-bottom: 0.5rem; font-weight: 800;">${component.data.heading}</h2>
                        <p style="font-size: 1.25rem; margin-bottom: 3rem; opacity: 0.9;">${component.data.subtitle}</p>
                        <div id="${countdownId}" style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 2rem; max-width: 600px; margin: 0 auto;">
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
                </div>
                <script>
                    (function() {
                        const targetDate = new Date('${component.data.targetDate}T${component.data.targetTime}').getTime();
                        const container = document.getElementById('${countdownId}');
                        
                        function updateCountdown() {
                            const now = new Date().getTime();
                            const distance = targetDate - now;
                            
                            if (distance < 0) {
                                container.querySelector('.countdown-days').textContent = '00';
                                container.querySelector('.countdown-hours').textContent = '00';
                                container.querySelector('.countdown-minutes').textContent = '00';
                                container.querySelector('.countdown-seconds').textContent = '00';
                                return;
                            }
                            
                            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
                            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                            const seconds = Math.floor((distance % (1000 * 60)) / 1000);
                            
                            container.querySelector('.countdown-days').textContent = String(days).padStart(2, '0');
                            container.querySelector('.countdown-hours').textContent = String(hours).padStart(2, '0');
                            container.querySelector('.countdown-minutes').textContent = String(minutes).padStart(2, '0');
                            container.querySelector('.countdown-seconds').textContent = String(seconds).padStart(2, '0');
                        }
                        
                        updateCountdown();
                        setInterval(updateCountdown, 1000);
                    })();
                </script>
            `;
            break;
            
        case 'quote':
            content = `
                <div style="padding: 4rem 2rem; background: ${component.data.backgroundColor};">
                    <div style="max-width: 800px; margin: 0 auto; text-align: center;">
                        <div style="font-size: 4rem; color: #0066cc; margin-bottom: 1rem;">"</div>
                        <p style="font-size: ${component.data.quoteSize}; font-style: italic; line-height: 1.6; margin-bottom: 2rem;">${component.data.quote}</p>
                        <p style="font-weight: 600; color: #64748b;">— ${component.data.author}</p>
                    </div>
                </div>
            `;
            break;
            
        case 'steps':
            content = `
                <div style="padding: 4rem 2rem;">
                    <div style="max-width: 1000px; margin: 0 auto;">
                        <h2 style="font-size: 2rem; text-align: center; margin-bottom: 4rem;">${component.data.heading}</h2>
                        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 3rem;">
                            ${component.data.steps.map((step, i) => `
                                <div style="text-align: center; position: relative;">
                                    <div style="width: 80px; height: 80px; border-radius: 50%; background: linear-gradient(135deg, #667eea, #764ba2); color: white; display: flex; align-items: center; justify-content: center; font-size: 2rem; font-weight: 800; margin: 0 auto 1.5rem;">${step.number}</div>
                                    <h3 style="font-size: 1.25rem; margin-bottom: 0.75rem; font-weight: 700;">${step.title}</h3>
                                    <p style="color: #64748b; line-height: 1.6;">${step.description}</p>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            `;
            break;
            
        case 'banner':
            content = `
                <div style="padding: 1rem 2rem; background: ${component.data.backgroundColor}; color: ${component.data.textColor}; text-align: center; display: flex; align-items: center; justify-content: center; gap: 2rem; flex-wrap: wrap;">
                    <p style="font-weight: 600; margin: 0;">${component.data.text}</p>
                    ${component.data.buttonText ? `<a href="${component.data.buttonUrl}" style="padding: 0.5rem 1.5rem; background: white; color: ${component.data.backgroundColor}; text-decoration: none; border-radius: 0.5rem; font-weight: 600;">${component.data.buttonText}</a>` : ''}
                    ${component.data.dismissible ? `<button style="background: none; border: none; color: white; cursor: pointer; font-size: 1.5rem; margin-left: auto;">×</button>` : ''}
                </div>
            `;
            break;
            
        case 'metrics':
            content = `
                <div style="padding: 4rem 2rem; background: ${component.data.backgroundColor};">
                    <div style="max-width: 1000px; margin: 0 auto;">
                        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 3rem; text-align: center;">
                            ${component.data.metrics.map(m => `
                                <div>
                                    <div style="font-size: 3rem; margin-bottom: 0.5rem;">${m.icon}</div>
                                    <div style="font-size: 3rem; font-weight: 800; color: #0066cc; margin-bottom: 0.5rem;">${m.number}</div>
                                    <div style="color: #64748b; font-weight: 500;">${m.label}</div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            `;
            break;
            
        case 'portfolio':
            content = `
                <div style="padding: 4rem 2rem; background: #f8fafc;">
                    <div style="max-width: 1200px; margin: 0 auto;">
                        <h2 style="font-size: 2rem; text-align: center; margin-bottom: 3rem;">${component.data.heading}</h2>
                        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem;">
                            ${component.data.projects.map(p => `
                                <div style="position: relative; overflow: hidden; border-radius: 1rem; cursor: pointer; aspect-ratio: 4/3;">
                                    <img src="${p.image}" style="width: 100%; height: 100%; object-fit: cover; transition: transform 0.3s;">
                                    <div style="position: absolute; bottom: 0; left: 0; right: 0; background: linear-gradient(to top, rgba(0,0,0,0.8), transparent); padding: 2rem 1.5rem 1.5rem; color: white;">
                                        <div style="font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; opacity: 0.8; margin-bottom: 0.25rem;">${p.category}</div>
                                        <h3 style="font-size: 1.25rem; font-weight: 700;">${p.title}</h3>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            `;
            break;
            
        case 'columns':
            content = `
                <div style="padding: 4rem 2rem; background: ${component.data.backgroundColor};">
                    <div style="max-width: 1000px; margin: 0 auto;">
                        <div style="display: grid; grid-template-columns: repeat(${component.data.columnCount}, 1fr); gap: 2rem;">
                            ${component.data.columns.map(col => `
                                <div style="padding: 2rem; background: #f8fafc; border-radius: 0.5rem;">
                                    <p style="line-height: 1.7; color: #334155;">${col.content}</p>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            `;
            break;
            
        case 'separator':
            content = `
                <div style="padding: ${component.data.spacing} 2rem;">
                    <div style="max-width: 1000px; margin: 0 auto;">
                        <hr style="border: none; border-top: ${component.data.thickness} ${component.data.style} ${component.data.color}; width: ${component.data.width}; margin: 0 auto;">
                    </div>
                </div>
            `;
            break;
            
        case 'graph':
            const chartId = `chart-${component.id}`;
            
            // Safety checks
            if (!component.data.labels || !component.data.datasets || component.data.datasets.length === 0) {
                content = `
                    <div style="padding: 4rem 2rem; background: #f8fafc;">
                        <div style="max-width: 800px; margin: 0 auto;">
                            <h2 style="font-size: 2rem; text-align: center; margin-bottom: 3rem;">${component.data.heading}</h2>
                            <div style="background: white; padding: 2rem; border-radius: 1rem; text-align: center;">
                                <p style="color: #64748b;">No data to display. Add labels and datasets in properties.</p>
                            </div>
                        </div>
                    </div>
                `;
                break;
            }
            
            const labels = component.data.labels;
            const datasets = component.data.datasets;
            const chartType = component.data.chartType || 'bar';
            
            let chartHtml = '';
            
            if (chartType === 'bar') {
                // Bar Chart with multiple datasets (grouped bars)
                const allValues = datasets.flatMap(ds => ds.data || []);
                const maxValue = Math.max(...allValues, 1);
                
                chartHtml = `
                    <div style="height: ${component.data.height}; display: flex; align-items: flex-end; justify-content: space-around; gap: 1rem; padding: 2rem;">
                        ${labels.map((label, labelIndex) => {
                            return `
                                <div style="flex: 1; display: flex; flex-direction: column; align-items: center; gap: 0.5rem;">
                                    <div style="width: 100%; height: 100%; display: flex; align-items: flex-end; justify-content: center; gap: 0.25rem;">
                                        ${datasets.map((dataset, datasetIndex) => {
                                            const value = dataset.data[labelIndex] || 0;
                                            const heightPercent = maxValue > 0 ? (value / maxValue) * 100 : 0;
                                            return `
                                                <div style="flex: 1; height: ${heightPercent}%; background: ${dataset.color || '#0066cc'}; border-radius: 0.5rem 0.5rem 0 0; min-height: ${value > 0 ? '20px' : '0'}; transition: height 0.3s; position: relative;" title="${dataset.label}: ${value}">
                                                    ${datasetIndex === 0 ? `<div style="position: absolute; top: -20px; left: 50%; transform: translateX(-50%); font-size: 0.75rem; font-weight: 600; white-space: nowrap;">${value}</div>` : ''}
                                                </div>
                                            `;
                                        }).join('')}
                                    </div>
                                    <div style="font-size: 0.875rem; font-weight: 600; margin-top: 0.5rem;">${label}</div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                `;
            } else if (chartType === 'line') {
                // Line Chart with multiple datasets (overlaying lines)
                const allValues = datasets.flatMap(ds => ds.data || []);
                const maxValue = Math.max(...allValues, 1);
                const width = 600;
                const height = parseInt(component.data.height) || 400;
                const padding = 60;
                const pointRadius = 5;
                
                const lines = datasets.map((dataset, datasetIndex) => {
                    const dataPoints = dataset.data || [];
                    
                    // Calculate points
                    const points = dataPoints.map((value, i) => {
                        const x = padding + (i * (width - padding * 2) / Math.max(dataPoints.length - 1, 1));
                        const y = height - padding - ((value / maxValue) * (height - padding * 2));
                        return { x, y, value };
                    });
                    
                    // Create path
                    const pathD = points.map((p, i) => 
                        `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`
                    ).join(' ');
                    
                    return { points, pathD, color: dataset.color || '#0066cc', label: dataset.label };
                });
                
                chartHtml = `
                    <div style="height: ${component.data.height}; display: flex; align-items: center; justify-content: center; padding: 2rem;">
                        <svg width="${width}" height="${height}" style="overflow: visible;">
                            <!-- Grid lines -->
                            ${[0, 1, 2, 3, 4].map(i => {
                                const y = padding + (i * (height - padding * 2) / 4);
                                return `<line x1="${padding}" y1="${y}" x2="${width - padding}" y2="${y}" stroke="#e2e8f0" stroke-width="1"/>`;
                            }).join('')}
                            
                            <!-- X-axis labels -->
                            ${labels.map((label, i) => {
                                const x = padding + (i * (width - padding * 2) / Math.max(labels.length - 1, 1));
                                return `<text x="${x}" y="${height - padding + 20}" text-anchor="middle" font-size="12" fill="#64748b">${label}</text>`;
                            }).join('')}
                            
                            <!-- Lines and points for each dataset -->
                            ${lines.map((line, lineIndex) => `
                                <!-- Line path -->
                                <path d="${line.pathD}" fill="none" stroke="${line.color}" stroke-width="3" opacity="0.8"/>
                                
                                <!-- Points -->
                                ${line.points.map((p, i) => `
                                    <circle cx="${p.x}" cy="${p.y}" r="${pointRadius}" fill="${line.color}"/>
                                    ${lineIndex === 0 ? `<text x="${p.x}" y="${p.y - 15}" text-anchor="middle" font-size="11" font-weight="600" fill="${line.color}">${p.value}</text>` : ''}
                                `).join('')}
                            `).join('')}
                        </svg>
                    </div>
                `;
            } else if (chartType === 'pie' || chartType === 'doughnut') {
                // Pie/Doughnut Chart (uses first dataset only)
                const dataset = datasets[0];
                const dataPoints = dataset.data || [];
                const total = dataPoints.reduce((sum, val) => sum + val, 0);
                const centerX = 200;
                const centerY = 200;
                const radius = 120;
                const innerRadius = chartType === 'doughnut' ? 60 : 0;
                
                let currentAngle = -90;
                const colors = ['#0066cc', '#764ba2', '#f093fb', '#4facfe', '#fa709a', '#43e97b', '#38f9d7'];
                
                const slices = dataPoints.map((value, i) => {
                    const percentage = total > 0 ? (value / total) * 100 : 0;
                    const angle = total > 0 ? (value / total) * 360 : 0;
                    const startAngle = currentAngle;
                    const endAngle = currentAngle + angle;
                    
                    currentAngle += angle;
                    
                    // Calculate arc path
                    const startRad = (startAngle * Math.PI) / 180;
                    const endRad = (endAngle * Math.PI) / 180;
                    
                    const x1 = centerX + radius * Math.cos(startRad);
                    const y1 = centerY + radius * Math.sin(startRad);
                    const x2 = centerX + radius * Math.cos(endRad);
                    const y2 = centerY + radius * Math.sin(endRad);
                    
                    const largeArc = angle > 180 ? 1 : 0;
                    
                    let pathD;
                    if (chartType === 'doughnut') {
                        const ix1 = centerX + innerRadius * Math.cos(startRad);
                        const iy1 = centerY + innerRadius * Math.sin(startRad);
                        const ix2 = centerX + innerRadius * Math.cos(endRad);
                        const iy2 = centerY + innerRadius * Math.sin(endRad);
                        
                        pathD = `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} L ${ix2} ${iy2} A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${ix1} ${iy1} Z`;
                    } else {
                        pathD = `M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;
                    }
                    
                    const color = colors[i % colors.length];
                    
                    return { pathD, color, label: labels[i], value, percentage };
                });
                
                chartHtml = `
                    <div style="height: ${component.data.height}; display: flex; align-items: center; justify-content: center; padding: 2rem; gap: 3rem;">
                        <svg width="400" height="400" style="overflow: visible;">
                            ${slices.map(slice => `
                                <path d="${slice.pathD}" fill="${slice.color}" stroke="white" stroke-width="2"/>
                            `).join('')}
                            ${chartType === 'doughnut' ? `
                                <text x="${centerX}" y="${centerY}" text-anchor="middle" font-size="24" font-weight="700" fill="#334155">${total}</text>
                                <text x="${centerX}" y="${centerY + 20}" text-anchor="middle" font-size="12" fill="#64748b">Total</text>
                            ` : ''}
                        </svg>
                        <div style="display: flex; flex-direction: column; gap: 0.75rem;">
                            ${slices.map(slice => `
                                <div style="display: flex; align-items: center; gap: 0.75rem;">
                                    <div style="width: 16px; height: 16px; background: ${slice.color}; border-radius: 0.25rem;"></div>
                                    <span style="font-size: 0.875rem; font-weight: 500;">${slice.label}: ${slice.value} (${slice.percentage.toFixed(1)}%)</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `;
            }
            
            // Generate legend
            const legendHtml = component.data.showLegend && (chartType === 'bar' || chartType === 'line') ? `
                <div style="margin-top: 2rem; display: flex; gap: 2rem; justify-content: center; flex-wrap: wrap;">
                    ${datasets.map(ds => `
                        <div style="display: flex; align-items: center; gap: 0.5rem;">
                            <div style="width: 20px; height: 20px; background: ${ds.color || '#0066cc'}; border-radius: 0.25rem;"></div>
                            <span style="font-size: 0.875rem;">${ds.label || 'Dataset'}</span>
                        </div>
                    `).join('')}
                </div>
            ` : '';
            
            content = `
                <div style="padding: 4rem 2rem; background: #f8fafc;">
                    <div style="max-width: 800px; margin: 0 auto;">
                        <h2 style="font-size: 2rem; text-align: center; margin-bottom: 3rem;">${component.data.heading}</h2>
                        <div style="background: white; padding: 2rem; border-radius: 1rem; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                            ${chartHtml}
                            ${legendHtml}
                        </div>
                    </div>
                </div>
            `;
            break;
            
        default:
            content = '<div style="padding: 2rem;">Unknown component type</div>';
    }
    
    return `
        <div class="canvas-component ${isSelected ? 'selected' : ''}" data-id="${component.id}" style="position: relative; border: 2px solid ${isSelected ? '#0066ff' : 'transparent'}; cursor: pointer; transition: all 0.2s; min-height: 60px;">
            ${content}
            <div class="component-controls" style="position: absolute; top: 0.5rem; right: 0.5rem; display: flex; gap: 0.5rem; opacity: ${isSelected ? '1' : '0'}; transition: opacity 0.2s; z-index: 1000;">
                <button onclick="event.stopPropagation(); moveComponent(${component.id}, 'up')" title="Move Up" style="padding: 0.5rem; background: white; border: 2px solid #0066ff; border-radius: 0.375rem; cursor: pointer; box-shadow: 0 2px 8px rgba(0,0,0,0.15); font-weight: 700; color: #0066ff; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center;">↑</button>
                <button onclick="event.stopPropagation(); moveComponent(${component.id}, 'down')" title="Move Down" style="padding: 0.5rem; background: white; border: 2px solid #0066ff; border-radius: 0.375rem; cursor: pointer; box-shadow: 0 2px 8px rgba(0,0,0,0.15); font-weight: 700; color: #0066ff; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center;">↓</button>
                <button onclick="event.stopPropagation(); removeComponent(${component.id})" title="Delete" style="padding: 0.5rem; background: white; border: 2px solid #ef4444; border-radius: 0.375rem; cursor: pointer; box-shadow: 0 2px 8px rgba(0,0,0,0.15); font-weight: 700; color: #ef4444; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center;">×</button>
            </div>
        </div>
    `;
}

// Select Component
function selectComponent(id) {
    selectedComponent = components.find(c => c.id === id);
    if (selectedComponent) {
        showPropertiesPanel();
        renderCanvas();
    }
}

// Properties Panel
function showPropertiesPanel() {
    if (!selectedComponent) return;
    
    const panel = document.getElementById('propertiesContent');
    let html = '';
    
    switch (selectedComponent.type) {
        case 'hero':
            html = `
                <div class="form-group" style="margin-bottom: 1rem;">
                    <label style="display: block; font-weight: 600; margin-bottom: 0.5rem;">Title</label>
                    <input type="text" value="${selectedComponent.data.title}" onchange="updateComponentData('title', this.value)" class="form-control">
                    
                    <label style="display: block; font-weight: 600; margin-bottom: 0.5rem; margin-top: 1rem;">Subtitle</label>
                    <textarea onchange="updateComponentData('subtitle', this.value)" class="form-control" style="min-height: 80px;">${selectedComponent.data.subtitle}</textarea>
                    
                    <label style="display: block; font-weight: 600; margin-bottom: 0.5rem; margin-top: 1rem;">Text Color</label>
                    <input type="color" value="${selectedComponent.data.textColor || '#1a1a1a'}" onchange="updateComponentData('textColor', this.value)" class="form-control">
                    
                    <label style="display: block; font-weight: 600; margin-bottom: 0.5rem; margin-top: 1rem;">Button Text</label>
                    <input type="text" value="${selectedComponent.data.buttonText}" onchange="updateComponentData('buttonText', this.value)" class="form-control">
                    
                    <label style="display: block; font-weight: 600; margin-bottom: 0.5rem; margin-top: 1rem;">Button URL</label>
                    <input type="text" value="${selectedComponent.data.buttonUrl}" onchange="updateComponentData('buttonUrl', this.value)" class="form-control">
                    
                    <label style="display: block; font-weight: 600; margin-bottom: 0.5rem; margin-top: 1rem;">Button Background Color</label>
                    <input type="color" value="${selectedComponent.data.buttonColor || '#0066cc'}" onchange="updateComponentData('buttonColor', this.value)" class="form-control">
                    
                    <label style="display: block; font-weight: 600; margin-bottom: 0.5rem; margin-top: 1rem;">Button Text Color</label>
                    <input type="color" value="${selectedComponent.data.buttonTextColor || '#ffffff'}" onchange="updateComponentData('buttonTextColor', this.value)" class="form-control">
                    
                    <label style="display: block; font-weight: 600; margin-bottom: 0.5rem; margin-top: 1rem;">Background Type</label>
                    <select onchange="updateComponentData('backgroundType', this.value)" class="form-control">
                        <option value="solid" ${selectedComponent.data.backgroundType === 'solid' ? 'selected' : ''}>Solid Color</option>
                        <option value="gradient" ${selectedComponent.data.backgroundType === 'gradient' ? 'selected' : ''}>Gradient</option>
                    </select>
                    
                    <div id="solidBg" style="display: ${selectedComponent.data.backgroundType === 'solid' ? 'block' : 'none'}; margin-top: 1rem;">
                        <label style="display: block; font-weight: 600; margin-bottom: 0.5rem;">Background Color</label>
                        <input type="color" value="${selectedComponent.data.background}" onchange="updateComponentData('background', this.value)" class="form-control">
                    </div>
                    
                    <div id="gradientBg" style="display: ${selectedComponent.data.backgroundType === 'gradient' ? 'block' : 'none'}; margin-top: 1rem;">
                        <label style="display: block; font-weight: 600; margin-bottom: 0.5rem;">Gradient Start</label>
                        <input type="color" value="${selectedComponent.data.gradientStart}" onchange="updateComponentData('gradientStart', this.value)" class="form-control">
                        
                        <label style="display: block; font-weight: 600; margin-bottom: 0.5rem; margin-top: 1rem;">Gradient End</label>
                        <input type="color" value="${selectedComponent.data.gradientEnd}" onchange="updateComponentData('gradientEnd', this.value)" class="form-control">
                    </div>
                    
                    <label style="display: block; font-weight: 600; margin-bottom: 0.5rem; margin-top: 1rem;">Text Alignment</label>
                    <select onchange="updateComponentData('textAlign', this.value)" class="form-control">
                        <option value="left" ${selectedComponent.data.textAlign === 'left' ? 'selected' : ''}>Left</option>
                        <option value="center" ${selectedComponent.data.textAlign === 'center' ? 'selected' : ''}>Center</option>
                        <option value="right" ${selectedComponent.data.textAlign === 'right' ? 'selected' : ''}>Right</option>
                    </select>
                    
                    <label style="display: block; font-weight: 600; margin-bottom: 0.5rem; margin-top: 1rem;">Min Height</label>
                    <select onchange="updateComponentData('minHeight', this.value)" class="form-control">
                        <option value="300px" ${selectedComponent.data.minHeight === '300px' ? 'selected' : ''}>Small (300px)</option>
                        <option value="400px" ${selectedComponent.data.minHeight === '400px' ? 'selected' : ''}>Medium (400px)</option>
                        <option value="500px" ${selectedComponent.data.minHeight === '500px' ? 'selected' : ''}>Large (500px)</option>
                        <option value="100vh" ${selectedComponent.data.minHeight === '100vh' ? 'selected' : ''}>Full Screen</option>
                    </select>
                </div>
            `;
            break;
            
        case 'text':
            html = `
                <div class="form-group" style="margin-bottom: 1rem;">
                    <label style="display: block; font-weight: 600; margin-bottom: 0.5rem;">Heading</label>
                    <input type="text" value="${selectedComponent.data.heading}" onchange="updateComponentData('heading', this.value)" class="form-control">
                    
                    <label style="display: block; font-weight: 600; margin-bottom: 0.5rem; margin-top: 1rem;">Content</label>
                    <textarea onchange="updateComponentData('content', this.value)" class="form-control" style="min-height: 120px;">${selectedComponent.data.content}</textarea>
                    
                    <label style="display: block; font-weight: 600; margin-bottom: 0.5rem; margin-top: 1rem;">Heading Size</label>
                    <select onchange="updateComponentData('headingSize', this.value)" class="form-control">
                        <option value="1.5rem" ${selectedComponent.data.headingSize === '1.5rem' ? 'selected' : ''}>Small</option>
                        <option value="2rem" ${selectedComponent.data.headingSize === '2rem' ? 'selected' : ''}>Medium</option>
                        <option value="2.5rem" ${selectedComponent.data.headingSize === '2.5rem' ? 'selected' : ''}>Large</option>
                        <option value="3rem" ${selectedComponent.data.headingSize === '3rem' ? 'selected' : ''}>Extra Large</option>
                    </select>
                    
                    <label style="display: block; font-weight: 600; margin-bottom: 0.5rem; margin-top: 1rem;">Text Alignment</label>
                    <select onchange="updateComponentData('textAlign', this.value)" class="form-control">
                        <option value="left" ${selectedComponent.data.textAlign === 'left' ? 'selected' : ''}>Left</option>
                        <option value="center" ${selectedComponent.data.textAlign === 'center' ? 'selected' : ''}>Center</option>
                        <option value="right" ${selectedComponent.data.textAlign === 'right' ? 'selected' : ''}>Right</option>
                    </select>
                    
                    <label style="display: block; font-weight: 600; margin-bottom: 0.5rem; margin-top: 1rem;">Background Color</label>
                    <input type="color" value="${selectedComponent.data.backgroundColor}" onchange="updateComponentData('backgroundColor', this.value)" class="form-control">
                </div>
            `;
            break;
            
        case 'image':
            html = `
                <div class="form-group" style="margin-bottom: 1rem;">
                    <label style="display: block; font-weight: 600; margin-bottom: 0.5rem;">Image URL</label>
                    <input type="text" value="${selectedComponent.data.src}" onchange="updateComponentData('src', this.value)" class="form-control">
                    
                    <label style="display: block; font-weight: 600; margin-bottom: 0.5rem; margin-top: 1rem;">Or Upload Image</label>
                    <input type="file" accept="image/*" onchange="handleImageUpload(event)" class="form-control">
                    <small style="display: block; margin-top: 0.25rem; color: #64748b;">Max 16MB. Formats: PNG, JPG, GIF, WebP, SVG</small>
                    
                    <label style="display: block; font-weight: 600; margin-bottom: 0.5rem; margin-top: 1rem;">Alt Text</label>
                    <input type="text" value="${selectedComponent.data.alt}" onchange="updateComponentData('alt', this.value)" class="form-control">
                    
                    <label style="display: block; font-weight: 600; margin-bottom: 0.5rem; margin-top: 1rem;">Width</label>
                    <select onchange="updateComponentData('width', this.value)" class="form-control">
                        <option value="50%" ${selectedComponent.data.width === '50%' ? 'selected' : ''}>50%</option>
                        <option value="75%" ${selectedComponent.data.width === '75%' ? 'selected' : ''}>75%</option>
                        <option value="100%" ${selectedComponent.data.width === '100%' ? 'selected' : ''}>100%</option>
                    </select>
                    
                    <label style="display: block; font-weight: 600; margin-bottom: 0.5rem; margin-top: 1rem;">Max Width</label>
                    <select onchange="updateComponentData('maxWidth', this.value)" class="form-control">
                        <option value="600px" ${selectedComponent.data.maxWidth === '600px' ? 'selected' : ''}>Small (600px)</option>
                        <option value="800px" ${selectedComponent.data.maxWidth === '800px' ? 'selected' : ''}>Medium (800px)</option>
                        <option value="1000px" ${selectedComponent.data.maxWidth === '1000px' ? 'selected' : ''}>Large (1000px)</option>
                        <option value="100%" ${selectedComponent.data.maxWidth === '100%' ? 'selected' : ''}>Full Width</option>
                    </select>
                    
                    <label style="display: block; font-weight: 600; margin-bottom: 0.5rem; margin-top: 1rem;">Border Radius</label>
                    <select onchange="updateComponentData('borderRadius', this.value)" class="form-control">
                        <option value="0" ${selectedComponent.data.borderRadius === '0' ? 'selected' : ''}>None</option>
                        <option value="0.5rem" ${selectedComponent.data.borderRadius === '0.5rem' ? 'selected' : ''}>Small</option>
                        <option value="1rem" ${selectedComponent.data.borderRadius === '1rem' ? 'selected' : ''}>Medium</option>
                        <option value="2rem" ${selectedComponent.data.borderRadius === '2rem' ? 'selected' : ''}>Large</option>
                        <option value="50%" ${selectedComponent.data.borderRadius === '50%' ? 'selected' : ''}>Circle</option>
                    </select>
                    
                    <label style="display: block; font-weight: 600; margin-bottom: 0.5rem; margin-top: 1rem;">Alignment</label>
                    <select onchange="updateComponentData('alignment', this.value)" class="form-control">
                        <option value="left" ${selectedComponent.data.alignment === 'left' ? 'selected' : ''}>Left</option>
                        <option value="center" ${selectedComponent.data.alignment === 'center' ? 'selected' : ''}>Center</option>
                        <option value="right" ${selectedComponent.data.alignment === 'right' ? 'selected' : ''}>Right</option>
                    </select>
                </div>
            `;
            break;
            
        case 'features':
            html = `
                <div class="form-group" style="margin-bottom: 1rem;">
                    <label style="display: block; font-weight: 600; margin-bottom: 0.5rem;">Heading</label>
                    <input type="text" value="${selectedComponent.data.heading}" onchange="updateComponentData('heading', this.value)" class="form-control">
                    
                    <label style="display: block; font-weight: 600; margin-bottom: 0.5rem; margin-top: 1rem;">Background Color</label>
                    <input type="color" value="${selectedComponent.data.backgroundColor}" onchange="updateComponentData('backgroundColor', this.value)" class="form-control">
                    
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 1.5rem; margin-bottom: 1rem;">
                        <h4 style="margin: 0;">Features (${selectedComponent.data.features.length})</h4>
                        <button onclick="addFeature()" style="padding: 0.5rem 1rem; background: #0066cc; color: white; border: none; border-radius: 0.5rem; cursor: pointer; font-weight: 600;">+ Add Feature</button>
                    </div>
                    
                    ${selectedComponent.data.features.map((f, i) => `
                        <div style="background: #f8fafc; padding: 1rem; border-radius: 0.5rem; margin-bottom: 1rem; position: relative;">
                            <button onclick="deleteFeature(${i})" style="position: absolute; top: 0.5rem; right: 0.5rem; background: #ef4444; color: white; border: none; border-radius: 0.375rem; padding: 0.25rem 0.5rem; cursor: pointer; font-weight: 600;">Delete</button>
                            
                            <label style="display: block; font-weight: 600; margin-bottom: 0.5rem;">Icon (emoji)</label>
                            <input type="text" value="${f.icon}" onchange="updateFeature(${i}, 'icon', this.value)" class="form-control" maxlength="2" placeholder="⭐">
                            
                            <label style="display: block; font-weight: 600; margin-bottom: 0.5rem; margin-top: 0.75rem;">Title</label>
                            <input type="text" value="${f.title}" onchange="updateFeature(${i}, 'title', this.value)" class="form-control">
                            
                            <label style="display: block; font-weight: 600; margin-bottom: 0.5rem; margin-top: 0.75rem;">Description</label>
                            <textarea onchange="updateFeature(${i}, 'description', this.value)" class="form-control" rows="2">${f.description}</textarea>
                        </div>
                    `).join('')}
                </div>
            `;
            break;
            
        case 'cta':
            html = `
                <div class="form-group" style="margin-bottom: 1rem;">
                    <label style="display: block; font-weight: 600; margin-bottom: 0.5rem;">Heading</label>
                    <input type="text" value="${selectedComponent.data.heading}" onchange="updateComponentData('heading', this.value)" class="form-control">
                    
                    <label style="display: block; font-weight: 600; margin-bottom: 0.5rem; margin-top: 1rem;">Subtitle</label>
                    <input type="text" value="${selectedComponent.data.subtitle}" onchange="updateComponentData('subtitle', this.value)" class="form-control">
                    
                    <label style="display: block; font-weight: 600; margin-bottom: 0.5rem; margin-top: 1rem;">Text Color</label>
                    <input type="color" value="${selectedComponent.data.textColor || '#ffffff'}" onchange="updateComponentData('textColor', this.value)" class="form-control">
                    
                    <label style="display: block; font-weight: 600; margin-bottom: 0.5rem; margin-top: 1rem;">Button Text</label>
                    <input type="text" value="${selectedComponent.data.buttonText}" onchange="updateComponentData('buttonText', this.value)" class="form-control">
                    
                    <label style="display: block; font-weight: 600; margin-bottom: 0.5rem; margin-top: 1rem;">Button URL</label>
                    <input type="text" value="${selectedComponent.data.buttonUrl}" onchange="updateComponentData('buttonUrl', this.value)" class="form-control">
                    
                    <label style="display: block; font-weight: 600; margin-bottom: 0.5rem; margin-top: 1rem;">Button Background Color</label>
                    <input type="color" value="${selectedComponent.data.buttonColor || '#ffffff'}" onchange="updateComponentData('buttonColor', this.value)" class="form-control">
                    
                    <label style="display: block; font-weight: 600; margin-bottom: 0.5rem; margin-top: 1rem;">Button Text Color</label>
                    <input type="color" value="${selectedComponent.data.buttonTextColor || '#0066cc'}" onchange="updateComponentData('buttonTextColor', this.value)" class="form-control">
                    
                    <label style="display: block; font-weight: 600; margin-bottom: 0.5rem; margin-top: 1rem;">Background Type</label>
                    <select onchange="updateComponentData('backgroundType', this.value)" class="form-control">
                        <option value="solid" ${selectedComponent.data.backgroundType === 'solid' ? 'selected' : ''}>Solid Color</option>
                        <option value="gradient" ${selectedComponent.data.backgroundType === 'gradient' ? 'selected' : ''}>Gradient</option>
                    </select>
                    
                    <div id="ctaSolidBg" style="display: ${selectedComponent.data.backgroundType === 'solid' ? 'block' : 'none'}; margin-top: 1rem;">
                        <label style="display: block; font-weight: 600; margin-bottom: 0.5rem;">Background Color</label>
                        <input type="color" value="${selectedComponent.data.backgroundColor}" onchange="updateComponentData('backgroundColor', this.value)" class="form-control">
                    </div>
                    
                    <div id="ctaGradientBg" style="display: ${selectedComponent.data.backgroundType === 'gradient' ? 'block' : 'none'}; margin-top: 1rem;">
                        <label style="display: block; font-weight: 600; margin-bottom: 0.5rem;">Gradient Start</label>
                        <input type="color" value="${selectedComponent.data.gradientStart}" onchange="updateComponentData('gradientStart', this.value)" class="form-control">
                        
                        <label style="display: block; font-weight: 600; margin-bottom: 0.5rem; margin-top: 1rem;">Gradient End</label>
                        <input type="color" value="${selectedComponent.data.gradientEnd}" onchange="updateComponentData('gradientEnd', this.value)" class="form-control">
                    </div>
                </div>
            `;
            break;
            
        case 'gallery':
            html = `
                <div class="form-group" style="margin-bottom: 1rem;">
                    <label style="display: block; font-weight: 600; margin-bottom: 0.5rem;">Columns</label>
                    <select onchange="updateComponentData('columns', this.value)" class="form-control">
                        <option value="auto-fit" ${selectedComponent.data.columns === 'auto-fit' ? 'selected' : ''}>Auto Fit</option>
                        <option value="1" ${selectedComponent.data.columns === '1' ? 'selected' : ''}>1 Column</option>
                        <option value="2" ${selectedComponent.data.columns === '2' ? 'selected' : ''}>2 Columns</option>
                        <option value="3" ${selectedComponent.data.columns === '3' ? 'selected' : ''}>3 Columns</option>
                        <option value="4" ${selectedComponent.data.columns === '4' ? 'selected' : ''}>4 Columns</option>
                        <option value="5" ${selectedComponent.data.columns === '5' ? 'selected' : ''}>5 Columns</option>
                    </select>
                    
                    <label style="display: block; font-weight: 600; margin-bottom: 0.5rem; margin-top: 1rem;">Gap Between Images</label>
                    <select onchange="updateComponentData('gap', this.value)" class="form-control">
                        <option value="0.25rem" ${selectedComponent.data.gap === '0.25rem' ? 'selected' : ''}>Tiny</option>
                        <option value="0.5rem" ${selectedComponent.data.gap === '0.5rem' ? 'selected' : ''}>Small</option>
                        <option value="1rem" ${selectedComponent.data.gap === '1rem' ? 'selected' : ''}>Medium</option>
                        <option value="1.5rem" ${selectedComponent.data.gap === '1.5rem' ? 'selected' : ''}>Large</option>
                        <option value="2rem" ${selectedComponent.data.gap === '2rem' ? 'selected' : ''}>Extra Large</option>
                    </select>
                    
                    <label style="display: block; font-weight: 600; margin-bottom: 0.5rem; margin-top: 1rem;">Image Height</label>
                    <select onchange="updateComponentData('imageHeight', this.value)" class="form-control">
                        <option value="150px" ${selectedComponent.data.imageHeight === '150px' ? 'selected' : ''}>Small (150px)</option>
                        <option value="200px" ${selectedComponent.data.imageHeight === '200px' ? 'selected' : ''}>Medium (200px)</option>
                        <option value="250px" ${selectedComponent.data.imageHeight === '250px' ? 'selected' : ''}>Large (250px)</option>
                        <option value="300px" ${selectedComponent.data.imageHeight === '300px' ? 'selected' : ''}>Extra Large (300px)</option>
                        <option value="400px" ${selectedComponent.data.imageHeight === '400px' ? 'selected' : ''}>Huge (400px)</option>
                        <option value="auto" ${selectedComponent.data.imageHeight === 'auto' ? 'selected' : ''}>Auto (Original Ratio)</option>
                    </select>
                    
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 1.5rem; margin-bottom: 1rem;">
                        <h4 style="margin: 0;">Images (${selectedComponent.data.images.length})</h4>
                        <button onclick="addGalleryImage()" style="padding: 0.5rem 1rem; background: #0066cc; color: white; border: none; border-radius: 0.5rem; cursor: pointer; font-weight: 600;">+ Add Image</button>
                    </div>
                    
                    ${selectedComponent.data.images.map((img, i) => `
                        <div style="background: #f8fafc; padding: 1rem; border-radius: 0.5rem; margin-bottom: 1rem; position: relative;">
                            <button onclick="deleteGalleryImage(${i})" style="position: absolute; top: 0.5rem; right: 0.5rem; background: #ef4444; color: white; border: none; border-radius: 0.375rem; padding: 0.25rem 0.5rem; cursor: pointer; font-weight: 600; z-index: 10;">Delete</button>
                            
                            <img src="${img}" style="width: 100%; height: 100px; object-fit: cover; border-radius: 0.5rem; margin-bottom: 0.5rem;">
                            
                            <label style="display: block; font-weight: 600; margin-bottom: 0.5rem; font-size: 0.875rem;">Image URL</label>
                            <input type="text" value="${img}" onchange="updateGalleryImage(${i}, this.value)" class="form-control" style="margin-bottom: 0.5rem;" placeholder="https://...">
                            
                            <label style="display: block; font-weight: 600; margin-bottom: 0.5rem; font-size: 0.875rem;">Or Upload New Image</label>
                            <input type="file" accept="image/*" onchange="handleGalleryImageUpload(${i}, event)" class="form-control">
                        </div>
                    `).join('')}
                </div>
            `;
            break;

        case 'team':
            html = `
                <div class="form-group" style="margin-bottom: 1rem;">
                    <label style="display: block; font-weight: 600; margin-bottom: 0.5rem;">Heading</label>
                    <input type="text" value="${selectedComponent.data.heading}" onchange="updateComponentData('heading', this.value)" class="form-control">
                    
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 1.5rem; margin-bottom: 1rem;">
                        <h4 style="margin: 0;">Team Members (${selectedComponent.data.members.length})</h4>
                        <button onclick="addTeamMember()" style="padding: 0.5rem 1rem; background: #0066cc; color: white; border: none; border-radius: 0.5rem; cursor: pointer; font-weight: 600;">+ Add Member</button>
                    </div>
                    
                    ${selectedComponent.data.members.map((m, i) => `
                        <div style="background: #f8fafc; padding: 1rem; border-radius: 0.5rem; margin-bottom: 1rem; position: relative;">
                            <button onclick="deleteTeamMember(${i})" style="position: absolute; top: 0.5rem; right: 0.5rem; background: #ef4444; color: white; border: none; border-radius: 0.375rem; padding: 0.25rem 0.5rem; cursor: pointer; font-weight: 600;">Delete</button>
                            
                            <img src="${m.image}" style="width: 80px; height: 80px; border-radius: 50%; object-fit: cover; margin-bottom: 0.5rem;">
                            
                            <label style="display: block; font-weight: 600; margin-bottom: 0.5rem; font-size: 0.875rem;">Name</label>
                            <input type="text" value="${m.name}" onchange="updateTeamMember(${i}, 'name', this.value)" class="form-control" style="margin-bottom: 0.5rem;">
                            
                            <label style="display: block; font-weight: 600; margin-bottom: 0.5rem; font-size: 0.875rem;">Role</label>
                            <input type="text" value="${m.role}" onchange="updateTeamMember(${i}, 'role', this.value)" class="form-control" style="margin-bottom: 0.5rem;">
                            
                            <label style="display: block; font-weight: 600; margin-bottom: 0.5rem; font-size: 0.875rem;">Bio</label>
                            <input type="text" value="${m.bio}" onchange="updateTeamMember(${i}, 'bio', this.value)" class="form-control" style="margin-bottom: 0.5rem;">
                            
                            <label style="display: block; font-weight: 600; margin-bottom: 0.5rem; font-size: 0.875rem;">Image URL</label>
                            <input type="text" value="${m.image}" onchange="updateTeamMember(${i}, 'image', this.value)" class="form-control">
                        </div>
                    `).join('')}
                </div>
            `;
            break;
            
        case 'stats':
            html = `
                <div class="form-group" style="margin-bottom: 1rem;">
                    <label style="display: block; font-weight: 600; margin-bottom: 0.5rem;">Background Color</label>
                    <input type="color" value="${selectedComponent.data.backgroundColor}" onchange="updateComponentData('backgroundColor', this.value)" class="form-control">
                    
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 1.5rem; margin-bottom: 1rem;">
                        <h4 style="margin: 0;">Statistics (${selectedComponent.data.stats.length})</h4>
                        <button onclick="addStat()" style="padding: 0.5rem 1rem; background: #0066cc; color: white; border: none; border-radius: 0.5rem; cursor: pointer; font-weight: 600;">+ Add Stat</button>
                    </div>
                    
                    ${selectedComponent.data.stats.map((s, i) => `
                        <div style="background: #f8fafc; padding: 1rem; border-radius: 0.5rem; margin-bottom: 1rem; position: relative;">
                            <button onclick="deleteStat(${i})" style="position: absolute; top: 0.5rem; right: 0.5rem; background: #ef4444; color: white; border: none; border-radius: 0.375rem; padding: 0.25rem 0.5rem; cursor: pointer; font-weight: 600;">Delete</button>
                            
                            <label style="display: block; font-weight: 600; margin-bottom: 0.5rem;">Number</label>
                            <input type="text" value="${s.number}" onchange="updateStat(${i}, 'number', this.value)" class="form-control" style="margin-bottom: 0.5rem;">
                            
                            <label style="display: block; font-weight: 600; margin-bottom: 0.5rem;">Label</label>
                            <input type="text" value="${s.label}" onchange="updateStat(${i}, 'label', this.value)" class="form-control">
                        </div>
                    `).join('')}
                </div>
            `;
            break;
            
        case 'faq':
            html = `
                <div class="form-group" style="margin-bottom: 1rem;">
                    <label style="display: block; font-weight: 600; margin-bottom: 0.5rem;">Heading</label>
                    <input type="text" value="${selectedComponent.data.heading}" onchange="updateComponentData('heading', this.value)" class="form-control">
                    
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 1.5rem; margin-bottom: 1rem;">
                        <h4 style="margin: 0;">FAQs (${selectedComponent.data.faqs.length})</h4>
                        <button onclick="addFaq()" style="padding: 0.5rem 1rem; background: #0066cc; color: white; border: none; border-radius: 0.5rem; cursor: pointer; font-weight: 600;">+ Add FAQ</button>
                    </div>
                    
                    ${selectedComponent.data.faqs.map((faq, i) => `
                        <div style="background: #f8fafc; padding: 1rem; border-radius: 0.5rem; margin-bottom: 1rem; position: relative;">
                            <button onclick="deleteFaq(${i})" style="position: absolute; top: 0.5rem; right: 0.5rem; background: #ef4444; color: white; border: none; border-radius: 0.375rem; padding: 0.25rem 0.5rem; cursor: pointer; font-weight: 600;">Delete</button>
                            
                            <label style="display: block; font-weight: 600; margin-bottom: 0.5rem;">Question</label>
                            <input type="text" value="${faq.question}" onchange="updateFaq(${i}, 'question', this.value)" class="form-control" style="margin-bottom: 0.5rem;">
                            
                            <label style="display: block; font-weight: 600; margin-bottom: 0.5rem;">Answer</label>
                            <textarea onchange="updateFaq(${i}, 'answer', this.value)" class="form-control" rows="3">${faq.answer}</textarea>
                        </div>
                    `).join('')}
                </div>
            `;
            break;
            
        case 'contact':
            html = `
                <div class="form-group" style="margin-bottom: 1rem;">
                    <label style="display: block; font-weight: 600; margin-bottom: 0.5rem;">Heading</label>
                    <input type="text" value="${selectedComponent.data.heading}" onchange="updateComponentData('heading', this.value)" class="form-control">
                    
                    <label style="display: block; font-weight: 600; margin-bottom: 0.5rem; margin-top: 1rem;">Subtitle</label>
                    <input type="text" value="${selectedComponent.data.subtitle}" onchange="updateComponentData('subtitle', this.value)" class="form-control">
                    
                    <label style="display: block; font-weight: 600; margin-bottom: 0.5rem; margin-top: 1rem;">Email Address (where form sends to)</label>
                    <input type="email" value="${selectedComponent.data.email || 'hello@example.com'}" onchange="updateComponentData('email', this.value)" class="form-control">
                    <small style="display: block; margin-top: 0.25rem; color: #64748b;">Form submissions will be sent to this email</small>
                    
                    <label style="display: block; font-weight: 600; margin-bottom: 0.5rem; margin-top: 1rem;">Background Color</label>
                    <input type="color" value="${selectedComponent.data.backgroundColor}" onchange="updateComponentData('backgroundColor', this.value)" class="form-control">
                </div>
            `;
            break;
            
        case 'newsletter':
            html = `
                <div class="form-group" style="margin-bottom: 1rem;">
                    <label style="display: block; font-weight: 600; margin-bottom: 0.5rem;">Heading</label>
                    <input type="text" value="${selectedComponent.data.heading}" onchange="updateComponentData('heading', this.value)" class="form-control">
                    
                    <label style="display: block; font-weight: 600; margin-bottom: 0.5rem; margin-top: 1rem;">Subtitle</label>
                    <input type="text" value="${selectedComponent.data.subtitle}" onchange="updateComponentData('subtitle', this.value)" class="form-control">
                    
                    <label style="display: block; font-weight: 600; margin-bottom: 0.5rem; margin-top: 1rem;">Button Text</label>
                    <input type="text" value="${selectedComponent.data.buttonText}" onchange="updateComponentData('buttonText', this.value)" class="form-control">
                    
                    <label style="display: block; font-weight: 600; margin-bottom: 0.5rem; margin-top: 1rem;">Background Type</label>
                    <select onchange="updateComponentData('backgroundType', this.value)" class="form-control">
                        <option value="gradient" ${selectedComponent.data.backgroundType === 'gradient' ? 'selected' : ''}>Gradient</option>
                        <option value="solid" ${selectedComponent.data.backgroundType === 'solid' ? 'selected' : ''}>Solid Color</option>
                    </select>
                    
                    <label style="display: block; font-weight: 600; margin-bottom: 0.5rem; margin-top: 1rem;">Gradient Start</label>
                    <input type="color" value="${selectedComponent.data.gradientStart}" onchange="updateComponentData('gradientStart', this.value)" class="form-control">
                    
                    <label style="display: block; font-weight: 600; margin-bottom: 0.5rem; margin-top: 1rem;">Gradient End</label>
                    <input type="color" value="${selectedComponent.data.gradientEnd}" onchange="updateComponentData('gradientEnd', this.value)" class="form-control">
                </div>
            `;
            break;

        case 'testimonials':
            html = `
                <div class="form-group" style="margin-bottom: 1rem;">
                    <label style="display: block; font-weight: 600; margin-bottom: 0.5rem;">Heading</label>
                    <input type="text" value="${selectedComponent.data.heading}" onchange="updateComponentData('heading', this.value)" class="form-control">
                    
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 1.5rem; margin-bottom: 1rem;">
                        <h4 style="margin: 0;">Testimonials (${selectedComponent.data.testimonials.length})</h4>
                        <button onclick="addTestimonial()" style="padding: 0.5rem 1rem; background: #0066cc; color: white; border: none; border-radius: 0.5rem; cursor: pointer; font-weight: 600;">+ Add</button>
                    </div>
                    
                    ${selectedComponent.data.testimonials.map((t, i) => `
                        <div style="background: #f8fafc; padding: 1rem; border-radius: 0.5rem; margin-bottom: 1rem; position: relative;">
                            <button onclick="deleteTestimonial(${i})" style="position: absolute; top: 0.5rem; right: 0.5rem; background: #ef4444; color: white; border: none; border-radius: 0.375rem; padding: 0.25rem 0.5rem; cursor: pointer; font-weight: 600;">Delete</button>
                            
                            <label style="display: block; font-weight: 600; margin-bottom: 0.5rem;">Rating (1-5)</label>
                            <select onchange="updateTestimonial(${i}, 'rating', parseInt(this.value))" class="form-control" style="margin-bottom: 0.5rem;">
                                <option value="1" ${t.rating === 1 ? 'selected' : ''}>1 Star</option>
                                <option value="2" ${t.rating === 2 ? 'selected' : ''}>2 Stars</option>
                                <option value="3" ${t.rating === 3 ? 'selected' : ''}>3 Stars</option>
                                <option value="4" ${t.rating === 4 ? 'selected' : ''}>4 Stars</option>
                                <option value="5" ${t.rating === 5 ? 'selected' : ''}>5 Stars</option>
                            </select>
                            
                            <label style="display: block; font-weight: 600; margin-bottom: 0.5rem;">Review Text</label>
                            <textarea onchange="updateTestimonial(${i}, 'text', this.value)" class="form-control" rows="3" style="margin-bottom: 0.5rem;">${t.text}</textarea>
                            
                            <label style="display: block; font-weight: 600; margin-bottom: 0.5rem;">Name</label>
                            <input type="text" value="${t.name}" onchange="updateTestimonial(${i}, 'name', this.value)" class="form-control" style="margin-bottom: 0.5rem;">
                            
                            <label style="display: block; font-weight: 600; margin-bottom: 0.5rem;">Role/Company</label>
                            <input type="text" value="${t.role}" onchange="updateTestimonial(${i}, 'role', this.value)" class="form-control">
                        </div>
                    `).join('')}
                </div>
            `;
            break;
            
        case 'pricing':
            html = `
                <div class="form-group" style="margin-bottom: 1rem;">
                    <label style="display: block; font-weight: 600; margin-bottom: 0.5rem;">Heading</label>
                    <input type="text" value="${selectedComponent.data.heading}" onchange="updateComponentData('heading', this.value)" class="form-control">
                    
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 1.5rem; margin-bottom: 1rem;">
                        <h4 style="margin: 0;">Plans (${selectedComponent.data.plans.length})</h4>
                        <button onclick="addPlan()" style="padding: 0.5rem 1rem; background: #0066cc; color: white; border: none; border-radius: 0.5rem; cursor: pointer; font-weight: 600;">+ Add Plan</button>
                    </div>
                    
                    ${selectedComponent.data.plans.map((plan, i) => `
                        <div style="background: #f8fafc; padding: 1rem; border-radius: 0.5rem; margin-bottom: 1rem; position: relative;">
                            <button onclick="deletePlan(${i})" style="position: absolute; top: 0.5rem; right: 0.5rem; background: #ef4444; color: white; border: none; border-radius: 0.375rem; padding: 0.25rem 0.5rem; cursor: pointer; font-weight: 600;">Delete</button>
                            
                            <label style="display: block; font-weight: 600; margin-bottom: 0.5rem;">Plan Name</label>
                            <input type="text" value="${plan.name}" onchange="updatePlan(${i}, 'name', this.value)" class="form-control" style="margin-bottom: 0.5rem;">
                            
                            <label style="display: block; font-weight: 600; margin-bottom: 0.5rem;">Price</label>
                            <input type="text" value="${plan.price}" onchange="updatePlan(${i}, 'price', this.value)" class="form-control" style="margin-bottom: 0.5rem;">
                            
                            <label style="display: block; font-weight: 600; margin-bottom: 0.5rem;">Features (comma-separated)</label>
                            <textarea onchange="updatePlanFeatures(${i}, this.value)" class="form-control" rows="3" style="margin-bottom: 0.5rem;">${plan.features.join(', ')}</textarea>
                            
                            <label style="display: block; font-weight: 600; margin-bottom: 0.5rem;">Button Text</label>
                            <input type="text" value="${plan.buttonText}" onchange="updatePlan(${i}, 'buttonText', this.value)" class="form-control" style="margin-bottom: 0.5rem;">
                            
                            <label style="display: block; font-weight: 600; margin-bottom: 0.5rem;">Button URL</label>
                            <input type="text" value="${plan.buttonUrl}" onchange="updatePlan(${i}, 'buttonUrl', this.value)" class="form-control">
                        </div>
                    `).join('')}
                </div>
            `;
            break;
            
        case 'logos':
            html = `
                <div class="form-group" style="margin-bottom: 1rem;">
                    <label style="display: block; font-weight: 600; margin-bottom: 0.5rem;">Heading</label>
                    <input type="text" value="${selectedComponent.data.heading}" onchange="updateComponentData('heading', this.value)" class="form-control">
                    
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 1.5rem; margin-bottom: 1rem;">
                        <h4 style="margin: 0;">Logos (${selectedComponent.data.logos.length})</h4>
                        <button onclick="addLogo()" style="padding: 0.5rem 1rem; background: #0066cc; color: white; border: none; border-radius: 0.5rem; cursor: pointer; font-weight: 600;">+ Add Logo</button>
                    </div>
                    
                    ${selectedComponent.data.logos.map((logo, i) => `
                        <div style="background: #f8fafc; padding: 1rem; border-radius: 0.5rem; margin-bottom: 1rem; position: relative;">
                            <button onclick="deleteLogo(${i})" style="position: absolute; top: 0.5rem; right: 0.5rem; background: #ef4444; color: white; border: none; border-radius: 0.375rem; padding: 0.25rem 0.5rem; cursor: pointer; font-weight: 600;">Delete</button>
                            
                            <img src="${logo}" style="width: 100%; height: 60px; object-fit: contain; margin-bottom: 0.5rem; background: white; border-radius: 0.5rem; padding: 0.5rem;">
                            
                            <label style="display: block; font-weight: 600; margin-bottom: 0.5rem; font-size: 0.875rem;">Logo URL</label>
                            <input type="text" value="${logo}" onchange="updateLogo(${i}, this.value)" class="form-control" style="margin-bottom: 0.5rem;">
                            
                            <label style="display: block; font-weight: 600; margin-bottom: 0.5rem; font-size: 0.875rem;">Or Upload</label>
                            <input type="file" accept="image/*" onchange="handleLogoUpload(${i}, event)" class="form-control">
                        </div>
                    `).join('')}
                </div>
            `;
            break;
            
        case 'timeline':
            html = `
                <div class="form-group" style="margin-bottom: 1rem;">
                    <label style="display: block; font-weight: 600; margin-bottom: 0.5rem;">Heading</label>
                    <input type="text" value="${selectedComponent.data.heading}" onchange="updateComponentData('heading', this.value)" class="form-control">
                    
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 1.5rem; margin-bottom: 1rem;">
                        <h4 style="margin: 0;">Events (${selectedComponent.data.events.length})</h4>
                        <button onclick="addTimelineEvent()" style="padding: 0.5rem 1rem; background: #0066cc; color: white; border: none; border-radius: 0.5rem; cursor: pointer; font-weight: 600;">+ Add Event</button>
                    </div>
                    
                    ${selectedComponent.data.events.map((event, i) => `
                        <div style="background: #f8fafc; padding: 1rem; border-radius: 0.5rem; margin-bottom: 1rem; position: relative;">
                            <button onclick="deleteTimelineEvent(${i})" style="position: absolute; top: 0.5rem; right: 0.5rem; background: #ef4444; color: white; border: none; border-radius: 0.375rem; padding: 0.25rem 0.5rem; cursor: pointer; font-weight: 600;">Delete</button>
                            
                            <label style="display: block; font-weight: 600; margin-bottom: 0.5rem;">Year</label>
                            <input type="text" value="${event.year}" onchange="updateTimelineEvent(${i}, 'year', this.value)" class="form-control" style="margin-bottom: 0.5rem;">
                            
                            <label style="display: block; font-weight: 600; margin-bottom: 0.5rem;">Title</label>
                            <input type="text" value="${event.title}" onchange="updateTimelineEvent(${i}, 'title', this.value)" class="form-control" style="margin-bottom: 0.5rem;">
                            
                            <label style="display: block; font-weight: 600; margin-bottom: 0.5rem;">Description</label>
                            <input type="text" value="${event.description}" onchange="updateTimelineEvent(${i}, 'description', this.value)" class="form-control">
                        </div>
                    `).join('')}
                </div>
            `;
            break;
            
        case 'video':
            html = `
                <div class="form-group" style="margin-bottom: 1rem;">
                    <label style="display: block; font-weight: 600; margin-bottom: 0.5rem;">Title</label>
                    <input type="text" value="${selectedComponent.data.title}" onchange="updateComponentData('title', this.value)" class="form-control">
                    
                    <label style="display: block; font-weight: 600; margin-bottom: 0.5rem; margin-top: 1rem;">Video URL</label>
                    <input type="text" value="${selectedComponent.data.url}" onchange="updateComponentData('url', this.value)" class="form-control">
                    <small style="display: block; margin-top: 0.25rem; color: #64748b;">YouTube embed URL (e.g., https://www.youtube.com/embed/VIDEO_ID)</small>
                    
                    <label style="display: block; font-weight: 600; margin-bottom: 0.5rem; margin-top: 1rem;">Aspect Ratio</label>
                    <select onchange="updateComponentData('aspectRatio', this.value)" class="form-control">
                        <option value="16/9" ${selectedComponent.data.aspectRatio === '16/9' ? 'selected' : ''}>16:9 (Widescreen)</option>
                        <option value="4/3" ${selectedComponent.data.aspectRatio === '4/3' ? 'selected' : ''}>4:3 (Standard)</option>
                        <option value="1/1" ${selectedComponent.data.aspectRatio === '1/1' ? 'selected' : ''}>1:1 (Square)</option>
                        <option value="21/9" ${selectedComponent.data.aspectRatio === '21/9' ? 'selected' : ''}>21:9 (Ultrawide)</option>
                    </select>
                    
                    <label style="display: block; font-weight: 600; margin-bottom: 0.5rem; margin-top: 1rem;">Max Width</label>
                    <select onchange="updateComponentData('maxWidth', this.value)" class="form-control">
                        <option value="600px" ${selectedComponent.data.maxWidth === '600px' ? 'selected' : ''}>Small (600px)</option>
                        <option value="800px" ${selectedComponent.data.maxWidth === '800px' ? 'selected' : ''}>Medium (800px)</option>
                        <option value="1000px" ${selectedComponent.data.maxWidth === '1000px' ? 'selected' : ''}>Large (1000px)</option>
                        <option value="100%" ${selectedComponent.data.maxWidth === '100%' ? 'selected' : ''}>Full Width</option>
                    </select>
                </div>
            `;
            break;
            
        case 'footer':
            html = `
                <div class="form-group" style="margin-bottom: 1rem;">
                    <label style="display: block; font-weight: 600; margin-bottom: 0.5rem;">Company Name</label>
                    <input type="text" value="${selectedComponent.data.companyName}" onchange="updateComponentData('companyName', this.value)" class="form-control">
                    
                    <label style="display: block; font-weight: 600; margin-bottom: 0.5rem; margin-top: 1rem;">Tagline</label>
                    <input type="text" value="${selectedComponent.data.tagline}" onchange="updateComponentData('tagline', this.value)" class="form-control">
                    
                    <label style="display: block; font-weight: 600; margin-bottom: 0.5rem; margin-top: 1rem;">Copyright Text</label>
                    <input type="text" value="${selectedComponent.data.copyright}" onchange="updateComponentData('copyright', this.value)" class="form-control">
                    
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 1.5rem; margin-bottom: 1rem;">
                        <h4 style="margin: 0;">Footer Columns (${selectedComponent.data.columns.length})</h4>
                        <button onclick="addFooterColumn()" style="padding: 0.5rem 1rem; background: #0066cc; color: white; border: none; border-radius: 0.5rem; cursor: pointer; font-weight: 600;">+ Add Column</button>
                    </div>
                    
                    ${selectedComponent.data.columns.map((col, i) => `
                        <div style="background: #f8fafc; padding: 1rem; border-radius: 0.5rem; margin-bottom: 1rem; position: relative;">
                            <button onclick="deleteFooterColumn(${i})" style="position: absolute; top: 0.5rem; right: 0.5rem; background: #ef4444; color: white; border: none; border-radius: 0.375rem; padding: 0.25rem 0.5rem; cursor: pointer; font-weight: 600;">Delete</button>
                            
                            <label style="display: block; font-weight: 600; margin-bottom: 0.5rem;">Column Title</label>
                            <input type="text" value="${col.title}" onchange="updateFooterColumn(${i}, 'title', this.value)" class="form-control" style="margin-bottom: 0.5rem;">
                            
                            <label style="display: block; font-weight: 600; margin-bottom: 0.5rem;">Links (comma-separated)</label>
                            <textarea onchange="updateFooterColumnLinks(${i}, this.value)" class="form-control" rows="2">${col.links.join(', ')}</textarea>
                        </div>
                    `).join('')}
                </div>
            `;
            break;
            
        case 'navbar':
            html = `
                <div class="form-group" style="margin-bottom: 1rem;">
                    <label style="display: block; font-weight: 600; margin-bottom: 0.5rem;">Brand Name</label>
                    <input type="text" value="${selectedComponent.data.brand}" onchange="updateComponentData('brand', this.value)" class="form-control">
                    
                    <label style="display: block; font-weight: 600; margin-bottom: 0.5rem; margin-top: 1rem;">Navigation Links (comma-separated)</label>
                    <input type="text" value="${selectedComponent.data.links.join(', ')}" onchange="updateNavbarLinks(this.value)" class="form-control">
                    
                    <label style="display: block; font-weight: 600; margin-bottom: 0.5rem; margin-top: 1rem;">CTA Button Text</label>
                    <input type="text" value="${selectedComponent.data.ctaText}" onchange="updateComponentData('ctaText', this.value)" class="form-control">
                    
                    <label style="display: block; font-weight: 600; margin-bottom: 0.5rem; margin-top: 1rem;">CTA Button URL</label>
                    <input type="text" value="${selectedComponent.data.ctaUrl}" onchange="updateComponentData('ctaUrl', this.value)" class="form-control">
                    
                    <label style="display: block; font-weight: 600; margin-bottom: 0.5rem; margin-top: 1rem;">Background Color</label>
                    <input type="color" value="${selectedComponent.data.backgroundColor}" onchange="updateComponentData('backgroundColor', this.value)" class="form-control">
                    
                    <label style="display: flex; align-items: center; gap: 0.5rem; margin-top: 1rem; cursor: pointer;">
                        <input type="checkbox" ${selectedComponent.data.sticky ? 'checked' : ''} onchange="updateComponentData('sticky', this.checked)">
                        <span style="font-weight: 600;">Sticky (Fixed to top)</span>
                    </label>
                </div>
            `;
            break;
            
        case 'blog':
            html = `
                <div class="form-group" style="margin-bottom: 1rem;">
                    <label style="display: block; font-weight: 600; margin-bottom: 0.5rem;">Heading</label>
                    <input type="text" value="${selectedComponent.data.heading}" onchange="updateComponentData('heading', this.value)" class="form-control">
                    
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 1.5rem; margin-bottom: 1rem;">
                        <h4 style="margin: 0;">Blog Posts (${selectedComponent.data.posts.length})</h4>
                        <button onclick="addBlogPost()" style="padding: 0.5rem 1rem; background: #0066cc; color: white; border: none; border-radius: 0.5rem; cursor: pointer; font-weight: 600;">+ Add Post</button>
                    </div>
                    
                    ${selectedComponent.data.posts.map((post, i) => `
                        <div style="background: #f8fafc; padding: 1rem; border-radius: 0.5rem; margin-bottom: 1rem; position: relative;">
                            <button onclick="deleteBlogPost(${i})" style="position: absolute; top: 0.5rem; right: 0.5rem; background: #ef4444; color: white; border: none; border-radius: 0.375rem; padding: 0.25rem 0.5rem; cursor: pointer; font-weight: 600;">Delete</button>
                            
                            <img src="${post.image}" style="width: 100%; height: 100px; object-fit: cover; border-radius: 0.5rem; margin-bottom: 0.5rem;">
                            
                            <label style="display: block; font-weight: 600; margin-bottom: 0.5rem; font-size: 0.875rem;">Image URL</label>
                            <input type="text" value="${post.image}" onchange="updateBlogPost(${i}, 'image', this.value)" class="form-control" style="margin-bottom: 0.5rem;">
                            
                            <label style="display: block; font-weight: 600; margin-bottom: 0.5rem; font-size: 0.875rem;">Title</label>
                            <input type="text" value="${post.title}" onchange="updateBlogPost(${i}, 'title', this.value)" class="form-control" style="margin-bottom: 0.5rem;">
                            
                            <label style="display: block; font-weight: 600; margin-bottom: 0.5rem; font-size: 0.875rem;">Excerpt</label>
                            <textarea onchange="updateBlogPost(${i}, 'excerpt', this.value)" class="form-control" rows="2" style="margin-bottom: 0.5rem;">${post.excerpt}</textarea>
                            
                            <label style="display: block; font-weight: 600; margin-bottom: 0.5rem; font-size: 0.875rem;">Date</label>
                            <input type="text" value="${post.date}" onchange="updateBlogPost(${i}, 'date', this.value)" class="form-control" style="margin-bottom: 0.5rem;">
                            
                            <label style="display: block; font-weight: 600; margin-bottom: 0.5rem; font-size: 0.875rem;">Read Time</label>
                            <input type="text" value="${post.readTime}" onchange="updateBlogPost(${i}, 'readTime', this.value)" class="form-control" style="margin-bottom: 0.5rem;">
                            
                            <label style="display: block; font-weight: 600; margin-bottom: 0.5rem; font-size: 0.875rem;">Link URL</label>
                            <input type="text" value="${post.link}" onchange="updateBlogPost(${i}, 'link', this.value)" class="form-control">
                        </div>
                    `).join('')}
                </div>
            `;
            break;
            
        case 'imagetext':
            html = `
                <div class="form-group" style="margin-bottom: 1rem;">
                    <label style="display: block; font-weight: 600; margin-bottom: 0.5rem;">Image URL</label>
                    <input type="text" value="${selectedComponent.data.image}" onchange="updateComponentData('image', this.value)" class="form-control">
                    
                    <label style="display: block; font-weight: 600; margin-bottom: 0.5rem; margin-top: 1rem;">Heading</label>
                    <input type="text" value="${selectedComponent.data.heading}" onchange="updateComponentData('heading', this.value)" class="form-control">
                    
                    <label style="display: block; font-weight: 600; margin-bottom: 0.5rem; margin-top: 1rem;">Text Content</label>
                    <textarea onchange="updateComponentData('text', this.value)" class="form-control" rows="4">${selectedComponent.data.text}</textarea>
                    
                    <label style="display: block; font-weight: 600; margin-bottom: 0.5rem; margin-top: 1rem;">Text Color</label>
                    <input type="color" value="${selectedComponent.data.textColor || '#1a1a1a'}" onchange="updateComponentData('textColor', this.value)" class="form-control">
                    
                    <label style="display: block; font-weight: 600; margin-bottom: 0.5rem; margin-top: 1rem;">Button Text (optional)</label>
                    <input type="text" value="${selectedComponent.data.buttonText}" onchange="updateComponentData('buttonText', this.value)" class="form-control">
                    
                    <label style="display: block; font-weight: 600; margin-bottom: 0.5rem; margin-top: 1rem;">Button URL</label>
                    <input type="text" value="${selectedComponent.data.buttonUrl}" onchange="updateComponentData('buttonUrl', this.value)" class="form-control">
                    
                    <label style="display: block; font-weight: 600; margin-bottom: 0.5rem; margin-top: 1rem;">Button Background Color</label>
                    <input type="color" value="${selectedComponent.data.buttonColor || '#0066cc'}" onchange="updateComponentData('buttonColor', this.value)" class="form-control">
                    
                    <label style="display: block; font-weight: 600; margin-bottom: 0.5rem; margin-top: 1rem;">Button Text Color</label>
                    <input type="color" value="${selectedComponent.data.buttonTextColor || '#ffffff'}" onchange="updateComponentData('buttonTextColor', this.value)" class="form-control">
                    
                    <label style="display: block; font-weight: 600; margin-bottom: 0.5rem; margin-top: 1rem;">Image Position</label>
                    <select onchange="updateComponentData('imagePosition', this.value)" class="form-control">
                        <option value="left" ${selectedComponent.data.imagePosition === 'left' ? 'selected' : ''}>Left</option>
                        <option value="right" ${selectedComponent.data.imagePosition === 'right' ? 'selected' : ''}>Right</option>
                    </select>
                    
                    <label style="display: block; font-weight: 600; margin-bottom: 0.5rem; margin-top: 1rem;">Background Color</label>
                    <input type="color" value="${selectedComponent.data.backgroundColor}" onchange="updateComponentData('backgroundColor', this.value)" class="form-control">
                </div>
            `;
            break;
            
        case 'callout':
            html = `
                <div class="form-group" style="margin-bottom: 1rem;">
                    <label style="display: block; font-weight: 600; margin-bottom: 0.5rem;">Icon (emoji)</label>
                    <input type="text" value="${selectedComponent.data.icon}" onchange="updateComponentData('icon', this.value)" class="form-control" maxlength="2">
                    
                    <label style="display: block; font-weight: 600; margin-bottom: 0.5rem; margin-top: 1rem;">Heading</label>
                    <input type="text" value="${selectedComponent.data.heading}" onchange="updateComponentData('heading', this.value)" class="form-control">
                    
                    <label style="display: block; font-weight: 600; margin-bottom: 0.5rem; margin-top: 1rem;">Text</label>
                    <textarea onchange="updateComponentData('text', this.value)" class="form-control" rows="4">${selectedComponent.data.text}</textarea>
                    
                    <label style="display: block; font-weight: 600; margin-bottom: 0.5rem; margin-top: 1rem;">Background Color</label>
                    <input type="color" value="${selectedComponent.data.backgroundColor}" onchange="updateComponentData('backgroundColor', this.value)" class="form-control">
                    
                    <label style="display: block; font-weight: 600; margin-bottom: 0.5rem; margin-top: 1rem;">Border Color</label>
                    <input type="color" value="${selectedComponent.data.borderColor}" onchange="updateComponentData('borderColor', this.value)" class="form-control">
                </div>
            `;
            break;
            
        case 'progress':
            html = `
                <div class="form-group" style="margin-bottom: 1rem;">
                    <label style="display: block; font-weight: 600; margin-bottom: 0.5rem;">Heading</label>
                    <input type="text" value="${selectedComponent.data.heading}" onchange="updateComponentData('heading', this.value)" class="form-control">
                    
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 1.5rem; margin-bottom: 1rem;">
                        <h4 style="margin: 0;">Skills (${selectedComponent.data.skills.length})</h4>
                        <button onclick="addSkill()" style="padding: 0.5rem 1rem; background: #0066cc; color: white; border: none; border-radius: 0.5rem; cursor: pointer; font-weight: 600;">+ Add Skill</button>
                    </div>
                    
                    ${selectedComponent.data.skills.map((skill, i) => `
                        <div style="background: #f8fafc; padding: 1rem; border-radius: 0.5rem; margin-bottom: 1rem; position: relative;">
                            <button onclick="deleteSkill(${i})" style="position: absolute; top: 0.5rem; right: 0.5rem; background: #ef4444; color: white; border: none; border-radius: 0.375rem; padding: 0.25rem 0.5rem; cursor: pointer; font-weight: 600;">Delete</button>
                            
                            <label style="display: block; font-weight: 600; margin-bottom: 0.5rem;">Skill Name</label>
                            <input type="text" value="${skill.name}" onchange="updateSkill(${i}, 'name', this.value)" class="form-control" style="margin-bottom: 0.5rem;">
                            
                            <label style="display: block; font-weight: 600; margin-bottom: 0.5rem;">Percentage (0-100)</label>
                            <input type="number" min="0" max="100" value="${skill.percentage}" onchange="updateSkill(${i}, 'percentage', parseInt(this.value))" class="form-control">
                        </div>
                    `).join('')}
                </div>
            `;
            break;
            
        case 'social':
            html = `
                <div class="form-group" style="margin-bottom: 1rem;">
                    <label style="display: block; font-weight: 600; margin-bottom: 0.5rem;">Heading</label>
                    <input type="text" value="${selectedComponent.data.heading}" onchange="updateComponentData('heading', this.value)" class="form-control">
                    
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 1.5rem; margin-bottom: 1rem;">
                        <h4 style="margin: 0;">Social Links (${selectedComponent.data.links.length})</h4>
                        <button onclick="addSocialLink()" style="padding: 0.5rem 1rem; background: #0066cc; color: white; border: none; border-radius: 0.5rem; cursor: pointer; font-weight: 600;">+ Add Link</button>
                    </div>
                    
                    ${selectedComponent.data.links.map((link, i) => `
                        <div style="background: #f8fafc; padding: 1rem; border-radius: 0.5rem; margin-bottom: 1rem; position: relative;">
                            <button onclick="deleteSocialLink(${i})" style="position: absolute; top: 0.5rem; right: 0.5rem; background: #ef4444; color: white; border: none; border-radius: 0.375rem; padding: 0.25rem 0.5rem; cursor: pointer; font-weight: 600;">Delete</button>
                            
                            <label style="display: block; font-weight: 600; margin-bottom: 0.5rem;">Platform Name</label>
                            <input type="text" value="${link.platform}" onchange="updateSocialLink(${i}, 'platform', this.value)" class="form-control" style="margin-bottom: 0.5rem;">
                            
                            <label style="display: block; font-weight: 600; margin-bottom: 0.5rem;">Icon (emoji or letter)</label>
                            <input type="text" value="${link.icon}" onchange="updateSocialLink(${i}, 'icon', this.value)" class="form-control" maxlength="2" style="margin-bottom: 0.5rem;">
                            
                            <label style="display: block; font-weight: 600; margin-bottom: 0.5rem;">URL</label>
                            <input type="text" value="${link.url}" onchange="updateSocialLink(${i}, 'url', this.value)" class="form-control">
                        </div>
                    `).join('')}
                </div>
            `;
            break;
            
        case 'map':
            html = `
                <div class="form-group" style="margin-bottom: 1rem;">
                    <label style="display: block; font-weight: 600; margin-bottom: 0.5rem;">Heading</label>
                    <input type="text" value="${selectedComponent.data.heading}" onchange="updateComponentData('heading', this.value)" class="form-control">
                    
                    <label style="display: block; font-weight: 600; margin-bottom: 0.5rem; margin-top: 1rem;">Address</label>
                    <input type="text" value="${selectedComponent.data.address}" onchange="updateComponentData('address', this.value)" class="form-control">
                    
                    <label style="display: block; font-weight: 600; margin-bottom: 0.5rem; margin-top: 1rem;">Google Maps Embed URL</label>
                    <textarea onchange="updateComponentData('embedUrl', this.value)" class="form-control" rows="3">${selectedComponent.data.embedUrl}</textarea>
                    <small style="display: block; margin-top: 0.25rem; color: #64748b;">Get embed URL from Google Maps → Share → Embed a map</small>
                </div>
            `;
            break;
        case 'accordion':
            html = `
                <div class="form-group" style="margin-bottom: 1rem;">
                    <label style="display: block; font-weight: 600; margin-bottom: 0.5rem;">Heading</label>
                    <input type="text" value="${selectedComponent.data.heading}" onchange="updateComponentData('heading', this.value)" class="form-control">
                    
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 1.5rem; margin-bottom: 1rem;">
                        <h4 style="margin: 0;">Items (${selectedComponent.data.items.length})</h4>
                        <button onclick="addAccordionItem()" style="padding: 0.5rem 1rem; background: #0066cc; color: white; border: none; border-radius: 0.5rem; cursor: pointer; font-weight: 600;">+ Add</button>
                    </div>
                    
                    ${selectedComponent.data.items.map((item, i) => `
                        <div style="background: #f8fafc; padding: 1rem; border-radius: 0.5rem; margin-bottom: 1rem; position: relative;">
                            <button onclick="deleteAccordionItem(${i})" style="position: absolute; top: 0.5rem; right: 0.5rem; background: #ef4444; color: white; border: none; border-radius: 0.375rem; padding: 0.25rem 0.5rem; cursor: pointer; font-weight: 600;">Delete</button>
                            
                            <label style="display: block; font-weight: 600; margin-bottom: 0.5rem;">Title</label>
                            <input type="text" value="${item.title}" onchange="updateAccordionItem(${i}, 'title', this.value)" class="form-control" style="margin-bottom: 0.5rem;">
                            
                            <label style="display: block; font-weight: 600; margin-bottom: 0.5rem;">Content</label>
                            <textarea onchange="updateAccordionItem(${i}, 'content', this.value)" class="form-control" rows="3">${item.content}</textarea>
                        </div>
                    `).join('')}
                </div>
            `;
            break;
            
        case 'tabs':
            html = `
                <div class="form-group" style="margin-bottom: 1rem;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                        <h4 style="margin: 0;">Tabs (${selectedComponent.data.tabs.length})</h4>
                        <button onclick="addTab()" style="padding: 0.5rem 1rem; background: #0066cc; color: white; border: none; border-radius: 0.5rem; cursor: pointer; font-weight: 600;">+ Add Tab</button>
                    </div>
                    
                    ${selectedComponent.data.tabs.map((tab, i) => `
                        <div style="background: #f8fafc; padding: 1rem; border-radius: 0.5rem; margin-bottom: 1rem; position: relative;">
                            <button onclick="deleteTab(${i})" style="position: absolute; top: 0.5rem; right: 0.5rem; background: #ef4444; color: white; border: none; border-radius: 0.375rem; padding: 0.25rem 0.5rem; cursor: pointer; font-weight: 600;">Delete</button>
                            
                            <label style="display: block; font-weight: 600; margin-bottom: 0.5rem;">Tab Title</label>
                            <input type="text" value="${tab.title}" onchange="updateTab(${i}, 'title', this.value)" class="form-control" style="margin-bottom: 0.5rem;">
                            
                            <label style="display: block; font-weight: 600; margin-bottom: 0.5rem;">Content</label>
                            <textarea onchange="updateTab(${i}, 'content', this.value)" class="form-control" rows="3">${tab.content}</textarea>
                        </div>
                    `).join('')}
                </div>
            `;
            break;
            
        case 'cards':
            html = `
                <div class="form-group" style="margin-bottom: 1rem;">
                    <label style="display: block; font-weight: 600; margin-bottom: 0.5rem;">Heading</label>
                    <input type="text" value="${selectedComponent.data.heading}" onchange="updateComponentData('heading', this.value)" class="form-control">
                    
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 1.5rem; margin-bottom: 1rem;">
                        <h4 style="margin: 0;">Cards (${selectedComponent.data.cards.length})</h4>
                        <button onclick="addCard()" style="padding: 0.5rem 1rem; background: #0066cc; color: white; border: none; border-radius: 0.5rem; cursor: pointer; font-weight: 600;">+ Add</button>
                    </div>
                    
                    ${selectedComponent.data.cards.map((card, i) => `
                        <div style="background: #f8fafc; padding: 1rem; border-radius: 0.5rem; margin-bottom: 1rem; position: relative;">
                            <button onclick="deleteCard(${i})" style="position: absolute; top: 0.5rem; right: 0.5rem; background: #ef4444; color: white; border: none; border-radius: 0.375rem; padding: 0.25rem 0.5rem; cursor: pointer; font-weight: 600;">Delete</button>
                            
                            <label style="display: block; font-weight: 600; margin-bottom: 0.5rem;">Icon (emoji)</label>
                            <input type="text" value="${card.icon}" onchange="updateCard(${i}, 'icon', this.value)" class="form-control" maxlength="2" style="margin-bottom: 0.5rem;">
                            
                            <label style="display: block; font-weight: 600; margin-bottom: 0.5rem;">Title</label>
                            <input type="text" value="${card.title}" onchange="updateCard(${i}, 'title', this.value)" class="form-control" style="margin-bottom: 0.5rem;">
                            
                            <label style="display: block; font-weight: 600; margin-bottom: 0.5rem;">Description</label>
                            <textarea onchange="updateCard(${i}, 'description', this.value)" class="form-control" rows="2">${card.description}</textarea>
                        </div>
                    `).join('')}
                </div>
            `;
            break;
            
        case 'countdown':
            html = `
                <div class="form-group" style="margin-bottom: 1rem;">
                    <label style="display: block; font-weight: 600; margin-bottom: 0.5rem;">Heading</label>
                    <input type="text" value="${selectedComponent.data.heading}" onchange="updateComponentData('heading', this.value)" class="form-control">
                    
                    <label style="display: block; font-weight: 600; margin-bottom: 0.5rem; margin-top: 1rem;">Subtitle</label>
                    <input type="text" value="${selectedComponent.data.subtitle}" onchange="updateComponentData('subtitle', this.value)" class="form-control">
                    
                    <label style="display: block; font-weight: 600; margin-bottom: 0.5rem; margin-top: 1rem;">Target Date</label>
                    <input type="date" value="${selectedComponent.data.targetDate}" onchange="updateComponentData('targetDate', this.value)" class="form-control">
                    
                    <label style="display: block; font-weight: 600; margin-bottom: 0.5rem; margin-top: 1rem;">Target Time (HH:MM:SS)</label>
                    <input type="time" step="1" value="${selectedComponent.data.targetTime}" onchange="updateComponentData('targetTime', this.value)" class="form-control">
                    
                    <label style="display: block; font-weight: 600; margin-bottom: 0.5rem; margin-top: 1rem;">Background Color</label>
                    <input type="color" value="${selectedComponent.data.backgroundColor}" onchange="updateComponentData('backgroundColor', this.value)" class="form-control">
                    
                    <label style="display: block; font-weight: 600; margin-bottom: 0.5rem; margin-top: 1rem;">Text Color</label>
                    <input type="color" value="${selectedComponent.data.textColor}" onchange="updateComponentData('textColor', this.value)" class="form-control">
                </div>
            `;
            break;
            
        case 'quote':
            html = `
                <div class="form-group" style="margin-bottom: 1rem;">
                    <label style="display: block; font-weight: 600; margin-bottom: 0.5rem;">Quote Text</label>
                    <textarea onchange="updateComponentData('quote', this.value)" class="form-control" rows="4">${selectedComponent.data.quote}</textarea>
                    
                    <label style="display: block; font-weight: 600; margin-bottom: 0.5rem; margin-top: 1rem;">Author</label>
                    <input type="text" value="${selectedComponent.data.author}" onchange="updateComponentData('author', this.value)" class="form-control">
                    
                    <label style="display: block; font-weight: 600; margin-bottom: 0.5rem; margin-top: 1rem;">Quote Size</label>
                    <select onchange="updateComponentData('quoteSize', this.value)" class="form-control">
                        <option value="1.5rem" ${selectedComponent.data.quoteSize === '1.5rem' ? 'selected' : ''}>Small</option>
                        <option value="2rem" ${selectedComponent.data.quoteSize === '2rem' ? 'selected' : ''}>Medium</option>
                        <option value="2.5rem" ${selectedComponent.data.quoteSize === '2.5rem' ? 'selected' : ''}>Large</option>
                    </select>
                    
                    <label style="display: block; font-weight: 600; margin-bottom: 0.5rem; margin-top: 1rem;">Background Color</label>
                    <input type="color" value="${selectedComponent.data.backgroundColor}" onchange="updateComponentData('backgroundColor', this.value)" class="form-control">
                </div>
            `;
            break;
            
        case 'steps':
            html = `
                <div class="form-group" style="margin-bottom: 1rem;">
                    <label style="display: block; font-weight: 600; margin-bottom: 0.5rem;">Heading</label>
                    <input type="text" value="${selectedComponent.data.heading}" onchange="updateComponentData('heading', this.value)" class="form-control">
                    
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 1.5rem; margin-bottom: 1rem;">
                        <h4 style="margin: 0;">Steps (${selectedComponent.data.steps.length})</h4>
                        <button onclick="addStep()" style="padding: 0.5rem 1rem; background: #0066cc; color: white; border: none; border-radius: 0.5rem; cursor: pointer; font-weight: 600;">+ Add</button>
                    </div>
                    
                    ${selectedComponent.data.steps.map((step, i) => `
                        <div style="background: #f8fafc; padding: 1rem; border-radius: 0.5rem; margin-bottom: 1rem; position: relative;">
                            <button onclick="deleteStep(${i})" style="position: absolute; top: 0.5rem; right: 0.5rem; background: #ef4444; color: white; border: none; border-radius: 0.375rem; padding: 0.25rem 0.5rem; cursor: pointer; font-weight: 600;">Delete</button>
                            
                            <label style="display: block; font-weight: 600; margin-bottom: 0.5rem;">Number</label>
                            <input type="text" value="${step.number}" onchange="updateStep(${i}, 'number', this.value)" class="form-control" style="margin-bottom: 0.5rem;">
                            
                            <label style="display: block; font-weight: 600; margin-bottom: 0.5rem;">Title</label>
                            <input type="text" value="${step.title}" onchange="updateStep(${i}, 'title', this.value)" class="form-control" style="margin-bottom: 0.5rem;">
                            
                            <label style="display: block; font-weight: 600; margin-bottom: 0.5rem;">Description</label>
                            <textarea onchange="updateStep(${i}, 'description', this.value)" class="form-control" rows="2">${step.description}</textarea>
                        </div>
                    `).join('')}
                </div>
            `;
            break;
            
        case 'banner':
            html = `
                <div class="form-group" style="margin-bottom: 1rem;">
                    <label style="display: block; font-weight: 600; margin-bottom: 0.5rem;">Text</label>
                    <input type="text" value="${selectedComponent.data.text}" onchange="updateComponentData('text', this.value)" class="form-control">
                    
                    <label style="display: block; font-weight: 600; margin-bottom: 0.5rem; margin-top: 1rem;">Button Text (optional)</label>
                    <input type="text" value="${selectedComponent.data.buttonText}" onchange="updateComponentData('buttonText', this.value)" class="form-control">
                    
                    <label style="display: block; font-weight: 600; margin-bottom: 0.5rem; margin-top: 1rem;">Button URL</label>
                    <input type="text" value="${selectedComponent.data.buttonUrl}" onchange="updateComponentData('buttonUrl', this.value)" class="form-control">
                    
                    <label style="display: block; font-weight: 600; margin-bottom: 0.5rem; margin-top: 1rem;">Background Color</label>
                    <input type="color" value="${selectedComponent.data.backgroundColor}" onchange="updateComponentData('backgroundColor', this.value)" class="form-control">
                    
                    <label style="display: block; font-weight: 600; margin-bottom: 0.5rem; margin-top: 1rem;">Text Color</label>
                    <input type="color" value="${selectedComponent.data.textColor}" onchange="updateComponentData('textColor', this.value)" class="form-control">
                    
                    <label style="display: flex; align-items: center; gap: 0.5rem; margin-top: 1rem; cursor: pointer;">
                        <input type="checkbox" ${selectedComponent.data.dismissible ? 'checked' : ''} onchange="updateComponentData('dismissible', this.checked)">
                        <span style="font-weight: 600;">Dismissible (show X button)</span>
                    </label>
                </div>
            `;
            break;
            
        case 'metrics':
            html = `
                <div class="form-group" style="margin-bottom: 1rem;">
                    <label style="display: block; font-weight: 600; margin-bottom: 0.5rem;">Background Color</label>
                    <input type="color" value="${selectedComponent.data.backgroundColor}" onchange="updateComponentData('backgroundColor', this.value)" class="form-control">
                    
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 1.5rem; margin-bottom: 1rem;">
                        <h4 style="margin: 0;">Metrics (${selectedComponent.data.metrics.length})</h4>
                        <button onclick="addMetric()" style="padding: 0.5rem 1rem; background: #0066cc; color: white; border: none; border-radius: 0.5rem; cursor: pointer; font-weight: 600;">+ Add</button>
                    </div>
                    
                    ${selectedComponent.data.metrics.map((metric, i) => `
                        <div style="background: #f8fafc; padding: 1rem; border-radius: 0.5rem; margin-bottom: 1rem; position: relative;">
                            <button onclick="deleteMetric(${i})" style="position: absolute; top: 0.5rem; right: 0.5rem; background: #ef4444; color: white; border: none; border-radius: 0.375rem; padding: 0.25rem 0.5rem; cursor: pointer; font-weight: 600;">Delete</button>
                            
                            <label style="display: block; font-weight: 600; margin-bottom: 0.5rem;">Icon (emoji)</label>
                            <input type="text" value="${metric.icon}" onchange="updateMetric(${i}, 'icon', this.value)" class="form-control" maxlength="2" style="margin-bottom: 0.5rem;">
                            
                            <label style="display: block; font-weight: 600; margin-bottom: 0.5rem;">Number</label>
                            <input type="text" value="${metric.number}" onchange="updateMetric(${i}, 'number', this.value)" class="form-control" style="margin-bottom: 0.5rem;">
                            
                            <label style="display: block; font-weight: 600; margin-bottom: 0.5rem;">Label</label>
                            <input type="text" value="${metric.label}" onchange="updateMetric(${i}, 'label', this.value)" class="form-control">
                        </div>
                    `).join('')}
                </div>
            `;
            break;
            
        case 'portfolio':
            html = `
                <div class="form-group" style="margin-bottom: 1rem;">
                    <label style="display: block; font-weight: 600; margin-bottom: 0.5rem;">Heading</label>
                    <input type="text" value="${selectedComponent.data.heading}" onchange="updateComponentData('heading', this.value)" class="form-control">
                    
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 1.5rem; margin-bottom: 1rem;">
                        <h4 style="margin: 0;">Projects (${selectedComponent.data.projects.length})</h4>
                        <button onclick="addProject()" style="padding: 0.5rem 1rem; background: #0066cc; color: white; border: none; border-radius: 0.5rem; cursor: pointer; font-weight: 600;">+ Add</button>
                    </div>
                    
                    ${selectedComponent.data.projects.map((project, i) => `
                        <div style="background: #f8fafc; padding: 1rem; border-radius: 0.5rem; margin-bottom: 1rem; position: relative;">
                            <button onclick="deleteProject(${i})" style="position: absolute; top: 0.5rem; right: 0.5rem; background: #ef4444; color: white; border: none; border-radius: 0.375rem; padding: 0.25rem 0.5rem; cursor: pointer; font-weight: 600;">Delete</button>
                            
                            <img src="${project.image}" style="width: 100%; height: 100px; object-fit: cover; border-radius: 0.5rem; margin-bottom: 0.5rem;">
                            
                            <label style="display: block; font-weight: 600; margin-bottom: 0.5rem; font-size: 0.875rem;">Image URL</label>
                            <input type="text" value="${project.image}" onchange="updateProject(${i}, 'image', this.value)" class="form-control" style="margin-bottom: 0.5rem;">
                            
                            <label style="display: block; font-weight: 600; margin-bottom: 0.5rem; font-size: 0.875rem;">Title</label>
                            <input type="text" value="${project.title}" onchange="updateProject(${i}, 'title', this.value)" class="form-control" style="margin-bottom: 0.5rem;">
                            
                            <label style="display: block; font-weight: 600; margin-bottom: 0.5rem; font-size: 0.875rem;">Category</label>
                            <input type="text" value="${project.category}" onchange="updateProject(${i}, 'category', this.value)" class="form-control">
                        </div>
                    `).join('')}
                </div>
            `;
            break;
            
        case 'columns':
            html = `
                <div class="form-group" style="margin-bottom: 1rem;">
                    <label style="display: block; font-weight: 600; margin-bottom: 0.5rem;">Number of Columns</label>
                    <select onchange="updateColumnCount(this.value)" class="form-control">
                        <option value="2" ${selectedComponent.data.columnCount === 2 ? 'selected' : ''}>2 Columns</option>
                        <option value="3" ${selectedComponent.data.columnCount === 3 ? 'selected' : ''}>3 Columns</option>
                        <option value="4" ${selectedComponent.data.columnCount === 4 ? 'selected' : ''}>4 Columns</option>
                    </select>
                    
                    <label style="display: block; font-weight: 600; margin-bottom: 0.5rem; margin-top: 1rem;">Background Color</label>
                    <input type="color" value="${selectedComponent.data.backgroundColor}" onchange="updateComponentData('backgroundColor', this.value)" class="form-control">
                    
                    <h4 style="margin-top: 1.5rem; margin-bottom: 1rem;">Column Content</h4>
                    ${selectedComponent.data.columns.map((col, i) => `
                        <div style="background: #f8fafc; padding: 1rem; border-radius: 0.5rem; margin-bottom: 1rem;">
                            <label style="display: block; font-weight: 600; margin-bottom: 0.5rem;">Column ${i + 1}</label>
                            <textarea onchange="updateColumn(${i}, this.value)" class="form-control" rows="3">${col.content}</textarea>
                        </div>
                    `).join('')}
                </div>
            `;
            break;
            
        case 'separator':
            html = `
                <div class="form-group" style="margin-bottom: 1rem;">
                    <label style="display: block; font-weight: 600; margin-bottom: 0.5rem;">Style</label>
                    <select onchange="updateComponentData('style', this.value)" class="form-control">
                        <option value="solid" ${selectedComponent.data.style === 'solid' ? 'selected' : ''}>Solid</option>
                        <option value="dashed" ${selectedComponent.data.style === 'dashed' ? 'selected' : ''}>Dashed</option>
                        <option value="dotted" ${selectedComponent.data.style === 'dotted' ? 'selected' : ''}>Dotted</option>
                    </select>
                    
                    <label style="display: block; font-weight: 600; margin-bottom: 0.5rem; margin-top: 1rem;">Width</label>
                    <select onchange="updateComponentData('width', this.value)" class="form-control">
                        <option value="25%" ${selectedComponent.data.width === '25%' ? 'selected' : ''}>25%</option>
                        <option value="50%" ${selectedComponent.data.width === '50%' ? 'selected' : ''}>50%</option>
                        <option value="75%" ${selectedComponent.data.width === '75%' ? 'selected' : ''}>75%</option>
                        <option value="100%" ${selectedComponent.data.width === '100%' ? 'selected' : ''}>100%</option>
                    </select>
                    
                    <label style="display: block; font-weight: 600; margin-bottom: 0.5rem; margin-top: 1rem;">Color</label>
                    <input type="color" value="${selectedComponent.data.color}" onchange="updateComponentData('color', this.value)" class="form-control">
                    
                    <label style="display: block; font-weight: 600; margin-bottom: 0.5rem; margin-top: 1rem;">Thickness</label>
                    <select onchange="updateComponentData('thickness', this.value)" class="form-control">
                        <option value="1px" ${selectedComponent.data.thickness === '1px' ? 'selected' : ''}>1px</option>
                        <option value="2px" ${selectedComponent.data.thickness === '2px' ? 'selected' : ''}>2px</option>
                        <option value="3px" ${selectedComponent.data.thickness === '3px' ? 'selected' : ''}>3px</option>
                        <option value="4px" ${selectedComponent.data.thickness === '4px' ? 'selected' : ''}>4px</option>
                    </select>
                    
                    <label style="display: block; font-weight: 600; margin-bottom: 0.5rem; margin-top: 1rem;">Spacing (top/bottom)</label>
                    <select onchange="updateComponentData('spacing', this.value)" class="form-control">
                        <option value="1rem" ${selectedComponent.data.spacing === '1rem' ? 'selected' : ''}>Small</option>
                        <option value="2rem" ${selectedComponent.data.spacing === '2rem' ? 'selected' : ''}>Medium</option>
                        <option value="3rem" ${selectedComponent.data.spacing === '3rem' ? 'selected' : ''}>Large</option>
                        <option value="4rem" ${selectedComponent.data.spacing === '4rem' ? 'selected' : ''}>Extra Large</option>
                    </select>
                </div>
            `;
            break;
            
        case 'graph':
            html = `
                <div class="form-group" style="margin-bottom: 1rem;">
                    <label style="display: block; font-weight: 600; margin-bottom: 0.5rem;">Heading</label>
                    <input type="text" value="${selectedComponent.data.heading}" onchange="updateComponentData('heading', this.value)" class="form-control">
                    
                    <label style="display: block; font-weight: 600; margin-bottom: 0.5rem; margin-top: 1rem;">Chart Type</label>
                    <select onchange="updateComponentData('chartType', this.value)" class="form-control">
                        <option value="bar" ${selectedComponent.data.chartType === 'bar' ? 'selected' : ''}>Bar Chart</option>
                        <option value="line" ${selectedComponent.data.chartType === 'line' ? 'selected' : ''}>Line Chart</option>
                        <option value="pie" ${selectedComponent.data.chartType === 'pie' ? 'selected' : ''}>Pie Chart</option>
                        <option value="doughnut" ${selectedComponent.data.chartType === 'doughnut' ? 'selected' : ''}>Doughnut Chart</option>
                    </select>
                    <small style="display: block; margin-top: 0.25rem; color: #64748b;">Bar & Line support multiple datasets. Pie/Doughnut use first dataset only.</small>
                    
                    <label style="display: block; font-weight: 600; margin-bottom: 0.5rem; margin-top: 1rem;">Labels (comma-separated)</label>
                    <input type="text" value="${selectedComponent.data.labels.join(', ')}" onchange="updateGraphLabels(this.value)" class="form-control">
                    <small style="display: block; margin-top: 0.25rem; color: #64748b;">Example: Jan, Feb, Mar, Apr</small>
                    
                    <label style="display: block; font-weight: 600; margin-bottom: 0.5rem; margin-top: 1rem;">Chart Height</label>
                    <select onchange="updateComponentData('height', this.value)" class="form-control">
                        <option value="300px" ${selectedComponent.data.height === '300px' ? 'selected' : ''}>Small (300px)</option>
                        <option value="400px" ${selectedComponent.data.height === '400px' ? 'selected' : ''}>Medium (400px)</option>
                        <option value="500px" ${selectedComponent.data.height === '500px' ? 'selected' : ''}>Large (500px)</option>
                    </select>
                    
                    <label style="display: flex; align-items: center; gap: 0.5rem; margin-top: 1rem; cursor: pointer;">
                        <input type="checkbox" ${selectedComponent.data.showLegend ? 'checked' : ''} onchange="updateComponentData('showLegend', this.checked)">
                        <span style="font-weight: 600;">Show Legend</span>
                    </label>
                    
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 1.5rem; margin-bottom: 1rem;">
                        <h4 style="margin: 0;">Datasets (${selectedComponent.data.datasets.length})</h4>
                        <button onclick="addGraphDataset()" style="padding: 0.5rem 1rem; background: #0066cc; color: white; border: none; border-radius: 0.5rem; cursor: pointer; font-weight: 600;">+ Add Dataset</button>
                    </div>
                    
                    ${selectedComponent.data.datasets.map((ds, i) => `
                        <div style="background: #f8fafc; padding: 1rem; border-radius: 0.5rem; margin-bottom: 1rem; position: relative;">
                            ${selectedComponent.data.datasets.length > 1 ? `<button onclick="deleteGraphDataset(${i})" style="position: absolute; top: 0.5rem; right: 0.5rem; background: #ef4444; color: white; border: none; border-radius: 0.375rem; padding: 0.25rem 0.5rem; cursor: pointer; font-weight: 600;">Delete</button>` : ''}
                            
                            <label style="display: block; font-weight: 600; margin-bottom: 0.5rem;">Dataset ${i + 1} Label</label>
                            <input type="text" value="${ds.label}" onchange="updateDataset(${i}, 'label', this.value)" class="form-control" style="margin-bottom: 0.5rem;">
                            
                            <label style="display: block; font-weight: 600; margin-bottom: 0.5rem;">Data Values (comma-separated numbers)</label>
                            <input type="text" value="${ds.data.join(', ')}" onchange="updateDatasetData(${i}, this.value)" class="form-control" style="margin-bottom: 0.5rem;">
                            <small style="display: block; margin-top: 0.25rem; color: #64748b;">Example: 65, 59, 80, 81, 56, 55 (should match number of labels)</small>
                            
                            <label style="display: block; font-weight: 600; margin-bottom: 0.5rem;">Color</label>
                            <input type="color" value="${ds.color}" onchange="updateDataset(${i}, 'color', this.value)" class="form-control">
                        </div>
                    `).join('')}
                </div>
            `;
            break;
            
        default:
            html = '<p class="text-muted">Select a component to edit its properties</p>';
    }
    
    panel.innerHTML = html;
    
    // Re-attach background type toggle listeners
    const bgTypeSelect = panel.querySelector('select[onchange*="backgroundType"]');
    if (bgTypeSelect) {
        bgTypeSelect.addEventListener('change', function() {
            const solidDiv = document.getElementById('solidBg') || document.getElementById('ctaSolidBg');
            const gradientDiv = document.getElementById('gradientBg') || document.getElementById('ctaGradientBg');
            
            if (solidDiv && gradientDiv) {
                if (this.value === 'solid') {
                    solidDiv.style.display = 'block';
                    gradientDiv.style.display = 'none';
                } else {
                    solidDiv.style.display = 'none';
                    gradientDiv.style.display = 'block';
                }
            }
        });
    }
}

function hidePropertiesPanel() {
    const panel = document.getElementById('propertiesContent');
    panel.innerHTML = '<p class="text-muted">Select a component to edit its properties</p>';
}

// Update Component Data
function updateComponentData(field, value) {
    console.log('updateComponentData called:', field, value);
    if (selectedComponent) {
        selectedComponent.data[field] = value;
        console.log('Component data updated:', selectedComponent.data);
        renderCanvas();
        saveProject();
    } else {
        console.error('No component selected!');
    }
}

// Make sure it's available globally
window.updateComponentData = updateComponentData;

function updateFeature(index, key, value) {
    if (selectedComponent && selectedComponent.data.features[index]) {
        selectedComponent.data.features[index][key] = value;
        renderCanvas();
        saveProject();
    }
}

function updateGalleryImage(index, value) {
    if (selectedComponent && selectedComponent.data.images[index] !== undefined) {
        selectedComponent.data.images[index] = value;
        renderCanvas();
        saveProject();
    }
}

// Add/Delete Features
function addFeature() {
    if (selectedComponent && selectedComponent.type === 'features') {
        selectedComponent.data.features.push({
            icon: '⭐',
            title: 'New Feature',
            description: 'Add your description here'
        });
        showPropertiesPanel();
        renderCanvas();
        saveProject();
    }
}

function deleteFeature(index) {
    if (selectedComponent && selectedComponent.type === 'features') {
        if (selectedComponent.data.features.length <= 1) {
            alert('You need at least one feature');
            return;
        }
        
        if (confirm('Delete this feature?')) {
            selectedComponent.data.features.splice(index, 1);
            showPropertiesPanel();
            renderCanvas();
            saveProject();
        }
    }
}

// Add/Delete Gallery Images
function addGalleryImage() {
    if (selectedComponent && selectedComponent.type === 'gallery') {
        selectedComponent.data.images.push('https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400');
        showPropertiesPanel();
        renderCanvas();
        saveProject();
    }
}

function deleteGalleryImage(index) {
    if (selectedComponent && selectedComponent.type === 'gallery') {
        if (selectedComponent.data.images.length <= 1) {
            alert('You need at least one image');
            return;
        }
        
        if (confirm('Delete this image?')) {
            selectedComponent.data.images.splice(index, 1);
            showPropertiesPanel();
            renderCanvas();
            saveProject();
        }
    }
}

// Image Upload Handlers
async function handleImageUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const formData = new FormData();
    formData.append('file', file);
    
    try {
        const response = await fetch('/api/upload', {
            method: 'POST',
            body: formData
        });
        
        const data = await response.json();
        
        if (response.ok && data.url) {
            updateComponentData('src', data.url);
            showPropertiesPanel(); // Refresh panel
        } else {
            alert(data.error || 'Upload failed');
        }
    } catch (error) {
        alert('Upload error: ' + error.message);
    }
}

async function handleGalleryImageUpload(index, event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const formData = new FormData();
    formData.append('file', file);
    
    try {
        const response = await fetch('/api/upload', {
            method: 'POST',
            body: formData
        });
        
        const data = await response.json();
        
        if (response.ok && data.url) {
            updateGalleryImage(index, data.url);
            showPropertiesPanel(); // Refresh panel
        } else {
            alert(data.error || 'Upload failed');
        }
    } catch (error) {
        alert('Upload error: ' + error.message);
    }
}

// Theme
function applyTheme() {
    document.getElementById('pageTitle').value = settings.title;
    document.getElementById('primaryColor').value = settings.theme.primaryColor;
    document.getElementById('backgroundColor').value = settings.theme.backgroundColor;
    document.getElementById('textColor').value = settings.theme.textColor;
    document.getElementById('fontFamily').value = settings.theme.font;
}

// Event Listeners
function setupEventListeners() {
    projectTitle.addEventListener('input', saveProject);
    
    document.getElementById('themePanelToggle').addEventListener('click', () => {
        themePanel.style.display = themePanel.style.display === 'none' ? 'block' : 'none';
    });
    
    document.getElementById('closeThemePanel').addEventListener('click', () => {
        themePanel.style.display = 'none';
    });
    
    document.getElementById('pageTitle').addEventListener('input', (e) => {
        settings.title = e.target.value;
        saveProject();
    });
    
    document.getElementById('primaryColor').addEventListener('input', (e) => {
        settings.theme.primaryColor = e.target.value;
        renderCanvas();
        saveProject();
    });
    
    document.getElementById('backgroundColor').addEventListener('input', (e) => {
        settings.theme.backgroundColor = e.target.value;
        saveProject();
    });
    
    document.getElementById('textColor').addEventListener('input', (e) => {
        settings.theme.textColor = e.target.value;
        saveProject();
    });
    
    document.getElementById('fontFamily').addEventListener('change', (e) => {
        settings.theme.font = e.target.value;
        saveProject();
    });
    
    document.getElementById('exportBtn').addEventListener('click', () => {
        document.getElementById('exportModal').style.display = 'flex';
    });
    
    document.getElementById('previewBtn').addEventListener('click', async () => {
        try {
            // Save first to ensure latest changes
            await fetch(`/api/projects/${projectId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: projectTitle.value,
                    content: JSON.stringify(components),
                    settings: JSON.stringify(settings)
                })
            });
            
            // Then get the preview
            const response = await fetch(`/api/export/${projectId}/html`);
            const data = await response.json();
            
            if (response.ok && data.html) {
                const iframe = document.getElementById('previewFrame');
                iframe.srcdoc = data.html;
                document.getElementById('previewModal').style.display = 'flex';
            } else {
                alert('Failed to generate preview: ' + (data.error || 'Unknown error'));
            }
        } catch (error) {
            console.error('Preview error:', error);
            alert('Failed to generate preview. Check console for details.');
        }
    });
        
    document.querySelectorAll('.export-option').forEach(btn => {
        btn.addEventListener('click', async () => {
            const format = btn.dataset.format;
            
            if (format === 'zip') {
                window.location.href = `/api/export/${projectId}/zip`;
                document.getElementById('exportModal').style.display = 'none';
            } else {
                const response = await fetch(`/api/export/${projectId}/${format}`);
                
                if (response.ok) {
                    const data = await response.json();
                    
                    const blob = new Blob([data.html || data.code], { type: 'text/plain' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `${projectTitle.value.replace(/\s+/g, '_')}.${format}`;
                    a.click();
                    
                    document.getElementById('exportModal').style.display = 'none';
                } else {
                    const data = await response.json();
                    alert(data.error || 'Export failed');
                }
            }
        });
    });
    
    document.querySelectorAll('.modal-close').forEach(btn => {
        btn.addEventListener('click', () => {
            btn.closest('.modal').style.display = 'none';
        });
    });
}

// Toggle collapsible sections
window.toggleSection = function(sectionId) {
    const content = document.getElementById('section-' + sectionId);
    const toggle = document.getElementById('toggle-' + sectionId);
    
    if (content.classList.contains('collapsed')) {
        content.classList.remove('collapsed');
        toggle.textContent = '−';
    } else {
        content.classList.add('collapsed');
        toggle.textContent = '+';
    }
}

// Clear all components
window.clearCanvas = function() {
    if (confirm('Are you sure you want to clear all components? This cannot be undone.')) {
        components = [];
        selectedComponent = null;
        hidePropertiesPanel();
        renderCanvas();
        saveProject();
    }
}

// Initialize
function init() {
    loadProject().then(() => {
        setupEventListeners();
        renderCanvas();
        // Setup drag and drop after everything is loaded
        setTimeout(() => {
            setupDragAndDrop();
            console.log('Drag and drop initialized');
        }, 200);
    });
}

init();

// Testimonials
window.addTestimonial = function() {
    if (selectedComponent && selectedComponent.type === 'testimonials') {
        selectedComponent.data.testimonials.push({
            rating: 5,
            text: 'Great service!',
            name: 'Customer Name',
            role: 'Position'
        });
        showPropertiesPanel();
        renderCanvas();
        saveProject();
    }
}

window.deleteTestimonial = function(index) {
    if (selectedComponent && selectedComponent.type === 'testimonials' && selectedComponent.data.testimonials.length > 1) {
        if (confirm('Delete this testimonial?')) {
            selectedComponent.data.testimonials.splice(index, 1);
            showPropertiesPanel();
            renderCanvas();
            saveProject();
        }
    }
}

window.updateTestimonial = function(index, field, value) {
    if (selectedComponent && selectedComponent.type === 'testimonials') {
        selectedComponent.data.testimonials[index][field] = value;
        renderCanvas();
        saveProject();
    }
}

// Pricing Plans
window.addPlan = function() {
    if (selectedComponent && selectedComponent.type === 'pricing') {
        selectedComponent.data.plans.push({
            name: 'New Plan',
            price: '19',
            features: ['Feature 1', 'Feature 2', 'Feature 3'],
            buttonText: 'Get Started',
            buttonUrl: '#'
        });
        showPropertiesPanel();
        renderCanvas();
        saveProject();
    }
}

window.deletePlan = function(index) {
    if (selectedComponent && selectedComponent.type === 'pricing' && selectedComponent.data.plans.length > 1) {
        if (confirm('Delete this plan?')) {
            selectedComponent.data.plans.splice(index, 1);
            showPropertiesPanel();
            renderCanvas();
            saveProject();
        }
    }
}

window.updatePlan = function(index, field, value) {
    if (selectedComponent && selectedComponent.type === 'pricing') {
        selectedComponent.data.plans[index][field] = value;
        renderCanvas();
        saveProject();
    }
}

window.updatePlanFeatures = function(index, value) {
    if (selectedComponent && selectedComponent.type === 'pricing') {
        selectedComponent.data.plans[index].features = value.split(',').map(f => f.trim());
        renderCanvas();
        saveProject();
    }
}

// Logos
window.addLogo = function() {
    if (selectedComponent && selectedComponent.type === 'logos') {
        selectedComponent.data.logos.push('https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=200&h=80&fit=crop');
        showPropertiesPanel();
        renderCanvas();
        saveProject();
    }
}

window.deleteLogo = function(index) {
    if (selectedComponent && selectedComponent.type === 'logos' && selectedComponent.data.logos.length > 1) {
        if (confirm('Delete this logo?')) {
            selectedComponent.data.logos.splice(index, 1);
            showPropertiesPanel();
            renderCanvas();
            saveProject();
        }
    }
}

window.updateLogo = function(index, value) {
    if (selectedComponent && selectedComponent.type === 'logos') {
        selectedComponent.data.logos[index] = value;
        renderCanvas();
        saveProject();
    }
}

window.handleLogoUpload = async function(index, event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const formData = new FormData();
    formData.append('file', file);
    
    try {
        const response = await fetch('/api/upload', {
            method: 'POST',
            body: formData
        });
        
        const data = await response.json();
        
        if (response.ok && data.url) {
            updateLogo(index, data.url);
            showPropertiesPanel();
        } else {
            alert(data.error || 'Upload failed');
        }
    } catch (error) {
        alert('Upload error: ' + error.message);
    }
}

// Footer Columns
window.addFooterColumn = function() {
    if (selectedComponent && selectedComponent.type === 'footer') {
        selectedComponent.data.columns.push({
            title: 'New Column',
            links: ['Link 1', 'Link 2', 'Link 3']
        });
        showPropertiesPanel();
        renderCanvas();
        saveProject();
    }
}

window.deleteFooterColumn = function(index) {
    if (selectedComponent && selectedComponent.type === 'footer' && selectedComponent.data.columns.length > 1) {
        if (confirm('Delete this column?')) {
            selectedComponent.data.columns.splice(index, 1);
            showPropertiesPanel();
            renderCanvas();
            saveProject();
        }
    }
}

window.updateFooterColumn = function(index, field, value) {
    if (selectedComponent && selectedComponent.type === 'footer') {
        selectedComponent.data.columns[index][field] = value;
        renderCanvas();
        saveProject();
    }
}

window.updateFooterColumnLinks = function(index, value) {
    if (selectedComponent && selectedComponent.type === 'footer') {
        selectedComponent.data.columns[index].links = value.split(',').map(l => l.trim());
        renderCanvas();
        saveProject();
    }
}

// Navbar
window.updateNavbarLinks = function(value) {
    if (selectedComponent && selectedComponent.type === 'navbar') {
        selectedComponent.data.links = value.split(',').map(l => l.trim());
        renderCanvas();
        saveProject();
    }
}

// Blog Posts
window.addBlogPost = function() {
    if (selectedComponent && selectedComponent.type === 'blog') {
        selectedComponent.data.posts.push({
            image: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=400',
            title: 'New Article',
            excerpt: 'Article description goes here.',
            date: 'Jan 1, 2025',
            readTime: '5 min read',
            link: '#'
        });
        showPropertiesPanel();
        renderCanvas();
        saveProject();
    }
}

window.deleteBlogPost = function(index) {
    if (selectedComponent && selectedComponent.type === 'blog' && selectedComponent.data.posts.length > 1) {
        if (confirm('Delete this blog post?')) {
            selectedComponent.data.posts.splice(index, 1);
            showPropertiesPanel();
            renderCanvas();
            saveProject();
        }
    }
}

window.updateBlogPost = function(index, field, value) {
    if (selectedComponent && selectedComponent.type === 'blog') {
        selectedComponent.data.posts[index][field] = value;
        renderCanvas();
        saveProject();
    }
}

// Skills (Progress Bars)
window.addSkill = function() {
    if (selectedComponent && selectedComponent.type === 'progress') {
        selectedComponent.data.skills.push({ name: 'New Skill', percentage: 75 });
        showPropertiesPanel();
        renderCanvas();
        saveProject();
    }
}

window.deleteSkill = function(index) {
    if (selectedComponent && selectedComponent.type === 'progress' && selectedComponent.data.skills.length > 1) {
        if (confirm('Delete this skill?')) {
            selectedComponent.data.skills.splice(index, 1);
            showPropertiesPanel();
            renderCanvas();
            saveProject();
        }
    }
}

window.updateSkill = function(index, field, value) {
    if (selectedComponent && selectedComponent.type === 'progress') {
        selectedComponent.data.skills[index][field] = value;
        renderCanvas();
        saveProject();
    }
}

// Social Links
window.addSocialLink = function() {
    if (selectedComponent && selectedComponent.type === 'social') {
        selectedComponent.data.links.push({
            platform: 'New Platform',
            url: 'https://example.com',
            icon: '🔗'
        });
        showPropertiesPanel();
        renderCanvas();
        saveProject();
    }
}

window.deleteSocialLink = function(index) {
    if (selectedComponent && selectedComponent.type === 'social' && selectedComponent.data.links.length > 1) {
        if (confirm('Delete this social link?')) {
            selectedComponent.data.links.splice(index, 1);
            showPropertiesPanel();
            renderCanvas();
            saveProject();
        }
    }
}

window.updateSocialLink = function(index, field, value) {
    if (selectedComponent && selectedComponent.type === 'social') {
        selectedComponent.data.links[index][field] = value;
        renderCanvas();
        saveProject();
    }
}

// Accordion
window.addAccordionItem = function() {
    if (selectedComponent && selectedComponent.type === 'accordion') {
        selectedComponent.data.items.push({ title: 'New Question', content: 'Your answer here' });
        showPropertiesPanel();
        renderCanvas();
        saveProject();
    }
}

window.deleteAccordionItem = function(index) {
    if (selectedComponent && selectedComponent.type === 'accordion' && selectedComponent.data.items.length > 1) {
        if (confirm('Delete this item?')) {
            selectedComponent.data.items.splice(index, 1);
            showPropertiesPanel();
            renderCanvas();
            saveProject();
        }
    }
}

window.updateAccordionItem = function(index, field, value) {
    if (selectedComponent && selectedComponent.type === 'accordion') {
        selectedComponent.data.items[index][field] = value;
        renderCanvas();
        saveProject();
    }
}

// Tabs
window.addTab = function() {
    if (selectedComponent && selectedComponent.type === 'tabs') {
        selectedComponent.data.tabs.push({ title: 'New Tab', content: 'Tab content here' });
        showPropertiesPanel();
        renderCanvas();
        saveProject();
    }
}

window.deleteTab = function(index) {
    if (selectedComponent && selectedComponent.type === 'tabs' && selectedComponent.data.tabs.length > 1) {
        if (confirm('Delete this tab?')) {
            selectedComponent.data.tabs.splice(index, 1);
            showPropertiesPanel();
            renderCanvas();
            saveProject();
        }
    }
}

window.updateTab = function(index, field, value) {
    if (selectedComponent && selectedComponent.type === 'tabs') {
        selectedComponent.data.tabs[index][field] = value;
        renderCanvas();
        saveProject();
    }
}

// Cards
window.addCard = function() {
    if (selectedComponent && selectedComponent.type === 'cards') {
        selectedComponent.data.cards.push({ icon: '⭐', title: 'New Card', description: 'Description here' });
        showPropertiesPanel();
        renderCanvas();
        saveProject();
    }
}

window.deleteCard = function(index) {
    if (selectedComponent && selectedComponent.type === 'cards' && selectedComponent.data.cards.length > 1) {
        if (confirm('Delete this card?')) {
            selectedComponent.data.cards.splice(index, 1);
            showPropertiesPanel();
            renderCanvas();
            saveProject();
        }
    }
}

window.updateCard = function(index, field, value) {
    if (selectedComponent && selectedComponent.type === 'cards') {
        selectedComponent.data.cards[index][field] = value;
        renderCanvas();
        saveProject();
    }
}

// Steps
window.addStep = function() {
    if (selectedComponent && selectedComponent.type === 'steps') {
        const nextNum = selectedComponent.data.steps.length + 1;
        selectedComponent.data.steps.push({ number: nextNum.toString(), title: 'New Step', description: 'Description' });
        showPropertiesPanel();
        renderCanvas();
        saveProject();
    }
}

window.deleteStep = function(index) {
    if (selectedComponent && selectedComponent.type === 'steps' && selectedComponent.data.steps.length > 1) {
        if (confirm('Delete this step?')) {
            selectedComponent.data.steps.splice(index, 1);
            showPropertiesPanel();
            renderCanvas();
            saveProject();
        }
    }
}

window.updateStep = function(index, field, value) {
    if (selectedComponent && selectedComponent.type === 'steps') {
        selectedComponent.data.steps[index][field] = value;
        renderCanvas();
        saveProject();
    }
}

// Metrics
window.addMetric = function() {
    if (selectedComponent && selectedComponent.type === 'metrics') {
        selectedComponent.data.metrics.push({ number: '100+', label: 'New Metric', icon: '📊' });
        showPropertiesPanel();
        renderCanvas();
        saveProject();
    }
}

window.deleteMetric = function(index) {
    if (selectedComponent && selectedComponent.type === 'metrics' && selectedComponent.data.metrics.length > 1) {
        if (confirm('Delete this metric?')) {
            selectedComponent.data.metrics.splice(index, 1);
            showPropertiesPanel();
            renderCanvas();
            saveProject();
        }
    }
}

window.updateMetric = function(index, field, value) {
    if (selectedComponent && selectedComponent.type === 'metrics') {
        selectedComponent.data.metrics[index][field] = value;
        renderCanvas();
        saveProject();
    }
}

// Portfolio
window.addProject = function() {
    if (selectedComponent && selectedComponent.type === 'portfolio') {
        selectedComponent.data.projects.push({
            image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500',
            title: 'New Project',
            category: 'Category'
        });
        showPropertiesPanel();
        renderCanvas();
        saveProject();
    }
}

window.deleteProject = function(index) {
    if (selectedComponent && selectedComponent.type === 'portfolio' && selectedComponent.data.projects.length > 1) {
        if (confirm('Delete this project?')) {
            selectedComponent.data.projects.splice(index, 1);
            showPropertiesPanel();
            renderCanvas();
            saveProject();
        }
    }
}

window.updateProject = function(index, field, value) {
    if (selectedComponent && selectedComponent.type === 'portfolio') {
        selectedComponent.data.projects[index][field] = value;
        renderCanvas();
        saveProject();
    }
}

// Columns
window.updateColumnCount = function(count) {
    if (selectedComponent && selectedComponent.type === 'columns') {
        const newCount = parseInt(count);
        const currentCount = selectedComponent.data.columns.length;
        
        if (newCount > currentCount) {
            for (let i = currentCount; i < newCount; i++) {
                selectedComponent.data.columns.push({ content: 'Column content here' });
            }
        } else if (newCount < currentCount) {
            selectedComponent.data.columns = selectedComponent.data.columns.slice(0, newCount);
        }
        
        selectedComponent.data.columnCount = newCount;
        showPropertiesPanel();
        renderCanvas();
        saveProject();
    }
}

window.updateColumn = function(index, value) {
    if (selectedComponent && selectedComponent.type === 'columns') {
        selectedComponent.data.columns[index].content = value;
        renderCanvas();
        saveProject();
    }
}

// Graph helpers
window.updateGraphLabels = function(value) {
    console.log('=== updateGraphLabels called ===');
    console.log('Value:', value);
    console.log('Selected component:', selectedComponent);
    
    if (!selectedComponent) {
        console.error('No component selected');
        return;
    }
    
    if (selectedComponent.type !== 'graph') {
        console.error('Selected component is not a graph:', selectedComponent.type);
        return;
    }
    
    selectedComponent.data.labels = value.split(',').map(l => l.trim()).filter(l => l.length > 0);
    console.log('New labels:', selectedComponent.data.labels);
    
    renderCanvas();
    saveProject();
}

window.updateDataset = function(index, field, value) {
    console.log('=== updateDataset called ===');
    console.log('Index:', index, 'Field:', field, 'Value:', value);
    console.log('Selected component:', selectedComponent);
    
    if (!selectedComponent) {
        console.error('No component selected');
        return;
    }
    
    if (selectedComponent.type !== 'graph') {
        console.error('Selected component is not a graph');
        return;
    }
    
    if (!selectedComponent.data.datasets[index]) {
        console.error('Dataset not found at index:', index);
        return;
    }
    
    selectedComponent.data.datasets[index][field] = value;
    console.log('Dataset after update:', selectedComponent.data.datasets[index]);
    
    renderCanvas();
    saveProject();
}

window.updateDatasetData = function(index, value) {
    console.log('=== updateDatasetData called ===');
    console.log('Index:', index, 'Value:', value);
    console.log('Selected component:', selectedComponent);
    
    if (!selectedComponent) {
        console.error('No component selected');
        return;
    }
    
    if (selectedComponent.type !== 'graph') {
        console.error('Selected component is not a graph');
        return;
    }
    
    if (!selectedComponent.data.datasets[index]) {
        console.error('Dataset not found at index:', index);
        return;
    }
    
    const newData = value.split(',').map(v => {
        const num = parseFloat(v.trim());
        return isNaN(num) ? 0 : num;
    });
    
    selectedComponent.data.datasets[index].data = newData;
    console.log('New data array:', newData);
    console.log('Full component data:', selectedComponent.data);
    
    renderCanvas();
    saveProject();
}

// Debug helper - you can remove this later
window.debugGraph = function() {
    console.log('=== GRAPH DEBUG ===');
    console.log('Selected component:', selectedComponent);
    if (selectedComponent && selectedComponent.type === 'graph') {
        console.log('Graph data:', JSON.stringify(selectedComponent.data, null, 2));
    }
    console.log('All components:', components);
}

// Graph Dataset Management
window.addGraphDataset = function() {
    if (selectedComponent && selectedComponent.type === 'graph') {
        const colors = ['#0066cc', '#764ba2', '#f093fb', '#4facfe', '#fa709a', '#43e97b', '#38f9d7'];
        const newColor = colors[selectedComponent.data.datasets.length % colors.length];
        
        // Create new dataset with same number of data points as labels
        const dataPoints = selectedComponent.data.labels.map(() => Math.floor(Math.random() * 100));
        
        selectedComponent.data.datasets.push({
            label: `Dataset ${selectedComponent.data.datasets.length + 1}`,
            data: dataPoints,
            color: newColor
        });
        
        showPropertiesPanel();
        renderCanvas();
        saveProject();
    }
}

window.deleteGraphDataset = function(index) {
    if (selectedComponent && selectedComponent.type === 'graph' && selectedComponent.data.datasets.length > 1) {
        if (confirm('Delete this dataset?')) {
            selectedComponent.data.datasets.splice(index, 1);
            showPropertiesPanel();
            renderCanvas();
            saveProject();
        }
    }
}
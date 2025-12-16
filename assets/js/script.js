/* ===============================================
   PORTFOLIO WEBSITE - MAIN JAVASCRIPT
   =============================================== */

// Mobile Menu Toggle
const menuToggle = document.getElementById('menuToggle');
const navMenu = document.getElementById('navMenu');

menuToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
});

// Close menu when link is clicked
const navLinks = document.querySelectorAll('.nav-link');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
    });
});

// Contact Form Handling
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Get form values
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const subject = document.getElementById('subject').value.trim();
    const message = document.getElementById('message').value.trim();

    // Validate form
    if (!validateForm(name, email, subject, message)) {
        return;
    }

    // Show sending status
    showFormStatus('Sending your message...', 'info');

    // Simulate form submission (replace with actual backend in production)
    setTimeout(() => {
        showFormStatus('Message sent successfully! I\'ll get back to you soon.', 'success');
        contactForm.reset();

        // Hide message after 5 seconds
        setTimeout(() => {
            formStatus.classList.remove('show');
        }, 5000);
    }, 1000);
});

/**
 * Validate contact form
 * @param {string} name
 * @param {string} email
 * @param {string} subject
 * @param {string} message
 * @returns {boolean}
 */
function validateForm(name, email, subject, message) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!name || name.length < 2) {
        showFormStatus('Please enter a valid name.', 'error');
        return false;
    }

    if (!email || !emailRegex.test(email)) {
        showFormStatus('Please enter a valid email address.', 'error');
        return false;
    }

    if (!subject || subject.length < 3) {
        showFormStatus('Please enter a valid subject.', 'error');
        return false;
    }

    if (!message || message.length < 10) {
        showFormStatus('Please enter a message (at least 10 characters).', 'error');
        return false;
    }

    return true;
}

/**
 * Display form status message
 * @param {string} message
 * @param {string} type - 'success', 'error', or 'info'
 */
function showFormStatus(message, type = 'info') {
    formStatus.textContent = message;
    formStatus.className = `form-status show ${type}`;
}

// Smooth scroll to sections
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && document.querySelector(href)) {
            e.preventDefault();
            const element = document.querySelector(href);
            element.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Animate elements on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeInUp 0.6s ease-in-out';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe elements
document.querySelectorAll('.project-card, .skill-group, .highlight-card, .tech-card').forEach(el => {
    observer.observe(el);
});

// Add animation styles dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);

// Log initialization
console.log('✨ Portfolio website loaded successfully!');

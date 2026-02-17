/* ===============================================
   PORTFOLIO WEBSITE - MAIN JAVASCRIPT
   =============================================== */

// Mobile Menu Toggle
const menuToggle = document.getElementById('menuToggle');
const navMenu = document.getElementById('navMenu');
const navbar = document.querySelector('.navbar');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (menuToggle && navMenu) {
    const syncMobileMenuOffset = () => {
        if (!navbar) {
            return;
        }

        document.documentElement.style.setProperty('--mobile-nav-offset', `${navbar.offsetHeight}px`);
    };

    syncMobileMenuOffset();
    let resizeRaf = null;
    window.addEventListener('resize', () => {
        if (resizeRaf !== null) {
            cancelAnimationFrame(resizeRaf);
        }

        resizeRaf = requestAnimationFrame(() => {
            syncMobileMenuOffset();
            resizeRaf = null;
        });
    });

    menuToggle.addEventListener('click', () => {
        const isOpen = navMenu.classList.toggle('active');
        menuToggle.setAttribute('aria-expanded', String(isOpen));
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            menuToggle.setAttribute('aria-expanded', 'false');
            menuToggle.focus();
        }
    });
}

// Navbar micro animation on scroll
if (navbar) {
    const syncNavbarState = () => {
        const hasScrolled = window.scrollY > 24;
        navbar.classList.toggle('navbar-scrolled', hasScrolled);
    };

    syncNavbarState();
    window.addEventListener('scroll', syncNavbarState, { passive: true });
}

// Close menu when link is clicked
const navLinks = document.querySelectorAll('.nav-link');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        if (navMenu && menuToggle) {
            navMenu.classList.remove('active');
            menuToggle.setAttribute('aria-expanded', 'false');
        }
    });
});

// Contact Form Handling
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');
const submitButton = contactForm ? contactForm.querySelector('button[type="submit"]') : null;

if (contactForm && formStatus) {
    contactForm.addEventListener('submit', async (e) => {
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
        if (submitButton) {
            submitButton.disabled = true;
            submitButton.textContent = 'Sending...';
        }

        try {
            const formData = new FormData(contactForm);
            const response = await fetch(contactForm.action, {
                method: 'POST',
                headers: {
                    Accept: 'application/json'
                },
                body: formData
            });

            if (!response.ok) {
                throw new Error('Form submission failed.');
            }

            showFormStatus('Message sent successfully! I\'ll get back to you soon.', 'success');
            contactForm.reset();
        } catch (error) {
            showFormStatus('Unable to send right now. You can contact me directly at kylejosefbonachita@gmail.com.', 'error');
        } finally {
            if (submitButton) {
                submitButton.disabled = false;
                submitButton.textContent = 'Send Message';
            }

            // Hide message after 5 seconds
            setTimeout(() => {
                formStatus.classList.remove('show');
            }, 5000);
        }
    });
}

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
    if (!formStatus) {
        return;
    }

    formStatus.textContent = message;
    formStatus.className = `form-status show ${type}`;
}

// Smooth scroll to sections
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#') {
            const targetId = href.slice(1);
            const element = document.getElementById(targetId);

            if (!element) {
                return;
            }

            e.preventDefault();
            element.scrollIntoView({
                behavior: prefersReducedMotion ? 'auto' : 'smooth',
                block: 'start'
            });
        }
    });
});

// Expandable cards and timeline items
const expandToggles = document.querySelectorAll('.expand-toggle');
const projectCards = document.querySelectorAll('.project-card');

const syncExpandedHeights = () => {
    document.querySelectorAll('.expandable.is-expanded .expand-content').forEach(content => {
        content.style.maxHeight = `${content.scrollHeight}px`;
    });
};

expandToggles.forEach(toggle => {
    toggle.addEventListener('click', () => {
        const expandable = toggle.closest('.expandable');
        if (!expandable) {
            return;
        }

        const content = expandable.querySelector('.expand-content');
        const isExpanded = expandable.classList.toggle('is-expanded');
        toggle.setAttribute('aria-expanded', String(isExpanded));

        if (content) {
            content.setAttribute('aria-hidden', String(!isExpanded));
            content.style.maxHeight = isExpanded ? `${content.scrollHeight}px` : '0px';
        }
    });
});

window.addEventListener('resize', () => {
    if (prefersReducedMotion) {
        return;
    }

    syncExpandedHeights();
});

// Project cards micro-animations on scroll + pointer movement
if (!prefersReducedMotion && projectCards.length > 0) {
    projectCards.forEach(card => {
        card.classList.add('is-scroll-primed');
    });

    if ('IntersectionObserver' in window) {
        const projectObserver = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) {
                    return;
                }

                entry.target.classList.add('is-scroll-in');
                obs.unobserve(entry.target);
            });
        }, {
            threshold: 0.2,
            rootMargin: '0px 0px -60px 0px'
        });

        projectCards.forEach(card => {
            projectObserver.observe(card);
        });
    } else {
        projectCards.forEach(card => card.classList.add('is-scroll-in'));
    }

    projectCards.forEach(card => {
        card.addEventListener('pointermove', (event) => {
            const rect = card.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
            const rotateY = ((x / rect.width) - 0.5) * 3.5;
            const rotateX = (0.5 - (y / rect.height)) * 2.5;

            card.style.transform = `translateY(-8px) scale(1.01) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg)`;
            card.classList.add('card-tilt');
        });

        card.addEventListener('pointerleave', () => {
            card.style.transform = '';
            card.classList.remove('card-tilt');
        });
    });
}

// Animate elements on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

let observer = null;
if (!prefersReducedMotion && 'IntersectionObserver' in window) {
    observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInUp 0.6s ease-in-out';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
}

// Observe elements
if (observer) {
    document
        .querySelectorAll(
            '.project-card, .skill-group, .highlight-card, .tech-card, .timeline-content, .contact-form, .contact-info'
        )
        .forEach(el => {
            observer.observe(el);
        });
}

// Add animation styles dynamically
if (!prefersReducedMotion) {
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
}

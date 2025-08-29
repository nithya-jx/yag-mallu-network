// YAG - Your Access Gate JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize the application
    initNavigation();
    initFormHandling();
    initAnimations();
    initMobileNav();
    
    // Show home section by default
    showSection('home');
});

// Navigation functionality
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section');
    const requestAccessBtn = document.getElementById('request-access-btn');

    // Handle navigation clicks
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            showSection(targetId);
            updateActiveNavLink(this);
        });
    });

    // Handle "Request Access" button click
    if (requestAccessBtn) {
        requestAccessBtn.addEventListener('click', function(e) {
            e.preventDefault();
            showSection('access');
            updateActiveNavLink(document.querySelector('[href="#access"]'));
        });
    }

    // Show specific section
    function showSection(targetId) {
        // Hide all sections
        sections.forEach(section => {
            section.classList.remove('active');
            section.style.display = 'none';
        });

        // Show target section
        const targetSection = document.getElementById(targetId);
        if (targetSection) {
            targetSection.style.display = 'block';
            targetSection.classList.add('active');
            
            // Reset any previous animations
            targetSection.style.opacity = '1';
            targetSection.style.transform = 'translateY(0)';
            targetSection.style.transition = 'none';
            
            // Animate section entry
            requestAnimationFrame(() => {
                targetSection.style.opacity = '0';
                targetSection.style.transform = 'translateY(20px)';
                targetSection.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
                
                requestAnimationFrame(() => {
                    targetSection.style.opacity = '1';
                    targetSection.style.transform = 'translateY(0)';
                });
            });
            
            // Scroll to top
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }

        // Close mobile menu if open
        closeMobileNav();
    }

    // Update active navigation link
    function updateActiveNavLink(activeLink) {
        navLinks.forEach(link => {
            link.classList.remove('active');
        });
        if (activeLink) {
            activeLink.classList.add('active');
        }
    }
    
    // Make showSection available globally
    window.showSection = showSection;
    window.updateActiveNavLink = updateActiveNavLink;
}

// Form handling
function initFormHandling() {
    const accessForm = document.getElementById('access-form');
    
    if (accessForm) {
        accessForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleAccessRequest();
        });
    }
}

function handleAccessRequest() {
    const form = document.getElementById('access-form');
    const submitBtn = form.querySelector('.form-submit');
    const formData = new FormData(form);
    
    // Collect form data
    const requestData = {
        fullName: formData.get('fullName'),
        age: formData.get('age'),
        location: formData.get('location'),
        seeking: formData.get('seeking'),
        message: formData.get('message')
    };

    // Validate form
    if (!validateAccessForm(requestData)) {
        return;
    }

    // Show loading state
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Processing Request...';
    submitBtn.disabled = true;
    submitBtn.style.opacity = '0.7';

    // Simulate form submission (in real implementation, this would send to a server)
    setTimeout(() => {
        showSuccessMessage();
        resetForm();
        
        // Reset button
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        submitBtn.style.opacity = '1';
    }, 2000);
}

function validateAccessForm(data) {
    const errors = [];

    if (!data.fullName || data.fullName.trim().length < 2) {
        errors.push('Please enter a valid full name');
    }

    if (!data.age || data.age < 18) {
        errors.push('You must be 18 or older to request access');
    }

    if (!data.location || data.location.trim().length < 2) {
        errors.push('Please enter your location');
    }

    if (!data.seeking) {
        errors.push('Please select what you are seeking from YAG');
    }

    if (!data.message || data.message.trim().length < 10) {
        errors.push('Please provide a brief message (at least 10 characters)');
    }

    if (errors.length > 0) {
        showErrorMessage(errors[0]);
        return false;
    }

    return true;
}

function showSuccessMessage() {
    const message = createNotification(
        'Access Request Submitted Successfully',
        'Thank you for your interest in YAG. We will review your request and respond within 48 hours. Check your email for further instructions.',
        'success'
    );
    document.body.appendChild(message);
}

function showErrorMessage(errorText) {
    const message = createNotification(
        'Please Check Your Information',
        errorText,
        'error'
    );
    document.body.appendChild(message);
}

function createNotification(title, text, type) {
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <h4 class="notification-title">${title}</h4>
            <p class="notification-text">${text}</p>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
        </div>
    `;

    // Add notification styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? 'rgba(80, 200, 120, 0.95)' : 'rgba(255, 84, 89, 0.95)'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        border: 1px solid ${type === 'success' ? '#50c878' : '#ff5459'};
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        z-index: 10000;
        max-width: 400px;
        transform: translateX(100%);
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    `;

    // Style the notification content
    const content = notification.querySelector('.notification-content');
    content.style.cssText = `
        position: relative;
    `;

    const titleEl = notification.querySelector('.notification-title');
    titleEl.style.cssText = `
        margin: 0 0 0.5rem 0;
        font-size: 1rem;
        font-weight: 600;
    `;

    const textEl = notification.querySelector('.notification-text');
    textEl.style.cssText = `
        margin: 0;
        font-size: 0.9rem;
        line-height: 1.4;
    `;

    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.style.cssText = `
        position: absolute;
        top: -5px;
        right: -5px;
        background: none;
        border: none;
        color: white;
        font-size: 1.5rem;
        cursor: pointer;
        width: 25px;
        height: 25px;
        display: flex;
        align-items: center;
        justify-content: center;
    `;

    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);

    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentElement) {
                    notification.remove();
                }
            }, 300);
        }
    }, 5000);

    return notification;
}

function resetForm() {
    const form = document.getElementById('access-form');
    if (form) {
        form.reset();
    }
}

// Animations and interactive effects
function initAnimations() {
    // Add entrance animations to elements when they come into view
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.pillar, .promise, .assurance-card');
    animatedElements.forEach(el => {
        el.style.cssText += `
            opacity: 0;
            transform: translateY(30px);
            transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        `;
        observer.observe(el);
    });

    // Add CSS for animation
    const style = document.createElement('style');
    style.textContent = `
        .animate-in {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);

    // Add subtle parallax effect to hero background elements
    let ticking = false;
    
    function updateParallax() {
        if (document.getElementById('home') && document.getElementById('home').classList.contains('active')) {
            const scrolled = window.pageYOffset;
            const parallaxElements = document.querySelectorAll('.palm-silhouette');
            
            parallaxElements.forEach((element, index) => {
                const speed = (index + 1) * 0.1;
                const rotation = index === 0 ? '-15deg' : '15deg';
                element.style.transform = `translateY(${scrolled * speed}px) rotate(${rotation})`;
            });
        }
        ticking = false;
    }
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(updateParallax);
            ticking = true;
        }
    });

    // Add hover effects to interactive elements
    addHoverEffects();
}

function addHoverEffects() {
    // Enhanced button hover effects
    const buttons = document.querySelectorAll('.btn-primary');
    buttons.forEach(btn => {
        btn.addEventListener('mouseenter', function() {
            this.style.boxShadow = '0 15px 40px rgba(212, 175, 55, 0.5)';
        });
        
        btn.addEventListener('mouseleave', function() {
            this.style.boxShadow = '0 10px 30px rgba(212, 175, 55, 0.4)';
        });
    });

    // Add ripple effect to cards
    const cards = document.querySelectorAll('.pillar, .promise, .assurance-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.boxShadow = '0 20px 50px rgba(212, 175, 55, 0.15)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.boxShadow = 'none';
        });
    });
}

// Mobile navigation
function initMobileNav() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            toggleMobileNav();
        });

        // Close mobile nav when clicking on a link
        const navLinks = navMenu.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                setTimeout(() => closeMobileNav(), 100);
            });
        });

        // Close mobile nav when clicking outside
        document.addEventListener('click', function(e) {
            if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
                closeMobileNav();
            }
        });
    }
}

function toggleMobileNav() {
    const navMenu = document.getElementById('nav-menu');
    
    if (navMenu.classList.contains('mobile-open')) {
        closeMobileNav();
    } else {
        openMobileNav();
    }
}

function openMobileNav() {
    const navMenu = document.getElementById('nav-menu');
    const navToggle = document.getElementById('nav-toggle');
    
    navMenu.classList.add('mobile-open');
    navMenu.style.cssText = `
        display: flex !important;
        flex-direction: column;
        position: absolute;
        top: 100%;
        left: 0;
        width: 100%;
        background: rgba(10, 10, 10, 0.98);
        backdrop-filter: blur(15px);
        border-top: 1px solid rgba(212, 175, 55, 0.2);
        padding: 1rem 2rem;
        gap: 1rem;
        transform: translateY(0);
        opacity: 1;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        z-index: 1000;
    `;
    
    // Animate hamburger
    const spans = navToggle.querySelectorAll('span');
    spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
    spans[1].style.opacity = '0';
    spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
}

function closeMobileNav() {
    const navMenu = document.getElementById('nav-menu');
    const navToggle = document.getElementById('nav-toggle');
    
    if (navMenu && navToggle) {
        navMenu.classList.remove('mobile-open');
        navMenu.style.cssText = '';
        
        // Reset hamburger
        const spans = navToggle.querySelectorAll('span');
        spans.forEach(span => {
            span.style.transform = 'none';
            span.style.opacity = '1';
        });
    }
}

// Utility functions
function debounce(func, wait, immediate) {
    let timeout;
    return function executedFunction() {
        const context = this;
        const args = arguments;
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

// Add loading state management
window.addEventListener('load', function() {
    // Remove any loading indicators and show content
    document.body.classList.add('loaded');
    
    // Add loaded class for additional styling
    const style = document.createElement('style');
    style.textContent = `
        body.loaded .hero-content {
            animation: fadeInUp 1s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
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
});

// Handle window resize for responsive adjustments
window.addEventListener('resize', debounce(function() {
    // Close mobile nav on resize to desktop
    if (window.innerWidth > 768) {
        closeMobileNav();
    }
}, 250));
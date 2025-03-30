// DOM Elements
const navContainer = document.querySelector('.nav-container');
const burger = document.querySelector('.burger');
const navLinks = document.querySelector('.nav-links');
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');
const sections = document.querySelectorAll('section');
const contactForm = document.getElementById('contactForm');

// Typing Animation Configuration
const typingContainer = document.querySelector('.typing-container');
const typingCursor = document.querySelector('.typing-cursor');
const textsToType = [
    "An IT vocational student",
    "Aspiring full-stack engineer",
    "Tech Enthusiast"
];
const typingConfig = {
    textIndex: 0,
    charIndex: 0,
    isDeleting: false,
    typingSpeed: 80,
    deletingSpeed: 40,
    delayBetweenTexts: 1000
};

// Typing Animation Function
function typeText() {
    const currentText = textsToType[typingConfig.textIndex];
    let displayText = '';

    if (typingConfig.isDeleting) {
        displayText = currentText.substring(0, typingConfig.charIndex - 1);
        typingConfig.charIndex--;
    } else {
        displayText = currentText.substring(0, typingConfig.charIndex + 1);
        typingConfig.charIndex++;
    }

    if (typingContainer) {
        typingContainer.textContent = displayText;
    }

    let typeSpeed = typingConfig.typingSpeed;

    if (typingConfig.isDeleting) {
        typeSpeed = typingConfig.deletingSpeed;
    }

    if (!typingConfig.isDeleting && typingConfig.charIndex === currentText.length) {
        typeSpeed = typingConfig.delayBetweenTexts;
        typingConfig.isDeleting = true;
    } else if (typingConfig.isDeleting && typingConfig.charIndex === 0) {
        typingConfig.isDeleting = false;
        typingConfig.textIndex = (typingConfig.textIndex + 1) % textsToType.length;
        typeSpeed = typingConfig.typingSpeed;
    }

    setTimeout(typeText, typeSpeed);
}

// Initialize typing animation
if (typingContainer && typingCursor) {
    setTimeout(typeText, 500);
}

// Navigation scroll effect
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navContainer.classList.add('scrolled');
    } else {
        navContainer.classList.remove('scrolled');
    }
});

// Burger menu toggle
burger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    burger.classList.toggle('toggle');
});

// Close mobile menu when link is clicked
document.querySelectorAll('.nav-links li a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        burger.classList.remove('toggle');
    });
});

// Smooth scroll for all anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            window.scrollTo({
                top: target.offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Project filtering
function filterProjects(category) {
    projectCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        if (category === 'all' || cardCategory === category) {
            card.style.display = 'block';
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 100);
        } else {
            card.style.opacity = '0';
            card.style.transform = 'translateY(50px)';
            setTimeout(() => {
                card.style.display = 'none';
            }, 300);
        }
    });
}

// Project filter button click
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove active class from all buttons
        filterBtns.forEach(b => b.classList.remove('active'));
        // Add active class to clicked button
        btn.classList.add('active');
        // Filter projects
        const category = btn.getAttribute('data-filter');
        filterProjects(category);
    });
});

// Contact form submission
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        // Get form data
        const formData = new FormData(contactForm);
        const formValues = Object.fromEntries(formData.entries());
        
        // Here you would normally handle form submission via AJAX
        // For demonstration, we'll just log the values and show success message
        console.log('Form submitted:', formValues);
        
        // Show success message
        const successMessage = document.createElement('div');
        successMessage.classList.add('form-success');
        successMessage.textContent = 'Message sent successfully!';
        
        // Clear form and append success message
        contactForm.reset();
        contactForm.appendChild(successMessage);
        
        // Remove success message after 3 seconds
        setTimeout(() => {
            successMessage.remove();
        }, 3000);
    });
}

// Scroll animations
function animateOnScroll() {
    sections.forEach(section => {
        // Add fade-in class to all sections by default
        if (!section.classList.contains('fade-in')) {
            section.classList.add('fade-in');
        }
        
        const sectionTop = section.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        
        // Check if section is visible in the viewport
        if (sectionTop < windowHeight * 0.85) {
            section.classList.add('active');
        }
    });
}

// Initialize animations
window.addEventListener('load', () => {
    // Animate skill bars on page load
    document.querySelectorAll('.skill-progress').forEach(bar => {
        const width = bar.style.width;
        bar.style.width = '0';
        setTimeout(() => {
            bar.style.width = width;
        }, 500);
    });
    
    // Run scroll animations on page load
    animateOnScroll();
});

// Run scroll animations on scroll
window.addEventListener('scroll', animateOnScroll);

// Preload hero background image for better performance
const preloadImage = new Image();
preloadImage.src = '../img/hero-bg.jpg';

// Typing effect for hero section (optional)
const heroTitle = document.querySelector('.hero h1');
const heroText = heroTitle.textContent;
if (heroTitle && heroText && false) { // Disabled by default, set to true to enable
    heroTitle.textContent = '';
    let charIndex = 0;
    
    function typeWriter() {
        if (charIndex < heroText.length) {
            heroTitle.textContent += heroText.charAt(charIndex);
            charIndex++;
            setTimeout(typeWriter, 150);
        }
    }
    
    typeWriter();
}

// Custom cursor effect (optional)
const createCustomCursor = () => {
    const cursor = document.createElement('div');
    cursor.classList.add('custom-cursor');
    document.body.appendChild(cursor);
    
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = `${e.clientX}px`;
        cursor.style.top = `${e.clientY}px`;
    });
    
    document.addEventListener('mousedown', () => {
        cursor.classList.add('clicked');
    });
    
    document.addEventListener('mouseup', () => {
        cursor.classList.remove('clicked');
    });
    
    // Add hover effect to links and buttons
    const hoverElements = document.querySelectorAll('a, button, .project-card, .skill-item');
    hoverElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            cursor.classList.add('hover');
        });
        element.addEventListener('mouseleave', () => {
            cursor.classList.remove('hover');
        });
    });
};

// Uncomment the line below to enable custom cursor
// createCustomCursor();

// Theme toggle functionality (can be enabled if needed)
const createThemeToggle = () => {
    const themeToggle = document.createElement('div');
    themeToggle.classList.add('theme-toggle');
    themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    document.body.appendChild(themeToggle);
    
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('light-theme');
        if (document.body.classList.contains('light-theme')) {
            themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        } else {
            themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        }
    });
};

// Uncomment the line below to enable theme toggle
// createThemeToggle(); 
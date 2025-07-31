const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const scrollToTopBtn = document.getElementById('scroll-to-top');
const contactForm = document.getElementById('contact-form');
const formStatus = document.getElementById('form-status');

// Initialize Lucide icons
lucide.createIcons();

// Navigation functionality
let isMenuOpen = false;

navToggle.addEventListener('click', () => {
    isMenuOpen = !isMenuOpen;
    navMenu.classList.toggle('active', isMenuOpen);
    
    // Update toggle icon
    const icon = navToggle.querySelector('i');
    icon.setAttribute('data-lucide', isMenuOpen ? 'x' : 'menu');
    lucide.createIcons();
});

// Close mobile menu when clicking on a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        isMenuOpen = false;
        navMenu.classList.remove('active');
        
        // Update toggle icon
        const icon = navToggle.querySelector('i');
        icon.setAttribute('data-lucide', 'menu');
        lucide.createIcons();
    });
});

// Scroll functionality
let lastScrollY = window.scrollY;

window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;
    
    // Navbar scroll effect
    if (currentScrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    // Show/hide scroll to top button
    if (currentScrollY > 300) {
        scrollToTopBtn.classList.add('visible');
    } else {
        scrollToTopBtn.classList.remove('visible');
    }
    
    // Update active navigation link
    updateActiveNavLink();
    
    // Animate elements on scroll
    animateOnScroll();
    
    lastScrollY = currentScrollY;
});

// Scroll to top functionality
scrollToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Smooth scroll to sections
function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        const offsetTop = element.offsetTop - 80; // Account for fixed navbar
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }
}

// Update active navigation link based on scroll position
function updateActiveNavLink() {
    const sections = ['accueil', 'apropos', 'competences', 'experience', 'contact'];
    const scrollPosition = window.scrollY + 100;
    
    sections.forEach(sectionId => {
        const section = document.getElementById(sectionId);
        const navLink = document.querySelector(`[data-section="${sectionId}"]`);
        
        if (section && navLink) {
            const sectionTop = section.offsetTop;
            const sectionBottom = sectionTop + section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                // Remove active class from all links
                navLinks.forEach(link => link.classList.remove('active'));
                // Add active class to current link
                navLink.classList.add('active');
            }
        }
    });
}

// Animate elements when they come into view
function animateOnScroll() {
    const elements = document.querySelectorAll('.fade-in');
    
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < window.innerHeight - elementVisible) {
            element.classList.add('visible');
        }
    });
    
    // Animate skill bars
    const skillBars = document.querySelectorAll('.skill-progress');
    skillBars.forEach(bar => {
        const barTop = bar.getBoundingClientRect().top;
        const barVisible = 150;
        
        if (barTop < window.innerHeight - barVisible && !bar.classList.contains('animated')) {
            const width = bar.getAttribute('data-width');
            bar.style.width = width + '%';
            bar.classList.add('animated');
        }
    });
}

// Contact form functionality
contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const submitBtn = contactForm.querySelector('.submit-btn');
    const originalText = submitBtn.innerHTML;
    
    // Show loading state
    submitBtn.disabled = true;
    submitBtn.innerHTML = `
        <div style="width: 20px; height: 20px; border: 2px solid #ffffff; border-top: 2px solid transparent; border-radius: 50%; animation: spin 1s linear infinite;"></div>
        <span>Envoi en cours...</span>
    `;
    
    // Simulate form submission (replace with actual form handling)
    try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Show success message
        formStatus.className = 'form-status success';
        formStatus.innerHTML = `
            <i data-lucide="check-circle"></i>
            <span>Message envoyé avec succès ! Je vous répondrai bientôt.</span>
        `;
        lucide.createIcons();
        
        // Reset form
        contactForm.reset();
        
        // Hide success message after 5 seconds
        setTimeout(() => {
            formStatus.style.display = 'none';
        }, 5000);
        
    } catch (error) {
        // Show error message
        formStatus.className = 'form-status error';
        formStatus.innerHTML = `
            <i data-lucide="alert-circle"></i>
            <span>Erreur lors de l'envoi. Veuillez réessayer.</span>
        `;
        lucide.createIcons();
    } finally {
        // Reset button
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
        lucide.createIcons();
    }
});

// Add CSS for loading animation
const style = document.createElement('style');
style.textContent = `
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
`;
document.head.appendChild(style);

// Initialize animations on page load
document.addEventListener('DOMContentLoaded', () => {
    // Add fade-in class to elements that should animate
    const animatedElements = document.querySelectorAll('.skill-category, .timeline-item, .contact-item');
    animatedElements.forEach(element => {
        element.classList.add('fade-in');
    });
    
    // Initial animation check
    setTimeout(() => {
        animateOnScroll();
    }, 100);
    
    // Initialize active nav link
    updateActiveNavLink();
});

// Handle navigation link clicks
document.addEventListener('click', (e) => {
    if (e.target.matches('.nav-link') || e.target.closest('.nav-link')) {
        e.preventDefault();
        const link = e.target.matches('.nav-link') ? e.target : e.target.closest('.nav-link');
        const sectionId = link.getAttribute('data-section');
        scrollToSection(sectionId);
    }
});

// Handle other scroll-to-section buttons
document.addEventListener('click', (e) => {
    if (e.target.matches('[onclick*="scrollToSection"]') || e.target.closest('[onclick*="scrollToSection"]')) {
        e.preventDefault();
        const button = e.target.matches('[onclick*="scrollToSection"]') ? e.target : e.target.closest('[onclick*="scrollToSection"]');
        const onclick = button.getAttribute('onclick');
        const sectionId = onclick.match(/scrollToSection\('(.+?)'\)/)[1];
        scrollToSection(sectionId);
    }
});

// Intersection Observer for better performance
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            
            // Animate skill bars when they come into view
            if (entry.target.classList.contains('skills')) {
                const skillBars = entry.target.querySelectorAll('.skill-progress');
                skillBars.forEach((bar, index) => {
                    setTimeout(() => {
                        const width = bar.getAttribute('data-width');
                        bar.style.width = width + '%';
                    }, index * 100);
                });
            }
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const elementsToObserve = document.querySelectorAll('.fade-in, .skills, .about, .experience, .contact');
    elementsToObserve.forEach(element => {
        observer.observe(element);
    });
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isMenuOpen) {
        isMenuOpen = false;
        navMenu.classList.remove('active');
        
        const icon = navToggle.querySelector('i');
        icon.setAttribute('data-lucide', 'menu');
        lucide.createIcons();
    }
});

// Handle window resize
window.addEventListener('resize', () => {
    if (window.innerWidth > 768 && isMenuOpen) {
        isMenuOpen = false;
        navMenu.classList.remove('active');
        
        const icon = navToggle.querySelector('i');
        icon.setAttribute('data-lucide', 'menu');
        lucide.createIcons();
    }
});

// Preload images and optimize performance
document.addEventListener('DOMContentLoaded', () => {
    // Add loading states
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('load', () => {
            img.classList.add('loaded');
        });
    });
    
    // Optimize scroll performance
    let ticking = false;
    
    function updateOnScroll() {
        updateActiveNavLink();
        animateOnScroll();
        ticking = false;
    }
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(updateOnScroll);
            ticking = true;
        }
    });
});

// Add smooth hover effects
document.addEventListener('DOMContentLoaded', () => {
    const hoverElements = document.querySelectorAll('.skill-category, .timeline-content, .contact-item');
    
    hoverElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            element.style.transform = 'translateY(-5px)';
        });
        
        element.addEventListener('mouseleave', () => {
            element.style.transform = 'translateY(0)';
        });
    });
});

// Console welcome message
console.log(`
🚀 Portfolio Website Loaded Successfully!
📧 Contact: votre.email@example.com
💼 Ready for new projects!

Built with ❤️ using HTML, CSS & JavaScript
`);
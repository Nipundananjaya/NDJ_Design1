document.addEventListener("DOMContentLoaded", () => {
    // Elements for counter animation
    const customers = document.getElementById("customers");
    const projects = document.getElementById("projects");
    const toolsCreated = document.getElementById("tools-created");
    
    // Elements for header scroll effect
    const header = document.querySelector("header");
    
    // Mobile menu toggle
    const mobileMenuBtn = document.querySelector(".mobile-menu-btn");
    const navMenu = document.querySelector("nav ul");
    
    // Animated counter function
    function animateCountUp(element, target) {
        let count = 0;
        const speed = 2000 / target; // Adjust speed based on target value
        
        let interval = setInterval(() => {
            if (count >= target) {
                clearInterval(interval);
                element.textContent = target;
            } else {
                count++;
                element.textContent = count;
            }
        }, speed);
    }
    
    // Scroll to section function
    window.scrollToContact = function() {
        document.getElementById("contact").scrollIntoView({ behavior: "smooth" });
    }
    
    // Scroll to any section
    const navLinks = document.querySelectorAll("nav ul li a");
    navLinks.forEach(link => {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            const targetId = link.getAttribute("href");
            document.querySelector(targetId).scrollIntoView({ behavior: "smooth" });
            
            // Close mobile menu if open
            if (window.innerWidth <= 768) {
                navMenu.classList.remove("active");
            }
        });
    });
    
    // Mobile menu toggle
    mobileMenuBtn.addEventListener("click", () => {
        navMenu.classList.toggle("active");
    });
    
    // Header scroll effect
    window.addEventListener("scroll", () => {
        if (window.scrollY > 50) {
            header.classList.add("scrolled");
        } else {
            header.classList.remove("scrolled");
        }
    });
    
    // Intersection Observer for counter animation
    const observerOptions = {
        root: null,
        rootMargin: "0px",
        threshold: 0.1
    };
    
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Start counter animations
                animateCountUp(customers, 120);
                animateCountUp(projects, 45);
                animateCountUp(toolsCreated, 10);
                
                // Unobserve after animation starts
                statsObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    const statsSection = document.getElementById("achievements");
    statsObserver.observe(statsSection);
    
    // Animate elements on scroll
    const fadeElements = document.querySelectorAll(".card, .project-card, .stat");
    
    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("fade-in");
                fadeObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });
    
    fadeElements.forEach(element => {
        element.classList.add("fade-element");
        fadeObserver.observe(element);
    });
    
    // Form validation
    const contactForm = document.querySelector(".contact-form");
    if (contactForm) {
        contactForm.addEventListener("submit", (e) => {
            e.preventDefault();
            
            // Get form values
            const name = contactForm.querySelector("input[type='text']").value;
            const email = contactForm.querySelector("input[type='email']").value;
            const message = contactForm.querySelector("textarea").value;
            
            // Simple validation
            if (name && email && message) {
                // Form submission logic would go here
                
                // Show success message
                alert("Thank you for your message! I'll get back to you soon.");
                contactForm.reset();
            } else {
                alert("Please fill out all required fields.");
            }
        });
    }
    
    // Add CSS for fade animation
    const style = document.createElement('style');
    style.textContent = `
        .fade-element {
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 0.6s ease, transform 0.6s ease;
        }
        
        .fade-in {
            opacity: 1;
            transform: translateY(0);
        }
        
        nav ul.active {
            display: flex;
            flex-direction: column;
            position: absolute;
            top: 60px;
            left: 0;
            right: 0;
            background-color: var(--secondary-color);
            padding: 20px;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
        }
    `;
    document.head.appendChild(style);
});




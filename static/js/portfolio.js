// This script handles portfolio-specific functionality

document.addEventListener('DOMContentLoaded', function() {
    // Fetch and display projects
    fetchProjects();
    
    // Fetch and display skills
    fetchSkills();
    
    // Handle contact form submission
    setupContactForm();
    
    // Setup theme toggle
    setupThemeToggle();
    
    // Setup carousel controls
    setupCarousel();
    
    // Setup intro animations
    setupIntroAnimations();
    
    // Setup section transitions
    setupSectionTransitions();

    setupEasterEggs();
});

// Fetch projects from Django API
async function fetchProjects() {
    try {
        const response = await fetch('/projects/');
        const data = await response.json();
        
        const projectContainer = document.getElementById('project-container');
        projectContainer.innerHTML = '';
        
        // Use the data returned from the API, or fallback to sample data
        const projects = data.projects && data.projects.length > 0 ? data.projects : [
            // Your fallback data...
        ];
        
        projects.forEach(project => {
            const projectCard = document.createElement('div');
            projectCard.className = 'project-card';
            
            projectCard.innerHTML = `
                <div class="project-image">
                    <img src="${project.image}" alt="${project.title}" onerror="this.src='/static/images/project-placeholder.jpg'; this.onerror=null;">
                </div>
                <div class="project-info">
                    <h3>${project.title}</h3>
                    <p>${project.description}</p>
                    <a href="${project.github_link}" class="btn" target="_blank">View on GitHub</a>
                </div>
            `;
            
            projectContainer.appendChild(projectCard);
        });
    } catch (error) {
        console.error('Error fetching projects:', error);
    }
}

// Setup project carousel
function setupCarousel() {
    const carousel = document.querySelector('.project-carousel');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    let position = 0;
    
    // Function to update carousel position
    function updateCarouselPosition() {
        carousel.style.transform = `translateX(${position}px)`;
    }
    
    // Next button click handler
    nextBtn.addEventListener('click', () => {
        const carouselWidth = carousel.offsetWidth;
        const containerWidth = carousel.parentElement.offsetWidth;
        
        // Calculate maximum negative position
        const maxPosition = -(carouselWidth - containerWidth + 40); // 40px for padding
        
        // Move carousel by 400px or to the end
        position = Math.max(position - 400, maxPosition);
        updateCarouselPosition();
    });
    
    // Previous button click handler
    prevBtn.addEventListener('click', () => {
        // Move carousel by 400px or to the beginning
        position = Math.min(position + 400, 0);
        updateCarouselPosition();
    });
    
    // Handle resize
    window.addEventListener('resize', () => {
        // Reset position on resize
        position = 0;
        updateCarouselPosition();
    });
}

// Fetch skills from Django API
async function fetchSkills() {
    try {
        const response = await fetch('/skills/');
        const data = await response.json();
        
        const skillList = document.getElementById('skill-list');
        
        // Keep only a few default skills if no skills are returned from API
        if (data.skills && data.skills.length > 0) {
            skillList.innerHTML = '';
            
            data.skills.forEach((skill, index) => {
                const li = document.createElement('li');
                li.textContent = skill.title + '.';
                li.style.setProperty('--i', index);
                skillList.appendChild(li);
            });
            
            // Update the count CSS variable
            skillList.style.setProperty('--count', data.skills.length);
        }
    } catch (error) {
        console.error('Error fetching skills:', error);
    }
}

// Handle contact form submission with improved feedback
function setupContactForm() {
    const contactForm = document.getElementById('contact-form');
    const formMessageDiv = document.createElement('div');
    formMessageDiv.className = 'form-message';
    contactForm.prepend(formMessageDiv);
    
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Show loading state
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
        
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            message: document.getElementById('message').value
        };
        
        try {
            // Add CSRF token if using Django
            const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]')?.value;
            const headers = {
                'Content-Type': 'application/json',
            };
            
            if (csrfToken) {
                headers['X-CSRFToken'] = csrfToken;
            }
            
            const response = await fetch('/submit-contact/', {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(formData)
            });
            
            // Reset form state
            submitBtn.textContent = originalBtnText;
            submitBtn.disabled = false;
            
            if (response.ok) {
                // Show success message with animation
                formMessageDiv.className = 'form-message success';
                formMessageDiv.textContent = 'Message sent successfully! I will get back to you soon.';
                contactForm.reset();
                
                // Hide success message after 5 seconds
                setTimeout(() => {
                    formMessageDiv.style.display = 'none';
                }, 5000);
            } else {
                const data = await response.json();
                // Show error message
                formMessageDiv.className = 'form-message error';
                formMessageDiv.textContent = data.error || 'Something went wrong. Please try again.';
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            
            // Reset form state and show error
            submitBtn.textContent = originalBtnText;
            submitBtn.disabled = false;
            formMessageDiv.className = 'form-message error';
            formMessageDiv.textContent = 'Network error. Please check your connection and try again.';
        }
    });
}

// Setup theme toggle
function setupThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    
    themeToggle.addEventListener('click', function() {
        const html = document.documentElement;
        const currentTheme = html.dataset.theme || 'system';
        
        if (currentTheme === 'light') {
            html.dataset.theme = 'dark';
        } else if (currentTheme === 'dark') {
            html.dataset.theme = 'system';
        } else {
            html.dataset.theme = 'light';
        }
    });
}

// Setup intro animations
function setupIntroAnimations() {
    // Add the 'animated' class to the intro image after the initial animation completes
    setTimeout(() => {
        const introImage = document.querySelector('.intro-image');
        if (introImage) {
            introImage.classList.add('animated');
        }
    }, 1200); // This should match the initial animation duration + delay
    
    // Optional: Add animation when scrolling to different sections
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1
    });
    
    // Observe section titles and other elements you want to animate on scroll
    document.querySelectorAll('.section-title, .about-content, .project-card').forEach(el => {
        observer.observe(el);
        el.classList.add('animate-on-scroll');
    });

    // Enhanced animations
    const observerOptions = {
        threshold: 0.2,  // Trigger when 20% of the element is visible
        rootMargin: '0px 0px -10% 0px'  // Slightly offset to trigger earlier
    };
    
    const projectObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Add a delay based on the index for a cascade effect
                setTimeout(() => {
                    entry.target.classList.add('visible');
                    
                    // For project cards, add a special "pop" class
                    if (entry.target.classList.contains('project-card')) {
                        entry.target.classList.add('pop-in');
                    }
                }, index * 150); // 150ms delay between each element
                
                // Removed the unobserve to keep animations visible
                // projectObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe all project cards with a custom animation approach
    document.querySelectorAll('.project-card').forEach((card, index) => {
        // Set a custom property for staggered animations
        card.style.setProperty('--i', index);
        card.classList.add('animate-on-scroll');
        projectObserver.observe(card);
    });
    
    // About section animation observer with different threshold
    const aboutObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // If it's the about-content, animate each paragraph with a cascade
                if (entry.target.classList.contains('about-content')) {
                    const paragraphs = entry.target.querySelectorAll('p');
                    paragraphs.forEach((p, idx) => {
                        // Set custom property for staggered animations
                        p.style.setProperty('--i', idx);
                        setTimeout(() => {
                            p.classList.add('fade-in');
                        }, 300 + (idx * 200)); // Staggered timing
                    });
                    
                    // Also animate the image
                    const aboutImage = entry.target.querySelector('.about-image');
                    if (aboutImage) {
                        setTimeout(() => {
                            aboutImage.classList.add('slide-in');
                        }, 200);
                    }
                }
                
                // Removed the unobserve to keep animations visible
                // aboutObserver.unobserve(entry.target);
            }
        });
    }, { 
        threshold: 0.3,  // Higher threshold for about section
        rootMargin: '0px 0px -15% 0px' 
    });
    
    // Observe about section elements
    document.querySelectorAll('.about-content, .about-image, .about-text').forEach(el => {
        el.classList.add('animate-on-scroll');
        aboutObserver.observe(el);
    });
    
    // Section title animations
    const titleObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                entry.target.classList.add('title-reveal');
                // Removed the unobserve to keep animations visible
                // titleObserver.unobserve(entry.target);
            }
        });
    }, { 
        threshold: 0.5,
        rootMargin: '0px 0px -10% 0px' 
    });
    
    // Observe all section titles
    document.querySelectorAll('.section-title').forEach(title => {
        title.classList.add('animate-on-scroll');
        titleObserver.observe(title);
    });
}

// Setup section transitions
function setupSectionTransitions() {
    // Create elements for transition effect
    const transitionElement = document.createElement('div');
    transitionElement.className = 'section-transition';
    document.body.appendChild(transitionElement);
    
    const spinnerElement = document.createElement('div');
    spinnerElement.className = 'loading-spinner';
    document.body.appendChild(spinnerElement);
    
    // Get all navigation links
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Only trigger for internal links to sections
            if(this.getAttribute('href').startsWith('#')) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                
                // Activate transition elements
                transitionElement.classList.add('active');
                spinnerElement.classList.add('active');
                
                // After animation completes, navigate to the section
                setTimeout(() => {
                    window.location.hash = targetId;
                    
                    // Remove active classes
                    setTimeout(() => {
                        transitionElement.classList.remove('active');
                        spinnerElement.classList.remove('active');
                    }, 600);
                }, 750);
            }
        });
    });
}

// Setup easter eggs
function setupEasterEggs() {
    // Konami Code: ↑ ↑ ↓ ↓ ← → ← → B A
    const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    let konamiIndex = 0;
    
    // Listen for key presses
    document.addEventListener('keydown', function(e) {
        // Check if current key matches the expected key in the sequence
        if (e.key === konamiCode[konamiIndex]) {
            konamiIndex++;
            
            // If the full sequence is completed
            if (konamiIndex === konamiCode.length) {
                activateEasterEgg();
                konamiIndex = 0; // Reset for next time
            }
        } else {
            konamiIndex = 0; // Reset if wrong key
        }
    });
    
    // Secret click pattern on profile image
    const profileImage = document.querySelector('.intro-image img');
    let clickCount = 0;
    
    if (profileImage) {
        profileImage.addEventListener('click', function() {
            clickCount++;
            
            if (clickCount === 5) { // 5 rapid clicks
                activateProfileEasterEgg();
                clickCount = 0;
            }
            
            // Reset click count after 2 seconds of inactivity
            setTimeout(() => {
                clickCount = 0;
            }, 2000);
        });
    }
}

// Easter egg activation functions
function activateEasterEgg() {
    console.log('Konami Code activated!');
    
    // Create confetti effect
    createConfettiEffect();
    
    // Play victory sound
    const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/168/168.wav');
    audio.volume = 0.5;
    audio.play().catch(e => console.log('Audio could not be played', e));
    
    // Add some fun CSS effect to the page
    document.documentElement.style.animation = 'rainbow-background 5s infinite';
    
    // Define the rainbow animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes rainbow-background {
            0% { background-color: red; }
            14% { background-color: orange; }
            28% { background-color: yellow; }
            42% { background-color: green; }
            57% { background-color: blue; }
            71% { background-color: indigo; }
            85% { background-color: violet; }
            100% { background-color: red; }
        }
    `;
    document.head.appendChild(style);
    
    // Revert after 5 seconds
    setTimeout(() => {
        document.documentElement.style.animation = '';
    }, 5000);
}

function activateProfileEasterEgg() {
    // Make the profile image spin
    const profileImage = document.querySelector('.intro-image img');
    profileImage.style.animation = 'spin 1s linear infinite';
    
    // Define the spin animation if not already defined
    if (!document.querySelector('style#easter-egg-styles')) {
        const style = document.createElement('style');
        style.id = 'easter-egg-styles';
        style.textContent = `
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Create and position the speech bubble relative to the profile image container
    const introImageContainer = document.querySelector('.intro-image');
    const speechBubble = document.createElement('div');
    speechBubble.className = 'speech-bubble';
    speechBubble.style.cssText = `
        position: absolute;
        top: -60px;
        left: 50%;
        transform: translateX(-50%);
        background: var(--canvas-color, white);
        color: var(--text-color, black);
        padding: 15px;
        border-radius: 20px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        z-index: 1000;
        animation: fade-in-out 4s forwards;
        min-width: 200px;
        text-align: center;
        border: 1px solid rgba(0,0,0,0.1);
    `;
    speechBubble.textContent = "Thanks for checking out my profile! 🎉";
    
    // Add a speech bubble arrow/tail pointing to the image
    const bubbleArrow = document.createElement('div');
    bubbleArrow.style.cssText = `
        position: absolute;
        bottom: -10px;
        left: 50%;
        transform: translateX(-50%);
        width: 0;
        height: 0;
        border-left: 10px solid transparent;
        border-right: 10px solid transparent;
        border-top: 10px solid var(--canvas-color, white);
    `;
    speechBubble.appendChild(bubbleArrow);
    
    if (!document.querySelector('style#speech-bubble-style')) {
        const style = document.createElement('style');
        style.id = 'speech-bubble-style';
        style.textContent = `
            @keyframes fade-in-out {
                0% { opacity: 0; transform: translateX(-50%) translateY(20px); }
                20% { opacity: 1; transform: translateX(-50%) translateY(0); }
                80% { opacity: 1; transform: translateX(-50%) translateY(0); }
                100% { opacity: 0; transform: translateX(-50%) translateY(-20px); }
            }
        `;
        document.head.appendChild(style);
    }
    
    introImageContainer.appendChild(speechBubble);
    
    // Revert after 4 seconds
    setTimeout(() => {
        profileImage.style.animation = '';
        if (speechBubble.parentNode) {
            speechBubble.parentNode.removeChild(speechBubble);
        }
    }, 4000);
}

// Confetti effect
function createConfettiEffect() {
    const confettiContainer = document.createElement('div');
    confettiContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 9999;
    `;
    document.body.appendChild(confettiContainer);
    
    // Create 100 confetti pieces
    for (let i = 0; i < 100; i++) {
        createConfettiPiece(confettiContainer);
    }
    
    // Remove after animation completes
    setTimeout(() => {
        confettiContainer.remove();
    }, 5000);
}

function createConfettiPiece(container) {
    const colors = ['#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4CAF50', '#8BC34A', '#CDDC39', '#FFEB3B', '#FFC107', '#FF9800', '#FF5722'];
    const color = colors[Math.floor(Math.random() * colors.length)];
    
    const piece = document.createElement('div');
    piece.style.cssText = `
        position: absolute;
        width: ${Math.random() * 10 + 5}px;
        height: ${Math.random() * 10 + 5}px;
        background-color: ${color};
        border-radius: ${Math.random() > 0.5 ? '50%' : '0'};
        top: -20px;
        left: ${Math.random() * 100}vw;
        animation: confetti-fall ${Math.random() * 3 + 2}s linear forwards;
    `;
    
    container.appendChild(piece);
    
    if (!document.querySelector('style#confetti-style')) {
        const style = document.createElement('style');
        style.id = 'confetti-style';
        style.textContent = `
            @keyframes confetti-fall {
                0% {
                    transform: translateY(0) rotate(0deg);
                    opacity: 1;
                }
                100% {
                    transform: translateY(100vh) rotate(${Math.random() * 720 - 360}deg);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
}
// Lazy Loading Images
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');

    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.add('loaded');
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    }, { threshold: 0.1 });

    images.forEach(img => {
        imageObserver.observe(img);
    });
}

// Simple Scroll Progress Only
function initScrollEffects() {
    // Scroll Progress Indicator
    const scrollIndicator = document.getElementById('scrollIndicator');
    if (scrollIndicator) {
        function updateScrollProgress() {
            const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
            scrollIndicator.style.transform = `scaleX(${scrollPercent / 100})`;
        }
        window.addEventListener('scroll', updateScrollProgress);
    }
}

// Dragon Ball Power Meter Animation
function initDragonBallMeters() {
    const powerMeters = document.querySelectorAll('.dragon-ball-meter .meter-fill');
    const powerValues = document.querySelectorAll('.power-value');

    if (powerMeters.length === 0) return;

    const meterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const meter = entry.target;
                const width = meter.getAttribute('data-width') || '0%';

                // Animate meter fill with delay
                setTimeout(() => {
                    meter.style.width = width;
                }, 500);

                // Animate power values with counting effect
                const powerValueElement = meter.closest('.power-skill').querySelector('.power-value');
                if (powerValueElement) {
                    const targetValue = parseInt(powerValueElement.getAttribute('data-value'));
                    if (targetValue && !isNaN(targetValue)) {
                        animatePowerValue(powerValueElement, targetValue);
                    }
                }

                // Add screen shake effect for broken meters
                if (meter.classList.contains('overload')) {
                    setTimeout(() => {
                        document.body.style.animation = 'screenShake 0.5s ease-in-out 3';
                    }, 1500);
                }
            }
        });
    }, { threshold: 0.3 });

    powerMeters.forEach(meter => {
        meterObserver.observe(meter);
    });

    // Add click effects to skills
    initSkillClickEffects();
}

function initSkillClickEffects() {
    const skillElements = document.querySelectorAll('.skill-hover-effect');

    skillElements.forEach(skill => {
        let comboCount = 1;

        skill.addEventListener('click', function(e) {
            const rect = skill.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            // Create floating damage number
            createFloatingNumber(x, y, skill, comboCount);

            // Update combo counter
            const comboCounter = skill.querySelector('.combo-counter');
            if (comboCounter) {
                comboCount++;
                if (skill.classList.contains('legendary')) {
                    comboCounter.textContent = `ULTIMATE x${comboCount}!`;
                } else {
                    comboCounter.textContent = `COMBO x${comboCount}`;
                }

                // Reset combo after 3 seconds
                setTimeout(() => {
                    comboCount = 1;
                    if (skill.classList.contains('legendary')) {
                        comboCounter.textContent = 'ULTIMATE COMBO!';
                    } else {
                        comboCounter.textContent = 'COMBO x1';
                    }
                }, 3000);
            }

            // Add screen flash for legendary skills
            if (skill.classList.contains('legendary')) {
                document.body.style.animation = 'screenFlash 0.3s ease-out';
                setTimeout(() => {
                    document.body.style.animation = '';
                }, 300);
            }
        });
    });
}

function createFloatingNumber(x, y, parent, combo) {
    const number = document.createElement('div');
    number.className = 'floating-number';

    const damages = ['9999', '8888', '7777', 'CRITICAL!', 'PERFECT!', 'LEGENDARY!'];
    const randomDamage = damages[Math.floor(Math.random() * damages.length)];

    if (parent.classList.contains('legendary')) {
        number.textContent = combo > 5 ? 'ULTIMATE!' : randomDamage;
        number.classList.add('critical');
    } else {
        number.textContent = combo > 3 ? 'PERFECT!' : randomDamage;
    }

    number.style.left = x + 'px';
    number.style.top = y + 'px';
    number.style.position = 'absolute';

    parent.appendChild(number);

    setTimeout(() => {
        if (number.parentNode) {
            number.parentNode.removeChild(number);
        }
    }, 2000);
}

function animatePowerValue(element, targetValue) {
    let currentValue = 0;
    const increment = targetValue / 100;
    const duration = 2000; // 2 seconds
    const stepTime = duration / 100;

    const counter = setInterval(() => {
        currentValue += increment;

        if (currentValue >= targetValue) {
            currentValue = targetValue;
            clearInterval(counter);

            // Special effects for different values
            if (targetValue === Infinity || element.textContent.includes('∞')) {
                element.textContent = '∞% ERROR!';
                element.style.color = '#ff4444';
                element.style.animation = 'glitch 1s infinite';
            } else if (targetValue >= 10000) {
                element.textContent = targetValue + '%';
                element.style.color = '#ffff00';
                element.style.textShadow = '0 0 20px #ffff00, 0 0 40px #ffff00';
            } else {
                element.textContent = Math.floor(currentValue) + '%';
            }
        } else {
            element.textContent = Math.floor(currentValue) + '%';
        }
    }, stepTime);
}

// Legacy Skill Bar Animation (for compatibility)
function initSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress');
    if (skillBars.length === 0) return;

    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bar = entry.target;
                const width = bar.getAttribute('data-width') || '0%';
                bar.style.width = width;
            }
        });
    }, { threshold: 0.5 });

    skillBars.forEach(bar => {
        skillObserver.observe(bar);
    });
}

// Counter Animation
function initCounters() {
    const counters = document.querySelectorAll('[data-count]');

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.getAttribute('data-count'));
                let current = 0;
                const increment = target / 50;

                const updateCounter = () => {
                    if (current < target) {
                        current += increment;
                        counter.textContent = Math.ceil(current) + '+';
                        setTimeout(updateCounter, 40);
                    } else {
                        counter.textContent = target + '+';
                    }
                };

                updateCounter();
                counterObserver.unobserve(counter);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => {
        counterObserver.observe(counter);
    });
}

// Dynamic Error Codes System
function initWaterBubbles() {
    const bubblesContainer = document.getElementById('waterBubbles');
    if (!bubblesContainer) return;

    let bubbleCount = 0;
    let maxBubbles = 30; // Increased from 15
    let bubbleInterval;
    let lastScrollY = 0;

    // Error codes array
    const errorCodes = ['404', '500', '403', '502', '503', '401', '429', '418', '422', '504', '400', '409', '413', '414', '415', '416', '417', '426', '428', '431', '451', '511'];

    function createBubbleParticles(x, y) {
        for (let i = 0; i < 8; i++) {
            const particle = document.createElement('div');
            particle.className = 'bubble-particle';

            const angle = (i / 8) * Math.PI * 2;
            const distance = 30 + Math.random() * 40;
            const dx = Math.cos(angle) * distance;
            const dy = Math.sin(angle) * distance;

            particle.style.left = x + 'px';
            particle.style.top = y + 'px';
            particle.style.setProperty('--dx', dx + 'px');
            particle.style.setProperty('--dy', dy + 'px');

            bubblesContainer.appendChild(particle);

            setTimeout(() => {
                if (particle.parentNode) {
                    particle.parentNode.removeChild(particle);
                }
            }, 1000);
        }
    }

    function createBubble() {
        if (bubbleCount >= maxBubbles) return;

        const bubble = document.createElement('div');
        bubble.className = 'bubble';

        // Random size with more variety
        const sizes = ['small', 'medium', 'large', 'extra-large'];
        const weights = [40, 30, 20, 10]; // Probability weights
        let randomIndex = 0;
        const random = Math.random() * 100;
        let cumulative = 0;

        for (let i = 0; i < weights.length; i++) {
            cumulative += weights[i];
            if (random <= cumulative) {
                randomIndex = i;
                break;
            }
        }

        bubble.classList.add(sizes[randomIndex]);

        // Add random error code
        const randomErrorCode = errorCodes[Math.floor(Math.random() * errorCodes.length)];
        bubble.textContent = randomErrorCode;

        // Random position
        bubble.style.left = Math.random() * 95 + '%';

        // Random animation duration
        const duration = 6 + Math.random() * 8; // 6-14 seconds, faster
        bubble.style.animationDuration = duration + 's';

        // Random delay
        bubble.style.animationDelay = Math.random() * 1 + 's';

        // Add click event for pop effect
        bubble.addEventListener('click', function(e) {
            e.stopPropagation();

            const rect = bubble.getBoundingClientRect();
            const x = rect.left + rect.width / 2;
            const y = rect.top + rect.height / 2;

            // Create particles
            createBubbleParticles(x, y);

            // Add popping animation
            bubble.classList.add('popping');
            bubble.style.animationPlayState = 'paused';

            // Remove bubble after pop animation
            setTimeout(() => {
                if (bubble.parentNode) {
                    bubble.parentNode.removeChild(bubble);
                    bubbleCount--;
                }
            }, 600);
        });

        bubblesContainer.appendChild(bubble);
        bubbleCount++;

        // Remove bubble after animation if not clicked
        setTimeout(() => {
            if (bubble.parentNode && !bubble.classList.contains('popping')) {
                bubble.parentNode.removeChild(bubble);
                bubbleCount--;
            }
        }, (duration + 2) * 1000);
    }

    function updateBubbleFrequency() {
        const scrollPercent = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
        const scrollDirection = window.scrollY > lastScrollY ? 'down' : 'up';
        lastScrollY = window.scrollY;

        // Much more frequent bubble creation
        let frequency = 1500; // Base frequency (1.5 seconds) - much faster

        if (scrollPercent > 0.1) frequency = 1200; // 10% scrolled
        if (scrollPercent > 0.2) frequency = 1000; // 20% scrolled
        if (scrollPercent > 0.3) frequency = 800;  // 30% scrolled
        if (scrollPercent > 0.4) frequency = 600;  // 40% scrolled
        if (scrollPercent > 0.5) frequency = 500;  // 50% scrolled
        if (scrollPercent > 0.6) frequency = 400;  // 60% scrolled
        if (scrollPercent > 0.7) frequency = 300;  // 70% scrolled
        if (scrollPercent > 0.8) frequency = 200;  // 80% scrolled - very fast

        // Dramatically increase max bubbles based on scroll
        maxBubbles = Math.min(60, 20 + Math.floor(scrollPercent * 40)); // Up to 60 bubbles

        // Clear existing interval and set new one
        if (bubbleInterval) {
            clearInterval(bubbleInterval);
        }

        bubbleInterval = setInterval(createBubble, frequency);
    }

    // Initial setup
    updateBubbleFrequency();

    // Update on scroll
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(updateBubbleFrequency, 100);
    });

    // Create more initial bubbles
    for (let i = 0; i < 8; i++) {
        setTimeout(() => createBubble(), i * 300);
    }
}



// Optimized initialization - With bubbles
document.addEventListener('DOMContentLoaded', function() {
    // Initialize core features
    initLazyLoading();
    initScrollEffects();
    initSkillBars();
    initDragonBallMeters();
    initCounters();
    initWaterBubbles();
    // Mobile menu toggle - Fully functional
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const menuIcon = document.getElementById('menu-icon');
    const mobileMenuLinks = document.querySelectorAll('.mobile-menu-link');

    if (mobileMenuBtn && mobileMenu) {
        // Toggle menu on button click
        mobileMenuBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            toggleMobileMenu();
        });

        // Close menu when clicking on links
        mobileMenuLinks.forEach(link => {
            link.addEventListener('click', function() {
                closeMobileMenu();
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!mobileMenu.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
                closeMobileMenu();
            }
        });

        // Close menu on escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                closeMobileMenu();
            }
        });

        // Close menu on window resize to desktop
        window.addEventListener('resize', function() {
            if (window.innerWidth >= 768) {
                closeMobileMenu();
            }
        });
    }

    function toggleMobileMenu() {
        const isActive = mobileMenu.classList.contains('active');

        if (isActive) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
    }

    function openMobileMenu() {
        mobileMenu.classList.add('active');
        menuIcon.classList.add('active');
        menuIcon.classList.remove('fa-bars');
        menuIcon.classList.add('fa-times');

        // Prevent body scroll when menu is open
        document.body.style.overflow = 'hidden';

        // Add backdrop blur effect
        document.body.classList.add('menu-open');
    }

    function closeMobileMenu() {
        mobileMenu.classList.remove('active');
        menuIcon.classList.remove('active');
        menuIcon.classList.remove('fa-times');
        menuIcon.classList.add('fa-bars');

        // Restore body scroll
        document.body.style.overflow = '';

        // Remove backdrop blur effect
        document.body.classList.remove('menu-open');
    }

    // Enhanced smooth scrolling for all anchor links
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                // Close mobile menu if open
                closeMobileMenu();

                // Calculate offset based on screen size
                const isMobile = window.innerWidth < 768;
                const offsetTop = targetSection.offsetTop - (isMobile ? 70 : 80);

                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Simple navbar scroll effect
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('nav');
        if (navbar) {
            const scrolled = window.scrollY > 50;
            navbar.style.background = scrolled ? 'rgba(8, 145, 178, 0.25)' : 'rgba(8, 145, 178, 0.15)';
        }
    });

    // Simple contact form handling
    const contactForm = document.querySelector('#contact form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Cảm ơn bạn đã liên hệ! Tôi sẽ phản hồi sớm nhất có thể.');
            this.reset();
        });
    }

    // Simple back to top button
    const backToTopBtn = document.createElement('button');
    backToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    backToTopBtn.className = 'fixed bottom-8 right-8 w-12 h-12 bg-gradient-to-br from-cyan-500 to-teal-500 text-white rounded-full shadow-lg transition-all opacity-0 pointer-events-none z-50 hover:from-cyan-600 hover:to-teal-600';
    document.body.appendChild(backToTopBtn);

    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTopBtn.style.opacity = '1';
            backToTopBtn.style.pointerEvents = 'auto';
        } else {
            backToTopBtn.style.opacity = '0';
            backToTopBtn.style.pointerEvents = 'none';
        }
    });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    console.log('✨ Optimized CV System Initialized ✨');
});

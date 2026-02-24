document.addEventListener('DOMContentLoaded', () => {

    // --- Mobile Navigation ---
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links-new') || document.querySelector('.nav-links');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            hamburger.classList.toggle('active');
        });

        // Close menu when clicking a link
        document.querySelectorAll('.nav-links-new a, .nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                hamburger.classList.remove('active');
            });
        });
    }

    // --- Navbar Scroll Behavior ---
    const navbar = document.querySelector('.navbar-new');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }

    // --- Language Switcher ---
    const langButtons = document.querySelectorAll('.lang-btn');

    langButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();

            // Remove active from all
            langButtons.forEach(b => b.classList.remove('active'));

            // Add active to clicked
            btn.classList.add('active');

            // Here you can add logic to change language
            const selectedLang = btn.getAttribute('data-lang');
            console.log('Language changed to:', selectedLang);

            // Store language preference
            localStorage.setItem('preferredLanguage', selectedLang);
        });
    });

    // Load saved language preference
    const savedLang = localStorage.getItem('preferredLanguage');
    if (savedLang) {
        langButtons.forEach(btn => {
            if (btn.getAttribute('data-lang') === savedLang) {
                langButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            }
        });
    }

    // --- FAQ Accordion ---
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            // Close other items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                    otherItem.querySelector('.faq-answer').style.maxHeight = null;
                }
            });

            // Toggle current item
            item.classList.toggle('active');
            const answer = item.querySelector('.faq-answer');
            if (item.classList.contains('active')) {
                answer.style.maxHeight = answer.scrollHeight + "px";
            } else {
                answer.style.maxHeight = null;
            }
        });
    });

    // --- Smooth Scrolling for Anchor Links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // --- Intersection Observer for Reveal Animations ---
    const observerOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all elements with .reveal class
    const revealElements = document.querySelectorAll('.reveal');
    revealElements.forEach(el => revealObserver.observe(el));

    // Also keep legacy animation support if needed, or migrate elements to use .reveal
    const legacyAnimatedElements = document.querySelectorAll('.card, .about-text, .about-image, .video-card, .testimonial-card, .service-card, .dog-card');
    legacyAnimatedElements.forEach(el => {
        if (!el.classList.contains('reveal')) {
            el.classList.add('reveal', 'reveal-fade-up'); // Add new class dynamically only if not manually set
            revealObserver.observe(el);
        }
    });

    // Class for the visible state
    const style = document.createElement('style');
    style.innerHTML = `
        .visible {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);

    // --- New Hero Slider Logic ---
    const heroSlides = document.querySelectorAll('.hero-bg-slide');
    const heroNextBtn = document.querySelector('.hero-next');
    const heroPrevBtn = document.querySelector('.hero-prev');
    const heroDots = document.querySelectorAll('.hero-dot');
    let heroCurrentSlide = 0;
    const heroSlideInterval = 6000; // 6 seconds per slide
    let heroSlideTimer;

    // Hero content variations for each slide
    const heroContent = [
        {
            // Slide 1: Aggression & Behavior Modification (Pain Point: Fear/Chaos -> Solution: Control)
            title: "TURN<br>AGGRESSIVE<br>INTO CALM,TRUSTED BEHAVIOR",
            description: "Tired of your dog's out-of-control behavior? Our trainers help dogs chill out, stop reacting, and become the reliable buddy you’ve always wanted. Let’s get your dog and your life back on track—start today!",
            ctaText: "GET SUPPORT TODAY",
            ctaLink: "training.html"
        },
        {
            // Slide 2: Family Protection & Obedience (Desire: Safety/Harmony)
            title: "<br>BOARD & TRAIN<br>PROGRAMS",
            description: "Imagine a dog that’s calm, reliable, and always looking out for your family. Our in-home and intensive training programs help dogs build confidence, master obedience, and become the trusted companion every household needs. Start your journey to a safer, happier home today",
            ctaText: "Choose Training Program",
            ctaLink: "services.html"
        },
        {
            // Slide 3: Elite Dogs for Sale (Desire: Prestige/Security)
            title: "ELITE PROTECTION DOGS<br>FOR SALE",
            description: "Don’t just get a dog—get peace of mind. Our elite protection dogs are trained, tested, and ready to guard your home and family from day one. Smart, loyal, and dependable—find your ultimate family protector in Los Angeles today.",
            ctaText: "FIND YOUR PROTECTOR",
            ctaLink: "available-dogs.html"
        }
    ];

    if (heroSlides.length > 0) {
        const heroTitle = document.getElementById('hero-title');
        const heroDesc = document.getElementById('hero-desc');
        const heroCta = document.getElementById('hero-cta');

        function updateHeroContent(index) {
            if (heroTitle && heroDesc && heroCta) {
                const content = heroContent[index];

                // Add fade-out effect
                heroTitle.style.opacity = '0';
                heroDesc.style.opacity = '0';
                heroCta.style.opacity = '0';

                setTimeout(() => {
                    // Update content
                    heroTitle.innerHTML = content.title;
                    heroDesc.textContent = content.description;
                    heroCta.textContent = content.ctaText;
                    heroCta.href = content.ctaLink;

                    // Fade-in effect
                    heroTitle.style.opacity = '1';
                    heroDesc.style.opacity = '1';
                    heroCta.style.opacity = '1';
                }, 300);
            }
        }

        function goToHeroSlide(n) {
            heroSlides[heroCurrentSlide].classList.remove('active');
            heroDots[heroCurrentSlide].classList.remove('active');

            heroCurrentSlide = (n + heroSlides.length) % heroSlides.length;

            heroSlides[heroCurrentSlide].classList.add('active');
            heroDots[heroCurrentSlide].classList.add('active');

            // Update hero text content
            updateHeroContent(heroCurrentSlide);

            resetHeroTimer();
        }

        function nextHeroSlide() {
            goToHeroSlide(heroCurrentSlide + 1);
        }

        function prevHeroSlide() {
            goToHeroSlide(heroCurrentSlide - 1);
        }

        // Event Listeners
        if (heroNextBtn) heroNextBtn.addEventListener('click', nextHeroSlide);
        if (heroPrevBtn) heroPrevBtn.addEventListener('click', prevHeroSlide);

        // Dots Navigation
        heroDots.forEach((dot, index) => {
            dot.addEventListener('click', () => goToHeroSlide(index));
        });

        // Auto Play
        function startHeroTimer() {
            heroSlideTimer = setInterval(nextHeroSlide, heroSlideInterval);
        }

        function resetHeroTimer() {
            clearInterval(heroSlideTimer);
            startHeroTimer();
        }

        startHeroTimer();

        // Add CSS transitions for smooth text change
        if (heroTitle && heroDesc && heroCta) {
            heroTitle.style.transition = 'opacity 0.3s ease';
            heroDesc.style.transition = 'opacity 0.3s ease';
            heroCta.style.transition = 'opacity 0.3s ease';
        }
    }

    // --- Enhanced Dog Animations ---
    // Add floating animation to the About Image
    const aboutImage = document.querySelector('.about-image img');
    if (aboutImage) {
        aboutImage.classList.add('animate-float');
    }

    // Add pulse effect to main CTA
    const mainCta = document.querySelector('.hero-slider .btn-primary');
    if (mainCta) {
        mainCta.classList.add('btn-pulse');
    }

    // --- Premium Testimonial Slider Logic ---
    const testTrack = document.querySelector('.testimonial-track');
    const testSlides = document.querySelectorAll('.testimonial-slide');
    const testPrev = document.querySelector('.test-btn.prev');
    const testNext = document.querySelector('.test-btn.next');
    const testDotsContainer = document.querySelector('.test-dots');

    if (testTrack && testSlides.length > 0) {
        let currentTestSlide = 0;
        const testCount = testSlides.length;

        // Create Dots
        testSlides.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.classList.add('test-dot');
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToTestSlide(index));
            testDotsContainer.appendChild(dot);
        });

        const testDots = document.querySelectorAll('.test-dot');

        function updateTestSlider() {
            // Move Track
            testTrack.style.transform = `translateX(-${currentTestSlide * 100}%)`;

            // Update Active Classes
            testSlides.forEach((slide, index) => {
                if (index === currentTestSlide) {
                    slide.classList.add('active');
                } else {
                    slide.classList.remove('active');
                }
            });

            // Update Dots
            testDots.forEach((dot, index) => {
                if (index === currentTestSlide) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            });
        }

        function goToTestSlide(n) {
            currentTestSlide = (n + testCount) % testCount;
            updateTestSlider();
            resetTestTimer();
        }

        function nextTestSlide() {
            goToTestSlide(currentTestSlide + 1);
        }

        function prevTestSlide() {
            goToTestSlide(currentTestSlide - 1);
        }

        // Event Listeners
        if (testNext) testNext.addEventListener('click', nextTestSlide);
        if (testPrev) testPrev.addEventListener('click', prevTestSlide);

        // Auto Play
        let testTimer;
        function startTestTimer() {
            testTimer = setInterval(nextTestSlide, 5000);
        }

        function resetTestTimer() {
            clearInterval(testTimer);
            startTestTimer();
        }

        startTestTimer();
    }
    // --- Featured Dogs Slider Logic ---
    const dogTrack = document.querySelector('.dog-slider-track');
    const dogContainer = document.querySelector('.dog-slider-container');
    const dogNext = document.querySelector('.next-dog');
    const dogPrev = document.querySelector('.prev-dog');

    let dogIndex = 0;

    const getSliderConfig = () => {
        if (!dogTrack || !dogContainer) return null;
        const items = dogTrack.querySelectorAll('.dog-slide-item');
        if (items.length === 0) return null;

        const firstItem = items[0];
        const gap = parseInt(window.getComputedStyle(dogTrack).gap) || 0;

        // For mobile/single view, use container width directly for precision
        const isMobile = window.innerWidth <= 768;
        const itemWidth = isMobile ? dogContainer.offsetWidth : (firstItem.getBoundingClientRect().width + gap);
        const visibleItems = isMobile ? 1 : Math.round(dogContainer.offsetWidth / itemWidth) || 1;

        return { itemWidth, visibleItems, totalItems: items.length };
    };

    if (dogTrack) {
        let config = getSliderConfig();

        window.addEventListener('resize', () => {
            config = getSliderConfig();
            if (config) {
                dogTrack.style.transition = 'none'; // Disable transition during resize
                dogTrack.style.transform = `translateX(${-dogIndex * config.itemWidth}px)`;
                setTimeout(() => dogTrack.style.transition = '', 50);
            }
        });

        const moveDogSlide = (direction) => {
            config = getSliderConfig(); // Always get fresh config for mobile accuracy
            if (!config) return;

            const { itemWidth, visibleItems, totalItems } = config;

            if (direction === 'next') {
                dogIndex++;
                if (dogIndex > totalItems - visibleItems) {
                    dogIndex = 0;
                }
            } else {
                dogIndex--;
                if (dogIndex < 0) {
                    dogIndex = totalItems - visibleItems;
                }
            }

            dogTrack.style.transform = `translateX(${-dogIndex * itemWidth}px)`;
        };

        if (dogNext) dogNext.addEventListener('click', () => {
            clearInterval(dogAutoScroll);
            moveDogSlide('next');
        });
        if (dogPrev) dogPrev.addEventListener('click', () => {
            clearInterval(dogAutoScroll);
            moveDogSlide('prev');
        });

        let dogAutoScroll = setInterval(() => moveDogSlide('next'), 5000);

        dogContainer.addEventListener('mouseenter', () => clearInterval(dogAutoScroll));
    }

    // --- Phone Modal Toggle ---
    const phoneBtn = document.getElementById('floatPhoneBtn');
    const phoneModal = document.getElementById('phoneModal');
    const closeModal = document.querySelector('.close-modal');

    if (phoneBtn && phoneModal) {
        phoneBtn.addEventListener('click', (e) => {
            e.preventDefault();
            phoneModal.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent scrolling
        });

        if (closeModal) {
            closeModal.addEventListener('click', () => {
                phoneModal.classList.remove('active');
                document.body.style.overflow = ''; // Restore scrolling
            });
        }

        // Close on clicking outside
        window.addEventListener('click', (e) => {
            if (e.target === phoneModal) {
                phoneModal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }
});

// Cinematic Flow - Interactive JavaScript
document.addEventListener('DOMContentLoaded', function() {

    // Elements
    const categoryItems = document.querySelectorAll('.category-item');
    const categoryDetails = document.querySelectorAll('.category-detail');
    const indexContent = document.querySelector('.index-content');
    const backButtons = document.querySelectorAll('.back-btn');
    const previewContainer = document.getElementById('preview-container');
    const previewVideo = document.getElementById('preview-video');
    const navLinks = document.querySelectorAll('.nav-link');

    // State
    let currentView = 'index';
    let isPreviewActive = false;

    // Navigation between index and category detail pages
    categoryItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();

            const targetId = this.getAttribute('href').replace('#', '');
            const targetSection = document.getElementById(targetId);

            if (targetSection) {
                // Hide index
                indexContent.style.display = 'none';

                // Hide all category details
                categoryDetails.forEach(detail => {
                    detail.classList.remove('active');
                });

                // Show target category
                targetSection.classList.add('active');
                currentView = targetId;

                // Smooth scroll to top
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });

        // Hover preview functionality (desktop only)
        if (window.innerWidth > 768) {
            item.addEventListener('mouseenter', function() {
                const previewUrl = this.getAttribute('data-preview');
                const description = this.getAttribute('data-description');

                if (previewUrl && previewContainer) {
                    // Show preview container
                    previewContainer.classList.add('active');

                    // Load video (using placeholder for now)
                    if (previewVideo) {
                        // In production, you would set: previewVideo.src = previewUrl;
                        // For demo, we'll simulate with background
                        previewContainer.style.background =
                            `linear-gradient(45deg, #${Math.floor(Math.random()*16777215).toString(16)}, #${Math.floor(Math.random()*16777215).toString(16)})`;
                    }

                    isPreviewActive = true;
                }
            });

            item.addEventListener('mouseleave', function() {
                if (previewContainer) {
                    setTimeout(() => {
                        if (!isPreviewActive) {
                            previewContainer.classList.remove('active');
                        }
                    }, 300);
                    isPreviewActive = false;
                }
            });
        }
    });

    // Back button functionality
    backButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            // Hide all category details
            categoryDetails.forEach(detail => {
                detail.classList.remove('active');
            });

            // Show index
            indexContent.style.display = 'block';
            currentView = 'index';

            // Smooth scroll to top
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    });

    // Mobile menu toggle
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function() {
            document.body.classList.toggle('menu-open');
        });
    }

    // Smooth hover effects for project cards
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-12px) scale(1.02)';
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });

        // Simulate video play on click
        card.addEventListener('click', function() {
            const thumb = this.querySelector('.project-thumb');
            if (thumb) {
                thumb.innerHTML = '<div style="display: flex; align-items: center; justify-content: center; height: 100%; font-size: 3rem;">▶</div>';
                setTimeout(() => {
                    thumb.innerHTML = '';
                }, 2000);
            }
        });
    });

    // Add film burn transition effect
    function addFilmTransition() {
        const transition = document.createElement('div');
        transition.className = 'film-transition';
        transition.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: black;
            z-index: 9999;
            pointer-events: none;
            animation: filmBurn 0.3s ease-out;
        `;
        document.body.appendChild(transition);

        setTimeout(() => {
            transition.remove();
        }, 300);
    }

    // Add film burn animation to CSS dynamically
    const style = document.createElement('style');
    style.textContent = `
        @keyframes filmBurn {
            0% { opacity: 0; transform: scaleY(0); }
            50% { opacity: 1; transform: scaleY(1); }
            100% { opacity: 0; transform: scaleY(1); }
        }
    `;
    document.head.appendChild(style);

    // Touch gestures for mobile
    if (window.innerWidth <= 768) {
        let touchStartX = 0;
        let touchEndX = 0;

        document.addEventListener('touchstart', function(e) {
            touchStartX = e.changedTouches[0].screenX;
        });

        document.addEventListener('touchend', function(e) {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        });

        function handleSwipe() {
            const swipeThreshold = 50;
            const diff = touchStartX - touchEndX;

            if (Math.abs(diff) > swipeThreshold) {
                if (diff > 0) {
                    // Swipe left - next category
                    navigateCategories('next');
                } else {
                    // Swipe right - previous category
                    navigateCategories('prev');
                }
            }
        }

        function navigateCategories(direction) {
            const items = Array.from(categoryItems);
            const currentIndex = items.findIndex(item =>
                item.getAttribute('href').replace('#', '') === currentView
            );

            let nextIndex;
            if (direction === 'next') {
                nextIndex = currentIndex < items.length - 1 ? currentIndex + 1 : 0;
            } else {
                nextIndex = currentIndex > 0 ? currentIndex - 1 : items.length - 1;
            }

            if (currentView !== 'index' && items[nextIndex]) {
                items[nextIndex].click();
            }
        }
    }

    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe all project cards
    projectCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'all 0.6s ease-out';
        observer.observe(card);
    });

    // Dynamic year update
    const yearElements = document.querySelectorAll('.year');
    const currentYear = new Date().getFullYear();
    yearElements.forEach(el => {
        if (el.textContent === '2024') {
            el.textContent = currentYear;
        }
    });

    // Service badge animation
    const badges = document.querySelectorAll('.badge-same-day, .badge-new');
    badges.forEach(badge => {
        badge.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.2) rotate(-5deg)';
        });

        badge.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1) rotate(0)';
        });
    });

    // Performance optimization - lazy load images/videos
    const lazyElements = document.querySelectorAll('[data-lazy]');
    const lazyObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                const src = element.getAttribute('data-lazy');
                if (src) {
                    element.src = src;
                    element.removeAttribute('data-lazy');
                    lazyObserver.unobserve(element);
                }
            }
        });
    });

    lazyElements.forEach(el => lazyObserver.observe(el));

    // Console easter egg for fellow developers
    console.log('%c🎬 CINEMATIC FLOW', 'font-size: 24px; font-weight: bold; color: #FF0033;');
    console.log('%cA filmmaker portfolio that moves like cinema', 'font-size: 14px; color: #999;');
    console.log('%cBuilt with passion for film and code', 'font-size: 12px; color: #666;');
});
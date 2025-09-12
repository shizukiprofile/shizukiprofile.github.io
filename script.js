// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initializeLoader();
    initializeMobileMenu();
    initializeNavigation();
    initializeGallery();
    initializeMusicPlayer();
    initializeScrollToTop();
    initializeTabs();
    initializeAnimations();
    initializeParticles();
    
    console.log('시즈키 사이트가 로드되었습니다.');
});

// Loading Screen
function initializeLoader() {
    const loadingScreen = document.getElementById('loading-screen');
    
    // Simulate loading time
    setTimeout(() => {
        loadingScreen.classList.add('hidden');
        // Remove from DOM after transition
        setTimeout(() => {
            loadingScreen.remove();
        }, 500);
    }, 2000);
}

// Mobile Menu
function initializeMobileMenu() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mobileSidebar = document.querySelector('.mobile-sidebar');
    const sidebarOverlay = document.querySelector('.sidebar-overlay');
    const closeSidebar = document.querySelector('.close-sidebar');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav a');
    
    function openSidebar() {
        mobileSidebar.classList.add('active');
        sidebarOverlay.classList.add('active');
        mobileMenuBtn.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    function closeSidebarMenu() {
        mobileSidebar.classList.remove('active');
        sidebarOverlay.classList.remove('active');
        mobileMenuBtn.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    mobileMenuBtn.addEventListener('click', openSidebar);
    closeSidebar.addEventListener('click', closeSidebarMenu);
    sidebarOverlay.addEventListener('click', closeSidebarMenu);
    
    // Close sidebar when clicking nav links
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', closeSidebarMenu);
    });
    
    // Close sidebar on ESC key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileSidebar.classList.contains('active')) {
            closeSidebarMenu();
        }
    });
}

// Smooth Navigation
function initializeNavigation() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Active nav highlighting
    window.addEventListener('scroll', updateActiveNavigation);
}

function updateActiveNavigation() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.desktop-nav a, .mobile-nav a');
    const scrollPosition = window.scrollY + 100;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

// Gallery
function initializeGallery() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    const modal = document.getElementById('image-modal');
    const modalImage = document.getElementById('modal-image');
    const closeModal = document.querySelector('.close-modal');
    const prevBtn = document.querySelector('.modal-prev');
    const nextBtn = document.querySelector('.modal-next');
    
    let currentImageIndex = 0;
    const images = Array.from(galleryItems).map(item => ({
        src: item.dataset.src,
        alt: item.querySelector('img').alt
    }));
    
    function openModal(index) {
        currentImageIndex = index;
        modal.classList.add('active');
        modalImage.src = images[currentImageIndex].src;
        modalImage.alt = images[currentImageIndex].alt;
        document.body.style.overflow = 'hidden';
    }
    
    function closeModalFunc() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    function showPrevImage() {
        currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
        modalImage.src = images[currentImageIndex].src;
        modalImage.alt = images[currentImageIndex].alt;
    }
    
    function showNextImage() {
        currentImageIndex = (currentImageIndex + 1) % images.length;
        modalImage.src = images[currentImageIndex].src;
        modalImage.alt = images[currentImageIndex].alt;
    }
    
    // Event listeners
    galleryItems.forEach((item, index) => {
        item.addEventListener('click', () => openModal(index));
    });
    
    closeModal.addEventListener('click', closeModalFunc);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModalFunc();
    });
    
    prevBtn.addEventListener('click', showPrevImage);
    nextBtn.addEventListener('click', showNextImage);
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (modal.classList.contains('active')) {
            switch(e.key) {
                case 'Escape':
                    closeModalFunc();
                    break;
                case 'ArrowLeft':
                    showPrevImage();
                    break;
                case 'ArrowRight':
                    showNextImage();
                    break;
            }
        }
    });
    
    // Touch/swipe support for mobile
    let startX = 0;
    let endX = 0;
    
    modal.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
    });
    
    modal.addEventListener('touchend', (e) => {
        endX = e.changedTouches[0].clientX;
        handleSwipe();
    });
    
    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = startX - endX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                showNextImage();
            } else {
                showPrevImage();
            }
        }
    }
}

// Music Player
function initializeMusicPlayer() {
    const musicToggle = document.getElementById('music-toggle');
    const audio = document.getElementById('background-audio');
    const playIcon = musicToggle.querySelector('.play-icon');
    const pauseIcon = musicToggle.querySelector('.pause-icon');
    
    let isPlaying = false;
    
    function toggleMusic() {
        if (isPlaying) {
            audio.pause();
            playIcon.style.display = 'block';
            pauseIcon.style.display = 'none';
            musicToggle.setAttribute('aria-label', '음악 재생');
        } else {
            audio.play().catch(e => {
                console.log('음악 재생 실패:', e);
                // 사용자 상호작용이 필요한 경우 알림
                showMusicAlert();
            });
            playIcon.style.display = 'none';
            pauseIcon.style.display = 'block';
            musicToggle.setAttribute('aria-label', '음악 정지');
        }
        isPlaying = !isPlaying;
    }
    
    function showMusicAlert() {
        // 간단한 알림 메시지
        const alert = document.createElement('div');
        alert.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0,0,0,0.9);
            color: white;
            padding: 20px;
            border-radius: 10px;
            z-index: 10001;
            text-align: center;
            backdrop-filter: blur(10px);
        `;
        alert.innerHTML = '브라우저 정책상 사용자 클릭 후 음악이 재생됩니다.';
        
        document.body.appendChild(alert);
        
        setTimeout(() => {
            alert.remove();
        }, 3000);
    }
    
    musicToggle.addEventListener('click', toggleMusic);
    
    // Audio event listeners
    audio.addEventListener('ended', () => {
        isPlaying = false;
        playIcon.style.display = 'block';
        pauseIcon.style.display = 'none';
        musicToggle.setAttribute('aria-label', '음악 재생');
    });
    
    audio.addEventListener('pause', () => {
        isPlaying = false;
        playIcon.style.display = 'block';
        pauseIcon.style.display = 'none';
        musicToggle.setAttribute('aria-label', '음악 재생');
    });
    
    audio.addEventListener('play', () => {
        isPlaying = true;
        playIcon.style.display = 'none';
        pauseIcon.style.display = 'block';
        musicToggle.setAttribute('aria-label', '음악 정지');
    });
    
    // Volume control (optional)
    audio.volume = 0.7; // Set default volume to 70%
}

// Scroll to Top
function initializeScrollToTop() {
    const scrollToTopBtn = document.getElementById('scroll-to-top');
    
    function updateScrollToTopVisibility() {
        if (window.scrollY > 300) {
            scrollToTopBtn.classList.add('visible');
        } else {
            scrollToTopBtn.classList.remove('visible');
        }
    }
    
    function scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
    
    window.addEventListener('scroll', updateScrollToTopVisibility);
    scrollToTopBtn.addEventListener('click', scrollToTop);
}

// Tabs (Greeting Scenes)
function initializeTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.greeting-scene');
    
    function switchTab(targetTab) {
        // Remove active class from all tabs and contents
        tabBtns.forEach(btn => btn.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));
        
        // Add active class to selected tab and content
        const activeBtn = document.querySelector(`[data-tab="${targetTab}"]`);
        const activeContent = document.getElementById(targetTab);
        
        if (activeBtn && activeContent) {
            activeBtn.classList.add('active');
            activeContent.classList.add('active');
        }
    }
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.dataset.tab;
            switchTab(targetTab);
        });
    });
}

// Animations
function initializeAnimations() {
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll(`
        .overview-grid,
        .worldview-item,
        .location-item,
        .characteristic-item,
        .layer,
        .timeline-item,
        .gallery-item,
        .dialogue-item
    `);
    
    animateElements.forEach(el => {
        observer.observe(el);
    });
    
    // CSS for animations
    const style = document.createElement('style');
    style.textContent = `
        .overview-grid,
        .worldview-item,
        .location-item,
        .characteristic-item,
        .layer,
        .timeline-item,
        .gallery-item,
        .dialogue-item {
            opacity: 0;
            transform: translateY(30px);
            transition: all 0.6s ease-out;
        }
        
        .animate-in {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
        
        .worldview-item:nth-child(2) {
            transition-delay: 0.1s;
        }
        
        .worldview-item:nth-child(3) {
            transition-delay: 0.2s;
        }
        
        .characteristic-item:nth-child(2) {
            transition-delay: 0.1s;
        }
        
        .characteristic-item:nth-child(3) {
            transition-delay: 0.2s;
        }
        
        .characteristic-item:nth-child(4) {
            transition-delay: 0.3s;
        }
        
        .characteristic-item:nth-child(5) {
            transition-delay: 0.4s;
        }
        
        .gallery-item {
            transition-delay: calc(var(--delay, 0) * 0.1s);
        }
    `;
    document.head.appendChild(style);
    
    // Set delays for gallery items
    document.querySelectorAll('.gallery-item').forEach((item, index) => {
        item.style.setProperty('--delay', index);
    });
}

// Particles Background
function initializeParticles() {
    const particlesContainer = document.getElementById('particles-background');
    const particleCount = window.innerWidth < 768 ? 30 : 50; // Fewer particles on mobile
    
    function createParticle() {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: absolute;
            width: ${Math.random() * 4 + 1}px;
            height: ${Math.random() * 4 + 1}px;
            background: rgba(212, 175, 55, ${Math.random() * 0.3 + 0.1});
            border-radius: 50%;
            top: ${Math.random() * 100}%;
            left: ${Math.random() * 100}%;
            animation: particleFloat ${Math.random() * 20 + 10}s linear infinite;
            opacity: 0;
        `;
        
        return particle;
    }
    
    // Create particles
    for (let i = 0; i < particleCount; i++) {
        const particle = createParticle();
        particlesContainer.appendChild(particle);
        
        // Staggered animation start
        setTimeout(() => {
            particle.style.opacity = '1';
        }, Math.random() * 5000);
    }
    
    // Particle animation keyframes
    const particleStyle = document.createElement('style');
    particleStyle.textContent = `
        @keyframes particleFloat {
            0% {
                transform: translateY(100vh) translateX(0px) rotate(0deg);
            }
            100% {
                transform: translateY(-100px) translateX(${Math.random() * 200 - 100}px) rotate(360deg);
            }
        }
    `;
    document.head.appendChild(particleStyle);
}

// Utility Functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Performance optimizations
window.addEventListener('scroll', throttle(updateActiveNavigation, 100));
window.addEventListener('resize', debounce(() => {
    // Re-initialize particles on resize
    const particlesContainer = document.getElementById('particles-background');
    if (particlesContainer) {
        particlesContainer.innerHTML = '';
        initializeParticles();
    }
}, 250));

// Error handling
window.addEventListener('error', (e) => {
    console.error('JavaScript 오류 발생:', e.error);
});

// Accessibility improvements
document.addEventListener('keydown', (e) => {
    // Skip to main content on Tab
    if (e.key === 'Tab' && !e.shiftKey && document.activeElement === document.body) {
        const firstFocusable = document.querySelector('a, button, input, textarea, select');
        if (firstFocusable) {
            firstFocusable.focus();
            e.preventDefault();
        }
    }
});

// Preload critical images
function preloadImages() {
    const criticalImages = [
        '시즈키 이미지/시즈키1.jpg',
        '시즈키 썸네일.png'
    ];
    
    criticalImages.forEach(src => {
        const img = new Image();
        img.src = src;
    });
}

// Initialize preloading
preloadImages();

// Service Worker registration (if needed)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Uncomment if you want to add a service worker
        // navigator.serviceWorker.register('/sw.js');
    });
}

// Console welcome message
console.log(`
%c시즈키 캐릭터 사이트에 오신 것을 환영합니다
%c인과의 실을 조율하는 자의 이야기를 만나보세요
`, 
'color: #d4af37; font-size: 20px; font-weight: bold;',
'color: #cbd5e1; font-size: 14px;'
);

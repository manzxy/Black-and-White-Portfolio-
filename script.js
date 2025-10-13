class AdvancedPortfolio {
    constructor() {
        this.init();
        this.setupEventListeners();
        this.createParticles();
        this.setupMusicPlayer();
        this.setupScrollAnimations();
        this.setupCustomCursor();
        this.setupLoadingScreen();
    }

    init() {
        this.isPlaying = false;
        this.audioPlayer = document.getElementById('audioPlayer');
        this.playBtn = document.getElementById('playBtn');
        this.progressBar = document.getElementById('progressBar');
        this.progressContainer = document.getElementById('progressContainer');
        this.progressHandle = document.getElementById('progressHandle');
        this.currentTimeDisplay = document.getElementById('currentTime');
        this.durationDisplay = document.getElementById('duration');
        this.volumeSlider = document.getElementById('volumeSlider');
        this.visualizerBars = document.querySelectorAll('.visualizer-bar');
        
        this.cursor = { x: 0, y: 0 };
        this.cursorElement = null;
        
        this.lastScrollY = 0;
        
        this.animationId = null;
    }

    setupEventListeners() {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(link.getAttribute('href'));
                if (target) {
                    this.smoothScrollTo(target);
                    this.setActiveNavLink(link);
                }
            });
        });

        const navToggle = document.querySelector('.nav-toggle');
        const navMenu = document.querySelector('.nav-menu');
        
        if (navToggle) {
            navToggle.addEventListener('click', () => {
                navMenu.classList.toggle('active');
                navToggle.classList.toggle('active');
            });
        }

        window.addEventListener('scroll', () => {
            this.handleScroll();
        });

        window.addEventListener('resize', () => {
            this.handleResize();
        });

        document.addEventListener('mousemove', (e) => {
            this.updateCursor(e);
        });

        document.querySelectorAll('.social-card').forEach(card => {
            card.addEventListener('mouseenter', () => {
                this.animateSocialCard(card, true);
            });
            
            card.addEventListener('mouseleave', () => {
                this.animateSocialCard(card, false);
            });
        });

        document.addEventListener('keydown', (e) => {
            this.handleKeyboard(e);
        });
    }

    createParticles() {
        const container = document.getElementById('particles-container');
        const particleCount = 50;

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            const size = Math.random() * 3 + 1;
            particle.style.width = size + 'px';
            particle.style.height = size + 'px';
            
            particle.style.left = Math.random() * 100 + '%';
            
            particle.style.animationDelay = Math.random() * 20 + 's';
            
            particle.style.animationDuration = (Math.random() * 10 + 15) + 's';
            
            container.appendChild(particle);
        }
    }

    setupMusicPlayer() {
        if (!this.audioPlayer) return;

        this.playBtn.addEventListener('click', () => {
            this.togglePlayPause();
        });

        this.progressContainer.addEventListener('click', (e) => {
            this.seekAudio(e);
        });

        let isDragging = false;
        
        this.progressHandle.addEventListener('mousedown', () => {
            isDragging = true;
        });

        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                this.dragProgress(e);
            }
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
        });

        this.volumeSlider.addEventListener('input', (e) => {
            this.audioPlayer.volume = e.target.value / 100;
        });

        this.audioPlayer.addEventListener('loadedmetadata', () => {
            this.durationDisplay.textContent = this.formatTime(this.audioPlayer.duration);
        });

        this.audioPlayer.addEventListener('timeupdate', () => {
            this.updateProgress();
        });

        this.audioPlayer.addEventListener('ended', () => {
            this.resetPlayer();
        });

        this.audioPlayer.volume = 0.7;
        
        this.startVisualizer();
    }

    togglePlayPause() {
        const playIcon = this.playBtn.querySelector('.play-icon');
        const pauseIcon = this.playBtn.querySelector('.pause-icon');

        if (this.isPlaying) {
            this.audioPlayer.pause();
            playIcon.style.display = 'inline';
            pauseIcon.style.display = 'none';
            this.isPlaying = false;
            this.stopVisualizer();
        } else {
            this.audioPlayer.play();
            playIcon.style.display = 'none';
            pauseIcon.style.display = 'inline';
            this.isPlaying = true;
            this.startVisualizer();
        }
    }

    seekAudio(e) {
        const rect = this.progressContainer.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const width = rect.width;
        const percentage = clickX / width;
        const newTime = percentage * this.audioPlayer.duration;
        this.audioPlayer.currentTime = newTime;
    }

    dragProgress(e) {
        const rect = this.progressContainer.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const width = rect.width;
        const percentage = Math.max(0, Math.min(1, clickX / width));
        const newTime = percentage * this.audioPlayer.duration;
        this.audioPlayer.currentTime = newTime;
    }

    updateProgress() {
        const progress = (this.audioPlayer.currentTime / this.audioPlayer.duration) * 100;
        this.progressBar.style.width = progress + '%';
        this.progressHandle.style.left = progress + '%';
        this.currentTimeDisplay.textContent = this.formatTime(this.audioPlayer.currentTime);
    }

    resetPlayer() {
        const playIcon = this.playBtn.querySelector('.play-icon');
        const pauseIcon = this.playBtn.querySelector('.pause-icon');
        
        playIcon.style.display = 'inline';
        pauseIcon.style.display = 'none';
        this.isPlaying = false;
        this.progressBar.style.width = '0%';
        this.progressHandle.style.left = '0%';
        this.currentTimeDisplay.textContent = '0:00';
        this.stopVisualizer();
    }

    formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }

    startVisualizer() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }

        const animate = () => {
            this.visualizerBars.forEach((bar, index) => {
                const height = Math.random() * 50 + 10;
                bar.style.height = height + 'px';
                bar.style.opacity = this.isPlaying ? 1 : 0.3;
            });

            if (this.isPlaying) {
                this.animationId = requestAnimationFrame(animate);
            }
        };

        animate();
    }

    stopVisualizer() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        
        this.visualizerBars.forEach(bar => {
            bar.style.opacity = 0.3;
        });
    }

    setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    
                    if (entry.target.classList.contains('hero-section')) {
                        this.animateCounters();
                    }
                }
            });
        }, observerOptions);

        document.querySelectorAll('section').forEach(section => {
            observer.observe(section);
        });

        document.querySelectorAll('.skill-item, .gallery-item, .social-card').forEach(element => {
            observer.observe(element);
        });
    }

    animateCounters() {
        const counters = document.querySelectorAll('.stat-number');
        
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target'));
            const duration = 2000;
            const step = target / (duration / 16);
            let current = 0;

            const updateCounter = () => {
                current += step;
                if (current < target) {
                    counter.textContent = Math.floor(current);
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target;
                }
            };

            updateCounter();
        });
    }

    setupCustomCursor() {
        this.cursorElement = document.createElement('div');
        this.cursorElement.className = 'custom-cursor';
        this.cursorElement.style.cssText = `
            position: fixed;
            width: 20px;
            height: 20px;
            background: radial-gradient(circle, white 2px, transparent 2px);
            border-radius: 50%;
            pointer-events: none;
            z-index: 10000;
            mix-blend-mode: difference;
            transition: transform 0.1s ease;
        `;
        document.body.appendChild(this.cursorElement);

        this.updateCursorPosition();
    }

    updateCursor(e) {
        this.cursor.x = e.clientX;
        this.cursor.y = e.clientY;
    }

    updateCursorPosition() {
        if (this.cursorElement) {
            this.cursorElement.style.left = this.cursor.x + 'px';
            this.cursorElement.style.top = this.cursor.y + 'px';
        }
        requestAnimationFrame(() => this.updateCursorPosition());
    }

    setupLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        const progressBar = document.querySelector('.loading-progress');

        let progress = 0;
        const loadingInterval = setInterval(() => {
            progress += Math.random() * 15;
            if (progress >= 100) {
                progress = 100;
                clearInterval(loadingInterval);
                
                setTimeout(() => {
                    loadingScreen.style.opacity = '0';
                    loadingScreen.style.visibility = 'hidden';
                    document.body.style.overflow = 'auto';
                }, 500);
            }
            progressBar.style.width = progress + '%';
        }, 100);
    }

    smoothScrollTo(target) {
        const targetPosition = target.offsetTop - 80;
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        const duration = 1000;
        let start = null;

        const animation = (currentTime) => {
            if (start === null) start = currentTime;
            const timeElapsed = currentTime - start;
            const run = this.easeInOutQuad(timeElapsed, startPosition, distance, duration);
            window.scrollTo(0, run);
            if (timeElapsed < duration) requestAnimationFrame(animation);
        };

        requestAnimationFrame(animation);
    }

    easeInOutQuad(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t + b;
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
    }

    setActiveNavLink(activeLink) {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        activeLink.classList.add('active');
    }

    handleScroll() {
        const currentScrollY = window.pageYOffset;
        const navbar = document.querySelector('.navbar');

        if (currentScrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        const sections = document.querySelectorAll('section');
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (currentScrollY >= sectionTop && currentScrollY < sectionTop + sectionHeight) {
                const activeLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
                if (activeLink) {
                    this.setActiveNavLink(activeLink);
                }
            }
        });

        this.lastScrollY = currentScrollY;
    }

    handleResize() {
        if (window.innerWidth <= 768) {
        } else {
        }
    }

    animateGalleryItem(item, isHover) {
        const overlay = item.querySelector('.gallery-overlay');
        const image = item.querySelector('.gallery-image');
        
        if (isHover) {
            item.style.transform = 'translateY(-10px) scale(1.02)';
            image.style.filter = 'brightness(0.7)';
        } else {
            item.style.transform = 'translateY(0) scale(1)';
            image.style.filter = 'brightness(1)';
        }
    }

    animateSocialCard(card, isHover) {
        const arrow = card.querySelector('.social-arrow');
        
        if (isHover) {
            card.style.transform = 'translateY(-5px)';
            arrow.style.transform = 'translateX(5px)';
        } else {
            card.style.transform = 'translateY(0)';
            arrow.style.transform = 'translateX(0)';
        }
    }

    handleKeyboard(e) {
        if (e.code === 'Space' && e.target === document.body) {
            e.preventDefault();
            this.togglePlayPause();
        }
   
        if (e.code === 'ArrowUp') {
            e.preventDefault();
            const currentVolume = this.volumeSlider.value;
            const newVolume = Math.min(100, parseInt(currentVolume) + 5);
            this.volumeSlider.value = newVolume;
            this.audioPlayer.volume = newVolume / 100;
        }
        
        if (e.code === 'ArrowDown') {
            e.preventDefault();
            const currentVolume = this.volumeSlider.value;
            const newVolume = Math.max(0, parseInt(currentVolume) - 5);
            this.volumeSlider.value = newVolume;
            this.audioPlayer.volume = newVolume / 100;
        }
        
        if (e.code === 'ArrowLeft') {
            e.preventDefault();
            this.audioPlayer.currentTime = Math.max(0, this.audioPlayer.currentTime - 5);
        }
        
        if (e.code === 'ArrowRight') {
            e.preventDefault();
            this.audioPlayer.currentTime = Math.min(this.audioPlayer.duration, this.audioPlayer.currentTime + 5);
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new AdvancedPortfolio();
});

const style = document.createElement('style');
style.textContent = `
    .animate-in {
        animation: fadeInUp 0.8s ease forwards;
    }
    
    .custom-cursor {
        transition: transform 0.1s ease;
    }
    
    .nav-menu.active {
        display: flex;
        flex-direction: column;
        position: absolute;
        top: 100%;
        left: 0;
        width: 100%;
        background: rgba(0, 0, 0, 0.95);
        padding: 1rem;
        gap: 1rem;
    }
    
    .nav-toggle.active span:nth-child(1) {
        transform: rotate(-45deg) translate(-5px, 6px);
    }
    
    .nav-toggle.active span:nth-child(2) {
        opacity: 0;
    }
    
    .nav-toggle.active span:nth-child(3) {
        transform: rotate(45deg) translate(-5px, -6px);
    }
    
    @media (max-width: 768px) {
        .nav-menu {
            display: none;
        }
    }
`;
document.head.appendChild(style);

// ==== Smooth Fade In On Scroll ====
window.addEventListener('scroll', () => {
  const elements = document.querySelectorAll('section, .navbar, .footer');
  elements.forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight - 100) {
      el.classList.add('visible');
    }
  });
});

// ==== Background Parallax Effect ====
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  document.body.style.backgroundPositionY = `${scrollY * 0.2}px`;
});

// ==== Generate Particles ====
const particlesContainer = document.getElementById('particles-container');
const particleCount = 70;

for (let i = 0; i < particleCount; i++) {
  const particle = document.createElement('div');
  particle.classList.add('particle');
  particle.style.left = `${Math.random() * 100}%`;
  particle.style.animationDuration = `${5 + Math.random() * 10}s`;
  particle.style.animationDelay = `${Math.random() * 5}s`;
  particlesContainer.appendChild(particle);
}

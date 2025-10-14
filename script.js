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

/* ------------------ CyberFunk JS (optimized) ------------------ */
/* Responsible for: particles canvas, smooth fade-in, parallax, audio player + visualizer */

/* Helpers */
const $ = (s) => document.querySelector(s);
const $$ = (s) => Array.from(document.querySelectorAll(s));
const throttle = (fn, wait=100) => {
  let last = 0;
  return (...args) => {
    const now = Date.now();
    if (now - last >= wait) { last = now; fn(...args); }
  };
};

/* ---------- Fade-in on scroll ---------- */
function revealOnScroll(){
  const items = $$('section, .navbar, .footer');
  const vh = window.innerHeight;
  items.forEach(el => {
    const r = el.getBoundingClientRect();
    if (r.top < vh - 80) el.classList.add('visible');
  });
}
window.addEventListener('scroll', throttle(revealOnScroll, 120));
window.addEventListener('load', revealOnScroll);

/* ---------- Canvas particles (optimized) ---------- */
const canvas = $('#particle-canvas');
const ctx = canvas.getContext('2d');
let W=0,H=0;
function resize(){ W=canvas.width=innerWidth; H=canvas.height=innerHeight; }
window.addEventListener('resize', resize);
resize();

/* Performance detection (light) */
function isLowPower(){
  const t0 = performance.now();
  let s=0;
  for(let i=0;i<200000;i++) s+=Math.sqrt(i);
  return (performance.now() - t0) > 120;
}
const lowPower = isLowPower();

/* Particle pool */
const PARTS = lowPower ? 36 : 100;
const parts = new Array(PARTS).fill(0).map(()=>({
  x: Math.random()*W,
  y: Math.random()*H,
  r: Math.random()*2.2 + 0.2,
  vx: (Math.random()-0.5)*0.25,
  vy: - (0.15 + Math.random()*0.6),
  alpha: 0.2 + Math.random()*0.8,
  phase: Math.random()*Math.PI*2
}));

let last = performance.now();
function loop(now){
  const dt = Math.min(40, now - last);
  last = now;
  ctx.clearRect(0,0,W,H);

  // soft radial overlay
  const g = ctx.createLinearGradient(0,0,W,H);
  g.addColorStop(0, 'rgba(0,0,0,0.02)');
  g.addColorStop(1, 'rgba(0,0,0,0.12)');
  ctx.fillStyle = g;
  ctx.fillRect(0,0,W,H);

  ctx.globalCompositeOperation = 'lighter';
  parts.forEach(p => {
    p.x += p.vx * (dt/16);
    p.y += p.vy * (dt/16);
    p.phase += 0.02*(dt/16);
    if (p.y < -10) { p.y = H + 10; p.x = Math.random()*W; }
    if (p.x < -20) p.x = W + 20;
    if (p.x > W+20) p.x = -20;

    const size = p.r * (1 + Math.sin(p.phase)*0.6);
    const radial = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, size*6);
    radial.addColorStop(0, `rgba(0,224,255,${0.12 * p.alpha})`);
    radial.addColorStop(0.5, `rgba(143,0,255,${0.06 * p.alpha})`);
    radial.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = radial;
    ctx.beginPath();
    ctx.arc(p.x, p.y, size*3.5, 0, Math.PI*2);
    ctx.fill();

    // core
    ctx.beginPath();
    ctx.fillStyle = `rgba(255,255,255,${0.6 * p.alpha})`;
    ctx.arc(p.x, p.y, Math.max(0.3, p.r*0.6), 0, Math.PI*2);
    ctx.fill();
  });
  ctx.globalCompositeOperation = 'source-over';
  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);

/* ---------- Parallax subtle (move canvas with scroll) ---------- */
window.addEventListener('scroll', throttle(()=>{
  const y = window.scrollY;
  canvas.style.transform = `translateY(${y * 0.015}px)`;
  document.body.style.backgroundPosition = `center ${-y * 0.02}px`;
},50));

/* ---------- Audio Player + Visualizer ---------- */
const audio = $('#audioPlayer') || $('#audioPlayerLocal') || $('#audioPlayerLocal'); // try multiple ids
const playBtn = $('#playBtn'); // keep original button in markup
const floatBtn = $('#musicFloat'); // floating control

// ensure we pick the correct audio element
const audioEl = $('#audioPlayerLocal') || $('#audioPlayer') || $('#audioPlayer'); 

// Attach handlers for both buttons (floating + inline)
function togglePlay(){
  if (!audioEl) return;
  if (audioEl.paused) {
    audioEl.play().catch(()=>{});
    if (playBtn){ playBtn.querySelector('.play-icon').style.display='none'; playBtn.querySelector('.pause-icon').style.display='inline'; }
    floatBtn.textContent = '⏸';
  } else {
    audioEl.pause();
    if (playBtn){ playBtn.querySelector('.play-icon').style.display='inline'; playBtn.querySelector('.pause-icon').style.display='none'; }
    floatBtn.textContent = '▶';
  }
}
if (playBtn) playBtn.addEventListener('click', togglePlay);
if (floatBtn) floatBtn.addEventListener('click', togglePlay);

// Visualizer (create audio context on first user gesture)
let audioCtx, analyser, src;
function startVisualizerOnce(){
  if (audioCtx) return;
  try{
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    analyser = audioCtx.createAnalyser();
    analyser.fftSize = 256;
    src = audioCtx.createMediaElementSource(audioEl);
    src.connect(analyser);
    analyser.connect(audioCtx.destination);
    const bufferLen = analyser.frequencyBinCount;
    const data = new Uint8Array(bufferLen);
    const bars = $$('.visualizer-bar');

    (function draw(){
      analyser.getByteFrequencyData(data);
      for (let i=0;i<bars.length;i++){
        const val = data[Math.floor(i * bufferLen / bars.length)] || 0;
        const h = Math.max(6, (val/255) * 80);
        bars[i].style.height = h + 'px';
        bars[i].style.opacity = 0.4 + (val/255)*0.6;
      }
      requestAnimationFrame(draw);
    })();
  }catch(e){
    // ignore if audio context fails
  }
}
// start visualizer on first click anywhere (user gesture)
const initOnce = ()=>{ if (audioEl) startVisualizerOnce(); document.removeEventListener('click', initOnce); };
document.addEventListener('click', initOnce);

/* ---------- Accessibility shortcuts ---------- */
document.addEventListener('keydown', (e)=>{
  if (e.key === 'm') togglePlay(); // m => music
});

/* End of file */

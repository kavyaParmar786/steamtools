/**
 * STEAMTOOLS — Direction-Aware Slider Logic
 * Replicating the mm008 Webflow slider behavior
 */

class HeroSlider {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.cursor = document.querySelector('.slider-cursor');
    if (!this.container || !this.cursor) return;

    this.currentIndex = 0;
    this.isAnimating = false;
    this.slides = [];
    
    // Pick featured games from CATALOG
    this.featured = CATALOG.slice(0, 5); 
    
    this.init();
  }

  init() {
    this.renderSlides();
    this.setupEventListeners();
    this.showSlide(0);
  }

  renderSlides() {
    this.container.innerHTML = this.featured.map((game, i) => `
      <div class="slide" data-index="${i}">
        <div class="slide-bg-container">
          <img src="${STEAMTOOLS_CONFIG.STEAM_IMG}/${game.id}/library_hero.jpg" 
               onerror="this.src='${STEAMTOOLS_CONFIG.STEAM_IMG}/${game.id}/header.jpg'" alt="${game.name}">
        </div>
        <div class="slide-title-wrap">
          <div class="slide-title-huge">${game.name}</div>
        </div>
        <div class="slide-actions">
          <button class="btn-editorial" onclick="openGameModal('${game.id}')">Access Vault</button>
        </div>
      </div>
    `).join('');
    
    this.slideEls = this.container.querySelectorAll('.slide');
  }

  setupEventListeners() {
    // Direction-aware cursor movement
    window.addEventListener('mousemove', (e) => {
      this.cursor.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      
      const isRight = e.clientX > window.innerWidth / 2;
      this.cursor.classList.toggle('is-right', isRight);
      this.cursor.classList.toggle('is-left', !isRight);
    });

    // Slider click navigation
    this.container.addEventListener('click', (e) => {
      if (this.isAnimating) return;
      if (e.target.closest('button') || e.target.closest('a')) return;

      const isRight = e.clientX > window.innerWidth / 2;
      this.transition(isRight ? 1 : -1);
    });
  }

  showSlide(index) {
    this.slideEls.forEach((slide, i) => {
      slide.classList.toggle('active', i === index);
    });
    this.currentIndex = index;
  }

  transition(direction) {
    if (this.isAnimating) return;
    this.isAnimating = true;

    const prevIndex = this.currentIndex;
    this.currentIndex = (this.currentIndex + direction + this.featured.length) % this.featured.length;

    const prevSlide = this.slideEls[prevIndex];
    const nextSlide = this.slideEls[this.currentIndex];

    // Reset classes
    prevSlide.classList.remove('slide-enter-left', 'slide-enter-right', 'slide-exit-left', 'slide-exit-right');
    nextSlide.classList.remove('slide-enter-left', 'slide-enter-right', 'slide-exit-left', 'slide-exit-right');

    if (direction > 0) {
      prevSlide.classList.add('slide-exit-left');
      nextSlide.classList.add('active', 'slide-enter-right');
    } else {
      prevSlide.classList.add('slide-exit-right');
      nextSlide.classList.add('active', 'slide-enter-left');
    }

    // Apply parallax offsets via JS for finer control
    const prevTitle = prevSlide.querySelector('.slide-title-huge');
    const nextTitle = nextSlide.querySelector('.slide-title-huge');
    const prevImg = prevSlide.querySelector('.slide-bg-container');
    const nextImg = nextSlide.querySelector('.slide-bg-container');

    if (direction > 0) {
      prevTitle.style.transform = 'translateX(-30%)';
      prevImg.style.transform = 'translateX(-15%)';
      nextTitle.style.transform = 'translateX(0)';
      nextImg.style.transform = 'translateX(0)';
    } else {
      prevTitle.style.transform = 'translateX(30%)';
      prevImg.style.transform = 'translateX(15%)';
      nextTitle.style.transform = 'translateX(0)';
      nextImg.style.transform = 'translateX(0)';
    }

    setTimeout(() => {
      prevSlide.classList.remove('active', 'slide-exit-left', 'slide-exit-right');
      // Reset transforms
      [prevTitle, nextTitle, prevImg, nextImg].forEach(el => el.style.transform = '');
      this.isAnimating = false;
    }, 1000); 
  }
}

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('hero-slider')) {
    window.steamSlider = new HeroSlider('hero-slider');
  }
});

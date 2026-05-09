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
        <div class="slide-bg">
          <img src="${STEAMTOOLS_CONFIG.STEAM_IMG}/${game.id}/library_hero.jpg" 
               onerror="this.src='${STEAMTOOLS_CONFIG.STEAM_IMG}/${game.id}/header.jpg'" alt="${game.name}">
        </div>
        <div class="slide-overlay"></div>
        <div class="slide-content">
          <div class="hero-tag">
            <span class="tag-dot"></span>
            FEATURED RELEASE
          </div>
          <h1>${game.name}</h1>
          <p class="hero-sub">${game.tag} — Access the full verified manifest now.</p>
          <div class="hero-btns">
            <button class="btn-hero" onclick="openGameModal('${game.id}')">View Details ↗</button>
            <a href="#vault" class="btn-hero-outline">Explore Archive</a>
          </div>
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
      if (isRight) {
        this.nextSlide();
      } else {
        this.prevSlide();
      }
    });
  }

  showSlide(index) {
    this.slideEls.forEach((slide, i) => {
      slide.classList.toggle('active', i === index);
    });
    this.currentIndex = index;
  }

  nextSlide() {
    this.transition(1);
  }

  prevSlide() {
    this.transition(-1);
  }

  transition(direction) {
    if (this.isAnimating) return;
    this.isAnimating = true;

    const prevIndex = this.currentIndex;
    this.currentIndex = (this.currentIndex + direction + this.featured.length) % this.featured.length;

    const prevSlide = this.slideEls[prevIndex];
    const nextSlide = this.slideEls[this.currentIndex];

    // Remove old classes
    prevSlide.classList.remove('slide-enter-left', 'slide-enter-right', 'slide-exit-left', 'slide-exit-right');
    nextSlide.classList.remove('slide-enter-left', 'slide-enter-right', 'slide-exit-left', 'slide-exit-right');

    if (direction > 0) {
      // Moving Forward
      prevSlide.classList.add('slide-exit-left');
      nextSlide.classList.add('active', 'slide-enter-right');
    } else {
      // Moving Backward
      prevSlide.classList.add('slide-exit-right');
      nextSlide.classList.add('active', 'slide-enter-left');
    }

    setTimeout(() => {
      prevSlide.classList.remove('active', 'slide-exit-left', 'slide-exit-right');
      this.isAnimating = false;
    }, 800);
  }
}

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('hero-slider')) {
    window.steamSlider = new HeroSlider('hero-slider');
  }
});

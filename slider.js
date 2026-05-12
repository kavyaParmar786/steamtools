/**
 * STEAMTOOLS — Direction-Aware Slider Logic
 * Snappy, High-Performance Magnetic Editorial Slider
 */

class HeroSlider {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;

    this.currentIndex = 0;
    this.isAnimating = false;
    this.featured = CATALOG.slice(0, 10); 
    this.autoPlayInterval = null;

    // Magnetic variables
    this.target = { x: 0, y: 0 };
    this.current = { x: 0, y: 0 };
    this.activeTitle = null; // Cache for performance
    
    this.init();
  }

  init() {
    this.renderSlides();
    this.setupEventListeners();
    this.startAutoPlay();
    this.tick(); 
  }

  renderSlides() {
    this.container.innerHTML = this.featured.map((game, i) => {
      const isLong = game.name.length > 15;
      return `
        <div class="slide" data-index="${i}">
          <div class="slide-bg-container">
            <img src="${STEAMTOOLS_CONFIG.STEAM_IMG}/${game.id}/library_hero.jpg" 
                 onerror="this.src='${STEAMTOOLS_CONFIG.STEAM_IMG}/${game.id}/header.jpg'" alt="${game.name}">
          </div>
          <div class="slide-title-wrap">
            <div class="slide-title-huge ${isLong ? 'long-title' : ''}">${game.name}</div>
          </div>
          <div class="slide-actions">
            <a href="pages/details.html?id=${game.id}" class="btn-editorial">Access Vault</a>
          </div>
        </div>
      `;
    }).join('');
    
    this.slideEls = this.container.querySelectorAll('.slide');
    this.showSlide(0);
  }

  setupEventListeners() {
    this.container.addEventListener('click', (e) => {
      if (this.isAnimating) return;
      if (e.target.closest('button') || e.target.closest('a')) return;

      const isRight = e.clientX > window.innerWidth / 2;
      this.transition(isRight ? 1 : -1);
      this.resetAutoPlay();
    });

    this.container.addEventListener('mousemove', (e) => {
      if (!this.activeTitle || this.isAnimating) return;

      const rect = this.activeTitle.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      // Snappier target calculation (increased range)
      this.target.x = (e.clientX - centerX) * 0.18;
      this.target.y = (e.clientY - centerY) * 0.18;
    });

    this.container.addEventListener('mouseleave', () => {
      this.target.x = 0;
      this.target.y = 0;
    });
  }

  tick() {
    // Faster Lerp for snappier response (0.2 instead of 0.08)
    this.current.x += (this.target.x - this.current.x) * 0.2;
    this.current.y += (this.target.y - this.current.y) * 0.2;

    if (this.activeTitle && !this.isAnimating) {
      this.activeTitle.style.transform = `translate3d(${this.current.x}px, ${this.current.y}px, 0)`;
    }

    requestAnimationFrame(() => this.tick());
  }

  startAutoPlay() {
    if (this.autoPlayInterval) clearInterval(this.autoPlayInterval);
    this.autoPlayInterval = setInterval(() => {
      this.transition(1);
    }, 5000);
  }

  resetAutoPlay() {
    this.startAutoPlay();
  }

  showSlide(index) {
    this.slideEls.forEach((slide, i) => {
      slide.classList.toggle('active', i === index);
      if (i === index) {
        this.activeTitle = slide.querySelector('.slide-title-huge');
      }
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

    // Prepare next slide cache
    this.activeTitle = nextSlide.querySelector('.slide-title-huge');

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

    // Parallax
    const prevTitle = prevSlide.querySelector('.slide-title-huge');
    const prevImg = prevSlide.querySelector('.slide-bg-container');

    if (direction > 0) {
      if(prevTitle) prevTitle.style.transform = 'translateX(-30%)';
      if(prevImg) prevImg.style.transform = 'translateX(-15%)';
    } else {
      if(prevTitle) prevTitle.style.transform = 'translateX(30%)';
      if(prevImg) prevImg.style.transform = 'translateX(15%)';
    }

    setTimeout(() => {
      prevSlide.classList.remove('active', 'slide-exit-left', 'slide-exit-right');
      [prevTitle, prevImg].forEach(el => {
        if(el) el.style.transform = '';
      });
      this.current.x = 0; this.current.y = 0;
      this.target.x = 0; this.target.y = 0;
      this.isAnimating = false;
    }, 1000); 
  }
}

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('hero-slider')) {
    window.steamSlider = new HeroSlider('hero-slider');
  }
});

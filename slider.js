/**
 * STEAMTOOLS — Direction-Aware Slider Logic
 * Auto-rotating, cleaned-up editorial slider
 */

class HeroSlider {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;

    this.currentIndex = 0;
    this.isAnimating = false;
    this.featured = CATALOG.slice(0, 10); 
    this.autoPlayInterval = null;
    
    this.init();
  }

  init() {
    this.renderSlides();
    this.setupEventListeners();
    this.startAutoPlay();
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
            <button class="btn-editorial" onclick="openGameModal('${game.id}')">Access Vault</button>
          </div>
        </div>
      `;
    }).join('');
    
    this.slideEls = this.container.querySelectorAll('.slide');
    this.showSlide(0);
  }

  setupEventListeners() {
    // Slider click navigation
    this.container.addEventListener('click', (e) => {
      if (this.isAnimating) return;
      if (e.target.closest('button') || e.target.closest('a')) return;

      const isRight = e.clientX > window.innerWidth / 2;
      this.transition(isRight ? 1 : -1);
      this.resetAutoPlay();
    });

    // Magnetic Text Follow Effect
    this.container.addEventListener('mousemove', (e) => {
      const activeTitle = this.container.querySelector('.slide.active .slide-title-huge');
      if (!activeTitle) return;

      const rect = activeTitle.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      // Calculate distance from center (scaled down for subtlety)
      const deltaX = (e.clientX - centerX) * 0.15;
      const deltaY = (e.clientY - centerY) * 0.15;

      activeTitle.style.transform = `translate3d(${deltaX}px, ${deltaY}px, 0)`;
    });

    // Reset title position on mouse leave
    this.container.addEventListener('mouseleave', () => {
      const activeTitle = this.container.querySelector('.slide.active .slide-title-huge');
      if (activeTitle) activeTitle.style.transform = `translate3d(0, 0, 0)`;
    });
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

    // Parallax logic
    const prevTitle = prevSlide.querySelector('.slide-title-huge');
    const nextTitle = nextSlide.querySelector('.slide-title-huge');
    const prevImg = prevSlide.querySelector('.slide-bg-container');
    const nextImg = nextSlide.querySelector('.slide-bg-container');

    if (direction > 0) {
      prevTitle.style.transform = 'translateX(-30%)';
      prevImg.style.transform = 'translateX(-15%)';
    } else {
      prevTitle.style.transform = 'translateX(30%)';
      prevImg.style.transform = 'translateX(15%)';
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

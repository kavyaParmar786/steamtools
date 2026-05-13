/* STRAW HAT — HERO SLIDER (smaller title, landscape art) */

const SLIDER_GAMES = [
  { id:'1245620', short:'ELDEN RING',     btn:'Enter The Erdtree' },
  { id:'1091500', short:'CYBERPUNK 2077', btn:'Jack In'           },
  { id:'553850',  short:'HELLDIVERS II',  btn:'Deploy Now'        },
  { id:'1086940', short:"BALDUR'S GATE",  btn:'Begin Adventure'   },
  { id:'1174180', short:'RED DEAD II',    btn:'Ride Out'          },
];

let sliderIndex = 0;
let sliderTimer = null;
let isAnimating = false;

function buildSlider() {
  const container = document.getElementById('hero-slider');
  const dotsWrap  = document.getElementById('slider-dots');
  if (!container) return;

  container.innerHTML = SLIDER_GAMES.map((g, i) => `
    <div class="slide ${i === 0 ? 'active' : ''}" data-index="${i}" data-id="${g.id}">
      <div class="slide-bg-container">
        <img
          src="https://cdn.cloudflare.steamstatic.com/steam/apps/${g.id}/library_hero.jpg"
          alt="${g.short}"
          onerror="this.src='https://cdn.cloudflare.steamstatic.com/steam/apps/${g.id}/capsule_616x353.jpg'"
          loading="lazy">
      </div>
      <div class="slide-title-wrap">
        <span class="slide-title-huge ${g.short.length > 12 ? 'long-title' : ''}">${g.short}</span>
      </div>
      <div class="slide-actions">
        <a href="pages/store.html" class="btn-editorial"
           onclick="if(typeof openGameModal!=='undefined'){openGameModal('${g.id}');}return false;">${g.btn}</a>
      </div>
    </div>`).join('');

  if (dotsWrap) {
    dotsWrap.innerHTML = SLIDER_GAMES.map((_, i) =>
      `<div class="slider-dot ${i === 0 ? 'active' : ''}" data-dot="${i}"></div>`
    ).join('');
    dotsWrap.querySelectorAll('.slider-dot').forEach(dot => {
      dot.addEventListener('click', () => goToSlide(+dot.dataset.dot));
    });
  }

  document.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight') nextSlide();
    if (e.key === 'ArrowLeft')  prevSlide();
  });

  let tx = 0;
  container.addEventListener('touchstart', e => { tx = e.touches[0].clientX; }, { passive: true });
  container.addEventListener('touchend',   e => {
    const dx = e.changedTouches[0].clientX - tx;
    if (Math.abs(dx) > 50) dx < 0 ? nextSlide() : prevSlide();
  });

  startAutoPlay();
}

function goToSlide(next, direction) {
  if (isAnimating || next === sliderIndex) return;
  isAnimating = true;
  const slides = document.querySelectorAll('.slide');
  const dots   = document.querySelectorAll('.slider-dot');
  const prev   = sliderIndex;
  const dir    = direction || (next > prev ? 'right' : 'left');
  const outAnim = dir === 'right' ? 'slide-exit-left'  : 'slide-exit-right';
  const inAnim  = dir === 'right' ? 'slide-enter-right': 'slide-enter-left';
  slides[prev].classList.add(outAnim);
  slides[next].classList.add(inAnim);
  slides[next].classList.add('active');
  dots.forEach(d => d.classList.remove('active'));
  if (dots[next]) dots[next].classList.add('active');
  setTimeout(() => {
    slides[prev].classList.remove('active', outAnim);
    slides[next].classList.remove(inAnim);
    sliderIndex = next;
    isAnimating = false;
  }, 900);
}

function nextSlide() { goToSlide((sliderIndex+1)%SLIDER_GAMES.length,'right'); resetAutoPlay(); }
function prevSlide() { goToSlide((sliderIndex-1+SLIDER_GAMES.length)%SLIDER_GAMES.length,'left'); resetAutoPlay(); }
function startAutoPlay() { sliderTimer = setInterval(nextSlide, 5500); }
function resetAutoPlay()  { clearInterval(sliderTimer); startAutoPlay(); }

document.addEventListener('DOMContentLoaded', buildSlider);

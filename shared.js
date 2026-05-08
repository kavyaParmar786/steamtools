/**
 * STEAMTOOLS — Premium Light Shared Scripts
 * Custom cursor, scroll reveal, smooth nav, subpage WebGL init
 */

/* ── Custom cursor glow ──────────────────────────── */
function initCursor() {
  const dot  = document.querySelector('.cursor-dot');
  const ring = document.querySelector('.cursor-ring');
  if (!dot || !ring) return;

  let mx = -100, my = -100, rx = -100, ry = -100;

  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

  function animCursor() {
    rx += (mx - rx) * 0.14;
    ry += (my - ry) * 0.14;
    dot.style.left  = mx + 'px'; dot.style.top  = my + 'px';
    ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
    requestAnimationFrame(animCursor);
  }
  animCursor();

  document.querySelectorAll('a,button').forEach(el => {
    el.addEventListener('mouseenter', () => {
      dot.style.width = '10px'; dot.style.height = '10px';
    });
    el.addEventListener('mouseleave', () => {
      dot.style.width = '6px'; dot.style.height = '6px';
    });
  });
}

/* ── Scroll reveal ───────────────────────────────── */
function initScrollReveal() {
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
    });
  }, { threshold: 0.08 });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));
}

/* ── Nav scroll state ────────────────────────────── */
function initNav() {
  window.addEventListener('scroll', () => {
    const nav = document.querySelector('nav');
    if (nav) nav.classList.toggle('scrolled', window.scrollY > 40);
  });
}

/* ── Subpage WebGL — rename canvas & load ocean.js ── */
function initSubpageWebGL() {
  const canvas = document.getElementById('webgl-bg');
  if (!canvas) return; // not a subpage or already handled
  canvas.id = 'ocean-bg';

  const s = document.createElement('script');
  s.src = '../ocean.js';
  document.body.appendChild(s);
}

/* ── Init ─────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initCursor();
  initScrollReveal();
  initNav();
  initSubpageWebGL();
});

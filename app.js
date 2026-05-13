/**
 * STEAMTOOLS — APP.JS
 * Homepage slider init + doodle canvas previews init
 */
document.addEventListener('DOMContentLoaded', () => {
  // Init doodle previews with canvas animations
  initDoodlePreviews();

  // Animate stat counters
  document.querySelectorAll('.desc-stat-num[data-count]').forEach(el => {
    const target = parseInt(el.dataset.count);
    const suffix = el.textContent.replace(/[0-9]/g, '');
    let current = 0;
    const step = Math.ceil(target / 60);
    const ro = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        const interval = setInterval(() => {
          current = Math.min(current + step, target);
          el.textContent = current + suffix;
          if (current >= target) clearInterval(interval);
        }, 18);
        ro.unobserve(el);
      }
    });
    ro.observe(el);
  });
});

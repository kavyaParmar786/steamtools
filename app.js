/* STEAMTOOLS — Main App Logic */
document.addEventListener('DOMContentLoaded', () => {

  /* ── Loading animation ─────────────────────────────── */
  const loader = document.createElement('div');
  loader.id = 'st-loader';
  loader.innerHTML = `
    <div class="loader-inner">
      <div class="loader-logo">
        <div class="loader-icon">ST</div>
        <span class="loader-text">STEAM<span>TOOLS</span></span>
      </div>
      <div class="loader-bar"><div class="loader-fill"></div></div>
    </div>
  `;
  document.body.appendChild(loader);

  setTimeout(() => {
    loader.classList.add('fade-out');
    setTimeout(() => loader.remove(), 600);
  }, 1200);

  /* ── Game vault data ─────────────────────────────── */
  const vaultData = [
    { id: '271590',  name: 'Grand Theft Auto V',    category: 'aaa',      tag: 'AAA · Action' },
    { id: '1174180', name: 'Red Dead Redemption 2', category: 'aaa',      tag: 'AAA · Adventure' },
    { id: '1245620', name: 'Elden Ring',             category: 'aaa',      tag: 'AAA · RPG' },
    { id: '1091500', name: 'Cyberpunk 2077',         category: 'aaa',      tag: 'AAA · Sci-Fi' },
    { id: '252490',  name: 'Rust',                   category: 'survival', tag: 'Survival · PVP' },
    { id: '1086940', name: "Baldur's Gate 3",        category: 'aaa',      tag: 'AAA · RPG' },
    { id: '264710',  name: 'Subnautica',             category: 'survival', tag: 'Survival · Indie' },
    { id: '1145360', name: 'Hades',                  category: 'indie',    tag: 'Indie · Roguelike' },
    { id: '413150',  name: 'Stardew Valley',         category: 'indie',    tag: 'Indie · RPG' },
    { id: '311690',  name: 'Gunpoint',               category: 'indie',    tag: 'Indie · Stealth' }
  ];

  const archive = document.getElementById('game-archive');
  if (!archive) return;

  function renderVault(filter = 'all') {
    archive.innerHTML = '';
    const filtered = filter === 'all' ? vaultData : vaultData.filter(g => g.category === filter);
    filtered.forEach((game, i) => {
      const imgUrl = `https://cdn.cloudflare.steamstatic.com/steam/apps/${game.id}/library_600x900_2x.jpg`;
      const card = document.createElement('div');
      card.className = 'game-card reveal visible';
      card.style.transitionDelay = `${i * 0.055}s`;
      card.setAttribute('data-category', game.category);
      card.innerHTML = `
        <div class="game-img">
          <img src="${imgUrl}" alt="${game.name}" loading="lazy"
               onerror="this.src='https://placehold.co/300x450/e8eeff/6b9ef8?text=${encodeURIComponent(game.name)}'">
          <span class="game-status-badge">VERIFIED</span>
          <div class="game-overlay">
            <button class="btn-get">Get Game ↗</button>
          </div>
        </div>
        <div class="game-info">
          <h3>${game.name}</h3>
          <span class="game-tag">${game.tag}</span>
        </div>
      `;
      archive.appendChild(card);
    });
  }

  renderVault();

  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderVault(btn.getAttribute('data-filter'));
    });
  });

  /* ── Scroll reveal for homepage ─────────────────── */
  const revealEls = document.querySelectorAll('.reveal');
  const ro = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); ro.unobserve(e.target); }});
  }, { threshold: 0.08 });
  revealEls.forEach(el => ro.observe(el));

  /* ── Smooth scroll ───────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const t = document.querySelector(a.getAttribute('href'));
      if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth' }); }
    });
  });
});

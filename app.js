document.addEventListener('DOMContentLoaded', () => {
  const vaultData = [
    { id: '271590',  name: 'Grand Theft Auto V',     category: 'aaa',      tag: 'AAA · Action' },
    { id: '1174180', name: 'Red Dead Redemption 2',  category: 'aaa',      tag: 'AAA · Adventure' },
    { id: '1245620', name: 'Elden Ring',              category: 'aaa',      tag: 'AAA · RPG' },
    { id: '1091500', name: 'Cyberpunk 2077',          category: 'aaa',      tag: 'AAA · Sci-Fi' },
    { id: '252490',  name: 'Rust',                    category: 'survival', tag: 'Survival · PVP' },
    { id: '1086940', name: "Baldur's Gate 3",         category: 'aaa',      tag: 'AAA · RPG' },
    { id: '264710',  name: 'Subnautica',              category: 'survival', tag: 'Survival · Indie' },
    { id: '1145360', name: 'Hades',                   category: 'indie',    tag: 'Indie · Roguelike' },
    { id: '413150',  name: 'Stardew Valley',          category: 'indie',    tag: 'Indie · RPG' },
    { id: '311690',  name: 'Gunpoint',                category: 'indie',    tag: 'Indie · Stealth' }
  ];

  const archive = document.getElementById('game-archive');
  if (!archive) return;

  function renderVault(filter = 'all') {
    archive.innerHTML = '';
    const filtered = filter === 'all' ? vaultData : vaultData.filter(g => g.category === filter);
    filtered.forEach((game, i) => {
      const imgUrl = `https://cdn.cloudflare.steamstatic.com/steam/apps/${game.id}/library_600x900_2x.jpg`;
      const card = document.createElement('div');
      card.className = 'game-card reveal';
      card.style.transitionDelay = `${i * 0.05}s`;
      card.setAttribute('data-category', game.category);
      card.innerHTML = `
        <div class="game-img">
          <img src="${imgUrl}" alt="${game.name}" loading="lazy" onerror="this.src='https://placehold.co/300x450/080c14/5e7a99?text=${encodeURIComponent(game.name)}'">
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

    // Re-trigger scroll reveal for new cards
    setTimeout(() => {
      document.querySelectorAll('.game-card.reveal').forEach(el => el.classList.add('visible'));
    }, 50);
  }

  renderVault();

  // Filter buttons
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderVault(btn.getAttribute('data-filter'));
    });
  });

  // Smooth scroll
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const t = document.querySelector(a.getAttribute('href'));
      if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth' }); }
    });
  });
});

/* STEAMTOOLS — Main App Logic */

// ── Homepage logic ──
document.addEventListener('DOMContentLoaded', () => {
  // Loading screen
  const loader = document.createElement('div');
  loader.id = 'st-loader';
  loader.innerHTML = `<div class="loader-inner">
    <div class="loader-logo"><div class="loader-icon">ST</div>
    <span class="loader-text">STEAM<span>TOOLS</span></span></div>
    <div class="loader-bar"><div class="loader-fill"></div></div></div>`;
  document.body.appendChild(loader);
  
  setTimeout(() => { 
    loader.classList.add('fade-out'); 
    setTimeout(() => loader.remove(), 600); 
  }, 1200);

  const archive = document.getElementById('game-archive');
  if (!archive) return;

  function renderVault(filter = 'all') {
    archive.innerHTML = '';
    const filtered = filter === 'all' ? CATALOG : CATALOG.filter(g => g.cat === filter);
    
    filtered.forEach((game, i) => {
      const card = document.createElement('div');
      card.className = 'game-card reveal visible';
      card.style.transitionDelay = `${i * 0.05}s`;
      card.dataset.category = game.cat;
      card.innerHTML = `
        <div class="game-img">
          <img src="${STEAMTOOLS_CONFIG.STEAM_IMG}/${game.id}/library_600x900_2x.jpg" alt="${game.name}" loading="lazy"
               onerror="this.src='https://placehold.co/300x450/0a0f1a/6b9ef8?text=${encodeURIComponent(game.name)}'">
          <span class="game-status-badge">VERIFIED</span>
          <div class="game-overlay">
            <button class="btn-get" onclick="openGameModal('${game.id}')">View Details ↗</button>
          </div>
        </div>
        <div class="game-info">
          <h3>${game.name}</h3>
          <span class="game-tag">${game.tag}</span>
        </div>`;
      archive.appendChild(card);
    });
  }

  renderVault();

  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderVault(btn.dataset.filter);
    });
  });
});


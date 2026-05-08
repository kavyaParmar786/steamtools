/* STEAMTOOLS — Main App Logic with GameGen + Steam API */
const GAMEGEN_KEY = 'mg_89fab80a0e6c4949b0c169de799f4499';
const GAMEGEN_BASE = 'https://gamegen.lol/api/' + GAMEGEN_KEY;
const STEAM_IMG = 'https://cdn.cloudflare.steamstatic.com/steam/apps';

// Hardcoded game catalog with Steam App IDs
const CATALOG = [
  { id:'271590',  name:'Grand Theft Auto V',    cat:'aaa',      tag:'AAA · Action' },
  { id:'1174180', name:'Red Dead Redemption 2', cat:'aaa',      tag:'AAA · Adventure' },
  { id:'1245620', name:'Elden Ring',            cat:'aaa',      tag:'AAA · RPG' },
  { id:'1091500', name:'Cyberpunk 2077',        cat:'aaa',      tag:'AAA · Sci-Fi' },
  { id:'252490',  name:'Rust',                  cat:'survival', tag:'Survival · PVP' },
  { id:'1086940', name:"Baldur's Gate 3",       cat:'aaa',      tag:'AAA · RPG' },
  { id:'264710',  name:'Subnautica',            cat:'survival', tag:'Survival · Indie' },
  { id:'1145360', name:'Hades',                 cat:'indie',    tag:'Indie · Roguelike' },
  { id:'413150',  name:'Stardew Valley',        cat:'indie',    tag:'Indie · RPG' },
  { id:'311690',  name:'Gunpoint',              cat:'indie',    tag:'Indie · Stealth' },
  { id:'570',     name:'Dota 2',                cat:'aaa',      tag:'AAA · MOBA' },
  { id:'730',     name:'Counter-Strike 2',      cat:'aaa',      tag:'AAA · FPS' },
  { id:'892970',  name:'Valheim',               cat:'survival', tag:'Survival · Co-op' },
  { id:'1203220', name:'NARAKA: BLADEPOINT',    cat:'aaa',      tag:'AAA · Battle Royale' },
  { id:'1817070', name:'Marvel Rivals',         cat:'aaa',      tag:'AAA · Shooter' },
  { id:'1172470', name:'Apex Legends',          cat:'aaa',      tag:'AAA · Battle Royale' },
  { id:'812140',  name:'Assassins Creed Odyssey',cat:'aaa',     tag:'AAA · RPG' },
  { id:'1238810', name:'Battlefield 2042',      cat:'aaa',      tag:'AAA · FPS' },
  { id:'553850',  name:'HELLDIVERS 2',          cat:'aaa',      tag:'AAA · Co-op' },
  { id:'814380',  name:'Sekiro',                cat:'aaa',      tag:'AAA · Action' },
];

// Steam detail cache
const steamCache = {};

async function fetchSteamDetails(appId) {
  if (steamCache[appId]) return steamCache[appId];
  try {
    const r = await fetch(`https://store.steampowered.com/api/appdetails?appids=${appId}`);
    const j = await r.json();
    if (j[appId] && j[appId].success) {
      steamCache[appId] = j[appId].data;
      return j[appId].data;
    }
  } catch(e) { console.warn('Steam API error for', appId, e); }
  return null;
}

async function fetchGameGenLink(appId) {
  try {
    const r = await fetch(`${GAMEGEN_BASE}/generate/${appId}`);
    const j = await r.json();
    if (j.success && j.manifest) return j.manifest.downloadUrl;
  } catch(e) { console.warn('GameGen error for', appId, e); }
  return null;
}

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
  setTimeout(() => { loader.classList.add('fade-out'); setTimeout(() => loader.remove(), 600); }, 1200);

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
          <img src="${STEAM_IMG}/${game.id}/library_600x900_2x.jpg" alt="${game.name}" loading="lazy"
               onerror="this.src='https://placehold.co/300x450/0a0f1a/6b9ef8?text=${encodeURIComponent(game.name)}'">
          <span class="game-status-badge">VERIFIED</span>
          <div class="game-overlay"><button class="btn-get" onclick="openGameModal('${game.id}')">View Details ↗</button></div>
        </div>
        <div class="game-info"><h3>${game.name}</h3><span class="game-tag">${game.tag}</span></div>`;
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

// ── Game Detail Modal ──
async function openGameModal(appId) {
  const game = CATALOG.find(g => g.id === appId);
  if (!game) return;

  // Remove existing modal
  document.querySelector('.game-modal-overlay')?.remove();

  const overlay = document.createElement('div');
  overlay.className = 'game-modal-overlay';
  overlay.innerHTML = `<div class="game-modal">
    <button class="modal-close" onclick="this.closest('.game-modal-overlay').remove()">✕</button>
    <div class="modal-hero">
      <img src="${STEAM_IMG}/${appId}/header.jpg" alt="${game.name}"
           onerror="this.src='${STEAM_IMG}/${appId}/library_600x900_2x.jpg'">
      <div class="modal-hero-gradient"></div>
    </div>
    <div class="modal-body">
      <div class="modal-main">
        <h1>${game.name}</h1>
        <span class="game-tag" style="margin-bottom:16px;display:inline-block">${game.tag}</span>
        <div class="modal-desc"><p>Loading description from Steam...</p></div>
        <div class="modal-screens"><h3>Screenshots</h3><div class="screens-row" id="screens-${appId}">Loading...</div></div>
      </div>
      <div class="modal-sidebar">
        <button class="btn-hero btn-download" id="dl-btn-${appId}" disabled>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/>
            <line x1="12" y1="15" x2="12" y2="3"/></svg>
          Generating Link...
        </button>
        <div class="modal-meta" id="meta-${appId}">Loading info...</div>
      </div>
    </div>
  </div>`;
  document.body.appendChild(overlay);
  overlay.addEventListener('click', e => { if (e.target === overlay) overlay.remove(); });

  // Fetch Steam details
  const details = await fetchSteamDetails(appId);
  if (details) {
    const desc = overlay.querySelector('.modal-desc');
    desc.innerHTML = `<p>${details.short_description || 'No description available.'}</p>`;

    const screensEl = document.getElementById(`screens-${appId}`);
    if (details.screenshots && details.screenshots.length > 0) {
      screensEl.innerHTML = details.screenshots.slice(0, 6).map(s =>
        `<img src="${s.path_thumbnail}" alt="Screenshot" class="screen-thumb" onclick="this.classList.toggle('expanded')">`
      ).join('');
    } else {
      screensEl.innerHTML = '<p>No screenshots available</p>';
    }

    const metaEl = document.getElementById(`meta-${appId}`);
    const genres = details.genres ? details.genres.map(g => g.description).join(', ') : 'N/A';
    const devs = details.developers ? details.developers.join(', ') : 'N/A';
    const pubs = details.publishers ? details.publishers.join(', ') : 'N/A';
    const date = details.release_date ? details.release_date.date : 'N/A';
    metaEl.innerHTML = `
      <div class="meta-row"><span>Developer</span><span>${devs}</span></div>
      <div class="meta-row"><span>Publisher</span><span>${pubs}</span></div>
      <div class="meta-row"><span>Genre</span><span>${genres}</span></div>
      <div class="meta-row"><span>Release</span><span>${date}</span></div>`;
  }

  // Fetch GameGen download link
  const dlBtn = document.getElementById(`dl-btn-${appId}`);
  const dlUrl = await fetchGameGenLink(appId);
  if (dlUrl) {
    dlBtn.disabled = false;
    dlBtn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/>
      <line x1="12" y1="15" x2="12" y2="3"/></svg> Get Game`;
    dlBtn.onclick = () => window.open(dlUrl, '_blank');
  } else {
    dlBtn.innerHTML = '⚠ Unavailable';
  }
}

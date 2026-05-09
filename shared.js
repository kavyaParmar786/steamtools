/**
 * STEAMTOOLS — Premium Light Shared Scripts
 * Custom cursor, scroll reveal, smooth nav, subpage WebGL init
 * Centralized Game Catalog & API Logic
 */

/* ── CONFIG & DATA ────────────────────────────── */
const STEAMTOOLS_CONFIG = {
  GAMEGEN_KEY: 'mg_89fab80a0e6c4949b0c169de799f4499',
  GAMEGEN_BASE: 'https://gamegen.lol/api/mg_89fab80a0e6c4949b0c169de799f4499',
  STEAM_IMG: 'https://cdn.cloudflare.steamstatic.com/steam/apps',
  GITHUB_REPO: 'steamtoolsbot-dhyey/filebase'
};

const CATALOG = [
  { id:'271590',  name:'Grand Theft Auto V',    short:'GTA V',        cat:'aaa',      tag:'AAA · Action' },
  { id:'1174180', name:'Red Dead Redemption 2', short:'RDR 2',        cat:'aaa',      tag:'AAA · Adventure' },
  { id:'1245620', name:'Elden Ring',            short:'ELDEN RING',   cat:'aaa',      tag:'AAA · RPG' },
  { id:'1091500', name:'Cyberpunk 2077',        short:'CP 2077',      cat:'aaa',      tag:'AAA · Sci-Fi' },
  { id:'252490',  name:'Rust',                  short:'RUST',         cat:'survival', tag:'Survival · PVP' },
  { id:'1086940', name:"Baldur's Gate 3",       short:'BG 3',         cat:'aaa',      tag:'AAA · RPG' },
  { id:'264710',  name:'Subnautica',            short:'SUBNAUTICA',   cat:'survival', tag:'Survival · Indie' },
  { id:'1145360', name:'Hades',                 short:'HADES',        cat:'indie',    tag:'Indie · Roguelike' },
  { id:'413150',  name:'Stardew Valley',        short:'STARDEW',      cat:'indie',    tag:'Indie · RPG' },
  { id:'311690',  name:'Gunpoint',              short:'GUNPOINT',     cat:'indie',    tag:'Indie · Stealth' },
  { id:'570',     name:'Dota 2',                short:'DOTA 2',       cat:'aaa',      tag:'AAA · MOBA' },
  { id:'730',     name:'Counter-Strike 2',      short:'CS 2',         cat:'aaa',      tag:'AAA · FPS' },
  { id:'892970',  name:'Valheim',               short:'VALHEIM',      cat:'survival', tag:'Survival · Co-op' },
  { id:'1203220', name:'NARAKA: BLADEPOINT',    short:'NARAKA',       cat:'aaa',      tag:'AAA · Battle Royale' },
  { id:'1817070', name:'Marvel Rivals',         short:'M-RIVALS',     cat:'aaa',      tag:'AAA · Shooter' },
  { id:'1172470', name:'Apex Legends',          short:'APEX',         cat:'aaa',      tag:'AAA · Battle Royale' },
  { id:'812140',  name:'Assassins Creed Odyssey',short:'AC ODYSSEY',  cat:'aaa',      tag:'AAA · RPG' },
  { id:'1238810', name:'Battlefield 2042',      short:'BF 2042',      cat:'aaa',      tag:'AAA · FPS' },
  { id:'553850',  name:'HELLDIVERS 2',          short:'HELLDIVERS',   cat:'aaa',      tag:'AAA · Co-op' },
  { id:'814380',  name:'Sekiro',                short:'SEKIRO',       cat:'aaa',      tag:'Action' },
];

const drops = [
  { id:'1091500', name:'Cyberpunk 2077 — Phantom Liberty', date:'MAY 08, 2026', tag:'AAA · SCI-FI',  badge:'NEW' },
  { id:'553850',  name:'HELLDIVERS 2',                     date:'MAY 07, 2026', tag:'AAA · CO-OP',   badge:'HOT' },
  { id:'1245620', name:'Elden Ring — Shadow of the Erdtree',date:'MAY 05, 2026',tag:'AAA · RPG',     badge:'NEW' },
  { id:'814380',  name:'Sekiro: Shadows Die Twice',        date:'MAY 03, 2026', tag:'AAA · ACTION',  badge:'VERIFIED' },
  { id:'1086940', name:"Baldur's Gate 3 — Patch 8",        date:'APR 30, 2026', tag:'AAA · RPG',     badge:'UPDATED' },
  { id:'892970',  name:'Valheim — Ashlands Update',        date:'APR 28, 2026', tag:'SURVIVAL',      badge:'UPDATED' },
  { id:'1145360', name:'Hades II — Early Access',          date:'APR 25, 2026', tag:'INDIE · ROGUE', badge:'NEW' },
  { id:'413150',  name:'Stardew Valley 1.6',               date:'APR 22, 2026', tag:'INDIE · RPG',   badge:'VERIFIED' },
];

const fixes = [
  {
    title: 'DirectX 12 Optimization Patch',
    desc: 'Improves GPU utilization on NVIDIA 30/40-series and AMD RDNA2+ cards. Resolves shader compilation stuttering.',
    badge: 'NEW', cat: 'performance',
    game: 'Universal', version: 'v3.1'
  },
  {
    title: 'Elden Ring 60 FPS Unlock',
    desc: 'Community framerate unlocker with proper frametime management for smooth high-refresh-rate gameplay.',
    badge: 'HOT', cat: 'performance',
    game: 'Elden Ring', version: 'v2.4'
  },
  {
    title: 'Cyberpunk 2077 Memory Leak Fix',
    desc: 'Resolves crash-on-extended-play on Intel 12th/13th gen processors. Stable for sessions over 3 hours.',
    badge: '', cat: 'crash',
    game: 'Cyberpunk 2077', version: 'v1.8'
  },
  {
    title: 'RDR2 Vulkan Crash Fix',
    desc: 'Patches the Vulkan backend crash triggered on AMD GPUs when entering dense foliage areas.',
    badge: '', cat: 'crash',
    game: 'Red Dead Redemption 2', version: 'v2.0'
  },
  {
    title: "Baldur's Gate 3 Save Repair",
    desc: 'Fixes corrupted save files caused by the Act 2 crossfade bug. Restores progress without rollback.',
    badge: 'VERIFIED', cat: 'crash',
    game: "Baldur's Gate 3", version: 'v1.3'
  },
  {
    title: 'Universal Audio Fix',
    desc: 'Restores surround sound output for games using deprecated XAudio2 on Windows 11 22H2+.',
    badge: 'NEW', cat: 'audio',
    game: 'Universal', version: 'v4.0'
  },
  {
    title: 'Rust Anti-Stutter Patch',
    desc: 'Eliminates micro-stuttering in Rust by optimizing garbage collection and asset streaming pipeline.',
    badge: 'HOT', cat: 'performance',
    game: 'Rust', version: 'v1.6'
  },
  {
    title: 'HELLDIVERS 2 Crash-on-Join Fix',
    desc: 'Resolves the frequent crash when joining multiplayer sessions via quickplay. Patches network handshake timeout.',
    badge: 'NEW', cat: 'crash',
    game: 'HELLDIVERS 2', version: 'v1.1'
  },
  {
    title: 'Valheim Audio Desync Fix',
    desc: 'Fixes positional audio desyncing after extended play sessions and resolves echo in underground biomes.',
    badge: '', cat: 'audio',
    game: 'Valheim', version: 'v2.2'
  },
];

const steamCache = {};

/* ── API FUNCTIONS ────────────────────────────── */
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
    const r = await fetch(`${STEAMTOOLS_CONFIG.GAMEGEN_BASE}/generate/${appId}`);
    const j = await r.json();
    if (j.success && j.manifest) return j.manifest.downloadUrl;
  } catch(e) { console.warn('GameGen error for', appId, e); }

  // Fallback to GitHub filebase
  try {
    const r = await fetch(`https://api.github.com/repos/${STEAMTOOLS_CONFIG.GITHUB_REPO}/contents/${appId}.lua`);
    if (r.ok) {
      const j = await r.json();
      return j.download_url;
    }
  } catch(e) { console.warn('GitHub fallback error for', appId, e); }

  return null;
}

/* ── MODAL SYSTEM ─────────────────────────────── */
async function openGameModal(appId) {
  const game = CATALOG.find(g => g.id === appId);
  if (!game) return;

  document.querySelector('.game-modal-overlay')?.remove();

  const overlay = document.createElement('div');
  overlay.className = 'game-modal-overlay';
  overlay.innerHTML = `<div class="game-modal">
    <button class="modal-close" onclick="this.closest('.game-modal-overlay').remove()">✕</button>
    <div class="modal-hero">
      <img src="${STEAMTOOLS_CONFIG.STEAM_IMG}/${appId}/header.jpg" alt="${game.name}"
           onerror="this.src='${STEAMTOOLS_CONFIG.STEAM_IMG}/${appId}/library_600x900_2x.jpg'">
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
    metaEl.innerHTML = `
      <div class="meta-row"><span>Developer</span><span>${(details.developers || ['N/A']).join(', ')}</span></div>
      <div class="meta-row"><span>Publisher</span><span>${(details.publishers || ['N/A']).join(', ')}</span></div>
      <div class="meta-row"><span>Genre</span><span>${(details.genres || []).map(g => g.description).join(', ') || 'N/A'}</span></div>
      <div class="meta-row"><span>Release</span><span>${details.release_date?.date || 'N/A'}</span></div>`;
  }

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

/* ── UI HELPERS ──────────────────────────────── */
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

  document.querySelectorAll('a,button,.game-card').forEach(el => {
    el.addEventListener('mouseenter', () => { dot.style.width = '10px'; dot.style.height = '10px'; });
    el.addEventListener('mouseleave', () => { dot.style.width = '6px'; dot.style.height = '6px'; });
  });
}

function initReveal() {
  const revealEls = document.querySelectorAll('.reveal');
  const ro = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        ro.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });
  revealEls.forEach(el => ro.observe(el));
}

function initNav() {
  window.addEventListener('scroll', () => {
    const nav = document.querySelector('nav');
    if (nav) nav.classList.toggle('scrolled', window.scrollY > 40);
  });
}

function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const href = a.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}

/* ── INITIALIZATION ───────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initCursor();
  initReveal();
  initNav();
  initSmoothScroll();
});

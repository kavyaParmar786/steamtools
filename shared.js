/**
 * STEAMTOOLS — GODLIKE SHARED SCRIPTS
 * Custom cursor · Page transitions · Scroll reveal · Doodle animations · Nav
 */

/* ── CONFIG & DATA ─────────────────────────────── */
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
  { id:'1151640', name:'Horizon Zero Dawn',     short:'HORIZON',      cat:'aaa',      tag:'AAA · Adventure' },
  { id:'1158310', name:'Crusader Kings III',    short:'CK III',       cat:'indie',    tag:'Strategy · RPG' },
  { id:'1446780', name:'Monster Hunter Rise',   short:'MH RISE',      cat:'aaa',      tag:'AAA · Action' },
  { id:'1466860', name:'Age of Empires IV',     short:'AOE IV',       cat:'aaa',      tag:'Strategy' },
  { id:'1496790', name:'Gotham Knights',        short:'GOTHAM',       cat:'aaa',      tag:'AAA · Action' },
  { id:'1551360', name:'Forza Horizon 5',       short:'FORZA 5',      cat:'aaa',      tag:'AAA · Racing' },
  { id:'1593500', name:'God of War',            short:'GOD OF WAR',   cat:'aaa',      tag:'AAA · Action' },
  { id:'1659420', name:'Uncharted: Legacy',     short:'UNCHARTED',    cat:'aaa',      tag:'AAA · Adventure' },
  { id:'1677740', name:'Starfield',             short:'STARFIELD',    cat:'aaa',      tag:'AAA · RPG' },
  { id:'1794680', name:'Vampire Survivors',     short:'VAMPIRE',      cat:'indie',    tag:'Indie · Action' },
  { id:'1938090', name:'Call of Duty',          short:'COD',          cat:'aaa',      tag:'AAA · FPS' },
  { id:'2050650', name:'Resident Evil 4',       short:'RE 4',         cat:'aaa',      tag:'AAA · Horror' },
  { id:'2124490', name:'Street Fighter 6',      short:'SF 6',         cat:'aaa',      tag:'AAA · Fighting' },
  { id:'2215430', name:'Ghost of Tsushima',     short:'TSUSHIMA',     cat:'aaa',      tag:'AAA · Action' },
  { id:'227300',  name:'Euro Truck Simulator 2',short:'ETS 2',        cat:'indie',    tag:'Simulation' },
  { id:'230410',  name:'Warframe',              short:'WARFRAME',     cat:'aaa',      tag:'AAA · Action' },
  { id:'235750',  name:'No Mans Sky',           short:'NMS',          cat:'survival', tag:'Survival · Sci-Fi' },
  { id:'236430',  name:'Dark Souls II',         short:'DS II',        cat:'aaa',      tag:'AAA · RPG' },
  { id:'238960',  name:'Path of Exile',         short:'POE',          cat:'aaa',      tag:'RPG · Action' },
  { id:'239140',  name:'Dying Light',           short:'DYING LIGHT',  cat:'survival', tag:'Survival · Action' },
  { id:'242760',  name:'The Forest',            short:'THE FOREST',   cat:'survival', tag:'Survival · Horror' },
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
  { title: 'DirectX 12 Optimization Patch', desc: 'Improves GPU utilization on NVIDIA 30/40-series and AMD RDNA2+ cards. Resolves shader compilation stuttering.', badge: 'NEW', cat: 'performance', game: 'Universal', version: 'v3.1' },
  { title: 'Elden Ring 60 FPS Unlock', desc: 'Community framerate unlocker with proper frametime management for smooth high-refresh-rate gameplay.', badge: 'HOT', cat: 'performance', game: 'Elden Ring', version: 'v2.4' },
  { title: 'Cyberpunk 2077 Memory Leak Fix', desc: 'Resolves crash-on-extended-play on Intel 12th/13th gen processors. Stable for sessions over 3 hours.', badge: '', cat: 'crash', game: 'Cyberpunk 2077', version: 'v1.8' },
  { title: 'RDR2 Vulkan Crash Fix', desc: 'Patches the Vulkan backend crash triggered on AMD GPUs when entering dense foliage areas.', badge: '', cat: 'crash', game: 'Red Dead Redemption 2', version: 'v2.0' },
  { title: "Baldur's Gate 3 Save Repair", desc: 'Fixes corrupted save files caused by the Act 2 crossfade bug. Restores progress without rollback.', badge: 'VERIFIED', cat: 'crash', game: "Baldur's Gate 3", version: 'v1.3' },
  { title: 'Universal Audio Fix', desc: 'Restores surround sound output for games using deprecated XAudio2 on Windows 11 22H2+.', badge: 'NEW', cat: 'audio', game: 'Universal', version: 'v4.0' },
  { title: 'Rust Anti-Stutter Patch', desc: 'Eliminates micro-stuttering in Rust by optimizing garbage collection and asset streaming pipeline.', badge: 'HOT', cat: 'performance', game: 'Rust', version: 'v1.6' },
  { title: 'HELLDIVERS 2 Crash-on-Join Fix', desc: 'Resolves the frequent crash when joining multiplayer sessions via quickplay. Patches network handshake timeout.', badge: 'NEW', cat: 'crash', game: 'HELLDIVERS 2', version: 'v1.1' },
  { title: 'Valheim Audio Desync Fix', desc: 'Fixes positional audio desyncing after extended play sessions and resolves echo in underground biomes.', badge: '', cat: 'audio', game: 'Valheim', version: 'v2.2' },
];

const steamCache = {};

/* ── API FUNCTIONS ─────────────────────────────── */
async function fetchSteamDetails(appId) {
  if (steamCache[appId]) return steamCache[appId];
  try {
    const r = await fetch(`https://store.steampowered.com/api/appdetails?appids=${appId}`);
    const j = await r.json();
    if (j[appId] && j[appId].success) { steamCache[appId] = j[appId].data; return j[appId].data; }
  } catch(e) {}
  return null;
}

async function fetchGameGenLink(appId) {
  try {
    const r = await fetch(`${STEAMTOOLS_CONFIG.GAMEGEN_BASE}/generate/${appId}`);
    const j = await r.json();
    if (j.success && j.manifest) return j.manifest.downloadUrl;
  } catch(e) {}
  try {
    const r = await fetch(`https://api.github.com/repos/${STEAMTOOLS_CONFIG.GITHUB_REPO}/contents/${appId}.lua`);
    if (r.ok) { const j = await r.json(); return j.download_url; }
  } catch(e) {}
  return null;
}

/* ── MODAL SYSTEM ──────────────────────────────── */
async function openGameModal(appId) {
  const game = CATALOG.find(g => g.id === appId);
  if (!game) return;
  document.querySelector('.game-modal-overlay')?.remove();
  const overlay = document.createElement('div');
  overlay.className = 'game-modal-overlay';
  overlay.innerHTML = `<div class="game-modal">
    <button class="modal-close" onclick="this.closest('.game-modal-overlay').remove()">✕</button>
    <div class="modal-hero">
      <img src="${STEAMTOOLS_CONFIG.STEAM_IMG}/${appId}/header.jpg" alt="${game.name}" onerror="this.src='${STEAMTOOLS_CONFIG.STEAM_IMG}/${appId}/library_600x900_2x.jpg'">
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
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
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
    overlay.querySelector('.modal-desc').innerHTML = `<p>${details.short_description || 'No description available.'}</p>`;
    const screensEl = document.getElementById(`screens-${appId}`);
    if (details.screenshots?.length > 0) {
      screensEl.innerHTML = details.screenshots.slice(0, 6).map(s => `<img src="${s.path_thumbnail}" alt="Screenshot" class="screen-thumb" onclick="this.classList.toggle('expanded')">`).join('');
    } else { screensEl.innerHTML = '<p>No screenshots available</p>'; }
    document.getElementById(`meta-${appId}`).innerHTML = `
      <div class="meta-row"><span>Developer</span><span>${(details.developers || ['N/A']).join(', ')}</span></div>
      <div class="meta-row"><span>Publisher</span><span>${(details.publishers || ['N/A']).join(', ')}</span></div>
      <div class="meta-row"><span>Genre</span><span>${(details.genres || []).map(g => g.description).join(', ') || 'N/A'}</span></div>
      <div class="meta-row"><span>Release</span><span>${details.release_date?.date || 'N/A'}</span></div>`;
  }
  const dlBtn = document.getElementById(`dl-btn-${appId}`);
  const dlUrl = await fetchGameGenLink(appId);
  if (dlUrl) {
    dlBtn.disabled = false;
    dlBtn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg> Get Game`;
    dlBtn.onclick = () => window.open(dlUrl, '_blank');
  } else { dlBtn.innerHTML = '⚠ Unavailable'; }
}

/* ── CUSTOM CURSOR ─────────────────────────────── */
function initCursor() {
  const dot = document.querySelector('.cursor-dot');
  const ring = document.querySelector('.cursor-ring');
  if (!dot || !ring) return;

  let mx = -100, my = -100, rx = -100, ry = -100;
  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

  function animateCursor() {
    dot.style.transform = `translate(${mx - 4}px, ${my - 4}px)`;
    rx += (mx - rx) * 0.15;
    ry += (my - ry) * 0.15;
    ring.style.transform = `translate(${rx - 18}px, ${ry - 18}px)`;
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  document.addEventListener('mouseover', e => {
    if (e.target.closest('a, button, .game-card, .filter-btn, .slider-dot, .doodle-card, .feature-card')) {
      ring.classList.add('expanded');
    }
  });
  document.addEventListener('mouseout', e => {
    if (e.target.closest('a, button, .game-card, .filter-btn, .slider-dot, .doodle-card, .feature-card')) {
      ring.classList.remove('expanded');
    }
  });
}

/* ── PAGE TRANSITIONS ──────────────────────────── */
function initPageTransitions() {
  document.querySelectorAll('a[href]').forEach(link => {
    const href = link.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto') || link.target === '_blank') return;
    link.addEventListener('click', e => {
      e.preventDefault();
      const overlay = document.querySelector('.page-transition-overlay');
      if (overlay) {
        overlay.classList.add('pt-exit');
        setTimeout(() => { window.location.href = href; }, 480);
      } else {
        window.location.href = href;
      }
    });
  });
}

/* ── SCROLL REVEAL ─────────────────────────────── */
function initReveal() {
  const els = document.querySelectorAll('.reveal');
  const ro = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); ro.unobserve(e.target); } });
  }, { threshold: 0, rootMargin: '0px 0px -10% 0px' });
  els.forEach(el => ro.observe(el));
}

/* ── NAV SCROLL ────────────────────────────────── */
function initNav() {
  window.addEventListener('scroll', () => {
    const nav = document.querySelector('nav');
    if (nav) nav.classList.toggle('scrolled', window.scrollY > 40);
  });
}

/* ── SMOOTH SCROLL ─────────────────────────────── */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const href = a.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth' }); }
    });
  });
}

/* ── DOODLE CANVAS ANIMATIONS ──────────────────── */
function initDoodleCanvas() {
  const canvas = document.getElementById('doodle-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize() { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; }
  resize();
  window.addEventListener('resize', resize);

  const lines = Array.from({length: 12}, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    vx: (Math.random() - 0.5) * 0.8,
    vy: (Math.random() - 0.5) * 0.8,
    len: 40 + Math.random() * 100,
    angle: Math.random() * Math.PI * 2,
    angleV: (Math.random() - 0.5) * 0.015,
    color: Math.random() > 0.5 ? '#ff6a00' : '#ff3d6e'
  }));

  const circles = Array.from({length: 8}, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: 20 + Math.random() * 60,
    vx: (Math.random() - 0.5) * 0.5,
    vy: (Math.random() - 0.5) * 0.5,
    phase: Math.random() * Math.PI * 2
  }));

  let t = 0;
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    t += 0.01;

    // Draw wandering lines
    lines.forEach(l => {
      l.x += l.vx; l.y += l.vy; l.angle += l.angleV;
      if (l.x < 0 || l.x > canvas.width) l.vx *= -1;
      if (l.y < 0 || l.y > canvas.height) l.vy *= -1;
      ctx.save();
      ctx.translate(l.x, l.y);
      ctx.rotate(l.angle);
      ctx.strokeStyle = l.color;
      ctx.lineWidth = 1.5;
      ctx.globalAlpha = 0.5 + 0.3 * Math.sin(t + l.phase || 0);
      ctx.beginPath();
      ctx.moveTo(-l.len/2, 0);
      ctx.lineTo(l.len/2, 0);
      ctx.stroke();
      ctx.restore();
    });

    // Draw wandering circles
    circles.forEach((c, i) => {
      c.phase = c.phase || (i * 0.8);
      c.x += c.vx; c.y += c.vy;
      if (c.x < -c.r || c.x > canvas.width + c.r) c.vx *= -1;
      if (c.y < -c.r || c.y > canvas.height + c.r) c.vy *= -1;
      ctx.save();
      ctx.strokeStyle = i % 2 === 0 ? '#ff6a00' : '#00f0ff';
      ctx.lineWidth = 1;
      ctx.globalAlpha = 0.3 + 0.2 * Math.sin(t * 0.7 + c.phase);
      ctx.beginPath();
      ctx.arc(c.x, c.y, c.r * (0.85 + 0.15 * Math.sin(t + c.phase)), 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    });

    // Draw cross/plus doodles
    for (let i = 0; i < 5; i++) {
      const x = (canvas.width * (i + 0.5)) / 5 + 30 * Math.sin(t * 0.4 + i);
      const y = canvas.height * 0.5 + 40 * Math.cos(t * 0.3 + i * 1.2);
      ctx.save();
      ctx.strokeStyle = '#ff6a00';
      ctx.lineWidth = 1.5;
      ctx.globalAlpha = 0.25;
      ctx.translate(x, y);
      ctx.rotate(t * 0.2 + i);
      ctx.beginPath(); ctx.moveTo(-8, 0); ctx.lineTo(8, 0);
      ctx.moveTo(0, -8); ctx.lineTo(0, 8);
      ctx.stroke();
      ctx.restore();
    }

    requestAnimationFrame(draw);
  }
  draw();
}

/* ── DOODLE PREVIEW CANVASES ───────────────────── */
function initDoodlePreviews() {
  // Doodle 1 — Flux Capacitor (energy orb)
  const d1 = document.querySelector('#doodle-1 canvas') || createDoodleCanvas('#doodle-1');
  if (d1) {
    const ctx = d1.getContext('2d');
    let t = 0;
    function drawD1() {
      d1.width = d1.offsetWidth || 240; d1.height = d1.offsetHeight || 180;
      ctx.clearRect(0, 0, d1.width, d1.height);
      const cx = d1.width/2, cy = d1.height/2;
      for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2 + t;
        const r = 30 + 15 * Math.sin(t * 2 + i);
        ctx.beginPath();
        ctx.arc(cx + r * Math.cos(angle), cy + r * Math.sin(angle), 3, 0, Math.PI * 2);
        ctx.fillStyle = `hsl(${20 + i * 15}, 100%, 60%)`;
        ctx.globalAlpha = 0.8;
        ctx.fill();
      }
      // Core glow
      const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, 40);
      g.addColorStop(0, 'rgba(255,106,0,0.6)');
      g.addColorStop(1, 'rgba(255,106,0,0)');
      ctx.beginPath(); ctx.arc(cx, cy, 40, 0, Math.PI * 2);
      ctx.fillStyle = g; ctx.globalAlpha = 0.5 + 0.3 * Math.sin(t); ctx.fill();
      t += 0.04;
      requestAnimationFrame(drawD1);
    }
    drawD1();
  }

  // Doodle 2 — Neon Pulse
  const d2 = document.querySelector('#doodle-2 canvas') || createDoodleCanvas('#doodle-2');
  if (d2) {
    const ctx2 = d2.getContext('2d');
    let t2 = 0;
    function drawD2() {
      d2.width = d2.offsetWidth || 240; d2.height = d2.offsetHeight || 180;
      ctx2.clearRect(0, 0, d2.width, d2.height);
      for (let i = 0; i < 5; i++) {
        const y = d2.height/2 + (i - 2) * 20;
        const phase = t2 + i * 0.6;
        ctx2.beginPath();
        ctx2.moveTo(0, y);
        for (let x = 0; x <= d2.width; x += 4) {
          const sy = y + Math.sin(x * 0.04 + phase) * 14 * Math.abs(Math.sin(t2 * 0.5 + i * 0.5));
          ctx2.lineTo(x, sy);
        }
        ctx2.strokeStyle = `hsl(${350 + i * 15}, 100%, 65%)`;
        ctx2.lineWidth = 1.5;
        ctx2.globalAlpha = 0.6 - i * 0.08;
        ctx2.stroke();
      }
      t2 += 0.04;
      requestAnimationFrame(drawD2);
    }
    drawD2();
  }

  // Doodle 3 — Void Swirl
  const d3 = document.querySelector('#doodle-3 canvas') || createDoodleCanvas('#doodle-3');
  if (d3) {
    const ctx3 = d3.getContext('2d');
    let t3 = 0;
    function drawD3() {
      d3.width = d3.offsetWidth || 240; d3.height = d3.offsetHeight || 180;
      ctx3.clearRect(0, 0, d3.width, d3.height);
      const cx = d3.width/2, cy = d3.height/2;
      for (let s = 0; s < 3; s++) {
        ctx3.beginPath();
        for (let i = 0; i < 200; i++) {
          const angle = (i / 30) * Math.PI * 2 + t3 + s * 2.1;
          const r = 8 + i * 0.32;
          const x = cx + r * Math.cos(angle);
          const y = cy + r * Math.sin(angle);
          if (i === 0) ctx3.moveTo(x, y); else ctx3.lineTo(x, y);
        }
        ctx3.strokeStyle = s === 0 ? '#ff6a00' : s === 1 ? '#ff3d6e' : '#00f0ff';
        ctx3.lineWidth = 1.2;
        ctx3.globalAlpha = 0.55;
        ctx3.stroke();
      }
      t3 += 0.015;
      requestAnimationFrame(drawD3);
    }
    drawD3();
  }
}

function createDoodleCanvas(selector) {
  const el = document.querySelector(selector);
  if (!el) return null;
  const c = document.createElement('canvas');
  c.style.position = 'absolute'; c.style.inset = '0';
  c.style.width = '100%'; c.style.height = '100%';
  el.appendChild(c);
  return c;
}

/* ── LOADING SCREEN ────────────────────────────── */
function initLoader() {
  const loader = document.createElement('div');
  loader.id = 'st-loader';
  loader.innerHTML = `
    <div class="loader-logo-wrap">
      <div class="loader-icon">ST</div>
      <span class="loader-title">STEAM<span>TOOLS</span></span>
    </div>
    <div class="loader-bar"><div class="loader-fill"></div></div>
    <span class="loader-tag">Accessing the vault...</span>`;
  document.body.appendChild(loader);
  setTimeout(() => { loader.classList.add('fade-out'); setTimeout(() => loader.remove(), 700); }, 1400);
}

/* ── BG VIDEO INIT ─────────────────────────────── */
function initBgVideo() {
  // Make sure bg-overlay exists
  if (!document.querySelector('.bg-overlay')) {
    const overlay = document.createElement('div');
    overlay.className = 'bg-overlay';
    document.body.insertBefore(overlay, document.body.firstChild);
  }
}

/* ── SEARCH ICON INJECT ────────────────────────── */
function enhanceSearchBars() {
  const searches = document.querySelectorAll('#store-search, #fix-search, .premium-search');
  searches.forEach(input => {
    const parent = input.parentElement;
    if (parent && !parent.querySelector('.search-icon-left')) {
      parent.style.position = 'relative';
      const icon = document.createElement('span');
      icon.className = 'search-icon-left';
      icon.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>`;
      parent.insertBefore(icon, input);
    }
  });
}

/* ── INITIALIZATION ────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initLoader();
  initBgVideo();
  initCursor();
  initPageTransitions();
  initReveal();
  initNav();
  initSmoothScroll();
  enhanceSearchBars();

  // Init doodle stuff if on homepage
  if (document.getElementById('doodle-canvas')) {
    initDoodleCanvas();
  }
  if (document.querySelector('.doodle-preview')) {
    setTimeout(initDoodlePreviews, 100);
  }
});

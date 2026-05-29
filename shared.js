/* STRAW HAT — SHARED SCRIPTS v6 (Optimized & OAuth2 Integrated) */

const STEAMTOOLS_CONFIG = {
  GAMEGEN_KEY:  'mg_89fab80a0e6c4949b0c169de799f4499',
  GAMEGEN_BASE: 'https://gamegen.lol/api/mg_89fab80a0e6c4949b0c169de799f4499',
  STEAM_IMG:    'https://cdn.cloudflare.steamstatic.com/steam/apps',
  GITHUB_REPO:  'steamtoolsbot-dhyey/filebase', // 👈 Pointed to your active Vault
  DISCORD_ID:   '1263113862754545795'
};

// ==========================================
// 🛡️ DISCORD SESSION MANAGEMENT
// ==========================================
function handleDiscordSession() {
  if(window.location.hash.startsWith('#session=')) {
    try {
      const payload = decodeURIComponent(window.location.hash.replace('#session=', ''));
      const userData = JSON.parse(payload);
      localStorage.setItem('strawhat_session', JSON.stringify(userData));
      window.location.hash = ''; // Clean the URL securely
    } catch(e) { console.error("Session parse error"); }
  }
}
handleDiscordSession(); 

function getSession() {
  try { return JSON.parse(localStorage.getItem('strawhat_session')); }
  catch { return null; }
}

function logoutSession() {
  localStorage.removeItem('strawhat_session');
  window.location.reload();
}

// ==========================================
// 🎮 CORE CATALOG & DATA
// ==========================================
const CATALOG = [
  {id:'271590', name:'Grand Theft Auto V',       short:'GTA V',        cat:'aaa',      tag:'AAA · Action'},
  {id:'1174180',name:'Red Dead Redemption 2',    short:'RDR 2',        cat:'aaa',      tag:'AAA · Adventure'},
  {id:'1245620',name:'Elden Ring',               short:'ELDEN RING',   cat:'aaa',      tag:'AAA · RPG'},
  {id:'1091500',name:'Cyberpunk 2077',           short:'CYBERPUNK',    cat:'aaa',      tag:'AAA · Sci-Fi'},
  {id:'252490', name:'Rust',                     short:'RUST',         cat:'multi',    tag:'Multiplayer · Survival'},
  {id:'346110', name:'ARK: Survival Evolved',    short:'ARK',          cat:'multi',    tag:'Multiplayer · Survival'},
  {id:'242760', name:'Dead by Daylight',         short:'DBD',          cat:'multi',    tag:'Multiplayer · Horror'},
  {id:'4000',   name:'Garry\\'s Mod',            short:'GMOD',         cat:'indie',    tag:'Sandbox · Classic'},
  {id:'1222670',name:'The Sims™ 4',              short:'SIMS 4',       cat:'indie',    tag:'Simulation'},
  {id:'359550', name:'Tom Clancy\\'s Rainbow Six Siege', short:'R6 SIEGE', cat:'multi',  tag:'Multiplayer · Tactical'},
  {id:'105600', name:'Terraria',                 short:'TERRARIA',     cat:'indie',    tag:'Indie · Adventure'},
  {id:'739630', name:'Phasmophobia',             short:'PHASMO',       cat:'multi',    tag:'Multiplayer · Horror'},
  {id:'413150', name:'Stardew Valley',           short:'STARDEW',      cat:'indie',    tag:'Indie · Farming'}
];

let DYNAMIC_CATALOG = [];
let CATALOG_LOADED = false;

const drops = [
  { id: '2215430', name: 'Ghost of Tsushima' },
  { id: '1245620', name: 'Elden Ring: Shadow of the Erdtree' },
  { id: '1174180', name: 'Red Dead Redemption 2' },
  { id: '252490',  name: 'Rust (Latest Patch)' },
  { id: '553850',  name: 'Helldivers 2' },
  { id: '1086940', name: 'Baldur\\'s Gate 3' }
];

const fixes = [
  { title:'Ghost of Tsushima FPS Unlocker', desc:'Removes 60fps cap on cutscenes and gameplay.', game:'Ghost of Tsushima', version:'v1.0.4' },
  { title:'Elden Ring Ultrawide Fix', desc:'Forces 21:9 aspect ratio support without black bars.', game:'Elden Ring', version:'v1.10' },
  { title:'Cyberpunk 2077 Engine Tweak', desc:'Optimizes memory pool allocation for lower-end GPUs.', game:'Cyberpunk 2077', version:'v2.12' },
  { title:'Helldivers 2 Matchmaking Patch', desc:'Bypasses region lock for faster queue times.', game:'Helldivers 2', version:'v0.9.1' },
  { title:'RDR 2 Crash Resolver', desc:'Fixes the "ERR_GFX_STATE" crash on Vulkan API.', game:'Red Dead II', version:'v1.4' }
];

// ==========================================
// ⚡ OPTIMIZED DATA DISCOVERY (LAG FIX)
// ==========================================
async function loadFullCatalog() {
  if (CATALOG_LOADED) return;
  try {
    const res = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent('https://api.github.com/repos/' + STEAMTOOLS_CONFIG.GITHUB_REPO + '/contents')}`);
    if (!res.ok) throw new Error('Repo fetch failed');
    const data = await res.json();
    const files = JSON.parse(data.contents);
    
    DYNAMIC_CATALOG = [];
    
    // Chunking processing to prevent UI freezing (Lag Fix)
    const chunkSize = 100; 
    for (let i = 0; i < files.length; i += chunkSize) {
      const chunk = files.slice(i, i + chunkSize);
      chunk.forEach(f => {
        if (f.name.endsWith('.lua') && !f.name.includes('_fix')) {
          const id = f.name.replace('.lua', '');
          if (!CATALOG.find(c => c.id === id) && !DYNAMIC_CATALOG.find(c => c.id === id)) {
            DYNAMIC_CATALOG.push({
              id, name: `App ID: ${id}`, short: id, cat: 'indie', tag: 'Discovered', source: 'github'
            });
          }
        }
      });
      await new Promise(resolve => requestAnimationFrame(resolve)); // Yield to main thread
    }
    
    CATALOG_LOADED = true;
    console.log(`✅ Vault Synced smoothly. Total items: ${DYNAMIC_CATALOG.length}`);
  } catch (err) {
    console.error('Discovery error:', err);
  }
}

// ==========================================
// 💽 STORAGE UTILS
// ==========================================
const KEYS = { history: 'st_history', applied: 'st_applied' };
function save(k, v) { localStorage.setItem(k, JSON.stringify(v)); }
function get(k) { try { return JSON.parse(localStorage.getItem(k)); } catch{return null;} }

// ==========================================
// 🎨 UI & ANIMATIONS
// ==========================================
function initLoader() {
  const overlay = document.querySelector('.page-transition-overlay');
  if (overlay) setTimeout(() => { overlay.style.opacity = '0'; setTimeout(() => overlay.style.display = 'none', 600); }, 150);
}

function initPageTransitions() {
  document.querySelectorAll('a').forEach(a => {
    if(a.hostname === window.location.hostname && !a.hash && a.target !== '_blank') {
      a.addEventListener('click', e => {
        e.preventDefault();
        const url = a.href;
        const overlay = document.querySelector('.page-transition-overlay');
        if(overlay) {
          overlay.style.display = 'block';
          requestAnimationFrame(() => {
            overlay.style.opacity = '1';
            setTimeout(() => { window.location.href = url; }, 500);
          });
        } else window.location.href = url;
      });
    }
  });
}

function initReveal() {
  const els = document.querySelectorAll('.reveal');
  const obs = new IntersectionObserver((ents) => {
    ents.forEach(e => { if(e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }});
  }, { threshold: 0.1 });
  els.forEach(el => obs.observe(el));
}

function initNav() {
  const nav = document.querySelector('.nav-main');
  if(!nav) return;
  window.addEventListener('scroll', () => {
    if(window.scrollY > 50) { nav.style.background = 'rgba(3, 5, 8, 0.85)'; nav.style.borderBottom = '1px solid rgba(255,255,255,0.05)'; nav.style.padding = '15px 0'; }
    else { nav.style.background = 'transparent'; nav.style.borderBottom = '1px solid transparent'; nav.style.padding = '25px 0'; }
  });
}

function initDoodleCanvas() {
  const section = document.getElementById('doodle-showcase');
  const doodleWrap = document.getElementById('doodle-wrap');
  if (!section || !doodleWrap) return;
  const shapes = [
    '<circle cx="12" cy="12" r="10" stroke="#fff" stroke-width="2" stroke-dasharray="4 4"/>',
    '<rect x="4" y="4" width="16" height="16" stroke="#fff" stroke-width="2" transform="rotate(45 12 12)"/>',
    '<path d="M12 2 L22 20 L2 20 Z" stroke="#fff" stroke-width="2" stroke-linejoin="round"/>',
    '<path d="M4 12 Q12 2 20 12 T4 12" stroke="#fff" stroke-width="2" fill="none"/>',
    '<line x1="2" y1="2" x2="22" y2="22" stroke="#fff" stroke-width="2"/><line x1="22" y1="2" x2="2" y2="22" stroke="#fff" stroke-width="2"/>'
  ];
  const count = 18;
  const empEls = Array.from({length: count}).map((_, i) => {
    const div = document.createElement('div');
    div.className = 'emp-doodle';
    const startAngle = (i / count) * Math.PI * 2;
    const shape = shapes[Math.floor(Math.random() * shapes.length)];
    const w = 24 + Math.random()*24, h = w;
    const speed = (Math.random()-.5)*.008;
    div.innerHTML = `<svg width="${w}" height="${h}" viewBox="0 0 24 24" fill="none">${shape}</svg>`;
    const spreadX = section.offsetWidth*.38, spreadY = section.offsetHeight*.38;
    div._orbitRx = spreadX*(.7+Math.random()*.6); div._orbitRy = spreadY*(.5+Math.random()*.5);
    div._angle = startAngle; div._speed = speed;
    div._selfRot = 0; div._selfRotSpeed = (Math.random()-.5)*.015;
    doodleWrap.appendChild(div); return div;
  });
  function animateDoodles() {
    const sw=section.offsetWidth/2, sh=section.offsetHeight/2;
    empEls.forEach(el => {
      el._angle+=el._speed; el._selfRot+=el._selfRotSpeed;
      el.style.transform=`translate(${sw+Math.cos(el._angle)*el._orbitRx-24}px,${sh+Math.sin(el._angle)*el._orbitRy-24}px) rotate(${el._selfRot}rad)`;
    });
    requestAnimationFrame(animateDoodles);
  }
  animateDoodles();
}

// ==========================================
// 🛠️ MODAL & DATA FETCHING
// ==========================================
async function fetchSteamData(appId) {
  try {
    const res = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(`https://store.steampowered.com/api/appdetails?appids=${appId}&l=english`)}`);
    const data = await res.json();
    const parsed = JSON.parse(data.contents);
    if(parsed[appId] && parsed[appId].success) return parsed[appId].data;
    return null;
  } catch(e) { return null; }
}

async function openGameModal(appId) {
  const g = CATALOG.find(x => x.id === appId) || DYNAMIC_CATALOG.find(x => x.id === appId) || {id:appId, name:`App ${appId}`};
  
  // Track download history
  const session = getSession();
  let hist = get(KEYS.history) || [];
  if (session && !hist.find(h => h.id === appId)) {
    hist.unshift({ id: appId, name: g.name, date: Date.now() });
    save(KEYS.history, hist);
  }

  // Redirect to details view
  let detailsUrl = `details.html?id=${appId}`;
  const isIndex = window.location.pathname.endsWith('index.html') || window.location.pathname === '/';
  if (isIndex) detailsUrl = `pages/details.html?id=${appId}`;
  
  const overlay = document.querySelector('.page-transition-overlay');
  if(overlay) {
    overlay.style.display = 'block';
    requestAnimationFrame(() => {
      overlay.style.opacity = '1';
      setTimeout(() => { window.location.href = detailsUrl; }, 400);
    });
  } else window.location.href = detailsUrl;
}

function closeModal() {
  const modal = document.getElementById('game-modal');
  if (modal) {
    modal.classList.remove('active');
    setTimeout(() => { modal.style.display = 'none'; }, 400);
  }
}

// ── INIT ──────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initLoader();
  initPageTransitions();
  initReveal();
  initNav();
  if (document.getElementById('doodle-canvas-area')) initDoodleCanvas();
});
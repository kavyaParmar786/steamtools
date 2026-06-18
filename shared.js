/* STRAW HAT — SHARED SCRIPTS v6 */

const STEAMTOOLS_CONFIG = {
  STEAM_IMG:   'https://cdn.cloudflare.steamstatic.com/steam/apps',
  GITHUB_REPO: 'steamtoolsbot-dhyey/filebase',
  GITHUB_PAT:  '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',
  DISCORD_ID:  '1263113862754545795',
  // Discord OAuth — fill in your own app's client_id from discord.com/developers
  DISCORD_CLIENT_ID: '1263113862754545795',
  DISCORD_REDIRECT:  window.location.origin + '/pages/profile.html'
};

/* ── DISCORD AUTH ───────────────────────────────── */
const DiscordAuth = {
  STORAGE_KEY: 'sh_discord_user',
  TOKEN_KEY:   'sh_discord_token',

  getUser() {
    try { return JSON.parse(localStorage.getItem(this.STORAGE_KEY)); } catch { return null; }
  },
  getToken() { return localStorage.getItem(this.TOKEN_KEY); },

  isAuthed() { return !!this.getUser(); },

  save(user, token) {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(user));
    if (token) localStorage.setItem(this.TOKEN_KEY, token);
  },

  logout() {
    localStorage.removeItem(this.STORAGE_KEY);
    localStorage.removeItem(this.TOKEN_KEY);
  },

  /* Build OAuth URL — uses token exchange via allorigins */
  getOAuthURL() {
    const params = new URLSearchParams({
      client_id:     STEAMTOOLS_CONFIG.DISCORD_CLIENT_ID,
      redirect_uri:  STEAMTOOLS_CONFIG.DISCORD_REDIRECT,
      response_type: 'token',
      scope:         'identify'
    });
    return `https://discord.com/oauth2/authorize?${params}`;
  },

  /* Call after redirect — parses hash fragment */
  async handleCallback() {
    const hash = window.location.hash.slice(1);
    const params = new URLSearchParams(hash);
    const token  = params.get('access_token');
    if (!token) return null;

    // Clear hash from URL
    history.replaceState(null, '', window.location.pathname);

    try {
      const r = await fetch('https://discord.com/api/users/@me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!r.ok) return null;
      const user = await r.json();
      this.save(user, token);
      return user;
    } catch { return null; }
  }
};

/* ── GATE: redirect to auth if not logged in ─────
   Call initAuthGate() on every protected page       */
function initAuthGate() {
  // Handle OAuth callback first
  if (window.location.hash.includes('access_token')) {
    DiscordAuth.handleCallback().then(user => {
      if (user) window.location.reload();
    });
    return;
  }

  if (!DiscordAuth.isAuthed()) {
    // Show a full-screen auth overlay instead of hard redirect
    showDiscordAuthScreen();
  } else {
    // Inject avatar into nav
    injectNavUser();
  }
}

function showDiscordAuthScreen() {
  // Remove existing
  document.getElementById('sh-auth-overlay')?.remove();

  const el = document.createElement('div');
  el.id = 'sh-auth-overlay';
  el.style.cssText = `
    position:fixed;inset:0;z-index:99999;
    background:#030508;
    display:flex;align-items:center;justify-content:center;
    flex-direction:column;gap:32px;
  `;
  el.innerHTML = `
    <div style="text-align:center;max-width:420px;padding:0 24px">
      <div style="font-family:var(--font-display);font-size:52px;letter-spacing:4px;color:#fff;margin-bottom:8px">STRAW HAT</div>
      <div style="font-family:var(--font-mono);font-size:10px;letter-spacing:3px;color:rgba(255,255,255,0.3);text-transform:uppercase;margin-bottom:40px">ACCESS RESTRICTED — AUTHENTICATE TO ENTER</div>
      <div style="width:80px;height:1px;background:linear-gradient(90deg,transparent,rgba(255,106,0,0.6),transparent);margin:0 auto 40px"></div>
      <p style="font-family:var(--font-ui);font-size:15px;color:rgba(255,255,255,0.55);margin-bottom:36px;line-height:1.7">
        Vault access requires a Discord account.<br>Sign in once — your session is remembered.
      </p>
      <button id="discord-auth-btn" onclick="window.location.href=DiscordAuth.getOAuthURL()" style="
        display:inline-flex;align-items:center;gap:14px;
        padding:16px 36px;border-radius:12px;border:none;
        background:linear-gradient(135deg,#5865f2,#7289da);
        color:#fff;font-family:var(--font-ui);font-size:14px;font-weight:700;
        letter-spacing:1.5px;text-transform:uppercase;cursor:pointer;
        box-shadow:0 8px 32px rgba(88,101,242,0.4);
        transition:all 0.25s;
      " onmouseover="this.style.transform='translateY(-2px)';this.style.boxShadow='0 14px 40px rgba(88,101,242,0.55)'"
         onmouseout="this.style.transform='';this.style.boxShadow='0 8px 32px rgba(88,101,242,0.4)'">
        <svg width="22" height="16" viewBox="0 0 22 16" fill="white" xmlns="http://www.w3.org/2000/svg">
          <path d="M18.59 1.34A18.18 18.18 0 0 0 14.07 0c-.19.35-.41.82-.56 1.19a16.8 16.8 0 0 0-5.02 0C8.34.82 8.11.35 7.92 0A18.14 18.14 0 0 0 3.4 1.35 19.2 19.2 0 0 0 .06 14.02 18.28 18.28 0 0 0 5.62 16c.44-.6.84-1.24 1.18-1.91a11.91 11.91 0 0 1-1.87-.9c.16-.11.31-.23.45-.35a13.02 13.02 0 0 0 11.23 0c.15.12.3.24.46.35-.6.35-1.23.65-1.88.91.34.67.73 1.31 1.18 1.9a18.24 18.24 0 0 0 5.57-1.98A19.18 19.18 0 0 0 18.59 1.34ZM7.35 11.5c-1.08 0-1.97-.99-1.97-2.22s.87-2.23 1.97-2.23 1.99.99 1.97 2.23c0 1.23-.88 2.22-1.97 2.22Zm7.3 0c-1.08 0-1.97-.99-1.97-2.22s.87-2.23 1.97-2.23 1.99.99 1.97 2.23c0 1.23-.87 2.22-1.97 2.22Z"/>
        </svg>
        Continue with Discord
      </button>
      <p style="font-family:var(--font-mono);font-size:9px;letter-spacing:2px;color:rgba(255,255,255,0.2);margin-top:24px;text-transform:uppercase">
        We only read your username & avatar. Nothing else.
      </p>
    </div>
  `;
  document.body.appendChild(el);
}

function injectNavUser() {
  const user = DiscordAuth.getUser();
  if (!user) return;
  const avatarUrl = user.avatar
    ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=64`
    : `https://cdn.discordapp.com/embed/avatars/${parseInt(user.discriminator || '0') % 5}.png`;

  // Find the nav area where user info goes
  const navEl = document.querySelector('nav') || document.querySelector('.di-wrapper nav');
  if (!navEl) return;

  // Remove old user pill if present
  navEl.querySelector('.nav-user-pill')?.remove();

  const pill = document.createElement('div');
  pill.className = 'nav-user-pill';
  pill.style.cssText = `
    display:flex;align-items:center;gap:8px;
    padding:5px 12px 5px 6px;
    background:rgba(255,255,255,0.06);
    border:1px solid rgba(255,255,255,0.1);
    border-radius:100px;cursor:pointer;
    font-family:var(--font-mono);font-size:10px;
    color:rgba(255,255,255,0.7);letter-spacing:1px;
    transition:all 0.2s;
  `;
  pill.innerHTML = `
    <img src="${avatarUrl}" style="width:22px;height:22px;border-radius:50%;object-fit:cover" onerror="this.src='https://cdn.discordapp.com/embed/avatars/0.png'">
    ${user.username || user.global_name || 'VAULT MEMBER'}
  `;
  pill.addEventListener('click', () => {
    window.location.href = (window.location.pathname.includes('/pages/') ? '' : 'pages/') + 'profile.html';
  });
  pill.addEventListener('mouseover', () => { pill.style.background = 'rgba(255,255,255,0.1)'; });
  pill.addEventListener('mouseout',  () => { pill.style.background = 'rgba(255,255,255,0.06)'; });

  navEl.appendChild(pill);
}

/* ── STEAM APPLIST (infinite scroll source) ──────
   The /api/ISteamApps/GetAppList returns ~150k apps.
   We fetch it once and cache it, then serve pages.   */
let _steamAppList   = null;
let _appListLoading = false;
let _appListOffset  = 0;
const APP_PAGE_SIZE = 48;

async function getSteamAppList() {
  if (_steamAppList) return _steamAppList;
  if (_appListLoading) {
    // wait for existing fetch
    await new Promise(resolve => {
      const iv = setInterval(() => { if (_steamAppList) { clearInterval(iv); resolve(); }}, 50);
    });
    return _steamAppList;
  }
  _appListLoading = true;
  try {
    // allorigins proxy to avoid CORS
    const url = `https://api.allorigins.win/raw?url=${encodeURIComponent('https://api.steampowered.com/ISteamApps/GetAppList/v2/')}`;
    const r = await fetch(url, { signal: AbortSignal.timeout(15000) });
    const j = await r.json();
    // Filter to real games (appid > 0, name not empty, not DLC noise)
    _steamAppList = (j.applist?.apps || [])
      .filter(a => a.appid > 0 && a.name && a.name.trim() && !a.name.match(/^(Steamworks|SteamDB|Test|Beta |Dedicated Server|Demo |SDK |Tool |Trailer |OST |DLC )/i))
      .sort((a, b) => b.appid - a.appid); // newest first roughly
  } catch {
    // Fallback: use our curated catalog IDs
    _steamAppList = CATALOG.map(c => ({ appid: parseInt(c.id), name: c.name }));
  }
  _appListLoading = false;
  return _steamAppList;
}

/* Get next page of apps for infinite scroll */
async function getNextAppPage() {
  const list = await getSteamAppList();
  const page = list.slice(_appListOffset, _appListOffset + APP_PAGE_SIZE);
  _appListOffset += APP_PAGE_SIZE;
  return page;
}

function resetAppListOffset() { _appListOffset = 0; }

/* ── STEAM SEARCH ────────────────────────────────
   Searches the app list by name or appid.           */
async function searchSteamApps(query) {
  query = query.trim().toLowerCase();
  if (!query) return [];
  const list = await getSteamAppList();
  const isId = /^\d+$/.test(query);
  if (isId) {
    return list.filter(a => String(a.appid).startsWith(query)).slice(0, 30);
  }
  // Score by match quality
  const scored = list
    .map(a => {
      const name = a.name.toLowerCase();
      let score = 0;
      if (name === query) score = 100;
      else if (name.startsWith(query)) score = 80;
      else if (name.includes(query)) score = 50;
      return { ...a, score };
    })
    .filter(a => a.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 30);
  return scored;
}

/* ── STEAM API DETAILS ──────────────────────────── */
const _steamCache = {};
async function fetchSteamDetails(appId) {
  appId = String(appId);
  if (_steamCache[appId]) return _steamCache[appId];

  const proxies = [
    `https://api.allorigins.win/raw?url=${encodeURIComponent(`https://store.steampowered.com/api/appdetails?appids=${appId}&l=english`)}`,
    `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(`https://store.steampowered.com/api/appdetails?appids=${appId}&l=english`)}`,
    `https://thingproxy.freeboard.io/fetch/https://store.steampowered.com/api/appdetails?appids=${appId}&l=english`
  ];

  for (const url of proxies) {
    try {
      const r = await fetch(url, { signal: AbortSignal.timeout(6000) });
      if (!r.ok) continue;
      const j = await r.json();
      let data = j;
      if (j.contents) { try { data = JSON.parse(j.contents); } catch { continue; } }
      if (data[appId]?.success) {
        _steamCache[appId] = data[appId].data;
        return data[appId].data;
      }
    } catch { continue; }
  }
  return null;
}

async function fetchSteamReviews(appId) {
  try {
    const url = `https://api.allorigins.win/raw?url=${encodeURIComponent(`https://store.steampowered.com/appreviews/${appId}?json=1&num_per_page=0&language=all`)}`;
    const r = await fetch(url, { signal: AbortSignal.timeout(6000) });
    const j = await r.json();
    if (j.query_summary) return j.query_summary;
  } catch {}
  return null;
}

/* ── GITHUB LUA LOOKUP ───────────────────────────
   ONLY called when user clicks Download.
   Checks steamtoolsbot-dhyey/filebase for {appId}.lua  */
async function fetchLuaFromGitHub(appId) {
  appId = String(appId);
  try {
    const r = await fetch(
      `https://api.github.com/repos/${STEAMTOOLS_CONFIG.GITHUB_REPO}/contents/${appId}.lua`,
      {
        headers: { 'Authorization': `token ${STEAMTOOLS_CONFIG.GITHUB_PAT}` },
        signal: AbortSignal.timeout(8000)
      }
    );
    if (r.ok) {
      const j = await r.json();
      return j.download_url || null;
    }
  } catch {}
  return null;
}

/* Check (without downloading) if .lua exists — used for badge only */
const _luaExistsCache = {};
async function checkLuaExists(appId) {
  appId = String(appId);
  if (_luaExistsCache[appId] !== undefined) return _luaExistsCache[appId];
  // Return true optimistically — we always try; badge is shown on download
  _luaExistsCache[appId] = true;
  return true;
}

/* ── DOWNLOAD HANDLER ────────────────────────────
   Shows spinner → fetches .lua → triggers download  */
async function handleDownload(appId, gameName, btnEl) {
  if (btnEl) {
    btnEl.disabled = true;
    btnEl.innerHTML = `<span class="btn-spinner"></span> FETCHING...`;
  }

  const url = await fetchLuaFromGitHub(appId);

  if (url) {
    // Trigger download
    const a = document.createElement('a');
    a.href = url;
    a.download = `${appId}.lua`;
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    // Log to download history
    try {
      const history = JSON.parse(localStorage.getItem('sh_downloads') || '[]');
      const alreadyLogged = history.some(d => d.appId === appId);
      if (!alreadyLogged) {
        history.push({ appId, name: gameName || appId, date: new Date().toLocaleDateString('en-US', { year:'numeric', month:'short', day:'numeric' }) });
        localStorage.setItem('sh_downloads', JSON.stringify(history));
      }
    } catch {}

    showToast(`📁 Downloading ${gameName || appId}.lua`, 'success');

    if (btnEl) {
      btnEl.innerHTML = `✓ DOWNLOADED`;
      btnEl.style.background = 'linear-gradient(135deg,#22c55e,#16a34a)';
      setTimeout(() => {
        btnEl.disabled = false;
        btnEl.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg> DOWNLOAD`;
        btnEl.style.background = '';
      }, 3000);
    }
  } else {
    showToast(`⚠️ Manifest not in vault yet — submit a request!`, 'warn');

    if (btnEl) {
      btnEl.disabled = false;
      btnEl.innerHTML = `NOT IN VAULT`;
      btnEl.style.background = 'rgba(255,61,110,0.2)';
      btnEl.style.border = '1px solid rgba(255,61,110,0.4)';
      setTimeout(() => {
        btnEl.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg> DOWNLOAD`;
        btnEl.style.background = '';
        btnEl.style.border = '';
      }, 4000);
    }
  }
}

/* ── LIVE DISCORD MEMBER COUNT ─────────────────── */
async function fetchDiscordMembers() {
  try {
    const r = await fetch(`https://discord.com/api/invites/AaK8s6fpVa?with_counts=true`, { signal: AbortSignal.timeout(5000) });
    if (r.ok) {
      const j = await r.json();
      return j.approximate_member_count || null;
    }
  } catch {}
  return null;
}

/* ── NAV BUILDER ─────────────────────────────────
   Shared nav injected on every page.
   "drops" tab removed per request.                  */
function buildNav(activePage) {
  const isSubpage = window.location.pathname.includes('/pages/');
  const root = isSubpage ? '../' : './';
  const pages = isSubpage ? '' : 'pages/';

  const links = [
    { href: `${root}index.html`,        label: 'HOME',    key: 'home'    },
    { href: `${pages}store.html`,        label: 'VAULT',   key: 'store'   },
    { href: `${pages}fixes.html`,        label: 'FIXES',   key: 'fixes'   },
    { href: `${pages}request.html`,      label: 'REQUEST', key: 'request' },
  ];

  const user = DiscordAuth.getUser();
  const avatarUrl = user?.avatar
    ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=64`
    : null;

  const navHtml = `
    <nav>
      <a href="${root}index.html" class="nav-logo" style="display:flex;align-items:center;gap:10px;text-decoration:none;margin-right:8px">
        <img src="${root}icon.png" class="nav-logo-icon-img" alt="Straw Hat">
        <span class="nav-logo-text">STRAW HAT</span>
      </a>
      <div class="nav-links">
        ${links.map(l => `
          <a href="${l.href}" class="nav-link${activePage === l.key ? ' active' : ''}">${l.label}</a>
        `).join('')}
      </div>
      <div style="display:flex;align-items:center;gap:8px;margin-left:auto">
        <a href="https://discord.gg/AaK8s6fpVa" target="_blank" class="nav-btn-secondary" style="gap:6px;display:flex;align-items:center">
          <svg width="14" height="11" viewBox="0 0 22 16" fill="currentColor"><path d="M18.59 1.34A18.18 18.18 0 0 0 14.07 0c-.19.35-.41.82-.56 1.19a16.8 16.8 0 0 0-5.02 0C8.34.82 8.11.35 7.92 0A18.14 18.14 0 0 0 3.4 1.35 19.2 19.2 0 0 0 .06 14.02 18.28 18.28 0 0 0 5.62 16c.44-.6.84-1.24 1.18-1.91a11.91 11.91 0 0 1-1.87-.9c.16-.11.31-.23.45-.35a13.02 13.02 0 0 0 11.23 0c.15.12.3.24.46.35-.6.35-1.23.65-1.88.91.34.67.73 1.31 1.18 1.9a18.24 18.24 0 0 0 5.57-1.98A19.18 19.18 0 0 0 18.59 1.34Z"/></svg>
          DISCORD
        </a>
        ${user ? `
          <div class="nav-user-pill" onclick="window.location.href='${pages}profile.html'" style="
            display:flex;align-items:center;gap:8px;
            padding:5px 12px 5px 6px;
            background:rgba(255,255,255,0.06);
            border:1px solid rgba(255,255,255,0.1);
            border-radius:100px;cursor:pointer;
            font-family:var(--font-mono);font-size:10px;
            color:rgba(255,255,255,0.7);letter-spacing:1px;
          ">
            ${avatarUrl
              ? `<img src="${avatarUrl}" style="width:22px;height:22px;border-radius:50%;object-fit:cover">`
              : `<div style="width:22px;height:22px;border-radius:50%;background:rgba(88,101,242,0.6);display:flex;align-items:center;justify-content:center;font-size:10px">${(user.username||'?')[0].toUpperCase()}</div>`
            }
            ${(user.global_name || user.username || 'VAULT MEMBER').toUpperCase()}
          </div>
        ` : `
          <button onclick="window.location.href=DiscordAuth.getOAuthURL()" class="nav-btn-primary" style="gap:8px;display:flex;align-items:center;background:linear-gradient(135deg,#5865f2,#7289da);border:none">
            LOGIN
          </button>
        `}
      </div>
    </nav>
  `;

  const wrapper = document.querySelector('.di-wrapper');
  if (wrapper) wrapper.innerHTML = navHtml;

  // Scroll behavior
  const nav = document.querySelector('nav');
  if (nav) {
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 40);
    }, { passive: true });
  }
}

/* ── TOAST ───────────────────────────────────────── */
function showToast(msg, type = 'info') {
  document.querySelectorAll('.st-toast').forEach(t => t.remove());
  const t = document.createElement('div');
  t.className = 'st-toast';
  const color = type === 'success' ? '#22c55e' : type === 'warn' ? '#f5a623' : 'var(--accent)';
  t.innerHTML = `<span class="t-icon" style="color:${color}">●</span>${msg}`;
  document.body.appendChild(t);
  setTimeout(() => { t.classList.add('hide'); setTimeout(() => t.remove(), 400); }, 3500);
}

/* ── SCROLL REVEAL ───────────────────────────────── */
function initReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); } });
  }, { threshold: 0.08 });
  els.forEach(el => io.observe(el));
}

/* ── COUNTERS ────────────────────────────────────── */
function animateCounter(el, target, suffix = '') {
  let start = 0;
  const step = target / 60;
  const iv = setInterval(() => {
    start = Math.min(start + step, target);
    el.textContent = Math.floor(start).toLocaleString() + suffix;
    if (start >= target) clearInterval(iv);
  }, 16);
}

function initCounters() {
  document.querySelectorAll('[data-count]').forEach(el => {
    const io = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        animateCounter(el, parseInt(el.dataset.count), el.dataset.suffix || '');
        io.disconnect();
      }
    });
    io.observe(el);
  });
}

/* ── PAGE TRANSITION ─────────────────────────────── */
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

/* ── DOODLE CANVAS ───────────────────────────────── */
function initDoodleCanvas() {
  const canvas = document.getElementById('doodle-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles = [];

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  for (let i = 0; i < 40; i++) {
    particles.push({
      x: Math.random() * 1000,
      y: Math.random() * 600,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      r: Math.random() * 1.5 + 0.5,
      a: Math.random()
    });
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
      ctx.beginPath();
      ctx.arc(p.x * (W / 1000), p.y * (H / 600), p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,106,0,${p.a * 0.4})`;
      ctx.fill();
    });
    requestAnimationFrame(draw);
  }
  draw();
}

function initDoodlePreviews() { /* stub for compat */ }

/* ── INIT (called by each page's DOMContentLoaded) ── */
document.addEventListener('DOMContentLoaded', () => {
  initAuthGate();
  initReveal();
  initCounters();
  initPageTransitions();
  if (document.getElementById('doodle-canvas')) setTimeout(initDoodleCanvas, 80);
});

/* ── GAME CARD BUILDER ───────────────────────────── */
function buildGameCard(appId, name, tag, headerImg) {
  appId = String(appId);
  const img = headerImg || `https://cdn.cloudflare.steamstatic.com/steam/apps/${appId}/header.jpg`;
  return `
    <div class="game-card" data-appid="${appId}" onclick="openGameModal('${appId}','${(name||'').replace(/'/g,"\\'")}')">
      <div class="game-card-img">
        <img src="${img}" alt="${name||appId}" loading="lazy"
          onerror="this.src='https://via.placeholder.com/460x215/0b0d12/ff6a00?text=${encodeURIComponent(name||appId)}'">
        <div class="game-card-overlay">
          <button class="card-quick-dl" data-appid="${appId}" data-name="${(name||'').replace(/"/g,'&quot;')}"
            onclick="event.stopPropagation();handleDownload('${appId}','${(name||'').replace(/'/g,"\\'")}',this)"
            style="
              padding:8px 18px;border-radius:8px;border:none;
              background:linear-gradient(135deg,var(--accent),var(--accent2));
              color:#fff;font-family:var(--font-ui);font-size:11px;font-weight:700;
              letter-spacing:1.5px;text-transform:uppercase;cursor:pointer;
              display:flex;align-items:center;gap:8px;
            ">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
            DOWNLOAD
          </button>
        </div>
      </div>
      <div class="game-card-info">
        <div class="game-card-title">${name || `GAME ${appId}`}</div>
        <div class="game-card-tag">${tag || ''}</div>
      </div>
    </div>
  `;
}

/* ── CSS for spinner ─────────────────────────────── */
(function() {
  const s = document.createElement('style');
  s.textContent = `
    .btn-spinner {
      display:inline-block;width:10px;height:10px;
      border:2px solid rgba(255,255,255,0.3);
      border-top-color:#fff;border-radius:50%;
      animation:spin 0.7s linear infinite;vertical-align:middle;
    }
    @keyframes spin { to { transform:rotate(360deg); } }
  `;
  document.head.appendChild(s);
})();

/* Legacy compat */
const CATALOG = [
  {id:'271590', name:'Grand Theft Auto V',       cat:'aaa',      tag:'AAA · Action'},
  {id:'1174180',name:'Red Dead Redemption 2',    cat:'aaa',      tag:'AAA · Adventure'},
  {id:'1245620',name:'Elden Ring',               cat:'aaa',      tag:'AAA · RPG'},
  {id:'1091500',name:'Cyberpunk 2077',           cat:'aaa',      tag:'AAA · Sci-Fi'},
  {id:'252490', name:'Rust',                     cat:'survival', tag:'Survival · PVP'},
  {id:'1086940',name:"Baldur's Gate 3",          cat:'aaa',      tag:'AAA · RPG'},
  {id:'264710', name:'Subnautica',               cat:'survival', tag:'Survival · Indie'},
  {id:'1145360',name:'Hades',                    cat:'indie',    tag:'Indie · Roguelike'},
  {id:'413150', name:'Stardew Valley',           cat:'indie',    tag:'Indie · RPG'},
  {id:'570',    name:'Dota 2',                   cat:'aaa',      tag:'AAA · MOBA'},
  {id:'730',    name:'Counter-Strike 2',         cat:'aaa',      tag:'AAA · FPS'},
  {id:'892970', name:'Valheim',                  cat:'survival', tag:'Survival · Co-op'},
  {id:'553850', name:'HELLDIVERS 2',             cat:'aaa',      tag:'AAA · Co-op'},
  {id:'814380', name:'Sekiro',                   cat:'aaa',      tag:'Action'},
  {id:'1151640',name:'Horizon Zero Dawn',        cat:'aaa',      tag:'AAA · Adventure'},
  {id:'1593500',name:'God of War',               cat:'aaa',      tag:'AAA · Action'},
  {id:'1677740',name:'Starfield',                cat:'aaa',      tag:'AAA · RPG'},
  {id:'2050650',name:'Resident Evil 4',          cat:'aaa',      tag:'AAA · Horror'},
  {id:'2215430',name:'Ghost of Tsushima',        cat:'aaa',      tag:'AAA · Action'},
  {id:'1938090',name:'Call of Duty: MW3',        cat:'aaa',      tag:'AAA · FPS'},
];

const fixes = [
  {title:'DirectX 12 Optimization Patch',   desc:'Improves GPU utilization on NVIDIA 30/40-series and AMD RDNA2+.',       badge:'NEW', cat:'performance',game:'Universal',version:'v3.1'},
  {title:'Elden Ring 60 FPS Unlock',        desc:'Community framerate unlocker with proper frametime management.',         badge:'HOT', cat:'performance',game:'Elden Ring',version:'v2.4'},
  {title:'Cyberpunk 2077 Memory Leak Fix',  desc:'Resolves crash-on-extended-play on Intel 12th/13th gen processors.',   badge:'',    cat:'crash',game:'Cyberpunk 2077',version:'v1.8'},
  {title:'RDR2 Vulkan Crash Fix',           desc:'Patches the Vulkan backend crash triggered on AMD GPUs.',               badge:'',    cat:'crash',game:'Red Dead Redemption 2',version:'v2.0'},
  {title:"Baldur's Gate 3 Save Repair",     desc:"Fixes corrupted save files caused by the Act 2 crossfade bug.",        badge:'VERIFIED',cat:'crash',game:"Baldur's Gate 3",version:'v1.3'},
  {title:'Universal Audio Fix',             desc:'Restores surround sound output for XAudio2 on Windows 11.',            badge:'NEW', cat:'audio',game:'Universal',version:'v4.0'},
  {title:'Rust Anti-Stutter Patch',         desc:'Eliminates micro-stuttering by optimizing garbage collection.',         badge:'HOT', cat:'performance',game:'Rust',version:'v1.6'},
  {title:'HELLDIVERS 2 Crash-on-Join Fix',  desc:'Resolves crash when joining multiplayer sessions via quickplay.',       badge:'NEW', cat:'crash',game:'HELLDIVERS 2',version:'v1.1'},
  {title:'Valheim Audio Desync Fix',        desc:'Fixes positional audio desyncing after extended play sessions.',       badge:'',    cat:'audio',game:'Valheim',version:'v2.2'},
];

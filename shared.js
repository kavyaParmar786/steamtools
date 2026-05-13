/* STRAW HAT — SHARED SCRIPTS (no cursor) */

const STEAMTOOLS_CONFIG = {
  GAMEGEN_KEY:  'mg_89fab80a0e6c4949b0c169de799f4499',
  GAMEGEN_BASE: 'https://gamegen.lol/api/mg_89fab80a0e6c4949b0c169de799f4499',
  STEAM_IMG:    'https://cdn.cloudflare.steamstatic.com/steam/apps',
  GITHUB_REPO:  'steamtoolsbot-dhyey/filebase'
};

const CATALOG = [
  {id:'271590', name:'Grand Theft Auto V',       short:'GTA V',        cat:'aaa',      tag:'AAA · Action'},
  {id:'1174180',name:'Red Dead Redemption 2',    short:'RDR 2',        cat:'aaa',      tag:'AAA · Adventure'},
  {id:'1245620',name:'Elden Ring',               short:'ELDEN RING',   cat:'aaa',      tag:'AAA · RPG'},
  {id:'1091500',name:'Cyberpunk 2077',           short:'CYBERPUNK',    cat:'aaa',      tag:'AAA · Sci-Fi'},
  {id:'252490', name:'Rust',                     short:'RUST',         cat:'survival', tag:'Survival · PVP'},
  {id:'1086940',name:"Baldur's Gate 3",          short:"BALDUR'S GATE",cat:'aaa',      tag:'AAA · RPG'},
  {id:'264710', name:'Subnautica',               short:'SUBNAUTICA',   cat:'survival', tag:'Survival · Indie'},
  {id:'1145360',name:'Hades',                    short:'HADES',        cat:'indie',    tag:'Indie · Roguelike'},
  {id:'413150', name:'Stardew Valley',           short:'STARDEW',      cat:'indie',    tag:'Indie · RPG'},
  {id:'311690', name:'Gunpoint',                 short:'GUNPOINT',     cat:'indie',    tag:'Indie · Stealth'},
  {id:'570',    name:'Dota 2',                   short:'DOTA 2',       cat:'aaa',      tag:'AAA · MOBA'},
  {id:'730',    name:'Counter-Strike 2',         short:'CS 2',         cat:'aaa',      tag:'AAA · FPS'},
  {id:'892970', name:'Valheim',                  short:'VALHEIM',      cat:'survival', tag:'Survival · Co-op'},
  {id:'1203220',name:'NARAKA: BLADEPOINT',       short:'NARAKA',       cat:'aaa',      tag:'AAA · Battle Royale'},
  {id:'1817070',name:'Marvel Rivals',            short:'MARVEL RIVALS',cat:'aaa',      tag:'AAA · Shooter'},
  {id:'1172470',name:'Apex Legends',             short:'APEX',         cat:'aaa',      tag:'AAA · Battle Royale'},
  {id:'812140', name:'Assassins Creed Odyssey',  short:'AC ODYSSEY',   cat:'aaa',      tag:'AAA · RPG'},
  {id:'553850', name:'HELLDIVERS 2',             short:'HELLDIVERS',   cat:'aaa',      tag:'AAA · Co-op'},
  {id:'814380', name:'Sekiro',                   short:'SEKIRO',       cat:'aaa',      tag:'Action'},
  {id:'1151640',name:'Horizon Zero Dawn',        short:'HORIZON',      cat:'aaa',      tag:'AAA · Adventure'},
  {id:'1158310',name:'Crusader Kings III',       short:'CK III',       cat:'indie',    tag:'Strategy · RPG'},
  {id:'1446780',name:'Monster Hunter Rise',      short:'MH RISE',      cat:'aaa',      tag:'AAA · Action'},
  {id:'1551360',name:'Forza Horizon 5',          short:'FORZA 5',      cat:'aaa',      tag:'AAA · Racing'},
  {id:'1593500',name:'God of War',               short:'GOD OF WAR',   cat:'aaa',      tag:'AAA · Action'},
  {id:'1677740',name:'Starfield',                short:'STARFIELD',    cat:'aaa',      tag:'AAA · RPG'},
  {id:'1794680',name:'Vampire Survivors',        short:'VAMPIRE',      cat:'indie',    tag:'Indie · Action'},
  {id:'2050650',name:'Resident Evil 4',          short:'RE 4',         cat:'aaa',      tag:'AAA · Horror'},
  {id:'2215430',name:'Ghost of Tsushima',        short:'TSUSHIMA',     cat:'aaa',      tag:'AAA · Action'},
  {id:'227300', name:'Euro Truck Simulator 2',   short:'ETS 2',        cat:'indie',    tag:'Simulation'},
  {id:'230410', name:'Warframe',                 short:'WARFRAME',     cat:'aaa',      tag:'AAA · Action'},
  {id:'235750', name:'No Mans Sky',              short:'NMS',          cat:'survival', tag:'Survival · Sci-Fi'},
  {id:'238960', name:'Path of Exile',            short:'POE',          cat:'aaa',      tag:'RPG · Action'},
  {id:'239140', name:'Dying Light',              short:'DYING LIGHT',  cat:'survival', tag:'Survival · Action'},
  {id:'242760', name:'The Forest',               short:'THE FOREST',   cat:'survival', tag:'Survival · Horror'},
  {id:'1938090',name:'Call of Duty: MW3',        short:'COD',          cat:'aaa',      tag:'AAA · FPS'},
  {id:'2124490',name:'Street Fighter 6',         short:'SF 6',         cat:'aaa',      tag:'AAA · Fighting'},
];

const drops = [
  {id:'1091500',name:'Cyberpunk 2077 — Phantom Liberty',date:'MAY 08, 2026',tag:'AAA · SCI-FI',  badge:'NEW'},
  {id:'553850', name:'HELLDIVERS 2',                    date:'MAY 07, 2026',tag:'AAA · CO-OP',   badge:'HOT'},
  {id:'1245620',name:'Elden Ring — Shadow of the Erdtree',date:'MAY 05, 2026',tag:'AAA · RPG',  badge:'NEW'},
  {id:'814380', name:'Sekiro: Shadows Die Twice',       date:'MAY 03, 2026',tag:'AAA · ACTION', badge:'VERIFIED'},
  {id:'1086940',name:"Baldur's Gate 3 — Patch 8",       date:'APR 30, 2026',tag:'AAA · RPG',    badge:'UPDATED'},
  {id:'892970', name:'Valheim — Ashlands Update',       date:'APR 28, 2026',tag:'SURVIVAL',      badge:'UPDATED'},
  {id:'1145360',name:'Hades II — Early Access',         date:'APR 25, 2026',tag:'INDIE · ROGUE', badge:'NEW'},
  {id:'413150', name:'Stardew Valley 1.6',              date:'APR 22, 2026',tag:'INDIE · RPG',   badge:'VERIFIED'},
];

const fixes = [
  {title:'DirectX 12 Optimization Patch',   desc:'Improves GPU utilization on NVIDIA 30/40-series and AMD RDNA2+. Resolves shader compilation stuttering.',  badge:'NEW',      cat:'performance',game:'Universal',        version:'v3.1'},
  {title:'Elden Ring 60 FPS Unlock',        desc:'Community framerate unlocker with proper frametime management for smooth high-refresh-rate gameplay.',       badge:'HOT',      cat:'performance',game:'Elden Ring',        version:'v2.4'},
  {title:'Cyberpunk 2077 Memory Leak Fix',  desc:'Resolves crash-on-extended-play on Intel 12th/13th gen processors. Stable for sessions over 3 hours.',     badge:'',         cat:'crash',      game:'Cyberpunk 2077',   version:'v1.8'},
  {title:'RDR2 Vulkan Crash Fix',           desc:'Patches the Vulkan backend crash triggered on AMD GPUs when entering dense foliage areas.',                 badge:'',         cat:'crash',      game:'Red Dead Redemption 2',version:'v2.0'},
  {title:"Baldur's Gate 3 Save Repair",     desc:"Fixes corrupted save files caused by the Act 2 crossfade bug. Restores progress without rollback.",         badge:'VERIFIED', cat:'crash',      game:"Baldur's Gate 3",  version:'v1.3'},
  {title:'Universal Audio Fix',             desc:'Restores surround sound output for games using deprecated XAudio2 on Windows 11 22H2+.',                   badge:'NEW',      cat:'audio',      game:'Universal',        version:'v4.0'},
  {title:'Rust Anti-Stutter Patch',         desc:'Eliminates micro-stuttering in Rust by optimizing garbage collection and asset streaming pipeline.',         badge:'HOT',      cat:'performance',game:'Rust',             version:'v1.6'},
  {title:'HELLDIVERS 2 Crash-on-Join Fix',  desc:'Resolves the frequent crash when joining multiplayer sessions via quickplay.',                              badge:'NEW',      cat:'crash',      game:'HELLDIVERS 2',     version:'v1.1'},
  {title:'Valheim Audio Desync Fix',        desc:'Fixes positional audio desyncing after extended play sessions and echo in underground biomes.',             badge:'',         cat:'audio',      game:'Valheim',          version:'v2.2'},
];

/* ── STEAM API ─────────────────────────── */
const _steamCache = {};
async function fetchSteamDetails(appId) {
  if (_steamCache[appId]) return _steamCache[appId];
  try {
    const r = await fetch(`https://store.steampowered.com/api/appdetails?appids=${appId}`);
    const j = await r.json();
    if (j[appId]?.success) { _steamCache[appId] = j[appId].data; return j[appId].data; }
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

/* ── MODAL ─────────────────────────────── */
async function openGameModal(appId) {
  const game = CATALOG.find(g => g.id === appId);
  if (!game) return;
  document.querySelector('.game-modal-overlay')?.remove();
  const overlay = document.createElement('div');
  overlay.className = 'game-modal-overlay';
  overlay.innerHTML = `<div class="game-modal">
    <button class="modal-close" onclick="this.closest('.game-modal-overlay').remove()">✕</button>
    <div class="modal-hero">
      <img src="${STEAMTOOLS_CONFIG.STEAM_IMG}/${appId}/library_600x900_2x.jpg" alt="${game.name}"
        onerror="this.src='${STEAMTOOLS_CONFIG.STEAM_IMG}/${appId}/header.jpg'">
      <div class="modal-hero-gradient"></div>
    </div>
    <div class="modal-body">
      <div class="modal-main">
        <h1>${game.name}</h1>
        <span class="game-tag" style="display:inline-block;margin-bottom:16px">${game.tag}</span>
        <div class="modal-desc"><p>Loading details from Steam...</p></div>
        <div class="modal-screens"><h3>Screenshots</h3><div class="screens-row" id="screens-${appId}">Loading...</div></div>
      </div>
      <div class="modal-sidebar">
        <button class="btn-hero btn-download" id="dl-btn-${appId}" disabled>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          Generating...
        </button>
        <div class="modal-meta" id="meta-${appId}">Loading...</div>
      </div>
    </div>
  </div>`;
  document.body.appendChild(overlay);
  overlay.addEventListener('click', e => { if (e.target === overlay) overlay.remove(); });

  const [details, dlUrl] = await Promise.all([fetchSteamDetails(appId), fetchGameGenLink(appId)]);

  if (details) {
    overlay.querySelector('.modal-desc').innerHTML = `<p>${details.short_description || 'No description.'}</p>`;
    const sr = document.getElementById(`screens-${appId}`);
    if (details.screenshots?.length) {
      sr.innerHTML = details.screenshots.slice(0,6).map(s =>
        `<img src="${s.path_thumbnail}" class="screen-thumb" onclick="this.classList.toggle('expanded')">`).join('');
    } else sr.innerHTML = '<p>No screenshots</p>';
    document.getElementById(`meta-${appId}`).innerHTML = `
      <div class="meta-row"><span>Developer</span><span>${(details.developers||['N/A']).join(', ')}</span></div>
      <div class="meta-row"><span>Publisher</span><span>${(details.publishers||['N/A']).join(', ')}</span></div>
      <div class="meta-row"><span>Genre</span><span>${(details.genres||[]).map(g=>g.description).join(', ')||'N/A'}</span></div>
      <div class="meta-row"><span>Released</span><span>${details.release_date?.date||'N/A'}</span></div>`;
  }

  const dlBtn = document.getElementById(`dl-btn-${appId}`);
  if (dlUrl) {
    dlBtn.disabled = false;
    dlBtn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg> Get Game`;
    dlBtn.onclick = () => window.open(dlUrl, '_blank');
  } else {
    dlBtn.innerHTML = '⚠ Unavailable';
  }
}

/* ── PAGE TRANSITIONS ──────────────────── */
function initPageTransitions() {
  document.querySelectorAll('a[href]').forEach(link => {
    const href = link.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto') || link.target === '_blank') return;
    link.addEventListener('click', e => {
      e.preventDefault();
      const overlay = document.querySelector('.page-transition-overlay');
      if (overlay) {
        overlay.classList.add('pt-exit');
        setTimeout(() => { window.location.href = href; }, 460);
      } else window.location.href = href;
    });
  });
}

/* ── SCROLL REVEAL ─────────────────────── */
function initReveal() {
  const ro = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); ro.unobserve(e.target); } });
  }, { threshold: 0, rootMargin: '0px 0px -8% 0px' });
  document.querySelectorAll('.reveal').forEach(el => ro.observe(el));
}

/* ── NAV ───────────────────────────────── */
function initNav() {
  window.addEventListener('scroll', () => {
    document.querySelector('nav')?.classList.toggle('scrolled', window.scrollY > 40);
  });
}

/* ── LOADER — CINEMATIC ────────────────── */
function initLoader() {
  const loader = document.createElement('div');
  loader.id = 'st-loader';
  loader.innerHTML = `
    <canvas id="loader-canvas"></canvas>
    <div class="loader-core">
      <div class="loader-ring-wrap">
        <div class="loader-ring r1"></div>
        <div class="loader-ring r2"></div>
        <div class="loader-ring r3"></div>
        <div class="loader-icon">ST</div>
      </div>
      <div class="loader-logo-wrap">
        <span class="loader-title">STRAW<span>HAT</span></span>
      </div>
      <div class="loader-progress">
        <div class="loader-bar"><div class="loader-fill"></div></div>
        <div class="loader-stats">
          <span class="loader-tag">Entering the Vault</span>
          <span class="sep"></span>
          <span id="loader-pct">0%</span>
        </div>
      </div>
    </div>`;
  document.body.appendChild(loader);

  /* Particle canvas */
  const canvas = loader.querySelector('#loader-canvas');
  const ctx = canvas.getContext('2d');
  let W, H, particles = [], animId;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  /* Spawn particles */
  for (let i = 0; i < 80; i++) {
    particles.push({
      x: Math.random() * 1920,
      y: Math.random() * 1080,
      vx: (Math.random() - .5) * 0.5,
      vy: (Math.random() - .5) * 0.5,
      r: Math.random() * 1.4 + 0.3,
      hue: Math.random() > 0.6 ? 20 : Math.random() > 0.5 ? 345 : 195,
      alpha: Math.random() * 0.5 + 0.1,
      pulse: Math.random() * Math.PI * 2
    });
  }

  function drawLoader(ts) {
    ctx.clearRect(0, 0, W, H);
    const t = ts * 0.001;

    /* Draw connections */
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const d = Math.sqrt(dx*dx + dy*dy);
        if (d < 120) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(255,106,0,${(1 - d/120) * 0.07})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }

    /* Draw + move particles */
    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy; p.pulse += 0.02;
      if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
      const a = p.alpha * (0.7 + 0.3 * Math.sin(p.pulse));
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
      ctx.fillStyle = `hsla(${p.hue},100%,65%,${a})`;
      ctx.fill();
    });

    animId = requestAnimationFrame(drawLoader);
  }
  animId = requestAnimationFrame(drawLoader);

  /* Percentage counter */
  const pctEl = loader.querySelector('#loader-pct');
  let pct = 0;
  const pctTimer = setInterval(() => {
    pct = Math.min(100, pct + Math.floor(Math.random() * 18) + 6);
    if (pctEl) pctEl.textContent = pct + '%';
    if (pct >= 100) clearInterval(pctTimer);
  }, 160);

  /* Dismiss */
  setTimeout(() => {
    cancelAnimationFrame(animId);
    loader.classList.add('fade-out');
    setTimeout(() => loader.remove(), 800);
  }, 1800);
}

/* ── DOODLE CANVAS (background lines) ─── */
function initDoodleCanvas() {
  const canvas = document.getElementById('doodle-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  function resize() { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; }
  resize();
  window.addEventListener('resize', resize);

  const lines = Array.from({length:14}, () => ({
    x: Math.random() * canvas.width, y: Math.random() * canvas.height,
    vx: (Math.random()-.5)*0.7, vy: (Math.random()-.5)*0.7,
    len: 40+Math.random()*110, angle: Math.random()*Math.PI*2,
    av: (Math.random()-.5)*0.014,
    hue: Math.random()>0.5 ? '#ff6a00' : '#ff3d6e',
    phase: Math.random()*Math.PI*2
  }));
  const circles = Array.from({length:9}, () => ({
    x: Math.random()*canvas.width, y: Math.random()*canvas.height,
    r: 18+Math.random()*60, vx: (Math.random()-.5)*0.45, vy: (Math.random()-.5)*0.45,
    phase: Math.random()*Math.PI*2, cyan: Math.random()>.55
  }));

  let t = 0;
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    t += 0.012;
    lines.forEach(l => {
      l.x+=l.vx; l.y+=l.vy; l.angle+=l.av;
      if(l.x<0||l.x>canvas.width) l.vx*=-1;
      if(l.y<0||l.y>canvas.height) l.vy*=-1;
      ctx.save(); ctx.translate(l.x,l.y); ctx.rotate(l.angle);
      ctx.strokeStyle=l.hue; ctx.lineWidth=1.5;
      ctx.globalAlpha=0.45+0.3*Math.sin(t+l.phase);
      ctx.beginPath(); ctx.moveTo(-l.len/2,0); ctx.lineTo(l.len/2,0); ctx.stroke();
      // small tick marks
      ctx.lineWidth=1; ctx.globalAlpha=0.3;
      ctx.beginPath(); ctx.moveTo(-l.len/2,-5); ctx.lineTo(-l.len/2,5); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(l.len/2,-5); ctx.lineTo(l.len/2,5); ctx.stroke();
      ctx.restore();
    });
    circles.forEach(c => {
      c.x+=c.vx; c.y+=c.vy;
      if(c.x<-c.r||c.x>canvas.width+c.r) c.vx*=-1;
      if(c.y<-c.r||c.y>canvas.height+c.r) c.vy*=-1;
      ctx.save();
      ctx.strokeStyle = c.cyan ? '#00f0ff' : '#ff6a00';
      ctx.lineWidth = 1; ctx.globalAlpha=0.28+0.18*Math.sin(t*0.7+c.phase);
      ctx.beginPath(); ctx.arc(c.x,c.y,c.r*(0.88+0.12*Math.sin(t+c.phase)),0,Math.PI*2); ctx.stroke();
      ctx.restore();
    });
    // plus signs scattered
    for(let i=0;i<6;i++) {
      const x=(canvas.width*(i+0.5))/6+28*Math.sin(t*0.35+i);
      const y=canvas.height*0.5+38*Math.cos(t*0.28+i*1.2);
      ctx.save(); ctx.strokeStyle='#ff6a00'; ctx.lineWidth=1.5; ctx.globalAlpha=0.22;
      ctx.translate(x,y); ctx.rotate(t*0.18+i);
      ctx.beginPath(); ctx.moveTo(-8,0); ctx.lineTo(8,0); ctx.moveTo(0,-8); ctx.lineTo(0,8); ctx.stroke();
      ctx.restore();
    }
    requestAnimationFrame(draw);
  }
  draw();
}

/* ── DOODLE PREVIEWS (canvas animations) ─ */
function initDoodlePreviews() {
  // Energy orb
  const d1el = document.getElementById('doodle-1');
  if (d1el) {
    const c = makeCanvas(d1el); let t=0;
    function draw() {
      c.width=d1el.offsetWidth||260; c.height=d1el.offsetHeight||180;
      const ctx=c.getContext('2d'), cx=c.width/2, cy=c.height/2;
      ctx.clearRect(0,0,c.width,c.height);
      for(let i=0;i<10;i++){
        const a=(i/10)*Math.PI*2+t, r=30+16*Math.sin(t*2+i*0.7);
        ctx.beginPath(); ctx.arc(cx+r*Math.cos(a),cy+r*Math.sin(a),3.5,0,Math.PI*2);
        ctx.fillStyle=`hsl(${16+i*14},100%,60%)`; ctx.globalAlpha=0.85; ctx.fill();
      }
      // connecting lines
      ctx.globalAlpha=0.12; ctx.strokeStyle='#ff6a00'; ctx.lineWidth=1;
      for(let i=0;i<10;i++){
        const a=(i/10)*Math.PI*2+t, r=30+16*Math.sin(t*2+i*0.7);
        const nx=cx+r*Math.cos(a), ny=cy+r*Math.sin(a);
        const b=((i+1)%10/10)*Math.PI*2+t, rn=30+16*Math.sin(t*2+(i+1)*0.7);
        ctx.beginPath(); ctx.moveTo(nx,ny); ctx.lineTo(cx+rn*Math.cos(b),cy+rn*Math.sin(b)); ctx.stroke();
      }
      const g=ctx.createRadialGradient(cx,cy,0,cx,cy,44);
      g.addColorStop(0,'rgba(255,106,0,0.55)'); g.addColorStop(1,'rgba(255,106,0,0)');
      ctx.beginPath(); ctx.arc(cx,cy,44,0,Math.PI*2);
      ctx.fillStyle=g; ctx.globalAlpha=0.45+0.3*Math.sin(t); ctx.fill();
      t+=0.04; requestAnimationFrame(draw);
    } draw();
  }
  // Neon waves
  const d2el = document.getElementById('doodle-2');
  if (d2el) {
    const c = makeCanvas(d2el); let t=0;
    function draw() {
      c.width=d2el.offsetWidth||260; c.height=d2el.offsetHeight||180;
      const ctx=c.getContext('2d');
      ctx.clearRect(0,0,c.width,c.height);
      for(let i=0;i<6;i++){
        const y=c.height/2+(i-2.5)*22;
        ctx.beginPath(); ctx.moveTo(0,y);
        for(let x=0;x<=c.width;x+=3){
          ctx.lineTo(x, y+Math.sin(x*0.038+(t+i*0.5))*16*Math.abs(Math.sin(t*0.4+i*0.4)));
        }
        ctx.strokeStyle=`hsl(${350+i*18},100%,62%)`; ctx.lineWidth=1.8; ctx.globalAlpha=0.65-i*0.07; ctx.stroke();
      }
      t+=0.045; requestAnimationFrame(draw);
    } draw();
  }
  // Void swirl
  const d3el = document.getElementById('doodle-3');
  if (d3el) {
    const c = makeCanvas(d3el); let t=0;
    function draw() {
      c.width=d3el.offsetWidth||260; c.height=d3el.offsetHeight||180;
      const ctx=c.getContext('2d'), cx=c.width/2, cy=c.height/2;
      ctx.clearRect(0,0,c.width,c.height);
      for(let s=0;s<3;s++){
        ctx.beginPath();
        for(let i=0;i<220;i++){
          const angle=(i/32)*Math.PI*2+t+s*2.09, r=6+i*0.3;
          const x=cx+r*Math.cos(angle), y=cy+r*Math.sin(angle);
          i===0?ctx.moveTo(x,y):ctx.lineTo(x,y);
        }
        ctx.strokeStyle=s===0?'#ff6a00':s===1?'#ff3d6e':'#00f0ff';
        ctx.lineWidth=1.2; ctx.globalAlpha=0.6; ctx.stroke();
      }
      t+=0.016; requestAnimationFrame(draw);
    } draw();
  }
}

function makeCanvas(container) {
  const c = document.createElement('canvas');
  c.style.cssText='position:absolute;inset:0;width:100%;height:100%';
  container.appendChild(c); return c;
}

/* ── STAT COUNTER ──────────────────────── */
function initCounters() {
  document.querySelectorAll('.desc-stat-num[data-count]').forEach(el => {
    const target = parseInt(el.dataset.count);
    const suffix = el.textContent.replace(/[0-9]/g,'').trim();
    let started = false;
    const ro = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && !started) {
        started = true;
        let cur = 0; const step = Math.ceil(target/60);
        const iv = setInterval(() => {
          cur = Math.min(cur+step, target);
          el.textContent = cur.toLocaleString()+suffix;
          if (cur >= target) clearInterval(iv);
        }, 18);
        ro.unobserve(el);
      }
    });
    ro.observe(el);
  });
}

/* ── TOAST ─────────────────────────────── */
function showToast(msg, icon='✓') {
  const t = document.createElement('div');
  t.className = 'st-toast';
  t.innerHTML = `<span class="t-icon">${icon}</span>${msg}`;
  document.body.appendChild(t);
  setTimeout(() => { t.classList.add('hide'); setTimeout(()=>t.remove(),300); }, 2800);
}

/* ── INIT ──────────────────────────────── */


/* ── DOODLE EMPIRE — animated doodles + canvas ── */
function initDoodleEmpire() {
  const section = document.getElementById('doodle-empire');
  const doodleWrap = document.getElementById('empire-doodles');
  const canvas = document.getElementById('empire-canvas');
  if (!section || !doodleWrap || !canvas) return;

  const ctx = canvas.getContext('2d');
  let W, H;

  function resize() {
    W = canvas.width  = section.offsetWidth;
    H = canvas.height = section.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  /* ── Background canvas: floating lines + circles ── */
  const lines  = Array.from({length: 18}, () => ({
    x: Math.random() * 1600, y: Math.random() * 500,
    vx: (Math.random() - .5) * .55, vy: (Math.random() - .5) * .55,
    len: 50 + Math.random() * 120, angle: Math.random() * Math.PI * 2,
    av: (Math.random() - .5) * .013,
    col: Math.random() > .5 ? 'rgba(255,106,0,' : 'rgba(255,61,110,',
    alpha: .06 + Math.random() * .1,
  }));
  const circles = Array.from({length: 11}, () => ({
    x: Math.random() * 1600, y: Math.random() * 500,
    r: 22 + Math.random() * 70,
    vx: (Math.random() - .5) * .4, vy: (Math.random() - .5) * .4,
    phase: Math.random() * Math.PI * 2,
    col: Math.random() > .6 ? 'rgba(255,106,0,' : 'rgba(0,212,255,',
  }));

  let t = 0;
  function drawBg() {
    ctx.clearRect(0, 0, W, H);
    t += 0.012;

    lines.forEach(l => {
      l.x += l.vx; l.y += l.vy; l.angle += l.av;
      if (l.x < -150) l.x = W + 50; if (l.x > W + 150) l.x = -50;
      if (l.y < -80)  l.y = H + 40; if (l.y > H + 80)  l.y = -40;
      const a = l.alpha * (0.6 + 0.4 * Math.sin(t + l.phase || 0));
      const x2 = l.x + Math.cos(l.angle) * l.len;
      const y2 = l.y + Math.sin(l.angle) * l.len;
      ctx.beginPath(); ctx.moveTo(l.x, l.y); ctx.lineTo(x2, y2);
      ctx.strokeStyle = l.col + a + ')'; ctx.lineWidth = 1; ctx.stroke();
    });

    circles.forEach(c => {
      c.x += c.vx; c.y += c.vy; c.phase += 0.018;
      if (c.x < -100) c.x = W + 60; if (c.x > W + 100) c.x = -60;
      if (c.y < -100) c.y = H + 60; if (c.y > H + 100) c.y = -60;
      const a = 0.04 + 0.04 * Math.sin(c.phase);
      ctx.beginPath(); ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2);
      ctx.strokeStyle = c.col + a + ')'; ctx.lineWidth = 1; ctx.stroke();
    });

    requestAnimationFrame(drawBg);
  }
  drawBg();

  /* ── SVG Doodles orbiting around the text ── */
  const DOODLES = [
    // [svg markup, orbit radius, orbit speed, start angle, size]
    ['<circle cx="22" cy="22" r="20" stroke="#ff6a00" stroke-width="1.5" stroke-dasharray="6 4" fill="none"/><line x1="22" y1="2" x2="22" y2="42" stroke="#ff6a00" stroke-width="0.8"/><line x1="2" y1="22" x2="42" y2="22" stroke="#ff6a00" stroke-width="0.8"/>', 44, 44, 0.009, 0],
    ['<rect x="4" y="4" width="40" height="40" rx="4" stroke="#ff3d6e" stroke-width="1.5" stroke-dasharray="8 4" fill="none"/><rect x="12" y="12" width="24" height="24" rx="2" stroke="#ff3d6e" stroke-width="1" fill="none"/>', 48, 48, 1.2, 0.004],
    ['<polygon points="24,4 44,40 4,40" stroke="#fff" stroke-width="1.5" stroke-dasharray="5 3" fill="none"/><circle cx="24" cy="30" r="6" stroke="#ff6a00" stroke-width="1.2" fill="none"/>', 48, 48, 2.4, -0.007],
    ['<path d="M24 4 L44 24 L24 44 L4 24 Z" stroke="#00d4ff" stroke-width="1.5" stroke-dasharray="6 3" fill="none"/><circle cx="24" cy="24" r="8" stroke="#00d4ff" stroke-width="1" fill="none"/>', 48, 48, 3.7, 0.006],
    ['<circle cx="22" cy="22" r="20" stroke="#ff6a00" stroke-width="1" stroke-dasharray="3 3" fill="none"/><circle cx="22" cy="22" r="12" stroke="#ff3d6e" stroke-width="1.2" fill="none"/><circle cx="22" cy="22" r="4" stroke="#fff" stroke-width="1" fill="none"/>', 44, 44, 0.8, -0.005],
    ['<rect x="2" y="2" width="36" height="36" rx="18" stroke="#ff3d6e" stroke-width="1.2" stroke-dasharray="4 3" fill="none"/><rect x="10" y="10" width="20" height="20" rx="10" stroke="#ff6a00" stroke-width="1.5" fill="none"/>', 40, 40, 5.2, 0.008],
    ['<path d="M4 20 Q20 4 36 20 Q20 36 4 20Z" stroke="#fff" stroke-width="1.5" stroke-dasharray="5 4" fill="none"/><path d="M10 20 Q20 10 30 20 Q20 30 10 20Z" stroke="#ff6a00" stroke-width="1" fill="none"/>', 40, 40, 4.1, -0.006],
    ['<polygon points="20,2 38,16 32,36 8,36 2,16" stroke="#00d4ff" stroke-width="1.5" stroke-dasharray="6 3" fill="none"/><circle cx="20" cy="22" r="6" stroke="#00d4ff" stroke-width="1.2" fill="none"/>', 40, 40, 2.9, 0.005],
  ];

  // Place doodles spread around the section
  const cx = section.offsetWidth / 2;
  const cy = section.offsetHeight / 2;
  const spreadX = section.offsetWidth * 0.38;
  const spreadY = section.offsetHeight * 0.38;

  const empEls = DOODLES.map((d, i) => {
    const div = document.createElement('div');
    div.className = 'emp-doodle';
    const [markup, w, h, startAngle, speed] = d;
    div.innerHTML = `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" fill="none">${markup}</svg>`;

    // Each doodle gets an orbit around the text center
    const orbitRx = spreadX * (0.7 + Math.random() * 0.6);
    const orbitRy = spreadY * (0.5 + Math.random() * 0.5);
    div._orbitRx = orbitRx;
    div._orbitRy = orbitRy;
    div._angle = startAngle;
    div._speed = speed !== 0 ? speed : (Math.random() - .5) * .008;
    div._selfRot = 0;
    div._selfRotSpeed = (Math.random() - .5) * 0.015;
    doodleWrap.appendChild(div);
    return div;
  });

  function animateDoodles() {
    const sw = section.offsetWidth / 2;
    const sh = section.offsetHeight / 2;

    empEls.forEach(el => {
      el._angle += el._speed;
      el._selfRot += el._selfRotSpeed;
      const x = sw + Math.cos(el._angle) * el._orbitRx - 24;
      const y = sh + Math.sin(el._angle) * el._orbitRy - 24;
      el.style.transform = `translate(${x}px, ${y}px) rotate(${el._selfRot}rad)`;
    });
    requestAnimationFrame(animateDoodles);
  }
  animateDoodles();
}

document.addEventListener('DOMContentLoaded', () => {
  initLoader();
  initPageTransitions();
  initReveal();
  initNav();
  if (document.getElementById('doodle-canvas')) initDoodleCanvas();
  initDoodleEmpire();
  if (document.getElementById('doodle-1'))     setTimeout(initDoodlePreviews, 80);
  initCounters();
  // Ensure bg-overlay exists
  if (!document.querySelector('.bg-overlay')) {
    const o = document.createElement('div'); o.className='bg-overlay';
    document.body.prepend(o);
  }
});

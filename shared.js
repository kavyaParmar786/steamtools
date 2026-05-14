/* STRAW HAT — SHARED SCRIPTS v5 */

const STEAMTOOLS_CONFIG = {
  GAMEGEN_KEY:  'mg_89fab80a0e6c4949b0c169de799f4499',
  GAMEGEN_BASE: 'https://gamegen.lol/api/mg_89fab80a0e6c4949b0c169de799f4499',
  STEAM_IMG:    'https://cdn.cloudflare.steamstatic.com/steam/apps',
  GITHUB_REPO:  'steamtoolsbot-dhyey/filebase',
  DISCORD_ID:   '1263113862754545795'  // Straw Hat Discord server ID
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

/* ── STEAM API ─────────────────────────────────── */
const _steamCache = {};
async function fetchSteamDetails(appId) {
  if (_steamCache[appId]) return _steamCache[appId];
  try {
    const urls = [
      `https://store.steampowered.com/api/appdetails?appids=${appId}&l=english`,
      `https://api.allorigins.win/get?url=${encodeURIComponent(`https://store.steampowered.com/api/appdetails?appids=${appId}&l=english`)}`,
      `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(`https://store.steampowered.com/api/appdetails?appids=${appId}&l=english`)}`,
      `https://thingproxy.freeboard.io/fetch/https://store.steampowered.com/api/appdetails?appids=${appId}&l=english`
    ];
    for (const url of urls) {
      try {
        const r = await fetch(url, { signal: AbortSignal.timeout(5000) });
        if (!r.ok) continue;
        const j = await r.json();
        
        // Handle AllOrigins wrapper
        let data = j;
        if (j.contents) data = JSON.parse(j.contents);
        
        if (data[appId]?.success) {
          _steamCache[appId] = data[appId].data;
          return data[appId].data;
        }
      } catch(e) { continue; }
    }
  } catch(e) {}
  return null;
}

/**
 * Enriches a game object with real Steam metadata if it's dynamic/missing info.
 */
async function enrichGameMetadata(game) {
  if (!game.dynamic && game.name !== `Game ${game.id}`) return game;
  
  const details = await fetchSteamDetails(game.id);
  if (details) {
    game.name = details.name || game.name;
    game.tag = (details.genres || []).map(g => g.description).join(' · ') || game.tag;
    game.desc = details.short_description || "";
    game.dynamic = false; // Mark as enriched
  }
  return game;
}

async function fetchSteamReviews(appId) {
  try {
    const url = `https://api.allorigins.win/raw?url=${encodeURIComponent(`https://store.steampowered.com/appreviews/${appId}?json=1&num_per_page=0&language=all`)}`;
    const r = await fetch(url, { signal: AbortSignal.timeout(6000) });
    const j = await r.json();
    if (j.query_summary) return j.query_summary;
  } catch(e) {}
  return null;
}

async function fetchGameGenLink(appId) {
  try {
    const r = await fetch(`${STEAMTOOLS_CONFIG.GAMEGEN_BASE}/generate/${appId}`, { signal: AbortSignal.timeout(8000) });
    const j = await r.json();
    if (j.success && j.manifest) return j.manifest.downloadUrl;
  } catch(e) {}
  try {
    const r = await fetch(`https://api.github.com/repos/${STEAMTOOLS_CONFIG.GITHUB_REPO}/contents/${appId}.lua`, { signal: AbortSignal.timeout(6000) });
    if (r.ok) { const j = await r.json(); return j.download_url; }
  } catch(e) {}
  return null;
}

/* ── LIVE DISCORD MEMBER COUNT ─────────────────── */
async function fetchDiscordMembers() {
  try {
    // Discord widget API — works without auth for public servers
    const r = await fetch(`https://discord.com/api/guilds/${STEAMTOOLS_CONFIG.DISCORD_ID}/widget.json`, { signal: AbortSignal.timeout(5000) });
    if (r.ok) {
      const j = await r.json();
      // approximate_member_count is total, presence_count is online
      return j.approximate_member_count || j.members?.length || null;
    }
  } catch(e) {}
  // Fallback: try the invite endpoint
  try {
    const r = await fetch(`https://discord.com/api/invites/AaK8s6fpVa?with_counts=true`, { signal: AbortSignal.timeout(5000) });
    if (r.ok) {
      const j = await r.json();
      return j.approximate_member_count || null;
    }
  } catch(e) {}
  return null;
}

/* ── LIVE GAME COUNT from catalog + gamegen ────── */
let DYNAMIC_CATALOG = [...CATALOG];
let CATALOG_LOADED = false;

async function fetchLiveGameCount() {
  const baseCount = CATALOG.length;
  try {
    const r = await fetch(`${STEAMTOOLS_CONFIG.GAMEGEN_BASE}/count`, { signal: AbortSignal.timeout(5000) });
    if (r.ok) {
      const j = await r.json();
      if (j.count && j.count > baseCount) return j.count;
    }
  } catch(e) {}
  return baseCount;
}

/**
 * Loads all games by discovering IDs from the GitHub filebase 
 * and fetching metadata from Steam for missing entries.
 */
async function loadFullCatalog() {
  if (CATALOG_LOADED) return DYNAMIC_CATALOG;
  
  // Helper to process a list of IDs/filenames
  const processDiscovered = (ids) => {
    const newIds = ids.filter(id => !DYNAMIC_CATALOG.some(g => g.id === id));
    newIds.forEach(id => {
      DYNAMIC_CATALOG.push({
        id: id,
        name: `Game ${id}`,
        cat: 'uncategorized',
        tag: 'Vault · Discovery',
        dynamic: true
      });
    });
    console.log(`[Vault] Synced ${ids.length} games (Discovered ${newIds.length} new).`);
  };

  try {
    // 0. High Priority: Try JSON manifests first (e.g. catalog.json or games.json)
    const manifests = ['catalog.json', 'games.json', 'list.json', 'all.json'];
    for (const m of manifests) {
      try {
        const r = await fetch(`https://raw.githubusercontent.com/${STEAMTOOLS_CONFIG.GITHUB_REPO}/main/${m}`);
        if (r.ok) {
          const j = await r.json();
          const ids = Array.isArray(j) ? j.map(item => item.id || item) : Object.keys(j);
          if (ids.length > 50) { // Ensure it's a real list
            processDiscovered(ids);
            CATALOG_LOADED = true;
            return DYNAMIC_CATALOG;
          }
        }
      } catch(e) {}
    }

    // 1. Try GitHub Recursive Tree API
    console.log("[Vault] Attempting Recursive GitHub discovery...");
    const treeUrl = `https://api.github.com/repos/${STEAMTOOLS_CONFIG.GITHUB_REPO}/git/trees/main?recursive=1`;
    const r = await fetch(treeUrl, { signal: AbortSignal.timeout(12000) });
    
    if (r.ok) {
      const data = await r.json();
      if (data.tree && Array.isArray(data.tree)) {
        if (data.truncated) console.warn("[Vault] GitHub tree is truncated. Some games might be missing.");
        const ids = data.tree
          .filter(f => f.path.endsWith('.lua'))
          .map(f => f.path.split('/').pop().replace('.lua', ''));
        processDiscovered(ids);
        CATALOG_LOADED = true;
        return DYNAMIC_CATALOG;
      }
    }
    // Fallback to 'master'
    const r2 = await fetch(`https://api.github.com/repos/${STEAMTOOLS_CONFIG.GITHUB_REPO}/git/trees/master?recursive=1`, { signal: AbortSignal.timeout(15000) });
    if (r2.ok) {
      const data = await r2.json();
      if (data.tree && Array.isArray(data.tree)) {
        const ids = data.tree
          .filter(f => f.path.endsWith('.lua'))
          .map(f => f.path.split('/').pop().replace('.lua', ''));
        processDiscovered(ids);
        CATALOG_LOADED = true;
        return DYNAMIC_CATALOG;
      }
    }
    // 2. Recursive Crawler Fallback (Crawls subdirectories if Tree API is limited)
    console.log("[Vault] Starting recursive directory crawl...");
    const discoveredIds = new Set();
    
    async function crawl(path = "") {
      try {
        const r = await fetch(`https://api.github.com/repos/${STEAMTOOLS_CONFIG.GITHUB_REPO}/contents/${path}`, { signal: AbortSignal.timeout(5000) });
        if (!r.ok) return;
        const items = await r.json();
        if (!Array.isArray(items)) return;
        
        for (const item of items) {
          if (item.type === 'dir') {
            await crawl(item.path); // Recurse
          } else if (item.name.endsWith('.lua')) {
            const id = item.name.replace('.lua', '');
            discoveredIds.add(id);
          }
        }
      } catch(e) {}
    }

    await crawl();
    if (discoveredIds.size > 0) {
      processDiscovered(Array.from(discoveredIds));
      CATALOG_LOADED = true;
      return DYNAMIC_CATALOG;
    }
    
    throw new Error("Recursive crawl found no new games");
  } catch(e) {
    console.warn("[Vault] GitHub Crawler failed, trying GameGen fallback...", e);
    
/**
 * Searches the GameGen database for titles matching a query.
 * Useful for accessing the full 66k+ database on-demand.
 */
async function searchGameGen(query) {
  if (!query || query.length < 2) return [];
  try {
    const r = await fetch(`${STEAMTOOLS_CONFIG.GAMEGEN_BASE}/search?q=${encodeURIComponent(query)}`, { 
      signal: AbortSignal.timeout(5000) 
    });
    if (r.ok) {
      const j = await r.json();
      const results = Array.isArray(j) ? j : (j.results || j.games || []);
      // Map results to our catalog format and add to DYNAMIC_CATALOG
      results.forEach(res => {
        if (!DYNAMIC_CATALOG.some(g => g.id === String(res.id))) {
          DYNAMIC_CATALOG.push({
            id: String(res.id),
            name: res.name || `Game ${res.id}`,
            cat: res.category || 'uncategorized',
            tag: res.tag || 'Vault · Remote',
            dynamic: true
          });
        }
      });
      return results;
    }
  } catch(e) {}
  return [];
}

    // 2. Fallback to GameGen API
    try {
      const endpoints = [`${STEAMTOOLS_CONFIG.GAMEGEN_BASE}/list`, `${STEAMTOOLS_CONFIG.GAMEGEN_BASE}/all`, `${STEAMTOOLS_CONFIG.GAMEGEN_BASE}/catalog` ];
      for (const url of endpoints) {
        try {
          const r = await fetch(url, { signal: AbortSignal.timeout(10000) });
          if (r.ok) {
            const j = await r.json();
            const ids = Array.isArray(j) ? j : (j.games || j.catalog || j.ids || []);
            if (ids.length) {
              processDiscovered(ids.map(i => i.id || i));
              CATALOG_LOADED = true;
              return DYNAMIC_CATALOG;
            }
          }
        } catch(err) { continue; }
      }
    } catch(err) {
      console.warn("[Vault] All discovery sources failed. Using hardcoded catalog only.");
    }
  }
  
  CATALOG_LOADED = true;
  return DYNAMIC_CATALOG;
}

/* ── LIVE STATS INIT ───────────────────────────── */
async function initLiveStats() {
  // Fetch both in parallel
  const [memberCount, gameCount] = await Promise.all([
    fetchDiscordMembers(),
    fetchLiveGameCount()
  ]);

  // Update member count stat
  if (memberCount) {
    document.querySelectorAll('.desc-stat-num[data-stat="members"]').forEach(el => {
      el.dataset.count = memberCount;
      el.textContent = '0+';
    });
    // Also update any hardcoded 12000 counts
    document.querySelectorAll('.desc-stat-num[data-count="12000"]').forEach(el => {
      el.dataset.count = memberCount;
    });
  }

  // Update game count stat
  if (gameCount) {
    document.querySelectorAll('.desc-stat-num[data-stat="games"]').forEach(el => {
      el.dataset.count = gameCount;
      el.textContent = '0+';
    });
    document.querySelectorAll('.desc-stat-num[data-count="450"]').forEach(el => {
      el.dataset.count = gameCount;
    });
  }

  // Re-run counters after updating data
  initCounters();
}

/* ── FULL EPIC/STEAM STYLE MODAL ──────────────── */
let _activeScreenIdx = 0;

async function openGameModal(appId) {
  const source = typeof DYNAMIC_CATALOG !== 'undefined' ? DYNAMIC_CATALOG : CATALOG;
  const game = source.find(g => g.id === appId);
  if (!game) return;
  document.querySelector('.game-modal-overlay')?.remove();
  _activeScreenIdx = 0;

  const S = STEAMTOOLS_CONFIG.STEAM_IMG;

  const overlay = document.createElement('div');
  overlay.className = 'game-modal-overlay';
  overlay.innerHTML = `
  <div class="game-modal" id="gm-${appId}">
    <button class="modal-close" onclick="this.closest('.game-modal-overlay').remove()">✕</button>

    <!-- HERO BANNER -->
    <div class="modal-hero">
      <div class="modal-hero-bg" id="mhbg-${appId}"
        style="background-image:url('${S}/${appId}/library_hero.jpg')">
      </div>
      <div class="modal-hero-keyart">
        <img src="${S}/${appId}/library_600x900_2x.jpg" alt="${game.name}"
          onerror="this.src='${S}/${appId}/capsule_616x353.jpg';this.style.maxWidth='80%'">
      </div>
      <div class="modal-hero-gradient"></div>
      <div class="modal-hero-badges">
        <span class="modal-hero-badge badge-free">FREE IN VAULT</span>
        <span class="modal-hero-badge badge-new" id="mbadge-${appId}" style="display:none">VERIFIED</span>
      </div>
    </div>

    <!-- CONTENT -->
    <div class="modal-content">

      <!-- MAIN COLUMN -->
      <div class="modal-main">
        <div class="modal-title-row">
          <div>
            <div class="modal-title">${game.name}</div>
            <div class="modal-subtitle">${game.tag} &nbsp;·&nbsp; STEAM APP ID: ${appId}</div>
          </div>
        </div>

        <!-- TAGS - filled by Steam data -->
        <div class="modal-tags" id="mtags-${appId}">
          <span class="modal-tag modal-skeleton skel-block" style="width:60px;height:20px">&nbsp;</span>
          <span class="modal-tag modal-skeleton skel-block" style="width:80px;height:20px">&nbsp;</span>
        </div>

        <!-- REVIEW SCORE -->
        <div class="modal-review-row" id="mrev-${appId}">
          <div style="display:flex;flex-direction:column;align-items:center;gap:4px">
            <div class="review-score-big modal-skeleton skel-block" style="width:80px;height:48px;border-radius:8px">&nbsp;</div>
          </div>
          <div class="review-bar-wrap">
            <div class="review-label modal-skeleton skel-block" style="width:120px;height:14px;border-radius:4px;margin-bottom:6px">&nbsp;</div>
            <div class="review-bar-track"><div class="review-bar-fill" style="width:0%"></div></div>
            <div class="review-count" style="margin-top:6px">Loading reviews...</div>
          </div>
        </div>

        <!-- DESCRIPTION -->
        <div class="modal-section-title">About This Game</div>
        <div class="modal-desc-text" id="mdesc-${appId}">
          <div class="modal-skeleton skel-block" style="height:14px;margin-bottom:8px;border-radius:4px"></div>
          <div class="modal-skeleton skel-block" style="height:14px;margin-bottom:8px;width:90%;border-radius:4px"></div>
          <div class="modal-skeleton skel-block" style="height:14px;width:75%;border-radius:4px"></div>
        </div>

        <!-- MEDIA -->
        <div class="modal-section-title" style="margin-top:32px">Media</div>
        <div class="media-tabs">
          <div class="media-tab active" onclick="switchMediaTab(this,'screenshots','${appId}')">Screenshots</div>
          <div class="media-tab" onclick="switchMediaTab(this,'videos','${appId}')">Trailers</div>
        </div>
        <div id="media-screenshots-${appId}">
          <div class="modal-featured-screen" id="mfeat-${appId}" onclick="openLightbox(this.querySelector('img').src)">
            <img src="${S}/${appId}/ss_placeholder.jpg" id="mfeatimg-${appId}" alt="Screenshot">
          </div>
          <div class="screens-strip" id="mstrips-${appId}">
            <div class="modal-skeleton skel-block" style="width:140px;height:80px;border-radius:8px;flex-shrink:0"></div>
            <div class="modal-skeleton skel-block" style="width:140px;height:80px;border-radius:8px;flex-shrink:0"></div>
            <div class="modal-skeleton skel-block" style="width:140px;height:80px;border-radius:8px;flex-shrink:0"></div>
          </div>
        </div>
        <div id="media-videos-${appId}" style="display:none">
          <div id="mvideos-${appId}" style="display:flex;gap:12px;flex-wrap:wrap">
            <div style="color:var(--text-30);font-family:var(--font-mono);font-size:11px">Loading trailers...</div>
          </div>
        </div>

        <!-- SYSTEM REQUIREMENTS -->
        <div class="modal-section-title" style="margin-top:36px">System Requirements</div>
        <div class="sysreq-grid" id="msysreq-${appId}">
          <div class="sysreq-card">
            <div class="sysreq-label">Minimum</div>
            <div class="modal-skeleton skel-block" style="height:12px;margin-bottom:8px;border-radius:3px"></div>
            <div class="modal-skeleton skel-block" style="height:12px;margin-bottom:8px;width:85%;border-radius:3px"></div>
            <div class="modal-skeleton skel-block" style="height:12px;width:70%;border-radius:3px"></div>
          </div>
          <div class="sysreq-card">
            <div class="sysreq-label">Recommended</div>
            <div class="modal-skeleton skel-block" style="height:12px;margin-bottom:8px;border-radius:3px"></div>
            <div class="modal-skeleton skel-block" style="height:12px;margin-bottom:8px;width:85%;border-radius:3px"></div>
            <div class="modal-skeleton skel-block" style="height:12px;width:70%;border-radius:3px"></div>
          </div>
        </div>
      </div>

      <!-- SIDEBAR -->
      <div class="modal-sidebar-wrap">
        <!-- CTA BOX -->
        <div class="modal-cta-box">
          <div class="modal-cta-cover">
            <img src="${S}/${appId}/library_600x900_2x.jpg" alt="${game.name}"
              onerror="this.src='${S}/${appId}/capsule_231x87.jpg'">
          </div>
          <div class="modal-cta-body">
            <div class="modal-cta-price">FREE</div>
            <div class="modal-cta-price-sub">Available in the Vault</div>
            <button class="btn-get-game" id="dlbtn-${appId}" disabled>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              <span id="dlbtn-text-${appId}">Generating Link...</span>
            </button>
            <button class="btn-wishlist" onclick="showToast('Added to wishlist!','♡')">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
              </svg>
              Add to Wishlist
            </button>
          </div>
        </div>

        <!-- META INFO -->
        <div class="sidebar-meta-block" id="mmeta-${appId}">
          <div class="sidebar-meta-title">Game Info</div>
          <div class="modal-skeleton skel-block" style="height:36px;border-radius:6px;margin-bottom:8px"></div>
          <div class="modal-skeleton skel-block" style="height:36px;border-radius:6px;margin-bottom:8px"></div>
          <div class="modal-skeleton skel-block" style="height:36px;border-radius:6px"></div>
        </div>

        <!-- STEAM LINK -->
        <a href="https://store.steampowered.com/app/${appId}" target="_blank" class="sidebar-steam-link">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.21 11.39l3.12-5.4c-.4-.12-.77-.29-1.11-.52a4.15 4.15 0 01-1.64-5.38 4.15 4.15 0 013.69-2.28l3.26-5.65A12 12 0 0112 0zm4.09 18.14a4.15 4.15 0 01-5.53-5.54l-3.1 5.38A11.97 11.97 0 0012 24c2.58 0 4.97-.82 6.94-2.2l-2.85-3.66zm2.29-3.97l-3.24-5.61c1.38.47 2.48 1.47 3.07 2.79a4.13 4.13 0 01.17 2.82z"/>
          </svg>
          View on Steam Store
        </a>
      </div>
    </div>
  </div>`;

  document.body.appendChild(overlay);
  overlay.addEventListener('click', e => { if (e.target === overlay) overlay.remove(); });

  // Load main data in parallel (details + download link)
  const [details, dlUrl] = await Promise.all([
    fetchSteamDetails(appId),
    fetchGameGenLink(appId)
  ]);
  
  // Fetch reviews in background after modal opens
  fetchSteamReviews(appId).then(reviews => {
    if (reviews) {
      const revEl = document.getElementById(`mrev-${appId}`);
      if (revEl) {
        const total = reviews.total_reviews || 0;
        const pos   = reviews.total_positive || 0;
        const pct   = total > 0 ? Math.round((pos / total) * 100) : 0;
        let label = 'Overwhelmingly Positive', cls = '';
        if (pct < 40) { label = 'Mostly Negative'; cls = 'negative'; }
        else if (pct < 70) { label = 'Mixed'; cls = 'mixed'; }
        else if (pct < 80) { label = 'Mostly Positive'; }
        else if (pct < 95) { label = 'Very Positive'; }
        revEl.innerHTML = `
          <div style="display:flex;flex-direction:column;align-items:center;gap:4px;min-width:80px">
            <div class="review-score-big ${cls}">${pct}%</div>
          </div>
          <div class="review-bar-wrap">
            <div class="review-label ${cls}">${label}</div>
            <div class="review-count">${total.toLocaleString()} reviews</div>
            <div class="review-bar-track" style="margin-top:8px">
              <div class="review-bar-fill ${cls}" style="width:${pct}%"></div>
            </div>
          </div>`;
      }
    }
  });

  // ── Populate DETAILS ──
  if (details) {
    // Tags / genres
    const tagEl = document.getElementById(`mtags-${appId}`);
    if (tagEl) {
      const genres = (details.genres || []).map(g => g.description);
      const cats = (details.categories || []).map(c => c.description).slice(0, 3);
      const all = [...new Set([...genres, ...cats])].slice(0, 6);
      tagEl.innerHTML = all.map(t => `<span class="modal-tag">${t}</span>`).join('');
    }

    // Description
    const descEl = document.getElementById(`mdesc-${appId}`);
    if (descEl) {
      descEl.innerHTML = `<p>${details.short_description || details.detailed_description?.substring(0, 400) || 'No description available.'}</p>`;
    }

    // Screenshots
    const screens = details.screenshots || [];
    const featImg = document.getElementById(`mfeatimg-${appId}`);
    const stripEl = document.getElementById(`mstrips-${appId}`);
    if (screens.length && featImg) {
      featImg.src = screens[0].path_full || screens[0].path_thumbnail;
      featImg.onerror = () => { featImg.src = screens[0].path_thumbnail; };
    }
    if (screens.length && stripEl) {
      stripEl.innerHTML = screens.slice(0, 10).map((s, i) =>
        `<img src="${s.path_thumbnail}" class="screen-thumb ${i === 0 ? 'active-thumb' : ''}"
          onclick="setFeaturedScreen('${appId}', '${s.path_full}', this)"
          onerror="this.style.display='none'">`
      ).join('');
    }

    // Trailers/Videos
    const movies = details.movies || [];
    const videosEl = document.getElementById(`mvideos-${appId}`);
    if (videosEl && movies.length) {
      videosEl.innerHTML = movies.slice(0, 3).map(m => {
        const thumb = m.thumbnail || `${S}/${appId}/movie_max_846828492.webm`;
        const webm = m.webm?.['480'] || m.webm?.max || '';
        const mp4 = m.mp4?.['480'] || m.mp4?.max || '';
        return `<div style="flex:1;min-width:200px;border-radius:10px;overflow:hidden;border:1px solid rgba(255,255,255,0.08);cursor:pointer;position:relative"
          onclick="playModalVideo(this,'${webm || mp4}','${mp4}')">
          <img src="${thumb}" style="width:100%;height:140px;object-fit:cover;display:block"
            onerror="this.style.display='none'">
          <div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,0.4)">
            <div style="width:44px;height:44px;background:rgba(255,106,0,0.85);border-radius:50%;display:flex;align-items:center;justify-content:center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><polygon points="5 3 19 12 5 21 5 3"/></svg>
            </div>
          </div>
          <div style="padding:10px 12px;font-size:12px;color:var(--text-80);font-family:var(--font-ui)">${m.name || 'Official Trailer'}</div>
        </div>`;
      }).join('');
    } else if (videosEl) {
      videosEl.innerHTML = `<div style="color:var(--text-30);font-family:var(--font-mono);font-size:11px;padding:20px 0">No official trailers available.</div>`;
    }

    // System requirements
    const sysEl = document.getElementById(`msysreq-${appId}`);
    if (sysEl) {
      const pc = details.pc_requirements || {};
      const parseReqs = (html) => {
        if (!html) return [];
        const rows = [];
        const div = document.createElement('div'); div.innerHTML = html;
        const text = div.textContent;
        const lines = text.split('\n').filter(l => l.trim() && l.includes(':'));
        lines.forEach(l => {
          const idx = l.indexOf(':');
          if (idx > 0) rows.push({ k: l.slice(0, idx).trim(), v: l.slice(idx+1).trim() });
        });
        return rows.slice(0, 6);
      };
      const minRows = parseReqs(pc.minimum);
      const recRows = parseReqs(pc.recommended);
      const renderRows = (rows) => rows.length
        ? rows.map(r => `<div class="sysreq-row"><span class="sysreq-key">${r.k}</span><span class="sysreq-val">${r.v}</span></div>`).join('')
        : `<div class="sysreq-row"><span class="sysreq-val" style="color:var(--text-30)">Not specified</span></div>`;
      sysEl.innerHTML = `
        <div class="sysreq-card"><div class="sysreq-label">Minimum</div>${renderRows(minRows)}</div>
        <div class="sysreq-card"><div class="sysreq-label">Recommended</div>${renderRows(recRows)}</div>`;
    }

    // Sidebar meta
    const metaEl = document.getElementById(`mmeta-${appId}`);
    if (metaEl) {
      const devs = (details.developers || []).join(', ') || 'N/A';
      const pubs = (details.publishers || []).join(', ') || 'N/A';
      const relDate = details.release_date?.date || 'N/A';
      const plats = [
        details.platforms?.windows && 'Windows',
        details.platforms?.mac && 'macOS',
        details.platforms?.linux && 'Linux',
      ].filter(Boolean).join(', ') || 'Windows';
      const dlc = details.dlc?.length || 0;
      metaEl.innerHTML = `
        <div class="sidebar-meta-title">Game Info</div>
        <div class="sidebar-meta-row"><span class="sidebar-meta-key">Developer</span><span class="sidebar-meta-val">${devs}</span></div>
        <div class="sidebar-meta-row"><span class="sidebar-meta-key">Publisher</span><span class="sidebar-meta-val">${pubs}</span></div>
        <div class="sidebar-meta-row"><span class="sidebar-meta-key">Released</span><span class="sidebar-meta-val">${relDate}</span></div>
        <div class="sidebar-meta-row"><span class="sidebar-meta-key">Platforms</span><span class="sidebar-meta-val">${plats}</span></div>
        ${dlc ? `<div class="sidebar-meta-row"><span class="sidebar-meta-key">DLC</span><span class="sidebar-meta-val">${dlc} packs</span></div>` : ''}
        <div class="sidebar-meta-row"><span class="sidebar-meta-key">App ID</span><span class="sidebar-meta-val" style="font-family:var(--font-mono);font-size:11px">${appId}</span></div>`;
    }
  }



  // ── Download button ──
  const dlBtn  = document.getElementById(`dlbtn-${appId}`);
  const dlText = document.getElementById(`dlbtn-text-${appId}`);
  if (dlBtn && dlText) {
    if (dlUrl) {
      dlBtn.disabled = false;
      dlText.textContent = 'Get Game';
      dlBtn.onclick = () => { window.open(dlUrl, '_blank'); showToast('Opening manifest link...', '📁'); };
      // Show verified badge
      const badge = document.getElementById(`mbadge-${appId}`);
      if (badge) badge.style.display = '';
    } else {
      dlText.textContent = 'Not Available Yet';
      dlBtn.style.opacity = '0.35';
    }
  }
}

/* ── MODAL HELPERS ─────────────────────────────── */
function setFeaturedScreen(appId, fullSrc, thumbEl) {
  const featImg = document.getElementById(`mfeatimg-${appId}`);
  if (featImg) {
    featImg.style.opacity = '0';
    featImg.src = fullSrc;
    featImg.onload = () => { featImg.style.transition = 'opacity 0.3s'; featImg.style.opacity = '1'; };
  }
  document.querySelectorAll(`#mstrips-${appId} .screen-thumb`).forEach(t => t.classList.remove('active-thumb'));
  thumbEl?.classList.add('active-thumb');
}

function switchMediaTab(tabEl, type, appId) {
  tabEl.closest('.media-tabs').querySelectorAll('.media-tab').forEach(t => t.classList.remove('active'));
  tabEl.classList.add('active');
  const ssEl = document.getElementById(`media-screenshots-${appId}`);
  const vidEl = document.getElementById(`media-videos-${appId}`);
  if (ssEl) ssEl.style.display = type === 'screenshots' ? '' : 'none';
  if (vidEl) vidEl.style.display = type === 'videos' ? '' : 'none';
}

function playModalVideo(container, webm, mp4) {
  container.innerHTML = `<video autoplay controls style="width:100%;display:block;border-radius:10px">
    ${webm ? `<source src="${webm}" type="video/webm">` : ''}
    ${mp4  ? `<source src="${mp4}"  type="video/mp4">` : ''}
    Your browser doesn't support HTML5 video.
  </video>`;
}

function openLightbox(src) {
  const lb = document.createElement('div');
  lb.style.cssText = 'position:fixed;inset:0;z-index:9999;background:rgba(0,0,0,0.96);display:flex;align-items:center;justify-content:center;cursor:zoom-out;animation:modalOverlayIn 0.2s ease forwards';
  lb.innerHTML = `<img src="${src}" style="max-width:92vw;max-height:92vh;border-radius:12px;box-shadow:0 40px 100px rgba(0,0,0,0.9)">`;
  lb.onclick = () => lb.remove();
  document.body.appendChild(lb);
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
        setTimeout(() => { window.location.href = href; }, 460);
      } else window.location.href = href;
    });
  });
}

/* ── SCROLL REVEAL ─────────────────────────────── */
function initReveal() {
  const ro = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); ro.unobserve(e.target); } });
  }, { threshold: 0, rootMargin: '0px 0px -8% 0px' });
  document.querySelectorAll('.reveal').forEach(el => ro.observe(el));
}

/* ── NAV ───────────────────────────────────────── */
function initNav() {
  window.addEventListener('scroll', () => {
    document.querySelector('nav')?.classList.toggle('scrolled', window.scrollY > 40);
  });
}

/* ── LOADER — CINEMATIC ────────────────────────── */
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
        <div class="loader-logo-wrap" style="position:absolute">
          <img src="icon.png" class="loader-brand-img" alt="Logo" onerror="this.style.display='none'" style="width:48px;height:48px;border-radius:0;object-fit:contain">
        </div>
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

  const canvas = loader.querySelector('#loader-canvas');
  const ctx = canvas.getContext('2d');
  let W, H, particles = [], animId;
  function resize() { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }
  resize(); window.addEventListener('resize', resize);
  for (let i = 0; i < 80; i++) {
    particles.push({ x: Math.random()*1920, y: Math.random()*1080, vx: (Math.random()-.5)*.5, vy: (Math.random()-.5)*.5,
      r: Math.random()*1.4+.3, hue: Math.random()>.6?20:Math.random()>.5?345:195, alpha: Math.random()*.5+.1, pulse: Math.random()*Math.PI*2 });
  }
  function drawLoader(ts) {
    ctx.clearRect(0,0,W,H);
    for (let i=0;i<particles.length;i++) {
      for (let j=i+1;j<particles.length;j++) {
        const dx=particles[i].x-particles[j].x, dy=particles[i].y-particles[j].y, d=Math.sqrt(dx*dx+dy*dy);
        if (d<120) { ctx.beginPath(); ctx.moveTo(particles[i].x,particles[i].y); ctx.lineTo(particles[j].x,particles[j].y); ctx.strokeStyle=`rgba(255,106,0,${(1-d/120)*.07})`; ctx.lineWidth=.5; ctx.stroke(); }
      }
    }
    particles.forEach(p => {
      p.x+=p.vx; p.y+=p.vy; p.pulse+=.02;
      if(p.x<0)p.x=W; if(p.x>W)p.x=0; if(p.y<0)p.y=H; if(p.y>H)p.y=0;
      const a=p.alpha*(.7+.3*Math.sin(p.pulse));
      ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2); ctx.fillStyle=`hsla(${p.hue},100%,65%,${a})`; ctx.fill();
    });
    animId = requestAnimationFrame(drawLoader);
  }
  animId = requestAnimationFrame(drawLoader);
  const pctEl = loader.querySelector('#loader-pct');
  let pct = 0;
  const pctTimer = setInterval(() => {
    pct = Math.min(100, pct + Math.floor(Math.random()*18)+6);
    if (pctEl) pctEl.textContent = pct + '%';
    if (pct >= 100) clearInterval(pctTimer);
  }, 160);
  setTimeout(() => { cancelAnimationFrame(animId); loader.classList.add('fade-out'); setTimeout(() => loader.remove(), 800); }, 1800);
}

/* ── DOODLE CANVAS ──────────────────────────────── */
function initDoodleCanvas() {
  const canvas = document.getElementById('doodle-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  function resize() { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; }
  resize(); window.addEventListener('resize', resize);
  const lines = Array.from({length:14}, () => ({
    x: Math.random()*canvas.width, y: Math.random()*canvas.height,
    vx: (Math.random()-.5)*.7, vy: (Math.random()-.5)*.7,
    len: 40+Math.random()*110, angle: Math.random()*Math.PI*2, av: (Math.random()-.5)*.014,
    hue: Math.random()>.5?'#ff6a00':'#ff3d6e', phase: Math.random()*Math.PI*2
  }));
  const circles = Array.from({length:9}, () => ({
    x: Math.random()*canvas.width, y: Math.random()*canvas.height,
    r: 18+Math.random()*60, vx: (Math.random()-.5)*.45, vy: (Math.random()-.5)*.45,
    phase: Math.random()*Math.PI*2, cyan: Math.random()>.55
  }));
  let t = 0;
  function draw() {
    ctx.clearRect(0,0,canvas.width,canvas.height); t+=.012;
    lines.forEach(l => {
      l.x+=l.vx; l.y+=l.vy; l.angle+=l.av;
      if(l.x<0||l.x>canvas.width)l.vx*=-1; if(l.y<0||l.y>canvas.height)l.vy*=-1;
      ctx.save(); ctx.translate(l.x,l.y); ctx.rotate(l.angle);
      ctx.strokeStyle=l.hue; ctx.lineWidth=1.5; ctx.globalAlpha=.45+.3*Math.sin(t+l.phase);
      ctx.beginPath(); ctx.moveTo(-l.len/2,0); ctx.lineTo(l.len/2,0); ctx.stroke();
      ctx.lineWidth=1; ctx.globalAlpha=.3;
      ctx.beginPath(); ctx.moveTo(-l.len/2,-5); ctx.lineTo(-l.len/2,5); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(l.len/2,-5); ctx.lineTo(l.len/2,5); ctx.stroke();
      ctx.restore();
    });
    circles.forEach(c => {
      c.x+=c.vx; c.y+=c.vy;
      if(c.x<-c.r||c.x>canvas.width+c.r)c.vx*=-1; if(c.y<-c.r||c.y>canvas.height+c.r)c.vy*=-1;
      ctx.save(); ctx.strokeStyle=c.cyan?'#00f0ff':'#ff6a00'; ctx.lineWidth=1; ctx.globalAlpha=.28+.18*Math.sin(t*.7+c.phase);
      ctx.beginPath(); ctx.arc(c.x,c.y,c.r*(.88+.12*Math.sin(t+c.phase)),0,Math.PI*2); ctx.stroke(); ctx.restore();
    });
    for(let i=0;i<6;i++) {
      const x=(canvas.width*(i+.5))/6+28*Math.sin(t*.35+i), y=canvas.height*.5+38*Math.cos(t*.28+i*1.2);
      ctx.save(); ctx.strokeStyle='#ff6a00'; ctx.lineWidth=1.5; ctx.globalAlpha=.22; ctx.translate(x,y); ctx.rotate(t*.18+i);
      ctx.beginPath(); ctx.moveTo(-8,0); ctx.lineTo(8,0); ctx.moveTo(0,-8); ctx.lineTo(0,8); ctx.stroke(); ctx.restore();
    }
    requestAnimationFrame(draw);
  }
  draw();
}

/* ── DOODLE PREVIEWS ────────────────────────────── */
function initDoodlePreviews() {
  const d1el = document.getElementById('doodle-1');
  if (d1el) {
    const c = makeCanvas(d1el); let t=0;
    function draw() {
      c.width=d1el.offsetWidth||260; c.height=d1el.offsetHeight||180;
      const ctx=c.getContext('2d'), cx=c.width/2, cy=c.height/2;
      ctx.clearRect(0,0,c.width,c.height);
      for(let i=0;i<10;i++){
        const a=(i/10)*Math.PI*2+t, r=30+16*Math.sin(t*2+i*.7);
        ctx.beginPath(); ctx.arc(cx+r*Math.cos(a),cy+r*Math.sin(a),3.5,0,Math.PI*2);
        ctx.fillStyle=`hsl(${16+i*14},100%,60%)`; ctx.globalAlpha=.85; ctx.fill();
      }
      ctx.globalAlpha=.12; ctx.strokeStyle='#ff6a00'; ctx.lineWidth=1;
      for(let i=0;i<10;i++){
        const a=(i/10)*Math.PI*2+t, r=30+16*Math.sin(t*2+i*.7), nx=cx+r*Math.cos(a), ny=cy+r*Math.sin(a);
        const b=((i+1)%10/10)*Math.PI*2+t, rn=30+16*Math.sin(t*2+(i+1)*.7);
        ctx.beginPath(); ctx.moveTo(nx,ny); ctx.lineTo(cx+rn*Math.cos(b),cy+rn*Math.sin(b)); ctx.stroke();
      }
      const g=ctx.createRadialGradient(cx,cy,0,cx,cy,44);
      g.addColorStop(0,'rgba(255,106,0,0.55)'); g.addColorStop(1,'rgba(255,106,0,0)');
      ctx.beginPath(); ctx.arc(cx,cy,44,0,Math.PI*2); ctx.fillStyle=g; ctx.globalAlpha=.45+.3*Math.sin(t); ctx.fill();
      t+=.04; requestAnimationFrame(draw);
    } draw();
  }
  const d2el = document.getElementById('doodle-2');
  if (d2el) {
    const c = makeCanvas(d2el); let t=0;
    function draw() {
      c.width=d2el.offsetWidth||260; c.height=d2el.offsetHeight||180;
      const ctx=c.getContext('2d'); ctx.clearRect(0,0,c.width,c.height);
      for(let i=0;i<6;i++){
        const y=c.height/2+(i-2.5)*22;
        ctx.beginPath(); ctx.moveTo(0,y);
        for(let x=0;x<=c.width;x+=3) ctx.lineTo(x, y+Math.sin(x*.038+(t+i*.5))*16*Math.abs(Math.sin(t*.4+i*.4)));
        ctx.strokeStyle=`hsl(${350+i*18},100%,62%)`; ctx.lineWidth=1.8; ctx.globalAlpha=.65-i*.07; ctx.stroke();
      }
      t+=.045; requestAnimationFrame(draw);
    } draw();
  }
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
          const angle=(i/32)*Math.PI*2+t+s*2.09, r=6+i*.3;
          const x=cx+r*Math.cos(angle), y=cy+r*Math.sin(angle);
          i===0?ctx.moveTo(x,y):ctx.lineTo(x,y);
        }
        ctx.strokeStyle=s===0?'#ff6a00':s===1?'#ff3d6e':'#00f0ff'; ctx.lineWidth=1.2; ctx.globalAlpha=.6; ctx.stroke();
      }
      t+=.016; requestAnimationFrame(draw);
    } draw();
  }
}

function makeCanvas(container) {
  const c = document.createElement('canvas');
  c.style.cssText='position:absolute;inset:0;width:100%;height:100%';
  container.appendChild(c); return c;
}

/* ── STAT COUNTER ────────────────────────────────── */
function initCounters() {
  document.querySelectorAll('.desc-stat-num[data-count]').forEach(el => {
    const target = parseInt(el.dataset.count);
    if (!target || isNaN(target)) return;
    const suffix = el.textContent.replace(/[\d,]/g,'').trim();
    let started = false;
    const ro = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && !started) {
        started = true;
        let cur = 0; const step = Math.max(1, Math.ceil(target/80));
        const iv = setInterval(() => {
          cur = Math.min(cur+step, target);
          el.textContent = cur.toLocaleString()+suffix;
          if (cur >= target) clearInterval(iv);
        }, 16);
        ro.unobserve(el);
      }
    });
    ro.observe(el);
  });
}

/* ── TOAST ───────────────────────────────────────── */
function showToast(msg, icon='✓') {
  const t = document.createElement('div');
  t.className = 'st-toast';
  t.innerHTML = `<span class="t-icon">${icon}</span>${msg}`;
  document.body.appendChild(t);
  setTimeout(() => { t.classList.add('hide'); setTimeout(()=>t.remove(),300); }, 2800);
}

/* ── DOODLE EMPIRE ───────────────────────────────── */
function initDoodleEmpire() {
  const section = document.getElementById('doodle-empire');
  const doodleWrap = document.getElementById('empire-doodles');
  const canvas = document.getElementById('empire-canvas');
  if (!section || !doodleWrap || !canvas) return;
  const ctx = canvas.getContext('2d'); let W, H;
  function resize() { W = canvas.width = section.offsetWidth; H = canvas.height = section.offsetHeight; }
  resize(); window.addEventListener('resize', resize);
  const lines = Array.from({length:18}, () => ({ x:Math.random()*1600, y:Math.random()*500, vx:(Math.random()-.5)*.55, vy:(Math.random()-.5)*.55, len:50+Math.random()*120, angle:Math.random()*Math.PI*2, av:(Math.random()-.5)*.013, col:Math.random()>.5?'rgba(255,106,0,':'rgba(255,61,110,', alpha:.06+Math.random()*.1 }));
  const circles = Array.from({length:11}, () => ({ x:Math.random()*1600, y:Math.random()*500, r:22+Math.random()*70, vx:(Math.random()-.5)*.4, vy:(Math.random()-.5)*.4, phase:Math.random()*Math.PI*2, col:Math.random()>.6?'rgba(255,106,0,':'rgba(0,212,255,' }));
  let t = 0;
  function drawBg() {
    ctx.clearRect(0,0,W,H); t+=.012;
    lines.forEach(l => {
      l.x+=l.vx; l.y+=l.vy; l.angle+=l.av;
      if(l.x<-150)l.x=W+50; if(l.x>W+150)l.x=-50; if(l.y<-80)l.y=H+40; if(l.y>H+80)l.y=-40;
      const a=l.alpha*(.6+.4*Math.sin(t+(l.phase||0)));
      ctx.beginPath(); ctx.moveTo(l.x,l.y); ctx.lineTo(l.x+Math.cos(l.angle)*l.len, l.y+Math.sin(l.angle)*l.len);
      ctx.strokeStyle=l.col+a+')'; ctx.lineWidth=1; ctx.stroke();
    });
    circles.forEach(c => {
      c.x+=c.vx; c.y+=c.vy; c.phase+=.018;
      if(c.x<-100)c.x=W+60; if(c.x>W+100)c.x=-60; if(c.y<-100)c.y=H+60; if(c.y>H+100)c.y=-60;
      const a=.04+.04*Math.sin(c.phase);
      ctx.beginPath(); ctx.arc(c.x,c.y,c.r,0,Math.PI*2); ctx.strokeStyle=c.col+a+')'; ctx.lineWidth=1; ctx.stroke();
    });
    requestAnimationFrame(drawBg);
  }
  drawBg();
  const DOODLES = [
    ['<circle cx="22" cy="22" r="20" stroke="#ff6a00" stroke-width="1.5" stroke-dasharray="6 4" fill="none"/><line x1="22" y1="2" x2="22" y2="42" stroke="#ff6a00" stroke-width="0.8"/><line x1="2" y1="22" x2="42" y2="22" stroke="#ff6a00" stroke-width="0.8"/>', 44,44,0,.009],
    ['<rect x="4" y="4" width="40" height="40" rx="4" stroke="#ff3d6e" stroke-width="1.5" stroke-dasharray="8 4" fill="none"/><rect x="12" y="12" width="24" height="24" rx="2" stroke="#ff3d6e" stroke-width="1" fill="none"/>', 48,48,1.2,.004],
    ['<polygon points="24,4 44,40 4,40" stroke="#fff" stroke-width="1.5" stroke-dasharray="5 3" fill="none"/><circle cx="24" cy="30" r="6" stroke="#ff6a00" stroke-width="1.2" fill="none"/>', 48,48,2.4,-.007],
    ['<path d="M24 4 L44 24 L24 44 L4 24 Z" stroke="#00d4ff" stroke-width="1.5" stroke-dasharray="6 3" fill="none"/><circle cx="24" cy="24" r="8" stroke="#00d4ff" stroke-width="1" fill="none"/>', 48,48,3.7,.006],
    ['<circle cx="22" cy="22" r="20" stroke="#ff6a00" stroke-width="1" stroke-dasharray="3 3" fill="none"/><circle cx="22" cy="22" r="12" stroke="#ff3d6e" stroke-width="1.2" fill="none"/><circle cx="22" cy="22" r="4" stroke="#fff" stroke-width="1" fill="none"/>', 44,44,.8,-.005],
  ];
  const empEls = DOODLES.map((d) => {
    const div = document.createElement('div'); div.className='emp-doodle';
    const [markup,w,h,startAngle,speed] = d;
    div.innerHTML = `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" fill="none">${markup}</svg>`;
    const spreadX = section.offsetWidth*.38, spreadY = section.offsetHeight*.38;
    div._orbitRx = spreadX*(.7+Math.random()*.6); div._orbitRy = spreadY*(.5+Math.random()*.5);
    div._angle = startAngle; div._speed = speed || (Math.random()-.5)*.008;
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

/* ── INIT ────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initLoader();
  initPageTransitions();
  initReveal();
  initNav();
  if (document.getElementById('doodle-canvas')) initDoodleCanvas();
  initDoodleEmpire();
  if (document.getElementById('doodle-1')) setTimeout(initDoodlePreviews, 80);
  // Run counters first with catalog count, then fetch live data
  initCounters();
  initLiveStats();
  if (!document.querySelector('.bg-overlay')) {
    const o = document.createElement('div'); o.className='bg-overlay'; document.body.prepend(o);
  }
});

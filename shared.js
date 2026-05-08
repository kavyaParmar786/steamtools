/**
 * STEAMTOOLS — WebGL Scene
 * Concept: DEEP SEA SONAR — crystalline coral structures + sonar pulses
 * Straw Hat palette: deep ocean black, warm gold, steel blue, crimson
 */

function initWebGL() {
  const canvas = document.getElementById('webgl-bg');
  if (!canvas) return;
  const gl = canvas.getContext('webgl', { alpha: false, antialias: true })
           || canvas.getContext('experimental-webgl');
  if (!gl) { canvas.style.display = 'none'; return; }

  let W, H;
  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
    gl.viewport(0, 0, W, H);
  }
  resize();
  window.addEventListener('resize', resize);

  /* ─── COMPILE HELPERS ─────────────────────────────── */
  function sh(type, src) {
    const s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    return s;
  }
  function prog(vs, fs) {
    const p = gl.createProgram();
    gl.attachShader(p, sh(gl.VERTEX_SHADER, vs));
    gl.attachShader(p, sh(gl.FRAGMENT_SHADER, fs));
    gl.linkProgram(p);
    return p;
  }

  /* ══════════════════════════════════════════════════════
     PROGRAM 1 — BACKGROUND: deep ocean gradient + sonar
  ══════════════════════════════════════════════════════ */
  const bgProg = prog(`
    attribute vec2 a_pos;
    varying vec2 v_uv;
    void main(){ v_uv = a_pos*.5+.5; gl_Position=vec4(a_pos,0,1); }
  `, `
    precision highp float;
    varying vec2 v_uv;
    uniform float u_t;
    uniform vec2 u_mouse;
    uniform vec2 u_res;
    uniform vec2 u_sonar[6];
    uniform float u_sonarAge[6];

    void main(){
      vec2 uv = v_uv;
      vec2 p  = uv * u_res;

      /* deep ocean base: nearly black at top, very dark navy at bottom */
      vec3 top    = vec3(0.010, 0.012, 0.022);
      vec3 bottom = vec3(0.018, 0.026, 0.050);
      vec3 col = mix(top, bottom, uv.y);

      /* subtle horizontal depth bands — like bioluminescent layers */
      float band = sin(uv.y * 18.0 + u_t * 0.15) * 0.5 + 0.5;
      col += vec3(0.02, 0.04, 0.06) * band * band * 0.18;

      /* sonar rings — 6 independent pulses */
      for(int i = 0; i < 6; i++){
        vec2 src = u_sonar[i];
        float age = u_sonarAge[i];            /* 0..1 */
        float d   = length(p - src);
        float maxR = min(u_res.x, u_res.y) * 0.82;
        float r   = age * maxR;
        float ring = 1.0 - abs(d - r) / 4.0;
        ring = max(0.0, ring);
        float fade = (1.0 - age) * (1.0 - age);

        /* gold primary ring */
        vec3 goldCol  = vec3(0.91, 0.72, 0.29);
        vec3 blueCol  = vec3(0.36, 0.56, 0.73);
        vec3 ringCol  = mix(goldCol, blueCol, float(i) / 5.0);
        col += ringCol * ring * fade * 0.22;

        /* soft interior fill */
        float fill = smoothstep(r + 12.0, r - 60.0, d) * smoothstep(0.0, 80.0, d);
        col += ringCol * fill * fade * 0.025;
      }

      /* mouse proximity warm glow */
      float md = length(p - u_mouse) / u_res.x;
      col += vec3(0.91, 0.72, 0.29) * smoothstep(0.35, 0.0, md) * 0.06;

      /* vignette */
      float v = uv.x * uv.y * (1.0-uv.x) * (1.0-uv.y);
      col *= smoothstep(0.0, 0.14, v * 14.0);

      gl_FragColor = vec4(col, 1.0);
    }
  `);

  const bgQuad = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, bgQuad);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1,1,-1,1,1,-1,1]), gl.STATIC_DRAW);
  gl.useProgram(bgProg);
  const bg_aPos      = gl.getAttribLocation(bgProg,  'a_pos');
  const bg_uT        = gl.getUniformLocation(bgProg,  'u_t');
  const bg_uMouse    = gl.getUniformLocation(bgProg,  'u_mouse');
  const bg_uRes      = gl.getUniformLocation(bgProg,  'u_res');
  const bg_uSonar    = [];
  const bg_uSonarAge = [];
  for(let i=0;i<6;i++){
    bg_uSonar.push(gl.getUniformLocation(bgProg, `u_sonar[${i}]`));
    bg_uSonarAge.push(gl.getUniformLocation(bgProg, `u_sonarAge[${i}]`));
  }

  /* ══════════════════════════════════════════════════════
     PROGRAM 2 — CRYSTAL LINES (geometry shader via CPU)
  ══════════════════════════════════════════════════════ */
  const lineProg = prog(`
    attribute vec2 a_pos;
    attribute float a_alpha;
    uniform vec2 u_res;
    varying float v_a;
    void main(){
      vec2 clip = (a_pos/u_res)*2.0-1.0; clip.y=-clip.y;
      gl_Position=vec4(clip,0,1); v_a=a_alpha;
    }
  `, `
    precision mediump float;
    uniform vec4 u_col;
    varying float v_a;
    void main(){ gl_FragColor=vec4(u_col.rgb, u_col.a*v_a); }
  `);
  const line_aPos   = gl.getAttribLocation(lineProg,  'a_pos');
  const line_aAlpha = gl.getAttribLocation(lineProg,  'a_alpha');
  const line_uRes   = gl.getUniformLocation(lineProg, 'u_res');
  const line_uCol   = gl.getUniformLocation(lineProg, 'u_col');
  const linePosBuf  = gl.createBuffer();
  const lineAlpBuf  = gl.createBuffer();

  /* ══════════════════════════════════════════════════════
     PROGRAM 3 — PARTICLES (sonar-lit glowing orbs)
  ══════════════════════════════════════════════════════ */
  const ptProg = prog(`
    attribute vec2 a_pos;
    attribute float a_size;
    attribute float a_base;
    uniform vec2 u_res;
    uniform float u_t;
    uniform vec2 u_sonar[6];
    uniform float u_sonarAge[6];
    varying float v_bright;
    varying float v_base;
    void main(){
      vec2 clip = (a_pos/u_res)*2.0-1.0; clip.y=-clip.y;
      gl_Position=vec4(clip,0,1);
      float maxR = min(u_res.x, u_res.y)*0.82;
      float lit=0.0;
      for(int i=0;i<6;i++){
        float age=u_sonarAge[i];
        float r=age*maxR;
        float d=length(a_pos - u_sonar[i]);
        float ring=1.0-abs(d-r)/28.0;
        lit+=max(0.0,ring)*(1.0-age)*(1.0-age)*2.2;
      }
      float pulse = 1.0 + 0.3*sin(u_t*2.2 + a_base*6.28);
      gl_PointSize = a_size * (1.0 + lit*1.8) * pulse;
      v_bright = lit;
      v_base   = a_base;
    }
  `, `
    precision mediump float;
    varying float v_bright;
    varying float v_base;
    void main(){
      vec2 c=gl_PointCoord-.5; float r=length(c);
      if(r>.5) discard;
      float glow = 1.0-smoothstep(0.0,.5,r);
      float core = 1.0-smoothstep(0.0,.18,r);
      /* base dim steel blue, lit up to gold */
      vec3 dimCol  = vec3(0.18, 0.28, 0.42);
      vec3 goldCol = vec3(0.98, 0.82, 0.38);
      vec3 blueCol = vec3(0.50, 0.72, 0.92);
      vec3 litCol  = mix(blueCol, goldCol, v_bright);
      vec3 col     = mix(dimCol, litCol, min(1.0, v_bright));
      float alpha  = (glow*0.25 + core*0.6) * (0.18 + v_bright*0.9);
      gl_FragColor = vec4(col, clamp(alpha,0.0,1.0));
    }
  `);
  const pt_aPos      = gl.getAttribLocation(ptProg, 'a_pos');
  const pt_aSize     = gl.getAttribLocation(ptProg, 'a_size');
  const pt_aBase     = gl.getAttribLocation(ptProg, 'a_base');
  const pt_uRes      = gl.getUniformLocation(ptProg, 'u_res');
  const pt_uT        = gl.getUniformLocation(ptProg, 'u_t');
  const pt_uSonar    = [];
  const pt_uSonarAge = [];
  for(let i=0;i<6;i++){
    pt_uSonar.push(gl.getUniformLocation(ptProg, `u_sonar[${i}]`));
    pt_uSonarAge.push(gl.getUniformLocation(ptProg, `u_sonarAge[${i}]`));
  }
  const ptPosBuf  = gl.createBuffer();
  const ptSizBuf  = gl.createBuffer();
  const ptBasBuf  = gl.createBuffer();

  /* ─── PARTICLE DATA ───────────────────────────────── */
  const PT = 220;
  const ptPos  = new Float32Array(PT*2);
  const ptSize = new Float32Array(PT);
  const ptBase = new Float32Array(PT);
  const ptVel  = new Float32Array(PT*2);
  for(let i=0;i<PT;i++){
    ptPos[i*2]   = Math.random() * 1920;
    ptPos[i*2+1] = Math.random() * 1080;
    const sp = 0.05 + Math.random() * 0.12;
    const an = Math.random() * Math.PI * 2;
    ptVel[i*2]   = Math.cos(an)*sp;
    ptVel[i*2+1] = Math.sin(an)*sp;
    const t = Math.random();
    ptSize[i] = t<0.6 ? 1.2+Math.random()*1.5 : t<0.88 ? 3+Math.random()*2.5 : 5+Math.random()*4;
    ptBase[i]  = Math.random();
  }

  /* ─── CRYSTAL STRUCTURES (static geometry) ───────── */
  /* Each crystal: a vertical spine + radiating facets — built on canvas resize */
  let crystalVerts = [], crystalAlphas = [], crystalColors = [];
  function buildCrystals() {
    crystalVerts  = [];
    crystalAlphas = [];
    crystalColors = [];

    /* palette: gold, steel-blue, crimson */
    const palettes = [
      [0.91,0.72,0.29],  /* gold */
      [0.36,0.56,0.73],  /* steel */
      [0.72,0.30,0.30],  /* crimson */
      [0.55,0.68,0.80],  /* ice blue */
      [0.80,0.62,0.22],  /* amber */
    ];

    /* Spawn ~18 crystal clusters along the bottom half */
    const N = 18;
    for(let i=0;i<N;i++){
      const cx = (i/(N-1)) * W * 1.05 - W*0.025;
      const cy = H * (0.58 + Math.random()*0.38);
      const col = palettes[Math.floor(Math.random()*palettes.length)];
      const arms = 3 + Math.floor(Math.random()*4);  /* 3–6 arms */
      const baseH = 40 + Math.random()*130;           /* height */
      const spread = 0.18 + Math.random()*0.32;       /* angle spread */

      for(let a=0;a<arms;a++){
        const angle = -Math.PI/2 + (a/(arms-1) - 0.5) * Math.PI * spread;
        const len   = baseH * (0.5 + Math.random()*0.7);
        const width = 1.5 + Math.random()*2.5;
        const tipX  = cx + Math.cos(angle)*len;
        const tipY  = cy + Math.sin(angle)*len;

        /* thin line from base to tip */
        const dx = tipX-cx, dy = tipY-cy;
        const nx = -dy/len * width * 0.5;
        const ny =  dx/len * width * 0.5;

        /* quad for the arm */
        crystalVerts.push(
          cx+nx, cy+ny,  cx-nx, cy-ny,  tipX, tipY,
          cx+nx, cy+ny,  tipX, tipY,  cx-nx, cy-ny
        );
        crystalAlphas.push(0.6,0.6,0.05, 0.6,0.05,0.6);
        for(let v=0;v<6;v++) crystalColors.push(...col);

        /* secondary facet branches on taller arms */
        if(len > 60 && Math.random() > 0.4){
          const bpos = 0.35 + Math.random()*0.35;
          const bx = cx + dx*bpos, by = cy + dy*bpos;
          const bLen = len * (0.2 + Math.random()*0.28);
          const bAngle = angle + (Math.random()>0.5?1:-1)*(0.3+Math.random()*0.5);
          const btx = bx + Math.cos(bAngle)*bLen;
          const bty = by + Math.sin(bAngle)*bLen;
          const bl  = Math.hypot(btx-bx, bty-by);
          const bnx = -(bty-by)/bl*0.8;
          const bny =  (btx-bx)/bl*0.8;
          crystalVerts.push(
            bx+bnx, by+bny,  bx-bnx, by-bny,  btx, bty,
            bx+bnx, by+bny,  btx, bty,  bx-bnx, by-bny
          );
          crystalAlphas.push(0.4,0.4,0.02, 0.4,0.02,0.4);
          for(let v=0;v<6;v++) crystalColors.push(...col);
        }
      }

      /* central spike */
      const spikeH = baseH * 1.1;
      const sw = 2.5;
      const sx = cx, sy = cy - spikeH;
      crystalVerts.push(cx-sw,cy, cx+sw,cy, sx,sy, cx-sw,cy, sx,sy, cx+sw,cy);
      crystalAlphas.push(0.7,0.7,0.0, 0.7,0.0,0.7);
      for(let v=0;v<6;v++) crystalColors.push(...col);
    }
  }
  buildCrystals();
  window.addEventListener('resize', buildCrystals);

  /* ─── SONAR STATE ─────────────────────────────────── */
  /* 6 sonar pulses, staggered timings */
  const SONAR_INTERVAL = 2200; /* ms between births */
  const SONAR_DUR      = 3200; /* ms lifetime */
  const sonars = Array.from({length:6}, (_,i)=>({
    x: 0, y: 0, born: -i * SONAR_INTERVAL * 0.8
  }));
  /* Spawn positions: evenly spread, then drift slightly */
  function pickSonarPos(idx) {
    const cols = [0.12, 0.30, 0.50, 0.68, 0.85];
    const c = cols[idx % cols.length];
    return {
      x: W * (c + (Math.random()-0.5)*0.08),
      y: H * (0.30 + Math.random()*0.35)
    };
  }

  /* ─── CRYSTAL LINE GPU BUFFERS ────────────────────── */
  const crLinePosBuf = gl.createBuffer();
  const crLineAlpBuf = gl.createBuffer();
  const crLineColBuf = gl.createBuffer();

  /* crystal line prog with per-vertex color */
  const crLineProg = prog(`
    attribute vec2  a_pos;
    attribute float a_alpha;
    attribute vec3  a_col;
    uniform vec2 u_res;
    uniform float u_t;
    uniform vec2  u_sonar[6];
    uniform float u_sonarAge[6];
    varying float v_a;
    varying vec3  v_col;
    void main(){
      vec2 clip = (a_pos/u_res)*2.0-1.0; clip.y=-clip.y;
      gl_Position=vec4(clip,0,1);
      float maxR=min(u_res.x,u_res.y)*0.82;
      float lit=0.0;
      for(int i=0;i<6;i++){
        float r=u_sonarAge[i]*maxR;
        float d=length(a_pos-u_sonar[i]);
        float ring=1.0-abs(d-r)/38.0;
        lit+=max(0.0,ring)*(1.0-u_sonarAge[i])*(1.0-u_sonarAge[i])*2.5;
      }
      v_a   = a_alpha * (0.12 + lit*1.4);
      v_col = a_col;
    }
  `, `
    precision mediump float;
    varying float v_a;
    varying vec3  v_col;
    void main(){ gl_FragColor=vec4(v_col, clamp(v_a,0.0,1.0)); }
  `);
  const cr_aPos      = gl.getAttribLocation(crLineProg,  'a_pos');
  const cr_aAlpha    = gl.getAttribLocation(crLineProg,  'a_alpha');
  const cr_aCol      = gl.getAttribLocation(crLineProg,  'a_col');
  const cr_uRes      = gl.getUniformLocation(crLineProg, 'u_res');
  const cr_uT        = gl.getUniformLocation(crLineProg, 'u_t');
  const cr_uSonar    = [];
  const cr_uSonarAge = [];
  for(let i=0;i<6;i++){
    cr_uSonar.push(gl.getUniformLocation(crLineProg, `u_sonar[${i}]`));
    cr_uSonarAge.push(gl.getUniformLocation(crLineProg, `u_sonarAge[${i}]`));
  }

  /* ─── MOUSE ───────────────────────────────────────── */
  let mouse = { x: 0, y: 0 };
  document.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });

  /* ─── MAIN LOOP ───────────────────────────────────── */
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

  let start = null;
  function draw(ts) {
    if(!start) start = ts;
    const T = (ts - start) * 0.001;
    const now = ts;
    W = canvas.width; H = canvas.height;

    /* update sonar pulse ages */
    const sonarX   = new Float32Array(6);
    const sonarY   = new Float32Array(6);
    const sonarAge = new Float32Array(6);
    for(let i=0;i<6;i++){
      let age = (now - sonars[i].born) / SONAR_DUR;
      if(age > 1.0) {
        sonars[i].born = now;
        const p = pickSonarPos(i);
        sonars[i].x = p.x; sonars[i].y = p.y;
        age = 0;
      }
      sonarX[i]   = sonars[i].x;
      sonarY[i]   = sonars[i].y;
      sonarAge[i] = Math.max(0, age);
    }

    /* ── 1) BG + sonar rings */
    gl.useProgram(bgProg);
    gl.uniform1f(bg_uT, T);
    gl.uniform2f(bg_uMouse, mouse.x, H - mouse.y);
    gl.uniform2f(bg_uRes, W, H);
    for(let i=0;i<6;i++){
      gl.uniform2f(bg_uSonar[i], sonarX[i], H - sonarY[i]);
      gl.uniform1f(bg_uSonarAge[i], sonarAge[i]);
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, bgQuad);
    gl.enableVertexAttribArray(bg_aPos);
    gl.vertexAttribPointer(bg_aPos, 2, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.TRIANGLES, 0, 6);

    /* ── 2) crystal structures — sonar-lit */
    gl.useProgram(crLineProg);
    gl.uniform2f(cr_uRes, W, H);
    gl.uniform1f(cr_uT, T);
    for(let i=0;i<6;i++){
      gl.uniform2f(cr_uSonar[i], sonarX[i], sonarY[i]);
      gl.uniform1f(cr_uSonarAge[i], sonarAge[i]);
    }
    const cvf = new Float32Array(crystalVerts);
    const caf = new Float32Array(crystalAlphas);
    const ccf = new Float32Array(crystalColors);

    gl.bindBuffer(gl.ARRAY_BUFFER, crLinePosBuf);
    gl.bufferData(gl.ARRAY_BUFFER, cvf, gl.DYNAMIC_DRAW);
    gl.enableVertexAttribArray(cr_aPos);
    gl.vertexAttribPointer(cr_aPos, 2, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, crLineAlpBuf);
    gl.bufferData(gl.ARRAY_BUFFER, caf, gl.DYNAMIC_DRAW);
    gl.enableVertexAttribArray(cr_aAlpha);
    gl.vertexAttribPointer(cr_aAlpha, 1, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, crLineColBuf);
    gl.bufferData(gl.ARRAY_BUFFER, ccf, gl.DYNAMIC_DRAW);
    gl.enableVertexAttribArray(cr_aCol);
    gl.vertexAttribPointer(cr_aCol, 3, gl.FLOAT, false, 0, 0);

    gl.drawArrays(gl.TRIANGLES, 0, cvf.length/2);

    /* ── 3) particles — drift + sonar-lit */
    for(let i=0;i<PT;i++){
      ptPos[i*2]   += ptVel[i*2]   + Math.sin(T*0.4 + i*0.5)*0.015;
      ptPos[i*2+1] += ptVel[i*2+1] + Math.cos(T*0.3 + i*0.4)*0.015;
      if(ptPos[i*2]<0)   ptVel[i*2]   =  Math.abs(ptVel[i*2]);
      if(ptPos[i*2]>W)   ptVel[i*2]   = -Math.abs(ptVel[i*2]);
      if(ptPos[i*2+1]<0) ptVel[i*2+1] =  Math.abs(ptVel[i*2+1]);
      if(ptPos[i*2+1]>H) ptVel[i*2+1] = -Math.abs(ptVel[i*2+1]);
    }

    gl.useProgram(ptProg);
    gl.uniform2f(pt_uRes, W, H);
    gl.uniform1f(pt_uT, T);
    for(let i=0;i<6;i++){
      gl.uniform2f(pt_uSonar[i], sonarX[i], sonarY[i]);
      gl.uniform1f(pt_uSonarAge[i], sonarAge[i]);
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, ptPosBuf);
    gl.bufferData(gl.ARRAY_BUFFER, ptPos, gl.DYNAMIC_DRAW);
    gl.enableVertexAttribArray(pt_aPos);
    gl.vertexAttribPointer(pt_aPos, 2, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, ptSizBuf);
    gl.bufferData(gl.ARRAY_BUFFER, ptSize, gl.STATIC_DRAW);
    gl.enableVertexAttribArray(pt_aSize);
    gl.vertexAttribPointer(pt_aSize, 1, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, ptBasBuf);
    gl.bufferData(gl.ARRAY_BUFFER, ptBase, gl.STATIC_DRAW);
    gl.enableVertexAttribArray(pt_aBase);
    gl.vertexAttribPointer(pt_aBase, 1, gl.FLOAT, false, 0, 0);

    gl.drawArrays(gl.POINTS, 0, PT);

    requestAnimationFrame(draw);
  }
  requestAnimationFrame(draw);
}

function initScrollReveal(){
  const io=new IntersectionObserver(entries=>{
    entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('visible'); io.unobserve(e.target); }});
  },{threshold:0.1});
  document.querySelectorAll('.reveal').forEach(el=>io.observe(el));
}

function initNav(){
  window.addEventListener('scroll',()=>{
    const nav=document.querySelector('nav');
    if(nav) nav.classList.toggle('scrolled', window.scrollY>40);
  });
}

document.addEventListener('DOMContentLoaded',()=>{
  initWebGL();
  initScrollReveal();
  initNav();
});

/**
 * STEAMTOOLS WebGL Scene
 * "THE DIGITAL VAULT"
 *
 * Concept: You're looking INTO a vast digital vault.
 * — Infinite grid floor receding into depth (tron-style perspective)
 * — Floating holographic game cards drifting upward in layers
 * — Central glowing vault lock ring that slowly rotates
 * — Data stream particles falling like digital rain columns
 * — Scan-line sweep that lights up the scene periodically
 * — Mouse parallax shifts the whole scene
 *
 * Colors: Deep navy/black, electric cyan (#00d4ff), gold (#e8b84b), 
 *         soft white glows — premium vault aesthetic
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

  /* ── compile helpers ── */
  function makeSh(type, src) {
    const s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    return s;
  }
  function makeProg(vs, fs) {
    const p = gl.createProgram();
    gl.attachShader(p, makeSh(gl.VERTEX_SHADER,   vs));
    gl.attachShader(p, makeSh(gl.FRAGMENT_SHADER, fs));
    gl.linkProgram(p);
    return p;
  }

  /* ════════════════════════════════════════════════════
     PROGRAM 1 — BACKGROUND
     Deep vault atmosphere: vignette, scan-line glow,
     subtle grid horizon, colour depth fog
  ════════════════════════════════════════════════════ */
  const bgProg = makeProg(
  `attribute vec2 a_pos; varying vec2 v_uv;
   void main(){ v_uv=a_pos*.5+.5; gl_Position=vec4(a_pos,0,1); }`,
  `precision highp float;
   varying vec2 v_uv;
   uniform float u_t;
   uniform vec2  u_mouse;
   uniform vec2  u_res;

   void main(){
     vec2 uv = v_uv;
     /* parallax shift from mouse */
     vec2 m  = (u_mouse/u_res - .5) * .018;
     uv += m;

     /* deep space base — near black at top, deep navy at bottom */
     vec3 top    = vec3(0.010, 0.012, 0.028);
     vec3 bottom = vec3(0.005, 0.018, 0.048);
     vec3 col    = mix(top, bottom, pow(uv.y, 1.4));

     /* ── perspective grid floor ── */
     /* project uv into fake 3-point perspective */
     vec2 fp  = uv - vec2(.5, .52);         /* centered at horizon */
     float hy = uv.y - .52;                 /* below horizon */
     if(hy > 0.0){
       float depth = hy / .48;              /* 0 at horizon, 1 at bottom */
       float perspective = 1.0 / (depth * 3.0 + 0.001);
       vec2 gp = fp * perspective;          /* grid space */

       /* cell lines */
       float gx = abs(fract(gp.x * 2.2 + u_t*.04) - .5);
       float gy = abs(fract(gp.y * 1.8 - u_t*.06) - .5);

       float lw   = .032;
       float lineX = smoothstep(lw, .0, gx);
       float lineY = smoothstep(lw, .0, gy);
       float grid  = max(lineX, lineY);

       /* fade grid at horizon and edges */
       float hFade = smoothstep(.0, .18, depth) * smoothstep(1.0, .55, depth);
       float eFade = 1.0 - smoothstep(.32, .5, abs(fp.x * perspective * .4));
       grid *= hFade * eFade;

       /* cyan grid tint */
       col = mix(col, vec3(.0, .55, .78), grid * .38);
       /* gold accent on grid intersections */
       float inter = lineX * lineY;
       col = mix(col, vec3(.95, .78, .30), inter * hFade * eFade * .6);
     }

     /* ── horizon glow line ── */
     float hl = smoothstep(.018, .0, abs(uv.y - .52));
     col += vec3(.0, .65, .90) * hl * .55;
     col += vec3(.95, .78, .30) * hl * .18;

     /* ── periodic scan beam sweeping up ── */
     float scanSpeed = .38;
     float scanY     = mod(u_t * scanSpeed, 1.4) - .2;
     float scanLine  = smoothstep(.06, .0, abs(uv.y - scanY));
     float scanFade  = smoothstep(.0,.15,uv.x)*smoothstep(1.,.85,uv.x);
     col += vec3(.0, .80, 1.0) * scanLine * scanFade * .22;

     /* ── ambient top glow — like ceiling light in vault ── */
     float topGlow = smoothstep(.55, .0, uv.y);
     col += vec3(.0, .25, .55) * topGlow * .12;

     /* ── central radial glow behind vault lock ── */
     vec2  cp   = uv - vec2(.5, .40);
     float cd   = length(cp * vec2(1.0, 1.6));
     float core = smoothstep(.45, .0, cd);
     col += vec3(.0, .40, .70) * core * .14;
     col += vec3(.95, .78, .30) * smoothstep(.10, .0, cd) * .08;

     /* ── vignette ── */
     float v = uv.x * uv.y * (1.-uv.x) * (1.-uv.y);
     col *= .35 + .75 * smoothstep(.0, .22, v * 16.0);

     gl_FragColor = vec4(col, 1.0);
   }`);

  const bgQuad = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, bgQuad);
  gl.bufferData(gl.ARRAY_BUFFER,
    new Float32Array([-1,-1, 1,-1, -1,1,  1,-1, 1,1, -1,1]),
    gl.STATIC_DRAW);
  gl.useProgram(bgProg);
  const bg_aPos   = gl.getAttribLocation(bgProg, 'a_pos');
  const bg_uT     = gl.getUniformLocation(bgProg, 'u_t');
  const bg_uMouse = gl.getUniformLocation(bgProg, 'u_mouse');
  const bg_uRes   = gl.getUniformLocation(bgProg, 'u_res');

  /* ════════════════════════════════════════════════════
     PROGRAM 2 — HOLOGRAPHIC GAME CARDS
     Flat quads drifting upward with parallax layers.
     Each card: glowing border, inner shimmer, label bar.
  ════════════════════════════════════════════════════ */
  const cardProg = makeProg(
  `attribute vec2  a_pos;
   attribute vec2  a_uv;
   attribute float a_alpha;
   attribute float a_type;   /* 0=card body, 1=border, 2=accent bar */
   uniform   vec2  u_res;
   uniform   float u_t;
   uniform   vec2  u_mouse;
   varying   vec2  v_uv;
   varying   float v_a;
   varying   float v_type;

   void main(){
     vec2 mp  = (u_mouse/u_res-.5) * .025;
     /* cards in back (high a_type index via a_alpha encode) respond less */
     vec2 pos = a_pos + mp * (1.0 - a_alpha*.3);
     vec2 clip= (pos/u_res)*2.-1.; clip.y=-clip.y;
     gl_Position=vec4(clip,0,1);
     v_uv  =a_uv; v_a=a_alpha; v_type=a_type;
   }`,
  `precision mediump float;
   varying vec2  v_uv;
   varying float v_a;
   varying float v_type;
   uniform float u_t;

   void main(){
     vec2 uv=v_uv;
     vec3 col;
     float a;

     if(v_type < .5){
       /* card body — dark glass with subtle shimmer */
       vec3 base  = vec3(.04, .06, .12);
       /* diagonal shimmer sweep */
       float sh   = smoothstep(.0,.2, uv.x+uv.y - mod(u_t*.55, 2.4));
       sh        -= smoothstep(.2,.35,uv.x+uv.y - mod(u_t*.55, 2.4));
       base      += vec3(.0,.55,.85)*sh*.12;
       col = base;
       a   = v_a * .72;

     } else if(v_type < 1.5){
       /* border glow — cyan */
       float edge = min(min(uv.x,uv.y), min(1.-uv.x,1.-uv.y));
       float glow = 1. - smoothstep(.0,.04,edge);
       col = mix(vec3(.0,.70,.95), vec3(.95,.78,.30), step(.5,uv.y));
       a   = v_a * glow * (.6 + .4*sin(u_t*1.8+v_a*8.));

     } else {
       /* accent bar at bottom — gold */
       col = vec3(.95, .78, .30);
       a   = v_a * .85;
     }

     gl_FragColor = vec4(col, clamp(a,0.,1.));
   }`);

  const card_aPos   = gl.getAttribLocation(cardProg, 'a_pos');
  const card_aUv    = gl.getAttribLocation(cardProg, 'a_uv');
  const card_aAlpha = gl.getAttribLocation(cardProg, 'a_alpha');
  const card_aType  = gl.getAttribLocation(cardProg, 'a_type');
  const card_uRes   = gl.getUniformLocation(cardProg, 'u_res');
  const card_uT     = gl.getUniformLocation(cardProg, 'u_t');
  const card_uMouse = gl.getUniformLocation(cardProg, 'u_mouse');
  const cardPosBuf  = gl.createBuffer();
  const cardUvBuf   = gl.createBuffer();
  const cardAlpBuf  = gl.createBuffer();
  const cardTypBuf  = gl.createBuffer();

  /* ════════════════════════════════════════════════════
     PROGRAM 3 — VAULT LOCK RINGS
     Concentric rotating rings with notches — like a
     combination lock / safe door mechanism
  ════════════════════════════════════════════════════ */
  const ringProg = makeProg(
  `attribute vec2 a_pos;
   attribute float a_alpha;
   attribute vec3  a_col;
   uniform vec2 u_res;
   varying float v_a;
   varying vec3  v_col;
   void main(){
     vec2 clip=(a_pos/u_res)*2.-1.; clip.y=-clip.y;
     gl_Position=vec4(clip,0,1); v_a=a_alpha; v_col=a_col;
   }`,
  `precision mediump float;
   varying float v_a; varying vec3 v_col;
   void main(){ gl_FragColor=vec4(v_col,v_a); }`);
  const ring_aPos   = gl.getAttribLocation(ringProg,  'a_pos');
  const ring_aAlpha = gl.getAttribLocation(ringProg,  'a_alpha');
  const ring_aCol   = gl.getAttribLocation(ringProg,  'a_col');
  const ring_uRes   = gl.getUniformLocation(ringProg, 'u_res');
  const ringPosBuf  = gl.createBuffer();
  const ringAlpBuf  = gl.createBuffer();
  const ringColBuf  = gl.createBuffer();

  /* ════════════════════════════════════════════════════
     PROGRAM 4 — DATA STREAM PARTICLES
     Falling columns of dots — like the Matrix / 
     digital data raining into the vault
  ════════════════════════════════════════════════════ */
  const streamProg = makeProg(
  `attribute vec2  a_pos;
   attribute float a_sz;
   attribute float a_bright;
   uniform   vec2  u_res;
   varying   float v_b;
   void main(){
     vec2 clip=(a_pos/u_res)*2.-1.; clip.y=-clip.y;
     gl_Position=vec4(clip,0,1);
     gl_PointSize=a_sz; v_b=a_bright;
   }`,
  `precision mediump float;
   varying float v_b;
   void main(){
     vec2 c=gl_PointCoord-.5; float r=length(c);
     if(r>.5) discard;
     float g=1.-smoothstep(.0,.5,r);
     /* head of stream = bright cyan, tail = dark blue-green */
     vec3 col=mix(vec3(.0,.35,.55), vec3(.0,.85,1.0), v_b);
     gl_FragColor=vec4(col, g*(0.15 + v_b*.7));
   }`);
  const st_aPos    = gl.getAttribLocation(streamProg, 'a_pos');
  const st_aSz     = gl.getAttribLocation(streamProg, 'a_sz');
  const st_aBright = gl.getAttribLocation(streamProg, 'a_bright');
  const st_uRes    = gl.getUniformLocation(streamProg,'u_res');
  const stPosBuf   = gl.createBuffer();
  const stSzBuf    = gl.createBuffer();
  const stBriBuf   = gl.createBuffer();

  /* ── stream particle data ── */
  const COLS   = 48;   /* number of columns */
  const PER    = 22;   /* particles per column */
  const ST_N   = COLS * PER;
  const stPos  = new Float32Array(ST_N * 2);
  const stSz   = new Float32Array(ST_N);
  const stBri  = new Float32Array(ST_N);
  const stColX = new Float32Array(COLS); /* x position of each column */
  const stColV = new Float32Array(COLS); /* fall speed */
  const stColO = new Float32Array(COLS); /* y offset */

  for(let c = 0; c < COLS; c++){
    stColX[c] = (c / (COLS-1)) * 1.08 - 0.04; /* 0..1 spread + slight overflow */
    stColV[c] = 0.06 + Math.random() * 0.12;
    stColO[c] = Math.random();
    for(let r = 0; r < PER; r++){
      const i = c * PER + r;
      stSz[i] = 1.5 + Math.random() * 2.5;
    }
  }

  /* ── floating card data ── */
  const CARD_N = 22;
  const cards = [];
  for(let i = 0; i < CARD_N; i++){
    const layer = Math.floor(i / 8); /* 0=front, 1=mid, 2=back */
    const scale = [1.0, 0.72, 0.48][layer];
    const w = (90 + Math.random()*50) * scale;
    const h = w * (4/3);
    cards.push({
      x:  Math.random() * 1.1 - 0.05,  /* 0..1 normalized */
      y:  Math.random(),
      vy: (0.008 + Math.random()*0.014) * (layer===0?1:layer===1?0.65:0.35),
      w, h,
      alpha: [0.62, 0.42, 0.22][layer],
      tilt:  (Math.random()-0.5)*0.18,  /* slight tilt in degrees */
      phase: Math.random()*Math.PI*2,
    });
  }

  /* ── geometry helpers ── */
  function quad(vP, vU, vA, vT, x, y, w, h, a, type) {
    /* two triangles for a rectangle */
    const x2 = x+w, y2 = y+h;
    vP.push(x,y, x2,y, x,y2,  x2,y, x2,y2, x,y2);
    vU.push(0,0, 1,0, 0,1,    1,0,  1,1,   0,1);
    for(let v=0;v<6;v++){ vA.push(a); vT.push(type); }
  }

  function arcSegments(vP, vA, vC, cx, cy, r, thick, startA, endA, segs, col, alpha){
    for(let i=0;i<segs;i++){
      const a0 = startA + (endA-startA)*(i/segs);
      const a1 = startA + (endA-startA)*((i+1)/segs);
      const ri = r - thick;
      vP.push(
        cx+Math.cos(a0)*r,  cy+Math.sin(a0)*r,
        cx+Math.cos(a0)*ri, cy+Math.sin(a0)*ri,
        cx+Math.cos(a1)*r,  cy+Math.sin(a1)*r,
        cx+Math.cos(a0)*ri, cy+Math.sin(a0)*ri,
        cx+Math.cos(a1)*ri, cy+Math.sin(a1)*ri,
        cx+Math.cos(a1)*r,  cy+Math.sin(a1)*r
      );
      for(let v=0;v<6;v++){ vA.push(alpha); vC.push(...col); }
    }
  }

  /* mouse */
  let mouse = { x: 0, y: 0 };
  let mouseTarget = { x: 0, y: 0 };
  document.addEventListener('mousemove', e => {
    mouseTarget.x = e.clientX;
    mouseTarget.y = e.clientY;
  });

  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

  const CYAN   = [0.0,  0.72, 0.95];
  const GOLD   = [0.95, 0.78, 0.30];
  const WHITE  = [0.85, 0.92, 1.00];

  let start = null;

  function draw(ts) {
    if(!start) start = ts;
    const T = (ts - start) * 0.001;
    W = canvas.width; H = canvas.height;

    /* smooth mouse */
    mouse.x += (mouseTarget.x - mouse.x) * 0.06;
    mouse.y += (mouseTarget.y - mouse.y) * 0.06;

    gl.clearColor(0,0,0,1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    /* ── 1. BACKGROUND ──────────────────────────────── */
    gl.useProgram(bgProg);
    gl.uniform1f(bg_uT, T);
    gl.uniform2f(bg_uMouse, mouse.x, mouse.y);
    gl.uniform2f(bg_uRes, W, H);
    gl.bindBuffer(gl.ARRAY_BUFFER, bgQuad);
    gl.enableVertexAttribArray(bg_aPos);
    gl.vertexAttribPointer(bg_aPos, 2, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.TRIANGLES, 0, 6);

    /* ── 2. FLOATING CARDS ──────────────────────────── */
    {
      const vP=[], vU=[], vA=[], vT=[];
      for(const c of cards){
        /* drift upward, wrap */
        c.y -= c.vy * 0.016;
        if(c.y < -c.h/H - 0.05) c.y = 1.05 + Math.random()*0.3;
        /* gentle horizontal sway */
        const sway = Math.sin(T * 0.4 + c.phase) * 0.008;
        const px = (c.x + sway) * W;
        const py = c.y * H;
        /* card body */
        quad(vP,vU,vA,vT, px, py, c.w, c.h, c.alpha, 0);
        /* border */
        quad(vP,vU,vA,vT, px, py, c.w, c.h, c.alpha, 1);
        /* gold bar at bottom (8px) */
        quad(vP,vU,vA,vT, px+2, py+c.h-10, c.w-4, 8, c.alpha, 2);
      }
      gl.useProgram(cardProg);
      gl.uniform2f(card_uRes, W, H);
      gl.uniform1f(card_uT, T);
      gl.uniform2f(card_uMouse, mouse.x, mouse.y);

      gl.bindBuffer(gl.ARRAY_BUFFER, cardPosBuf);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vP), gl.DYNAMIC_DRAW);
      gl.enableVertexAttribArray(card_aPos);
      gl.vertexAttribPointer(card_aPos, 2, gl.FLOAT, false, 0, 0);

      gl.bindBuffer(gl.ARRAY_BUFFER, cardUvBuf);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vU), gl.DYNAMIC_DRAW);
      gl.enableVertexAttribArray(card_aUv);
      gl.vertexAttribPointer(card_aUv, 2, gl.FLOAT, false, 0, 0);

      gl.bindBuffer(gl.ARRAY_BUFFER, cardAlpBuf);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vA), gl.DYNAMIC_DRAW);
      gl.enableVertexAttribArray(card_aAlpha);
      gl.vertexAttribPointer(card_aAlpha, 1, gl.FLOAT, false, 0, 0);

      gl.bindBuffer(gl.ARRAY_BUFFER, cardTypBuf);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vT), gl.DYNAMIC_DRAW);
      gl.enableVertexAttribArray(card_aType);
      gl.vertexAttribPointer(card_aType, 1, gl.FLOAT, false, 0, 0);

      gl.drawArrays(gl.TRIANGLES, 0, vP.length/2);
    }

    /* ── 3. VAULT LOCK RINGS ────────────────────────── */
    {
      const vP=[], vA=[], vC=[];
      const cx = W*0.5, cy = H*0.40;

      /* ring definitions: r, thick, speed, notches, col, baseAlpha */
      const ringDefs = [
        { r:H*.220, th:1.8, spd: 0.18, notch:12, col:CYAN,  alpha:0.55 },
        { r:H*.175, th:3.0, spd:-0.28, notch: 8, col:GOLD,  alpha:0.65 },
        { r:H*.130, th:1.4, spd: 0.42, notch:16, col:CYAN,  alpha:0.45 },
        { r:H*.090, th:4.5, spd:-0.60, notch: 6, col:GOLD,  alpha:0.72 },
        { r:H*.052, th:2.0, spd: 0.90, notch: 4, col:WHITE, alpha:0.80 },
      ];

      for(const rd of ringDefs){
        const rot  = T * rd.spd;
        const pulse = 1.0 + 0.04 * Math.sin(T * 1.6 + rd.r);
        const r    = rd.r * pulse;
        const gap  = 0.10; /* notch arc size in radians */

        for(let n = 0; n < rd.notch; n++){
          const segStart = rot + (n / rd.notch) * Math.PI*2 + gap*0.5;
          const segEnd   = rot + ((n+1) / rd.notch) * Math.PI*2 - gap*0.5;
          const a = rd.alpha * (0.7 + 0.3*Math.sin(T*0.8 + n));
          arcSegments(vP, vA, vC, cx, cy, r, rd.th, segStart, segEnd, 12, rd.col, a);
        }

        /* tick marks at notch positions */
        for(let n = 0; n < rd.notch; n++){
          const an = rot + (n / rd.notch) * Math.PI*2;
          const ix = cx + Math.cos(an) * (r - rd.th*3);
          const iy = cy + Math.sin(an) * (r - rd.th*3);
          const ox = cx + Math.cos(an) * (r + rd.th*2);
          const oy = cy + Math.sin(an) * (r + rd.th*2);
          const nx = -Math.sin(an)*0.8, ny = Math.cos(an)*0.8;
          vP.push(ix+nx,iy+ny, ix-nx,iy-ny, ox+nx,oy+ny,
                  ix-nx,iy-ny, ox-nx,oy-ny, ox+nx,oy+ny);
          for(let v=0;v<6;v++){ vA.push(rd.alpha*.9); vC.push(...rd.col); }
        }
      }

      /* central dot / core */
      const coreR = H*.018;
      arcSegments(vP,vA,vC, cx,cy, coreR, coreR, 0, Math.PI*2, 24, WHITE, 0.90);

      gl.useProgram(ringProg);
      gl.uniform2f(ring_uRes, W, H);

      gl.bindBuffer(gl.ARRAY_BUFFER, ringPosBuf);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vP), gl.DYNAMIC_DRAW);
      gl.enableVertexAttribArray(ring_aPos);
      gl.vertexAttribPointer(ring_aPos, 2, gl.FLOAT, false, 0, 0);

      gl.bindBuffer(gl.ARRAY_BUFFER, ringAlpBuf);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vA), gl.DYNAMIC_DRAW);
      gl.enableVertexAttribArray(ring_aAlpha);
      gl.vertexAttribPointer(ring_aAlpha, 1, gl.FLOAT, false, 0, 0);

      gl.bindBuffer(gl.ARRAY_BUFFER, ringColBuf);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vC), gl.DYNAMIC_DRAW);
      gl.enableVertexAttribArray(ring_aCol);
      gl.vertexAttribPointer(ring_aCol, 3, gl.FLOAT, false, 0, 0);

      gl.drawArrays(gl.TRIANGLES, 0, vP.length/2);
    }

    /* ── 4. DATA STREAM PARTICLES ───────────────────── */
    {
      for(let c = 0; c < COLS; c++){
        stColO[c] = (stColO[c] + stColV[c] * 0.016) % 1.0;
        for(let r = 0; r < PER; r++){
          const i   = c * PER + r;
          const frac = (r / PER + stColO[c]) % 1.0;
          stPos[i*2]   = stColX[c] * W;
          stPos[i*2+1] = frac * H * 1.1 - H*0.05;
          /* brightness: head of trail is bright, tail fades */
          const headDist = Math.abs(frac - stColO[c] % 1.0);
          stBri[i] = Math.pow(1.0 - Math.min(1, (r/(PER-1))), 2.2);
        }
      }

      gl.useProgram(streamProg);
      gl.uniform2f(st_uRes, W, H);

      gl.bindBuffer(gl.ARRAY_BUFFER, stPosBuf);
      gl.bufferData(gl.ARRAY_BUFFER, stPos, gl.DYNAMIC_DRAW);
      gl.enableVertexAttribArray(st_aPos);
      gl.vertexAttribPointer(st_aPos, 2, gl.FLOAT, false, 0, 0);

      gl.bindBuffer(gl.ARRAY_BUFFER, stSzBuf);
      gl.bufferData(gl.ARRAY_BUFFER, stSz, gl.STATIC_DRAW);
      gl.enableVertexAttribArray(st_aSz);
      gl.vertexAttribPointer(st_aSz, 1, gl.FLOAT, false, 0, 0);

      gl.bindBuffer(gl.ARRAY_BUFFER, stBriBuf);
      gl.bufferData(gl.ARRAY_BUFFER, stBri, gl.DYNAMIC_DRAW);
      gl.enableVertexAttribArray(st_aBright);
      gl.vertexAttribPointer(st_aBright, 1, gl.FLOAT, false, 0, 0);

      gl.drawArrays(gl.POINTS, 0, ST_N);
    }

    requestAnimationFrame(draw);
  }
  requestAnimationFrame(draw);
}

function initScrollReveal(){
  const io=new IntersectionObserver(entries=>{
    entries.forEach(e=>{ if(e.isIntersecting){e.target.classList.add('visible');io.unobserve(e.target);}});
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

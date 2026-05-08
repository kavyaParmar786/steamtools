/**
 * STEAMTOOLS — WebGL Scene
 * Concept: COMIC / DOODLE — hand-drawn ink lines, wobbly shapes,
 * halftone dots, speed lines, sketchy hatching, pop-art panels
 * Palette: deep black bg, gold, steel blue, crimson — Straw Hat
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

  function sh(type, src) {
    const s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    return s;
  }
  function prog(vs, fs) {
    const p = gl.createProgram();
    gl.attachShader(p, sh(gl.VERTEX_SHADER,   vs));
    gl.attachShader(p, sh(gl.FRAGMENT_SHADER, fs));
    gl.linkProgram(p);
    return p;
  }

  /* ═══════════════════════════════════════════════════════
     PROGRAM 1 — FULL-SCREEN COMIC BG
     Halftone dots + ink wash panels + speed lines
  ═══════════════════════════════════════════════════════ */
  const bgProg = prog(
  `attribute vec2 a_pos; varying vec2 v_uv;
   void main(){ v_uv=a_pos*.5+.5; gl_Position=vec4(a_pos,0,1); }`,
  `precision highp float;
   varying vec2 v_uv;
   uniform float u_t;
   uniform vec2  u_res;
   uniform vec2  u_mouse;

   float hash(vec2 p){ return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5); }

   /* wobbly line SDF — comic ink stroke feel */
   float inkLine(vec2 uv, vec2 a, vec2 b, float w, float wobble, float t){
     vec2 ab=b-a, ap=uv-a;
     float tt=clamp(dot(ap,ab)/dot(ab,ab),0.,1.);
     vec2 closest=a+tt*ab;
     float d=length(uv-closest);
     /* add wobble perpendicular to line */
     float along=tt*length(ab);
     float wob=sin(along*0.04+t*1.5)*wobble + sin(along*0.09+t*0.8)*wobble*0.5;
     d+=wob;
     return 1.0-smoothstep(w-0.003,w+0.003,d/length(u_res));
   }

   void main(){
     vec2 uv=v_uv;
     vec2 p=uv*u_res;
     float t=u_t;

     /* ── deep comic-book dark bg */
     vec3 bg0 = vec3(0.03, 0.03, 0.06);
     vec3 bg1 = vec3(0.06, 0.05, 0.10);
     vec3 col  = mix(bg0, bg1, uv.y*0.6 + 0.2);

     /* ── halftone dot grid — classic comic printing */
     float dotScale = 28.0;
     vec2 cell = floor(uv * dotScale);
     vec2 fc   = fract(uv * dotScale) - 0.5;
     /* vary dot size with slow noise + position */
     float dn = hash(cell + floor(t*0.3));
     float brightness = 0.12 + 0.22*sin(cell.x*0.4+t*0.25)*sin(cell.y*0.35+t*0.18);
     brightness += 0.1*(1.0-length(uv-vec2(0.5))*1.4);
     float dotR = clamp(brightness, 0.04, 0.38);
     float dot  = 1.0-smoothstep(dotR-0.02, dotR+0.02, length(fc));
     /* gold halftone */
     col += vec3(0.91,0.72,0.29) * dot * 0.10;

     /* ── speed lines radiating from hero center — manga style */
     vec2 center = vec2(0.5, 0.40);
     vec2 dir    = normalize(uv - center);
     float angle = atan(dir.y, dir.x);
     float dist  = length(uv - center);
     /* create streaks by quantising angle with wobble */
     float streakW   = 0.045 + 0.02*sin(t*0.4);
     float angleQ    = mod(angle + sin(angle*14.0+t*0.6)*0.04, streakW);
     float streak    = smoothstep(streakW*0.0, streakW*0.28, angleQ)
                     * smoothstep(streakW,      streakW*0.72, angleQ);
     float radFade   = smoothstep(0.08, 0.22, dist) * smoothstep(0.85, 0.45, dist);
     streak *= radFade;
     /* alternate gold / steel blue streaks */
     float altMask = step(0.5, fract(angle / streakW * 0.5));
     vec3 streakCol= mix(vec3(0.91,0.72,0.29), vec3(0.36,0.56,0.73), altMask);
     col += streakCol * streak * 0.14;

     /* ── panel borders — comic book grid overlay */
     /* two vertical dividers + one horizontal */
     float lw = 2.5/u_res.x;
     float panelL = smoothstep(lw,0.0,abs(uv.x-0.35)) + smoothstep(lw,0.0,abs(uv.x-0.68));
     float panelH = smoothstep(2.5/u_res.y,0.0,abs(uv.y-0.55));
     col += vec3(0.91,0.72,0.29) * (panelL+panelH) * 0.18;

     /* ── ink blotch vignette */
     float vig = uv.x*uv.y*(1.-uv.x)*(1.-uv.y);
     col *= 0.5 + 0.6*smoothstep(0.0,0.2, vig*18.0);

     /* ── mouse spotlight — torch shining on comic page */
     vec2 muv = u_mouse/u_res; muv.y=1.0-muv.y;
     float ml = length(uv-muv);
     col += vec3(0.91,0.72,0.29)*smoothstep(0.32,0.0,ml)*0.06;

     gl_FragColor = vec4(col,1.0);
   }`);

  const bgQuad = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, bgQuad);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1,1,-1,1,1,-1,1]), gl.STATIC_DRAW);
  gl.useProgram(bgProg);
  const bg_aPos   = gl.getAttribLocation(bgProg,  'a_pos');
  const bg_uT     = gl.getUniformLocation(bgProg,  'u_t');
  const bg_uRes   = gl.getUniformLocation(bgProg,  'u_res');
  const bg_uMouse = gl.getUniformLocation(bgProg,  'u_mouse');

  /* ═══════════════════════════════════════════════════════
     PROGRAM 2 — DOODLE GEOMETRY
     Wobbly circles, hatching boxes, sketch stars, scribble arcs
     All drawn as thick anti-aliased lines from CPU-generated verts
  ═══════════════════════════════════════════════════════ */
  const geoProg = prog(
  `attribute vec2  a_pos;
   attribute float a_alpha;
   attribute vec3  a_col;
   uniform   vec2  u_res;
   varying   float v_a;
   varying   vec3  v_col;
   void main(){
     vec2 clip=(a_pos/u_res)*2.-1.; clip.y=-clip.y;
     gl_Position=vec4(clip,0,1); v_a=a_alpha; v_col=a_col;
   }`,
  `precision mediump float;
   varying float v_a; varying vec3 v_col;
   void main(){ gl_FragColor=vec4(v_col,v_a); }`);
  const geo_aPos   = gl.getAttribLocation(geoProg,  'a_pos');
  const geo_aAlpha = gl.getAttribLocation(geoProg,  'a_alpha');
  const geo_aCol   = gl.getAttribLocation(geoProg,  'a_col');
  const geo_uRes   = gl.getUniformLocation(geoProg, 'u_res');
  const geoPosBuf  = gl.createBuffer();
  const geoAlpBuf  = gl.createBuffer();
  const geoColBuf  = gl.createBuffer();

  /* ═══════════════════════════════════════════════════════
     PROGRAM 3 — PARTICLES as comic ink splats / dots
  ═══════════════════════════════════════════════════════ */
  const ptProg = prog(
  `attribute vec2  a_pos;
   attribute float a_sz;
   attribute float a_hue;
   uniform   vec2  u_res;
   uniform   float u_t;
   varying   float v_hue;
   void main(){
     vec2 clip=(a_pos/u_res)*2.-1.; clip.y=-clip.y;
     gl_Position=vec4(clip,0,1);
     float pulse=1.0+0.35*sin(u_t*2.8+a_hue*12.56);
     gl_PointSize=a_sz*pulse;
     v_hue=a_hue;
   }`,
  `precision mediump float;
   varying float v_hue;
   uniform float u_t;
   void main(){
     vec2 c=gl_PointCoord-.5; float r=length(c);
     if(r>.5) discard;
     /* comic ink dot — hard edge with tiny sketch roughness */
     float edge=smoothstep(0.48,0.38,r);
     float inner=smoothstep(0.0,0.22,r);
     /* palette: 0=gold 1=steel 2=crimson 3=white-ish */
     vec3 col;
     float h=v_hue;
     if(h<0.33)      col=vec3(0.95,0.78,0.28);
     else if(h<0.60) col=vec3(0.42,0.62,0.80);
     else if(h<0.82) col=vec3(0.80,0.32,0.32);
     else            col=vec3(0.88,0.85,0.78);
     float a=edge*(0.55+inner*0.3);
     gl_FragColor=vec4(col,a);
   }`);
  const pt_aPos = gl.getAttribLocation(ptProg, 'a_pos');
  const pt_aSz  = gl.getAttribLocation(ptProg, 'a_sz');
  const pt_aHue = gl.getAttribLocation(ptProg, 'a_hue');
  const pt_uRes = gl.getUniformLocation(ptProg, 'u_res');
  const pt_uT   = gl.getUniformLocation(ptProg, 'u_t');
  const ptPosBuf = gl.createBuffer();
  const ptSzBuf  = gl.createBuffer();
  const ptHueBuf = gl.createBuffer();

  /* ── particle data */
  const PT = 160;
  const ptPos = new Float32Array(PT*2);
  const ptSz  = new Float32Array(PT);
  const ptHue = new Float32Array(PT);
  const ptVel = new Float32Array(PT*2);
  for(let i=0;i<PT;i++){
    ptPos[i*2]   = Math.random()*1920;
    ptPos[i*2+1] = Math.random()*1080;
    const sp=0.04+Math.random()*0.13;
    const an=Math.random()*Math.PI*2;
    ptVel[i*2]=Math.cos(an)*sp; ptVel[i*2+1]=Math.sin(an)*sp;
    const t=Math.random();
    ptSz[i] = t<0.55 ? 2+Math.random()*3 : t<0.82 ? 5+Math.random()*5 : 9+Math.random()*7;
    ptHue[i] = Math.random();
  }

  /* ═══════════════════════════════════════════════════════
     CPU GEOMETRY BUILDER — wobbly doodles
  ═══════════════════════════════════════════════════════ */

  /* thick line segment as a quad */
  function thickLine(verts, alphas, cols, x1,y1,x2,y2, w, col, a){
    const dx=x2-x1, dy=y2-y1, len=Math.hypot(dx,dy)||1;
    const nx=-dy/len*w, ny=dx/len*w;
    /* taper: base alpha at ends, full in middle — hand-drawn feel */
    verts.push(
      x1+nx,y1+ny, x1-nx,y1-ny, x2+nx,y2+ny,
      x1-nx,y1-ny, x2-nx,y2-ny, x2+nx,y2+ny
    );
    const ae=a*0.3, am=a;
    alphas.push(ae,ae,ae, ae,ae,ae);
    for(let v=0;v<6;v++) cols.push(...col);
  }

  /* wobbly circle — segments with slight random offset */
  function wobbleCircle(verts, alphas, cols, cx,cy,r, segs, strokeW, col, a, seed, wobAmt){
    let px=null, py=null;
    for(let i=0;i<=segs;i++){
      const angle=(i/segs)*Math.PI*2;
      const wob = wobAmt*(Math.sin(seed+i*2.3)*0.6 + Math.sin(seed*1.7+i*5.1)*0.4);
      const rx=cx+(r+wob)*Math.cos(angle);
      const ry=cy+(r+wob)*Math.sin(angle);
      if(px!==null) thickLine(verts,alphas,cols,px,py,rx,ry,strokeW,col,a);
      px=rx; py=ry;
    }
  }

  /* sketchy star burst */
  function starBurst(verts, alphas, cols, cx,cy,r, spikes, strokeW, col, a, seed){
    for(let i=0;i<spikes;i++){
      const an=(i/spikes)*Math.PI*2 + seed*0.4;
      const len=r*(0.5+Math.random()*0.7);
      const tipX=cx+Math.cos(an)*len, tipY=cy+Math.sin(an)*len;
      thickLine(verts,alphas,cols,cx,cy,tipX,tipY,strokeW,col,a*0.7);
      /* secondary short stroke for sketch feel */
      const an2=an+0.18*(Math.random()>0.5?1:-1);
      const len2=len*0.55;
      thickLine(verts,alphas,cols,
        cx+Math.cos(an)*len*0.3, cy+Math.sin(an)*len*0.3,
        cx+Math.cos(an2)*len2,   cy+Math.sin(an2)*len2,
        strokeW*0.6, col, a*0.5);
    }
  }

  /* hatching box */
  function hatchBox(verts, alphas, cols, x,y,w,h, spacing, angle, strokeW, col, a){
    const cos=Math.cos(angle), sin=Math.sin(angle);
    const diag=Math.hypot(w,h);
    for(let d=-diag;d<diag;d+=spacing){
      /* intersect hatch line with box */
      const mx=x+w/2, my=y+h/2;
      const ax=mx+cos*d - sin*diag*2;
      const ay=my+sin*d + cos*diag*2;
      const bx=mx+cos*d + sin*diag*2;
      const by=my+sin*d - cos*diag*2;
      /* clip to box — simple approach */
      function clip(ax,ay,bx,by,x0,y0,x1,y1){
        let t0=0,t1=1;
        const dx=bx-ax, dy=by-ay;
        function clip1(p,q){ if(q===0) return p>=0; if(q<0){const r=p/q;if(r>t1)return false;if(r>t0)t0=r;}else{const r=p/q;if(r<t0)return false;if(r<t1)t1=r;} return true; }
        if(!clip1(-dx,ax-x0))return null; if(!clip1(dx,x1-ax))return null;
        if(!clip1(-dy,ay-y0))return null; if(!clip1(dy,y1-ay))return null;
        return[ax+t0*dx,ay+t0*dy,ax+t1*dx,ay+t1*dy];
      }
      const r=clip(ax,ay,bx,by,x,y,x+w,y+h);
      if(r) thickLine(verts,alphas,cols,r[0],r[1],r[2],r[3],strokeW,col,a);
    }
  }

  /* scribble arc — like comic thought bubble trail */
  function scribbleArc(verts, alphas, cols, cx,cy,r,a0,a1,segs,strokeW,col,a,wobAmt){
    let px=null,py=null;
    for(let i=0;i<=segs;i++){
      const angle=a0+(a1-a0)*(i/segs);
      const wob=wobAmt*(Math.sin(i*3.1)*0.5+Math.sin(i*7.2)*0.25);
      const rx=cx+(r+wob)*Math.cos(angle);
      const ry=cy+(r+wob)*Math.sin(angle);
      if(px!==null) thickLine(verts,alphas,cols,px,py,rx,ry,strokeW,col,a);
      px=rx; py=ry;
    }
  }

  /* ── palette */
  const GOLD    = [0.91,0.72,0.29];
  const STEEL   = [0.36,0.56,0.73];
  const CRIMSON = [0.72,0.30,0.30];
  const CREAM   = [0.88,0.85,0.76];

  /* ── static doodle layout — built once (rebuilt on resize) */
  let doodleVerts=[], doodleAlphas=[], doodleColors=[];

  function buildDoodles(){
    doodleVerts=[]; doodleAlphas=[]; doodleColors=[];
    const v=doodleVerts, al=doodleAlphas, co=doodleColors;

    /* BIG wobbly rings — background atmosphere */
    wobbleCircle(v,al,co, W*0.5,H*0.40, H*0.28, 64, 1.8, GOLD,    0.20, 1.1, 12);
    wobbleCircle(v,al,co, W*0.5,H*0.40, H*0.42, 64, 1.0, STEEL,   0.12, 2.3, 18);
    wobbleCircle(v,al,co, W*0.5,H*0.40, H*0.18, 48, 2.2, GOLD,    0.25, 0.7,  8);

    /* off-center decorative rings */
    wobbleCircle(v,al,co, W*0.12,H*0.22, 90, 40, 1.5, STEEL,   0.22, 3.2, 14);
    wobbleCircle(v,al,co, W*0.88,H*0.28, 70, 36, 1.2, CRIMSON, 0.20, 5.1, 10);
    wobbleCircle(v,al,co, W*0.78,H*0.72, 110,44, 1.8, GOLD,    0.18, 2.0, 16);
    wobbleCircle(v,al,co, W*0.18,H*0.75, 80, 38, 1.3, STEEL,   0.16, 4.4, 11);

    /* star bursts — action comic energy */
    starBurst(v,al,co, W*0.08,H*0.18, 55, 12, 1.4, GOLD,    0.38, 0.3);
    starBurst(v,al,co, W*0.92,H*0.15, 45, 10, 1.2, CRIMSON, 0.32, 1.7);
    starBurst(v,al,co, W*0.85,H*0.78, 60, 14, 1.5, GOLD,    0.35, 2.8);
    starBurst(v,al,co, W*0.12,H*0.82, 50, 11, 1.3, STEEL,   0.30, 0.9);
    starBurst(v,al,co, W*0.5, H*0.40, 90, 18, 2.0, GOLD,    0.18, 1.2); /* center glow */

    /* hatching zones — comic shadow/tone */
    hatchBox(v,al,co, 0,        H*0.56, W*0.20,H*0.44, 14, 0.72, 0.8, STEEL,   0.08);
    hatchBox(v,al,co, W*0.82,   H*0.52, W*0.18,H*0.48, 16, 0.55, 0.7, GOLD,    0.07);
    hatchBox(v,al,co, W*0.38,   H*0.78, W*0.24,H*0.22, 18, 0.40, 0.6, CRIMSON, 0.06);
    /* cross-hatch */
    hatchBox(v,al,co, 0,        H*0.62, W*0.14,H*0.38,  12, -0.72, 0.7, STEEL,  0.05);
    hatchBox(v,al,co, W*0.86,   H*0.58, W*0.14,H*0.42,  12, -0.55, 0.6, GOLD,   0.05);

    /* scribble arcs — loose sketchy curves */
    scribbleArc(v,al,co, W*0.25,H*0.35, 130, -0.8,  1.6,  40, 1.4, GOLD,    0.22, 10);
    scribbleArc(v,al,co, W*0.75,H*0.65, 100, Math.PI+0.3, Math.PI*2-0.2, 36, 1.2, STEEL,   0.20,  8);
    scribbleArc(v,al,co, W*0.50,H*0.80, 160, 0.1,   Math.PI-0.1, 50, 1.0, CREAM,   0.12, 12);
    scribbleArc(v,al,co, W*0.50,H*0.10, 200, Math.PI*0.1, Math.PI*0.9, 48, 0.8, STEEL,   0.10, 14);

    /* panel border lines — comic strip grid */
    function panelLine(x1,y1,x2,y2,col,a){
      /* add hand-drawn wobble manually */
      const segs=18;
      const len=Math.hypot(x2-x1,y2-y1);
      let px=x1,py=y1;
      for(let i=1;i<=segs;i++){
        const tt=i/segs;
        const nx2=x1+(x2-x1)*tt + (Math.random()-0.5)*3.5;
        const ny2=y1+(y2-y1)*tt + (Math.random()-0.5)*3.5;
        thickLine(v,al,co,px,py,nx2,ny2,1.6,col,a);
        px=nx2; py=ny2;
      }
    }
    panelLine(W*0.35, 0,       W*0.35, H*0.56, GOLD,   0.18);
    panelLine(W*0.68, 0,       W*0.68, H*0.50, STEEL,  0.14);
    panelLine(0,      H*0.56,  W*0.35, H*0.56, GOLD,   0.14);
    panelLine(W*0.35, H*0.52,  W,      H*0.52, STEEL,  0.11);
    panelLine(0,      H*0.75,  W*0.35, H*0.75, CRIMSON,0.12);

    /* dot-dash decorative borders on sides */
    for(let y=40;y<H;y+=28){
      const s=5+Math.random()*4;
      thickLine(v,al,co, 8+(Math.random()-0.5)*4,y, 8+(Math.random()-0.5)*4,y+s, 1.2, GOLD, 0.18);
      thickLine(v,al,co, W-8+(Math.random()-0.5)*4,y, W-8+(Math.random()-0.5)*4,y+s, 1.2, STEEL, 0.15);
    }

    /* small random doodle clusters — like margin scribbles */
    for(let i=0;i<22;i++){
      const cx=Math.random()*W, cy=Math.random()*H;
      if(cy>H*0.2 && cy<H*0.72 && cx>W*0.28 && cx<W*0.72) continue; /* skip center */
      const r=8+Math.random()*28;
      const type=Math.floor(Math.random()*3);
      const pal=[GOLD,STEEL,CRIMSON,CREAM][Math.floor(Math.random()*4)];
      if(type===0) wobbleCircle(v,al,co, cx,cy,r, 20+Math.floor(r),1.0,pal,0.20,Math.random()*10,r*0.15);
      else if(type===1) starBurst(v,al,co, cx,cy,r, 5+Math.floor(Math.random()*5),0.9,pal,0.22,Math.random()*6);
      else scribbleArc(v,al,co, cx,cy,r, Math.random()*Math.PI, Math.random()*Math.PI+Math.PI, 12, 0.9, pal, 0.18, r*0.2);
    }
  }
  buildDoodles();
  window.addEventListener('resize', ()=>{ resize(); buildDoodles(); });

  /* ─────────────────────────────────────────────────────
     ANIMATED DOODLES — drawn fresh each frame (small set)
  ───────────────────────────────────────────────────── */
  function buildAnimated(T){
    const v=[], al=[], co=[];

    /* pulsing central rings — breathe in/out */
    const pulse=1+0.06*Math.sin(T*1.8);
    wobbleCircle(v,al,co, W*0.5,H*0.40, H*0.28*pulse, 64, 2.0, GOLD,  0.28+0.10*Math.sin(T*1.8), T*0.4, 12);

    /* rotating star — like action POW */
    const stars=8;
    for(let i=0;i<stars;i++){
      const an=(i/stars)*Math.PI*2 + T*0.55;
      const r=H*0.12*(1+0.08*Math.sin(T*2.1+i));
      const tip=[W*0.5+Math.cos(an)*r, H*0.40+Math.sin(an)*r];
      const an2=an+Math.PI/stars;
      const r2=r*0.38;
      const tip2=[W*0.5+Math.cos(an2)*r2, H*0.40+Math.sin(an2)*r2];
      thickLine(v,al,co, W*0.5,H*0.40, tip[0],tip[1], 1.8, GOLD, 0.30);
      thickLine(v,al,co, tip[0],tip[1], tip2[0],tip2[1], 1.2, STEEL, 0.22);
    }

    /* orbiting small circles — like classic cartoon orbit */
    for(let i=0;i<5;i++){
      const an=T*0.7 + (i/5)*Math.PI*2;
      const orbitR=H*0.32;
      const ox=W*0.5+Math.cos(an)*orbitR;
      const oy=H*0.40+Math.sin(an)*orbitR;
      const r=6+3*Math.sin(T*1.5+i);
      wobbleCircle(v,al,co, ox,oy,r, 12, 1.5, [GOLD,STEEL,CRIMSON,CREAM,STEEL][i], 0.55, T+i*2, r*0.18);
    }

    /* flying speed lines from center — reactive to time */
    const lCount=20;
    for(let i=0;i<lCount;i++){
      const an=(i/lCount)*Math.PI*2 + T*0.12;
      const speed=1+0.5*Math.sin(T*0.8+i);
      const r0=H*0.13*speed, r1=H*(0.22+0.06*Math.sin(T+i*0.5))*speed;
      const col=[GOLD,STEEL,CRIMSON][i%3];
      thickLine(v,al,co,
        W*0.5+Math.cos(an)*r0, H*0.40+Math.sin(an)*r0,
        W*0.5+Math.cos(an)*r1, H*0.40+Math.sin(an)*r1,
        0.9+Math.sin(T+i)*0.4, col, 0.22);
    }

    /* corner burst animating */
    const ba=T*0.3;
    starBurst(v,al,co, W*0.08+Math.cos(ba)*5,H*0.18+Math.sin(ba)*3, 55+5*Math.sin(T), 12, 1.4, GOLD, 0.40+0.15*Math.sin(T*1.5), ba);
    starBurst(v,al,co, W*0.92+Math.sin(ba)*4,H*0.15+Math.cos(ba)*4, 45+4*Math.sin(T*1.2), 10, 1.2, CRIMSON, 0.36+0.12*Math.sin(T*1.8), ba*1.3);

    return {v,al,co};
  }

  /* mouse */
  let mouse={x:W/2,y:H/2};
  document.addEventListener('mousemove',e=>{mouse.x=e.clientX;mouse.y=e.clientY;});

  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

  let start=null;
  function draw(ts){
    if(!start) start=ts;
    const T=(ts-start)*0.001;
    W=canvas.width; H=canvas.height;

    /* 1) comic bg */
    gl.useProgram(bgProg);
    gl.uniform1f(bg_uT, T);
    gl.uniform2f(bg_uRes, W, H);
    gl.uniform2f(bg_uMouse, mouse.x, mouse.y);
    gl.bindBuffer(gl.ARRAY_BUFFER, bgQuad);
    gl.enableVertexAttribArray(bg_aPos);
    gl.vertexAttribPointer(bg_aPos, 2, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.TRIANGLES, 0, 6);

    /* helper: upload + draw geo */
    function drawGeo(verts,alphas,cols){
      if(verts.length===0) return;
      gl.useProgram(geoProg);
      gl.uniform2f(geo_uRes, W, H);

      gl.bindBuffer(gl.ARRAY_BUFFER, geoPosBuf);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.DYNAMIC_DRAW);
      gl.enableVertexAttribArray(geo_aPos);
      gl.vertexAttribPointer(geo_aPos, 2, gl.FLOAT, false, 0, 0);

      gl.bindBuffer(gl.ARRAY_BUFFER, geoAlpBuf);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(alphas), gl.DYNAMIC_DRAW);
      gl.enableVertexAttribArray(geo_aAlpha);
      gl.vertexAttribPointer(geo_aAlpha, 1, gl.FLOAT, false, 0, 0);

      gl.bindBuffer(gl.ARRAY_BUFFER, geoColBuf);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(cols), gl.DYNAMIC_DRAW);
      gl.enableVertexAttribArray(geo_aCol);
      gl.vertexAttribPointer(geo_aCol, 3, gl.FLOAT, false, 0, 0);

      gl.drawArrays(gl.TRIANGLES, 0, verts.length/2);
    }

    /* 2) static doodles */
    drawGeo(doodleVerts, doodleAlphas, doodleColors);

    /* 3) animated doodles */
    const anim=buildAnimated(T);
    drawGeo(anim.v, anim.al, anim.co);

    /* 4) particles */
    for(let i=0;i<PT;i++){
      ptPos[i*2]   +=ptVel[i*2]   +0.008*Math.sin(T*0.5+i*0.4);
      ptPos[i*2+1] +=ptVel[i*2+1] +0.008*Math.cos(T*0.4+i*0.3);
      if(ptPos[i*2]<0)    ptVel[i*2]   = Math.abs(ptVel[i*2]);
      if(ptPos[i*2]>W)    ptVel[i*2]   =-Math.abs(ptVel[i*2]);
      if(ptPos[i*2+1]<0)  ptVel[i*2+1] = Math.abs(ptVel[i*2+1]);
      if(ptPos[i*2+1]>H)  ptVel[i*2+1] =-Math.abs(ptVel[i*2+1]);
    }
    gl.useProgram(ptProg);
    gl.uniform2f(pt_uRes, W, H);
    gl.uniform1f(pt_uT, T);
    gl.bindBuffer(gl.ARRAY_BUFFER, ptPosBuf);
    gl.bufferData(gl.ARRAY_BUFFER, ptPos, gl.DYNAMIC_DRAW);
    gl.enableVertexAttribArray(pt_aPos);
    gl.vertexAttribPointer(pt_aPos, 2, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, ptSzBuf);
    gl.bufferData(gl.ARRAY_BUFFER, ptSz, gl.STATIC_DRAW);
    gl.enableVertexAttribArray(pt_aSz);
    gl.vertexAttribPointer(pt_aSz, 1, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, ptHueBuf);
    gl.bufferData(gl.ARRAY_BUFFER, ptHue, gl.STATIC_DRAW);
    gl.enableVertexAttribArray(pt_aHue);
    gl.vertexAttribPointer(pt_aHue, 1, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.POINTS, 0, PT);

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

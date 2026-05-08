/**
 * STEAMTOOLS — Shared
 * WebGL: Minimal, cinematic. Straw Hat palette.
 * Deep black ocean · warm gold · steel blue · crimson ribbon
 */

function initWebGL() {
  const canvas = document.getElementById('webgl-bg');
  if (!canvas) return;
  const gl = canvas.getContext('webgl', { alpha: false, antialias: true })
           || canvas.getContext('experimental-webgl');
  if (!gl) { canvas.style.display = 'none'; return; }

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    gl.viewport(0, 0, canvas.width, canvas.height);
  }
  resize();
  window.addEventListener('resize', resize);

  /* ── FULL-SCREEN QUAD — ocean + aurora shader ── */
  const bgVS = `
    attribute vec2 a_pos;
    varying vec2 v_uv;
    void main() { v_uv = a_pos * 0.5 + 0.5; gl_Position = vec4(a_pos, 0.0, 1.0); }
  `;

  const bgFS = `
    precision highp float;
    varying vec2 v_uv;
    uniform float u_time;
    uniform vec2  u_mouse;
    uniform vec2  u_res;

    float hash(vec2 p){ p=fract(p*vec2(127.1,311.7)); p+=dot(p,p+45.32); return fract(p.x*p.y); }
    float noise(vec2 p){
      vec2 i=floor(p), f=fract(p);
      f=f*f*(3.0-2.0*f);
      return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),
                 mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);
    }
    float fbm(vec2 p){
      float v=0.0,a=0.5;
      for(int i=0;i<6;i++){v+=a*noise(p);p=p*2.03+vec2(1.7,9.2);a*=0.5;}
      return v;
    }

    void main(){
      vec2 uv  = v_uv;
      vec2 muv = u_mouse / u_res;
      float t  = u_time * 0.08;

      // ── Deep ocean base
      vec3 deep   = vec3(0.02, 0.03, 0.07);
      vec3 abyss  = vec3(0.01, 0.01, 0.04);

      // ── Slow FBM warp
      vec2 q = vec2(fbm(uv*2.4 + t), fbm(uv*2.4 + vec2(5.2,1.3) + t*0.7));
      float n = fbm(uv*1.8 + q*0.55 + t*0.4);

      // ── Straw Hat palette aurora bands
      // Gold: #e8b84b  → (0.91, 0.72, 0.29)
      // Steel blue: #5b8fb9  → (0.36, 0.56, 0.73)
      // Crimson: #b84c4c → (0.72, 0.30, 0.30)
      vec3 gold    = vec3(0.91, 0.72, 0.29);
      vec3 steel   = vec3(0.36, 0.56, 0.73);
      vec3 crimson = vec3(0.72, 0.30, 0.30);

      // Layered aurora bands
      float band1 = smoothstep(0.38, 0.62, n + 0.12*sin(uv.x*4.0 + t));
      float band2 = smoothstep(0.52, 0.70, fbm(uv*3.0 - q*0.4 + t*0.6));
      float band3 = smoothstep(0.60, 0.75, fbm(uv*2.2 + vec2(3.1,0.0) + t*0.3));

      // Mouse warmth
      float md = length(uv - muv);
      float mw = smoothstep(0.45, 0.0, md) * 0.18;

      vec3 col = mix(abyss, deep, uv.y * 0.7 + 0.3);
      col = mix(col, gold,    band1 * 0.22);
      col = mix(col, steel,   band2 * 0.18);
      col = mix(col, crimson, band3 * 0.09);
      col += gold * mw;

      // Vignette
      float v = uv.x*uv.y*(1.0-uv.x)*(1.0-uv.y);
      col *= smoothstep(0.0, 0.18, v * 12.0);

      gl_FragColor = vec4(col, 1.0);
    }
  `;

  /* ── PARTICLES ── */
  const ptVS = `
    attribute vec2  a_pos;
    attribute float a_size;
    attribute float a_alpha;
    attribute float a_type;   /* 0=gold star, 1=steel, 2=crimson accent */
    uniform   vec2  u_res;
    uniform   float u_time;
    uniform   vec2  u_mouse;
    varying   float v_alpha;
    varying   float v_type;
    void main(){
      vec2 pos = a_pos;
      /* gentle mouse repel */
      vec2 diff = pos - u_mouse;
      float d   = length(diff);
      float rep = smoothstep(120.0, 0.0, d);
      pos += normalize(diff + vec2(0.001)) * rep * 30.0;

      vec2 clip = (pos / u_res) * 2.0 - 1.0;
      clip.y = -clip.y;
      gl_Position  = vec4(clip, 0.0, 1.0);
      float pulse  = 1.0 + 0.25 * sin(u_time * 2.5 + a_type * 3.7 + a_alpha * 6.28);
      gl_PointSize = a_size * pulse;
      v_alpha = a_alpha * (1.0 - rep * 0.5);
      v_type  = a_type;
    }
  `;

  const ptFS = `
    precision mediump float;
    varying float v_alpha;
    varying float v_type;
    uniform float u_time;
    void main(){
      vec2 c = gl_PointCoord - 0.5;
      float r = length(c);
      if(r > 0.5) discard;

      /* soft glow disk */
      float core = 1.0 - smoothstep(0.0, 0.15, r);
      float halo = 1.0 - smoothstep(0.0, 0.5,  r);

      /* palette per type */
      vec3 col;
      if(v_type < 0.5){
        col = mix(vec3(0.91,0.72,0.29), vec3(1.0,0.95,0.70), core);   /* gold */
      } else if(v_type < 1.5){
        col = mix(vec3(0.36,0.56,0.73), vec3(0.65,0.82,0.95), core);  /* steel blue */
      } else {
        col = mix(vec3(0.72,0.30,0.30), vec3(1.0,0.60,0.50), core);   /* crimson */
      }

      float a = v_alpha * (halo * 0.55 + core * 0.9);
      gl_FragColor = vec4(col, clamp(a, 0.0, 1.0));
    }
  `;

  /* ── RING SHADER ── */
  const ringVS = `
    attribute vec2 a_pos;
    uniform   vec2 u_res;
    void main(){
      vec2 clip = (a_pos / u_res) * 2.0 - 1.0;
      clip.y = -clip.y;
      gl_Position = vec4(clip, 0.0, 1.0);
    }
  `;
  const ringFS = `
    precision mediump float;
    uniform vec4 u_color;
    void main(){ gl_FragColor = u_color; }
  `;

  /* ── compile ── */
  function prog(vs, fs){
    function sh(t,s){ const x=gl.createShader(t); gl.shaderSource(x,s); gl.compileShader(x); return x; }
    const p = gl.createProgram();
    gl.attachShader(p, sh(gl.VERTEX_SHADER, vs));
    gl.attachShader(p, sh(gl.FRAGMENT_SHADER, fs));
    gl.linkProgram(p);
    return p;
  }

  const bgProg   = prog(bgVS,   bgFS);
  const ptProg   = prog(ptVS,   ptFS);
  const ringProg = prog(ringVS, ringFS);

  /* quad */
  const qBuf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, qBuf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1,1,-1,1,1,-1,1]), gl.STATIC_DRAW);

  /* bg uniforms */
  gl.useProgram(bgProg);
  const bgPosL  = gl.getAttribLocation(bgProg,  'a_pos');
  const bgTimeL = gl.getUniformLocation(bgProg,  'u_time');
  const bgMuseL = gl.getUniformLocation(bgProg,  'u_mouse');
  const bgResL  = gl.getUniformLocation(bgProg,  'u_res');

  /* ── PARTICLES  ── only 180, clean field */
  const N = 180;
  const pPos   = new Float32Array(N*2);
  const pVel   = new Float32Array(N*2);
  const pSize  = new Float32Array(N);
  const pAlpha = new Float32Array(N);
  const pType  = new Float32Array(N);

  for(let i=0;i<N;i++){
    pPos[i*2]   = Math.random() * window.innerWidth;
    pPos[i*2+1] = Math.random() * window.innerHeight;
    const sp = 0.06 + Math.random()*0.18;
    const an = Math.random()*Math.PI*2;
    pVel[i*2]   = Math.cos(an)*sp;
    pVel[i*2+1] = Math.sin(an)*sp;
    /* tiered sizes: majority tiny (0.5–2), some medium (3–5), few large (6–10) */
    const tier = Math.random();
    pSize[i]  = tier<0.65 ? 0.8+Math.random()*1.5
              : tier<0.88 ? 3.0+Math.random()*2.5
              :              6.0+Math.random()*4.5;
    pAlpha[i] = 0.35 + Math.random()*0.55;
    /* 65% gold, 25% steel, 10% crimson — matching logo */
    pType[i]  = Math.random()<0.65 ? 0 : Math.random()<0.72 ? 1 : 2;
  }

  const posBuf   = gl.createBuffer();
  const sizeBuf  = gl.createBuffer();
  const alphaBuf = gl.createBuffer();
  const typeBuf  = gl.createBuffer();

  gl.useProgram(ptProg);
  const ptPosL   = gl.getAttribLocation(ptProg, 'a_pos');
  const ptSizeL  = gl.getAttribLocation(ptProg, 'a_size');
  const ptAlphaL = gl.getAttribLocation(ptProg, 'a_alpha');
  const ptTypeL  = gl.getAttribLocation(ptProg, 'a_type');
  const ptResL   = gl.getUniformLocation(ptProg, 'u_res');
  const ptTimeL  = gl.getUniformLocation(ptProg, 'u_time');
  const ptMouseL = gl.getUniformLocation(ptProg, 'u_mouse');

  /* ring geom */
  const ringPosL  = gl.getAttribLocation(ringProg, 'a_pos');
  const ringResL  = gl.getUniformLocation(ringProg, 'u_res');
  const ringColL  = gl.getUniformLocation(ringProg, 'u_color');
  const ringBuf   = gl.createBuffer();

  /* Only 2 clean slow rings — centered, minimal */
  const RINGS = [
    { px:0.5, py:0.38, r:210, thick:0.9, speed:0.06,  col:[0.91,0.72,0.29], alpha:0.18, phase:0 },
    { px:0.5, py:0.38, r:310, thick:0.5, speed:-0.04, col:[0.36,0.56,0.73], alpha:0.10, phase:1.6 },
  ];

  function ringVerts(cx,cy,r,thick,segs){
    const v=[];
    for(let i=0;i<segs;i++){
      const a0=(i/segs)*Math.PI*2, a1=((i+1)/segs)*Math.PI*2;
      v.push(
        cx+Math.cos(a0)*r,       cy+Math.sin(a0)*r,
        cx+Math.cos(a0)*(r-thick),cy+Math.sin(a0)*(r-thick),
        cx+Math.cos(a1)*r,       cy+Math.sin(a1)*r,
        cx+Math.cos(a1)*(r-thick),cy+Math.sin(a1)*(r-thick),
        cx+Math.cos(a1)*r,       cy+Math.sin(a1)*r,
        cx+Math.cos(a0)*(r-thick),cy+Math.sin(a0)*(r-thick)
      );
    }
    return v;
  }

  let mouse = { x: window.innerWidth*0.5, y: window.innerHeight*0.5 };
  document.addEventListener('mousemove', e=>{ mouse.x=e.clientX; mouse.y=e.clientY; });

  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

  let T = 0;
  function draw(){
    T += 0.016;
    const W = canvas.width, H = canvas.height;

    /* 1) ocean background */
    gl.useProgram(bgProg);
    gl.uniform1f(bgTimeL, T);
    gl.uniform2f(bgMuseL, mouse.x, mouse.y);
    gl.uniform2f(bgResL, W, H);
    gl.bindBuffer(gl.ARRAY_BUFFER, qBuf);
    gl.enableVertexAttribArray(bgPosL);
    gl.vertexAttribPointer(bgPosL, 2, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.TRIANGLES, 0, 6);

    /* 2) two clean orbit rings */
    gl.useProgram(ringProg);
    gl.uniform2f(ringResL, W, H);
    for(const rg of RINGS){
      const cx = rg.px*W + Math.cos(T*rg.speed+rg.phase)*6;
      const cy = rg.py*H + Math.sin(T*rg.speed*1.3+rg.phase)*4;
      const pls = 1.0 + 0.04*Math.sin(T*1.2+rg.phase);
      const verts = ringVerts(cx, cy, rg.r*pls, rg.thick, 120);
      gl.bindBuffer(gl.ARRAY_BUFFER, ringBuf);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.DYNAMIC_DRAW);
      gl.enableVertexAttribArray(ringPosL);
      gl.vertexAttribPointer(ringPosL, 2, gl.FLOAT, false, 0, 0);
      const a = rg.alpha * (0.85 + 0.15*Math.sin(T*1.8+rg.phase));
      gl.uniform4f(ringColL, rg.col[0], rg.col[1], rg.col[2], a);
      gl.drawArrays(gl.TRIANGLES, 0, verts.length/2);
    }

    /* 3) update + draw particles */
    for(let i=0;i<N;i++){
      pPos[i*2]   += pVel[i*2]   + 0.008*Math.sin(T*0.6+i*0.4);
      pPos[i*2+1] += pVel[i*2+1] + 0.008*Math.cos(T*0.5+i*0.3);
      if(pPos[i*2]<0)   pVel[i*2]   =  Math.abs(pVel[i*2]);
      if(pPos[i*2]>W)   pVel[i*2]   = -Math.abs(pVel[i*2]);
      if(pPos[i*2+1]<0) pVel[i*2+1] =  Math.abs(pVel[i*2+1]);
      if(pPos[i*2+1]>H) pVel[i*2+1] = -Math.abs(pVel[i*2+1]);
    }

    gl.useProgram(ptProg);
    gl.uniform2f(ptResL, W, H);
    gl.uniform1f(ptTimeL, T);
    gl.uniform2f(ptMouseL, mouse.x, mouse.y);

    gl.bindBuffer(gl.ARRAY_BUFFER, posBuf);
    gl.bufferData(gl.ARRAY_BUFFER, pPos, gl.DYNAMIC_DRAW);
    gl.enableVertexAttribArray(ptPosL);
    gl.vertexAttribPointer(ptPosL, 2, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, sizeBuf);
    gl.bufferData(gl.ARRAY_BUFFER, pSize, gl.STATIC_DRAW);
    gl.enableVertexAttribArray(ptSizeL);
    gl.vertexAttribPointer(ptSizeL, 1, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, alphaBuf);
    gl.bufferData(gl.ARRAY_BUFFER, pAlpha, gl.STATIC_DRAW);
    gl.enableVertexAttribArray(ptAlphaL);
    gl.vertexAttribPointer(ptAlphaL, 1, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, typeBuf);
    gl.bufferData(gl.ARRAY_BUFFER, pType, gl.STATIC_DRAW);
    gl.enableVertexAttribArray(ptTypeL);
    gl.vertexAttribPointer(ptTypeL, 1, gl.FLOAT, false, 0, 0);

    gl.drawArrays(gl.POINTS, 0, N);

    requestAnimationFrame(draw);
  }
  draw();
}

function initScrollReveal(){
  const io=new IntersectionObserver(entries=>{
    entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');io.unobserve(e.target);}});
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

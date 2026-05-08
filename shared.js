/**
 * STEAMTOOLS - Shared Components
 * ULTRA WebGL Background — multi-layer particles, geometric rings, nebula
 */

function initWebGL() {
  const canvas = document.getElementById('webgl-bg');
  if (!canvas) return;
  const gl = canvas.getContext('webgl', { alpha: true, premultipliedAlpha: false })
           || canvas.getContext('experimental-webgl');
  if (!gl) { canvas.style.display = 'none'; return; }

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    gl.viewport(0, 0, canvas.width, canvas.height);
  }
  resize();
  window.addEventListener('resize', resize);

  const particleVS = `
    attribute vec2 a_pos;
    attribute float a_size;
    attribute float a_alpha;
    attribute float a_hue;
    uniform vec2 u_res;
    uniform float u_time;
    uniform vec2 u_mouse;
    varying float v_alpha;
    varying float v_hue;
    varying float v_glow;
    void main() {
      vec2 pos = a_pos;
      vec2 toMouse = u_mouse - pos;
      float dist = length(toMouse);
      float attract = smoothstep(220.0, 0.0, dist) * 0.55;
      pos += normalize(toMouse + vec2(0.001)) * attract * dist * 0.18;
      float repel = smoothstep(80.0, 0.0, dist);
      vec2 away = normalize(pos - u_mouse + vec2(0.001));
      pos += away * repel * 40.0;
      vec2 clip = (pos / u_res) * 2.0 - 1.0;
      clip.y = -clip.y;
      gl_Position = vec4(clip, 0.0, 1.0);
      float pulse = 1.0 + 0.3 * sin(u_time * 3.0 + a_hue * 10.0);
      gl_PointSize = a_size * pulse * (1.0 + repel * 3.0);
      v_alpha = a_alpha * (1.0 - repel * 0.4);
      v_hue = a_hue;
      v_glow = repel;
    }
  `;

  const particleFS = `
    precision mediump float;
    varying float v_alpha;
    varying float v_hue;
    varying float v_glow;
    uniform float u_time;
    vec3 hsl2rgb(float h, float s, float l) {
      float c = (1.0 - abs(2.0 * l - 1.0)) * s;
      float x = c * (1.0 - abs(mod(h * 6.0, 2.0) - 1.0));
      float m = l - c * 0.5;
      vec3 rgb;
      if (h < 0.1667) rgb = vec3(c, x, 0.0);
      else if (h < 0.3333) rgb = vec3(x, c, 0.0);
      else if (h < 0.5) rgb = vec3(0.0, c, x);
      else if (h < 0.6667) rgb = vec3(0.0, x, c);
      else if (h < 0.8333) rgb = vec3(x, 0.0, c);
      else rgb = vec3(c, 0.0, x);
      return rgb + m;
    }
    void main() {
      vec2 coord = gl_PointCoord - 0.5;
      float r = length(coord);
      if (r > 0.5) discard;
      float core = 1.0 - smoothstep(0.0, 0.18, r);
      float mid  = 1.0 - smoothstep(0.1, 0.42, r);
      float glow = 1.0 - smoothstep(0.0, 0.5, r);
      float hue = mod(v_hue + u_time * 0.04, 1.0);
      vec3 coreCol = hsl2rgb(hue, 0.9, 0.88);
      vec3 midCol  = hsl2rgb(mod(hue + 0.08, 1.0), 1.0, 0.58);
      vec3 glowCol = hsl2rgb(mod(hue + 0.18, 1.0), 1.0, 0.38);
      vec3 col = coreCol * core + midCol * mid * 0.6 + glowCol * glow * 0.3;
      float alpha = v_alpha * (glow * 0.5 + mid * 0.4 + core * 0.8);
      alpha *= 1.0 + v_glow * 1.5;
      gl_FragColor = vec4(col, clamp(alpha, 0.0, 1.0));
    }
  `;

  const shapeVS = `
    attribute vec2 a_pos;
    uniform vec2 u_res;
    void main() {
      vec2 clip = (a_pos / u_res) * 2.0 - 1.0;
      clip.y = -clip.y;
      gl_Position = vec4(clip, 0.0, 1.0);
    }
  `;

  const shapeFS = `
    precision mediump float;
    uniform vec4 u_color;
    void main() { gl_FragColor = u_color; }
  `;

  const nebulaVS = `
    attribute vec2 a_pos;
    varying vec2 v_uv;
    void main() { v_uv = a_pos * 0.5 + 0.5; gl_Position = vec4(a_pos, 0.0, 1.0); }
  `;

  const nebulaFS = `
    precision mediump float;
    varying vec2 v_uv;
    uniform float u_time;
    uniform vec2 u_mouse;
    uniform vec2 u_res;
    float hash(vec2 p) {
      p = fract(p * vec2(234.34, 435.345));
      p += dot(p, p + 34.23);
      return fract(p.x * p.y);
    }
    float noise(vec2 p) {
      vec2 i = floor(p); vec2 f = fract(p);
      f = f * f * (3.0 - 2.0 * f);
      return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);
    }
    float fbm(vec2 p) {
      float v=0.0; float a=0.5;
      for(int i=0;i<5;i++){v+=a*noise(p);p*=2.1;a*=0.5;}
      return v;
    }
    void main() {
      vec2 uv = v_uv;
      vec2 mouse = u_mouse / u_res;
      float t = u_time * 0.12;
      vec2 p = uv * 3.5;
      p += vec2(sin(t * 0.7), cos(t * 0.5)) * 0.4;
      float n1 = fbm(p + t * 0.3);
      float n2 = fbm(p * 1.4 - t * 0.2 + vec2(3.7, 1.1));
      float n3 = fbm(p * 0.6 + t * 0.1 + n1 * 0.8);
      vec2 mDiff = uv - mouse;
      float mDist = length(mDiff);
      float mInfluence = smoothstep(0.5, 0.0, mDist) * 0.35;
      n1 += mInfluence * (1.0 - n1);
      float nebula = smoothstep(0.35, 0.75, n3 * n1 + n2 * 0.3);
      float thin   = smoothstep(0.55, 0.65, n1 + n2 * 0.2);
      float swirl = fbm(uv * 5.0 + t * 0.5);
      vec3 neb_cyan   = vec3(0.0, 0.72, 1.0);
      vec3 neb_violet = vec3(0.45, 0.1, 0.9);
      vec3 neb_hot    = vec3(0.7, 0.9, 1.0);
      vec3 neb_pink   = vec3(1.0, 0.2, 0.7);
      vec3 nebColor = mix(neb_cyan, neb_violet, swirl);
      nebColor = mix(nebColor, neb_hot, thin * 0.6);
      nebColor = mix(nebColor, neb_pink, fbm(p * 2.0 - t) * 0.4);
      float alpha = nebula * 0.45 + thin * 0.30;
      gl_FragColor = vec4(nebColor, alpha * 0.9);
    }
  `;

  function makeProgram(vsrc, fsrc) {
    function compile(type, src) {
      const s = gl.createShader(type);
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    }
    const p = gl.createProgram();
    gl.attachShader(p, compile(gl.VERTEX_SHADER, vsrc));
    gl.attachShader(p, compile(gl.FRAGMENT_SHADER, fsrc));
    gl.linkProgram(p);
    return p;
  }

  const nebProg   = makeProgram(nebulaVS, nebulaFS);
  const partProg  = makeProgram(particleVS, particleFS);
  const shapeProg = makeProgram(shapeVS, shapeFS);

  const quadBuf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, quadBuf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1,1,-1,1,1,-1,1]), gl.STATIC_DRAW);

  gl.useProgram(nebProg);
  const nebPos   = gl.getAttribLocation(nebProg, 'a_pos');
  const nebTime  = gl.getUniformLocation(nebProg, 'u_time');
  const nebMouse = gl.getUniformLocation(nebProg, 'u_mouse');
  const nebRes   = gl.getUniformLocation(nebProg, 'u_res');

  const COUNT = 420;
  const positions  = new Float32Array(COUNT * 2);
  const velocities = new Float32Array(COUNT * 2);
  const sizes      = new Float32Array(COUNT);
  const alphas     = new Float32Array(COUNT);
  const hues       = new Float32Array(COUNT);

  for (let i = 0; i < COUNT; i++) {
    positions[i*2]   = Math.random() * window.innerWidth;
    positions[i*2+1] = Math.random() * window.innerHeight;
    const speed = 0.08 + Math.random() * 0.22;
    const angle = Math.random() * Math.PI * 2;
    velocities[i*2]   = Math.cos(angle) * speed;
    velocities[i*2+1] = Math.sin(angle) * speed;
    const tier = Math.random();
    sizes[i] = tier < 0.5 ? (1.0 + Math.random() * 1.5) : tier < 0.82 ? (2.5 + Math.random() * 3.5) : (5.0 + Math.random() * 7.0);
    alphas[i] = 0.55 + Math.random() * 0.45;
    const hueCluster = [0.52, 0.55, 0.60, 0.65, 0.72, 0.78, 0.86, 0.90, 0.95];
    hues[i] = hueCluster[Math.floor(Math.random() * hueCluster.length)] + (Math.random() - 0.5) * 0.05;
  }

  const posBuf   = gl.createBuffer();
  const sizeBuf  = gl.createBuffer();
  const alphaBuf = gl.createBuffer();
  const hueBuf   = gl.createBuffer();

  gl.useProgram(partProg);
  const pPos   = gl.getAttribLocation(partProg, 'a_pos');
  const pSize  = gl.getAttribLocation(partProg, 'a_size');
  const pAlpha = gl.getAttribLocation(partProg, 'a_alpha');
  const pHue   = gl.getAttribLocation(partProg, 'a_hue');
  const pRes   = gl.getUniformLocation(partProg, 'u_res');
  const pTime  = gl.getUniformLocation(partProg, 'u_time');
  const pMouse = gl.getUniformLocation(partProg, 'u_mouse');

  const shapePosBuf = gl.createBuffer();
  gl.useProgram(shapeProg);
  const shapePosLoc = gl.getAttribLocation(shapeProg, 'a_pos');
  const shapeResLoc = gl.getUniformLocation(shapeProg, 'u_res');
  const shapeColLoc = gl.getUniformLocation(shapeProg, 'u_color');

  const connBuf = gl.createBuffer();

  function ringVerts(cx, cy, r, thickness, segments) {
    const verts = [];
    for (let i = 0; i < segments; i++) {
      const a0 = (i / segments) * Math.PI * 2;
      const a1 = ((i + 1) / segments) * Math.PI * 2;
      verts.push(
        cx+Math.cos(a0)*r, cy+Math.sin(a0)*r,
        cx+Math.cos(a0)*(r-thickness), cy+Math.sin(a0)*(r-thickness),
        cx+Math.cos(a1)*r, cy+Math.sin(a1)*r,
        cx+Math.cos(a1)*(r-thickness), cy+Math.sin(a1)*(r-thickness),
        cx+Math.cos(a1)*r, cy+Math.sin(a1)*r,
        cx+Math.cos(a0)*(r-thickness), cy+Math.sin(a0)*(r-thickness)
      );
    }
    return verts;
  }

  function hexVerts(cx, cy, r, thickness) { return ringVerts(cx, cy, r, thickness, 6); }

  const rings = [
    { px:0.5, py:0.35, r:180, thick:1.2, speed:0.18,  hue:0.58, alpha:0.55, phase:0 },
    { px:0.5, py:0.35, r:260, thick:0.8, speed:-0.11, hue:0.75, alpha:0.40, phase:1.1 },
    { px:0.5, py:0.35, r:360, thick:0.5, speed:0.07,  hue:0.88, alpha:0.30, phase:2.2 },
    { px:0.72,py:0.7,  r:120, thick:1.0, speed:-0.22, hue:0.62, alpha:0.45, phase:0.5 },
    { px:0.22,py:0.6,  r:90,  thick:1.5, speed:0.30,  hue:0.82, alpha:0.50, phase:3.1 },
  ];

  const hexes = [
    { px:0.5, py:0.35, r:110, thick:1.8, speed:0.08,  hue:0.60, alpha:0.60, phase:0.7 },
    { px:0.5, py:0.35, r:200, thick:1.0, speed:-0.05, hue:0.80, alpha:0.40, phase:2.1 },
    { px:0.8, py:0.2,  r:60,  thick:1.2, speed:0.14,  hue:0.55, alpha:0.50, phase:1.4 },
    { px:0.15,py:0.8,  r:75,  thick:1.0, speed:-0.19, hue:0.90, alpha:0.45, phase:0.3 },
  ];

  let mouse = { x: window.innerWidth * 0.5, y: window.innerHeight * 0.5 };
  document.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });

  function hslToRgb(h, s, l) {
    let r, g, b;
    if (s === 0) { r = g = b = l; }
    else {
      const hue2rgb = (p, q, t) => {
        if (t<0)t+=1;if(t>1)t-=1;
        if(t<1/6)return p+(q-p)*6*t;
        if(t<1/2)return q;
        if(t<2/3)return p+(q-p)*(2/3-t)*6;
        return p;
      };
      const q = l<0.5?l*(1+s):l+s-l*s, p=2*l-q;
      r=hue2rgb(p,q,h+1/3); g=hue2rgb(p,q,h); b=hue2rgb(p,q,h-1/3);
    }
    return [r, g, b];
  }

  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

  let t = 0;
  function draw() {
    t += 0.016;
    const W = canvas.width, H = canvas.height;
    gl.clearColor(0.01, 0.01, 0.06, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // 1) Nebula
    gl.useProgram(nebProg);
    gl.uniform1f(nebTime, t);
    gl.uniform2f(nebMouse, mouse.x, mouse.y);
    gl.uniform2f(nebRes, W, H);
    gl.bindBuffer(gl.ARRAY_BUFFER, quadBuf);
    gl.enableVertexAttribArray(nebPos);
    gl.vertexAttribPointer(nebPos, 2, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.TRIANGLES, 0, 6);

    // 2) Shapes
    gl.useProgram(shapeProg);
    gl.uniform2f(shapeResLoc, W, H);

    function drawShapes(shapes, vertFn) {
      for (const s of shapes) {
        const angle = t * s.speed + s.phase;
        const cx = s.px * W + Math.cos(angle * 0.3) * 18;
        const cy = s.py * H + Math.sin(angle * 0.4) * 12;
        const pulse = 1.0 + 0.06 * Math.sin(t * 1.5 + s.phase);
        const verts = vertFn(cx, cy, s.r * pulse, s.thick);
        gl.bindBuffer(gl.ARRAY_BUFFER, shapePosBuf);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.DYNAMIC_DRAW);
        gl.enableVertexAttribArray(shapePosLoc);
        gl.vertexAttribPointer(shapePosLoc, 2, gl.FLOAT, false, 0, 0);
        const rh = (s.hue + t * 0.02) % 1.0;
        const [r,g,b] = hslToRgb(rh, 1.0, 0.7);
        const a = s.alpha * (0.8 + 0.2 * Math.sin(t * 2 + s.phase));
        gl.uniform4f(shapeColLoc, r, g, b, a);
        gl.drawArrays(gl.TRIANGLES, 0, verts.length / 2);
      }
    }

    drawShapes(rings, (cx,cy,r,th) => ringVerts(cx,cy,r,th,80));
    drawShapes(hexes, (cx,cy,r,th) => hexVerts(cx,cy,r,th));

    // 3) Connection lines
    const connVerts = [];
    for (let i = 0; i < COUNT; i += 3) {
      for (let j = i + 1; j < COUNT; j += 3) {
        const dx = positions[i*2]-positions[j*2], dy = positions[i*2+1]-positions[j*2+1];
        if (Math.sqrt(dx*dx+dy*dy) < 110) {
          connVerts.push(positions[i*2], positions[i*2+1], positions[j*2], positions[j*2+1]);
        }
      }
    }
    if (connVerts.length > 0) {
      gl.bindBuffer(gl.ARRAY_BUFFER, connBuf);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(connVerts), gl.DYNAMIC_DRAW);
      gl.enableVertexAttribArray(shapePosLoc);
      gl.vertexAttribPointer(shapePosLoc, 2, gl.FLOAT, false, 0, 0);
      const lh = (0.58 + t * 0.025) % 1.0;
      const [lr,lg,lb] = hslToRgb(lh, 1.0, 0.7);
      gl.uniform4f(shapeColLoc, lr, lg, lb, 0.22);
      gl.drawArrays(gl.LINES, 0, connVerts.length / 2);
    }

    // 4) Update particles
    for (let i = 0; i < COUNT; i++) {
      positions[i*2]   += velocities[i*2]   + 0.012 * Math.sin(t * 0.8 + i * 0.3);
      positions[i*2+1] += velocities[i*2+1] + 0.012 * Math.cos(t * 0.6 + i * 0.2);
      if (positions[i*2] < 0)   velocities[i*2]   =  Math.abs(velocities[i*2]);
      if (positions[i*2] > W)   velocities[i*2]   = -Math.abs(velocities[i*2]);
      if (positions[i*2+1] < 0) velocities[i*2+1] =  Math.abs(velocities[i*2+1]);
      if (positions[i*2+1] > H) velocities[i*2+1] = -Math.abs(velocities[i*2+1]);
    }

    gl.useProgram(partProg);
    gl.uniform2f(pRes, W, H);
    gl.uniform1f(pTime, t);
    gl.uniform2f(pMouse, mouse.x, mouse.y);

    gl.bindBuffer(gl.ARRAY_BUFFER, posBuf);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.DYNAMIC_DRAW);
    gl.enableVertexAttribArray(pPos);
    gl.vertexAttribPointer(pPos, 2, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, sizeBuf);
    gl.bufferData(gl.ARRAY_BUFFER, sizes, gl.STATIC_DRAW);
    gl.enableVertexAttribArray(pSize);
    gl.vertexAttribPointer(pSize, 1, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, alphaBuf);
    gl.bufferData(gl.ARRAY_BUFFER, alphas, gl.STATIC_DRAW);
    gl.enableVertexAttribArray(pAlpha);
    gl.vertexAttribPointer(pAlpha, 1, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, hueBuf);
    gl.bufferData(gl.ARRAY_BUFFER, hues, gl.STATIC_DRAW);
    gl.enableVertexAttribArray(pHue);
    gl.vertexAttribPointer(pHue, 1, gl.FLOAT, false, 0, 0);

    gl.drawArrays(gl.POINTS, 0, COUNT);
    requestAnimationFrame(draw);
  }
  draw();
}

function initCursor() {
  const dot = document.querySelector('.cursor-dot');
  const ring = document.querySelector('.cursor-ring');
  if (!dot || !ring) return;
  let mx = 0, my = 0, rx = 0, ry = 0;
  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
  document.querySelectorAll('a, button, .game-card, .feature-card').forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('hovered'));
    el.addEventListener('mouseleave', () => ring.classList.remove('hovered'));
  });
  (function loop() {
    rx += (mx - rx) * 0.12; ry += (my - ry) * 0.12;
    dot.style.transform = `translate(${mx}px,${my}px)`;
    ring.style.transform = `translate(${rx}px,${ry}px)`;
    requestAnimationFrame(loop);
  })();
}

function initScrollReveal() {
  const els = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); } });
  }, { threshold: 0.1 });
  els.forEach(el => io.observe(el));
}

function initNav() {
  window.addEventListener('scroll', () => {
    const nav = document.querySelector('nav');
    if (!nav) return;
    nav.classList.toggle('scrolled', window.scrollY > 40);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initWebGL();
  initCursor();
  initScrollReveal();
  initNav();
});

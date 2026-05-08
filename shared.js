/**
 * STEAMTOOLS - Shared Components
 * WebGL Background + Shared Nav Logic
 */

// ─── WebGL Particle Field ────────────────────────────────────────────────────
function initWebGL() {
  const canvas = document.getElementById('webgl-bg');
  if (!canvas) return;
  const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
  if (!gl) { canvas.style.display = 'none'; return; }

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    gl.viewport(0, 0, canvas.width, canvas.height);
  }
  resize();
  window.addEventListener('resize', resize);

  const vsSource = `
    attribute vec2 a_position;
    attribute float a_size;
    attribute float a_alpha;
    uniform vec2 u_resolution;
    uniform float u_time;
    uniform vec2 u_mouse;
    varying float v_alpha;
    void main() {
      vec2 pos = a_position;
      float dist = distance(pos, u_mouse);
      float repel = max(0.0, 1.0 - dist / 0.25);
      vec2 dir = normalize(pos - u_mouse + vec2(0.001));
      pos += dir * repel * 0.06;
      vec2 clip = (pos / u_resolution) * 2.0 - 1.0;
      clip.y = -clip.y;
      gl_Position = vec4(clip, 0.0, 1.0);
      gl_PointSize = a_size * (1.0 + repel * 2.0);
      v_alpha = a_alpha * (1.0 - repel * 0.3);
    }
  `;

  const fsSource = `
    precision mediump float;
    varying float v_alpha;
    uniform vec3 u_color1;
    uniform vec3 u_color2;
    uniform float u_time;
    void main() {
      vec2 coord = gl_PointCoord - vec2(0.5);
      float r = length(coord);
      if (r > 0.5) discard;
      float glow = 1.0 - smoothstep(0.0, 0.5, r);
      float pulse = 0.8 + 0.2 * sin(u_time * 2.0);
      vec3 col = mix(u_color1, u_color2, r * 2.0);
      gl_FragColor = vec4(col, v_alpha * glow * pulse);
    }
  `;

  function compileShader(type, src) {
    const s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    return s;
  }

  const prog = gl.createProgram();
  gl.attachShader(prog, compileShader(gl.VERTEX_SHADER, vsSource));
  gl.attachShader(prog, compileShader(gl.FRAGMENT_SHADER, fsSource));
  gl.linkProgram(prog);
  gl.useProgram(prog);

  const COUNT = 180;
  const positions = new Float32Array(COUNT * 2);
  const velocities = new Float32Array(COUNT * 2);
  const sizes = new Float32Array(COUNT);
  const alphas = new Float32Array(COUNT);

  for (let i = 0; i < COUNT; i++) {
    positions[i * 2] = Math.random() * window.innerWidth;
    positions[i * 2 + 1] = Math.random() * window.innerHeight;
    const speed = 0.1 + Math.random() * 0.25;
    const angle = Math.random() * Math.PI * 2;
    velocities[i * 2] = Math.cos(angle) * speed;
    velocities[i * 2 + 1] = Math.sin(angle) * speed;
    sizes[i] = 1.5 + Math.random() * 3.5;
    alphas[i] = 0.3 + Math.random() * 0.5;
  }

  const posBuf = gl.createBuffer();
  const sizeBuf = gl.createBuffer();
  const alphaBuf = gl.createBuffer();

  const aPos = gl.getAttribLocation(prog, 'a_position');
  const aSize = gl.getAttribLocation(prog, 'a_size');
  const aAlpha = gl.getAttribLocation(prog, 'a_alpha');
  const uRes = gl.getUniformLocation(prog, 'u_resolution');
  const uTime = gl.getUniformLocation(prog, 'u_time');
  const uMouse = gl.getUniformLocation(prog, 'u_mouse');
  const uCol1 = gl.getUniformLocation(prog, 'u_color1');
  const uCol2 = gl.getUniformLocation(prog, 'u_color2');

  gl.uniform3f(uCol1, 0.0, 0.82, 1.0);
  gl.uniform3f(uCol2, 0.22, 0.48, 0.84);

  let mouse = { x: -9999, y: -9999 };
  document.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });

  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE);

  let t = 0;
  function draw() {
    t += 0.016;
    const W = canvas.width, H = canvas.height;

    for (let i = 0; i < COUNT; i++) {
      positions[i * 2] += velocities[i * 2];
      positions[i * 2 + 1] += velocities[i * 2 + 1];
      if (positions[i * 2] < 0 || positions[i * 2] > W) velocities[i * 2] *= -1;
      if (positions[i * 2 + 1] < 0 || positions[i * 2 + 1] > H) velocities[i * 2 + 1] *= -1;
    }

    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.uniform2f(uRes, W, H);
    gl.uniform1f(uTime, t);
    gl.uniform2f(uMouse, mouse.x, mouse.y);

    gl.bindBuffer(gl.ARRAY_BUFFER, posBuf);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.DYNAMIC_DRAW);
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, sizeBuf);
    gl.bufferData(gl.ARRAY_BUFFER, sizes, gl.STATIC_DRAW);
    gl.enableVertexAttribArray(aSize);
    gl.vertexAttribPointer(aSize, 1, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, alphaBuf);
    gl.bufferData(gl.ARRAY_BUFFER, alphas, gl.STATIC_DRAW);
    gl.enableVertexAttribArray(aAlpha);
    gl.vertexAttribPointer(aAlpha, 1, gl.FLOAT, false, 0, 0);

    gl.drawArrays(gl.POINTS, 0, COUNT);
    requestAnimationFrame(draw);
  }
  draw();
}

// ─── Cursor ─────────────────────────────────────────────────────────────────
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
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    dot.style.transform = `translate(${mx}px,${my}px)`;
    ring.style.transform = `translate(${rx}px,${ry}px)`;
    requestAnimationFrame(loop);
  })();
}

// ─── Scroll Reveal ──────────────────────────────────────────────────────────
function initScrollReveal() {
  const els = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); } });
  }, { threshold: 0.1 });
  els.forEach(el => io.observe(el));
}

// ─── Navbar ──────────────────────────────────────────────────────────────────
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

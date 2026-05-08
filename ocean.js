// ══════════════════════════════════════════════════════════════
//  STEAMTOOLS — Premium Light WebGL Background
//  Soft floating particles + animated mesh gradient + mouse parallax
//  Elegant, minimal, Apple-level smoothness
// ══════════════════════════════════════════════════════════════
(function () {
  const canvas = document.getElementById('ocean-bg');
  if (!canvas) return;
  const gl = canvas.getContext('webgl', { antialias: true, alpha: false });
  if (!gl) { canvas.style.background = 'linear-gradient(135deg, #f0f4ff 0%, #e8f0ff 50%, #f5f0ff 100%)'; return; }

  let W, H, mouse = { x: 0.5, y: 0.5 }, mouseTarget = { x: 0.5, y: 0.5 };

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
    gl.viewport(0, 0, W, H);
  }
  resize();
  window.addEventListener('resize', resize);
  document.addEventListener('mousemove', e => {
    mouseTarget.x = e.clientX / window.innerWidth;
    mouseTarget.y = e.clientY / window.innerHeight;
  });

  // ── Full-screen gradient + orbs shader ──────────────────────
  const VS = `attribute vec2 aPos; void main(){ gl_Position=vec4(aPos,0,1); }`;

  const FS = `
    precision highp float;
    uniform vec2  uRes;
    uniform float uTime;
    uniform vec2  uMouse;

    float hash(vec2 p){ return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453); }
    float noise(vec2 p){
      vec2 i=floor(p), f=fract(p);
      f=f*f*(3.-2.*f);
      return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);
    }
    float fbm(vec2 p){
      float v=0.,a=.5;
      for(int i=0;i<4;i++){ v+=a*noise(p); p=p*2.1+vec2(1.3,.7); a*=.52; }
      return v;
    }

    void main(){
      vec2 uv = gl_FragCoord.xy / uRes;
      float t  = uTime * 0.18;
      vec2 m   = uMouse;

      // Base gradient — creamy white to icy lavender-blue
      vec3 col0 = vec3(0.972, 0.975, 0.992);
      vec3 col1 = vec3(0.910, 0.925, 0.980);
      vec3 col2 = vec3(0.940, 0.930, 0.975);
      float base = fbm(uv * 2.2 + vec2(t * 0.4, t * 0.3));
      vec3 bg = mix(mix(col0, col1, base), col2, fbm(uv * 1.5 - t * 0.2));

      // Soft ambient orbs — mouse-reactive
      vec2 o1 = vec2(0.18 + sin(t*0.7)*0.08 + m.x*0.05, 0.20 + cos(t*0.5)*0.06 + m.y*0.04);
      float d1 = length(uv - o1);
      vec3 orb1 = vec3(0.72, 0.83, 0.98) * exp(-d1*d1*3.8);

      vec2 o2 = vec2(0.82 + sin(t*0.5)*0.07 - m.x*0.04, 0.16 + cos(t*0.6)*0.05 + m.y*0.02);
      float d2 = length(uv - o2);
      vec3 orb2 = vec3(0.68, 0.90, 0.96) * exp(-d2*d2*4.5);

      vec2 o3 = vec2(0.50 + sin(t*0.3)*0.12 + m.x*0.02, 0.82 + cos(t*0.4)*0.07 - m.y*0.03);
      float d3 = length(uv - o3);
      vec3 orb3 = vec3(0.80, 0.72, 0.96) * exp(-d3*d3*3.2);

      vec2 o4 = vec2(0.14 + cos(t*0.45)*0.06, 0.72 + sin(t*0.55)*0.08);
      float d4 = length(uv - o4);
      vec3 orb4 = vec3(0.88, 0.78, 0.96) * exp(-d4*d4*5.0);

      vec2 o5 = vec2(0.88 + sin(t*0.6)*0.05, 0.55 + cos(t*0.35)*0.10);
      float d5 = length(uv - o5);
      vec3 orb5 = vec3(0.60, 0.80, 0.98) * exp(-d5*d5*4.0);

      vec3 color = bg + orb1*0.26 + orb2*0.22 + orb3*0.20 + orb4*0.14 + orb5*0.18;

      // Subtle noise grain
      float grain = noise(uv * 320.0 + t) * 0.010;
      color += grain;

      // Very gentle vignette
      vec2 vc = uv * 2.0 - 1.0;
      float vign = 1.0 - dot(vc * vec2(0.32, 0.45), vc * vec2(0.32, 0.45));
      color *= 0.90 + 0.10 * smoothstep(0.0, 1.0, vign);

      color = clamp(color, 0.0, 1.0);
      gl_FragColor = vec4(color, 1.0);
    }
  `;

  function compile(type, src) {
    const s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS))
      console.error('Shader error:', gl.getShaderInfoLog(s));
    return s;
  }

  const prog = gl.createProgram();
  gl.attachShader(prog, compile(gl.VERTEX_SHADER, VS));
  gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FS));
  gl.linkProgram(prog);
  gl.useProgram(prog);

  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW);
  const aPos = gl.getAttribLocation(prog, 'aPos');
  gl.enableVertexAttribArray(aPos);
  gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

  const uRes   = gl.getUniformLocation(prog, 'uRes');
  const uTime  = gl.getUniformLocation(prog, 'uTime');
  const uMouse = gl.getUniformLocation(prog, 'uMouse');

  // ── Particle layer ───────────────────────────────────────────
  const particleVS = `
    attribute vec2  aPos;
    attribute float aSize;
    attribute float aAlpha;
    uniform vec2 uRes;
    varying float vAlpha;
    void main(){
      vec2 clip = (aPos / uRes) * 2.0 - 1.0;
      clip.y = -clip.y;
      gl_Position = vec4(clip, 0, 1);
      gl_PointSize = aSize;
      vAlpha = aAlpha;
    }
  `;
  const particleFS = `
    precision mediump float;
    varying float vAlpha;
    uniform vec3 uColor;
    void main(){
      vec2 c = gl_PointCoord - 0.5;
      float r = length(c);
      if(r > 0.5) discard;
      float g = 1.0 - smoothstep(0.0, 0.5, r);
      gl_FragColor = vec4(uColor, g * vAlpha);
    }
  `;

  const pProg = gl.createProgram();
  gl.attachShader(pProg, compile(gl.VERTEX_SHADER, particleVS));
  gl.attachShader(pProg, compile(gl.FRAGMENT_SHADER, particleFS));
  gl.linkProgram(pProg);

  const N = 110;
  const pX = new Float32Array(N), pY = new Float32Array(N);
  const pVX = new Float32Array(N), pVY = new Float32Array(N);
  const pSize = new Float32Array(N), pAlpha = new Float32Array(N);
  const pPhase = new Float32Array(N);
  const pColors = [
    [0.62, 0.76, 0.96],
    [0.58, 0.88, 0.94],
    [0.76, 0.66, 0.94],
    [0.52, 0.78, 0.96]
  ];
  const pColorIdx = new Int32Array(N);

  for (let i = 0; i < N; i++) {
    pX[i] = Math.random() * 1920;
    pY[i] = Math.random() * 1080;
    const angle = Math.random() * Math.PI * 2;
    const speed = 0.06 + Math.random() * 0.10;
    pVX[i] = Math.cos(angle) * speed;
    pVY[i] = Math.sin(angle) * speed;
    pSize[i] = 2.0 + Math.random() * 5.0;
    pAlpha[i] = 0.14 + Math.random() * 0.30;
    pPhase[i] = Math.random() * Math.PI * 2;
    pColorIdx[i] = Math.floor(Math.random() * pColors.length);
  }

  const posBuf = gl.createBuffer();
  const szBuf  = gl.createBuffer();
  const alpBuf = gl.createBuffer();

  const p_aPos   = gl.getAttribLocation(pProg, 'aPos');
  const p_aSize  = gl.getAttribLocation(pProg, 'aSize');
  const p_aAlpha = gl.getAttribLocation(pProg, 'aAlpha');
  const p_uRes   = gl.getUniformLocation(pProg, 'uRes');
  const p_uColor = gl.getUniformLocation(pProg, 'uColor');

  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

  let lastT = 0;
  function frame(ts) {
    lastT = lastT || ts;
    lastT = ts;
    const T = ts * 0.001;

    mouse.x += (mouseTarget.x - mouse.x) * 0.035;
    mouse.y += (mouseTarget.y - mouse.y) * 0.035;

    W = canvas.width; H = canvas.height;

    // Background
    gl.useProgram(prog);
    gl.uniform2f(uRes, W, H);
    gl.uniform1f(uTime, T);
    gl.uniform2f(uMouse, mouse.x, mouse.y);
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

    // Update + draw particles
    gl.useProgram(pProg);
    gl.uniform2f(p_uRes, W, H);

    for (let ci = 0; ci < pColors.length; ci++) {
      const idx = [];
      for (let i = 0; i < N; i++) { if (pColorIdx[i] === ci) idx.push(i); }
      if (!idx.length) continue;

      const cPos = new Float32Array(idx.length * 2);
      const cSz  = new Float32Array(idx.length);
      const cAlp = new Float32Array(idx.length);

      idx.forEach((pi, j) => {
        const mx = (mouse.x * W - pX[pi]) * 0.00006;
        const my = (mouse.y * H - pY[pi]) * 0.00006;
        pVX[pi] += mx; pVY[pi] += my;
        const spd = Math.sqrt(pVX[pi]*pVX[pi]+pVY[pi]*pVY[pi]);
        if (spd > 0.30) { pVX[pi] /= spd/0.30; pVY[pi] /= spd/0.30; }
        pX[pi] += pVX[pi]; pY[pi] += pVY[pi];
        if (pX[pi] < -15) pX[pi] = W+15;
        if (pX[pi] > W+15) pX[pi] = -15;
        if (pY[pi] < -15) pY[pi] = H+15;
        if (pY[pi] > H+15) pY[pi] = -15;
        cPos[j*2]   = pX[pi];
        cPos[j*2+1] = pY[pi];
        cSz[j]  = pSize[pi] * (0.85 + 0.15 * Math.sin(T * 0.65 + pPhase[pi]));
        cAlp[j] = pAlpha[pi] * (0.65 + 0.35 * Math.sin(T * 0.45 + pPhase[pi] * 1.4));
      });

      gl.uniform3f(p_uColor, ...pColors[ci]);

      gl.bindBuffer(gl.ARRAY_BUFFER, posBuf);
      gl.bufferData(gl.ARRAY_BUFFER, cPos, gl.DYNAMIC_DRAW);
      gl.enableVertexAttribArray(p_aPos);
      gl.vertexAttribPointer(p_aPos, 2, gl.FLOAT, false, 0, 0);

      gl.bindBuffer(gl.ARRAY_BUFFER, szBuf);
      gl.bufferData(gl.ARRAY_BUFFER, cSz, gl.DYNAMIC_DRAW);
      gl.enableVertexAttribArray(p_aSize);
      gl.vertexAttribPointer(p_aSize, 1, gl.FLOAT, false, 0, 0);

      gl.bindBuffer(gl.ARRAY_BUFFER, alpBuf);
      gl.bufferData(gl.ARRAY_BUFFER, cAlp, gl.DYNAMIC_DRAW);
      gl.enableVertexAttribArray(p_aAlpha);
      gl.vertexAttribPointer(p_aAlpha, 1, gl.FLOAT, false, 0, 0);

      gl.drawArrays(gl.POINTS, 0, idx.length);
    }

    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
})();

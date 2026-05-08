// ══════════════════════════════════════════════════════════
//  REAL WEBGL OCEAN — Gerstner waves + sky gradient + foam
// ══════════════════════════════════════════════════════════
(function () {
  const canvas = document.getElementById('ocean-bg');
  const gl = canvas.getContext('webgl', { antialias: true, alpha: false });
  if (!gl) { canvas.style.background = 'linear-gradient(180deg,#b8dff5 0%,#5aaad6 100%)'; return; }

  let W, H;
  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
    gl.viewport(0, 0, W, H);
  }
  resize();
  window.addEventListener('resize', resize);

  // ── SHADERS ──────────────────────────────────────────────
  const VS = `
    attribute vec2 aPos;
    void main() { gl_Position = vec4(aPos, 0.0, 1.0); }
  `;

  const FS = `
    precision highp float;
    uniform vec2  uRes;
    uniform float uTime;

    // ── Gerstner wave ────────────────────────────────────
    //  Returns displaced XY position + normal contribution
    vec3 gerstner(vec2 pos, vec2 dir, float amp, float wlen, float speed, float steep) {
      float k    = 6.2831853 / wlen;
      float c    = sqrt(9.8 / k);
      float w    = k * c * speed;
      float phase= dot(dir, pos) * k - uTime * w;
      float s    = sin(phase);
      float c2   = cos(phase);
      return vec3(
        steep * amp * dir.x * c2,   // x displacement
        steep * amp * dir.y * c2,   // y displacement
        amp * s                      // height
      );
    }

    // ── Tiny noise hash ──────────────────────────────────
    float hash(vec2 p) {
      p = fract(p * vec2(127.1, 311.7));
      p += dot(p, p + 19.19);
      return fract(p.x * p.y);
    }
    float noise(vec2 p) {
      vec2 i = floor(p), f = fract(p);
      f = f*f*(3.0-2.0*f);
      return mix(
        mix(hash(i), hash(i+vec2(1,0)), f.x),
        mix(hash(i+vec2(0,1)), hash(i+vec2(1,1)), f.x), f.y);
    }
    float fbm(vec2 p) {
      float v=0.0, a=0.5;
      for(int i=0;i<5;i++){ v+=a*noise(p); p=p*2.1+vec2(1.3,0.7); a*=0.5; }
      return v;
    }

    void main() {
      vec2 uv = gl_FragCoord.xy / uRes;
      float aspect = uRes.x / uRes.y;

      // ── Horizon split: sky top, ocean bottom ─────────
      float horizon = 0.48 + sin(uTime * 0.05) * 0.01; // subtle bob
      float isOcean = step(uv.y, horizon); // 1 below horizon

      // ── World-space coordinate on ocean plane ────────
      // Perspective projection: y maps to depth
      float depth = max(0.001, horizon - uv.y);
      float perspY = horizon - uv.y; // distance below horizon
      float scale  = 0.5 / (perspY + 0.05); // perspective scale
      vec2 world   = vec2((uv.x - 0.5) * aspect * scale, scale);

      // ── Sum Gerstner waves ───────────────────────────
      float T = uTime * 0.5;
      vec3 g1 = gerstner(world, normalize(vec2(1.0, 0.8)),   0.045, 2.8, 0.9, 0.7);
      vec3 g2 = gerstner(world, normalize(vec2(-0.8, 1.0)),  0.030, 1.9, 1.1, 0.6);
      vec3 g3 = gerstner(world, normalize(vec2(0.5, -0.6)),  0.020, 1.2, 1.4, 0.5);
      vec3 g4 = gerstner(world, normalize(vec2(-0.3, 0.9)),  0.015, 0.7, 1.8, 0.4);
      vec3 g5 = gerstner(world, normalize(vec2(1.2, -0.4)),  0.010, 0.5, 2.2, 0.3);
      float height = g1.z + g2.z + g3.z + g4.z + g5.z;

      // ── Normal from Gerstner (approximate) ──────────
      vec3 disp  = vec3(g1.xy+g2.xy+g3.xy+g4.xy+g5.xy, height);
      vec2 dxz   = disp.xy;
      vec3 normal = normalize(vec3(-dxz.x * 2.0, 1.0, -dxz.y * 2.0));

      // ── Sun direction ────────────────────────────────
      vec3 sunDir = normalize(vec3(sin(uTime*0.04)*0.5, 0.55, 0.8));
      float sunDot = max(0.0, dot(normal, sunDir));

      // ── Deep water color based on depth ─────────────
      vec3 deepColor    = vec3(0.04, 0.18, 0.36);
      vec3 shallowColor = vec3(0.12, 0.48, 0.72);
      vec3 waterColor   = mix(deepColor, shallowColor, clamp(height * 3.0 + 0.5, 0.0, 1.0));

      // ── Fresnel reflection ───────────────────────────
      vec3 viewDir = normalize(vec3((uv.x-0.5)*aspect, uv.y - horizon, 1.0));
      float fresnel = pow(1.0 - max(0.0, dot(normal, viewDir)), 4.0);
      fresnel = clamp(fresnel, 0.0, 1.0);

      // ── Sky colors ───────────────────────────────────
      float skyT = clamp((uv.y - horizon) / (1.0 - horizon), 0.0, 1.0);
      vec3 skyHigh = vec3(0.42, 0.68, 0.95);
      vec3 skyHorizon = vec3(0.72, 0.88, 1.0);
      // Sun disc in sky
      vec2 sunUV = vec2(0.70, horizon + 0.28);
      float sunDist = length(uv - sunUV);
      float sunGlow = exp(-sunDist * 18.0) * 1.2;
      float sunDisc = smoothstep(0.028, 0.018, sunDist);
      vec3 skyColor = mix(skyHorizon, skyHigh, skyT);
      skyColor += vec3(1.0, 0.85, 0.6) * sunGlow * 0.5;
      skyColor += vec3(1.0, 0.97, 0.88) * sunDisc;

      // ── Reflected sky in water ───────────────────────
      // Mirror the sky lookup using the normal
      vec2 reflUV = vec2(uv.x + normal.x * 0.06, horizon + (horizon - uv.y) * 0.5 + normal.z * 0.04);
      float reflT = clamp((reflUV.y - horizon) / (1.0 - horizon), 0.0, 1.0);
      vec3 reflectedSky = mix(skyHorizon, skyHigh, clamp(reflT, 0.0, 1.0));
      // Reflected sun
      vec2 reflSunUV = vec2(0.70, horizon + 0.28);
      float reflSunDist = length(vec2(uv.x + normal.x * 0.1, 0.0) - vec2(reflSunUV.x, 0.0));
      float reflSunGlow = exp(-reflSunDist * 10.0 - depth * 6.0) * (0.8 + height * 0.5);
      reflectedSky += vec3(1.0, 0.9, 0.6) * reflSunGlow;

      // ── Specular highlight ───────────────────────────
      vec3 halfVec = normalize(sunDir + vec3(0.0, 0.3, 1.0));
      float spec = pow(max(0.0, dot(normal, halfVec)), 180.0);
      float spec2 = pow(max(0.0, dot(normal, halfVec)), 30.0) * 0.3;

      // ── Foam / whitecaps ─────────────────────────────
      float foam = fbm(world * 3.5 + vec2(T * 0.4, T * 0.3));
      foam = smoothstep(0.62, 0.75, foam + height * 0.6);
      // near-horizon foam streak
      float streakFoam = fbm(world * 6.0 + vec2(-T * 0.6, 0.0));
      streakFoam = smoothstep(0.68, 0.80, streakFoam) * exp(-depth * 3.0);
      float totalFoam = clamp(foam + streakFoam, 0.0, 1.0);

      // ── Compose ocean pixel ──────────────────────────
      vec3 oceanColor = mix(waterColor, reflectedSky, fresnel * 0.7);
      oceanColor += vec3(1.0, 0.97, 0.92) * spec;
      oceanColor += vec3(0.8, 0.9, 1.0) * spec2;
      oceanColor = mix(oceanColor, vec3(1.0), totalFoam * 0.75);

      // ── Depth fog toward horizon ─────────────────────
      float horizonFog = exp(-depth * 8.0);
      vec3 fogColor = vec3(0.65, 0.82, 0.96);
      oceanColor = mix(oceanColor, fogColor, horizonFog * 0.5);

      // ── Atmospheric haze at very horizon ────────────
      float hazeBand = smoothstep(0.0, 0.04, horizon - uv.y);
      oceanColor = mix(vec3(0.78, 0.91, 1.0), oceanColor, hazeBand);

      // ── Final blend sky / ocean ──────────────────────
      vec3 color = mix(oceanColor, skyColor, step(horizon, uv.y));

      // ── Slight vignette ──────────────────────────────
      vec2 vUV = uv * 2.0 - 1.0;
      float vign = 1.0 - dot(vUV * vec2(0.4, 0.6), vUV * vec2(0.4, 0.6));
      color *= 0.85 + 0.15 * vign;

      gl_FragColor = vec4(color, 1.0);
    }
  `;

  // ── Compile shaders ───────────────────────────────────────
  function compile(type, src) {
    const s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS))
      console.error(gl.getShaderInfoLog(s));
    return s;
  }
  const prog = gl.createProgram();
  gl.attachShader(prog, compile(gl.VERTEX_SHADER, VS));
  gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FS));
  gl.linkProgram(prog);
  gl.useProgram(prog);

  // ── Full-screen quad ─────────────────────────────────────
  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW);
  const aPos = gl.getAttribLocation(prog, 'aPos');
  gl.enableVertexAttribArray(aPos);
  gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

  const uRes  = gl.getUniformLocation(prog, 'uRes');
  const uTime = gl.getUniformLocation(prog, 'uTime');

  // ── Render loop ───────────────────────────────────────────
  function frame(t) {
    gl.uniform2f(uRes, W, H);
    gl.uniform1f(uTime, t * 0.001);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
})();

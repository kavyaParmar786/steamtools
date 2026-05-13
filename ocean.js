/**
 * STEAMTOOLS — Paradise Sunset WebGL Background
 * High-fidelity sunset over water with palm silhouettes and sun bloom
 * Inspired by: motionbgs.com/paradise-sunset
 */

(function () {
  const canvas = document.getElementById('webgl-bg');
  if (!canvas) return;
  const gl = canvas.getContext('webgl', { antialias: true, alpha: true });
  if (!gl) return;

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

  const VS = `attribute vec2 aPos; void main(){ gl_Position=vec4(aPos,0,1); }`;

  const FS = `
    precision highp float;
    uniform vec2  uRes;
    uniform float uTime;
    uniform vec2  uMouse;

    // Noise functions for clouds and water
    float hash(vec2 p){ return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453); }
    float noise(vec2 p){
      vec2 i=floor(p), f=fract(p);
      f=f*f*(3.-2.*f);
      return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);
    }
    float fbm(vec2 p){
      float v=0.,a=.5;
      for(int i=0;i<4;i++){ v+=a*noise(p); p=p*2.0+vec2(1.3,.7); a*=.5; }
      return v;
    }

    void main(){
      vec2 uv = gl_FragCoord.xy / uRes;
      float t = uTime;
      vec2 m = uMouse;

      // ── SUN ──────────────────────────────────────────────────
      vec2 sunPos = vec2(0.5, 0.45 + sin(t*0.2)*0.01);
      float sunDist = length(uv - sunPos);
      float sunDisk = smoothstep(0.08, 0.075, sunDist);
      float sunBloom = exp(-sunDist * 12.0) * (0.8 + 0.2 * sin(t*1.5));
      vec3 sunColor = mix(vec3(1.0, 0.9, 0.6), vec3(1.0, 0.5, 0.1), sunDist * 8.0);
      
      // ── SKY GRADIENT ─────────────────────────────────────────
      vec3 skyIndigo = vec3(0.05, 0.05, 0.15);
      vec3 skyMagenta = vec3(0.6, 0.0, 0.4);
      vec3 skyOrange = vec3(1.0, 0.4, 0.0);
      vec3 skyGold = vec3(1.0, 0.8, 0.2);

      vec3 sky;
      if(uv.y > 0.45) {
        float h = (uv.y - 0.45) / 0.55;
        sky = mix(skyOrange, skyIndigo, pow(h, 0.8));
        sky = mix(sky, skyMagenta, smoothstep(0.2, 0.8, h) * 0.4);
        
        // Clouds
        float cloud = fbm(vec2(uv.x * 2.0 + t*0.05, uv.y * 10.0));
        sky = mix(sky, skyIndigo * 0.5, cloud * smoothstep(0.5, 1.0, uv.y) * 0.3);
      } else {
        sky = skyOrange * 0.2; // Base for reflection
      }

      // ── WATER ───────────────────────────────────────────────
      vec3 color;
      if(uv.y < 0.45) {
        float h = uv.y / 0.45;
        vec2 waterUV = vec2(uv.x, uv.y * 5.0);
        float ripples = noise(waterUV * 8.0 + vec2(t*0.5, t*0.8));
        
        // Sun Reflection Path
        float refX = abs(uv.x - 0.5);
        float refPath = exp(-refX * 25.0 * h) * ripples * h;
        vec3 reflection = skyGold * refPath * 1.5;
        
        vec3 waterBase = mix(vec3(0.02, 0.02, 0.08), skyOrange * 0.4, h);
        color = waterBase + reflection;
      } else {
        color = sky + (sunDisk + sunBloom) * sunColor;
      }

      // ── PALM SILHOUETTES (Framing) ────────────────────────
      float palm1 = smoothstep(0.4, 0.0, length(uv - vec2(0.0, 0.0)) - 0.25 * fbm(uv * 3.0 + t*0.02));
      float palm2 = smoothstep(0.5, 0.0, length(uv - vec2(1.0, 0.1)) - 0.35 * fbm(uv * 2.5 - t*0.01));
      float palm3 = smoothstep(0.3, 0.0, length(uv - vec2(0.1, 1.0)) - 0.2 * fbm(uv * 4.0));
      color = mix(color, vec3(0.01, 0.01, 0.02), (palm1 + palm2 + palm3) * 0.95);

      // Vignette & Contrast
      color *= 1.0 - 0.4 * length(uv - 0.5);
      color = pow(color, vec3(0.9)); // Slight gamma tweak
      
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

  const uRes = gl.getUniformLocation(prog, 'uRes');
  const uTime = gl.getUniformLocation(prog, 'uTime');
  const uMouse = gl.getUniformLocation(prog, 'uMouse');

  let isVisible = true;
  const observer = new IntersectionObserver((entries) => {
    isVisible = entries[0].isIntersecting;
  }, { threshold: 0.1 });
  observer.observe(canvas);

  let lastFrameTime = 0;
  const targetFPS = 60;
  const frameInterval = 1000 / targetFPS;

  function frame(ts) {
    if (!isVisible) {
      requestAnimationFrame(frame);
      return;
    }

    const elapsed = ts - lastFrameTime;
    if (elapsed < frameInterval) {
      requestAnimationFrame(frame);
      return;
    }
    lastFrameTime = ts - (elapsed % frameInterval);

    const T = ts * 0.001;
    mouse.x += (mouseTarget.x - mouse.x) * 0.05;
    mouse.y += (mouseTarget.y - mouse.y) * 0.05;

    gl.clearColor(0,0,0,0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.uniform2f(uRes, W, H);
    gl.uniform1f(uTime, T);
    gl.uniform2f(uMouse, mouse.x, mouse.y);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
})();

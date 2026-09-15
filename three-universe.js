/**
 * ============================================================================
 * THREE-UNIVERSE.JS (CLEAN LUXURY SPARKLE EDITION)
 * Refined 3D Particle Universe for Parthasarathi S's Portfolio
 * ============================================================================
 * Design Philosophy:
 * - Stunning, glowing central particle world (Fibonacci distribution, organic breathing)
 * - Deep, calm, dark obsidian background (NOT overly flashy or cluttered)
 * - Delicate, soft twinkling sparkles that drift gracefully in deep space
 * - Smooth scroll camera journey and subtle cursor parallax
 * ============================================================================
 */

(function () {
  'use strict';

  if (typeof THREE === 'undefined') {
    window.addEventListener('load', () => {
      if (typeof THREE !== 'undefined') initUniverse();
    });
    return;
  }

  initUniverse();

  function initUniverse() {
    const isMobile = window.innerWidth < 768 || ('ontouchstart' in window);
    const particleMultiplier = isMobile ? 0.5 : 1.0;

    const CONFIG = {
      sphereRadius: 3.2,
      spherePointsCount: Math.floor(5200 * particleMultiplier),
      sparklesCount: Math.floor(1600 * particleMultiplier), // Clean, refined sparkle count
      delicateRingCount: Math.floor(350 * particleMultiplier), // Single ultra-fine subtle ring
      camFov: isMobile ? 65 : 55,
      colors: {
        royalPurple: 0xa855f7,
        plasmaViolet: 0xc084fc,
        neonMagenta: 0xd946ef,
        deepViolet: 0x6b21a8,
        softSparkle: 0xe9d5ff,
        pureWhite: 0xffffff
      }
    };

    let scene, camera, renderer;
    let sphereGeometry, spherePoints, spherePositions, sphereOriginalPositions, sphereAccretionPositions;
    let sphereColors, sphereSizes, spherePhases;
    let sphereShaderMaterial, sparkleShaderMaterial;
    let innerCoreMesh;
    let delicateRing;
    let sparklePoints;
    let clock;
    let isPageVisible = true;
    let entranceStartTime = null;
    let entranceComplete = false;

    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    let scrollProgress = 0;
    let targetScrollProgress = 0;

    const CAMERA_KEYFRAMES = [
      { progress: 0.00, cam: [0.0, 0.0, 8.4], look: [0.0, 0.0, 0.0], sphereRot: [0.0, 0.0] },
      { progress: 0.16, cam: [3.6, 1.2, 6.8], look: [-0.3, 0.2, 0.0], sphereRot: [0.3, 0.6] },
      { progress: 0.32, cam: [-3.4, -1.0, 6.0], look: [0.3, 0.0, 0.0], sphereRot: [-0.2, 1.2] },
      { progress: 0.50, cam: [3.0, 2.4, 7.2], look: [0.0, -0.4, 0.0], sphereRot: [0.4, 2.0] },
      { progress: 0.68, cam: [-2.0, -2.2, 6.4], look: [0.2, 0.1, 0.0], sphereRot: [-0.3, 2.8] },
      { progress: 0.80, cam: [3.2, -0.8, 6.8], look: [-0.2, 0.0, 0.0], sphereRot: [0.2, 3.6] },
      { progress: 0.90, cam: [-2.8, 1.6, 7.0], look: [0.2, -0.1, 0.0], sphereRot: [-0.2, 4.4] },
      { progress: 1.00, cam: [0.0, 0.0, 5.0], look: [0.0, 0.0, 0.0], sphereRot: [0.1, 5.2] }
    ];

    /**
     * Soft, natural radial glow particle sprite
     */
    function createParticleTexture() {
      const canvas = document.createElement('canvas');
      canvas.width = 64;
      canvas.height = 64;
      const ctx = canvas.getContext('2d');

      const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
      gradient.addColorStop(0.0, 'rgba(255, 255, 255, 1.0)');
      gradient.addColorStop(0.2, 'rgba(192, 132, 252, 0.85)');
      gradient.addColorStop(0.5, 'rgba(168, 85, 247, 0.35)');
      gradient.addColorStop(0.8, 'rgba(107, 33, 168, 0.08)');
      gradient.addColorStop(1.0, 'rgba(0, 0, 0, 0.0)');

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 64, 64);

      const texture = new THREE.CanvasTexture(canvas);
      texture.generateMipmaps = false;
      texture.minFilter = THREE.LinearFilter;
      return texture;
    }

    /**
     * Delicate sparkle starlight texture
     */
    function createSparkleTexture() {
      const canvas = document.createElement('canvas');
      canvas.width = 64;
      canvas.height = 64;
      const ctx = canvas.getContext('2d');

      const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
      gradient.addColorStop(0.0, 'rgba(255, 255, 255, 1.0)');
      gradient.addColorStop(0.15, 'rgba(233, 213, 255, 0.9)');
      gradient.addColorStop(0.4, 'rgba(192, 132, 252, 0.3)');
      gradient.addColorStop(1.0, 'rgba(0, 0, 0, 0.0)');

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 64, 64);

      const texture = new THREE.CanvasTexture(canvas);
      texture.generateMipmaps = false;
      texture.minFilter = THREE.LinearFilter;
      return texture;
    }

    function initScene() {
      const container = document.getElementById('universe-canvas-container');
      if (!container) return;

      scene = new THREE.Scene();
      // Calm, deep obsidian fog that fades distant elements naturally
      scene.fog = new THREE.FogExp2(0x05030a, 0.026);

      camera = new THREE.PerspectiveCamera(CONFIG.camFov, window.innerWidth / window.innerHeight, 0.1, 1000);
      camera.position.set(0, 0, 18);

      renderer = new THREE.WebGLRenderer({
        powerPreference: 'high-performance',
        antialias: !isMobile,
        alpha: true,
        stencil: false,
        depth: true
      });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setClearColor(0x000000, 0);

      container.appendChild(renderer.domElement);
      clock = new THREE.Clock();

      const particleTexture = createParticleTexture();
      const sparkleTexture = createSparkleTexture();

      // 1. Soft, Elegant Floating Sparkles in Deep Space
      buildSoftSparkles(sparkleTexture);

      // 2. Central 3D Glowing Particle Sphere
      buildParticleSphere(particleTexture);

      // 3. Subtle Holographic Inner Core
      buildInnerCore();

      // 4. Single Ultra-Fine Ethereal Orbit Ring (delicate, not loud)
      buildDelicateRing(sparkleTexture);

      setupEventListeners();

      entranceStartTime = performance.now();
      animate();
    }

    /**
     * 1. Soft, Natural Sparkles Drifting in Background (Clean & Calming)
     */
    function buildSoftSparkles(texture) {
      const count = CONFIG.sparklesCount;
      const geometry = new THREE.BufferGeometry();
      const positions = new Float32Array(count * 3);
      const colors = new Float32Array(count * 3);
      const sizes = new Float32Array(count);
      const phases = new Float32Array(count);

      const sparkleColors = [
        new THREE.Color(0xffffff),
        new THREE.Color(0xe9d5ff),
        new THREE.Color(0xc084fc),
        new THREE.Color(0xd8b4fe),
        new THREE.Color(0x38bdf8)
      ];

      for (let i = 0; i < count; i++) {
        // Broad, gentle distribution in deep space
        const radius = 18 + Math.random() * 110;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);

        positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
        positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
        positions[i * 3 + 2] = radius * Math.cos(phi);

        const color = sparkleColors[Math.floor(Math.random() * sparkleColors.length)];
        colors[i * 3] = color.r;
        colors[i * 3 + 1] = color.g;
        colors[i * 3 + 2] = color.b;

        sizes[i] = (Math.random() * 2.0 + 0.6) * (isMobile ? 1.2 : 1.0);
        phases[i] = Math.random() * Math.PI * 2;
      }

      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
      geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
      geometry.setAttribute('phase', new THREE.BufferAttribute(phases, 1));

      // Organic gentle twinkling shader
      sparkleShaderMaterial = new THREE.ShaderMaterial({
        uniforms: {
          time: { value: 0 },
          pointTexture: { value: texture }
        },
        vertexShader: `
          uniform float time;
          attribute float size;
          attribute float phase;
          varying vec3 vColor;
          varying float vAlpha;
          void main() {
            vColor = color;
            // Soft, breathing twinkle that fades in and out gently
            float twinkle = 0.35 + 0.45 * sin(time * 1.2 + phase);
            vAlpha = twinkle;
            vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
            gl_PointSize = size * (0.8 + 0.3 * twinkle) * (170.0 / -mvPosition.z);
            gl_Position = projectionMatrix * mvPosition;
          }
        `,
        fragmentShader: `
          uniform sampler2D pointTexture;
          varying vec3 vColor;
          varying float vAlpha;
          void main() {
            vec4 tex = texture2D(pointTexture, gl_PointCoord);
            gl_FragColor = vec4(vColor, vAlpha * tex.a) * tex;
          }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      });

      sparklePoints = new THREE.Points(geometry, sparkleShaderMaterial);
      scene.add(sparklePoints);
    }

    /**
     * 2. Central 3D Glowing Particle Sphere
     */
    function buildParticleSphere(texture) {
      const count = CONFIG.spherePointsCount;
      sphereGeometry = new THREE.BufferGeometry();

      spherePositions = new Float32Array(count * 3);
      sphereOriginalPositions = new Float32Array(count * 3);
      sphereAccretionPositions = new Float32Array(count * 3);
      sphereColors = new Float32Array(count * 3);
      sphereSizes = new Float32Array(count);
      spherePhases = new Float32Array(count);

      const phiGolden = Math.PI * (3 - Math.sqrt(5));

      const palette = [
        new THREE.Color(0xa855f7), // Royal purple
        new THREE.Color(0xc084fc), // Plasma violet
        new THREE.Color(0xd946ef), // Neon magenta
        new THREE.Color(0x9333ea), // Deep purple
        new THREE.Color(0xe9d5ff), // Soft lavender
        new THREE.Color(0xffffff)  // Sparkle diamond white
      ];

      for (let i = 0; i < count; i++) {
        const y = 1 - (i / (count - 1)) * 2;
        const radiusAtY = Math.sqrt(1 - y * y);
        const theta = phiGolden * i;

        const rNoise = (Math.random() - 0.5) * 0.16;
        const finalR = CONFIG.sphereRadius + rNoise;

        const px = Math.cos(theta) * radiusAtY * finalR;
        const py = y * finalR;
        const pz = Math.sin(theta) * radiusAtY * finalR;

        sphereOriginalPositions[i * 3] = px;
        sphereOriginalPositions[i * 3 + 1] = py;
        sphereOriginalPositions[i * 3 + 2] = pz;

        // Accretion origins
        const disperseDist = 18 + Math.random() * 30;
        const disperseTheta = Math.random() * Math.PI * 2;
        const dispersePhi = Math.acos(2 * Math.random() - 1);
        sphereAccretionPositions[i * 3] = disperseDist * Math.sin(dispersePhi) * Math.cos(disperseTheta);
        sphereAccretionPositions[i * 3 + 1] = disperseDist * Math.sin(dispersePhi) * Math.sin(disperseTheta);
        sphereAccretionPositions[i * 3 + 2] = disperseDist * Math.cos(dispersePhi);

        spherePositions[i * 3] = sphereAccretionPositions[i * 3];
        spherePositions[i * 3 + 1] = sphereAccretionPositions[i * 3 + 1];
        spherePositions[i * 3 + 2] = sphereAccretionPositions[i * 3 + 2];

        let color;
        const latAbs = Math.abs(y);
        if (Math.random() < 0.12) {
          color = palette[5]; // Sparkle diamond white
        } else if (latAbs < 0.35) {
          color = Math.random() < 0.6 ? palette[0] : palette[1];
        } else if (latAbs < 0.7) {
          color = Math.random() < 0.5 ? palette[1] : palette[2];
        } else {
          color = Math.random() < 0.5 ? palette[2] : palette[3];
        }

        sphereColors[i * 3] = color.r;
        sphereColors[i * 3 + 1] = color.g;
        sphereColors[i * 3 + 2] = color.b;

        sphereSizes[i] = (Math.random() * 2.8 + 1.2) * (isMobile ? 1.3 : 1.0);
        spherePhases[i] = Math.random() * Math.PI * 2;
      }

      sphereGeometry.setAttribute('position', new THREE.BufferAttribute(spherePositions, 3));
      sphereGeometry.setAttribute('color', new THREE.BufferAttribute(sphereColors, 3));
      geometrySizePhaseAttributes(sphereGeometry, sphereSizes, spherePhases);

      sphereShaderMaterial = new THREE.ShaderMaterial({
        uniforms: {
          time: { value: 0 },
          pointTexture: { value: texture },
          burstScale: { value: 1.0 }
        },
        vertexShader: `
          uniform float time;
          uniform float burstScale;
          attribute float size;
          attribute float phase;
          varying vec3 vColor;
          varying float vAlpha;
          void main() {
            vColor = color;
            float twinkle = 0.75 + 0.30 * sin(time * 2.5 + phase);
            vAlpha = twinkle;
            vec4 mvPosition = modelViewMatrix * vec4(position * burstScale, 1.0);
            gl_PointSize = size * twinkle * (210.0 / -mvPosition.z);
            gl_Position = projectionMatrix * mvPosition;
          }
        `,
        fragmentShader: `
          uniform sampler2D pointTexture;
          varying vec3 vColor;
          varying float vAlpha;
          void main() {
            vec4 tex = texture2D(pointTexture, gl_PointCoord);
            gl_FragColor = vec4(vColor, vAlpha * tex.a) * tex;
          }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      });

      spherePoints = new THREE.Points(sphereGeometry, sphereShaderMaterial);
      scene.add(spherePoints);
    }

    function geometrySizePhaseAttributes(geo, sizes, phases) {
      geo.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
      geo.setAttribute('phase', new THREE.BufferAttribute(phases, 1));
    }

    /**
     * 3. Subtle Holographic Inner Core
     */
    function buildInnerCore() {
      const coreGeo = new THREE.IcosahedronGeometry(CONFIG.sphereRadius * 0.78, 2);
      const coreMat = new THREE.MeshBasicMaterial({
        color: CONFIG.colors.royalPurple,
        wireframe: true,
        transparent: true,
        opacity: 0.11,
        blending: THREE.AdditiveBlending
      });
      innerCoreMesh = new THREE.Mesh(coreGeo, coreMat);
      scene.add(innerCoreMesh);
    }

    /**
     * 4. Single Ultra-Fine Subtle Orbital Ring (clean, not flashy)
     */
    function buildDelicateRing(texture) {
      const count = CONFIG.delicateRingCount;
      const geo = new THREE.BufferGeometry();
      const pos = new Float32Array(count * 3);
      const col = new Float32Array(count * 3);
      const color = new THREE.Color(0xc084fc);

      for (let i = 0; i < count; i++) {
        const angle = (i / count) * Math.PI * 2;
        const r = 4.8 + Math.random() * 0.4;
        const yOffset = (Math.random() - 0.5) * 0.08;

        pos[i * 3] = Math.cos(angle) * r;
        pos[i * 3 + 1] = yOffset;
        pos[i * 3 + 2] = Math.sin(angle) * r;

        col[i * 3] = color.r * 0.8;
        col[i * 3 + 1] = color.g * 0.8;
        col[i * 3 + 2] = color.b * 0.8;
      }

      geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
      geo.setAttribute('color', new THREE.BufferAttribute(col, 3));

      const mat = new THREE.PointsMaterial({
        size: 1.6,
        map: texture,
        transparent: true,
        opacity: 0.55, // Subtle, soft opacity
        vertexColors: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      });

      delicateRing = new THREE.Points(geo, mat);
      delicateRing.rotation.x = 0.4;
      delicateRing.rotation.z = -0.2;
      scene.add(delicateRing);
    }

    function setupEventListeners() {
      window.addEventListener('mousemove', (e) => {
        mouse.targetX = (e.clientX / window.innerWidth) * 2 - 1;
        mouse.targetY = -(e.clientY / window.innerHeight) * 2 + 1;
      }, { passive: true });

      window.addEventListener('resize', onWindowResize, { passive: true });

      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();

      document.addEventListener('visibilitychange', () => {
        isPageVisible = !document.hidden;
        if (isPageVisible) {
          clock.start();
        } else {
          clock.stop();
        }
      });

      window.addEventListener('touchmove', (e) => {
        if (e.touches.length > 0) {
          mouse.targetX = (e.touches[0].clientX / window.innerWidth) * 2 - 1;
          mouse.targetY = -(e.touches[0].clientY / window.innerHeight) * 2 + 1;
        }
      }, { passive: true });
    }

    function onWindowResize() {
      if (!camera || !renderer) return;
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    }

    function onScroll() {
      const scrollY = window.pageYOffset || document.documentElement.scrollTop;
      const maxScroll = (document.documentElement.scrollHeight - window.innerHeight) || 1;
      targetScrollProgress = Math.min(Math.max(scrollY / maxScroll, 0), 1);
    }

    function getInterpolatedCamera(progress) {
      const p = Math.min(Math.max(progress, 0), 1);

      let k1 = CAMERA_KEYFRAMES[0];
      let k2 = CAMERA_KEYFRAMES[CAMERA_KEYFRAMES.length - 1];

      for (let i = 0; i < CAMERA_KEYFRAMES.length - 1; i++) {
        if (p >= CAMERA_KEYFRAMES[i].progress && p <= CAMERA_KEYFRAMES[i + 1].progress) {
          k1 = CAMERA_KEYFRAMES[i];
          k2 = CAMERA_KEYFRAMES[i + 1];
          break;
        }
      }

      const range = k2.progress - k1.progress;
      const t = range === 0 ? 0 : (p - k1.progress) / range;
      const easeT = t * t * (3 - 2 * t);

      const camX = k1.cam[0] + (k2.cam[0] - k1.cam[0]) * easeT;
      const camY = k1.cam[1] + (k2.cam[1] - k1.cam[1]) * easeT;
      const camZ = k1.cam[2] + (k2.cam[2] - k1.cam[2]) * easeT;

      const lookX = k1.look[0] + (k2.look[0] - k1.look[0]) * easeT;
      const lookY = k1.look[1] + (k2.look[1] - k1.look[1]) * easeT;
      const lookZ = k1.look[2] + (k2.look[2] - k1.look[2]) * easeT;

      const rotX = k1.sphereRot[0] + (k2.sphereRot[0] - k1.sphereRot[0]) * easeT;
      const rotY = k1.sphereRot[1] + (k2.sphereRot[1] - k1.sphereRot[1]) * easeT;

      return { camX, camY, camZ, lookX, lookY, lookZ, rotX, rotY };
    }

    function animate() {
      requestAnimationFrame(animate);

      if (!isPageVisible) return;

      const delta = Math.min(clock.getDelta(), 0.1);
      const elapsedTime = clock.getElapsedTime();
      const now = performance.now();

      if (sphereShaderMaterial) sphereShaderMaterial.uniforms.time.value = elapsedTime;
      if (sparkleShaderMaterial) sparkleShaderMaterial.uniforms.time.value = elapsedTime;

      const entranceDuration = 3400;
      const entranceElapsed = now - entranceStartTime;
      const rawEntranceT = Math.min(Math.max(entranceElapsed / entranceDuration, 0), 1);
      const entranceT = 1 - Math.pow(1 - rawEntranceT, 3);

      if (rawEntranceT < 1.0) {
        const count = CONFIG.spherePointsCount;
        const positions = sphereGeometry.attributes.position.array;

        for (let i = 0; i < count; i++) {
          const i3 = i * 3;
          const pStagger = Math.min(Math.max((rawEntranceT - (i / count) * 0.25) / 0.75, 0), 1);
          const pEase = 1 - Math.pow(1 - pStagger, 3);

          positions[i3] = sphereAccretionPositions[i3] + (sphereOriginalPositions[i3] - sphereAccretionPositions[i3]) * pEase;
          positions[i3 + 1] = sphereAccretionPositions[i3 + 1] + (sphereOriginalPositions[i3 + 1] - sphereAccretionPositions[i3 + 1]) * pEase;
          positions[i3 + 2] = sphereAccretionPositions[i3 + 2] + (sphereOriginalPositions[i3 + 2] - sphereAccretionPositions[i3 + 2]) * pEase;
        }
        sphereGeometry.attributes.position.needsUpdate = true;

        const introCamZ = 18 - (18 - 8.4) * entranceT;
        camera.position.z = introCamZ;
      } else if (!entranceComplete) {
        entranceComplete = true;
        document.body.classList.add('universe-ready');
        const count = CONFIG.spherePointsCount;
        const positions = sphereGeometry.attributes.position.array;
        for (let i = 0; i < count * 3; i++) {
          positions[i] = sphereOriginalPositions[i];
        }
        sphereGeometry.attributes.position.needsUpdate = true;
      }

      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      scrollProgress += (targetScrollProgress - scrollProgress) * 0.08;

      const path = getInterpolatedCamera(scrollProgress);

      if (entranceComplete) {
        camera.position.x = path.camX + mouse.x * 0.45;
        camera.position.y = path.camY + mouse.y * 0.30;
        camera.position.z = path.camZ;
      } else {
        camera.position.x = path.camX + mouse.x * 0.25;
        camera.position.y = path.camY + mouse.y * 0.15;
      }

      camera.lookAt(path.lookX, path.lookY, path.lookZ);

      // Central sphere slow, natural, organic rotation
      if (spherePoints) {
        spherePoints.rotation.y = elapsedTime * 0.07 + path.rotY + mouse.x * 0.12;
        spherePoints.rotation.x = Math.sin(elapsedTime * 0.04) * 0.04 + path.rotX + mouse.y * 0.08;
      }

      // Inner core pulse
      if (innerCoreMesh) {
        innerCoreMesh.rotation.y = -elapsedTime * 0.10;
        const corePulse = 1.0 + Math.sin(elapsedTime * 1.8) * 0.025;
        innerCoreMesh.scale.set(corePulse, corePulse, corePulse);
      }

      // Delicate ring gentle spin
      if (delicateRing) {
        delicateRing.rotation.y = elapsedTime * 0.09;
      }

      // Soft sparkles drift gently in deep space
      if (sparklePoints) {
        sparklePoints.rotation.y = elapsedTime * 0.005;
        sparklePoints.rotation.x = Math.sin(elapsedTime * 0.003) * 0.015;
      }

      renderer.render(scene, camera);
    }

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initScene);
    } else {
      initScene();
    }

    window.UniverseEngine = {
      triggerBurst: function () {
        if (sphereShaderMaterial) {
          sphereShaderMaterial.uniforms.burstScale.value = 1.06;
          setTimeout(() => {
            if (sphereShaderMaterial) sphereShaderMaterial.uniforms.burstScale.value = 1.0;
          }, 300);
        }
      }
    };
  }

})();

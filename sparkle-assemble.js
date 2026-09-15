/**
 * ============================================================================
 * SPARKLE SUPERNOVA BURST & LIVING WAVE ENGINE
 * 
 * 1. Initial State: Screen is empty.
 * 2. Supernova Burst: Sparkles detonate and burst across the FULL DISPLAY!
 * 3. Gravitational Convergence: All sparkles from across the entire screen fly in
 *    and assemble into "Hi", "I am", and "Parthasarathi S".
 * 4. The waving hand emoji (👋) is placed directly BETWEEN "Hi" and "I am"
 *    with pixel-perfect fixed alignment and golden/purple glow.
 * 5. Wave Motion (Post-Join):
 *    - Word positions stay anchored ("word move aaga koodathu").
 *    - Sparkles ripple with continuous gentle harmonic wave ("chuma chinna move oru wave mari").
 * 6. Sequential Reveal: Photo and bottom details smoothly slide in.
 * ============================================================================
 */

(function () {
  'use strict';

  // --------------------------------------------------------------------------
  // FULLSCREEN CANVAS SETUP
  // --------------------------------------------------------------------------
  const canvas = document.getElementById('sparkle-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height, dpr;
  let particles = [];
  let ambientStars = [];
  let animId = null;

  // Cached anchor coordinates
  let anchorX = 0;
  let anchorY = 0;
  let y1 = 0;
  let y2 = 0;

  // Reveal controller for photo & details
  let hasRevealedOthers = false;
  function revealOtherElements() {
    if (hasRevealedOthers) return;
    hasRevealedOthers = true;
    document.querySelectorAll('.reveal-item').forEach((el) => {
      el.classList.add('revealed');
    });
  }

  window.addEventListener('click', revealOtherElements);
  window.addEventListener('keydown', revealOtherElements);

  // Mouse interaction
  const mouse = { x: -1000, y: -1000, radius: 60, active: false };

  // Palettes (Royal Purple, Neon Magenta, Plasma Violet, Starlight White, Cyan)
  const SPARKLE_COLORS = ['#ffffff', '#c084fc', '#d946ef', '#a855f7', '#e9d5ff', '#38bdf8'];

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;

    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    buildTargetCoordinates();
    initAmbientStars();
  }

  function drawDiamondStar(context, cx, cy, size, color, alpha) {
    const outer = size;
    const inner = size * 0.22;

    context.beginPath();
    context.moveTo(cx, cy - outer);
    context.lineTo(cx + inner, cy - inner);
    context.lineTo(cx + outer, cy);
    context.lineTo(cx + inner, cy + inner);
    context.lineTo(cx, cy + outer);
    context.lineTo(cx - inner, cy + inner);
    context.lineTo(cx - outer, cy);
    context.lineTo(cx - inner, cy - inner);
    context.closePath();

    context.fillStyle = color;
    context.globalAlpha = alpha;
    context.fill();

    // Center flare
    context.beginPath();
    context.arc(cx, cy, inner * 0.9, 0, Math.PI * 2);
    context.fillStyle = '#ffffff';
    context.globalAlpha = Math.min(alpha * 1.3, 1);
    context.fill();
    context.globalAlpha = 1;
  }

  function initAmbientStars() {
    ambientStars = [];
    const count = window.innerWidth < 768 ? 50 : 85;
    for (let i = 0; i < count; i++) {
      ambientStars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 1.5 + 0.5,
        color: SPARKLE_COLORS[Math.floor(Math.random() * SPARKLE_COLORS.length)],
        phase: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.025 + 0.01,
        vx: (Math.random() - 0.5) * 0.18,
        vy: (Math.random() - 0.5) * 0.18
      });
    }
  }

  // Sample target letter coordinates based on anchor in page
  function buildTargetCoordinates() {
    const titleAnchor = document.getElementById('title-anchor');
    const isMobile = width < 600;

    anchorX = width / 2;
    anchorY = height * 0.44;

    if (titleAnchor) {
      const rect = titleAnchor.getBoundingClientRect();
      anchorX = rect.left + rect.width / 2;
      anchorY = rect.top + rect.height / 2;
    }

    const off = document.createElement('canvas');
    off.width = Math.floor(width);
    off.height = Math.floor(height);
    const octx = off.getContext('2d');

    const font1Size = isMobile ? 22 : 30;
    const font2Size = isMobile ? 36 : 56;

    y1 = anchorY - (isMobile ? 22 : 30);
    y2 = anchorY + (isMobile ? 28 : 36);

    octx.textAlign = 'center';
    octx.textBaseline = 'middle';

    // Measure line 1 components: "Hi" [gap for emoji] "I am"
    octx.font = `700 ${font1Size}px 'Space Grotesk', 'Outfit', sans-serif`;
    const wHi = octx.measureText("Hi").width;
    const gap = isMobile ? 44 : 58; // Symmetrical gap where the waving hand emoji sits
    const wIm = octx.measureText("I am").width;
    const totalW = wHi + gap + wIm;

    const startX = anchorX - totalW / 2;
    const hiCenterX = startX + wHi / 2;
    const emojiCenterX = startX + wHi + gap / 2;
    const imCenterX = startX + wHi + gap + wIm / 2;

    // Position the HTML waving emoji with exact pixel coordinates directly between "Hi" and "I am"
    const emojiWrapper = document.getElementById('emoji-wrapper');
    if (emojiWrapper) {
      emojiWrapper.style.position = 'fixed';
      emojiWrapper.style.left = Math.round(emojiCenterX) + 'px';
      emojiWrapper.style.top = Math.round(y1) + 'px';
      emojiWrapper.style.transform = 'translate(-50%, -50%)';
      emojiWrapper.style.zIndex = '15';
      emojiWrapper.classList.add('emoji-visible');
    }

    // Render words on offscreen canvas for sampling
    octx.fillStyle = '#ffffff';
    octx.fillText("Hi", hiCenterX, y1);
    octx.fillText("I am", imCenterX, y1);

    octx.font = `900 ${font2Size}px 'Space Grotesk', 'Outfit', sans-serif`;
    octx.fillText("Parthasarathi S", anchorX, y2);

    const imgData = octx.getImageData(0, 0, width, height).data;
    const points = [];
    const step = 3;

    for (let y = 0; y < height; y += step) {
      for (let x = 0; x < width; x += step) {
        const idx = (y * width + x) * 4;
        if (imgData[idx + 3] > 120) {
          points.push({
            x: x + (Math.random() - 0.5) * 1.2,
            y: y + (Math.random() - 0.5) * 1.2
          });
        }
      }
    }

    // Initialize particles for Supernova Burst
    particles = [];
    const count = points.length;

    for (let i = 0; i < count; i++) {
      const pt = points[i];
      // Burst starts from center/epicenter and blasts across FULL DISPLAY
      const burstAngle = Math.random() * Math.PI * 2;
      const maxDist = Math.max(width, height) * 0.75;
      const burstSpeed = (Math.random() * 0.7 + 0.3) * (maxDist / 20);

      const vx = Math.cos(burstAngle) * burstSpeed;
      const vy = Math.sin(burstAngle) * burstSpeed;

      const isDiamond = Math.random() < 0.25;

      particles.push({
        x: width / 2 + (Math.random() - 0.5) * 30,
        y: height / 2 + (Math.random() - 0.5) * 30,
        vx: vx,
        vy: vy,
        burstX: 0,
        burstY: 0,
        targetX: pt.x,
        targetY: pt.y,
        baseTargetX: pt.x,
        baseTargetY: pt.y,
        size: isDiamond ? (Math.random() * 2.2 + 1.8) : (Math.random() * 1.6 + 1.0),
        color: SPARKLE_COLORS[Math.floor(Math.random() * SPARKLE_COLORS.length)],
        isDiamondStar: isDiamond,
        phase: Math.random() * Math.PI * 2,
        twinkleSpeed: Math.random() * 0.08 + 0.03,
        ease: Math.random() * 0.05 + 0.045,
        driftSeed: Math.random() * 100
      });
    }
  }

  // Mouse handlers
  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    mouse.active = true;
  });

  window.addEventListener('mouseleave', () => {
    mouse.active = false;
  });

  window.addEventListener('touchmove', (e) => {
    if (e.touches.length > 0) {
      mouse.x = e.touches[0].clientX;
      mouse.y = e.touches[0].clientY;
      mouse.active = true;
    }
  }, { passive: true });

  window.addEventListener('touchend', () => {
    mouse.active = false;
  });

  // Timeline
  let startTime = null;
  const BURST_TIME = 360;      // 0 to 360ms: Burst across full display
  const GATHER_TIME = 1380;    // 360ms to 1380ms: Gather from across display into letters

  function render(timestamp) {
    if (!startTime) startTime = timestamp;
    const elapsed = timestamp - startTime;

    ctx.clearRect(0, 0, width, height);

    // Ambient floating stars
    for (let i = 0; i < ambientStars.length; i++) {
      const s = ambientStars[i];
      s.phase += s.speed;
      s.x += s.vx;
      s.y += s.vy;
      if (s.x < 0) s.x = width;
      if (s.x > width) s.x = 0;
      if (s.y < 0) s.y = height;
      if (s.y > height) s.y = 0;

      const a = 0.2 + 0.45 * Math.sin(s.phase);
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
      ctx.fillStyle = s.color;
      ctx.globalAlpha = Math.max(a, 0.08);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    // Reveal other elements once sparkles assemble
    if (elapsed > 1250 && !hasRevealedOthers) {
      revealOtherElements();
    }

    const now = timestamp * 0.0025;
    const count = particles.length;

    // ------------------------------------------------------------------------
    // PHASE 1: SUPERNOVA EXPLOSION (0ms to 360ms)
    // ------------------------------------------------------------------------
    if (elapsed < BURST_TIME) {
      for (let i = 0; i < count; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.91;
        p.vy *= 0.91;
        p.burstX = p.x;
        p.burstY = p.y;

        p.phase += p.twinkleSpeed;
        const alpha = 0.5 + 0.5 * Math.sin(p.phase);

        if (p.isDiamondStar) {
          drawDiamondStar(ctx, p.x, p.y, p.size * 1.2, p.color, alpha);
        } else {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = alpha;
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1;
    }
    // ------------------------------------------------------------------------
    // PHASE 2 & 3: CONVERGENCE & LIVING WAVE (360ms onwards)
    // ------------------------------------------------------------------------
    else {
      const gatherProgress = Math.min((elapsed - BURST_TIME) / (GATHER_TIME - BURST_TIME), 1);
      const easeProgress = 1 - Math.pow(1 - gatherProgress, 3);

      for (let i = 0; i < count; i++) {
        const p = particles[i];
        p.phase += p.twinkleSpeed;

        // Wave propagation: word itself stays anchored, sparkles ripple gently
        const waveSpeed = 2.6;
        const waveFreq = 0.018;
        const waveAmp = 1.4; // Subtle 1.4px gentle wave

        const waveY = Math.sin(p.baseTargetX * waveFreq - now * waveSpeed) * waveAmp;
        const waveX = Math.cos(p.baseTargetY * waveFreq - now * waveSpeed * 0.7) * 0.5;

        const jitterX = Math.sin(now * 1.4 + p.driftSeed) * 0.4;
        const jitterY = Math.cos(now * 1.6 + p.driftSeed) * 0.4;

        const currentTargetX = p.baseTargetX + waveX + jitterX;
        const currentTargetY = p.baseTargetY + waveY + jitterY;

        const destX = p.burstX + (currentTargetX - p.burstX) * easeProgress;
        const destY = p.burstY + (currentTargetY - p.burstY) * easeProgress;

        p.x += (destX - p.x) * p.ease;
        p.y += (destY - p.y) * p.ease;

        // Mouse deflection
        if (mouse.active) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < mouse.radius && dist > 0) {
            const force = (1 - dist / mouse.radius) * 26;
            p.x += (dx / dist) * force;
            p.y += (dy / dist) * force;
          }
        }

        // Shimmer wave
        const shimmerOffset = (p.baseTargetX * 0.015) - (now * 2.2);
        const waveShimmer = Math.sin(shimmerOffset);
        const alpha = Math.min(Math.max(0.35 + 0.45 * Math.sin(p.phase) + 0.2 * waveShimmer, 0.2), 1.0);

        if (p.isDiamondStar) {
          const s = p.size * (1 + 0.3 * Math.sin(p.phase));
          drawDiamondStar(ctx, p.x, p.y, s, p.color, alpha);
        } else {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = alpha;
          ctx.fill();

          if (alpha > 0.7) {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size * 0.45, 0, Math.PI * 2);
            ctx.fillStyle = '#ffffff';
            ctx.globalAlpha = 0.95;
            ctx.fill();
          }
        }
        ctx.globalAlpha = 1;
      }
    }

    animId = requestAnimationFrame(render);
  }

  // Handle Resize
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      cancelAnimationFrame(animId);
      startTime = null;
      resize();
      animId = requestAnimationFrame(render);
    }, 150);
  });

  // Safety fallback
  setTimeout(revealOtherElements, 2200);

  // Initialize once fonts are ready
  if (document.fonts) {
    document.fonts.ready.then(() => {
      resize();
      animId = requestAnimationFrame(render);
    });
  } else {
    resize();
    animId = requestAnimationFrame(render);
  }

})();

/**
 * ============================================================================
 * CURSOR.JS (COMPACT NEON HEART COMPANION)
 * Elegant, subtle heart that points and follows right beside the cursor arrow
 * ============================================================================
 */

(function () {
  'use strict';

  if (window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 768) {
    return;
  }

  const cursorHeart = document.createElement('div');
  cursorHeart.className = 'cyber-cursor-heart';
  cursorHeart.style.opacity = '0'; // Completely hidden at start
  cursorHeart.innerHTML = `
    <svg class="cursor-heart-svg" viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs>
        <linearGradient id="cursorHeartGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#c084fc" />
          <stop offset="60%" stop-color="#d946ef" />
          <stop offset="100%" stop-color="#a855f7" />
        </linearGradient>
      </defs>
      <path class="cursor-heart-path" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </svg>
  `;

  document.body.appendChild(cursorHeart);

  let mouseX = -100;
  let mouseY = -100;
  let heartX = -100;
  let heartY = -100;
  let isVisible = false;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    if (!isVisible) {
      isVisible = true;
      cursorHeart.style.opacity = '1';
      heartX = mouseX;
      heartY = mouseY;
    }
  }, { passive: true });

  document.addEventListener('mouseleave', () => {
    cursorHeart.style.opacity = '0';
    isVisible = false;
  });

  document.addEventListener('mouseenter', () => {
    // Becomes visible on next mousemove
  });

  window.addEventListener('mousedown', () => {
    cursorHeart.classList.add('cursor-clicking');
  });

  window.addEventListener('mouseup', () => {
    cursorHeart.classList.remove('cursor-clicking');
  });

  function renderCursor() {
    if (isVisible) {
      // Follow smoothly right beside the cursor tip
      heartX += (mouseX - heartX) * 0.22;
      heartY += (mouseY - heartY) * 0.22;
      cursorHeart.style.transform = `translate3d(${heartX + 12}px, ${heartY + 12}px, 0)`;
    }
    requestAnimationFrame(renderCursor);
  }
  requestAnimationFrame(renderCursor);

  function setupHoverListeners() {
    const interactiveSelectors = [
      'a',
      'button',
      '.btn',
      '.project-card',
      '.cert-card',
      '.patent-card',
      '.skill-pill',
      '.domain-tag',
      '.domain-pill',
      '.filter-btn',
      '.cert-tab-btn',
      '.social-link',
      '.social-link-btn',
      '.contact-social-btn',
      '.hamburger',
      '.patent-action-btn'
    ];

    document.querySelectorAll(interactiveSelectors.join(',')).forEach((el) => {
      el.addEventListener('mouseenter', () => {
        cursorHeart.classList.add('cursor-hovered');
      });

      el.addEventListener('mouseleave', () => {
        cursorHeart.classList.remove('cursor-hovered');
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupHoverListeners);
  } else {
    setupHoverListeners();
  }

  window.setupCursorInteractive = setupHoverListeners;
})();

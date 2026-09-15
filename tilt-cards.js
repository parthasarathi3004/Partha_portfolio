/**
 * ============================================================================
 * TILT-CARDS.JS
 * Holographic 3D Interactive Tilt Effect for Portfolio Cards
 * ============================================================================
 */

(function () {
  'use strict';

  if (window.matchMedia('(pointer: coarse)').matches) return;

  function initTilt() {
    const cards = document.querySelectorAll('.project-card, .avatar-card, .journey-card');

    cards.forEach(card => {
      // Remove existing listeners if any
      card.removeEventListener('mousemove', handleMouseMove);
      card.removeEventListener('mouseleave', handleMouseLeave);

      card.addEventListener('mousemove', handleMouseMove, { passive: true });
      card.addEventListener('mouseleave', handleMouseLeave, { passive: true });
    });
  }

  function handleMouseMove(e) {
    const card = this;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -7;
    const rotateY = ((x - centerX) / centerX) * 7;

    card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`;
  }

  function handleMouseLeave() {
    this.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTilt);
  } else {
    initTilt();
  }

  window.initTiltEffect = initTilt;
})();

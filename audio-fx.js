/**
 * ============================================================================
 * AUDIO-FX.JS
 * Procedural Futuristic Web Audio Synthesizer for Parthasarathi S's Portfolio
 * ============================================================================
 * Generates subtle ambient cosmic drones and high-tech interface chimes
 * 100% procedurally with zero external audio assets.
 */

(function () {
  'use strict';

  let audioCtx = null;
  let isMuted = true;
  let ambientOsc1 = null;
  let ambientOsc2 = null;
  let ambientGain = null;

  function initAudio() {
    if (audioCtx) return;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContext();
    } catch (e) {
      console.warn("Web Audio API not supported:", e);
    }
  }

  function startAmbientDrone() {
    if (!audioCtx || isMuted) return;
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    try {
      if (ambientOsc1) return; // already playing

      // Master ambient gain node (ultra soft)
      ambientGain = audioCtx.createGain();
      ambientGain.gain.setValueAtTime(0.001, audioCtx.currentTime);
      ambientGain.gain.exponentialRampToValueAtTime(0.04, audioCtx.currentTime + 3);

      // Low pass filter to keep sound warm and relaxing
      const filter = audioCtx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(220, audioCtx.currentTime);

      // Sub drone (55 Hz - A1 note)
      ambientOsc1 = audioCtx.createOscillator();
      ambientOsc1.type = 'sine';
      ambientOsc1.frequency.setValueAtTime(55, audioCtx.currentTime);

      // Harmony drone (110 Hz - A2 note with subtle detune)
      ambientOsc2 = audioCtx.createOscillator();
      ambientOsc2.type = 'triangle';
      ambientOsc2.frequency.setValueAtTime(110, audioCtx.currentTime);
      ambientOsc2.detune.setValueAtTime(4, audioCtx.currentTime);

      ambientOsc1.connect(filter);
      ambientOsc2.connect(filter);
      filter.connect(ambientGain);
      ambientGain.connect(audioCtx.destination);

      ambientOsc1.start();
      ambientOsc2.start();
    } catch (e) {
      console.warn("Ambient audio error:", e);
    }
  }

  function stopAmbientDrone() {
    if (!audioCtx || !ambientGain) return;
    try {
      ambientGain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.8);
      setTimeout(() => {
        if (ambientOsc1) {
          ambientOsc1.stop();
          ambientOsc1.disconnect();
          ambientOsc1 = null;
        }
        if (ambientOsc2) {
          ambientOsc2.stop();
          ambientOsc2.disconnect();
          ambientOsc2 = null;
        }
      }, 900);
    } catch (e) {}
  }

  // Futuristic UI Beep / Click Chime
  function playUiSound(type = 'click') {
    if (isMuted || !audioCtx) return;
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    try {
      const now = audioCtx.currentTime;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      if (type === 'hover') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(580, now);
        osc.frequency.exponentialRampToValueAtTime(740, now + 0.08);
        gain.gain.setValueAtTime(0.015, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.08);
      } else {
        // Crisp futuristic click
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, now);
        osc.frequency.exponentialRampToValueAtTime(1320, now + 0.12);
        gain.gain.setValueAtTime(0.03, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.12);
      }
    } catch (e) {}
  }

  // Initialize UI button toggle
  function initAudioToggle() {
    const toggleBtn = document.getElementById('audioToggleBtn');
    if (!toggleBtn) return;

    toggleBtn.addEventListener('click', () => {
      initAudio();
      isMuted = !isMuted;

      if (!isMuted) {
        toggleBtn.classList.add('active');
        toggleBtn.setAttribute('title', 'Sound: Enabled (Click to mute)');
        startAmbientDrone();
        playUiSound('click');
      } else {
        toggleBtn.classList.remove('active');
        toggleBtn.setAttribute('title', 'Sound: Muted (Click to enable audio)');
        stopAmbientDrone();
      }
    });

    // Attach subtle click feedback to buttons and filter items
    document.addEventListener('click', (e) => {
      if (e.target.closest('.btn, .filter-btn, .cert-tab-btn, .nav-link, .social-link-btn')) {
        playUiSound('click');
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAudioToggle);
  } else {
    initAudioToggle();
  }

  window.AudioFX = {
    play: playUiSound
  };
})();

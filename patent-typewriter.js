/**
 * ============================================================================
 * PATENT-TYPEWRITER.JS (CONTINUOUS LIVE-PRINT STREAMER)
 * ============================================================================
 * As soon as the user views the patent section, it continuously types and prints
 * out the authentic full patent disclosure live on the screen word-by-word
 * with a blinking cyber cursor, without any bullet points!
 */

(function () {
  'use strict';

  // Authentic Continuous Paragraph Abstracts (No Bullet Points)
  const PATENT_TEXTS = {
    patent1: `In this technological world, we can't able to maintain the data properly in personal computer because of some sudden computer crash or bugs occur in computer we may loss the data, to overcome this problem we can use IOT and Machine Learning algorithm to detect the fault earlier. The IOT device are used to monitor the temperature, voltage variations, fan variation speed, storage drive vibration and power supply metrics, these data are collected and send it to ML algorithm based MQTT protocol to find fault occurs in the computer. These IOTs are used to monitor the hardware components of the computer and the ML algorithm is used to monitor the software-based problems in the computer by analyzing the system logs and sensor values. It used to predict the software crash by detecting unusual log sequence, it was already inbuilt in ML algorithm. We are using multiple ML algorithm to predict the fault, they are, Decision trees: they are used to split the data in the branches it helps to classify the normal and abnormal conditions, Random forest: it is used to combine may decision trees and it improves its accuracy, Support vector machines: it is used to separate the data such as log sequence and sensor data it used for binary fault classification, K-Means cluster: it is used to group the data into clusters, Auto-encoders: it is used to reconstruct the error by recommending the user to rectify the occurring error, LSTM: this algorithm used to predict the time of an error happened and it recommend the user to rectify the error within the time. Because of using this method, it can detect the problem in our personal computers and we can rectify it before the computer get damaged.`,

    patent2: `India's voting system faces challenges from electoral malpractices, but a proposed solution seeks to address these issues through a multi-faceted approach. The secure voting system in India aims to ensure the integrity of the electoral process by combining traditional methods with advanced technologies. The system incorporates several key components, including biometric verification, which links Aadhaar card fingerprints to voter IDs and machines to prevent impersonation. A secure online platform for voter screening verifies identities, reducing the risk of fake ballots. Electronic Voting Machines (EVMs) with advanced security features, such as limiting votes to five per minute, help prevent booth capturing. To implement this system, accurate and up-to-date voter records are crucial. Poll workers must be properly trained to verify identities and follow standard procedures to ensure a smooth voting process. Collaboration with the Unique Identification Authority of India (UIDAI) leverages Aadhaar's facial recognition and fingerprint scanning capabilities, thereby enhancing voter verification.`
  };

  const activeTypingTimers = {};
  const hasAutoStarted = { patent1: false, patent2: false };

  function startLivePrint(cardId, textKey, speed = 24) {
    const text = PATENT_TEXTS[textKey];
    if (!text) return;

    const displayElement = document.getElementById(`typewriter-display-${cardId}`);
    const statusElement = document.getElementById(`typewriter-status-${cardId}`);
    const streamBtn = document.getElementById(`stream-btn-${cardId}`);
    if (!displayElement) return;

    if (activeTypingTimers[cardId]) {
      clearInterval(activeTypingTimers[cardId]);
      activeTypingTimers[cardId] = null;
    }

    displayElement.innerHTML = '';
    displayElement.classList.add('typing-active');

    if (statusElement) {
      statusElement.innerHTML = '<span class="status-pulse-purple"></span> <strong style="color: #c084fc;">LIVE PRINTING DISCLOSURE...</strong>';
    }

    if (streamBtn) {
      streamBtn.innerHTML = '<i class="fa-solid fa-rotate-right"></i> Restart Live Print';
    }

    // Split text into words to stream continuously
    const words = text.split(/(\s+)/);
    let wordIndex = 0;

    const cursor = document.createElement('span');
    cursor.className = 'cyber-terminal-cursor';
    cursor.textContent = ' ▌';
    displayElement.appendChild(cursor);

    const timer = setInterval(() => {
      if (wordIndex < words.length) {
        const currentWord = words[wordIndex];
        const span = document.createElement('span');
        span.textContent = currentWord;

        // Subtle keyword illumination
        const clean = currentWord.replace(/[^a-zA-Z]/g, '');
        if (['IOT', 'Machine', 'Learning', 'ML', 'LSTM', 'SVM', 'MQTT', 'Aadhaar', 'EVMs', 'UIDAI', 'Decision', 'Random', 'Forest'].includes(clean)) {
          span.className = 'tech-word-highlight';
        }

        displayElement.insertBefore(span, cursor);
        wordIndex++;

        // Soft audio tick every 6 words
        if (wordIndex % 6 === 0 && window.AudioFX) {
          window.AudioFX.play('hover');
        }
      } else {
        clearInterval(timer);
        activeTypingTimers[cardId] = null;
        displayElement.classList.remove('typing-active');

        if (statusElement) {
          statusElement.innerHTML = '<span class="status-check-green">✓</span> <strong style="color: #34d399;">LIVE PRINT COMPLETE</strong>';
        }
      }
    }, speed);

    activeTypingTimers[cardId] = timer;
  }

  function showFullText(cardId, textKey) {
    const text = PATENT_TEXTS[textKey];
    if (!text) return;

    if (activeTypingTimers[cardId]) {
      clearInterval(activeTypingTimers[cardId]);
      activeTypingTimers[cardId] = null;
    }

    const displayElement = document.getElementById(`typewriter-display-${cardId}`);
    const statusElement = document.getElementById(`typewriter-status-${cardId}`);
    const streamBtn = document.getElementById(`stream-btn-${cardId}`);

    if (displayElement) {
      displayElement.innerHTML = text;
    }

    if (statusElement) {
      statusElement.innerHTML = '<span class="status-check-green">✓</span> <strong style="color: #34d399;">COMPLETE DISCLOSURE</strong>';
    }

    if (streamBtn) {
      streamBtn.innerHTML = '<i class="fa-solid fa-play"></i> Restart Live Print';
    }
  }

  function initLivePrint() {
    const card1 = document.getElementById('patent-card-1');
    const streamBtn1 = document.getElementById('stream-btn-1');
    const fullBtn1 = document.getElementById('full-btn-1');

    if (streamBtn1) {
      streamBtn1.addEventListener('click', (e) => {
        e.stopPropagation();
        startLivePrint(1, 'patent1');
      });
    }
    if (fullBtn1) {
      fullBtn1.addEventListener('click', (e) => {
        e.stopPropagation();
        showFullText(1, 'patent1');
      });
    }
    if (card1) {
      card1.addEventListener('click', (e) => {
        if (!e.target.closest('button, a')) {
          startLivePrint(1, 'patent1');
        }
      });
    }

    const card2 = document.getElementById('patent-card-2');
    const streamBtn2 = document.getElementById('stream-btn-2');
    const fullBtn2 = document.getElementById('full-btn-2');

    if (streamBtn2) {
      streamBtn2.addEventListener('click', (e) => {
        e.stopPropagation();
        startLivePrint(2, 'patent2');
      });
    }
    if (fullBtn2) {
      fullBtn2.addEventListener('click', (e) => {
        e.stopPropagation();
        showFullText(2, 'patent2');
      });
    }
    if (card2) {
      card2.addEventListener('click', (e) => {
        if (!e.target.closest('button, a')) {
          startLivePrint(2, 'patent2');
        }
      });
    }

    // AUTO-START WHEN SCROLLED INTO VIEW ("paakum pothu print aagitey irukanum")
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            if (entry.target === card1 && !hasAutoStarted.patent1) {
              hasAutoStarted.patent1 = true;
              startLivePrint(1, 'patent1');
            } else if (entry.target === card2 && !hasAutoStarted.patent2) {
              hasAutoStarted.patent2 = true;
              startLivePrint(2, 'patent2');
            }
          }
        });
      }, { threshold: 0.25 });

      if (card1) observer.observe(card1);
      if (card2) observer.observe(card2);
    } else {
      startLivePrint(1, 'patent1');
      startLivePrint(2, 'patent2');
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLivePrint);
  } else {
    initLivePrint();
  }

  window.PatentLivePrint = {
    start: startLivePrint,
    showFull: showFullText
  };
})();

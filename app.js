


/**
 * CalmBubbles Main App Script
 * Handles vibration and bubble logic for the main page.
 * Organized into modules for maintainability.
 */

// --- Vibration Module ---
/**
 * Handles vibration controls and indicator logic.
 */
const VibrationModule = (function () {
  // Default values for vibration controls
  const VIBRATION_INTERVAL_DEFAULT = 5 * 1000; // ms
  const VIBRATION_DURATION_DEFAULT = 200; // ms

  // Cache DOM elements
  const vibrationIndicator = document.getElementById('vibration-indicator');
  const startBtn = document.getElementById('start-vibration');
  const stopBtn = document.getElementById('stop-vibration');
  const intervalInput = document.getElementById('vibration-interval');
  const durationInput = document.getElementById('vibration-duration');
  const controls = document.getElementById('controls');

  let vibrationIntervalId = null;

  /**
   * Triggers the vibration indicator animation.
   */
  function triggerVibrationIndicator() {
    if (!vibrationIndicator) return;
    vibrationIndicator.classList.remove('pulse');
    // Force reflow to restart animation
    void vibrationIndicator.offsetWidth;
    vibrationIndicator.classList.add('pulse');
  }

  /**
   * Starts the vibration at the specified interval and duration.
   */
  function startVibration() {
    if (!intervalInput || !durationInput) return;
    const interval = parseInt(intervalInput.value, 10) * 1000 || VIBRATION_INTERVAL_DEFAULT;
    const duration = parseInt(durationInput.value, 10) || VIBRATION_DURATION_DEFAULT;
    if (vibrationIntervalId) clearInterval(vibrationIntervalId);
    if (navigator.vibrate) {
      navigator.vibrate(duration);
      triggerVibrationIndicator();
      vibrationIntervalId = setInterval(() => {
        navigator.vibrate(duration);
        triggerVibrationIndicator();
      }, interval);
    } else {
      alert('Vibration API not supported on this device.');
    }
  }

  /**
   * Stops the vibration and clears the interval.
   */
  function stopVibration() {
    if (vibrationIntervalId) {
      clearInterval(vibrationIntervalId);
      vibrationIntervalId = null;
    }
    if (navigator.vibrate) {
      navigator.vibrate(0);
    }
  }

  /**
   * Checks if the Vibration API is supported.
   */
  function isVibrationSupported() {
    // Only check for API presence, do not test vibrate (test can fail on some Androids)
    return 'vibrate' in navigator;
  }

  /**
   * Sets up event listeners and disables controls if unsupported.
   */
  function setup() {
    if (!startBtn || !stopBtn || !controls) return;
    if (!isVibrationSupported()) {
      startBtn.disabled = true;
      stopBtn.disabled = true;
      const msg = document.createElement('div');
      msg.style.color = '#b00';
      msg.style.fontSize = '1rem';
      msg.style.marginTop = '0.5rem';
      msg.textContent = 'Vibration is not supported on this device or browser.';
      controls.appendChild(msg);
    } else {
      startBtn.addEventListener('click', startVibration);
      stopBtn.addEventListener('click', stopVibration);
    }
  }

  // Public API
  return {
    setup
  };
})();

// --- Bubble Module ---
/**
 * Handles animated bubble creation and removal.
 */
const BubbleModule = (function () {
  // Bubble configuration constants
  const BUBBLE_MIN_SIZE = 44;
  const BUBBLE_MAX_SIZE = 88;
  const BUBBLE_MIN_DRIFT = -18;
  const BUBBLE_MAX_DRIFT = 18;
  const BUBBLE_MIN_OPACITY = 0.7;
  const BUBBLE_MAX_OPACITY = 1;
  const BUBBLE_MIN_FLOAT = 4.2;
  const BUBBLE_MAX_FLOAT = 6.2;
  const BUBBLE_SPAWN_INTERVAL = 1200; // ms
  const BUBBLE_POP_DURATION = 350; // ms

  // Pastel color palette for bubbles
  const pastelPalettes = [
    ['#b2f0e6', '#e0c3fc'],
    ['#f8ffae', '#b5ead7'],
    ['#b5ead7', '#c7ceea'],
    ['#ffdac1', '#e2f0cb'],
    ['#c7ceea', '#e0c3fc'],
    ['#e2f0cb', '#b2f0e6'],
    ['#f8ffae', '#c7ceea'],
  ];

  // Cache DOM
  const bubbleArea = document.getElementById('bubble-area');
  if (!bubbleArea) return {}; // No bubble area on this page

  /**
   * Returns a random number between min and max.
   */
  function randomBetween(min, max) {
    return Math.random() * (max - min) + min;
  }

  /**
   * Creates and animates a single bubble.
   */
  function createBubble() {
    const bubble = document.createElement('div');
    bubble.className = 'bubble';
    const size = randomBetween(BUBBLE_MIN_SIZE, BUBBLE_MAX_SIZE);
    bubble.style.width = `${size}px`;
    bubble.style.height = `${size}px`;
    // Horizontal drift: start X and drift X
    const startX = randomBetween(0, bubbleArea.offsetWidth - size);
    const drift = randomBetween(BUBBLE_MIN_DRIFT, BUBBLE_MAX_DRIFT);
    bubble.style.left = `${startX}px`;
    bubble.style.top = `${randomBetween(0, bubbleArea.offsetHeight - size)}px`;
    bubble.style.opacity = randomBetween(BUBBLE_MIN_OPACITY, BUBBLE_MAX_OPACITY);

    // Assign random pastel gradient
    const palette = pastelPalettes[Math.floor(Math.random() * pastelPalettes.length)];
    bubble.style.setProperty('--bubble-main', palette[0]);
    bubble.style.setProperty('--bubble-accent', palette[1]);

    // Animate horizontal drift and scale pulse
    const floatDuration = randomBetween(BUBBLE_MIN_FLOAT, BUBBLE_MAX_FLOAT);
    bubble.style.animationDuration = `${floatDuration}s, 2.5s`;
    bubble.animate([
      { transform: `translateY(0px) translateX(0px) scale(1)` },
      { transform: `translateY(-40px) translateX(${drift}px) scale(1.08)` }
    ], {
      duration: floatDuration * 1000,
      fill: 'forwards',
      easing: 'linear'
    });

    // Remove bubble on click (pop effect)
    bubble.addEventListener('click', () => {
      bubble.classList.add('pop');
      setTimeout(() => {
        if (bubble.parentNode) bubble.remove();
      }, BUBBLE_POP_DURATION);
      // Optional: gentle pop sound can be added here
    });

    bubbleArea.appendChild(bubble);

    // Remove bubble after a while if not popped
    setTimeout(() => {
      if (bubble.parentNode) bubble.remove();
    }, floatDuration * 1000);
  }

  // Spawn bubbles at random intervals
  setInterval(() => {
    if (document.hasFocus()) {
      createBubble();
    }
  }, BUBBLE_SPAWN_INTERVAL);

  // Optionally, handle window resize for future improvements
  window.addEventListener('resize', () => {
    // Could reposition bubbles if needed
  });

  // Public API (empty for now, could expose createBubble if needed)
  return {};
})();

// --- Initialize modules ---
// Ensure vibration controls are set up after DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  VibrationModule.setup();
});

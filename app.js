// app.js

// Vibration logic

let vibrationIntervalId = null;
const vibrationIndicator = document.getElementById('vibration-indicator');

function triggerVibrationIndicator() {
  if (!vibrationIndicator) return;
  vibrationIndicator.classList.remove('pulse');
  // Force reflow to restart animation
  void vibrationIndicator.offsetWidth;
  vibrationIndicator.classList.add('pulse');
}

function startVibration() {
  const interval = parseInt(document.getElementById('vibration-interval').value, 10) * 1000;
  if (vibrationIntervalId) clearInterval(vibrationIntervalId);
  if (navigator.vibrate) {
    navigator.vibrate(200);
    triggerVibrationIndicator();
    vibrationIntervalId = setInterval(() => {
      navigator.vibrate(200);
      triggerVibrationIndicator();
    }, interval);
  } else {
    alert('Vibration API not supported on this device.');
  }
}

function stopVibration() {
  if (vibrationIntervalId) {
    clearInterval(vibrationIntervalId);
    vibrationIntervalId = null;
  }
  if (navigator.vibrate) {
    navigator.vibrate(0);
  }
}


// Enhanced vibration support detection
function isVibrationSupported() {
  // Check for API and try a test vibration (will return true on most Android, false on iOS/desktop)
  if (!('vibrate' in navigator)) return false;
  // Try a test vibration and see if it returns true (supported) or false (not supported)
  try {
    return navigator.vibrate(1) !== false;
  } catch (e) {
    return false;
  }
}

const startBtn = document.getElementById('start-vibration');
const stopBtn = document.getElementById('stop-vibration');

if (!isVibrationSupported()) {
  startBtn.disabled = true;
  stopBtn.disabled = true;
  const controls = document.getElementById('controls');
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

// Bubble logic
const bubbleArea = document.getElementById('bubble-area');

function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

// Pastel color palette
const pastelPalettes = [
  ['#b2f0e6', '#e0c3fc'],
  ['#f8ffae', '#b5ead7'],
  ['#b5ead7', '#c7ceea'],
  ['#ffdac1', '#e2f0cb'],
  ['#c7ceea', '#e0c3fc'],
  ['#e2f0cb', '#b2f0e6'],
  ['#f8ffae', '#c7ceea'],
];

function createBubble() {
  const bubble = document.createElement('div');
  bubble.className = 'bubble';
  const size = randomBetween(44, 88); // px
  bubble.style.width = `${size}px`;
  bubble.style.height = `${size}px`;
  // Horizontal drift: start X and drift X
  const startX = randomBetween(0, bubbleArea.offsetWidth - size);
  const drift = randomBetween(-18, 18); // px
  bubble.style.left = `${startX}px`;
  bubble.style.top = `${randomBetween(0, bubbleArea.offsetHeight - size)}px`;
  bubble.style.opacity = randomBetween(0.7, 1);

  // Assign random pastel gradient
  const palette = pastelPalettes[Math.floor(Math.random() * pastelPalettes.length)];
  bubble.style.setProperty('--bubble-main', palette[0]);
  bubble.style.setProperty('--bubble-accent', palette[1]);

  // Animate horizontal drift and scale pulse
  const floatDuration = randomBetween(4.2, 6.2); // seconds
  bubble.style.animationDuration = `${floatDuration}s, 2.5s`;
  bubble.animate([
    { transform: `translateY(0px) translateX(0px) scale(1)` },
    { transform: `translateY(-40px) translateX(${drift}px) scale(1.08)` }
  ], {
    duration: floatDuration * 1000,
    fill: 'forwards',
    easing: 'linear'
  });

  bubble.addEventListener('click', () => {
    bubble.classList.add('pop');
    setTimeout(() => {
      if (bubble.parentNode) bubble.remove();
    }, 350); // Match pop animation duration
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
}, 1200);

// Resize bubbles on window resize
window.addEventListener('resize', () => {
  // No-op for now, could reposition bubbles if needed
});

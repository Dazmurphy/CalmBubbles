// box-breathing.js
// Handles the box breathing animation and logic for box-breathing.html

document.addEventListener('DOMContentLoaded', function () {
  const box = document.getElementById('box-breathing-box');
  const instructions = document.getElementById('box-breathing-instructions');
  const startBtn = document.getElementById('start-box-breathing');
  const stopBtn = document.getElementById('stop-box-breathing');
  let phase = 0;
  let intervalId = null;
  const phases = [
    { label: 'Inhale', class: 'breath-in', message: 'Breathe in slowly', duration: 4000 },
    { label: 'Hold', class: 'hold', message: 'Hold your breath', duration: 4000 },
    { label: 'Exhale', class: 'breath-out', message: 'Breathe out slowly', duration: 4000 },
    { label: 'Hold', class: 'hold', message: 'Hold your breath', duration: 4000 },
  ];

  // Animate color blending for inhale/exhale
  function animateBoxColor(startColor, endColor, duration) {
    let start = null;
    function hexToRgb(hex) {
      hex = hex.replace('#', '');
      if (hex.length === 3) hex = hex.split('').map(x => x + x).join('');
      const num = parseInt(hex, 16);
      return [num >> 16, (num >> 8) & 255, num & 255];
    }
    function rgbToHex([r, g, b]) {
      return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
    }
    const startRgb = hexToRgb(startColor);
    const endRgb = hexToRgb(endColor);
    function step(ts) {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const current = startRgb.map((c, i) => Math.round(c + (endRgb[i] - c) * progress));
      box.style.background = rgbToHex(current);
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  // Track last size phase to keep box size during hold
  let lastSizeClass = '';
  function nextPhase() {
    const p = phases[phase];
    box.textContent = p.label;
    instructions.textContent = p.message;
    if (p.label === 'Inhale') {
      box.className = 'box breath-in';
      lastSizeClass = 'breath-in';
      animateBoxColor('#4f8a8b', '#b2f0e6', p.duration);
    } else if (p.label === 'Exhale') {
      box.className = 'box breath-out';
      lastSizeClass = 'breath-out';
      animateBoxColor('#b2f0e6', '#e0c3fc', p.duration);
    } else if (p.label === 'Hold') {
      // Only update color, not size
      box.className = 'box ' + lastSizeClass;
      box.style.background = 'linear-gradient(135deg, #e0c3fc 0%, #b2f0e6 100%)';
      box.style.color = '#3a6073';
    }
    phase = (phase + 1) % phases.length;
    intervalId = setTimeout(nextPhase, p.duration);
  }

  startBtn.addEventListener('click', () => {
    startBtn.disabled = true;
    stopBtn.disabled = false;
    phase = 0;
    nextPhase();
  });
  stopBtn.addEventListener('click', () => {
    startBtn.disabled = false;
    stopBtn.disabled = true;
    clearTimeout(intervalId);
    box.textContent = 'Ready';
    box.className = 'box';
    box.style.background = '';
    box.style.color = '';
    instructions.textContent = 'Click Start to begin box breathing (4 seconds in, 4 hold, 4 out, 4 hold).';
  });
});

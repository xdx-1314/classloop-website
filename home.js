const chart = document.querySelector('#memory-curve');
const context = chart.getContext('2d');

function drawCurve() {
  const palette = getComputedStyle(chart);
  const accent = palette.getPropertyValue('--accent').trim();
  const muted = palette.getPropertyValue('--muted').trim();
  const line = palette.getPropertyValue('--chart-grid').trim();
  const pixelRatio = Math.max(1, window.devicePixelRatio || 1);
  const width = 600;
  const height = 225;

  chart.width = width * pixelRatio;
  chart.height = height * pixelRatio;
  context.scale(pixelRatio, pixelRatio);
  context.lineCap = 'round';

  context.strokeStyle = line;
  context.lineWidth = 1.5;
  for (const y of [34, 79, 124, 169, 212]) {
    context.beginPath();
    context.moveTo(12, y);
    context.lineTo(588, y);
    context.stroke();
  }

  context.strokeStyle = muted;
  context.lineWidth = 2;
  context.setLineDash([5, 7]);
  context.beginPath();
  context.moveTo(16, 43);
  context.bezierCurveTo(75, 166, 146, 202, 586, 203);
  context.stroke();
  context.setLineDash([]);

  const segments = [
    { start: [16, 43], control: [52, 112, 76, 130], end: [121, 144], reset: 38 },
    { start: [121, 38], control: [161, 84, 202, 109], end: [273, 129], reset: 31 },
    { start: [273, 31], control: [334, 69, 399, 92], end: [484, 111], reset: 25 },
    { start: [484, 25], control: [510, 42, 550, 55], end: [586, 64] }
  ];

  context.strokeStyle = accent;
  context.fillStyle = accent;
  context.lineWidth = 3.5;
  context.font = '20px system-ui, sans-serif';
  context.textAlign = 'center';

  for (const { start, control, end, reset } of segments) {
    context.beginPath();
    context.moveTo(...start);
    context.bezierCurveTo(...control, ...end);
    context.stroke();

    if (reset !== undefined) {
      const [x, y] = end;
      context.setLineDash([4, 5]);
      context.beginPath();
      context.moveTo(x, y);
      context.lineTo(x, reset);
      context.stroke();
      context.setLineDash([]);
      context.beginPath();
      context.arc(x, y, 5, 0, Math.PI * 2);
      context.fill();
      context.fillText({ en: 'Review', 'zh-Hant': '複習' }[document.documentElement.lang] || '复习', x, 190);
    }
  }
}

if (context) {
  drawCurve();
}

const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');

if (!motionPreference.matches && 'IntersectionObserver' in window) {
  const revealTargets = document.querySelectorAll(
    '.curve-card, .review-screens, .plans table, .billing, .device-gallery'
  );

  const observer = new IntersectionObserver((entries) => {
    for (const { target, isIntersecting } of entries) {
      if (isIntersecting) {
        target.classList.add('reveal-visible');
        observer.unobserve(target);
      }
    }
  }, { threshold: 0.14 });

  for (const target of revealTargets) {
    observer.observe(target);
  }
}

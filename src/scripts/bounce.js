// DVD-screensaver-style bounce for the 404 monogram. Delta-time velocity
// (px/sec) so speed is consistent across refresh rates; a clamped delta
// so a backgrounded tab can't produce a huge jump on return.
const SPEED = 196; // px/sec (98 doubled)
const MAX_DELTA = 0.05; // seconds — clamps a stale/backgrounded frame
const CORNER_EGG_MS = 2600;

// Same accent, hue-rotated. Saturation/lightness held constant so every
// variant stays equally legible against --color-ground.
const COLORS = [
  'hsl(165 42% 29%)', // the accent itself, #2A6B5E
  'hsl(215 42% 29%)',
  'hsl(265 42% 29%)',
  'hsl(315 42% 29%)',
  'hsl(15 42% 29%)',
];

export function initBounce(link, eggEl) {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced) return; // static, centered via CSS — no rAF loop at all

  let vw = window.innerWidth;
  let vh = window.innerHeight;
  let w = link.offsetWidth;
  let h = link.offsetHeight;

  let pos = {
    x: Math.random() * Math.max(vw - w, 0),
    y: Math.random() * Math.max(vh - h, 0),
  };
  const angle = Math.random() * Math.PI * 2;
  let vel = { x: Math.cos(angle) * SPEED, y: Math.sin(angle) * SPEED };
  // A near-vertical or near-horizontal launch reads as a glitch (looks
  // stuck to one axis) — push it toward a real diagonal.
  if (Math.abs(vel.x) < SPEED * 0.3) vel.x = Math.sign(vel.x || 1) * SPEED * 0.3;
  if (Math.abs(vel.y) < SPEED * 0.3) vel.y = Math.sign(vel.y || 1) * SPEED * 0.3;

  let colorIndex = Math.floor(Math.random() * COLORS.length);
  let lastTime = null;
  let rafId = null;
  let running = true;
  let paused = false; // hover/focus pause, distinct from tab-hidden pause
  let eggTimeout = null;

  function applyTransform() {
    link.style.transform = `translate(${pos.x}px, ${pos.y}px)`;
  }

  function cycleColor() {
    colorIndex = (colorIndex + 1) % COLORS.length;
    link.style.color = COLORS[colorIndex];
  }

  function cornerHit() {
    if (!eggEl) return;
    eggEl.classList.add('is-visible');
    clearTimeout(eggTimeout);
    eggTimeout = setTimeout(() => eggEl.classList.remove('is-visible'), CORNER_EGG_MS);
  }

  function tick(now) {
    if (!running) return;
    if (lastTime === null) lastTime = now;
    const dt = Math.min((now - lastTime) / 1000, MAX_DELTA);
    lastTime = now;

    pos.x += vel.x * dt;
    pos.y += vel.y * dt;

    let bouncedX = false;
    let bouncedY = false;

    if (pos.x <= 0) {
      pos.x = 0;
      vel.x = Math.abs(vel.x);
      bouncedX = true;
    } else if (pos.x + w >= vw) {
      pos.x = vw - w;
      vel.x = -Math.abs(vel.x);
      bouncedX = true;
    }

    if (pos.y <= 0) {
      pos.y = 0;
      vel.y = Math.abs(vel.y);
      bouncedY = true;
    } else if (pos.y + h >= vh) {
      pos.y = vh - h;
      vel.y = -Math.abs(vel.y);
      bouncedY = true;
    }

    if (bouncedX || bouncedY) cycleColor();
    if (bouncedX && bouncedY) cornerHit();

    applyTransform();
    rafId = requestAnimationFrame(tick);
  }

  function start() {
    if (rafId !== null) return;
    lastTime = null;
    rafId = requestAnimationFrame(tick);
  }

  function stop() {
    if (rafId === null) return;
    cancelAnimationFrame(rafId);
    rafId = null;
  }

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      running = false;
      stop();
    } else {
      running = true;
      if (!paused) start();
    }
  });

  // Nobody should have to chase a moving link with a cursor or keyboard.
  const pause = () => {
    paused = true;
    stop();
  };
  const resume = () => {
    paused = false;
    if (running) start();
  };
  link.addEventListener('mouseenter', pause);
  link.addEventListener('mouseleave', resume);
  link.addEventListener('focus', pause);
  link.addEventListener('blur', resume);

  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      vw = window.innerWidth;
      vh = window.innerHeight;
      w = link.offsetWidth;
      h = link.offsetHeight;
      pos.x = Math.min(pos.x, Math.max(vw - w, 0));
      pos.y = Math.min(pos.y, Math.max(vh - h, 0));
      applyTransform();
    }, 150);
  });

  link.style.color = COLORS[colorIndex];
  applyTransform();
  start();
}

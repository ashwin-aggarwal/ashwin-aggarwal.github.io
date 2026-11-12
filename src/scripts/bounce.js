// DVD-screensaver-style bounce for the 404 chip mark. Delta-time velocity
// (px/sec) so speed is consistent across refresh rates; a clamped delta
// so a backgrounded tab can't produce a huge jump on return.
//
// The one deliberate exception to "nothing loops on its own" (CLAUDE.md):
// it's the 404 easter egg. It still stops under reduced motion, pauses on
// hover/focus so the link can be clicked, and halts in a hidden tab.
const SPEED = 196; // px/sec (98 doubled)
const MAX_DELTA = 0.05; // seconds — clamps a stale/backgrounded frame
const CORNER_EGG_MS = 2600;
const LIT_MS = 120; // how long the chip holds green before fading to ink

export function initBounce(stage, link, eggEl) {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced) return; // static, centered via CSS — no rAF loop at all

  // Only now take the mark out of the centered flow; without JS or with
  // reduced motion it stays put above the copy.
  stage.classList.add('is-bouncing');

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

  let lastTime = null;
  let rafId = null;
  let running = true;
  let paused = false; // hover/focus pause, distinct from tab-hidden pause
  let eggTimeout = null;
  let litTimeout = null;

  function applyTransform() {
    link.style.transform = `translate(${pos.x}px, ${pos.y}px)`;
  }

  // Each wall hit lights the chip green, like a signal landing on a pin;
  // the CSS transition fades it back to ink.
  function flash() {
    link.classList.add('is-lit');
    clearTimeout(litTimeout);
    litTimeout = setTimeout(() => link.classList.remove('is-lit'), LIT_MS);
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

    if (bouncedX || bouncedY) flash();
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

  applyTransform();
  start();
}

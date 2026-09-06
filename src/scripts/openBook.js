// Owns the single reusable 3D stage: the FLIP handoff from a clicked spine,
// the one reversible open/close timeline, and (from Step 4 on) page turning.
// See CLAUDE.md's "Book geometry contract" before touching any transform
// here — model space has the front cover facing +Z, spine on the -X side.
import { gsap } from 'gsap';

const BOOK_W = 260; // must match .book's --bw default
const BOOK_H = 390; // must match .book's --bh default

let els = null;
let tl = null;
let flip = { dx: 0, dy: 0, scale: 1, bd: 40 };
let currentSpine = null;
let currentHover = null;
let isOpen = false;

export function initStage(stageEl) {
  const book = stageEl.querySelector('[data-book]');
  els = {
    stageEl,
    book,
    back: book.querySelector('[data-back]'),
    spine: book.querySelector('[data-spine]'),
    spineTitle: book.querySelector('[data-spine-title]'),
    cover: book.querySelector('[data-cover]'),
    coverArt: book.querySelector('[data-cover-art]'),
    coverInside: book.querySelector('[data-cover-inside]'),
    scrim: stageEl.querySelector('[data-scrim]'),
    controls: stageEl.querySelector('[data-controls]'),
    prevBtn: stageEl.querySelector('[data-prev]'),
    nextBtn: stageEl.querySelector('[data-next]'),
    putbackBtn: stageEl.querySelector('[data-putback]'),
    counter: stageEl.querySelector('[data-counter]'),
    shelfEl: document.getElementById('bookshelf'),
  };

  // Step 3 has no page-turning yet — a single blank spread, nav disabled.
  els.prevBtn.disabled = true;
  els.nextBtn.disabled = true;
  els.counter.textContent = 'SPREAD 1 / 1';

  buildTimeline();

  els.scrim.addEventListener('click', close);
  els.putbackBtn.addEventListener('click', close);
  document.addEventListener('keydown', onKeydown);
}

function buildTimeline() {
  const { stageEl, book, cover, scrim, shelfEl } = els;

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const k = reduced ? 0.02 : 1;
  const d = (seconds) => seconds * k;

  tl = gsap.timeline({
    paused: true,
    onReverseComplete() {
      stageEl.classList.remove('is-open');
      stageEl.setAttribute('aria-hidden', 'true');
      shelfEl?.removeAttribute('aria-hidden');
      shelfEl?.classList.remove('is-dimmed');
      unlockScroll();
      if (currentSpine) {
        currentSpine.style.visibility = 'visible';
        const toFocus = currentSpine;
        currentSpine = null;
        currentHover = null;
        toFocus.focus();
      }
      isOpen = false;
    },
  });

  // --- FLIP start state -----------------------------------------------
  // Function-based values so the same timeline instance re-reads fresh
  // per-book numbers every time it replays from 0 (tl.play(0) in open()).
  tl.set(book, { x: () => flip.dx, y: () => flip.dy, scale: () => flip.scale, rotateY: 90 }, 0)
    .set(cover, { z: () => flip.bd, rotateY: 0 }, 0)
    .set(book, { '--bd': () => `${flip.bd}px` }, 0)
    // Perspective is shared by the whole stage but the book starts far
    // off-axis (at the spine's real position). Aiming the camera at the
    // spine for the FLIP-start instant avoids the off-axis 3D skew a fixed
    // center-origin would introduce at that distance — see Step 3 review
    // notes (measured ~28px position error without this).
    .set(stageEl, { perspectiveOrigin: () => `${flip.originX}% ${flip.originY}%` }, 0)

    // A — scrim fades in; shelf dims and desaturates
    .to(scrim, { opacity: 1, duration: d(0.4) }, 0)
    .to(shelfEl, { filter: 'brightness(0.35) saturate(0.7)', duration: d(0.4) }, 0)

    // B — travel to center, scale up, still edge-on. Perspective origin
    // eases back to the stage's resting center on the same beat, so the
    // camera and the book arrive together.
    .to(book, { x: 0, y: 0, scale: 1, duration: d(0.75), ease: 'power3.out' }, 0.05)
    .to(stageEl, { perspectiveOrigin: '50% 46%', duration: d(0.75), ease: 'power3.out' }, 0.05)

    // C — profile to front-facing. Overlapped into the tail of B so the
    // travel and the turn read as one continuous move, not three beats.
    .to(book, { rotateY: 0, duration: d(0.6), ease: 'power2.inOut' }, d(0.05) + d(0.75) - d(0.25))

    // D — cover hinges open; the book shifts to keep the resulting spread
    // optically centered (see Step 3 review notes on the shift direction).
    .to(cover, { rotateY: -180, duration: d(0.9), ease: 'power2.inOut' }, '>0.05')
    .to(book, { x: `+=${BOOK_W / 2}`, duration: d(0.9), ease: 'power2.inOut' }, '<');
}

function measureFlip(spineEl) {
  const r = spineEl.getBoundingClientRect();
  const scale = r.height / BOOK_H;
  const bd = r.width;
  const vcx = window.innerWidth / 2;
  const vcy = window.innerHeight / 2;
  return {
    scale,
    bd,
    dx: r.left - vcx,
    dy: r.top + r.height / 2 - vcy,
    originX: ((r.left + r.width / 2) / window.innerWidth) * 100,
    originY: ((r.top + r.height / 2) / window.innerHeight) * 100,
  };
}

export function open(book, spineEl, hoverHandle) {
  if (isOpen || tl.isActive()) return;
  isOpen = true;

  hoverHandle?.tl.pause(0);

  flip = measureFlip(spineEl);

  els.coverArt.style.background = book.spineColor;
  els.spine.style.setProperty('--spine-color', book.spineColor);
  els.spineTitle.textContent = book.title;
  els.coverInside.textContent = '';

  spineEl.style.visibility = 'hidden';
  currentSpine = spineEl;
  currentHover = hoverHandle ?? null;

  els.stageEl.classList.add('is-open');
  els.stageEl.removeAttribute('aria-hidden');
  els.shelfEl?.setAttribute('aria-hidden', 'true');
  els.shelfEl?.classList.add('is-dimmed');

  lockScroll();
  tl.eventCallback('onComplete', () => {
    els.putbackBtn.focus();
  });
  tl.play(0);
}

export function close() {
  if (!isOpen) return;
  tl.reverse();
}

function onKeydown(e) {
  if (!isOpen) return;
  if (e.key === 'Escape') {
    close();
    return;
  }
  if (e.key === 'Tab') trapFocus(e);
}

function trapFocus(e) {
  const focusable = [els.prevBtn, els.nextBtn, els.putbackBtn].filter(
    (el) => el && !el.disabled,
  );
  if (focusable.length === 0) return;
  const first = focusable[0];
  const last = focusable[focusable.length - 1];

  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault();
    last.focus();
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault();
    first.focus();
  }
}

function lockScroll() {
  const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
  document.body.style.overflow = 'hidden';
  document.body.style.paddingRight = `${scrollbarWidth}px`;
}

function unlockScroll() {
  document.body.style.overflow = '';
  document.body.style.paddingRight = '';
}

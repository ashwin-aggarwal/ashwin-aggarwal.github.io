// Typewriter reveal for section titles. Progressive enhancement — the full
// title is already in the DOM inside a [data-typewriter-text] span, and the
// heading's aria-label carries the real accessible name at all times, so
// screen readers and no-JS/no-motion visitors always see the finished text
// immediately. This only clears and re-types the visible span, each time a
// heading scrolls into view — and never runs at all under
// prefers-reduced-motion. Leaving the view cancels any typing in progress
// and restores the full text, so the next entry starts clean.
const TYPE_INTERVAL_MS = 45;

export function initTypewriter() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const headings = document.querySelectorAll('[data-typewriter]');
  if (!headings.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) typeOut(entry.target);
        else reset(entry.target);
      }
    },
    { threshold: 0.6 },
  );

  headings.forEach((heading) => observer.observe(heading));
}

// Per-heading typing state: the full text, the pending timer, the cursor.
const typing = new WeakMap();

function reset(heading) {
  const state = typing.get(heading);
  if (!state) return;
  clearTimeout(state.timer);
  state.cursor.remove();
  heading.querySelector('[data-typewriter-text]').textContent = state.text;
  typing.delete(heading);
}

function typeOut(heading) {
  const span = heading.querySelector('[data-typewriter-text]');
  if (!span) return;
  reset(heading);

  const text = span.textContent;
  span.textContent = '';

  const cursor = document.createElement('span');
  cursor.className = 'section-title__cursor';
  cursor.setAttribute('aria-hidden', 'true');
  cursor.textContent = '|';
  heading.appendChild(cursor);

  const state = { text, cursor, timer: 0 };
  typing.set(heading, state);

  let i = 0;
  const step = () => {
    span.textContent = text.slice(0, i);
    i += 1;
    if (i <= text.length) {
      state.timer = setTimeout(step, TYPE_INTERVAL_MS);
    } else {
      cursor.remove();
      typing.delete(heading);
    }
  };
  step();
}

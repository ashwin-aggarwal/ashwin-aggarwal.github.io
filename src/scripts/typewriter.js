// Typewriter reveal for section titles. Progressive enhancement — the full
// title is already in the DOM inside a [data-typewriter-text] span, and the
// heading's aria-label carries the real accessible name at all times, so
// screen readers and no-JS/no-motion visitors always see the finished text
// immediately. This only clears and re-types the visible span, once, the
// first time a heading scrolls into view — and never runs at all under
// prefers-reduced-motion.
const TYPE_INTERVAL_MS = 45;

export function initTypewriter() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const headings = document.querySelectorAll('[data-typewriter]');
  if (!headings.length) return;

  const observer = new IntersectionObserver(
    (entries, obs) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        obs.unobserve(entry.target);
        typeOut(entry.target);
      }
    },
    { threshold: 0.6 },
  );

  headings.forEach((heading) => observer.observe(heading));
}

function typeOut(heading) {
  const span = heading.querySelector('[data-typewriter-text]');
  if (!span) return;

  const text = span.textContent;
  span.textContent = '';

  const cursor = document.createElement('span');
  cursor.className = 'section-title__cursor';
  cursor.setAttribute('aria-hidden', 'true');
  cursor.textContent = '|';
  heading.appendChild(cursor);

  let i = 0;
  const step = () => {
    span.textContent = text.slice(0, i);
    i += 1;
    if (i <= text.length) {
      setTimeout(step, TYPE_INTERVAL_MS);
    } else {
      cursor.remove();
    }
  };
  step();
}

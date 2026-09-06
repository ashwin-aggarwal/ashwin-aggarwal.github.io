// Two behaviors media wells need that pure CSS can't do:
// - reduced-motion-aware video autoplay (autoplay when motion is fine,
//   otherwise a paused frame with native controls to opt in)
// - graceful fallback to an empty well if a referenced file 404s, so a
//   present-but-missing `media` value reads as an empty well rather than
//   a broken image/video icon
export function initMediaWells() {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  document.querySelectorAll('[data-media]').forEach((el) => {
    el.addEventListener('error', () => {
      el.closest('[data-media-well]')?.classList.add('is-empty');
      el.remove();
    });

    if (el.tagName === 'VIDEO') {
      if (reduced) {
        el.removeAttribute('autoplay');
        el.setAttribute('controls', '');
        el.pause();
      } else {
        el.setAttribute('autoplay', '');
        el.play?.().catch(() => {});
      }
    }
  });
}

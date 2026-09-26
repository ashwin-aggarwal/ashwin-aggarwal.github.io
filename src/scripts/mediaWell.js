// Behaviors media wells need that pure CSS can't do:
// - reduced-motion-aware video autoplay (autoplay when motion is fine,
//   otherwise a paused frame; the toggle below is the way to opt in)
// - a pause/play toggle under each project video, so the loop can be stopped
// - graceful fallback to an empty well if a referenced file 404s, so a
//   present-but-missing `media` value reads as an empty well rather than
//   a broken image/video icon
export function initMediaWells() {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  document.querySelectorAll('[data-media]').forEach((el) => {
    const toggle = el.closest('.project-row__media')?.querySelector('[data-media-toggle]');

    el.addEventListener('error', () => {
      el.closest('[data-media-well]')?.classList.add('is-empty');
      el.remove();
      toggle?.remove();
    });

    if (el.tagName === 'VIDEO') {
      if (toggle) initToggle(el, toggle);

      if (reduced) {
        el.removeAttribute('autoplay');
        el.pause();
      } else {
        el.setAttribute('autoplay', '');
        el.play?.().catch(() => {});
      }
    }
  });
}

function initToggle(video, toggle) {
  const sync = () => {
    toggle.classList.toggle('is-paused', video.paused);
    toggle.setAttribute('aria-label', video.paused ? 'Play video' : 'Pause video');
  };

  toggle.addEventListener('click', () => {
    if (video.paused) video.play().catch(() => {});
    else video.pause();
  });
  video.addEventListener('play', sync);
  video.addEventListener('pause', sync);
  sync();
}

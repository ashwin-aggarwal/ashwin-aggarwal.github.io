// Project media (components/ProjectRow.astro). Each video sits under its
// generated cover
// and plays only while the media is hovered, or after the play toggle is
// pressed (touch/keyboard). The cover fades out while it plays. A video
// marked data-autoplay (videoAutoplay in frontmatter) plays from load
// instead, unless the viewer prefers reduced motion.
export function initCoverVideos() {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  document.querySelectorAll('[data-cover-video]').forEach((video) => {
    const well = video.closest('[data-cover-well]');
    const media = video.closest('.project-row__media');
    const toggle = media?.querySelector('[data-media-toggle]');
    // pinned: keep playing off-hover (autoplay, or started from the toggle)
    let pinned = video.hasAttribute('data-autoplay') && !reduced;
    if (pinned) video.play().catch(() => {});

    const sync = () => {
      well.classList.toggle('is-playing', !video.paused);
      toggle?.classList.toggle('is-paused', video.paused);
      toggle?.setAttribute('aria-label', video.paused ? 'Play video' : 'Pause video');
    };

    media.addEventListener('mouseenter', () => video.play().catch(() => {}));
    media.addEventListener('mouseleave', () => {
      if (!pinned) video.pause();
    });
    toggle?.addEventListener('click', () => {
      if (video.paused) {
        pinned = true;
        video.play().catch(() => {});
      } else {
        pinned = false;
        video.pause();
      }
    });
    video.addEventListener('play', sync);
    video.addEventListener('pause', sync);
    sync();
  });
}

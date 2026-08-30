// Hover/focus tilt for a spine, driven by GSAP rather than a CSS transition
// so it can be paused mid-tween and won't fight the open timeline's own
// GSAP-owned transform on the same element's ancestor stack.
import { gsap } from 'gsap';

export function attachHover(spineEl) {
  const tl = gsap.timeline({ paused: true, defaults: { duration: 0.22, ease: 'power2.out' } });
  tl.to(spineEl, {
    rotate: -3,
    y: -6,
    filter: 'drop-shadow(0 10px 16px rgba(232, 176, 106, 0.5))',
    force3D: true,
  });

  const play = () => tl.play();
  const revert = () => tl.reverse();

  spineEl.addEventListener('pointerenter', play);
  spineEl.addEventListener('pointerleave', revert);
  spineEl.addEventListener('focus', play);
  spineEl.addEventListener('blur', revert);

  return {
    tl,
    destroy() {
      spineEl.removeEventListener('pointerenter', play);
      spineEl.removeEventListener('pointerleave', revert);
      spineEl.removeEventListener('focus', play);
      spineEl.removeEventListener('blur', revert);
      tl.kill();
    },
  };
}

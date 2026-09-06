// Interaction 3 of 4: the one load reveal, on the intro section only.
// Progressive enhancement — the section is fully visible without JS/GSAP;
// this only animates it in when both are available and motion is fine.
import { gsap } from 'gsap';

export function initIntroReveal(el) {
  if (!el) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  gsap.set(el, { opacity: 0, y: 14 });
  gsap.to(el, { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out', delay: 0.05 });
}

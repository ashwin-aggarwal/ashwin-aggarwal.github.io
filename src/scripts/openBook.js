// STUB for Step 2 review only — replaced in Step 3 with the real GSAP FLIP
// open timeline. Exists now purely so shelf.js's click handler has
// something to call and Step 2 can be demoed end-to-end.
export function open(book, spineEl, hoverHandle) {
  hoverHandle?.tl.pause(0);
  console.log(`[stub] would open "${book.title}" from`, spineEl);
}

export function close() {
  console.log('[stub] would close');
}

export function initStage() {
  // no-op until Step 3
}

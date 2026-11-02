// Blog accordion (/blog/). Each post card is a heading-wrapped <button>
// (aria-expanded + aria-controls) over a panel holding the full post.
//
// Progressive enhancement: the server renders every panel open. A one-line
// inline script on the page adds `has-js` to <html> before the cards paint,
// which lets CSS collapse closed cards without a flash; this module then
// wires the toggles. With no JS, every post is simply readable in full.
//
// Deep links: /blog/#<slug> (or #<heading-id> inside a post) opens the
// containing post and scrolls to the target. Opening a post also puts its
// #slug in the address bar so the URL can be copied and shared as-is.
const reduceMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function setOpen(card, open) {
  card.classList.toggle('is-open', open);
  card.querySelector('[data-post-toggle]').setAttribute('aria-expanded', String(open));
}

function openFromHash(behavior) {
  const id = decodeURIComponent(location.hash.slice(1));
  if (!id) return;
  const target = document.getElementById(id);
  const card = target?.closest('[data-post-card]');
  if (!card) return;
  setOpen(card, true);
  target.scrollIntoView({ behavior, block: 'start' });
}

export function initBlog() {
  const cards = document.querySelectorAll('[data-post-card]');
  if (!cards.length) return;

  for (const card of cards) {
    setOpen(card, false);
    card.querySelector('[data-post-toggle]').addEventListener('click', () => {
      const open = !card.classList.contains('is-open');
      setOpen(card, open);
      if (open) {
        history.replaceState(null, '', `#${card.id}`);
      } else if (location.hash === `#${card.id}`) {
        history.replaceState(null, '', location.pathname + location.search);
      }
    });
  }

  openFromHash('instant');
  window.addEventListener('hashchange', () => openFromHash(reduceMotion() ? 'instant' : 'smooth'));
}

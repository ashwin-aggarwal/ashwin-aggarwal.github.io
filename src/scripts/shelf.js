// Renders spines from state.js into the shelf row and wires hover/click.
// Subscribed to state so "Add book" (Step 6) can insert a spine without a
// rebuild — already-rendered ids are tracked so re-renders only append what's
// new, which also lets newly-added spines get an entry animation later
// without replaying it on the initial seeded books.
import { getBooks, subscribe } from './state.js';
import { attachHover } from './spineHover.js';
import { open } from './openBook.js';

const rendered = new Map();

export function initShelf(rowEl) {
  const bookendEl = rowEl.querySelector('.bookend');
  renderNew(rowEl, bookendEl, getBooks(), false);
  subscribe((books) => renderNew(rowEl, bookendEl, books, true));
}

function renderNew(rowEl, bookendEl, books, animateIn) {
  for (const book of books) {
    if (rendered.has(book.id)) continue;
    const el = createSpineEl(book);
    rowEl.insertBefore(el, bookendEl);
    rendered.set(book.id, el);
    if (animateIn) animateSpineIn(el);
  }
}

function createSpineEl(book) {
  const el = document.createElement('button');
  el.type = 'button';
  el.className = 'spine';
  el.dataset.bookId = book.id;
  el.style.setProperty('--spine-w', `${book.thickness}px`);
  el.style.setProperty('--spine-h', `${book.height * 100}%`);
  el.style.setProperty('--spine-color', book.spineColor);
  if (book.coverImage) {
    el.style.setProperty('--spine-image', `url("${book.coverImage}")`);
  }
  el.setAttribute('aria-label', `Open ${book.title} by ${book.author}`);
  el.innerHTML = `
    <span class="spine__label">
      <span class="spine__title">${escapeHtml(book.title)}</span>
      <span class="spine__author">${escapeHtml(book.author)}</span>
    </span>
  `;

  const hoverHandle = attachHover(el);
  el.addEventListener('click', () => open(book, el, hoverHandle));

  return el;
}

function animateSpineIn(el) {
  el.classList.add('spine--entering');
  requestAnimationFrame(() => {
    el.classList.remove('spine--entering');
  });
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

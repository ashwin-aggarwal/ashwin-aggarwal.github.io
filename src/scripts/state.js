// Framework-free store for the books array. shelf.js subscribes so it can
// render newly-added spines without a rebuild.
import { books as seedBooks } from '../data/books.js';

let books = [...seedBooks];
const listeners = new Set();

export function getBooks() {
  return books;
}

export function addBook(book) {
  books = [...books, book];
  listeners.forEach((fn) => fn(books));
}

export function subscribe(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

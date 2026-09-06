import { initShelf } from './shelf.js';
import { initStage } from './openBook.js';

const stageEl = document.getElementById('stage');
if (stageEl) initStage(stageEl);

const rowEl = document.getElementById('shelf-row');
if (rowEl) initShelf(rowEl);

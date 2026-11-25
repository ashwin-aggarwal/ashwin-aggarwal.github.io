// RewardLens post figures (components/rewardlens/figures.mjs). The boards
// arrive drawn at their final state, so the page is complete without this
// file. It adds:
//   · Play + a "Move" slider that replay the boards in a figure in step,
//   · the training-step slider that swaps in each checkpoint's episode and
//     its behavior rates.
// Motion only ever starts from a press of Play, runs through once and
// stops; it pauses in a hidden tab. Under prefers-reduced-motion the Play
// button is hidden (CSS) and never animates; the slider still steps by hand.
const MS_PER_MOVE = 70;
const CELL = 10;
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');

const pair = (s) => s.split(',').map(Number);
const same = (a, b) => a[0] === b[0] && a[1] === b[1];
const center = (v) => v * CELL + CELL / 2;
const pct = (v) => `${Math.round(v * 100)}%`;
const kSteps = (step) => (step === 0 ? '0' : `${step / 1000}k`);

class Board {
  constructor(el) {
    this.trail = el.querySelector('[data-rl-trail]');
    this.agent = el.querySelector('[data-rl-agent]');
    this.stat = el.querySelector('[data-rl-stat]');
    this.goal = pair(el.dataset.goal);
    this.tile = pair(el.dataset.tile);
    this.setPath(el.dataset.path.split(' ').map(pair));
  }

  setPath(path) {
    this.path = path;
    // entries[i] = times the agent has stepped onto the tile by move i
    this.entries = [0];
    for (let i = 1; i < path.length; i++) {
      const entered = same(path[i], this.tile) && !same(path[i - 1], this.tile);
      this.entries.push(this.entries[i - 1] + (entered ? 1 : 0));
    }
  }

  get moves() {
    return this.path.length - 1;
  }

  // Same wording as outcomeText() in figures.mjs.
  outcome() {
    const entries = this.entries[this.moves];
    if (same(this.path[this.moves], this.goal)) return `Reaches the goal in ${this.moves} moves`;
    if (entries >= 5) return `Steps onto the tile ${entries} times, never finishes`;
    let lastMove = this.moves;
    while (lastMove > 0 && same(this.path[lastMove], this.path[lastMove - 1])) lastMove--;
    if (this.moves - lastMove >= 20) return `Stops moving after ${lastMove} moves, never finishes`;
    return `Wanders for ${this.moves} moves, never finishes`;
  }

  show(move) {
    const i = Math.min(move, this.moves);
    this.trail.setAttribute('points', this.path.slice(0, i + 1).map(([x, y]) => `${center(x)},${center(y)}`).join(' '));
    this.agent.setAttribute('cx', center(this.path[i][0]));
    this.agent.setAttribute('cy', center(this.path[i][1]));
    this.stat.textContent = i === this.moves ? this.outcome() : `Move ${i}, on the tile ${this.entries[i]} times so far`;
  }
}

class Group {
  constructor(el) {
    this.boards = [...el.querySelectorAll('[data-rl-replay]')].map((b) => new Board(b));
    this.controls = el.querySelector('[data-rl-controls]');
    this.play = el.querySelector('[data-rl-play]');
    this.scrub = el.querySelector('[data-rl-scrub]');
    this.readout = el.querySelector('[data-rl-move]');
    this.frame = 0;

    this.play.addEventListener('click', () => (this.frame ? this.stop() : this.start()));
    this.scrub.addEventListener('input', () => {
      this.stop();
      this.show(Number(this.scrub.value));
    });
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) this.stop();
    });
    this.controls.hidden = false;
    this.reset();
  }

  // Back to the finished drawing (also after the boards' paths change).
  reset() {
    this.stop();
    this.max = Math.max(...this.boards.map((b) => b.moves));
    this.scrub.max = this.max;
    this.show(this.max);
  }

  show(move) {
    this.move = move;
    this.boards.forEach((b) => b.show(move));
    this.scrub.value = move;
    this.scrub.setAttribute('aria-valuetext', `move ${move} of ${this.max}`);
    this.readout.textContent = `move ${move} of ${this.max}`;
    this.play.textContent = this.frame ? 'Pause' : move === this.max ? 'Play' : 'Resume';
  }

  start() {
    if (reduced.matches) return;
    const from = this.move >= this.max ? 0 : this.move;
    const t0 = performance.now() - from * MS_PER_MOVE;
    const tick = (now) => {
      const move = Math.min(this.max, Math.floor((now - t0) / MS_PER_MOVE));
      if (move >= this.max) {
        this.frame = 0;
        this.show(this.max);
        return;
      }
      this.frame = requestAnimationFrame(tick);
      if (move !== this.move) this.show(move);
    };
    this.frame = requestAnimationFrame(tick);
    this.show(from);
  }

  stop() {
    if (!this.frame) return;
    cancelAnimationFrame(this.frame);
    this.frame = 0;
    this.show(this.move);
  }
}

function initTimeline(el, group) {
  const data = JSON.parse(el.querySelector('[data-rl-data]').textContent);
  const slider = el.querySelector('[data-rl-step]');
  const now = el.querySelector('[data-rl-now]');
  const playhead = el.querySelector('[data-rl-playhead]');
  const last = data.steps.length - 1;
  const total = kSteps(data.steps[last]);

  const update = () => {
    const i = Number(slider.value);
    const label = `${kSteps(data.steps[i])} of ${total}`;
    now.textContent = label;
    slider.setAttribute('aria-valuetext', `${label} steps`);
    playhead.style.setProperty('--x', `${(i / last) * 100}%`);
    for (const key of ['direct', 'other', 'farming']) {
      el.querySelector(`[data-rl-fill="${key}"]`).style.setProperty('--v', `${data[key][i] * 100}%`);
      el.querySelector(`[data-rl-value="${key}"]`).textContent = pct(data[key][i]);
    }
    group.boards[0].setPath(data.paths[i]);
    group.reset();
  };

  slider.addEventListener('input', update);
  slider.disabled = false;
  update();
}

document.querySelectorAll('[data-rl-group]').forEach((el) => {
  const group = new Group(el);
  if (el.matches('[data-rl-timeline]')) initTimeline(el, group);
});

// Build-time figures for the RewardLens post (content/blog/rewardlens-…md).
// Each export returns an HTML string; lib/remarkPostFigures.mjs drops it in
// where the post says <post-figure name="…">caption</post-figure>.
//
// Every number and path comes from src/data/rewardlens.json, a read-only
// export of the RewardLens result files and checkpoints. Nothing here is
// illustrative data. Styles: rewardlens.css. Behavior: scripts/rewardlens.js
// (the figures are complete, static drawings without it).
import { readFileSync } from 'node:fs';

const data = JSON.parse(readFileSync(new URL('../../data/rewardlens.json', import.meta.url), 'utf8'));

const pct = (v, digits = 0) => `${(v * 100).toFixed(digits)}%`;
const k = (step) => (step === 0 ? '0' : `${step / 1000}k`);
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
const SEEDS = ['42', '123', '456'];

// ── Gridworld replay ────────────────────────────────────────────────────
// 8×8 board, 10 units per cell. Drawn at its final state (whole path,
// agent where the episode ended); the script can replay it move by move.
const C = 10;
const mid = ([x, y]) => `${x * C + C / 2},${y * C + C / 2}`;

function episodeStats(path, layout) {
  const same = (a, b) => a[0] === b[0] && a[1] === b[1];
  let entries = 0;
  for (let i = 1; i < path.length; i++) if (same(path[i], layout.tile) && !same(path[i - 1], layout.tile)) entries++;
  // lastMove = the last move on which the agent actually changed square
  let lastMove = path.length - 1;
  while (lastMove > 0 && same(path[lastMove], path[lastMove - 1])) lastMove--;
  return { moves: path.length - 1, entries, lastMove, reached: same(path[path.length - 1], layout.goal) };
}

function outcomeText(s) {
  if (s.reached) return `Reaches the goal in ${s.moves} moves`;
  if (s.entries >= 5) return `Steps onto the tile ${s.entries} times, never finishes`;
  if (s.moves - s.lastMove >= 20) return `Stops moving after ${s.lastMove} moves, never finishes`;
  return `Wanders for ${s.moves} moves, never finishes`;
}

function board(layout, path) {
  const [w, h] = data.grid;
  let lines = '';
  for (let i = 1; i < w; i++) lines += `M${i * C} 0V${h * C}`;
  for (let i = 1; i < h; i++) lines += `M0 ${i * C}H${w * C}`;
  const [gx, gy] = layout.goal;
  const [tx, ty] = layout.tile;
  const end = path[path.length - 1];
  return `<svg class="rl-board" viewBox="-1 -1 ${w * C + 2} ${h * C + 2}" aria-hidden="true">
<rect class="rl-board__frame" x="0" y="0" width="${w * C}" height="${h * C}"/>
<path class="rl-board__lines" d="${lines}"/>
<rect class="rl-board__tile" x="${tx * C + 1}" y="${ty * C + 1}" width="${C - 2}" height="${C - 2}"/>
<text class="rl-board__tile-label" x="${tx * C + C / 2}" y="${ty * C + C / 2}">+2</text>
<rect class="rl-board__goal" x="${gx * C + 1}" y="${gy * C + 1}" width="${C - 2}" height="${C - 2}"/>
<path class="rl-board__flag" d="M${gx * C + 3.6} ${gy * C + 7.6}V${gy * C + 2.4}l3.4 1.4-3.4 1.4"/>
<circle class="rl-board__start" cx="${layout.start[0] * C + C / 2}" cy="${layout.start[1] * C + C / 2}" r="2.6"/>
<polyline class="rl-board__trail" data-rl-trail points="${path.map(mid).join(' ')}"/>
<circle class="rl-board__agent" data-rl-agent cx="${end[0] * C + C / 2}" cy="${end[1] * C + C / 2}" r="2.6"/>
</svg>`;
}

function replay(label, layout, path) {
  const s = episodeStats(path, layout);
  return `<div class="rl-replay" data-rl-replay data-path="${path.map((p) => p.join(',')).join(' ')}" data-goal="${layout.goal.join(',')}" data-tile="${layout.tile.join(',')}">
<p class="rl-replay__label">${label}</p>
${board(layout, path)}
<p class="rl-replay__stat" data-rl-stat>${outcomeText(s)}</p>
</div>`;
}

const legend = `<ul class="rl-legend" role="list">
<li><span class="rl-key rl-key--agent"></span>agent</li>
<li><span class="rl-key rl-key--start"></span>start</li>
<li><span class="rl-key rl-key--goal"></span>goal</li>
<li><span class="rl-key rl-key--tile"></span>reward tile</li>
</ul>`;

// Play / scrub controls shared by the boards in one figure. Hidden until
// the script wires them up; the Play button stays hidden under reduced
// motion (the slider still steps through the moves by hand).
const controls = (label = 'Move') => `<div class="rl-controls" data-rl-controls hidden>
<button class="rl-button" type="button" data-rl-play>Play</button>
<label class="rl-scrub"><span class="rl-scrub__label">${label}</span>
<input type="range" min="0" max="100" step="1" value="100" data-rl-scrub></label>
<output class="rl-controls__readout" data-rl-move></output>
</div>`;

function replayFigure(boards, caption, extraClass = '') {
  return `<figure class="rl-fig rl-fig--wide ${extraClass}" data-rl-group>
<div class="rl-replays rl-replays--${boards.length}">${boards.join('')}</div>
${controls()}
${legend}
<figcaption>${caption}</figcaption>
</figure>`;
}

// ── Line charts ─────────────────────────────────────────────────────────
// The SVG holds only the plot (stretched to the box, strokes unscaled);
// ticks and labels are HTML so they stay readable at phone width.
const X = (i, n) => (i / (n - 1)) * 100;
const Y = (v) => (1 - v) * 100;
const line = (values, cls) =>
  `<polyline class="rl-line ${cls}" points="${values.map((v, i) => `${X(i, values.length).toFixed(2)},${Y(v).toFixed(2)}`).join(' ')}"/>`;
const at = (x, y) => `style="--x:${x.toFixed(2)}%;--y:${y.toFixed(2)}%"`;

function chart({ label, lines, tags = [], band, yTicks = [0, 0.5, 1], yFormat = pct, playhead = false, title }) {
  const steps = data.timeline.steps;
  const n = steps.length;
  const xi = (step) => X(steps.indexOf(step), n);
  const xTicks = [0, 100000, 200000, 300000, 400000];
  return `<div class="rl-chart">
<p class="rl-chart__title">${title}</p>
<div class="rl-chart__plot" role="img" aria-label="${esc(label)}">
<svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
${band ? `<rect class="rl-chart__band" x="${xi(band[0])}" y="0" width="${xi(band[1]) - xi(band[0])}" height="100"/>` : ''}
${yTicks.map((t) => `<path class="rl-chart__grid" d="M0 ${Y(t)}H100"/>`).join('')}
${lines.join('')}
</svg>
${yTicks.map((t) => `<span class="rl-chart__ytick" ${at(0, Y(t))}>${yFormat(t)}</span>`).join('')}
${xTicks.map((t) => `<span class="rl-chart__xtick" ${at(xi(t), 100)}>${k(t)}</span>`).join('')}
${tags.map((t) => `<span class="rl-chart__tag ${t.cls ?? ''}" ${at(t.x, t.y)}>${t.text}</span>`).join('')}
${playhead ? `<span class="rl-chart__playhead" data-rl-playhead ${at(0, 0)}></span>` : ''}
</div>
<p class="rl-chart__xlabel">training steps after the reward was changed</p>
</div>`;
}

// ── Dot strips ──────────────────────────────────────────────────────────
// One row per condition, one dot per trained network, on a 0–100% axis.
function strip(rows, { threshold, axisLabel }) {
  const body = rows
    .map(
      (r) => `<div class="rl-strip__row${r.lit ? ' is-lit' : ''}">
<div class="rl-strip__name">${r.icon ?? ''}<span>${r.name}${r.sub ? `<small>${r.sub}</small>` : ''}</span></div>
<div class="rl-strip__track" role="img" aria-label="${esc(r.aria)}">
${threshold != null ? `<span class="rl-strip__bar" ${at(threshold * 100, 0)}></span>` : ''}
${r.dots.map((d) => `<span class="rl-dot ${d.cls ?? ''}" ${at(d.v * 100, 0)}></span>`).join('')}
</div>
<div class="rl-strip__note">${r.note ?? ''}</div>
</div>`,
    )
    .join('');
  return `<div class="rl-strip">
${body}
<div class="rl-strip__row rl-strip__row--axis" aria-hidden="true">
<div class="rl-strip__name"></div>
<div class="rl-strip__track rl-strip__track--axis">
${[0, 0.25, 0.5, 0.75, 1].map((t) => `<span class="rl-strip__tick" ${at(t * 100, 0)}>${pct(t)}</span>`).join('')}
</div>
<div class="rl-strip__note"></div>
</div>
<p class="rl-strip__axis-label">${axisLabel}</p>
</div>`;
}

const range = (vals, f = (v) => v.toFixed(2)) => {
  const lo = Math.min(...vals);
  const hi = Math.max(...vals);
  return f(lo) === f(hi) ? f(lo) : `${f(lo)} to ${f(hi)}`;
};

// Three bars = the network's three weight layers; lit ones may change.
function layerIcon(lit) {
  const xs = [1, 13, 25];
  return `<svg class="rl-layers" viewBox="0 0 34 20" aria-hidden="true">
<path class="rl-layers__wire" d="M9 10h4M21 10h4"/>
${xs.map((x, i) => `<rect class="rl-layers__bar${lit[i] ? ' is-lit' : ''}" x="${x}" y="${i === 2 ? 5 : 1}" width="8" height="${i === 2 ? 10 : 18}"/>`).join('')}
</svg>`;
}

// ── Figures ─────────────────────────────────────────────────────────────
export const figures = {
  // §1 Two copies of one network on the same board.
  hook(caption) {
    const { layout, paths } = data.hook;
    return replayFigure(
      [replay('Trained on the intended reward', layout, paths.good), replay('Trained on the flawed reward', layout, paths.hacking)],
      caption,
    );
  },

  // §2 Training-progress slider: one board, 41 checkpoints.
  timeline(caption) {
    const t = data.timeline;
    const s = t.series[String(t.seed)];
    const layout = data.dev0.layout;
    const n = t.steps.length;
    const peak = s.other.indexOf(Math.max(...s.other));
    const payload = { steps: t.steps, paths: t.paths, direct: s.direct, other: s.other, farming: s.farming };
    const meter = (key, name, v) =>
      `<div class="rl-meter"><dt>${name}</dt><dd><span class="rl-meter__bar"><span class="rl-meter__fill rl-meter__fill--${key}" data-rl-fill="${key}" style="--v:${v * 100}%"></span></span><span class="rl-meter__value" data-rl-value="${key}">${pct(v)}</span></dd></div>`;
    return `<figure class="rl-fig rl-fig--wide rl-timeline" data-rl-timeline data-rl-group>
<div class="rl-timeline__step">
<label class="rl-scrub rl-scrub--step"><span class="rl-scrub__label">Training step</span>
<input type="range" min="0" max="${n - 1}" step="1" value="0" data-rl-step aria-valuetext="0 of 400k steps" disabled></label>
<output class="rl-timeline__now" data-rl-now>0 of 400k</output>
</div>
<div class="rl-timeline__body">
<div class="rl-timeline__board">
${replay('One game at this point in training', layout, t.paths[0])}
${controls('Replay this game')}
</div>
<div class="rl-timeline__side">
<dl class="rl-meters" aria-live="polite">
<p class="rl-meters__title">Across ${t.n_dev_layouts.toLocaleString('en-US')} boards it never trained on</p>
${meter('direct', 'goes straight to the goal', s.direct[0])}
${meter('other', 'does neither (wanders or stalls)', s.other[0])}
${meter('farming', 'farms the tile', s.farming[0])}
</dl>
${chart({
  title: 'Share of boards, by behavior',
  label: `Line chart over 400,000 training steps. Going straight to the goal falls from 100% to ${pct(s.direct[n - 1])}. Farming rises from 0% to ${pct(s.farming[n - 1])}. Doing neither peaks at ${pct(s.other[peak])} around step ${k(t.steps[peak])}.`,
  lines: [line(s.direct, 'rl-line--thin'), line(s.other, 'rl-line--dash'), line(s.farming, 'rl-line--bold')],
  tags: [
    { text: 'straight to goal', x: 98, y: Y(s.direct[n - 1]) - 4, cls: 'rl-chart__tag--end' },
    { text: 'farms', x: 98, y: Y(s.farming[n - 1]) + 5, cls: 'rl-chart__tag--below rl-chart__tag--end' },
    { text: 'neither', x: X(peak, n) + 5, y: Y(s.other[peak]) - 3 },
  ],
  playhead: true,
})}
</div>
</div>
${legend}
<script type="application/json" data-rl-data>${JSON.stringify(payload)}</script>
<figcaption>${caption}</figcaption>
</figure>`;
  },

  // §3 The network, with layer 2 lit.
  network(caption) {
    const cols = [
      { x: 45, n: 7 },
      { x: 135, n: 8 },
      { x: 225, n: 8, lit: true },
      { x: 315, n: 4 },
    ];
    const ys = (n) => Array.from({ length: n }, (_, i) => 80 + (i - (n - 1) / 2) * 19);
    let wires = '';
    for (let c = 0; c < cols.length - 1; c++)
      for (const a of ys(cols[c].n)) for (const b of ys(cols[c + 1].n)) wires += `M${cols[c].x} ${a}L${cols[c + 1].x} ${b}`;
    const nodes = cols
      .map((c) => ys(c.n).map((y) => `<circle class="rl-net__node${c.lit ? ' is-lit' : ''}" cx="${c.x}" cy="${y}" r="5"/>`).join(''))
      .join('');
    return `<figure class="rl-fig rl-net">
<svg viewBox="0 0 360 160" role="img" aria-label="Diagram of the network: 7 inputs, a first hidden layer of 128 units, a second hidden layer of 128 units (highlighted), and 4 outputs.">
<path class="rl-net__wires" d="${wires}"/>
${nodes}
</svg>
<ol class="rl-net__labels" role="list">
<li><strong>7 inputs</strong>where the agent, goal and tile are, and how much time is left</li>
<li><strong>Layer 1</strong>128 numbers of scratch work</li>
<li class="is-lit"><strong>Layer 2</strong>128 more, and where most of the change happened</li>
<li><strong>4 outputs</strong>a score for each move: up, right, down, left</li>
</ol>
<figcaption>${caption}</figcaption>
</figure>`;
  },

  // §3 Layer-2 similarity to the starting network, against behavior.
  similarity(caption) {
    const s = data.timeline.series[String(data.timeline.seed)];
    const { onset, completion } = s.transition;
    const steps = data.timeline.steps;
    const n = steps.length;
    const xi = (step) => X(steps.indexOf(step), n);
    const bandTag = { text: 'behavior switches', x: (xi(onset) + xi(completion)) / 2, y: 96, cls: 'rl-chart__tag--mid' };
    return `<figure class="rl-fig rl-fig--wide">
<div class="rl-pair">
${chart({
  title: 'Behavior: share of boards where it farms',
  label: `Farming rate over training. It stays under 10% until step ${k(onset)}, passes 80% at step ${k(completion)}, and ends at ${pct(s.farming[n - 1])}.`,
  lines: [line(s.farming, 'rl-line--bold')],
  band: [onset, completion],
  tags: [bandTag],
})}
${chart({
  title: 'Inside: how similar layer 2 still is to where it started',
  label: `Layer 2 similarity to the starting network. The copy trained on the flawed reward falls from 1.00 to ${s.sim_before_onset.toFixed(2)} before farming begins and ends at ${s.sim[n - 1].toFixed(2)}. The copy trained on the intended reward stays at ${s.sim_good[n - 1].toFixed(2)} or above.`,
  lines: [line(s.sim_good, 'rl-line--muted'), line(s.sim, 'rl-line--bold')],
  band: [onset, completion],
  yFormat: (v) => v.toFixed(1),
  tags: [
    { text: 'intended reward', x: 98, y: Y(s.sim_good[n - 1]) + 4, cls: 'rl-chart__tag--below rl-chart__tag--end' },
    { text: 'flawed reward', x: 98, y: Y(s.sim[n - 1]) - 4, cls: 'rl-chart__tag--end' },
  ],
})}
</div>
<figcaption>${caption}</figcaption>
</figure>`;
  },

  // §4 Three networks, one board.
  transplant(caption) {
    const { layout, paths } = data.dev0;
    return replayFigure(
      [
        replay('Goal-following network', layout, paths.good),
        replay('Reward-farming network', layout, paths.hacking),
        replay('Farming network with patched layer 2', layout, paths.patched),
      ],
      caption,
    );
  },

  // §4 What the transplant does across all development boards.
  transplantRates(caption) {
    const row = (name, c, sub = '') => {
      const seg = (key, v) => (v > 0 ? `<span class="rl-bar__seg rl-bar__seg--${key}" style="--v:${v * 100}%"></span>` : '');
      return `<div class="rl-bars__row"><div class="rl-bars__name">${name}${sub ? `<small>${sub}</small>` : ''}</div>
<div class="rl-bar" role="img" aria-label="${esc(`${name} ${sub}: straight to goal ${pct(c.direct_goal)}, neither ${pct(c.other)}, farms ${pct(c.farming)}`)}">${seg('direct', c.direct_goal)}${seg('other', c.other)}${seg('farming', c.farming)}</div>
<div class="rl-bars__value">${pct(c.direct_goal)}</div></div>`;
    };
    const t = data.transplant;
    return `<figure class="rl-fig">
<div class="rl-bars">
<div class="rl-bars__row rl-bars__row--head" aria-hidden="true"><div></div><div></div><div class="rl-bars__value">straight to goal</div></div>
${row('Goal-following', t['42'].good, 'agent 1')}
${row('Reward-farming', t['42'].hacking, 'agent 1')}
${SEEDS.map((sd, i) => row('With patch', t[sd].patched, `agent ${i + 1}`)).join('')}
${row('Random moves', data.random_policy, 'no network at all')}
</div>
<ul class="rl-legend" role="list">
<li><span class="rl-key rl-key--direct"></span>straight to the goal</li>
<li><span class="rl-key rl-key--other"></span>does neither (wanders or stalls)</li>
<li><span class="rl-key rl-key--farming"></span>farms the tile</li>
</ul>
<figcaption>${caption}</figcaption>
</figure>`;
  },

  // §5 Retraining one layer versus all three (Phase 5 distillation).
  layers(caption) {
    const d = data.distill;
    const rows = [
      ['head_only', 'Output layer only', [0, 0, 1]],
      ['layer1_only', 'Layer 1 only', [1, 0, 0]],
      ['layer2_only', 'Layer 2 only', [0, 1, 0]],
      ['full_network', 'All three together', [1, 1, 1]],
    ].map(([key, name, lit]) => {
      const c = d[key];
      const ok = c.repaired.every(Boolean);
      return {
        name,
        sub: `${c.params.toLocaleString('en-US')} adjustable numbers`,
        icon: layerIcon(lit),
        lit: ok,
        dots: c.direct.map((v) => ({ v, cls: ok ? 'rl-dot--pass' : '' })),
        note: ok ? 'repaired, 3 of 3' : 'not repaired',
        aria: `${name}: straight to goal on ${c.direct.map((v) => pct(v)).join(', ')} of boards in the three runs; ${ok ? 'repaired' : 'not repaired'}.`,
      };
    });
    return `<figure class="rl-fig rl-fig--wide">
${strip(rows, { threshold: data.criterion.min_direct_goal, axisLabel: 'share of boards where the retrained network goes straight to the goal (one dot per training run)' })}
<figcaption>${caption}</figcaption>
</figure>`;
  },

  // §5 Repair against rank (Phase 6), both learning rates.
  rank(caption) {
    const coordinated = (rank, lr) => data.rank.find((r) => r.method === (rank === 'full' ? 'full_network' : 'coordinated') && (rank === 'full' || r.rank === rank) && r.lr === lr);
    const names = { 0: 'Offsets only', 1: 'Rank 1', 2: 'Rank 2', 4: 'Rank 4', 8: 'Rank 8', full: 'Every number free' };
    const rows = [0, 1, 2, 4, 8, 'full'].map((rank) => {
      const hi = coordinated(rank, 0.001);
      const lo = coordinated(rank, 0.00025);
      const ok = hi.passed === 9;
      return {
        name: names[rank],
        sub: `${hi.params.toLocaleString('en-US')} adjustable numbers`,
        lit: ok,
        dots: [...lo.direct.map((v) => ({ v, cls: 'rl-dot--hollow' })), ...hi.direct.map((v) => ({ v, cls: ok ? 'rl-dot--pass' : '' }))],
        note: `${hi.passed} of 9 pass<small>${lo.passed} of 9 at the slower setting</small>`,
        aria: `${names[rank]}: at the faster training setting, straight to goal on ${range(hi.direct, (v) => pct(v))} of boards, ${hi.passed} of 9 runs pass. At the slower setting, ${range(lo.direct, (v) => pct(v))}, ${lo.passed} of 9 pass.`,
      };
    });
    return `<figure class="rl-fig rl-fig--wide">
${strip(rows, { threshold: data.criterion.min_direct_goal, axisLabel: 'share of boards where the edited network goes straight to the goal (one dot per run)' })}
<ul class="rl-legend" role="list">
<li><span class="rl-dot rl-dot--static"></span>faster training setting</li>
<li><span class="rl-dot rl-dot--static rl-dot--hollow"></span>slower training setting</li>
<li><span class="rl-key rl-key--bar"></span>the bar: 90%</li>
</ul>
<figcaption>${caption}</figcaption>
</figure>`;
  },

  // §5 Before and after the rank-8 edit, same board as §4.
  repaired(caption) {
    const { layout, paths } = data.dev0;
    return replayFigure(
      [replay('Reward-farming network', layout, paths.hacking), replay('Same network after the rank-8 edit', layout, paths.rank8)],
      caption,
    );
  },

  // §5 The confirmatory evaluation on reserved boards.
  final(caption) {
    const f = data.final;
    const a = f.aggregate;
    const tile = (value, name) => `<div class="rl-stat"><dt>${name}</dt><dd>${value}</dd></div>`;
    const base = SEEDS.map((sd) => f.baselines[sd]);
    const rows = [
      {
        name: 'Before the edit',
        sub: '3 farming networks',
        dots: base.map((b) => ({ v: b.hacking.direct })),
        note: `${range(base.map((b) => b.hacking.direct), (v) => pct(v))}`,
        aria: `Farming networks before the edit: straight to goal on ${base.map((b) => pct(b.hacking.direct, 1)).join(', ')} of reserved boards.`,
      },
      {
        name: 'After the rank-8 edit',
        sub: '9 edited networks',
        lit: true,
        dots: f.models.map((m) => ({ v: m.reserved.direct, cls: 'rl-dot--pass' })),
        note: `${pct(a.direct_goal.min, 1)} to ${pct(a.direct_goal.max, 0)}`,
        aria: `Edited networks: straight to goal on ${pct(a.direct_goal.min, 1)} to ${pct(a.direct_goal.max, 0)} of reserved boards, mean ${pct(a.direct_goal.mean, 1)}.`,
      },
    ];
    return `<figure class="rl-fig rl-fig--wide">
<dl class="rl-stats">
${tile(`${f.n_passing} of ${f.n_models}`, 'edited networks passed')}
${tile(pct(a.direct_goal.mean, 1), 'went straight to the goal')}
${tile(pct(a.path_efficiency_direct.mean, 1), 'path efficiency')}
${tile(pct(a.farming.max, 0), 'reward farming')}
</dl>
${strip(rows, { threshold: data.criterion.min_direct_goal, axisLabel: `share of ${f.n_layouts.toLocaleString('en-US')} reserved boards where the network goes straight to the goal` })}
<figcaption>${caption}</figcaption>
</figure>`;
  },
};

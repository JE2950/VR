/* ════════════════════════════════════════════════════════════════
   THE MELTING STUDIO · shared non-verbal reasoning engine
   Used by nvr.html (question mode) and nvr3d.html (3D studio).
   Every figure is drawn here as SVG, and every question is built
   from a rule, then checked so that only one choice fits it.
   Same function names as vr.js, so the pages share their game code.
   ════════════════════════════════════════════════════════════════ */

/* ───────────── helpers ───────────── */
const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const pick = a => a[Math.floor(Math.random() * a.length)];
const rint = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const uniq = a => [...new Set(a)];
const LET = 'ABCDE';
const without = (a, v) => a.filter(x => x !== v);
const pickOther = (a, v) => pick(a.filter(x => x !== v));

/* ───────────── saved settings and scores ───────────── */
const STORE = 'nvr-studio-v1';
let SAVE = { stats: {}, name: '', age: 5, topics: null, best: {}, sound: true, run: null };
try { const s = JSON.parse(localStorage.getItem(STORE) || 'null'); if (s) SAVE = Object.assign(SAVE, s); } catch (e) {}
function persist() { try { localStorage.setItem(STORE, JSON.stringify(SAVE)); } catch (e) {} }
function stat(k) { return SAVE.stats[k] || (SAVE.stats[k] = { r: 0, w: 0 }); }

/* ───────────── age setting ─────────────
   Year 4: 4 choices, one thing changes at a time, simple folds and turns.
   Year 5: 5 choices, two things change, 3 × 3 grids, diagonal folds.
   Year 6+: 5 choices, three things change, rules that link two features, double folds. */
const AGES = [
  { id: 4, label: 'Year 4', note: '4 choices · one change at a time' },
  { id: 5, label: 'Year 5', note: '5 choices · two changes · 3 × 3 grids' },
  { id: 6, label: 'Year 6+', note: '5 choices · pre-test and 11+ level' },
];
const age = () => SAVE.age || 5;
const nOpts = () => age() === 4 ? 4 : 5;
let recentItems = [];

/* ════════════════════════════════════════════════════════════════
   FIGURES (tiles)
   A tile: { shape, fill, size 1-3, count 1-5, rot (degrees), mark ('none' or a shape), mpos 0-3 (corner), lines 0-4 }
   ════════════════════════════════════════════════════════════════ */
const SHAPES = ['circle', 'square', 'triangle', 'pentagon', 'hexagon', 'star', 'cross', 'diamond'];
const ROT_SHAPES = ['arrow', 'half', 'flag'];
const FILLS = ['white', 'black', 'grey', 'stripes', 'dots'];
const MARKS = ['circle', 'square', 'triangle'];
const SYM = { circle: 1, square: 90, diamond: 90, cross: 90, hexagon: 60, pentagon: 72, star: 72, triangle: 120, arrow: 360, half: 360, flag: 360 };
const NAME = { circle: 'circle', square: 'square', triangle: 'triangle', pentagon: 'pentagon', hexagon: 'hexagon', star: 'star', cross: 'cross', diamond: 'diamond', arrow: 'arrow', half: 'half circle', flag: 'flag' };
const FILLNAME = { white: 'white', black: 'black', grey: 'grey', stripes: 'striped', dots: 'spotted' };
const SIZENAME = ['', 'small', 'medium', 'large'];
const CORNER = ['top left', 'top right', 'bottom right', 'bottom left'];
const FEATS = ['shape', 'fill', 'size', 'count', 'rot', 'mark', 'mpos', 'lines'];

const rotKey = (shape, rot) => { const s = SYM[shape] || 360; return ((Math.round(rot) % s) + s) % s; };
function fval(t, f) {
  if (f === 'rot') return rotKey(t.shape, t.rot);
  if (f === 'mpos') return t.mark === 'none' ? -1 : t.mpos;
  return t[f];
}
const tkey = t => FEATS.map(f => fval(t, f)).join('|');
/* broader features a pupil could notice, beyond the eight drawn ones */
const SIDES = { circle: 0, half: 1, square: 4, diamond: 4, triangle: 3, pentagon: 5, hexagon: 6, star: 10, cross: 12, arrow: 7, flag: 5 };
const DERIVED = {
  curved: t => t.shape === 'circle' || t.shape === 'half',
  shaded: t => t.fill !== 'white',
  darkfill: t => t.fill === 'black',
  patterned: t => t.fill === 'stripes' || t.fill === 'dots',
  hasMark: t => t.mark !== 'none',
  hasLines: t => t.lines > 0,
  sides: t => SIDES[t.shape],
  oddCount: t => t.count % 2,
  diagLines: t => t.lines >= 3,
};
const DEP = { curved: ['shape'], shaded: ['fill'], darkfill: ['fill'], patterned: ['fill'], hasMark: ['mark'], hasLines: ['lines'], sides: ['shape'], oddCount: ['count'], diagLines: ['lines'] };
const dval = (t, f) => DERIVED[f] ? String(DERIVED[f](t)) : fval(t, f);
const ALLF = FEATS.concat(Object.keys(DERIVED));
const clone = t => Object.assign({}, t);
function baseTile(o) { return Object.assign({ shape: 'circle', fill: 'white', size: 3, count: 1, rot: 0, mark: 'none', mpos: 0, lines: 0 }, o || {}); }
const fillsFor = () => age() === 4 ? ['white', 'black', 'grey', 'stripes'] : FILLS;

/* polygon points for a shape of radius r centred on (cx, cy), turned rot degrees clockwise */
function shapePts(shape, cx, cy, r, rot) {
  let p = [];
  const ring = (n, rad, start) => { for (let i = 0; i < n; i++) { const a = (start + i * 360 / n) * Math.PI / 180; p.push([Math.cos(a) * rad, Math.sin(a) * rad]); } };
  if (shape === 'square') ring(4, r * 1.2, 45);
  else if (shape === 'diamond') ring(4, r * 1.2, -90);
  else if (shape === 'triangle') ring(3, r * 1.2, -90);
  else if (shape === 'pentagon') ring(5, r * 1.08, -90);
  else if (shape === 'hexagon') ring(6, r * 1.05, 0);
  else if (shape === 'star') { for (let i = 0; i < 10; i++) { const a = (-90 + i * 36) * Math.PI / 180, rad = i % 2 ? r * 0.5 : r * 1.18; p.push([Math.cos(a) * rad, Math.sin(a) * rad]); } }
  else if (shape === 'cross') { const w = 0.36, l = 1.05; p = [[-w, -l], [w, -l], [w, -w], [l, -w], [l, w], [w, w], [w, l], [-w, l], [-w, w], [-l, w], [-l, -w], [-w, -w]].map(([x, y]) => [x * r, y * r]); }
  else if (shape === 'arrow') p = [[0, -1.1], [0.8, -0.1], [0.32, -0.1], [0.32, 1], [-0.32, 1], [-0.32, -0.1], [-0.8, -0.1]].map(([x, y]) => [x * r, y * r]);
  else if (shape === 'half') { for (let i = 0; i <= 12; i++) { const a = Math.PI + i * Math.PI / 12; p.push([Math.cos(a) * r * 1.1, Math.sin(a) * r * 1.1 + r * 0.45]); } }
  else if (shape === 'flag') p = [[-0.55, -1], [0.75, -0.62], [-0.3, -0.22], [-0.3, 1], [-0.55, 1]].map(([x, y]) => [x * r, y * r]);
  const a = (rot || 0) * Math.PI / 180, c = Math.cos(a), s = Math.sin(a);
  return p.map(([x, y]) => [cx + x * c - y * s, cy + x * s + y * c]);
}
const LAYOUT = {
  1: [[50, 50]], 2: [[31, 50], [69, 50]], 3: [[50, 32], [31, 67], [69, 67]],
  4: [[35, 35], [65, 35], [35, 65], [65, 65]], 5: [[33, 33], [67, 33], [50, 50], [33, 67], [67, 67]],
};
// sized so that no shape touches its neighbour at any angle (checked for every shape at every 45° turn)
const BASE_R = { 1: 27, 2: 14, 3: 13, 4: 11, 5: 8.5 };
const MARKPOS = [[11, 11], [89, 11], [89, 89], [11, 89]];
const LINES = [[[2, 50], [98, 50]], [[50, 2], [50, 98]], [[4, 4], [96, 96]], [[96, 4], [4, 96]]];
let svgN = 0;
function defs(id) {
  return `<defs><pattern id="st${id}" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="6" height="6" fill="#fff"/><rect width="2.4" height="6" fill="#222"/></pattern>
    <pattern id="dt${id}" width="7" height="7" patternUnits="userSpaceOnUse"><rect width="7" height="7" fill="#fff"/><circle cx="3.5" cy="3.5" r="1.5" fill="#222"/></pattern></defs>`;
}
function fillOf(f, id) { return f === 'white' ? '#fff' : f === 'black' ? '#222' : f === 'grey' ? '#9aa3ad' : f === 'stripes' ? `url(#st${id})` : `url(#dt${id})`; }
function shapeSVG(shape, cx, cy, r, rot, fill) {
  if (shape === 'circle') return `<circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="${r.toFixed(1)}" fill="${fill}" stroke="#222" stroke-width="2"/>`;
  return `<polygon points="${shapePts(shape, cx, cy, r, rot).map(p => p.map(v => v.toFixed(1)).join(',')).join(' ')}" fill="${fill}" stroke="#222" stroke-width="2" stroke-linejoin="round"/>`;
}
function tileSVG(t, px) {
  const id = 'n' + (++svgN);
  let h = `<svg class="nvr-fig" viewBox="0 0 100 100" width="${px || 84}" height="${px || 84}" aria-hidden="true">${defs(id)}<rect x="1" y="1" width="98" height="98" rx="4" fill="#fffdf6" stroke="#6b5a48" stroke-width="2"/>`;
  for (let i = 0; i < t.lines; i++) { const [[a, b], [c, d]] = LINES[i]; h += `<line x1="${a}" y1="${b}" x2="${c}" y2="${d}" stroke="#6b6b6b" stroke-width="2"/>`; }
  const r = BASE_R[t.count] * [0, 0.58, 0.79, 1][t.size];
  for (const [x, y] of LAYOUT[t.count]) h += shapeSVG(t.shape, x, y, r, t.rot, fillOf(t.fill, id));
  if (t.mark !== 'none') { const [x, y] = MARKPOS[t.mpos]; h += shapeSVG(t.mark, x, y, 6, 0, '#222'); }
  return h + '</svg>';
}
function describe(f, v, t) {
  if (f === 'shape') return `${/^[aeiou]/.test(NAME[v]) ? 'an' : 'a'} ${NAME[v]}`;
  if (f === 'fill') return `${FILLNAME[v]} shading`;
  if (f === 'size') return `${SIZENAME[v]} shapes`;
  if (f === 'count') return `${v} shape${v > 1 ? 's' : ''}`;
  if (f === 'mark') return v === 'none' ? 'no small corner shape' : `a small ${v} in the corner`;
  if (f === 'mpos') return v < 0 ? 'no corner shape' : `the small shape in the ${CORNER[v]} corner`;
  if (f === 'lines') return `${v} line${v === 1 ? '' : 's'} across the box`;
  if (f === 'rot') return `the ${NAME[t.shape]} pointing the same way`;
  return '';
}
function randTile(o) {
  const a = age();
  return baseTile(Object.assign({
    shape: pick(SHAPES), fill: pick(fillsFor()), size: rint(2, 3), count: rint(1, a === 4 ? 4 : 5),
    mark: Math.random() < 0.5 ? 'none' : pick(MARKS), mpos: rint(0, 3), lines: rint(0, a === 4 ? 2 : 4),
  }, o || {}));
}
/* the value of one feature for several tiles: does exactly one stand out? returns that index, or -1 */
function oddSplit(tiles, f) {
  const vs = tiles.map(t => dval(t, f)), c = {};
  vs.forEach(v => c[v] = (c[v] || 0) + 1);
  const keys = Object.keys(c);
  if (keys.length !== 2) return -1;
  const lone = keys.find(k => c[k] === 1), many = keys.find(k => c[k] === tiles.length - 1);
  if (lone === undefined || many === undefined) return -1;
  return vs.findIndex(v => String(v) === lone);
}
const constant = (tiles, f) => new Set(tiles.map(t => dval(t, f))).size === 1;
const optsHTML = (o, px) => o.map(t => typeof t === 'string' ? t : tileSVG(t, px));
const row = (items, cls) => `<div class="nvr-row ${cls || ''}">${items.join('')}</div>`;
const cell = (html, cap) => `<div class="nvr-cell">${html}${cap != null ? `<span class="nvr-cap">${cap}</span>` : ''}</div>`;
const qbox = () => `<div class="nvr-q">?</div>`;

/* features that may change, by age */
function featPool(kind) {
  const a = age();
  if (kind === 'odd') return a === 4 ? ['shape', 'fill', 'count', 'mark'] : a === 5 ? ['shape', 'fill', 'count', 'mark', 'size', 'lines'] : ['shape', 'fill', 'count', 'mark', 'size', 'lines', 'mpos'];
  return a === 4 ? ['fill', 'count', 'mark'] : ['fill', 'count', 'mark', 'size', 'lines'];
}
function setVal(t, f, v) { if (f === 'mpos' && t.mark === 'none') t.mark = pick(MARKS); t[f] = v; }
function domain(f, t) {
  if (f === 'shape') return SHAPES; if (f === 'fill') return fillsFor(); if (f === 'size') return [1, 2, 3];
  if (f === 'count') return age() === 4 ? [1, 2, 3, 4] : [1, 2, 3, 4, 5];
  if (f === 'mark') return ['none', ...MARKS]; if (f === 'mpos') return [0, 1, 2, 3];
  if (f === 'lines') return age() === 4 ? [0, 1, 2] : [0, 1, 2, 3, 4];
  return [];
}

/* ════════════════════════════════════════════════════════════════
   QUESTION MAKERS. Each returns { kind:'mc', options:[html], answer, prompt, explain, key } or null.
   ════════════════════════════════════════════════════════════════ */
const MAKE = {
  /* ── Odd one out: four figures share a rule ── */
  odd() {
    const a = age(), n = nOpts();
    for (let k = 0; k < 200; k++) {
      const relational = a === 6 && Math.random() < 0.35;
      let rule = relational ? pick(['count=lines', 'mark=shape']) : pick(featPool('odd'));
      const vary = shuffle(featPool('odd').filter(f => !((rule === 'size' && f === 'count') || (rule === 'count' && f === 'size')))).slice(0, a === 4 ? 2 : a === 5 ? 3 : 4);
      if (vary.includes('size') && vary.includes('count')) continue;
      if (relational && vary.includes('size')) continue;
      const odd = rint(0, n - 1);
      let tiles = Array.from({ length: n }, () => randTile());
      // features that are not varied stay the same in all five
      const fixed = randTile();
      tiles = tiles.map(t => { const o = clone(fixed); vary.forEach(f => o[f] = t[f]); return o; });
      let explain;
      if (rule === 'count=lines') {
        tiles.forEach((t, i) => { t.count = rint(1, 4); t.lines = i === odd ? pickOther([0, 1, 2, 3, 4], t.count) : t.count; });
        explain = 'In the others, the number of shapes matches the number of lines. This one does not.';
      } else if (rule === 'mark=shape') {
        tiles.forEach((t, i) => { t.shape = pick(MARKS); t.mark = i === odd ? pickOther(MARKS, t.shape) : t.shape; });
        explain = 'In the others, the small corner shape is the same shape as the big one. This one is different.';
      } else {
        const v = pick(domain(rule)), w = pickOther(domain(rule), v);
        tiles.forEach((t, i) => setVal(t, rule, i === odd ? w : v));
        explain = `The others all have ${describe(rule, fval(tiles[(odd + 1) % n], rule), tiles[(odd + 1) % n])}. This one has ${describe(rule, fval(tiles[odd], rule), tiles[odd])}.`;
      }
      if (new Set(tiles.map(tkey)).size !== n) continue;
      // no other feature may single out one figure
      // no other feature (or broad category) may single out any figure
      if (ALLF.some(f => f !== rule && !(DEP[f] || []).includes(rule) && oddSplit(tiles, f) >= 0)) continue;
      if (!relational && oddSplit(tiles, rule) !== odd) continue;
      if (relational && ALLF.some(f => oddSplit(tiles, f) >= 0)) continue;
      return { kind: 'mc', options: optsHTML(tiles), answer: odd, key: 'odd:' + rule, data: { type: 'odd', tiles, rule, odd },
        prompt: 'Which figure is the <b>odd one out</b>?', explain };
    }
    return null;
  },

  /* ── Find the figure like the first three ── */
  like() {
    const a = age();
    for (let k = 0; k < 300; k++) {
      const rules = shuffle(featPool('odd')).slice(0, a === 4 ? 1 : 2);
      const vals = {}; rules.forEach(f => vals[f] = pick(domain(f)));
      if (rules.includes('mpos') && vals.mark === 'none') continue;
      const sizeRule = rules.includes('size'), fixedCount = rint(1, 2);
      const make = () => { const t = randTile(); if (sizeRule) t.count = fixedCount; else t.size = 3; rules.forEach(f => setVal(t, f, vals[f])); if (rules.includes('mpos') && t.mark === 'none') t.mark = pick(MARKS); return t; };
      const ex = [make(), make(), make()];
      // everything that is not the rule must change between the three examples
      const constEx = ALLF.filter(f => f !== 'rot' && constant(ex, f));
      // drawn features that are not the rule must change between the examples, so the rule can be seen
      if (constEx.some(f => FEATS.includes(f) && !rules.includes(f) && !(sizeRule && f === 'count') && !(!sizeRule && f === 'size'))) continue;
      const right = make();
      const wrong = [];
      for (let j = 0; j < 12 && wrong.length < nOpts() - 1; j++) {
        const t = randTile(), f = pick(rules);
        if (sizeRule) t.count = fixedCount; else t.size = 3;
        rules.forEach(g => setVal(t, g, vals[g]));
        setVal(t, f, pickOther(domain(f), vals[f]));
        wrong.push(t);
      }
      const opts = [right, ...wrong];
      if (opts.length < nOpts() || new Set(opts.concat(ex).map(tkey)).size !== opts.length + 3) continue;
      if (wrong.some(t => constEx.every(f => dval(t, f) === dval(ex[0], f)))) continue;
      if (!constEx.every(f => dval(right, f) === dval(ex[0], f))) continue;
      const o = shuffle(opts);
      return { kind: 'mc', options: optsHTML(o), answer: o.indexOf(right), key: 'like:' + rules.join('+'), data: { type: 'like', ex, opts: o, rules },
        prompt: `Look at the three figures in the box. Which choice is <b>most like</b> them?${row(ex.map(t => cell(tileSVG(t))), 'nvr-ex')}`,
        explain: `All three have ${rules.map(f => describe(f, vals[f], ex[0])).join(' and ')}. Only one choice has ${rules.length > 1 ? 'both' : 'that'}.` };
    }
    return null;
  },

  /* ── Complete the series ── */
  series() {
    const a = age();
    for (let k = 0; k < 200; k++) {
      const pool = a === 4 ? ['count', 'mpos', 'rot', 'fill', 'lines'] : ['count', 'mpos', 'rot', 'fill', 'lines', 'size'];
      const ch = shuffle(pool).slice(0, a === 4 ? 1 : a === 5 ? 2 : 3);
      if (ch.includes('count') && ch.includes('size')) continue;
      const t0 = randTile({ size: 3 });
      if (ch.includes('rot')) { t0.shape = pick(ROT_SHAPES); t0.rot = pick([0, 90, 180, 270]); }
      if (ch.includes('count')) t0.count = 1;
      if (ch.includes('mpos')) t0.mark = pick(MARKS);
      if (ch.includes('lines')) t0.lines = 0;
      if (ch.includes('size')) t0.count = Math.min(t0.count, 2);
      const rstep = (a === 6 ? pick([45, 90, -45, -90]) : pick([90, -90])), pstep = a === 6 ? pick([1, 2, -1]) : pick([1, -1]);
      const fillCycle = shuffle(fillsFor()).slice(0, a === 6 ? 3 : 2);
      const at = (i) => {
        const t = clone(t0);
        if (ch.includes('rot')) t.rot = t0.rot + rstep * i;
        if (ch.includes('count')) t.count = 1 + i;
        if (ch.includes('mpos')) t.mpos = ((t0.mpos + pstep * i) % 4 + 4) % 4;
        if (ch.includes('fill')) t.fill = fillCycle[i % fillCycle.length];
        if (ch.includes('lines')) t.lines = i;
        if (ch.includes('size')) t.size = [1, 2, 3][i % 3];
        return t;
      };
      const terms = [0, 1, 2, 3, 4].map(at);
      // a gap in the middle is only fair when every pattern can be read from the figures either side of it
      const gap = a === 6 && !ch.includes('size') && !(ch.includes('fill') && fillCycle.length === 3) && Math.random() < 0.35 ? 2 : 4;
      const right = terms[gap];
      const wrong = [];
      for (const f of ch) for (const d of [-1, 1, 2]) { const t = clone(right), alt = at(gap + d); if (gap + d < 0) continue; t[f] = alt[f]; if (f === 'mpos') t.mark = right.mark; wrong.push(t); }
      for (const d of [-2, -3]) if (gap + d >= 0) for (const f of ch) { const t = clone(right); t[f] = at(gap + d)[f]; wrong.push(t); }
      wrong.push(Object.assign(clone(right), { fill: pickOther(fillsFor(), right.fill) }));
      if (!ch.includes('rot')) wrong.push(Object.assign(clone(right), { shape: pickOther(SHAPES, right.shape) }));
      if (!ch.includes('mpos')) wrong.push(Object.assign(clone(right), { mark: pickOther(['none', ...MARKS], right.mark) }));
      const ws = []; const seen = new Set([tkey(right)]);
      for (const t of shuffle(wrong)) { const kk = tkey(t); if (t.count <= 5 && t.lines <= 4 && !seen.has(kk)) { seen.add(kk); ws.push(t); } }
      if (ws.length < nOpts() - 1) continue;
      const o = shuffle([right, ...ws.slice(0, nOpts() - 1)]);
      const say = { rot: `The ${NAME[t0.shape]} turns ${Math.abs(rstep)}° ${rstep > 0 ? 'clockwise' : 'anticlockwise'} each time.`,
        count: 'There is one more shape each time.', mpos: `The small corner shape moves ${Math.abs(pstep) === 2 ? 'two corners' : 'one corner'} ${pstep > 0 ? 'clockwise' : 'anticlockwise'} each time.`,
        fill: `The shading goes ${fillCycle.map(f => FILLNAME[f]).join(', ')}, then repeats.`, lines: 'There is one more line each time.', size: 'The shapes go small, medium, large, then repeat.' };
      const shown = terms.map((t, i) => i === gap ? cell(qbox()) : cell(tileSVG(t, 70)));
      return { kind: 'mc', options: optsHTML(o), answer: o.indexOf(right), key: 'series:' + ch.join('+'), data: { type: 'series', terms, gap, opts: o, ch },
        prompt: `Which figure ${gap === 4 ? 'comes next in' : 'is missing from'} the series?${row(shown, 'nvr-series')}`,
        explain: ch.map(f => say[f]).join(' ') };
    }
    return null;
  },

  /* ── Analogies: A is to B as C is to ? ── */
  analogy() {
    const a = age();
    for (let k = 0; k < 200; k++) {
      const pool = ['rot', 'fill', 'count', 'size', 'mark', 'lines'];
      const T = shuffle(pool).slice(0, a === 4 ? 1 : 2 + (a === 6 && Math.random() < 0.5 ? 1 : 0));
      if (T.includes('size') && T.includes('count')) continue;
      const A = randTile({ size: 3 });
      if (T.includes('rot')) { A.shape = pick(ROT_SHAPES); A.rot = pick([0, 90, 180, 270]); }
      if (T.includes('size')) A.count = Math.min(A.count, 2);
      const B = clone(A), d = pick([90, 180, -90]);
      const say = [];
      for (const f of T) {
        if (f === 'rot') { B.rot = A.rot + d; say.push(d === 180 ? 'it turns half way round' : `it turns 90° ${d > 0 ? 'clockwise' : 'anticlockwise'}`); }
        else { const v = pickOther(domain(f), A[f]); setVal(B, f, v); say.push(f === 'mark' ? (v === 'none' ? 'the small corner shape disappears' : A.mark === 'none' ? `it gains a small ${v} in the ${CORNER[B.mpos]} corner` : `the small corner shape changes to a ${v}`) : `it changes to ${describe(f, v, B)}`); }
      }
      // C keeps the starting values of everything that changes, but is a different shape
      const C = clone(A);
      C.shape = T.includes('rot') ? pickOther(ROT_SHAPES, A.shape) : pickOther(SHAPES, A.shape);
      const extra = pickOther(['fill', 'count', 'lines'].filter(f => !T.includes(f) && !(f === 'count' && T.includes('size'))).concat(['shape']), 'shape');
      if (extra && extra !== 'shape') C[extra] = pickOther(domain(extra), A[extra]);
      const D = clone(C); for (const f of T) { if (f === 'rot') D.rot = C.rot + d; else { D[f] = B[f]; if (f === 'mark') D.mpos = B.mpos; } }
      const wrong = [clone(C)];
      for (const f of T) { const w = clone(D); w[f] = C[f]; if (f === 'mark') w.mpos = C.mpos; wrong.push(w); }
      if (T.includes('rot')) wrong.push(Object.assign(clone(D), { rot: C.rot - d }));
      wrong.push(Object.assign(clone(D), { shape: A.shape }));
      wrong.push(Object.assign(clone(D), { fill: pickOther(fillsFor(), D.fill) }));
      const ws = []; const seen = new Set([tkey(D)]);
      for (const t of wrong) { const kk = tkey(t); if (!seen.has(kk)) { seen.add(kk); ws.push(t); } }
      if (ws.length < nOpts() - 1 || tkey(A) === tkey(B)) continue;
      const o = shuffle([D, ...shuffle(ws).slice(0, nOpts() - 1)]);
      return { kind: 'mc', options: optsHTML(o), answer: o.indexOf(D), key: 'analogy:' + T.join('+'), data: { type: 'analogy', A, B, C, opts: o, T },
        prompt: `The first figure changes into the second. Which choice shows the third figure changed <b>in the same way</b>?${row([cell(tileSVG(A, 70)), '<span class="nvr-arrow">→</span>', cell(tileSVG(B, 70)), '<span class="nvr-gap"></span>', cell(tileSVG(C, 70)), '<span class="nvr-arrow">→</span>', cell(qbox())], 'nvr-analogy')}`,
        explain: `From the first figure to the second, ${say.join(' and ')}. Do the same to the third figure.` };
    }
    return null;
  },

  /* ── Matrices: complete the grid ── */
  matrix() {
    const a = age();
    for (let k = 0; k < 200; k++) {
      const base = randTile({ size: 3, count: rint(1, 2) });
      let cells = [], explain;
      if (a === 4) {
        const [fr, fc] = shuffle(['fill', 'shape', 'count', 'mark']).slice(0, 2);
        const vr = pickOther(domain(fr), base[fr]), vc = pickOther(domain(fc), base[fc]);
        const g = (r, c) => { const t = clone(base); if (c) setVal(t, fr, vr); if (r) setVal(t, fc, vc); return t; };
        cells = [[g(0, 0), g(0, 1)], [g(1, 0), g(1, 1)]];
        explain = `Going across, ${fr === 'shape' ? 'the shape changes' : fr === 'count' ? 'the number of shapes changes' : fr === 'fill' ? 'the shading changes' : 'the corner shape changes'}. Going down, ${fc === 'shape' ? 'the shape changes' : fc === 'count' ? 'the number of shapes changes' : fc === 'fill' ? 'the shading changes' : 'the corner shape changes'}. The missing figure has both changes.`;
      } else {
        const f1 = pick(['shape', 'fill']), f2 = pick(['count', 'mark', 'lines', 'size'].concat(f1 === 'shape' ? ['fill'] : ['shape']));
        const v1 = shuffle(domain(f1)).slice(0, 3), v2 = shuffle(domain(f2)).slice(0, 3);
        if (f2 === 'size') base.count = Math.min(base.count, 2);
        const shift = pick([1, 2]);
        const g = (r, c) => { const t = clone(base); setVal(t, f1, v1[(c + r * shift) % 3]); setVal(t, f2, v2[c]); return t; };
        cells = [0, 1, 2].map(r => [0, 1, 2].map(c => g(r, c)));
        explain = `Each row has one of each ${f1 === 'shape' ? 'shape' : 'shading'}. Each column has the same ${f2 === 'count' ? 'number of shapes' : f2 === 'mark' ? 'corner shape' : f2 === 'lines' ? 'number of lines' : f2 === 'size' ? 'size' : f2 === 'fill' ? 'shading' : 'shape'}.`;
      }
      const n = cells.length, right = cells[n - 1][n - 1];
      const others = cells.flat().slice(0, -1);
      const wrong = [];
      for (const f of ['shape', 'fill', 'count', 'mark', 'lines', 'size']) { const t = clone(right); setVal(t, f, pickOther(domain(f), right[f])); wrong.push(t); }
      others.forEach(t => wrong.push(clone(t)));
      const ws = []; const seen = new Set([tkey(right)]);
      for (const t of shuffle(wrong)) { const kk = tkey(t); if (!seen.has(kk)) { seen.add(kk); ws.push(t); } }
      if (ws.length < nOpts() - 1) continue;
      // the rows must not all be identical (the grid has to show a change)
      if (new Set(cells.flat().map(tkey)).size < cells.flat().length - (n === 3 ? 0 : 0)) continue;
      const o = shuffle([right, ...ws.slice(0, nOpts() - 1)]);
      const grid = `<div class="nvr-grid g${n}">${cells.flat().map((t, i) => i === n * n - 1 ? cell(qbox()) : cell(tileSVG(t, n === 3 ? 58 : 70))).join('')}</div>`;
      return { kind: 'mc', options: optsHTML(o), answer: o.indexOf(right), key: 'matrix:' + n, data: { type: 'matrix', cells, opts: o },
        prompt: `Which figure completes the grid?${grid}`, explain };
    }
    return null;
  },

  /* ── Codes: letters stand for features ── */
  code() {
    const a = age(), P = a === 6 ? 3 : 2;
    const SETS = ['ABCD', 'XYZW', 'LMNP'];
    for (let k = 0; k < 300; k++) {
      const attrs = shuffle(a === 4 ? ['shape', 'fill', 'count'] : ['shape', 'fill', 'count', 'mark', 'lines']).slice(0, P);
      const vals = attrs.map(f => shuffle(domain(f).filter(v => !(f === 'mark' && v === 'none'))).slice(0, a === 4 ? 2 : 3));
      const letters = attrs.map((f, i) => shuffle([...SETS[i]]).slice(0, vals[i].length));
      const mk = combo => { const t = randTile({ size: 3 }); attrs.forEach((f, i) => setVal(t, f, vals[i][combo[i]])); return t; };
      const combos = []; for (let i = 0; i < 40 && combos.length < (a === 4 ? 3 : 4); i++) { const c = attrs.map((f, j) => rint(0, vals[j].length - 1)); if (!combos.some(x => x.join() === c.join())) combos.push(c); }
      if (combos.length < (a === 4 ? 3 : 4)) continue;
      // every value of every coded feature must be shown, so the test figure can be worked out
      if (attrs.some((f, j) => new Set(combos.map(c => c[j])).size < vals[j].length)) continue;
      const ex = combos.map(mk);
      let tc; for (let i = 0; i < 20; i++) { tc = attrs.map((f, j) => rint(0, vals[j].length - 1)); if (!combos.some(x => x.join() === tc.join())) break; }
      if (combos.some(x => x.join() === tc.join())) continue;
      const test = mk(tc);
      const codeOf = c => c.map((v, j) => letters[j][v]).join('');
      // no other feature may explain a letter differently
      let bad = false;
      for (let j = 0; j < P && !bad; j++) {
        const lettersEx = combos.map(c => letters[j][c[j]]);
        for (const f of ALLF) {
          if (f === attrs[j] || (DEP[f] || []).includes(attrs[j])) continue;
          const fv = ex.map(t => dval(t, f));
          const same = fv.every((v, i) => fv.every((w, m) => (v === w) === (lettersEx[i] === lettersEx[m])));
          if (!same) continue;
          const hit = fv.indexOf(dval(test, f));
          if (hit < 0 || lettersEx[hit] !== letters[j][tc[j]]) bad = true;
        }
      }
      if (bad || new Set(ex.concat([test]).map(tkey)).size !== ex.length + 1) continue;
      const right = codeOf(tc);
      const wrong = [];
      for (let j = 0; j < P; j++) for (const L of letters[j]) { const w = right.split(''); w[j] = L; wrong.push(w.join('')); }
      wrong.push(right.split('').reverse().join(''));
      const ws = shuffle(uniq(wrong.filter(w => w !== right)));
      if (ws.length < nOpts() - 1) continue;
      const o = shuffle([right, ...ws.slice(0, nOpts() - 1)]);
      const FN = { shape: 'the shape', fill: 'the shading', count: 'the number of shapes', mark: 'the corner shape', lines: 'the number of lines' };
      const VN = (f, v) => f === 'shape' ? NAME[v] : f === 'fill' ? FILLNAME[v] : f === 'mark' ? v : `${v}`;
      return { kind: 'mc', options: o.map(c => `<b class="nvr-code">${c}</b>`), answer: o.indexOf(right), key: 'code:' + attrs.join('+'), data: { type: 'code', ex, codes: combos.map(codeOf), test, opts: o, attrs },
        prompt: `Each letter stands for something about the figure. Which code goes with the last figure?${row(ex.map((t, i) => cell(tileSVG(t, 66), codeOf(combos[i]))).concat([cell(tileSVG(test, 66), '?')]), 'nvr-codes')}`,
        explain: attrs.map((f, j) => `Letter ${j + 1} is ${FN[f]}: ${vals[j].map((v, i) => `${letters[j][i]} = ${VN(f, v)}`).join(', ')}.`).join(' ') + ` So the code is <b>${right}</b>.` };
    }
    return null;
  },

  /* ── Reflections ── */
  reflect() {
    for (let k = 0; k < 100; k++) {
      const f = randFigure();
      const horiz = age() === 6 && Math.random() < 0.4;
      const right = horiz ? mirH(f) : mirV(f);
      const cand = [horiz ? mirV(f) : mirH(f), rot(f, 2), f, rot(f, 1), rot(f, 3), rot(right, 2)];
      const ws = [], seen = new Set([fkey(right)]);
      for (const c of cand) { const kk = fkey(c); if (!seen.has(kk)) { seen.add(kk); ws.push(c); } }
      if (ws.length < nOpts() - 1) continue;
      const o = shuffle([right, ...ws.slice(0, nOpts() - 1)]);
      return { kind: 'mc', options: o.map(x => figSVG(x)), answer: o.indexOf(right), key: 'reflect:' + (horiz ? 'h' : 'v'), data: { type: 'reflect', fig: f, opts: o, horiz },
        prompt: `Which choice shows the figure <b>reflected in the mirror line</b>?${row([cell(figSVG(f, 90, horiz ? 'h' : 'v'))], 'nvr-ex')}`,
        explain: horiz ? 'In a mirror line along the bottom, the top and bottom swap over. Left and right stay where they are.' : 'In a mirror line down the side, left and right swap over. The top and bottom stay where they are.' };
    }
    return null;
  },

  /* ── Rotations ── */
  rotate() {
    for (let k = 0; k < 100; k++) {
      const f = randFigure(), turn = rint(1, 3), right = rot(f, turn);
      const ws = [], seen = new Set([0, 1, 2, 3].map(t => fkey(rot(f, t))));
      for (const t of shuffle([0, 1, 2, 3])) { const c = rot(mirV(f), t), kk = fkey(c); if (!seen.has(kk)) { seen.add(kk); ws.push(c); } }
      if (ws.length < nOpts() - 1) continue;
      const o = shuffle([right, ...ws.slice(0, nOpts() - 1)]);
      return { kind: 'mc', options: o.map(x => figSVG(x)), answer: o.indexOf(right), key: 'rotate', data: { type: 'rotate', fig: f, opts: o, turn },
        prompt: `Which choice is the figure <b>turned round</b>? It must not be flipped over.${row([cell(figSVG(f, 90))], 'nvr-ex')}`,
        explain: `The answer is the figure turned ${turn === 2 ? 'half way round' : `a quarter turn ${turn === 1 ? 'clockwise' : 'anticlockwise'}`}. The others are mirror images, so they cannot be made just by turning.` };
    }
    return null;
  },

  /* ── Hidden shapes ── */
  hidden() {
    const a = age();
    for (let k = 0; k < 100; k++) {
      const tgt = pick(HIDDEN_SHAPES);
      const u = a === 4 ? 13 : a === 5 ? 11 : 9.5;
      const variants = [gmir(tgt), grot(tgt, 1), grot(tgt, 2), grot(tgt, 3), gstretch(tgt)].filter(v => gkey(v) !== gkey(tgt));
      const vs = []; const seen = new Set([gkey(tgt)]);
      for (const v of shuffle(variants)) { const kk = gkey(v); if (!seen.has(kk)) { seen.add(kk); vs.push(v); } }
      if (vs.length < nOpts() - 1) continue;
      const mk = shape => hiddenSVG(shape, u, a);
      const shapes = shuffle([tgt, ...vs.slice(0, nOpts() - 1)]);
      const o = shapes.map(mk);
      return { kind: 'mc', options: o, answer: shapes.indexOf(tgt), key: 'hidden', data: { type: 'hidden', tgt, shapes },
        prompt: `Which figure has this shape <b>hidden</b> in it? It must be the same size and the same way round.${row([cell(gridShapeSVG(tgt, u))], 'nvr-ex')}`,
        explain: 'Look for the corners of the shape first. The other figures hide the shape flipped, turned or stretched.' };
    }
    return null;
  },

  /* ── Fold and punch ── */
  fold() {
    const a = age();
    for (let k = 0; k < 100; k++) {
      const kinds = a === 4 ? ['L', 'R', 'T', 'B'] : a === 5 ? ['L', 'R', 'T', 'B', 'D'] : ['LT', 'RB', 'D', 'L', 'T'];
      const kind = pick(kinds);
      const vis = visibleCells(kind);
      const holes = shuffle(vis).slice(0, a === 4 ? rint(1, 2) : rint(2, 3));
      const unf = unfold(kind, holes);
      const wrongSets = [holes, unfold(wrongKind(kind), holes), unf.slice(1), uniq(unf.concat([pick(ALLCELLS.filter(c => !unf.includes(c)))]))];
      if (a >= 5) wrongSets.push(unfold(pick(['L', 'T', 'D'].filter(x => x !== kind)), holes));
      const ws = [], seen = new Set([setKey(unf)]);
      for (const w of wrongSets) { const kk = setKey(w); if (w.length && !seen.has(kk)) { seen.add(kk); ws.push(w); } }
      if (ws.length < nOpts() - 1) continue;
      const o = shuffle([unf, ...ws.slice(0, nOpts() - 1)]);
      return { kind: 'mc', options: o.map(s => paperSVG(s)), answer: o.findIndex(s => setKey(s) === setKey(unf)), key: 'fold:' + kind, data: { type: 'fold', kind, holes, opts: o },
        prompt: `A square of paper is folded${kind.length > 1 ? ' twice' : ''}, then holes are punched through it. Which choice shows the paper <b>unfolded</b>?${row([cell(foldSVG(kind, holes), '')], 'nvr-ex')}`,
        explain: kind.length > 1 ? 'Unfold one fold at a time. Each hole is reflected in the first fold line, then everything is reflected in the second fold line, giving four of each hole.' : 'When the paper opens, every hole appears again, reflected in the fold line.' };
    }
    return null;
  },

  /* ── Cube nets: opposite faces ── */
  cube() {
    for (let k = 0; k < 50; k++) {
      const net = pick(NETS);
      const faces = netFaces(net);
      if (!faces) continue;
      const syms = shuffle(CUBE_SYMS);
      const pickF = rint(0, 5), opp = faces.findIndex(f => f.d.every((v, i) => v === -faces[pickF].d[i]));
      if (opp < 0) continue;
      const others = [0, 1, 2, 3, 4, 5].filter(i => i !== pickF && i !== opp);
      const choices = shuffle([opp, ...shuffle(others).slice(0, nOpts() - 1)]);
      const touch = [0, 1, 2, 3, 4, 5].filter(i => i !== pickF && i !== opp).map(i => NAME[syms[i]] + (syms[i] === 'cross' ? '' : ''));
      const line = faces[pickF].r === faces[opp].r ? Math.abs(faces[pickF].c - faces[opp].c) === 2 : faces[pickF].c === faces[opp].c && Math.abs(faces[pickF].r - faces[opp].r) === 2;
      return { kind: 'mc', options: choices.map(i => symSVG(syms[i])), answer: choices.indexOf(opp), key: 'cube', data: { type: 'cube', net, faces, pick: pickF, choices, syms },
        explainX: `When the net folds, the shaded ${NAME[syms[pickF]]} touches the ${touch.slice(0, -1).join(', ')} and ${touch[touch.length - 1]}. The only face it never touches is the <b>${NAME[syms[opp]]}</b>, so that is opposite.${line ? ' They are also two squares apart in a straight line, which always means opposite.' : ''}`,
        prompt: `This net folds to make a cube. Which face will be <b>opposite</b> the shaded face?${row([cell(netSVG(net, faces, syms, pickF))], 'nvr-ex')}`,
        get explain() { return this.explainX; } };
    }
    return null;
  },
};

/* ───────────── spatial figures for reflection and rotation ───────────── */
const BODIES = [
  [[20, 20], [55, 20], [55, 38], [38, 38], [38, 80], [20, 80]],            // L
  [[20, 20], [80, 20], [80, 40], [45, 40], [45, 80], [25, 80], [25, 40], [20, 40]],
  [[25, 20], [70, 20], [80, 45], [45, 45], [45, 80], [25, 80]],
  [[20, 25], [60, 25], [60, 45], [80, 45], [80, 80], [40, 80], [40, 50], [20, 50]],
  [[30, 18], [62, 18], [62, 30], [44, 30], [44, 50], [70, 50], [70, 82], [30, 82]],
];
function randFigure() {
  for (let k = 0; k < 50; k++) {
    const body = pick(BODIES).map(([x, y]) => [x, y]);
    const fig = [{ t: 'poly', p: body, f: pick(['#fff', '#9aa3ad']) }];
    const spots = [[30, 30], [70, 30], [70, 68], [30, 68], [50, 60], [66, 70], [28, 70]];
    const s1 = pick(spots); fig.push({ t: 'circ', c: s1, r: 6, f: '#222' });
    if (age() >= 5) { const s2 = pick(spots.filter(s => s !== s1)); fig.push({ t: 'poly', p: [[s2[0], s2[1] - 7], [s2[0] + 7, s2[1] + 6], [s2[0] - 7, s2[1] + 6]], f: age() === 6 ? '#fff' : '#222' }); }
    // it must not look the same when flipped
    const m = fkey(mirV(fig));
    if ([0, 1, 2, 3].every(t => fkey(rot(fig, t)) !== m)) return fig;
  }
  return [{ t: 'poly', p: BODIES[0], f: '#fff' }, { t: 'circ', c: [30, 30], r: 6, f: '#222' }];
}
const mapFig = (fig, fn) => fig.map(e => e.t === 'circ' ? Object.assign({}, e, { c: fn(e.c) }) : Object.assign({}, e, { p: e.p.map(fn) }));
const mirV = fig => mapFig(fig, ([x, y]) => [100 - x, y]);
const mirH = fig => mapFig(fig, ([x, y]) => [x, 100 - y]);
const rot = (fig, n) => { let f = fig; for (let i = 0; i < ((n % 4) + 4) % 4; i++) f = mapFig(f, ([x, y]) => [100 - y, x]); return f; };
const fkey = fig => fig.map(e => e.t + e.f + (e.t === 'circ' ? e.c.map(Math.round).join(',') : e.p.map(p => p.map(Math.round).join(',')).sort().join(';'))).sort().join('|');
function figSVG(fig, px, mirror) {
  let h = `<svg class="nvr-fig" viewBox="0 0 ${mirror === 'v' ? 116 : 100} ${mirror === 'h' ? 116 : 100}" width="${(px || 84) * (mirror === 'v' ? 1.16 : 1)}" height="${(px || 84) * (mirror === 'h' ? 1.16 : 1)}" aria-hidden="true"><rect x="1" y="1" width="98" height="98" rx="4" fill="#fffdf6" stroke="#6b5a48" stroke-width="2"/>`;
  for (const e of fig) h += e.t === 'circ' ? `<circle cx="${e.c[0]}" cy="${e.c[1]}" r="${e.r}" fill="${e.f}" stroke="#222" stroke-width="2"/>` : `<polygon points="${e.p.map(p => p.join(',')).join(' ')}" fill="${e.f}" stroke="#222" stroke-width="2.5" stroke-linejoin="round"/>`;
  if (mirror === 'v') h += `<line x1="108" y1="2" x2="108" y2="98" stroke="#c0392b" stroke-width="3" stroke-dasharray="6 4"/>`;
  if (mirror === 'h') h += `<line x1="2" y1="108" x2="98" y2="108" stroke="#c0392b" stroke-width="3" stroke-dasharray="6 4"/>`;
  return h + '</svg>';
}

/* ───────────── hidden shapes (drawn on a grid, outlines only) ───────────── */
const HIDDEN_SHAPES = [
  [[0, 0], [1, 0], [1, 2], [2, 2], [2, 3], [0, 3]],            // L
  [[0, 0], [3, 0], [3, 1], [2, 1], [2, 2], [1, 2], [1, 1], [0, 1]],  // T
  [[0, 0], [2, 0], [2, 1], [1, 1], [1, 3], [0, 3]],            // long L
  [[0, 0], [1, 0], [1, 1], [2, 1], [2, 2], [3, 2], [3, 3], [0, 3]], // stairs
  [[0, 0], [3, 0], [3, 1], [1, 1], [1, 2], [2, 2], [2, 3], [0, 3]], // F-ish
  [[0, 1], [1, 1], [1, 0], [2, 0], [2, 2], [0, 2]],            // notch
];
const gnorm = s => { const mx = Math.min(...s.map(p => p[0])), my = Math.min(...s.map(p => p[1])); return s.map(([x, y]) => [x - mx, y - my]); };
const gmir = s => gnorm(s.map(([x, y]) => [-x, y]));
const grot = (s, n) => { let r = s; for (let i = 0; i < n; i++) r = r.map(([x, y]) => [-y, x]); return gnorm(r); };
const gstretch = s => gnorm(s.map(([x, y]) => [x * 2, y]));
const gkey = s => gnorm(s).map(p => p.join(',')).sort().join(';');
function gridShapeSVG(s, u) {
  const w = Math.max(...s.map(p => p[0])), h = Math.max(...s.map(p => p[1])), sz = Math.max(w, h) * u + 20;
  return `<svg class="nvr-fig" viewBox="0 0 ${sz} ${sz}" width="${sz}" height="${sz}" aria-hidden="true"><rect x="1" y="1" width="${sz - 2}" height="${sz - 2}" rx="4" fill="#fffdf6" stroke="#6b5a48" stroke-width="2"/><polygon points="${s.map(([x, y]) => `${10 + x * u},${10 + y * u}`).join(' ')}" fill="none" stroke="#222" stroke-width="2.4"/></svg>`;
}
function hiddenSVG(s, u, a) {
  const w = Math.max(...s.map(p => p[0])) * u, h = Math.max(...s.map(p => p[1])) * u;
  const ox = rint(10, Math.max(10, 90 - w)), oy = rint(10, Math.max(10, 90 - h));
  let g = `<svg class="nvr-fig" viewBox="0 0 100 100" width="84" height="84" aria-hidden="true"><rect x="1" y="1" width="98" height="98" rx="4" fill="#fffdf6" stroke="#6b5a48" stroke-width="2"/>`;
  // clutter: circles and slanted lines only, so they cannot make the straight-cornered shape by accident
  const nC = a === 4 ? 2 : a === 5 ? 3 : 4, nL = a === 4 ? 2 : a === 5 ? 3 : 5;
  for (let i = 0; i < nC; i++) g += `<circle cx="${rint(18, 82)}" cy="${rint(18, 82)}" r="${rint(8, 22)}" fill="none" stroke="#222" stroke-width="2"/>`;
  for (let i = 0; i < nL; i++) { const ang = (pick([20, 30, 60, 70, 110, 120, 150, 160]) + rint(-4, 4)) * Math.PI / 180, cx = rint(20, 80), cy = rint(20, 80), L = rint(25, 55); g += `<line x1="${(cx - Math.cos(ang) * L).toFixed(1)}" y1="${(cy - Math.sin(ang) * L).toFixed(1)}" x2="${(cx + Math.cos(ang) * L).toFixed(1)}" y2="${(cy + Math.sin(ang) * L).toFixed(1)}" stroke="#222" stroke-width="2"/>`; }
  g += `<polygon points="${s.map(([x, y]) => `${ox + x * u},${oy + y * u}`).join(' ')}" fill="none" stroke="#222" stroke-width="2"/>`;
  return g + '</svg>';
}

/* ───────────── fold and punch (a 4 × 4 grid of hole places) ───────────── */
const ALLCELLS = []; for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) ALLCELLS.push(r * 4 + c);
const setKey = s => uniq(s).sort((a, b) => a - b).join(',');
const rc = i => [Math.floor(i / 4), i % 4], idx = (r, c) => r * 4 + c;
// fold kinds: L = left half folded over onto the right (the right half is left showing), R, T (top folded down), B, D (top-right triangle folded onto the bottom-left), LT = left then top
function visibleCells(kind) {
  return ALLCELLS.filter(i => { const [r, c] = rc(i);
    if (kind === 'L') return c >= 2; if (kind === 'R') return c <= 1; if (kind === 'T') return r >= 2; if (kind === 'B') return r <= 1;
    if (kind === 'D') return r > c; if (kind === 'LT') return c >= 2 && r >= 2; if (kind === 'RB') return c <= 1 && r <= 1; return false; });
}
const reflC = i => { const [r, c] = rc(i); return idx(r, 3 - c); }, reflR = i => { const [r, c] = rc(i); return idx(3 - r, c); }, reflD = i => { const [r, c] = rc(i); return idx(c, r); };
function unfold(kind, holes) {
  if (kind === 'L' || kind === 'R') return uniq(holes.concat(holes.map(reflC)));
  if (kind === 'T' || kind === 'B') return uniq(holes.concat(holes.map(reflR)));
  if (kind === 'D') return uniq(holes.concat(holes.map(reflD)));
  const h2 = holes.concat(holes.map(reflR)); return uniq(h2.concat(h2.map(reflC)));
}
const wrongKind = k => ({ L: 'T', R: 'B', T: 'L', B: 'R', D: 'L', LT: 'L', RB: 'T' })[k];
function paperSVG(holes) {
  let h = `<svg class="nvr-fig" viewBox="0 0 100 100" width="84" height="84" aria-hidden="true"><rect x="4" y="4" width="92" height="92" fill="#fffdf6" stroke="#6b5a48" stroke-width="2"/>`;
  for (const i of uniq(holes)) { const [r, c] = rc(i); h += `<circle cx="${16 + c * 23}" cy="${16 + r * 23}" r="6" fill="#222"/>`; }
  return h + '</svg>';
}
function foldSVG(kind, holes) {
  const vis = new Set(visibleCells(kind));
  let h = `<svg class="nvr-fig" viewBox="0 0 100 100" width="110" height="110" aria-hidden="true"><rect x="4" y="4" width="92" height="92" fill="none" stroke="#b9a88f" stroke-width="2" stroke-dasharray="5 4"/>`;
  let shape;
  if (kind === 'L') shape = '50,4 96,4 96,96 50,96'; else if (kind === 'R') shape = '4,4 50,4 50,96 4,96';
  else if (kind === 'T') shape = '4,50 96,50 96,96 4,96'; else if (kind === 'B') shape = '4,4 96,4 96,50 4,50';
  else if (kind === 'D') shape = '4,4 96,96 4,96'; else if (kind === 'LT') shape = '50,50 96,50 96,96 50,96'; else shape = '4,4 50,4 50,50 4,50';
  h += `<polygon points="${shape}" fill="#f3e2c0" stroke="#6b5a48" stroke-width="2.5"/>`;
  for (const i of holes) { const [r, c] = rc(i); h += `<circle cx="${16 + c * 23}" cy="${16 + r * 23}" r="6" fill="#222"/>`; }
  const arrows = { L: 'M20,30 Q35,12 52,26', R: 'M80,30 Q65,12 48,26', T: 'M30,20 Q12,35 26,52', B: 'M30,80 Q12,65 26,48', D: 'M78,24 Q78,52 52,52', LT: 'M20,30 Q35,12 52,26', RB: 'M80,30 Q65,12 48,26' };
  const second = { LT: 'M30,20 Q12,35 26,52', RB: 'M30,80 Q12,65 26,48' }[kind];
  if (second) h += `<path d="${second}" fill="none" stroke="#c0392b" stroke-width="2.5" stroke-dasharray="4 3" marker-end="url(#ah)"/><text x="14" y="62" font-size="10" fill="#c0392b">2</text><text x="36" y="14" font-size="10" fill="#c0392b">1</text>`;
  h += `<path d="${arrows[kind]}" fill="none" stroke="#c0392b" stroke-width="2.5" marker-end="url(#ah)"/><defs><marker id="ah" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 z" fill="#c0392b"/></marker></defs>`;
  return h + '</svg>';
}

/* ───────────── cube nets ───────────── */
const NETS = ['X...\nXXXX\nX...', 'X...\nXXXX\n.X..', 'X...\nXXXX\n..X.', 'X...\nXXXX\n...X', '.X..\nXXXX\n.X..', '.X..\nXXXX\n..X.',
  'XX..\n.XXX\n.X..', 'XX..\n.XXX\n..X.', 'XX..\n.XXX\n...X', 'XX..\n.XX.\n..XX', 'XXX..\n..XXX'];
const CUBE_SYMS = ['circle', 'star', 'triangle', 'cross', 'diamond', 'hexagon'];
/* roll a cube across the net: each square gets the direction its face points in */
function netFaces(net) {
  const cells = []; net.split('\n').forEach((l, r) => [...l].forEach((ch, c) => { if (ch === 'X') cells.push([r, c]); }));
  const neg = v => v.map(x => -x), at = new Map(), q = [];
  at.set(cells[0].join(), { d: [0, 0, -1], e: [1, 0, 0], s: [0, 1, 0] }); q.push(cells[0]);
  while (q.length) {
    const [r, c] = q.shift(), o = at.get([r, c].join());
    for (const [dr, dc] of [[0, 1], [0, -1], [1, 0], [-1, 0]]) {
      const k = [r + dr, c + dc].join();
      if (!cells.some(x => x.join() === k) || at.has(k)) continue;
      let n;
      if (dc === 1) n = { d: o.e, e: neg(o.d), s: o.s }; else if (dc === -1) n = { d: neg(o.e), e: o.d, s: o.s };
      else if (dr === 1) n = { d: o.s, e: o.e, s: neg(o.d) }; else n = { d: neg(o.s), e: o.e, s: o.d };
      at.set(k, n); q.push([r + dr, c + dc]);
    }
  }
  const faces = cells.map(([r, c]) => Object.assign({ r, c }, at.get([r, c].join())));
  return new Set(faces.map(f => f.d.join())).size === 6 ? faces : null;
}
function symSVG(sym, px) {
  return `<svg class="nvr-fig" viewBox="0 0 100 100" width="${px || 70}" height="${px || 70}" aria-hidden="true"><rect x="4" y="4" width="92" height="92" fill="#fffdf6" stroke="#6b5a48" stroke-width="2"/>${shapeSVG(sym, 50, 50, 24, 0, '#222')}</svg>`;
}
function netSVG(net, faces, syms, shade) {
  const S = 34, W = Math.max(...faces.map(f => f.c)) + 1, H = Math.max(...faces.map(f => f.r)) + 1;
  let h = `<svg class="nvr-fig" viewBox="0 0 ${W * S + 8} ${H * S + 8}" width="${W * S + 8}" height="${H * S + 8}" aria-hidden="true">`;
  faces.forEach((f, i) => { const x = 4 + f.c * S, y = 4 + f.r * S;
    h += `<rect x="${x}" y="${y}" width="${S}" height="${S}" fill="${i === shade ? '#f2c94c' : '#fffdf6'}" stroke="#6b5a48" stroke-width="2"/>` + shapeSVG(syms[i], x + S / 2, y + S / 2, 9, 0, '#222'); });
  return h + '</svg>';
}

/* ════════════════════════════════════════════════════════════════
   TOPICS (grouped as on Atom Learning's non-verbal reasoning)
   ════════════════════════════════════════════════════════════════ */
const GROUPS = [
  { id: 'similar', name: 'Similarities', topics: [
    ['odd', 'Odd one out', 'four figures share a rule', 'Compare the figures one feature at a time: shape, shading, number, size, small shapes, lines. Find the feature that four share.'],
    ['like', 'Most like', 'which is like these three?', 'Find what the three figures in the box have in common. Ignore what changes between them. Pick the choice that keeps the same thing.'],
  ] },
  { id: 'patterns', name: 'Series and grids', topics: [
    ['series', 'Series', 'what comes next?', 'Look at one feature at a time. Say how it changes from each figure to the next, then carry that change on.'],
    ['analogy', 'Analogies', 'A is to B as C is to ?', 'List every change from the first figure to the second. Make exactly the same changes to the third.'],
    ['matrix', 'Matrices', 'complete the grid', 'Look along each row, then down each column. Work out what changes in each direction.'],
  ] },
  { id: 'codes', name: 'Codes', topics: [
    ['code', 'Codes', 'letters stand for features', 'Find two figures that share a letter and see what else they share. Then check the other letters the same way.'],
  ] },
  { id: 'spatial', name: 'Spatial', topics: [
    ['reflect', 'Reflections', 'figure in a mirror line', 'Pick one small part of the figure and work out where it lands in the mirror. Left and right swap in a side mirror.'],
    ['rotate', 'Rotations', 'turned, not flipped', 'Turn the page in your head. Check where a small part ends up, and rule out any choice that is a mirror image.'],
    ['hidden', 'Hidden shapes', 'find the shape inside', 'Find the corners of the shape first. It must be the same size and the same way round.'],
    ['fold', 'Fold and punch', 'unfold the paper', 'Unfold the paper in your head. Each hole is copied, reflected in the fold line.'],
    ['cube', 'Cube nets', 'which face is opposite?', 'Opposite faces never touch. In a straight line of three squares, the first and third end up opposite.'],
  ] },
];
const TOPICS = {};
GROUPS.forEach(g => g.topics.forEach(([id, name, eg, how]) => TOPICS[id] = { id, group: g.id, groupName: g.name, name, eg, how }));
const ALL_TOPICS = Object.keys(TOPICS);
function chosenTopics() { const t = (SAVE.topics || ALL_TOPICS).filter(x => TOPICS[x]); return t.length ? t : ALL_TOPICS; }

let recentTopics = [];
function makeQuestion(only) {
  const list = only && only.length ? only : chosenTopics();
  for (let tries = 0; tries < 12; tries++) {
    let pool = list.filter(t => !recentTopics.includes(t));
    if (!pool.length) pool = list;
    const ws = pool.map(t => { const s = SAVE.stats['t:' + t]; return s ? Math.max(0.5, 1 + (s.w * 2 - s.r * 0.5) / Math.max(4, s.r + s.w)) : 1.2; });
    let r = Math.random() * ws.reduce((a, b) => a + b, 0), t = pool[pool.length - 1];
    for (let i = 0; i < pool.length; i++) { r -= ws[i]; if (r <= 0) { t = pool[i]; break; } }
    let q = null;
    try { q = MAKE[t](); } catch (e) { console.error(t, e); }
    if (q) {
      recentTopics.push(t); if (recentTopics.length > Math.min(2, list.length - 1)) recentTopics.shift();
      q.topic = t; q.label = TOPICS[t].name; q.how = TOPICS[t].how;
      return q;
    }
  }
  const q = MAKE.series(); q.topic = 'series'; q.label = TOPICS.series.name; q.how = TOPICS.series.how; return q;
}
function record(q, ok) { [('t:' + q.topic), q.key].filter(Boolean).forEach(k => { const s = stat(k); ok ? s.r++ : s.w++; }); persist(); }

/* ════════════════════════════════════════════════════════════════
   ANSWER CONTROLS (same calls as vr.js; choices are pictures)
   ════════════════════════════════════════════════════════════════ */
function isRight(q, sel) { return sel === q.answer; }
function answerText(q) { return `${LET[q.answer]}`; }
function answerUI(q, el, cfg) {
  const st = { q, cfg, el, sel: null, locked: false };
  el.innerHTML = `<div class="nvr-opts">${q.options.map((o, i) => `<button class="${cfg.btn} nvr-opt" data-o="${i}"><span class="${cfg.key}">${LET[i]}</span>${o}</button>`).join('')}</div>`;
  el.onclick = e => { const b = e.target.closest('[data-o]'); if (!b || st.locked || b.disabled) return; st.locked = true; cfg.onAnswer(+b.dataset.o, st); };
  return st;
}
function answerKey(st, i) { if (!st || st.locked || i >= st.q.options.length) return; const b = st.el.querySelector(`[data-o="${i}"]`); if (b && !b.disabled) b.click(); }
function answerRetry(st, el, sel) { const b = el.querySelector(`[data-o="${sel}"]`); b.classList.add('no'); b.disabled = true; st.locked = false; }
function answerReveal(st, el, sel) {
  if (sel != null && sel !== st.q.answer) { const b = el.querySelector(`[data-o="${sel}"]`); if (b) b.classList.add('no'); }
  const r = el.querySelector(`[data-o="${st.q.answer}"]`); if (r) r.classList.add('ok');
  el.querySelectorAll('[data-o]').forEach(b => { b.disabled = true; if (!b.classList.contains('ok') && !b.classList.contains('no')) b.classList.add('faded'); });
  st.locked = true;
}

/* ════════════════════════════════════════════════════════════════
   TOPIC PICKER AND AGE SETTING (same markup as vr.js)
   ════════════════════════════════════════════════════════════════ */
function ageHTML() {
  return `<div class="vr-ages">${AGES.map(a => `<button class="vr-age" data-age="${a.id}" aria-pressed="${a.id === age()}"><b>${a.label}</b><small>${a.note}</small></button>`).join('')}</div>`;
}
function pickerHTML() {
  const on = new Set(chosenTopics());
  return `<div class="vr-presets"><button class="vr-pre" data-pre="all">All topics</button>${GROUPS.map(g => `<button class="vr-pre" data-pre="${g.id}">${g.name} only</button>`).join('')}</div>
    <div class="vr-topics">${GROUPS.map(g => {
      const all = g.topics.every(t => on.has(t[0]));
      return `<div class="vr-tg"><label class="vr-tick vr-tgh"><input type="checkbox" data-grp="${g.id}" ${all ? 'checked' : ''}><span class="box"></span><span>${g.name}</span></label>
        ${g.topics.map(([id, name, eg]) => `<label class="vr-tick"><input type="checkbox" data-top="${id}" ${on.has(id) ? 'checked' : ''}><span class="box"></span><span>${name}<span class="vr-eg">${esc(eg)}</span></span></label>`).join('')}</div>`;
    }).join('')}</div>`;
}
function bindSetup(el, onChange) {
  const redraw = () => { const ap = el.querySelector('[data-slot="age"]'), tp = el.querySelector('[data-slot="topics"]'); if (ap) ap.innerHTML = ageHTML(); if (tp) tp.innerHTML = pickerHTML(); onChange && onChange(); };
  el.addEventListener('click', e => {
    const a = e.target.closest('[data-age]'); if (a) { SAVE.age = +a.dataset.age; persist(); redraw(); return; }
    const p = e.target.closest('[data-pre]');
    if (p) { SAVE.topics = p.dataset.pre === 'all' ? ALL_TOPICS.slice() : GROUPS.find(g => g.id === p.dataset.pre).topics.map(t => t[0]); persist(); redraw(); }
  });
  el.addEventListener('change', e => {
    const i = e.target; let cur = new Set(SAVE.topics || ALL_TOPICS);
    if (i.dataset.grp) GROUPS.find(g => g.id === i.dataset.grp).topics.forEach(t => i.checked ? cur.add(t[0]) : cur.delete(t[0]));
    else if (i.dataset.top) i.checked ? cur.add(i.dataset.top) : cur.delete(i.dataset.top);
    else return;
    SAVE.topics = [...cur]; persist(); redraw();
  });
  redraw();
}
function setupStatus() {
  const n = (SAVE.topics || ALL_TOPICS).filter(t => TOPICS[t]).length, a = AGES.find(x => x.id === age());
  return n ? `${a.label} · ${n} of ${ALL_TOPICS.length} topics chosen.` : `No topics ticked, so every topic will be used. ${a.label}.`;
}

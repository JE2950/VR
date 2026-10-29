// node tools/check_nvr.js [per topic per age]
// Solves every NVR puzzle again from its data, with code written separately from the generators,
// and checks: the marked answer is the only choice that fits, and the explanation matches the rule.
const fs = require('fs'), vm = require('vm'), path = require('path');
const ctx = { localStorage: { getItem: () => null, setItem: () => {} }, console, Math, JSON, Set, Map };
vm.createContext(ctx);
vm.runInContext(fs.readFileSync(path.join(__dirname, '..', 'nvr.js'), 'utf8') + '\nthis.MAKE=MAKE;this.SAVE=SAVE;this.TOPICS=TOPICS;', ctx);
const N = +process.argv[2] || 1000;

/* ── my own reading of a figure ── */
const SYMM = { circle: 1, square: 90, diamond: 90, cross: 90, hexagon: 60, pentagon: 72, star: 72, triangle: 120, arrow: 360, half: 360, flag: 360 };
const EDGES = { circle: 0, half: 1, square: 4, diamond: 4, triangle: 3, pentagon: 5, hexagon: 6, star: 10, cross: 12, arrow: 7, flag: 5 };
const norm360 = (v, m) => ((Math.round(v) % m) + m) % m;
const PRIMARY = ['shape', 'fill', 'size', 'count', 'rot', 'mark', 'mpos', 'lines'];
const BROAD = ['curved', 'shaded', 'black', 'pattern', 'marked', 'lined', 'edges', 'odd', 'diag'];
function feat(t, f) {
  switch (f) {
    case 'shape': return t.shape; case 'fill': return t.fill; case 'size': return t.size; case 'count': return t.count;
    case 'rot': return norm360(t.rot, SYMM[t.shape]); case 'mark': return t.mark; case 'mpos': return t.mark === 'none' ? 'x' : t.mpos;
    case 'lines': return t.lines; case 'curved': return ['circle', 'half'].includes(t.shape); case 'shaded': return t.fill !== 'white';
    case 'black': return t.fill === 'black'; case 'pattern': return ['stripes', 'dots'].includes(t.fill); case 'marked': return t.mark !== 'none';
    case 'lined': return t.lines > 0; case 'edges': return EDGES[t.shape]; case 'odd': return t.count % 2 === 1; case 'diag': return t.lines >= 3;
  }
}
const sig = t => PRIMARY.map(f => String(feat(t, f))).join('/');
const same = (a, b) => sig(a) === sig(b);
const ROOTS = { curved: 'shape', shaded: 'fill', black: 'fill', pattern: 'fill', marked: 'mark', lined: 'lines', edges: 'shape', odd: 'count', diag: 'lines' };

const fails = {}; let total = 0;
const fail = (t, msg, q) => { fails[t] = fails[t] || []; if (fails[t].length < 4) fails[t].push(msg + ' :: ' + q.explain.replace(/<[^>]+>/g, '').slice(0, 160)); };
const words = s => s.replace(/<[^>]+>/g, '').toLowerCase();
const FN = { white: 'white', black: 'black', grey: 'grey', stripes: 'striped', dots: 'spotted' };
const SZ = { 1: 'small', 2: 'medium', 3: 'large' };
const CORNERS = ['top left', 'top right', 'bottom right', 'bottom left'];
function phrase(f, t) {
  if (f === 'shape') return t.shape === 'half' ? 'half circle' : t.shape; if (f === 'fill') return FN[t.fill]; if (f === 'size') return SZ[t.size];
  if (f === 'count') return `${t.count} shape`; if (f === 'lines') return `${t.lines} line`; if (f === 'mark') return t.mark === 'none' ? 'no small corner' : `small ${t.mark}`;
  if (f === 'mpos') return CORNERS[t.mpos];
}

/* ── one checker per puzzle type ── */
const CHECK = {
  odd(q, d) {
    const n = d.tiles.length, picked = new Set();
    for (const f of PRIMARY.concat(BROAD)) {
      const vs = d.tiles.map(t => String(feat(t, f))), c = {}; vs.forEach(v => c[v] = (c[v] || 0) + 1);
      const ks = Object.keys(c);
      if (ks.length === 2 && ks.some(k => c[k] === 1) && ks.some(k => c[k] === n - 1)) picked.add(vs.findIndex(v => c[v] === 1) + ':' + f);
    }
    const idx = new Set([...picked].map(p => +p.split(':')[0]));
    if (d.rule === 'count=lines' || d.rule === 'mark=shape') {
      const ok = d.tiles.map(t => d.rule === 'count=lines' ? t.count === t.lines : t.mark === t.shape);
      if (idx.size) return fail('odd', `relational rule but a single feature also picks out ${[...picked]}`, q);
      if (ok.filter(x => !x).length !== 1 || ok.indexOf(false) !== q.answer) return fail('odd', 'relational rule does not pick out the answer alone', q);
      return;
    }
    // other features may only point at the answer itself, and only by the rule's own categories
    const rivals = [...picked].filter(p => { const [i, f] = p.split(':'); return +i !== q.answer || !(f === d.rule || ROOTS[f] === d.rule); });
    if (rivals.length) return fail('odd', `other features pick out: ${rivals}`, q);
    if (!idx.has(q.answer)) return fail('odd', 'rule does not pick out the answer', q);
    if (!words(q.explain).includes(phrase(d.rule, d.tiles[q.answer]))) fail('odd', `explanation does not describe the odd figure (${phrase(d.rule, d.tiles[q.answer])})`, q);
  },
  like(q, d) {
    const common = PRIMARY.concat(BROAD).filter(f => f !== 'rot' && new Set(d.ex.map(t => String(feat(t, f)))).size === 1);
    const fits = d.opts.map(t => common.every(f => String(feat(t, f)) === String(feat(d.ex[0], f))));
    if (fits.filter(Boolean).length !== 1 || !fits[q.answer]) return fail('like', `choices sharing everything the examples share: ${fits.map((x, i) => x ? i : '').join('')} (answer ${q.answer})`, q);
    for (const f of d.rules) if (!words(q.explain).includes(phrase(f, d.ex[0]))) fail('like', `explanation misses ${f}`, q);
  },
  series(q, d) {
    const shown = d.terms.map((t, i) => [i, t]).filter(([i]) => i !== d.gap);
    const pred = {};
    for (const f of ['shape', 'fill', 'size', 'count', 'rot', 'mark', 'mpos', 'lines']) {
      const P = shown.map(([i]) => i), V = shown.map(([, t]) => f === 'rot' ? norm360(t.rot, SYMM[t.shape]) : feat(t, f));
      const guesses = new Set();
      if (V.every(v => v === V[0])) guesses.add(String(V[0]));
      // steady steps (with wrap-round for corners and angles)
      const mod = f === 'mpos' ? 4 : f === 'rot' ? 360 : 0;
      if (typeof V[0] === 'number') {
        const st = (V[1] - V[0]) / (P[1] - P[0]);
        const at = i => mod ? norm360(V[0] + st * (i - P[0]), mod) : V[0] + st * (i - P[0]);
        if (Number.isInteger(st) && P.every((p, k) => at(p) === V[k])) guesses.add(String(at(d.gap)));
      }
      // repeating cycles of 2 or 3
      for (const per of [2, 3]) {
        const byRes = {}; let okc = true;
        P.forEach((p, k) => { const r = p % per; if (r in byRes && byRes[r] !== V[k]) okc = false; byRes[r] = V[k]; });
        if (okc && (d.gap % per) in byRes && !V.every(v => v === V[0])) guesses.add(String(byRes[d.gap % per]));
      }
      if (guesses.size !== 1) return fail('series', `${f}: ${guesses.size ? 'two possible answers ' + [...guesses] : 'no clear pattern'} (values ${V}, gap ${d.gap})`, q);
      pred[f] = [...guesses][0];
    }
    const match = d.opts.map(t => ['shape', 'fill', 'size', 'count', 'rot', 'mark', 'mpos', 'lines'].every(f => String(f === 'rot' ? norm360(t.rot, SYMM[t.shape]) : feat(t, f)) === pred[f]));
    if (match.filter(Boolean).length !== 1 || !match[q.answer]) fail('series', `choices matching the pattern: ${match.map((x, i) => x ? i : '').join('')} (answer ${q.answer})`, q);
    const changing = PRIMARY.filter(f => new Set(d.terms.map(t => String(feat(t, f)))).size > 1);
    const SAY = { rot: 'turns', count: 'one more shape', mpos: 'corner shape moves', fill: 'shading goes', lines: 'one more line', size: 'small, medium, large' };
    for (const f of changing) if (SAY[f] && !words(q.explain).includes(SAY[f])) fail('series', `explanation misses the change in ${f}`, q);
  },
  analogy(q, d) {
    const { A, B, C } = d, P = Object.assign({}, C);
    for (const f of ['fill', 'size', 'count', 'lines']) if (A[f] !== B[f]) { if (C[f] !== A[f]) return fail('analogy', `${f}: third figure does not start like the first, so the change is unclear`, q); P[f] = B[f]; }
    if (A.mark !== B.mark || (A.mark !== 'none' && A.mpos !== B.mpos)) { if (C.mark !== A.mark || (A.mark !== 'none' && C.mpos !== A.mpos)) return fail('analogy', 'corner shape change unclear', q); P.mark = B.mark; P.mpos = B.mpos; }
    if (A.shape !== B.shape) return fail('analogy', 'shape changes from first to second', q);
    const dr = norm360(B.rot - A.rot, 360);
    if (dr && SYMM[A.shape] < 360) return fail('analogy', 'turn of a symmetrical shape', q);
    P.rot = C.rot + dr;
    const match = d.opts.map(t => same(t, P));
    if (match.filter(Boolean).length !== 1 || !match[q.answer]) return fail('analogy', `choices matching: ${match.map((x, i) => x ? i : '').join('')} (answer ${q.answer})`, q);
    const e = words(q.explain);
    if (dr && !e.includes('turn')) fail('analogy', 'explanation misses the turn', q);
    for (const f of ['fill', 'size', 'count', 'lines']) if (A[f] !== B[f] && !e.includes(phrase(f, B))) fail('analogy', `explanation misses ${f}`, q);
    if (A.mark !== B.mark && !e.includes('corner')) fail('analogy', 'explanation misses the corner shape', q);
  },
  matrix(q, d) {
    const g = d.cells, n = g.length, P = {};
    for (const f of PRIMARY) {
      const v = (r, c) => String(feat(g[r][c], f));
      let guess;
      if (n === 2) {
        const across = v(0, 0) !== v(0, 1), down = v(0, 0) !== v(1, 0);
        if (across && down) return fail('matrix', `${f} changes both ways`, q);
        guess = across ? v(1, 0) === v(0, 0) ? v(0, 1) : null : v(1, 0);
        if (guess === null) return fail('matrix', `${f} unclear`, q);
      } else {
        const colConst = [0, 1].every(r => v(r, 2) === v(0, 2)) && [0, 1, 2].every(c => [0, 1, 2].every(r => r === 2 && c === 2 || v(r, c) === v(0, c)));
        const set0 = [0, 1, 2].map(c => v(0, c)).sort().join();
        const rowsAll = new Set([0, 1, 2].map(c => v(0, c))).size === 3 && [1].every(r => [0, 1, 2].map(c => v(r, c)).sort().join() === set0);
        if (colConst) guess = v(0, 2);
        else if (rowsAll) { const have = [v(2, 0), v(2, 1)]; const miss = [0, 1, 2].map(c => v(0, c)).filter(x => !have.includes(x)); if (miss.length !== 1) return fail('matrix', `${f} row unclear`, q); guess = miss[0]; }
        else return fail('matrix', `${f}: no row or column pattern`, q);
      }
      P[f] = guess;
    }
    const match = d.opts.map(t => PRIMARY.every(f => String(feat(t, f)) === P[f]));
    if (match.filter(Boolean).length !== 1 || !match[q.answer]) fail('matrix', `choices matching: ${match.map((x, i) => x ? i : '').join('')} (answer ${q.answer})`, q);
  },
  code(q, d) {
    const L = d.codes[0].length, ans = [];
    for (let j = 0; j < L; j++) {
      const letters = d.codes.map(c => c[j]), guesses = new Set();
      for (const f of PRIMARY.concat(BROAD)) {
        const fv = d.ex.map(t => String(feat(t, f)));
        const fits = fv.every((a, i) => fv.every((b, k) => (a === b) === (letters[i] === letters[k])));
        if (!fits) continue;
        const k = fv.indexOf(String(feat(d.test, f)));
        guesses.add(k < 0 ? '?' : letters[k]);
      }
      if (guesses.size !== 1 || guesses.has('?')) return fail('code', `letter ${j + 1}: ${[...guesses]}`, q);
      ans.push([...guesses][0]);
    }
    const right = ans.join(''), got = words(q.options[q.answer]).toUpperCase();
    if (got !== right) fail('code', `worked out ${right}, marked ${got}`, q);
    if (q.options.filter(o => words(o).toUpperCase() === right).length !== 1) fail('code', 'answer appears twice', q);
    if (!q.explain.includes(right)) fail('code', 'explanation gives a different code', q);
  },
  reflect(q, d) {
    const key = f => f.map(e => e.t + e.f + (e.t === 'circ' ? e.c.map(Math.round) : e.p.map(p => p.map(Math.round).join(':')).sort().join('_'))).sort().join('|');
    const flip = f => f.map(e => e.t === 'circ' ? { ...e, c: d.horiz ? [e.c[0], 100 - e.c[1]] : [100 - e.c[0], e.c[1]] } : { ...e, p: e.p.map(([x, y]) => d.horiz ? [x, 100 - y] : [100 - x, y]) });
    const want = key(flip(d.fig)), match = d.opts.map(o => key(o) === want);
    if (match.filter(Boolean).length !== 1 || !match[q.answer]) fail('reflect', `choices matching the mirror image: ${match.map((x, i) => x ? i : '').join('')}`, q);
    if (d.horiz === /down the side/.test(q.explain)) fail('reflect', 'explanation names the wrong mirror line', q);
  },
  rotate(q, d) {
    const key = f => f.map(e => e.t + e.f + (e.t === 'circ' ? e.c.map(Math.round) : e.p.map(p => p.map(Math.round).join(':')).sort().join('_'))).sort().join('|');
    const turn = (f, k) => { let r = f; for (let i = 0; i < k; i++) r = r.map(e => e.t === 'circ' ? { ...e, c: [100 - e.c[1], e.c[0]] } : { ...e, p: e.p.map(([x, y]) => [100 - y, x]) }); return r; };
    const turns = [1, 2, 3].map(k => key(turn(d.fig, k))), all = [0, 1, 2, 3].map(k => key(turn(d.fig, k)));
    const match = d.opts.map(o => all.includes(key(o)));
    if (match.filter(Boolean).length !== 1 || !match[q.answer]) return fail('rotate', `choices that are turns: ${match.map((x, i) => x ? i : '').join('')}`, q);
    const k = turns.indexOf(key(d.opts[q.answer])) + 1, e = words(q.explain);
    const want = k === 2 ? 'half way' : k === 1 ? 'clockwise' : 'anticlockwise';
    if (!e.includes(want) || (k === 1 && e.includes('anticlockwise'))) fail('rotate', `explanation should say ${want}`, q);
  },
  hidden(q, d) {
    const nk = s => { const mx = Math.min(...s.map(p => p[0])), my = Math.min(...s.map(p => p[1])); return s.map(([x, y]) => `${x - mx},${y - my}`).sort().join(' '); };
    const match = d.shapes.map(s => nk(s) === nk(d.tgt));
    if (match.filter(Boolean).length !== 1 || !match[q.answer]) fail('hidden', `choices hiding the same shape: ${match.map((x, i) => x ? i : '').join('')}`, q);
  },
  fold(q, d) {
    const cells = [], see = (r, c) => ({ L: c > 1, R: c < 2, T: r > 1, B: r < 2, D: r > c, LT: r > 1 && c > 1, RB: r < 2 && c < 2 })[d.kind];
    for (const h of d.holes) { const r = Math.floor(h / 4), c = h % 4; if (!see(r, c)) return fail('fold', `hole ${h} is not on the folded paper`, q); cells.push([r, c]); }
    let out = cells.slice();
    const mirrorCols = a => a.concat(a.map(([r, c]) => [r, 3 - c])), mirrorRows = a => a.concat(a.map(([r, c]) => [3 - r, c])), mirrorDiag = a => a.concat(a.map(([r, c]) => [c, r]));
    if ('LR'.includes(d.kind) && d.kind.length === 1) out = mirrorCols(out); else if ('TB'.includes(d.kind) && d.kind.length === 1) out = mirrorRows(out);
    else if (d.kind === 'D') out = mirrorDiag(out); else out = mirrorCols(mirrorRows(out));
    const want = [...new Set(out.map(([r, c]) => r * 4 + c))].sort((a, b) => a - b).join();
    const match = d.opts.map(o => [...new Set(o)].sort((a, b) => a - b).join() === want);
    if (match.filter(Boolean).length !== 1 || !match[q.answer]) fail('fold', `choices matching the unfolded paper: ${match.map((x, i) => x ? i : '').join('')}`, q);
  },
  cube(q, d) {
    // roll a die across the net and note which side of the die lands on each square
    const cells = d.faces.map(f => [f.r, f.c]), on = new Map(), queue = [0];
    on.set(0, { bottom: 'B', top: 'T', n: 'N', s: 'S', e: 'E', w: 'W' });
    while (queue.length) {
      const i = queue.shift(), die = on.get(i), [r, c] = cells[i];
      cells.forEach(([r2, c2], j) => {
        if (on.has(j) || Math.abs(r2 - r) + Math.abs(c2 - c) !== 1) return;
        const x = Object.assign({}, die);
        if (c2 === c + 1) Object.assign(x, { bottom: die.e, e: die.top, top: die.w, w: die.bottom });
        if (c2 === c - 1) Object.assign(x, { bottom: die.w, w: die.top, top: die.e, e: die.bottom });
        if (r2 === r + 1) Object.assign(x, { bottom: die.s, s: die.top, top: die.n, n: die.bottom });
        if (r2 === r - 1) Object.assign(x, { bottom: die.n, n: die.top, top: die.s, s: die.bottom });
        on.set(j, x); queue.push(j);
      });
    }
    const side = cells.map((_, i) => on.get(i).bottom), OPP = { B: 'T', T: 'B', N: 'S', S: 'N', E: 'W', W: 'E' };
    if (new Set(side).size !== 6) return fail('cube', 'net does not fold into a cube', q);
    const opp = side.indexOf(OPP[side[d.pick]]);
    if (d.choices[q.answer] !== opp) return fail('cube', `opposite should be face ${opp} (${d.syms[opp]}), marked face ${d.choices[q.answer]}`, q);
    const sym = d.syms[opp];
    if (!words(q.explain).includes(sym)) fail('cube', 'explanation names the wrong face', q);
  },
};

for (const age of [4, 5, 6]) {
  ctx.SAVE.age = age;
  for (const t of Object.keys(ctx.TOPICS)) for (let i = 0; i < N; i++) {
    const q = ctx.MAKE[t](); if (!q) { fail(t, 'no question', { explain: '' }); continue; }
    total++;
    if (!q.data) { fail(t, 'no data to check', q); continue; }
    try { CHECK[q.data.type](q, q.data); } catch (e) { fail(t, 'checker error ' + e.message, q); }
  }
}
const bad = Object.keys(fails);
console.log(`${total} puzzles checked.`);
for (const t of bad) { console.log(`\n${t}:`); fails[t].forEach(m => console.log('  ' + m)); }
console.log(bad.length ? `\nProblems in: ${bad.join(', ')}` : '\nEvery answer and explanation checked out.');
process.exit(bad.length ? 1 : 0);

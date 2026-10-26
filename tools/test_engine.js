// node tools/test_engine.js [samples]  — generates questions for every topic and age and checks them
const fs = require('fs'), vm = require('vm'), path = require('path');
const root = path.join(__dirname, '..');
const ctx = { localStorage: { getItem: () => null, setItem: () => {} }, console, Math, JSON, Set, Map, Number, String, Array, Object };
vm.createContext(ctx);
vm.runInContext(fs.readFileSync(path.join(root, 'bank.js'), 'utf8') + '\n' + fs.readFileSync(path.join(root, 'vr.js'), 'utf8') +
  '\nthis.MAKE=MAKE;this.SAVE=SAVE;this.TOPICS=TOPICS;this.makeQuestion=makeQuestion;this.nOpts=nOpts;this.answerText=answerText;', ctx);
const N = +process.argv[2] || 400, show = process.argv[3];
let bad = 0;
const strip = h => h.replace(/<span class="vr-abc">.*?<\/span><\/span>|<span class="vr-abc">[\s\S]*$/g, '').replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&quot;/g, '"');
for (const age of [4, 5, 6]) {
  ctx.SAVE.age = age;
  for (const t of Object.keys(ctx.TOPICS)) {
    let nulls = 0;
    for (let i = 0; i < N; i++) {
      const q = ctx.makeQuestion([t]);
      const err = m => { bad++; if (bad < 40) console.log(`BAD ${age} ${t}: ${m}`, JSON.stringify(q).slice(0, 300)); };
      if (q.topic !== t) { nulls++; continue; }
      const txt = q.prompt + q.explain;
      if (/undefined|NaN|null|\[object/.test(txt)) err('bad text');
      if (q.kind === 'mc') {
        const n = q.options.length;
        if (!(t === 'deduce' ? n >= 3 : n === ctx.nOpts())) err('option count ' + n);
        if (new Set(q.options).size !== n) err('dupe options');
        if (!(q.answer >= 0 && q.answer < n)) err('answer index');
        if (q.options.some(o => o === '' || o == null || /NaN|undefined/.test(o))) err('empty option');
      } else if (q.kind === 'pair') {
        if (q.groups.length !== 2 || q.groups.some(g => g.length !== 3)) err('groups');
        if (new Set(q.groups.flat()).size !== 6) err('dupe group words');
        if (q.answer.some((a, g) => !(a >= 0 && a < 3))) err('pair answer');
      } else if (q.kind === 'two') {
        if (q.options.length !== 5 || new Set(q.options).size !== 5) err('two options');
        if (q.answer.length !== 2 || q.answer[0] === q.answer[1]) err('two answer');
      } else err('kind');
    }
    if (nulls) { bad++; console.log(`FALLBACK ${age} ${t}: ${nulls}/${N} fell back to synonyms`); }
    if (show && (show === 'all' || show === t)) {
      for (let i = 0; i < 3; i++) { const q = ctx.makeQuestion([t]); console.log(`\n[Y${age} ${t}] ${strip(q.prompt)}\n   ${q.kind === 'mc' ? q.options.join(' | ') : q.kind === 'pair' ? q.groups.map(g => '(' + g.join(', ') + ')').join(' ') : q.options.join(' | ')}\n   ANSWER: ${ctx.answerText(q)}\n   ${strip(q.explain)}`); }
    }
  }
}
console.log(bad ? `${bad} problems` : 'all questions well formed');
process.exit(bad ? 1 : 0);

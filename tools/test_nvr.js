// node tools/test_nvr.js [samples] — makes NVR questions for every topic and age and checks them
const fs = require('fs'), vm = require('vm'), path = require('path');
const ctx = { localStorage: { getItem: () => null, setItem: () => {} }, console, Math, JSON, Set, Map };
vm.createContext(ctx);
vm.runInContext(fs.readFileSync(path.join(__dirname, '..', 'nvr.js'), 'utf8') + '\nthis.MAKE=MAKE;this.SAVE=SAVE;this.TOPICS=TOPICS;this.nOpts=nOpts;', ctx);
const N = +process.argv[2] || 300; let bad = 0;
for (const age of [4, 5, 6]) {
  ctx.SAVE.age = age;
  for (const t of Object.keys(ctx.TOPICS)) {
    let nulls = 0, ms = 0; const t0 = Date.now();
    for (let i = 0; i < N; i++) {
      const q = ctx.MAKE[t]();
      if (!q) { nulls++; continue; }
      const strip = s => s.replace(/id="[^"]*"/g, '').replace(/(st|dt|n)\d+/g, '$1');
      if (q.options.length !== ctx.nOpts()) { bad++; if (bad < 20) console.log('count', age, t, q.options.length); }
      if (new Set(q.options.map(strip)).size !== q.options.length && t !== 'hidden') { bad++; if (bad < 20) console.log('dupe', age, t); }
      if (!(q.answer >= 0 && q.answer < q.options.length)) { bad++; console.log('answer', age, t); }
      if (/undefined|NaN/.test(q.prompt + q.explain + q.options.join(''))) { bad++; if (bad < 20) console.log('text', age, t, (q.prompt + q.explain).slice(0, 200)); }
    }
    ms = (Date.now() - t0) / N;
    console.log(`Y${age} ${t.padEnd(8)} failed ${String(nulls).padStart(3)}/${N}  ${ms.toFixed(1)} ms`);
    if (nulls > N * 0.02) bad++;
  }
}
console.log(bad ? bad + ' problems' : 'all NVR questions well formed'); process.exit(bad ? 1 : 0);

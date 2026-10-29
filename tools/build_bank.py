"""Builds bank.js: the word-building and word-finding questions for the VR games.

Run:  pip install wordfreq english-words
      python3 tools/build_bank.py

Every question is checked against a large dictionary so that it has exactly one
right answer. Each item gets a level (4, 5 or 6) from how common its words are,
which the Year 4 / Year 5 / Year 6+ setting uses.
"""
import json, random, re, os
from itertools import product
from wordfreq import zipf_frequency, top_n_list
from english_words import get_english_words_set
from nltk.corpus import wordnet as wn, stopwords
STOP = set(stopwords.words('english'))
NAMES = set('''peter chad lam tam tat taj sis bro ma pa mam jon ted tate rana singh dee pst mon ara lai sam ben tom tim jim bob rob
joe ann anne jan feb mar apr jun jul aug sep sept oct nov dec mrs mr ms dr st rd th co inc ltd etc ok yeah hmm nope gonna wanna gotta
kinda sorta dunno gotta ya yo chi wright mom moms neo col rep yea sol bam atm ira tor tae dal mig zee pug che sis tee mod sup wen deb dar dos ide alt tau mel gee lad dementia cancer tumour coffin funeral marc rick khan dong raj cole coca hart vale sue jean nick pic bill ali abe mac ram fry gill eve lee dale rob pat lou aint isnt dont wont cant didnt doesnt wasnt hadnt shouldnt id im ive ill youre theyre hes shes thats whats lets'''.split())
_lem = {}
def is_lemma(w):
    if w not in _lem:
        _lem[w] = any(l.name() == w for s in wn.synsets(w) for l in s.lemmas())
    return _lem[w]
def is_form(w):
    if is_lemma(w) or w in STOP: return True
    m = wn.morphy(w)
    return bool(m) and m != w and is_lemma(m)

random.seed(2026)
HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, '..', 'bank.js')
ABC = 'abcdefghijklmnopqrstuvwxyz'

BLOCK = set('''sex sexy damn hell kill killer drug drugs gun guns nude porn bum butt crap piss fart shit fuck cock dick tit tits ass arse
bitch slut whore rape nazi gay drunk beer wine booze vodka gin rum pub bar bra pee poo poop puke vomit dead die died death kills
corpse grave murder suicide knife stab bomb war weed pot hash smoke lust strip stripper bloody bastard twat wank prick piss
fag hag hoe ho cum jizz anal sperm penis bust bong spunk tart turd wee nob knob pussy cocks dicks pervert crack meth heroin coke
satan devil demon dope raped rapes raping rapist orgasm orgasms condom abortion cocaine sexual sexist breast breasts nipple prostitute junkie stoned bloodshed drown drowned torture massacre terror terrorist hostage weapon weapons hate sin pig hog idiot moron stupid dumb fat ugly obese slave lynch hang shot shoot rifle pistol ammo
bomber nuke virgin lesbian homo trans queer kinky orgy erotic hump bang horny naked bed? sod bugger slag tramp'''.replace('?', '').split())

web2 = get_english_words_set(['web2'], lower=False)
WEB = {w for w in web2 if w.isalpha() and w.islower()}
BIG = set(WEB)
for w in top_n_list('en', 200000):
    if w.isalpha() and w.isascii():
        BIG.add(w.lower())

Z = {}
def zf(w):
    if w not in Z:
        Z[w] = zipf_frequency(w, 'en')
    return Z[w]

def level(w):
    z = zf(w)
    if z >= 4.4: return 4
    if z >= 3.9: return 5
    if z >= 3.4: return 6
    return None

ROOTS = ('sex', 'porn', 'orgas', 'condom', 'penis', 'vagin', 'nipple', 'genital', 'prostitut', 'cocain', 'suicid', 'murder', 'fuck',
         'shit', 'cunt', 'bitch', 'whore', 'slut', 'nazi', 'bastard', 'masturb', 'erotic', 'dildo', 'herpes', 'kill', 'rapist', 'boob', 'drunk')
def bad(w):
    return w in BLOCK or w in NAMES or any(r in w for r in ROOTS)

def ok(w, lv=6):
    """A word we are happy to show as an answer: an ordinary dictionary word, not a name."""
    if bad(w) or len(w) < 2: return False
    l = level(w)
    return l is not None and l <= lv and is_form(w)

def real(w):
    """A word a pupil might reasonably count as a word (used to rule out second answers)."""
    return w not in NAMES and (w in STOP or (zf(w) >= 3.0 and is_form(w)))

def lv_of(*ws):
    return max(level(w) for w in ws)

POOL = {w for w in BIG if 2 <= len(w) <= 10 and w.isalpha()}
CANDIDATES = sorted({w for w in POOL if ok(w)}, key=lambda w: -zf(w))
by_len = {}
for w in CANDIDATES:
    by_len.setdefault(len(w), []).append(w)
print('answer words:', len(CANDIDATES))

bank = {}

# ── HIDDEN WORDS: a four-letter word across the end of one word and the start of the next
def hidden_in(sentence):
    words = re.findall(r"[a-z]+", sentence.lower())
    found = set()
    for a, b in zip(words, words[1:]):
        for k in (1, 2, 3):
            if len(a) >= k and len(b) >= 4 - k:
                found.add(a[-k:] + b[:4 - k])
    return found

hidden = []
for line in open(os.path.join(HERE, 'hidden_sentences.txt')):
    s = line.strip()
    if not s or s.startswith('#'): continue
    cands = hidden_in(s)
    realw = [w for w in cands if real(w)]
    good = [w for w in realw if ok(w, 5)]
    good = [g for g in good if sum(1 for h in hidden if h['a'] == g) < 2]
    if good:
        # several words may be hidden; only one of them is offered as an option
        w = sorted(good, key=lambda g: (sum(1 for h in hidden if h['a'] == g), -zf(g)))[0]
        flat = re.sub('[^a-z]', '', s.lower())
        pool = [x for x in by_len[4] if x not in flat and x not in cands and x != w and level(x) <= max(5, level(w)) and is_lemma(x)]
        # distractors that share a letter with the answer look more tempting
        pool.sort(key=lambda x: -len(set(x) & set(w)) + random.random() * 2)
        # every pair of neighbouring words that hides any real word, so wrong pairs can avoid them
        ws_ = re.findall(r"[a-z]+", s.lower())
        busy = [i for i, (a_, b_) in enumerate(zip(ws_, ws_[1:])) if any(real(a_[-k:] + b_[:4 - k]) for k in (1, 2, 3) if len(a_) >= k and len(b_) >= 4 - k)]
        hidden.append({'s': s, 'a': w, 'd': pool[:6], 'x': busy, 'lv': level(w)})
bank['hidden'] = hidden
print('hidden', len(hidden))

# ── MISSING THREE LETTERS: a three-letter word completes the word in capitals
three = [w for w in by_len[3] if is_lemma(w) or w in STOP]
three_all = [w for w in BIG if len(w) == 3]
missing = []
for w in CANDIDATES:
    if not (5 <= len(w) <= 8) or level(w) is None or not is_lemma(w): continue
    for i in range(1, len(w) - 2):
        part = w[i:i + 3]
        if part not in three: continue
        fits = [t for t in three_all if (w[:i] + t + w[i + 3:]) in BIG]
        if fits != [part] and sorted(set(fits)) != [part]: continue
        lv = lv_of(w, part)
        pool = [t for t in three if t != part and (w[:i] + t + w[i + 3:]) not in BIG and zf(t) >= 4.0 and not bad(t)]
        pool.sort(key=lambda t: random.random())
        missing.append({'w': w, 'i': i, 'a': part, 'd': pool[:6], 'lv': lv})
        break
random.shuffle(missing)
bank['missing3'] = missing[:400]
print('missing3', len(missing))

# ── ONE LETTER COMPLETES BOTH PAIRS: lea (?) ight and ste (?) ast
starts, ends = {}, {}
for w in CANDIDATES:
    if 3 <= len(w) <= 5 and level(w) <= 5:
        ends.setdefault(w[-1], []).append(w)
        starts.setdefault(w[0], []).append(w)
pairs = []
for L in ABC:
    E, S = ends.get(L, []), starts.get(L, [])
    if len(E) < 3 or len(S) < 3: continue
    for _ in range(40):
        a, c = random.sample(E, 2)
        b, d = random.sample(S, 2)
        frags = (a[:-1], b[1:], c[:-1], d[1:])
        if min(len(f) for f in frags) < 2: continue
        works = [x for x in ABC if all(w in BIG for w in (frags[0] + x, x + frags[1], frags[2] + x, x + frags[3]))]
        if works != [L]: continue
        pairs.append({'f': frags, 'a': L, 'w': [a, b, c, d], 'lv': lv_of(a, b, c, d)})
        if sum(1 for p in pairs if p['a'] == L) >= 12: break
random.shuffle(pairs)
bank['letterpair'] = pairs
print('letterpair', len(pairs))

# ── JOINING WORDS (compound words): (foot, hand, ear) (ball, ring, bag)
parts = [w for w in CANDIDATES if 3 <= len(w) <= 6 and level(w) <= 5]
pset = set(parts)
SUFFIX = set('ing ed ted er ers est ly ness less ful ion ions ment able ate ates ant ent ance ence ish ism ist ous ive age ages ory ery'.split())
comps = []
for w in CANDIDATES:
    if not (6 <= len(w) <= 10) or not is_lemma(w): continue
    for i in range(3, len(w) - 2):
        a, b = w[:i], w[i:]
        if b in SUFFIX or not (is_lemma(a) and is_lemma(b)): continue
        if a in pset and b in pset and zf(a) >= 3.9 and zf(b) >= 3.9:
            comps.append((w, a, b))
            break
joins = []
firsts = list({a for _, a, _ in comps} | set(random.sample(parts, 120)))
seconds = list({b for _, _, b in comps} | set(random.sample(parts, 120)))
for w, a, b in comps:
    for _ in range(30):
        g1 = [a] + random.sample([x for x in firsts if x != a], 2)
        g2 = [b] + random.sample([x for x in seconds if x != b], 2)
        if len(set(g1 + g2)) < 6: continue
        if any((x + y) in BIG for x, y in product(g1, g2) if (x, y) != (a, b)): continue
        if any((x + '-' + y) in BIG for x, y in product(g1, g2)): continue
        joins.append({'g1': g1, 'g2': g2, 'a': [a, b], 'w': w, 'lv': lv_of(w, a, b)})
        break
random.shuffle(joins)
bank['joining'] = joins
print('joining', len(joins))

# ── MORPHING WORDS (one letter at a time): CASE  [?]  LOST style, one word in the middle
morph = []
for n in (3, 4):
    words = [w for w in by_len[n] if level(w) <= 6 and (is_lemma(w) or w in STOP)]
    wset = set(words)
    random.shuffle(words)
    for w1 in words[:900]:
        found = []
        for i in range(n):
            for j in range(i + 1, n):
                for x in ABC:
                    if x == w1[i]: continue
                    for y in ABC:
                        if y == w1[j]: continue
                        w3 = w1[:i] + x + w1[i + 1:j] + y + w1[j + 1:]
                        if w3 not in wset: continue
                        m1 = w1[:i] + x + w1[i + 1:]
                        m2 = w1[:j] + y + w1[j + 1:]
                        valid = [m for m in (m1, m2) if m in BIG or real(m)]
                        if len(valid) != 1 or not ok(valid[0]): continue
                        found.append((w3, valid[0]))
        if not found: continue
        w3, mid = random.choice(found)
        # wrong answers: real words one letter away from the first word, but not one letter from the last
        near = [c for c in words if c not in (w1, w3, mid) and level(c) <= 5 and sum(p != q for p, q in zip(c, w1)) == 1
                and sum(p != q for p, q in zip(c, w3)) != 1]
        if len(near) < 4: continue
        random.shuffle(near)
        morph.append({'w1': w1, 'w3': w3, 'a': mid, 'd': near[:6], 'lv': lv_of(w1, w3, mid)})
random.shuffle(morph)
seen = set(); mm = []
for m in morph:
    k = (m['w1'], m['w3'])
    if k in seen or (m['w3'], m['w1']) in seen: continue
    seen.add(k); mm.append(m)
bank['morph'] = mm[:400]
print('morph', len(mm))

# ── TRANSFERRING LETTERS: move one letter from the first word to the second
trans = []
first = [w for w in CANDIDATES if 4 <= len(w) <= 6 and is_lemma(w)]
second = [w for w in CANDIDATES if 3 <= len(w) <= 5 and is_lemma(w)]
random.shuffle(first)
for w1 in first[:1600]:
    for w2 in random.sample(second, 40):
        if w2 == w1: continue
        works = {}
        for i, L in enumerate(w1):
            r1 = w1[:i] + w1[i + 1:]
            if r1 not in BIG: continue
            for j in range(len(w2) + 1):
                r2 = w2[:j] + L + w2[j:]
                if r2 in BIG:
                    works.setdefault(L, []).append((r1, r2))
        if len(works) != 1: continue
        L, res = next(iter(works.items()))
        res = [(a, b) for a, b in res if ok(a) and ok(b)]
        if len({r for r in res}) != 1: continue
        r1, r2 = res[0]
        trans.append({'w1': w1, 'w2': w2, 'a': L, 'r': [r1, r2], 'lv': lv_of(w1, w2, r1, r2)})
        break
random.shuffle(trans)
bank['transfer'] = trans[:400]
print('transfer', len(trans))

# ── JUMBLED WORDS: unscramble the word in capitals
jw = []
sig = {}
for w in BIG:
    sig.setdefault(''.join(sorted(w)), []).append(w)
for line in open(os.path.join(HERE, 'jumbled_words.txt')):
    s = line.strip()
    m = re.search(r'\[(\w+)\]', s)
    if not s or s.startswith('#') or not m: continue
    w = m.group(1).lower()
    others = [x for x in by_len.get(len(w), []) if x != w and ''.join(sorted(x)) != ''.join(sorted(w)) and level(x) <= 5 and is_lemma(x)]
    random.shuffle(others)
    others.sort(key=lambda x: -sum(min(x.count(c), w.count(c)) for c in set(x)))
    jw.append({'s': s, 'a': w, 'd': others[:8], 'lv': level(w) or 6})
bank['jumbled'] = jw
print('jumbled', len(jw))

# ── JUMBLED SENTENCES: which word is not needed?
js = []
for line in open(os.path.join(HERE, 'jumbled_sentences.txt')):
    if '|' not in line or line.startswith('#'): continue
    s, e = [x.strip() for x in line.split('|')]
    js.append({'s': s, 'x': e, 'lv': 4 if len(s.split()) <= 6 else 5 if len(s.split()) <= 7 else 6})
bank['jumsent'] = js
print('jumsent', len(js))


# ── NUMBER CODES (GL style): four words, three codes in a random order; work out the missing code
from itertools import permutations
w4 = [w for w in by_len[4] if level(w) <= 5 and is_lemma(w) and len(set(w)) == 4]
letters_of = {w: set(w) for w in w4}
numcodes = []
random.shuffle(w4)
for base in w4:
    L = set(base)
    group = [x for x in w4 if x != base and len(set(x) | L) <= 6]
    if len(group) < 3: continue
    for _ in range(80):
        others = random.sample(group, 3)
        words = [base] + others
        allL = sorted(set(''.join(words)))
        if len(allL) > 6: continue
        digits = random.sample('123456789', len(allL))
        code = {c: d for c, d in zip(allL, digits)}
        enc = lambda w: ''.join(code[c] for c in w)
        ask = random.choice(words)
        shown = [w for w in words if w != ask] if random.random() < 0.5 else random.sample(words, 3)
        codes = [enc(w) for w in shown]
        random.shuffle(codes)
        # every way of matching the three codes to three of the four words
        answers = set()
        for chosen in permutations(words, 3):
            m = {}; good = True
            for w, c in zip(chosen, codes):
                for a, b in zip(w, c):
                    if m.setdefault(a, b) != b: good = False
            if not good or len(set(m.values())) != len(m): continue
            if not all(c in m for c in ask): good = False
            if good: answers.add(''.join(m[c] for c in ask))
            else: answers.add(None)
        if answers != {enc(ask)}: continue
        shown_pairs = sorted([[w, enc(w)] for w in shown], key=lambda x: codes.index(x[1]))
        numcodes.append({'w': words, 'c': codes, 'q': ask, 'a': enc(ask), 'm': shown_pairs, 'lv': lv_of(*words)})
        break
random.shuffle(numcodes)
bank['numcode'] = numcodes[:300]
print('numcode', len(numcodes))

# a list of common words for codes, alphabet questions and fillers
bank['codewords'] = {str(n): [w for w in by_len[n] if level(w) <= 5 and is_lemma(w)][:300] for n in (3, 4, 5)}
bank['codelv'] = {w: level(w) for n in (3, 4, 5) for w in bank['codewords'][str(n)]}

with open(OUT, 'w') as f:
    f.write('/* Made by tools/build_bank.py. Every item has been checked for one right answer. Do not edit by hand. */\n')
    f.write('const BANK = ' + json.dumps(bank, separators=(',', ':')) + ';\n')
print('wrote', OUT, os.path.getsize(OUT) // 1024, 'KB')

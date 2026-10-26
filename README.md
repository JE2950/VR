# Station Zero

A space escape room for ISEB / GL-style **verbal reasoning**, for Years 4 to 6+. COGITO, the station computer, has sealed Station Zero. Every lock asks a reasoning question.

Open `index.html` in a browser. No install needed.

## Modes
- **Mission** (`index.html`): six modules (crew quarters, garden, engineering, observatory, cargo hold, the bridge). Oxygen tanks are your lives, stars are your score, and COGITO is the final duel. Progress saves in the browser.
- **Quick Fire**: against the clock (90 s Year 4, 75 s Year 5, 60 s Year 6+). Combos add time; wrong answers cost 2 seconds.
- **3D Station** (`station3d.html`): walk the station in first person, Minecraft style. Five modules with six locked items each, Sprocket the robot following you, then a six-question logic duel with COGITO on the bridge and a dash to the escape pod. At least 36 questions a game. WASD and mouse, or the on-screen stick on a tablet. Built on the voxel engine from the Enchanted Block Tower (VOCAB repo).
- **Training Manual**: every question type with an example, the method, your record so far, and a **Practise** button that runs one topic on its own.

Each module leans on one group of topics (crew quarters = vocabulary, garden = finding and building words, engineering = codes and sequences, observatory = logic, cargo hold and bridge = everything ticked). If that group isn't ticked, the module uses whatever is.

## Age setting
- **Year 4**: 4 choices, the most common words, small numbers, simple one-step codes and sequences, alphabet strip shown.
- **Year 5**: 5 choices, harder words, mixed steps, alphabet strip shown.
- **Year 6+**: 5 choices, pre-test and 11+ vocabulary, two-step rules (growing gaps, mirror codes, interleaved sequences, GL four-word number codes). No alphabet strip.

## Topics (grouped as on Atom Learning)
- **Vocabulary**: synonyms, synonym pairs, antonyms, antonym pairs, homonyms, odd ones out, spot the connection, definitions, choose the word
- **Finding words**: hidden words, jumbled words, jumbled sentences, anagrams, complete the sentence, stolen words
- **Building words**: joining words, morphing words, transferring letters, missing letters, find the link, word rules, rearrange letters
- **Codes and sequences**: alphabet positions, letter sequences, letter connections, number sequences, letter codes, number codes, symbol codes
- **Logic**: statement logic, deductions, letters for numbers, related numbers, complete the sum, ordering words, number logic, substitutions

## Hand-entered questions
`atom.js` holds 187 questions entered from the Atom Learning sets (Combined-Verbal-Reasoning.xlsx). About a third of the questions in a topic come from this bank when it has questions at the chosen age. Definitions, choose the word, anagrams, complete the sentence, stolen words, word rules, rearrange letters, symbol codes, ordering words, number logic and substitutions use this bank alone. To add a question, copy a line in `atom.js` and change it; `a` is the answer exactly as written in the choices.

Left out from the spreadsheet: five questions lost to a browser timeout, one anagram with no letters, and two rearrange-letters questions without their word sets. Fixed: the PEACE code (E had two numbers; now 12762) and the rain + ? question (shower swapped for puddle, as rainshower is also a word). The souvenir question has new written options in place of the missing pictures.

Every question shows the method on request (**How?** or the H key) and explains the answer afterwards. Topics a pupil gets wrong come back more often, in both games.

## Files
- `vr.js`: the question engine, vocabulary lists, topic picker and answer controls (shared by both games).
- `atom.js`: the hand-entered question bank.
- `bank.js`: word puzzles checked against a dictionary so each has one right answer. Do not edit by hand.
- `tools/build_bank.py`: rebuilds `bank.js` (`pip install wordfreq english-words nltk`, plus the NLTK `wordnet` and `stopwords` data). Add sentences to `tools/hidden_sentences.txt`, `jumbled_words.txt` or `jumbled_sentences.txt` and re-run it.
- `tools/test_engine.js`: `node tools/test_engine.js 400` makes 400 questions per topic at each age and checks every one. `node tools/test_engine.js 3 all` prints examples to read.

To change vocabulary, edit the lists at the top of `vr.js` (`SYN_RAW`, `ANT_RAW`, `CAT_RAW`, `HOMO_RAW`, `REL_RAW`). Each line carries a level (4, 5 or 6).

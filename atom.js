/* ════════════════════════════════════════════════════════════════
   Hand-entered question bank (from Combined-Verbal-Reasoning.xlsx,
   Atom Learning sets 1 and 2). Each item:
     t: topic id · lv: 4 / 5 / 6 · p: instruction · s: line shown in a box (optional)
     o: choices (mc / two) · g: two groups (pair) · a: the answer as written in o / g
   Questions mix into their topic alongside the generated ones; topics that
   only exist here (Definitions, Stolen words, Symbol codes …) use these alone.
   ════════════════════════════════════════════════════════════════ */
const ATOM = [
  /* ── Odd ones out ── */
  { t: 'odd2', lv: 5, p: 'Four of these are connected. Which one does not fit?', o: ['full stop', 'sentence', 'speech mark', 'exclamation mark', 'comma'], a: 'sentence', e: 'Full stop, speech mark, exclamation mark and comma are punctuation marks. A sentence is not.' },
  { t: 'odd2', lv: 5, p: 'Four of these words are connected. Which one does not fit?', o: ['increase', 'raise', 'grow', 'build', 'shrink'], a: 'shrink', e: 'The others mean getting bigger or higher. Shrink means getting smaller.' },
  { t: 'odd2', lv: 5, p: 'Which <b>two</b> words do not fit with the rest?', o: ['jazz', 'rock', 'stone', 'sing', 'pop'], a: ['stone', 'sing'], e: 'Jazz, rock and pop are kinds of music. Rock can also mean stone, but that is not the link here.' },
  { t: 'odd2', lv: 5, p: 'Four of these words are connected. Which one does not fit?', o: ['respond', 'reply', 'return', 'ask', 'answer'], a: 'ask', e: 'The others mean giving a response. Asking makes someone else respond.' },
  { t: 'odd2', lv: 5, p: 'Which <b>two</b> words do not fit with the rest?', o: ['railway', 'under', 'over', 'finished', 'ended'], a: ['railway', 'under'], e: 'Over, finished and ended can all mean that something has stopped.' },
  { t: 'odd2', lv: 6, p: 'Which <b>two</b> words do not fit with the rest?', o: ['prepared', 'darn', 'prepare', 'gird', 'ready'], a: ['prepared', 'darn'], e: 'Ready, prepare and gird can all be verbs meaning to get ready for action. Prepared is past tense; darn means to mend.' },
  { t: 'odd2', lv: 6, p: 'Which <b>two</b> words do not fit with the rest?', o: ['acute', 'obtuse', 'oblivious', 'ignorant', 'insecure'], a: ['acute', 'insecure'], e: 'Obtuse, oblivious and ignorant describe someone who does not know or notice. Acute means sharp or perceptive.' },
  { t: 'odd2', lv: 6, p: 'Which <b>two</b> words do not fit with the rest?', o: ['braised', 'vulgar', 'craggy', 'crude', 'coarse'], a: ['braised', 'craggy'], e: 'Vulgar, crude and coarse can all mean rude or lacking taste. Braised is a way of cooking; craggy means rough and rocky.' },
  { t: 'odd2', lv: 6, p: 'Which <b>two</b> words do not fit with the rest?', o: ['unquestionable', 'unequivocal', 'empathetic', 'equivocal', 'emphatic'], a: ['empathetic', 'equivocal'], e: 'Unquestionable, unequivocal and emphatic leave no room for doubt. Equivocal means unclear; empathetic means understanding feelings.' },
  { t: 'odd2', lv: 6, p: 'Which <b>two</b> words do not fit with the rest?', o: ['parliament', 'advise', 'recommend', 'counsel', 'advice'], a: ['parliament', 'advice'], e: 'Advise, recommend and counsel are verbs meaning to suggest what to do. Advice is a noun.' },

  /* ── Joining words ── */
  { t: 'joining', lv: 4, p: 'The picture shows a <b>clock</b> (time). Which word joins on to <b>time</b> to make a new word?', o: ['hour', 'games', 'play', 'rest'], a: 'play', e: '<b>play</b> + time = <b>playtime</b>. A clock tells the hour, but “hourtime” is not a word.' },
  { t: 'joining', lv: 4, p: 'The picture shows a <b>cup</b>. Which word joins on to <b>cup</b> to make a new word?', o: ['butter', 'jam', 'bread', 'drink'], a: 'butter', e: '<b>butter</b> + cup = <b>buttercup</b>.' },
  { t: 'joining', lv: 4, p: 'Which word can go at the start of this word to make a new word?', s: 'day', o: ['night', 'clock', 'sunny', 'week', 'hours'], a: 'week', e: '<b>week</b> + day = <b>weekday</b>.' },
  { t: 'joining', lv: 4, p: 'Which word can go at the start of this word to make a new word?', s: 'screen', o: ['wind', 'large', 'shiny', 'show', 'programme'], a: 'wind', e: '<b>wind</b> + screen = <b>windscreen</b>.' },
  { t: 'joining', lv: 4, p: 'Which word can go at the end of this word to make a new word? (fire + place = fireplace)', s: 'sauce', o: ['bowl', 'pan', 'red', 'hot'], a: 'pan', e: 'sauce + <b>pan</b> = <b>saucepan</b>.' },
  { t: 'joining', lv: 4, p: 'Which word can go at the end of this word to make a new word?', s: 'rain', o: ['coat', 'puddle', 'liquid', 'wear'], a: 'coat', e: 'rain + <b>coat</b> = <b>raincoat</b>.' },
  { t: 'joining', lv: 4, p: 'Which word can go at the end of this word to make a new word? (tooth + brush = toothbrush)', s: 'sea', o: ['side', 'waves', 'cold', 'salty'], a: 'side', e: 'sea + <b>side</b> = <b>seaside</b>.' },

  /* ── Missing letters ── */
  { t: 'missing3', lv: 5, p: 'The same three letters are missing from both words. Which letters complete them?', s: 'OP _ _ _ ITE &nbsp;&nbsp; _ _ _ TBOX', o: ['pas', 'act', 'pos', 'oss', 'sit'], a: 'pos', e: '<b>pos</b> makes <b>opposite</b> and <b>postbox</b>.' },
  { t: 'missing3', lv: 5, p: 'The same three letters are missing from both words. Which letters complete them?', s: 'REST _ _ _ ANT &nbsp;&nbsp; DINOS _ _ _ S', o: ['ing', 'our', 'anr', 'err', 'aur'], a: 'aur', e: '<b>aur</b> makes <b>restaurant</b> and <b>dinosaurs</b>.' },
  { t: 'missing3', lv: 5, p: 'The same three letters are missing from both words. Which letters complete them?', s: 'M _ _ _ CINE &nbsp;&nbsp; IMM _ _ _ ATE', o: ['edi', 'idd', 'add', 'eti', 'itt'], a: 'edi', e: '<b>edi</b> makes <b>medicine</b> and <b>immediate</b>.' },
  { t: 'missing3', lv: 5, p: 'The same two letters are missing from both words. Which letters complete them?', s: 'SEC _ _ DLY &nbsp;&nbsp; PRIS _ _ ER', o: ['on', 'or', 'un', 'op', 'ur'], a: 'on', e: '<b>on</b> makes <b>secondly</b> and <b>prisoner</b>.' },
  { t: 'missing3', lv: 4, p: 'The picture shows an <b>octopus</b>. Which two letters complete the word?', s: 'OC _ _ PUS', o: ['se', 'po', 'to', 'ta'], a: 'to', e: '<b>to</b> makes <b>octopus</b>.' },
  { t: 'missing3', lv: 4, p: 'The picture shows a <b>bookshelf</b>. Which letter completes the word?', s: 'LIBR _ RY', o: ['o', 'y', 'a', 't'], a: 'a', e: '<b>a</b> makes <b>library</b>.' },
  { t: 'missing3', lv: 4, p: 'Which letter completes the word?', s: 'POTAT _ ES', o: ['t', 'o', 'e', 'h'], a: 'o', e: '<b>o</b> makes <b>potatoes</b>.' },
  { t: 'missing3', lv: 4, p: 'The picture shows <b>mountains</b>. Which letter completes the word?', s: 'MOU _ TAIN', o: ['m', 't', 's', 'n'], a: 'n', e: '<b>n</b> makes <b>mountain</b>.' },
  { t: 'missing3', lv: 4, p: 'The picture shows a <b>heart</b>. Which letter completes the word?', s: 'H _ ART', o: ['e', 'i', 'f', 'a'], a: 'e', e: '<b>e</b> makes <b>heart</b>.' },
  { t: 'missing3', lv: 4, p: 'The picture shows a <b>queen</b>. Which letter completes the word?', s: 'Q _ EEN', o: ['h', 'u', 'w', 'o'], a: 'u', e: '<b>u</b> makes <b>queen</b>. In English, q is followed by u.' },

  /* ── Hidden words ── */
  { t: 'hidden', lv: 6, p: 'A <b>five-letter</b> word is hidden across the end of one word and the start of the next. Which <b>two</b> words hide it?', s: 'The dog’s bone was found near the vegetable patch.', o: ['found', 'near', 'vegetable', 'was', 'the'], a: ['near', 'the'], e: 'nea<u>r the</u> hides <b>earth</b>.' },
  { t: 'hidden', lv: 5, p: 'A four-letter word is hidden across the end of one word and the start of the next. Which word is it?', s: 'My friend Jared ripped his jacket!', o: ['redr', 'drip', 'ends', 'reader'], a: 'drip', e: 'Ja<u>red rip</u>ped hides <b>drip</b>. “Redr” is not a word.' },
  { t: 'hidden', lv: 5, p: 'A four-letter word is hidden across the end of one word and the start of the next. Which word is it?', s: 'That old window will not shut properly.', o: ['told', 'wind', 'hut', 'otsh'], a: 'told', e: 'Tha<u>t old</u> hides <b>told</b>. Wind sits inside one word, so it does not count.' },
  { t: 'hidden', lv: 5, p: 'A four-letter word is hidden across the end of one word and the start of the next. Which word is it?', s: 'They were both injured before half time.', o: ['thin', 'rebo', 'redo', 'for'], a: 'thin', e: 'bo<u>th in</u>jured hides <b>thin</b>.' },
  { t: 'hidden', lv: 5, p: 'A <b>three-letter</b> word is hidden across the end of one word and the start of the next. Which word is it?', s: 'Simon’s pencil lay under his chair.', o: ['this', 'ill', 'air', 'pen'], a: 'ill', e: 'penc<u>il l</u>ay hides <b>ill</b>. Air and pen sit inside one word, so they do not count.' },
  { t: 'hidden', lv: 4, p: 'A four-letter word is hidden across the end of one word and the start of the next. Which word is it?', s: 'Sam ate his banana during break.', o: ['and', 'mate', 'this', 'ring'], a: 'mate', e: 'Sa<u>m ate</u> hides <b>mate</b>.' },
  { t: 'hidden', lv: 4, p: 'A four-letter word is hidden across the end of one word and the start of the next. Which word is it?', s: 'She hates tomato soup.', o: ['test', 'atos', 'stop', 'ate'], a: 'test', e: 'ha<u>tes t</u>omato hides <b>test</b>.' },
  { t: 'hidden', lv: 4, p: 'A four-letter word is hidden across the end of one word and the start of the next. Which word is it?', s: 'It is safe around here to cycle.', o: ['fear', 'ears', 'rice', 'star'], a: 'fear', e: 'sa<u>fe ar</u>ound hides <b>fear</b>.' },
  { t: 'hidden', lv: 4, p: 'A four-letter word is hidden across the end of one word and the start of the next. Which word is it?', s: 'Every single answer was correct.', o: ['sin', 'glea', 'were', 'lean'], a: 'lean', e: 'sing<u>le an</u>swer hides <b>lean</b>. Sin sits inside one word, so it does not count.' },
  { t: 'hidden', lv: 4, p: 'A four-letter word is hidden across the end of one word and the start of the next. Which word is it?', s: 'My teacher gave stickers to the best dancers.', o: ['herg', 'each', 'vest', 'stick'], a: 'vest', e: 'ga<u>ve st</u>ickers hides <b>vest</b>. Each and stick sit inside one word.' },

  /* ── Complete the sentence (new topic) ── */
  { t: 'complete', lv: 5, p: 'Which letter goes at the front of the word in capitals so that the sentence makes sense?', s: 'Today’s sunset is bright _RANGE.', o: ['O', 'A', 'T', 'E'], a: 'O', e: '<b>O</b> makes <b>ORANGE</b>.' },
  { t: 'complete', lv: 5, p: 'Two letters are missing from one word. Together they spell a word of their own. Which two letters are missing?', s: 'There’s lots of blos _ _ m on the trees.', o: ['so', 'of', 'me', 'co', 'os'], a: 'so', e: '<b>so</b> makes <b>blossom</b>.' },
  { t: 'complete', lv: 5, p: 'Two letters are missing from one word. Together they spell a word of their own. Which two letters are missing?', s: 'I wish you wouldn’t keep ig _ _ ring me.', o: ['it', 'no', 're', 'my', 'me'], a: 'no', e: '<b>no</b> makes <b>ignoring</b>.' },
  { t: 'complete', lv: 5, p: 'Which letter goes at the front of the word in capitals so that the sentence makes sense?', s: 'Jack is washing up his dinner _LATE.', o: ['P', 'S', 'E', 'B'], a: 'P', e: '<b>P</b> makes <b>PLATE</b>. Slate and elate are words, but they do not fit the sentence.' },
  { t: 'complete', lv: 5, p: 'Two letters are missing from one word. Together they spell a word of their own. Which two letters are missing?', s: 'The bad weather will be _ _ ne soon.', o: ['to', 'she', 'my', 'at', 'go'], a: 'go', e: '<b>go</b> makes <b>gone</b>.' },
  { t: 'complete', lv: 4, p: 'Which letter goes at the front of the word in capitals so that the sentence makes sense?', s: 'The megaphone was very _OUD.', o: ['L', 'C', 'P', 'S'], a: 'L', e: '<b>L</b> makes <b>LOUD</b>.' },
  { t: 'complete', lv: 4, p: 'Which letter goes at the front of the word in capitals so that the sentence makes sense?', s: 'He used a _ENCIL to do his homework.', o: ['P', 'T', 'M', 'D'], a: 'P', e: '<b>P</b> makes <b>PENCIL</b>.' },
  { t: 'complete', lv: 4, p: 'Which letter goes at the front of the word in capitals so that the sentence makes sense?', s: 'The colour of the rose is _INK.', o: ['P', 'L', 'M', 'R'], a: 'P', e: '<b>P</b> makes <b>PINK</b>. Link, mink and rink are words, but they are not colours.' },
  { t: 'complete', lv: 4, p: 'Which letter goes at the front of the word in capitals so that the sentence makes sense?', s: '_ARCH is the third month of the year.', o: ['M', 'L', 'P', 'S'], a: 'M', e: '<b>M</b> makes <b>MARCH</b>. Larch and parch are words, but they are not months.' },
  { t: 'complete', lv: 4, p: 'Which letter goes at the front of the word in capitals so that the sentence makes sense?', s: 'The _APTOP is broken.', o: ['L', 'R', 'T', 'M'], a: 'L', e: '<b>L</b> makes <b>LAPTOP</b>.' },

  /* ── Synonyms ── */
  { t: 'synpair', lv: 6, p: 'Choose one word from each group. The two words must be <b>closest in meaning</b>.', g: [['kick', 'ball', 'goal'], ['baskets', 'sphere', 'quickly']], a: ['ball', 'sphere'], e: '<b>ball</b> and <b>sphere</b> are both nouns for a round shape. Kick and quickly are different word classes.' },
  { t: 'synpair', lv: 6, p: 'Choose one word from each group. The two words must be <b>closest in meaning</b>.', g: [['aquamarine', 'vessel', 'anchor'], ['ship', 'aquarium', 'submarine']], a: ['vessel', 'ship'], e: '<b>vessel</b> and <b>ship</b> both name a boat. Aquamarine is a colour; an aquarium is a fish tank.' },
  { t: 'synpair', lv: 6, p: 'Choose one word from each group. The two words must be <b>closest in meaning</b>.', g: [['course', 'syllable', 'polished'], ['smudged', 'syllabus', 'rough']], a: ['course', 'syllabus'], e: 'A <b>course</b> and a <b>syllabus</b> are both programmes of study. Coarse (not course) means rough.' },
  { t: 'syn', lv: 6, p: 'Choose the word that completes the sentence. The clue word <b>rhymes</b> with a word that means the same as the answer.', s: 'Clue: broke &nbsp;·&nbsp; She could feel the sun’s rays ____ her face.', o: ['caress', 'soothing', 'burn', 'warming', 'on'], a: 'caress', e: 'Broke rhymes with <b>stroke</b>, and <b>caress</b> means stroke.' },
  { t: 'synpair', lv: 6, p: 'Choose one word from each group. The two words must be <b>closest in meaning</b>.', g: [['principal', 'primarily', 'multiple'], ['principle', 'leading', 'importance']], a: ['principal', 'leading'], e: '<b>principal</b> and <b>leading</b> both mean most important. A principle is a rule or belief.' },

  /* ── Antonyms ── */
  { t: 'antpair', lv: 6, p: 'Choose one word from each group. The two words must be most nearly <b>opposite</b> in meaning.', g: [['incriminating', 'obsequious', 'laudatory'], ['presumptuous', 'laundry', 'pejorative']], a: ['laudatory', 'pejorative'], e: '<b>laudatory</b> means praising; <b>pejorative</b> means belittling.' },
  { t: 'antpair', lv: 6, p: 'Choose one word from each group. The two words must be most nearly <b>opposite</b> in meaning.', g: [['corruption', 'usury', 'usurp'], ['useless', 'kindness', 'charity']], a: ['usury', 'charity'], e: '<b>usury</b> is lending money at very high interest; <b>charity</b> is giving money freely.' },
  { t: 'antpair', lv: 6, p: 'Choose one word from each group. The two words must be most nearly <b>opposite</b> in meaning.', g: [['determined', 'dissolved', 'solution'], ['insoluble', 'irresolute', 'unresolved']], a: ['determined', 'irresolute'], e: '<b>determined</b> means firmly decided; <b>irresolute</b> means unable to decide.' },
  { t: 'antpair', lv: 6, p: 'Choose one word from each group. The two words must be most nearly <b>opposite</b> in meaning.', g: [['concede', 'condemnation', 'consonant'], ['intercede', 'dissonant', 'indemnity']], a: ['consonant', 'dissonant'], e: 'As adjectives, <b>consonant</b> means in harmony and <b>dissonant</b> means out of harmony.' },
  { t: 'antpair', lv: 6, p: 'Choose one word from each group. The two words must be most nearly <b>opposite</b> in meaning.', g: [['maleficent', 'magnanimous', 'avenger'], ['wistful', 'benevolence', 'vindictive']], a: ['magnanimous', 'vindictive'], e: '<b>magnanimous</b> means generous and forgiving; <b>vindictive</b> means wanting revenge. Benevolence is a noun, so it cannot pair with maleficent.' },

  /* ── Homonyms ── */
  { t: 'homo', lv: 6, p: 'Which word goes equally well with both pairs of words?', s: '( flawless, faultless ) &nbsp;&nbsp; ( hone, polish )', o: ['perfect', 'shine', 'clean', 'ideal', 'spotless'], a: 'perfect', e: '<b>perfect</b> means flawless; as a verb, to perfect means to polish or improve.' },
  { t: 'homo', lv: 6, p: 'Which word goes equally well with both pairs of words?', s: '( ponder, consider ) &nbsp;&nbsp; ( inspiration, stimulus )', o: ['beauty', 'amuse', 'muse', 'wonder', 'art'], a: 'muse', e: 'To <b>muse</b> is to ponder; a muse is a source of inspiration. Wonder only fits the first pair.' },
  { t: 'homo', lv: 6, p: 'Which word goes equally well with both pairs of words?', s: '( living, alive ) &nbsp;&nbsp; ( enliven, invigorate )', o: ['breathing', 'animate', 'lively', 'animal', 'sentient'], a: 'animate', e: '<b>animate</b> means alive; to animate means to bring to life.' },
  { t: 'homo', lv: 6, p: 'Which word goes equally well with both pairs of words?', s: '( gust, blast ) &nbsp;&nbsp; ( cry, shout )', o: ['scream', 'squall', 'eject', 'hail', 'flurry'], a: 'squall', e: 'A <b>squall</b> is a sudden gust of wind; to squall is to cry out. Scream only fits the second pair.' },
  { t: 'homo', lv: 6, p: 'Which word has both meanings?', s: '( right, fair ) &nbsp;&nbsp; ( exactly )', o: ['almost', 'just', 'good', 'equal'], a: 'just', e: '<b>just</b> means fair, and it also means exactly (just the right amount).' },

  /* ── Spot the connection ── */
  { t: 'analogy', lv: 6, p: 'Choose one word from each group to complete the sentence.', s: 'Complement is to ( flattery, accompany, condiment ) as tedious is to ( monotonous, dynamic, tired ).', g: [['flattery', 'accompany', 'condiment'], ['monotonous', 'dynamic', 'tired']], a: ['accompany', 'monotonous'], e: 'Both pairs mean the same: complement means accompany; tedious means monotonous. Compliment (with an i) means flattery.' },
  { t: 'analogy', lv: 6, p: 'Choose one word from each group to complete the sentence.', s: 'Illustrator is to ( novel, draws, depiction ) as architect is to ( blueprint, designer, job ).', g: [['novel', 'draws', 'depiction'], ['blueprint', 'designer', 'job']], a: ['depiction', 'blueprint'], e: 'An illustrator makes a <b>depiction</b>; an architect makes a <b>blueprint</b>.' },
  { t: 'analogy', lv: 6, p: 'Choose one word from each group to complete the sentence.', s: 'Unprejudiced is to ( sympathetic, intolerant, empathy ) as conscientious is to ( indifferent, diligent, faithful ).', g: [['sympathetic', 'intolerant', 'empathy'], ['indifferent', 'diligent', 'faithful']], a: ['intolerant', 'indifferent'], e: 'Both pairs are opposites: unprejudiced and <b>intolerant</b>, conscientious and <b>indifferent</b>.' },
  { t: 'analogy', lv: 6, p: 'Each word on the top row takes an ending to make a noun. Which ending does <b>act</b> take?', s: 'pray → prayer &nbsp; · &nbsp; accept → acceptance &nbsp; · &nbsp; act → act ?', o: ['or', 'ing', 'ion', 'ed', 'ress'], a: 'ion', e: 'Each ending turns the verb into a noun: prayer, acceptance, <b>action</b>.' },
  { t: 'analogy', lv: 6, p: 'Choose one word from each group to complete the sentence.', s: 'Need is to ( dough, needle, require ) as plait is to ( weave, hair, basket ).', g: [['dough', 'needle', 'require'], ['weave', 'hair', 'basket']], a: ['require', 'weave'], e: 'Both pairs mean the same: need and <b>require</b>, plait and <b>weave</b>. Dough goes with knead, not need.' },

  /* ── Definitions (new topic) ── */
  { t: 'define', lv: 6, p: 'What does <b>sterile</b> mean in this sentence?', s: 'The operating theatre was completely sterile.', o: ['disinfected', 'rich', 'futile', 'old', 'dirty'], a: 'disinfected', e: 'Here <b>sterile</b> means free of germs: disinfected.' },
  { t: 'define', lv: 6, p: 'What does <b>ostentatious</b> mean in this sentence?', s: 'Grandma said my outfit was too ostentatious for the occasion.', o: ['plain', 'decoration', 'flamboyant', 'ostrich', 'boring'], a: 'flamboyant', e: '<b>ostentatious</b> means showy: flamboyant. The answer must be an adjective, which rules out decoration and ostrich.' },
  { t: 'define', lv: 6, p: 'What does <b>cordial</b> mean in this sentence?', s: 'The new headteacher was cordial when she greeted the pupils in assembly.', o: ['intense', 'juicy', 'friendly', 'smiling', 'large'], a: 'friendly', e: 'As an adjective, <b>cordial</b> means warm and friendly. As a noun it is a fruit drink.' },
  { t: 'define', lv: 6, p: 'What does <b>outrageous</b> mean in this sentence?', s: 'The new price of this dress is absolutely outrageous!', o: ['false', 'enticing', 'shocking', 'inflation', 'elevation'], a: 'shocking', e: '<b>outrageous</b> means shocking. The answer must be an adjective.' },
  { t: 'define', lv: 4, p: 'Which word describes what Jake did?', s: 'Jake knocked over Celina’s glass, but he didn’t mean to do it!', o: ['accidental', 'deliberate', 'mean', 'silly'], a: 'accidental', e: 'Not meaning to do something makes it <b>accidental</b>. Deliberate means on purpose.' },

  /* ── Jumbled sentences ── */
  { t: 'jumsent', lv: 4, p: 'Which is the correct order for the words?', s: 'Shining the brightly sun was.', o: ['Was brightly the shining sun.', 'Sun was the shining brightly.', 'Shining the brightly sun was.', 'The sun was shining brightly.'], a: 'The sun was shining brightly.', e: '<i>The sun was shining brightly.</i> Brightly describes how it was shining.' },
  { t: 'jumsent', lv: 4, p: 'Which is the correct order for the words?', s: 'Landed soft the gently feather.', o: ['The soft feather landed gently.', 'Gently the landed feather soft.', 'Soft feather landed gently the.', 'Feather gently the landed soft.'], a: 'The soft feather landed gently.', e: '<i>The soft feather landed gently.</i> Soft describes the feather; gently describes how it landed.' },
  { t: 'jumsent', lv: 4, p: 'Which word is <u>not</u> needed in this sentence?', s: 'I basket listened to the radio.', o: ['listened', 'radio', 'the', 'basket'], a: 'basket', e: 'Take out <b>basket</b>: <i>I listened to the radio.</i>' },

  /* ── Find the link ── */
  { t: 'letterpair', lv: 4, p: 'Which letter ends the first word and starts the second word?', s: 'TES ( ? ) IME', o: ['C', 'M', 'T', 'L'], a: 'T', e: '<b>T</b> makes TEST and TIME.' },
  { t: 'letterpair', lv: 4, p: 'Which letter ends the first word and starts the second word in <b>both</b> pairs?', s: 'BOA ( ? ) ALL &nbsp;&nbsp;&nbsp; HO ( ? ) EAM', o: ['R', 'T', 'C', 'P'], a: 'T', e: '<b>T</b> makes BOAT, TALL, HOT and TEAM.' },
  { t: 'letterpair', lv: 4, p: 'Which letter ends the first word and starts the second word?', s: 'ROO ( ? ) ILK', o: ['F', 'M', 'P', 'W'], a: 'M', e: '<b>M</b> makes ROOM and MILK. F and T can end roo-, but cannot start -ilk.' },
  { t: 'letterpair', lv: 4, p: 'Which letter ends the first word and starts the second word?', s: 'TRUC ( ? ) ICK', o: ['Y', 'L', 'K', 'S'], a: 'K', e: '<b>K</b> makes TRUCK and KICK.' },
  { t: 'letterpair', lv: 4, p: 'Which letter ends the first word and starts the second word?', s: 'DISC ( ? ) FTEN', o: ['I', 'U', 'O', 'H'], a: 'O', e: '<b>O</b> makes DISCO and OFTEN.' },

  /* ── Transferring letters ── */
  { t: 'transfer', lv: 4, p: 'The picture shows <b>water</b>. Which letter do you take out of this word to make the picture word?', s: 'WAITER', o: ['W', 'A', 'I', 'E', 'R'], a: 'I', e: 'Take out <b>I</b>: WAITER becomes WATER.' },
  { t: 'transfer', lv: 4, p: 'The picture shows a <b>house</b>. Which letter do you add to this word to make the picture word?', s: 'HOSE', o: ['C', 'N', 'O', 'R', 'U'], a: 'U', e: 'Add <b>U</b>: HOSE becomes HOUSE. C makes chose and R makes horse, but they do not match the picture.' },
  { t: 'transfer', lv: 4, p: 'The picture shows a <b>table</b>. Which letter do you add to this word to make the picture word?', s: 'TALE', o: ['B', 'I', 'L', 'R', 'S'], a: 'B', e: 'Add <b>B</b>: TALE becomes TABLE.' },
  { t: 'transfer', lv: 4, p: 'Move one letter from the first word to the second word to make two new words (pictures: a microphone and some tools). Which letter moves?', s: 'SLING &nbsp;&nbsp; TOO', o: ['I', 'L', 'N', 'S'], a: 'L', e: 'Take <b>L</b> out of SLING to make SING. Put it into TOO to make TOOL.' },
  { t: 'transfer', lv: 4, p: 'Move one letter from the first word to the second word to make two new words (pictures: a clothes rack and a chair). Which letter moves?', s: 'CRACK &nbsp;&nbsp; HAIR', o: ['A', 'C', 'K', 'R'], a: 'C', e: 'Take the first <b>C</b> out of CRACK to make RACK. Put it into HAIR to make CHAIR.' },

  /* ── Morphing words ── */
  { t: 'morph', lv: 4, p: 'Change one letter at a time. Which word goes in the middle?', s: 'DISH &nbsp;→&nbsp; ? &nbsp;→&nbsp; FIST', o: ['BAKE', 'FACE', 'TEAS', 'FISH', 'FORK'], a: 'FISH', e: 'DISH → <b>FISH</b> → FIST. Each step changes one letter.' },
  { t: 'morph', lv: 4, p: 'Change one letter at a time. Which word is missing?', s: 'BEAN &nbsp;→&nbsp; MEAN &nbsp;→&nbsp; ? &nbsp;→&nbsp; REAL', o: ['MEAT', 'MATE', 'BEEF', 'BATS', 'MEAL'], a: 'MEAL', e: 'BEAN → MEAN → <b>MEAL</b> → REAL.' },
  { t: 'morph', lv: 4, p: 'Change one letter at a time. Which word goes in the middle?', s: 'NAPS &nbsp;→&nbsp; ? &nbsp;→&nbsp; MOPS', o: ['CAPS', 'PACE', 'MAKE', 'FLAG', 'MAPS'], a: 'MAPS', e: 'NAPS → <b>MAPS</b> → MOPS.' },
  { t: 'morph', lv: 4, p: 'Change one letter at a time. Which word goes in the middle? Clue: the tough outer layer of a tree.', s: 'BACK &nbsp;→&nbsp; ? &nbsp;→&nbsp; DARK', o: ['BARK', 'BANK', 'BEAK', 'LARK'], a: 'BARK', e: 'BACK → <b>BARK</b> → DARK: c changes to r, then b changes to d.' },
  { t: 'morph', lv: 4, p: 'Change one letter at a time. Which word goes in the middle? Clue: unwilling to work.', s: 'LADY &nbsp;→&nbsp; ? &nbsp;→&nbsp; HAZY', o: ['LAZY', 'LACY', 'LANE', 'DAZE'], a: 'LAZY', e: 'LADY → <b>LAZY</b> → HAZY: d changes to z, then l changes to h.' },

  /* ── Stolen words (new topic) ── */
  { t: 'stolen', lv: 4, p: 'Add a three-letter word to the letters in capitals to make a word that matches the clue.', s: 'COCO · grown on a palm tree', o: ['NUT', 'BIN', 'NOW', 'BUT'], a: 'NUT', e: 'COCO + <b>NUT</b> = COCONUT.' },
  { t: 'stolen', lv: 4, p: 'Put a three-letter word inside the letters in capitals to make a word that matches the clue.', s: 'SPE · a round 3D shape', o: ['HIS', 'HER', 'RAN', 'HIP'], a: 'HER', e: 'SP + <b>HER</b> + E = SPHERE.' },
  { t: 'stolen', lv: 4, p: 'Put a three-letter word inside the letters in capitals to make a word that matches the clue.', s: 'WTLE · a high noise made by blowing through your lips', o: ['HIP', 'HER', 'HOT', 'HIS'], a: 'HIS', e: 'W + <b>HIS</b> + TLE = WHISTLE.' },
  { t: 'stolen', lv: 4, p: 'Put a three-letter word inside the letters in capitals to make a word that matches the clue.', s: 'BEVE · to think something is true', o: ['LIT', 'LAY', 'LIE', 'HAY'], a: 'LIE', e: 'BE + <b>LIE</b> + VE = BELIEVE.' },
  { t: 'stolen', lv: 4, p: 'Put a four-letter word inside the word in capitals so that the sentence makes sense.', s: 'I’m not SURPD by your behaviour, but it’s still upsetting.', o: ['REST', 'RISE', 'ROSE', 'GROW', 'FILE'], a: 'RISE', e: 'SURP + <b>RISE</b> + D = SURPRISED.' },

  /* ── Anagrams (new topic) ── */
  { t: 'anagram', lv: 4, p: 'Rearrange the letters to make a word that matches the clue.', s: 'HISF · an animal that lives in water', o: ['fish', 'wish', 'dish', 'shin'], a: 'fish', e: 'HISF rearranged makes <b>fish</b>.' },
  { t: 'anagram', lv: 4, p: 'Rearrange the letters to make a word that matches the clue.', s: 'ISHP · picture: an anchor', o: ['ship', 'hips', 'shop', 'chip'], a: 'ship', e: 'ISHP makes <b>ship</b>. Hips uses the same letters but does not match an anchor.' },
  { t: 'anagram', lv: 4, p: 'Rearrange the letters to make a word that matches the clue. Use every letter.', s: 'OWCS · animals that give us milk', o: ['cows', 'owls', 'cats', 'goats'], a: 'cows', e: 'OWCS makes <b>cows</b>. All four letters are used, including the s.' },
  { t: 'anagram', lv: 4, p: 'Which <b>two</b> words use exactly the same letters?', o: ['PIG', 'PAN', 'NIP', 'PIN', 'PAT'], a: ['NIP', 'PIN'], e: '<b>NIP</b> and <b>PIN</b> use N, I and P.' },

  /* ── Jumbled words ── */
  { t: 'jumbled', lv: 4, p: 'The letters of the word in capitals are mixed up. Which word should it be?', s: 'I wanted to AULGH at the joke but it wasn’t very good.', o: ['laugh', 'lounge', 'gale', 'loud'], a: 'laugh', e: 'AULGH rearranged makes <b>laugh</b>.' },
  { t: 'jumbled', lv: 4, p: 'The letters are mixed up. Clue: something you do in water.', s: 'SIMW', o: ['swim', 'wise', 'mist', 'swam'], a: 'swim', e: 'SIMW rearranged makes <b>swim</b>.' },
  { t: 'jumbled', lv: 4, p: 'The letters of the word in capitals are mixed up. Which word should it be?', s: 'I got home and relaxed in a CIRHA.', o: ['chirp', 'chair', 'charm', 'armchair'], a: 'chair', e: 'CIRHA rearranged makes <b>chair</b>.' },
  { t: 'jumbled', lv: 4, p: 'The letters of the word in capitals are mixed up. Which word should it be?', s: 'In art class I like to PITNA.', o: ['pinata', 'tins', 'pitta', 'paint'], a: 'paint', e: 'PITNA rearranged makes <b>paint</b>.' },
  { t: 'jumbled', lv: 4, p: 'The letters of the word in capitals are mixed up. Which word should it be?', s: 'My snake likes to SITERHL around its tank.', o: ['listen', 'sitter', 'slither', 'listener'], a: 'slither', e: 'SITERHL rearranged makes <b>slither</b>.' },

  /* ── Choose the word (new topic) ── */
  { t: 'choose', lv: 4, p: 'Which word completes the sentence? (Picture: a bar of chocolate.)', s: '____ melts when you leave it out in the sun.', o: ['Chips', 'Brown', 'Squares', 'Chocolate', 'Orange'], a: 'Chocolate', e: '<b>Chocolate</b> matches the picture and fits “melts”. Chips and squares are plural.' },
  { t: 'choose', lv: 4, p: 'Which word completes the sentence? (Picture: an ice cream.)', s: 'Last summer was very hot and we ate ____ on the beach every day.', o: ['yellow', 'pancakes', 'ice cream', 'unfair', 'tall'], a: 'ice cream', e: 'The gap needs a thing you eat, and the picture shows <b>ice cream</b>.' },
  { t: 'choose', lv: 4, p: 'Which word completes the sentence? (Picture: a red rose.)', s: 'The ____ in the garden smell beautiful.', o: ['roses', 'green', 'loving', 'sunflowers', 'little'], a: 'roses', e: 'The gap needs a plural noun, and the picture shows <b>roses</b>.' },
  { t: 'choose', lv: 4, p: 'Which word completes the sentence?', s: 'Used items are ____ than new items.', o: ['excitingly', 'clothes', 'cheaply', 'cheaper'], a: 'cheaper', e: '“than” needs a comparing word: <b>cheaper</b>.' },
  { t: 'choose', lv: 4, p: 'Which word completes the sentence?', s: 'Michael made sure his ____ were on tight before jumping in the swimming pool.', o: ['giraffe', 'goggles', 'sunny', 'hurriedly', 'splashing'], a: 'goggles', e: '“his ____ were” needs a plural thing he wears: <b>goggles</b>.' },

  /* ── Word rules (new topic: Atom “Rearrange words”) ── */
  { t: 'rearrange', lv: 4, p: 'Make the same change to complete the last pair.', s: 'heat → hear &nbsp; · &nbsp; beat → bear &nbsp; · &nbsp; neat → ?', o: ['net', 'nose', 'near', 'neater'], a: 'near', e: 'The last letter t changes to r: neat → <b>near</b>.' },
  { t: 'rearrange', lv: 4, p: 'Make the same change to complete the last pair.', s: 'can → man &nbsp; · &nbsp; lean → mean &nbsp; · &nbsp; deal → ?', o: ['meal', 'dleam', 'men', 'deals'], a: 'meal', e: 'The first letter changes to m: deal → <b>meal</b>.' },
  { t: 'rearrange', lv: 4, p: 'Make the same change to complete the last pair.', s: 'bear → boor &nbsp; · &nbsp; dear → door &nbsp; · &nbsp; pear → ?', o: ['pore', 'per', 'poor', 'pire'], a: 'poor', e: 'ea changes to oo: pear → <b>poor</b>.' },
  { t: 'rearrange', lv: 4, p: 'Make the same change to complete the last pair.', s: 'wood → woof &nbsp; · &nbsp; hood → hoof &nbsp; · &nbsp; root → ?', o: ['roof', 'foot', 'hoot', 'rode'], a: 'roof', e: 'The last letter changes to f: root → <b>roof</b>.' },
  { t: 'rearrange', lv: 4, p: 'Make the same change to complete the last pair.', s: 'led → lad &nbsp; · &nbsp; fed → fad &nbsp; · &nbsp; bed → ?', o: ['bid', 'bad', 'pad', 'bead'], a: 'bad', e: 'The middle e changes to a: bed → <b>bad</b>.' },

  /* ── Rearrange letters (new topic: middle word made from the outer words) ── */
  { t: 'rearrlet', lv: 5, p: 'The middle word in the first group is made from letters of the two outer words. Make the second middle word in the same way.', s: '( PURE &nbsp;<b>PUSH</b>&nbsp; SHOE ) &nbsp;&nbsp; ( SNOW &nbsp;?&nbsp; APES )', o: ['SNAP', 'SLUG', 'ARMS', 'STAY'], a: 'SNAP', e: 'Join the first two letters of each outer word: PU + SH = PUSH, so SN + AP = <b>SNAP</b>.' },
  { t: 'rearrlet', lv: 5, p: 'The middle word in the first group is made from letters of the two outer words. Make the second middle word in the same way.', s: '( GAME &nbsp;<b>CAME</b>&nbsp; COLD ) &nbsp;&nbsp; ( BOAT &nbsp;?&nbsp; GREW )', o: ['GOAL', 'GIST', 'GOAT', 'POOL'], a: 'GOAT', e: 'Take the first letter of the right word and the last three of the left: C + AME = CAME, so G + OAT = <b>GOAT</b>.' },
  { t: 'rearrlet', lv: 5, p: 'The middle word in the first group is made from letters of the two outer words. Make the second middle word in the same way.', s: '( HUGE &nbsp;<b>HORN</b>&nbsp; TORN ) &nbsp;&nbsp; ( KNEE &nbsp;?&nbsp; WIND )', o: ['DICE', 'FIND', 'KILL', 'KIND'], a: 'KIND', e: 'Take the first letter of the left word and the last three of the right: H + ORN = HORN, so K + IND = <b>KIND</b>.' },

  /* ── Letter pairs ── */
  { t: 'letanalogy', lv: 4, p: 'Move both letters <b>back two</b> places in the alphabet.', s: 'MN', o: ['UV', 'KL', 'EF', 'CD'], a: 'KL', e: 'M back two is K; N back two is L: <b>KL</b>.' },
  { t: 'letanalogy', lv: 4, p: 'Use the same rule to find the missing letter.', s: 'Q is to P as V is to ?', o: ['U', 'W', 'T', 'S'], a: 'U', e: 'Q to P moves back one place, so V moves back one to <b>U</b>.' },
  { t: 'letanalogy', lv: 4, p: 'Move both letters <b>back three</b> places in the alphabet.', s: 'OP', o: ['YZ', 'LM', 'BC', 'TU'], a: 'LM', e: 'O back three is L; P back three is M: <b>LM</b>.' },
  { t: 'letanalogy', lv: 4, p: 'Move both letters <b>back two</b> places in the alphabet.', s: 'XY', o: ['QR', 'VW', 'JK', 'MN'], a: 'VW', e: 'X back two is V; Y back two is W: <b>VW</b>.' },
  { t: 'letanalogy', lv: 4, p: 'Use the same rule to complete the sentence.', s: 'KL is to MN as VW is to ?', o: ['QR', 'IJ', 'XY', 'CD'], a: 'XY', e: 'Both letters move forward two places: V → X, W → Y.' },

  /* ── Letter codes ── */
  { t: 'wordcode', lv: 4, p: 'Use the code to find the answer.', s: 'OCEAN = TWIML &nbsp;·&nbsp; What is the code for ONE?', o: ['LTO', 'TLI', 'WTM', 'TMJ'], a: 'TLI', e: 'O = T, N = L, E = I, so ONE = <b>TLI</b>.' },
  { t: 'wordcode', lv: 4, p: 'Use the code to find the answer.', s: 'FIELD = JRSVY &nbsp;·&nbsp; What is the code for LIED?', o: ['SJRY', 'YQVR', 'VYJB', 'VRSY'], a: 'VRSY', e: 'L = V, I = R, E = S, D = Y, so LIED = <b>VRSY</b>.' },
  { t: 'wordcode', lv: 4, p: 'Use the code to find the answer.', s: 'SPACE = XOGZM &nbsp;·&nbsp; What is the code for CAPE?', o: ['ZMVB', 'XGMZ', 'ZGOM', 'OZMW'], a: 'ZGOM', e: 'C = Z, A = G, P = O, E = M, so CAPE = <b>ZGOM</b>.' },
  { t: 'wordcode', lv: 4, p: 'Use the code to find the answer.', s: 'DRAW = MPTB &nbsp;·&nbsp; What does BTP mean?', o: ['WAR', 'RAT', 'LAW', 'DAW'], a: 'WAR', e: 'B = W, T = A, P = R, so BTP = <b>WAR</b>.' },
  { t: 'wordcode', lv: 4, p: 'Use the code to find the answer.', s: 'CAT = DQS &nbsp;·&nbsp; What does QDS mean?', o: ['ACT', 'MAT', 'TAC', 'ACE'], a: 'ACT', e: 'Q = A, D = C, S = T, so QDS = <b>ACT</b>.' },

  /* ── Number codes ── */
  { t: 'numcode', lv: 4, p: 'Use the code to find the answer.', s: 'FLOAT = 19503 &nbsp;·&nbsp; What does 503 mean?', o: ['OAT', 'LOT', 'LIT', 'FAT'], a: 'OAT', e: '5 = O, 0 = A, 3 = T, so 503 = <b>OAT</b>.' },
  { t: 'numcode', lv: 4, p: 'Use the code to find the answer.', s: 'MOOSE = 19956 &nbsp;·&nbsp; What is the code for MOO?', o: ['198', '619', '199', '911'], a: '199', e: 'M = 1, O = 9, so MOO = <b>199</b>.' },
  { t: 'numcode', lv: 4, p: 'Use the code to find the answer.', s: 'SPACE = 92341 &nbsp;·&nbsp; What does 432 mean?', o: ['CAT', 'ACE', 'CAP', 'SPA'], a: 'CAP', e: '4 = C, 3 = A, 2 = P, so 432 = <b>CAP</b>.' },
  { t: 'numcode', lv: 4, p: 'Use the code to find the answer.', s: 'GIANT = 43105 &nbsp;·&nbsp; What does 510 mean?', o: ['NIT', 'GOT', 'TAN', 'ANT'], a: 'TAN', e: '5 = T, 1 = A, 0 = N, so 510 = <b>TAN</b>.' },
  { t: 'numcode', lv: 4, p: 'Use the code to find the answer.', s: 'PEACE = 12762 &nbsp;·&nbsp; What is the code for PEA?', o: ['127', '172', '126', '152'], a: '127', e: 'P = 1, E = 2, A = 7, so PEA = <b>127</b>.' },

  /* ── Symbol codes (new topic) ── */
  { t: 'symbol', lv: 4, p: 'Use the key to write the word in code.', s: 'E = ? &nbsp; A = ^ &nbsp; F = &amp; &nbsp; L = # &nbsp;·&nbsp; LEAF', o: ['#?^&', '&#?^', '&?^#', '#^&?'], a: '#?^&', e: 'L = #, E = ?, A = ^, F = &amp;, so LEAF = <b>#?^&amp;</b>.' },
  { t: 'symbol', lv: 4, p: 'Use the code to write the word.', s: 'AHOY = @#&lt;&amp; &nbsp;·&nbsp; YOYO', o: ['&#&<', '&<&<', '@#@#', '<&<'], a: '&<&<', e: 'Y = &amp;, O = &lt;, so YOYO = <b>&amp;&lt;&amp;&lt;</b>.' },
  { t: 'symbol', lv: 4, p: 'Use the key to work out the word.', s: '€ = S &nbsp; * = G &nbsp; &lt; = E &nbsp;·&nbsp; *&lt;&lt;€&lt;', o: ['GUESS', 'EGGS', 'GOOSE', 'GEESE'], a: 'GEESE', e: '* = G, &lt; = E, € = S: <b>GEESE</b>. The repeated &lt; shows a double letter.' },
  { t: 'symbol', lv: 4, p: 'Use the key to write the word in code.', s: 'D = # &nbsp; E = ! &nbsp; S = ^ &nbsp;·&nbsp; SEED', o: ['^!!#', '!##^', '^!#', '#!!^'], a: '^!!#', e: 'S = ^, E = !, E = !, D = #: <b>^!!#</b>.' },
  { t: 'symbol', lv: 4, p: 'Use the code to write the word.', s: 'LEAK = &amp;^%* &nbsp;·&nbsp; ELK', o: ['^^&', '%^*', '&^*', '^&*'], a: '^&*', e: 'E = ^, L = &amp;, K = *, so ELK = <b>^&amp;*</b>.' },

  /* ── Number sequences ── */
  { t: 'numseq', lv: 4, p: 'Find the missing number.', s: '70000, 7000, 700, ?, 7', o: ['77', '70', '10', '100'], a: '70', e: 'Divide by 10 each time: 700 ÷ 10 = <b>70</b>.' },
  { t: 'numseq', lv: 4, p: 'Find the missing number. Add 1 each time.', s: '10, 11, ?, 13, 14', o: ['12', '13', '11', '15'], a: '12', e: '11 + 1 = <b>12</b>.' },
  { t: 'numseq', lv: 4, p: 'Find the missing number.', s: '16, 18, 20, ?, 24', o: ['27', '22', '21', '25'], a: '22', e: 'Add 2 each time: 20 + 2 = <b>22</b>.' },
  { t: 'numseq', lv: 4, p: 'Find the next number. Multiply by 10 each time.', s: '2, 20, 200, 2000, ?', o: ['10000', '200', '20000', '5000'], a: '20000', e: '2000 × 10 = <b>20000</b>.' },
  { t: 'numseq', lv: 4, p: 'Find the missing number.', s: '1, 11, 111, ?, 11111', o: ['11', '111111', '1110', '1111'], a: '1111', e: 'Add one more 1 each time: <b>1111</b>.' },

  /* ── Letter sequences ── */
  { t: 'letseq', lv: 4, p: 'Find the next pair of letters.', s: 'BQ, BR, BS, BT, ?', o: ['DA', 'RV', 'BU', 'JD'], a: 'BU', e: 'The first letter stays B. The second moves forward one: Q R S T <b>U</b>.' },
  { t: 'letseq', lv: 4, p: 'Find the next pair of letters.', s: 'CD, CF, CH, CJ, ?', o: ['CL', 'ME', 'NR', 'US'], a: 'CL', e: 'The first letter stays C. The second moves forward two: D F H J <b>L</b>.' },
  { t: 'letseq', lv: 4, p: 'Find the next pair of letters.', s: 'TN, TL, TJ, TH, ?', o: ['OS', 'JG', 'TF', 'WL'], a: 'TF', e: 'The first letter stays T. The second moves back two: N L J H <b>F</b>.' },
  { t: 'letseq', lv: 4, p: 'Find the next pair of letters.', s: 'PL, PM, PN, PO, ?', o: ['OP', 'PP', 'QP', 'ZP'], a: 'PP', e: 'The first letter stays P. The second moves forward one: L M N O <b>P</b>.' },
  { t: 'letseq', lv: 4, p: 'Find the next pair of letters.', s: 'DE, DD, DC, DB, ?', o: ['DA', 'YA', 'PA', 'DU'], a: 'DA', e: 'The first letter stays D. The second moves back one: E D C B <b>A</b>.' },

  /* ── Ordering words (new topic) ── */
  { t: 'ordering', lv: 4, p: 'The pictures are in this order. How are they ordered?', s: 'elephant → leopard → fly', o: ['first to last', 'alphabetical', 'age', 'largest to smallest'], a: 'largest to smallest', e: 'They go from the <b>largest</b> animal to the <b>smallest</b>.' },
  { t: 'ordering', lv: 4, p: 'The pictures are in this order. How are they ordered?', s: 'sun (summer) → fallen leaf (autumn) → snowflake (winter)', o: ['first to last', 'size', 'oldest to youngest', 'alphabetical'], a: 'first to last', e: 'Summer, autumn, winter: the seasons in the order they come, <b>first to last</b>.' },
  { t: 'ordering', lv: 4, p: 'Which word comes <b>first</b> in alphabetical order?', o: ['Bed', 'Lamp', 'Shelf', 'Desk'], a: 'Bed', e: 'B comes before D, L and S: <b>Bed</b>, Desk, Lamp, Shelf.' },
  { t: 'ordering', lv: 4, p: 'Which word comes <b>first</b> in alphabetical order?', o: ['Monkey', 'Giraffe', 'Zebra', 'Lion'], a: 'Giraffe', e: 'G comes before L, M and Z: <b>Giraffe</b>, Lion, Monkey, Zebra.' },
  { t: 'ordering', lv: 4, p: 'Put these in order from youngest to oldest. Which is <b>third</b>?', o: ['Newborn', 'Toddler', 'Elder', 'Adult', 'Teenager'], a: 'Teenager', e: 'Newborn, toddler, <b>teenager</b>, adult, elder.' },

  /* ── Statement logic ── */
  { t: 'statement', lv: 4, p: 'Four pictures show: a beach with palm trees and sea; an island in the sea; a tall waterfall; a wide waterfall. Which statement is definitely true?', o: ['They all contain water.', 'Three pictures contain buildings.', 'They all contain clouds.', 'They are all in England.'], a: 'They all contain water.', e: 'Every picture has sea or a waterfall, so <b>they all contain water</b>. The others cannot be checked.' },
  { t: 'statement', lv: 4, p: 'Four pictures show an apple, cherries, a slice of watermelon and a strawberry, each with a bite taken out. Which statement is definitely true?', o: ['All are berries.', 'All are sweet.', 'None grow on trees.', 'All have bites out of them.'], a: 'All have bites out of them.', e: 'The only thing every picture shows is <b>a bite taken out</b>.' },
  { t: 'statement', lv: 4, p: 'Read the sentence. Which item is <b>not</b> in my wardrobe?', s: 'In my wardrobe I have dresses, trousers, coats and shirts.', o: ['Shoes', 'Trousers', 'Dresses', 'Shirts'], a: 'Shoes', e: '<b>Shoes</b> are the only item not on the list.' },
  { t: 'statement', lv: 4, p: 'Read the sentence. Which animal can you <b>not</b> adopt?', s: 'At the animal shelter you can adopt kittens, parrots, rabbits and dogs.', o: ['Kittens', 'Guinea pigs', 'Dogs', 'Rabbits'], a: 'Guinea pigs', e: '<b>Guinea pigs</b> are the only animal not on the list.' },
  { t: 'statement', lv: 4, p: 'Four pictures show garden gnomes. Every gnome has a beard. Which statement is definitely true?', o: ['All prefer shade.', 'All have a beard.', 'All are happy.', 'Gnomes aren’t real.'], a: 'All have a beard.', e: 'The pictures show that <b>all have a beard</b>. Nothing tells us the rest.' },

  /* ── Deductions ── */
  { t: 'deduce', lv: 4, p: 'I took home a souvenir from my summer holiday. You can wear it and it is yellow. Which souvenir did I choose?', o: ['a yellow T-shirt', 'a blue T-shirt', 'a yellow beach ball', 'a red sun hat'], a: 'a yellow T-shirt', e: 'Check both clues: only the <b>yellow T-shirt</b> is yellow and something you can wear.' },
  { t: 'deduce', lv: 4, p: 'I am in the middle of the city. The museum is north, the park is east, the church is south and the library is west. If I walk west, where will I end up?', o: ['Library', 'Museum', 'Park', 'Church'], a: 'Library', e: 'The <b>library</b> is to the west. (North, East, South, West: Never Eat Shredded Wheat.)' },
  { t: 'deduce', lv: 4, p: 'If South America is in the south, where is North America?', o: ['South', 'North', 'East', 'West'], a: 'North', e: 'The name gives the direction: <b>North</b>.' },
  { t: 'deduce', lv: 4, p: 'If yesterday was Wednesday, what day is it today?', o: ['Thursday', 'Tuesday', 'Saturday', 'Sunday'], a: 'Thursday', e: 'The day after Wednesday is <b>Thursday</b>.' },
  { t: 'deduce', lv: 4, p: 'My sister is 7. She is 9 years younger than my cousin. How old is my cousin?', o: ['13', '19', '14', '16'], a: '16', e: 'The cousin is older, so add: 7 + 9 = <b>16</b>.' },

  /* ── Number logic (new topic) ── */
  { t: 'numlogic', lv: 4, p: 'This number is half of 20. What is it?', o: ['7', '9', '5', '11', '10'], a: '10', e: '20 ÷ 2 = <b>10</b>.' },
  { t: 'numlogic', lv: 4, p: 'This number is half of 12. What is it?', o: ['5', '8', '4', '6'], a: '6', e: '12 ÷ 2 = <b>6</b>.' },
  { t: 'numlogic', lv: 4, p: 'This number is 7 less than 19. What is it?', o: ['10', '18', '12', '16', '11'], a: '12', e: '19 − 7 = <b>12</b>.' },
  { t: 'numlogic', lv: 4, p: 'This number is bigger than 8 and smaller than 10. What is it?', o: ['8', '7', '10', '9'], a: '9', e: 'The only whole number between 8 and 10 is <b>9</b>.' },
  { t: 'numlogic', lv: 4, p: 'This number is 6 less than 8. What is it?', o: ['2', '3', '6', '1'], a: '2', e: '8 − 6 = <b>2</b>.' },

  /* ── Letter logic → alphabet positions ── */
  { t: 'alpha', lv: 4, p: 'X is the 24th letter of the alphabet. Which letter is 4th?', o: ['D', 'C', 'F', 'Q'], a: 'D', e: 'A, B, C, <b>D</b>.' },
  { t: 'alpha', lv: 4, p: 'M is the 13th letter of the alphabet. Which letter is 8th?', o: ['J', 'K', 'H', 'A'], a: 'H', e: 'Count back five from M: L, K, J, I, <b>H</b>.' },
  { t: 'alpha', lv: 4, p: 'B is the 2nd letter of the alphabet. Which letter is 10th?', o: ['T', 'I', 'J', 'G'], a: 'J', e: 'Count ten from A: the 10th letter is <b>J</b>.' },
  { t: 'alpha', lv: 4, p: 'F is the 6th letter of the alphabet. Which letter is 2nd?', o: ['G', 'O', 'C', 'B'], a: 'B', e: 'A, <b>B</b>.' },
  { t: 'alpha', lv: 4, p: 'U is the 21st letter of the alphabet. Which letter is 25th?', o: ['G', 'W', 'Y', 'X'], a: 'Y', e: 'Count four on from U: V, W, X, <b>Y</b>.' },

  /* ── Find the calculation → related numbers ── */
  { t: 'related', lv: 4, p: 'Add the third number to the first to get the middle number.', s: '( 1 &nbsp;[ ? ]&nbsp; 9 )', o: ['13', '11', '19', '10'], a: '10', e: '1 + 9 = <b>10</b>.' },
  { t: 'related', lv: 4, p: 'Add the third number to the first to get the middle number.', s: '( 20 &nbsp;[ ? ]&nbsp; 10 )', o: ['200', '21', '40', '30'], a: '30', e: '20 + 10 = <b>30</b>.' },
  { t: 'related', lv: 4, p: 'Add the third number to the first to get the middle number.', s: '( 9 &nbsp;[ ? ]&nbsp; 9 )', o: ['0', '19', '99', '18'], a: '18', e: '9 + 9 = <b>18</b>.' },
  { t: 'related', lv: 4, p: 'Add the third number to the first to get the middle number.', s: '( 40 &nbsp;[ ? ]&nbsp; 40 )', o: ['80', '90', '44', '20'], a: '80', e: '40 + 40 = <b>80</b>.' },
  { t: 'related', lv: 4, p: 'Take the third number away from the first to get the middle number.', s: '( 10 &nbsp;[ ? ]&nbsp; 6 )', o: ['8', '3', '4', '5'], a: '4', e: '10 − 6 = <b>4</b>.' },

  /* ── Balance the equation → complete the sum ── */
  { t: 'sums', lv: 4, p: 'Alan has 3 cows. Barbra has 4. How many more cows does Alan need to have the same as Barbra?', s: '3 + ? = 4', o: ['5', '1', '7', '3'], a: '1', e: '4 − 3 = <b>1</b>.' },
  { t: 'sums', lv: 4, p: 'Humphrey has 4 horses. Nelly has 6. How many more horses does Humphrey need?', s: '4 + ? = 6', o: ['2', '7', '1', '5'], a: '2', e: '6 − 4 = <b>2</b>.' },
  { t: 'sums', lv: 4, p: 'Bernie packs 4 notebooks. Bill packs 1. How many must Bernie take out to have the same as Bill?', s: '4 − ? = 1', o: ['2', '9', '3', '4'], a: '3', e: '4 − 1 = <b>3</b>.' },
  { t: 'sums', lv: 4, p: 'Henry has 10 peppers. Harry has 4. How many more does Harry need?', s: '10 = 4 + ?', o: ['6', '7', '4', '3'], a: '6', e: '10 − 4 = <b>6</b>.' },
  { t: 'sums', lv: 4, p: 'Nigel draws 2 dogs. Alice draws 5. How many more must Nigel draw?', s: '2 + ? = 5', o: ['3', '5', '1', '7'], a: '3', e: '5 − 2 = <b>3</b>.' },

  /* ── Substitutions (new topic) ── */
  { t: 'subst', lv: 4, p: 'The picture shows 2 footballs and 3 cricket balls. How many balls are there altogether?', o: ['3', '4', '7', '5'], a: '5', e: '2 + 3 = <b>5</b>.' },
  { t: 'subst', lv: 4, p: 'The picture shows 6 leaves. 3 leaves are taken away. How many are left?', o: ['4', '3', '2', '1'], a: '3', e: '6 − 3 = <b>3</b>.' },
  { t: 'subst', lv: 4, p: 'The picture shows 6 suns and 3 moons. How many pictures are there altogether?', o: ['8', '9', '7', '4'], a: '9', e: '6 + 3 = <b>9</b>.' },
  { t: 'subst', lv: 4, p: 'There are 4 oranges and 2 apples. The 2 apples are taken away. How many pieces of fruit are left?', o: ['5', '3', '2', '4'], a: '4', e: '6 − 2 = <b>4</b>.' },
  { t: 'subst', lv: 4, p: 'A football is worth 20 and a basketball is worth 11. What is football − basketball?', o: ['9', '7', '8', '11'], a: '9', e: '20 − 11 = <b>9</b>.' },
];

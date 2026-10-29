/* ════════════════════════════════════════════════════════════════
   STATION ZERO · shared verbal reasoning engine
   Used by index.html (question mode) and station3d.html (3D station).
   Topics follow the ISEB / GL verbal reasoning question types, grouped
   the way Atom Learning groups them. bank.js holds the checked word
   puzzles (made by tools/build_bank.py); this file makes the rest.
   ════════════════════════════════════════════════════════════════ */

/* ───────────── helpers ───────────── */
const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const pick = a => a[Math.floor(Math.random() * a.length)];
const rint = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const uniq = a => [...new Set(a)];
const ABC = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const LET = 'ABCDE';
const LTR = n => ABC[((n % 26) + 26) % 26];
const POS = c => ABC.indexOf(c.toUpperCase());
const UP = s => s.toUpperCase();

/* ───────────── saved settings and scores ───────────── */
const STORE = 'vr-station-v1';
let SAVE = { stats: {}, name: '', age: 5, topics: null, best: {}, sound: true, run: null };
try { const s = JSON.parse(localStorage.getItem(STORE) || 'null'); if (s) SAVE = Object.assign(SAVE, s); } catch (e) {}
function persist() { try { localStorage.setItem(STORE, JSON.stringify(SAVE)); } catch (e) {} }
function stat(k) { return SAVE.stats[k] || (SAVE.stats[k] = { r: 0, w: 0 }); }

/* ───────────── age setting ─────────────
   Year 4: 4 answer choices, the most common words, small numbers, alphabet strip on.
   Year 5: 5 choices, common words, mixed steps, alphabet strip on.
   Year 6+: 5 choices, harder words, two-step rules, no alphabet strip. */
const AGES = [
  { id: 4, label: 'Year 4', note: '4 choices · everyday words · alphabet strip' },
  { id: 5, label: 'Year 5', note: '5 choices · harder words · alphabet strip' },
  { id: 6, label: 'Year 6+', note: '5 choices · pre-test and 11+ level' },
];
const age = () => SAVE.age || 5;
const nOpts = () => age() === 4 ? 4 : 5;
const helperOn = () => age() <= 5;

let recentItems = [];
function fresh(list, keyFn) {
  keyFn = keyFn || (x => JSON.stringify(x).slice(0, 80));
  let p = list.filter(x => !recentItems.includes(keyFn(x)));
  if (p.length < 2) p = list;
  const it = pick(p);
  recentItems.push(keyFn(it)); if (recentItems.length > 60) recentItems.shift();
  return it;
}
/* items carry lv 4/5/6: choose ones that suit the age setting */
function byLevel(arr, keyFn) {
  const a = age();
  let p = arr.filter(x => x.lv <= a);
  if (a === 6) { const h = p.filter(x => x.lv >= 5); if (h.length >= 6 && Math.random() < 0.75) p = h; }
  if (a === 5) { const m = p.filter(x => x.lv === 5); if (m.length >= 6 && Math.random() < 0.5) p = m; }
  if (p.length < 4) p = arr.filter(x => x.lv <= a + 1);
  if (!p.length) p = arr;
  return fresh(p, keyFn);
}
function mc(right, wrongs, n) {
  n = n || nOpts();
  const w = uniq(wrongs.filter(x => x != null && x !== right)).slice(0, n - 1);
  if (w.length < n - 1) return null;
  const options = shuffle([right, ...w]);
  return { kind: 'mc', options, answer: options.indexOf(right) };
}

/* ════════════════════════════════════════════════════════════════
   VOCABULARY DATA
   ════════════════════════════════════════════════════════════════ */
/* synonym sets: family | part of speech | level | words. Sets in the same family are close in meaning,
   so they are never used as wrong answers for each other. */
const SYN_RAW = `happy|a|4|happy,glad,cheerful,joyful
sad|a|4|sad,unhappy,miserable,upset
big|a|4|big,large,huge,enormous
small|a|4|small,little,tiny
fast|a|4|fast,quick,rapid,speedy
slow|a|4|slow,sluggish,unhurried
angry|a|4|angry,cross,furious,mad
scared|a|4|scared,afraid,frightened,fearful
brave|a|4|brave,bold,fearless,daring
clever|a|4|clever,bright,smart,intelligent
tired|a|4|tired,sleepy,weary,exhausted
quiet|a|4|quiet,silent,hushed
loud|a|4|loud,noisy,deafening
rich|a|4|rich,wealthy,prosperous
hard|a|4|hard,difficult,tricky,tough
easy|a|4|easy,simple,effortless
wet|a|4|wet,damp,soggy,soaked
cold|a|4|cold,chilly,icy,freezing
hot|a|4|hot,boiling,scorching
kind|a|4|kind,caring,thoughtful,considerate
rude|a|4|rude,impolite,cheeky
dirty|a|4|dirty,filthy,grubby,mucky
old|a|4|old,ancient,aged
new|a|4|new,modern,recent
strange|a|4|strange,odd,weird,peculiar,unusual
pretty|a|4|pretty,beautiful,lovely,attractive
shiny|a|4|shiny,gleaming,glossy,sparkling
funny|a|4|funny,amusing,comical,hilarious
empty|a|4|empty,vacant,bare
full|a|4|full,packed,crammed,stuffed
right|a|4|correct,right,accurate,exact
wrong|a|4|wrong,incorrect,mistaken
sure|a|4|sure,certain,positive
hungry|a|4|hungry,starving,famished
thin|a|4|thin,slim,slender,skinny
look|v|4|look,see,watch,observe
shout|v|4|shout,yell,scream,bellow
talk|v|4|talk,speak,chat,chatter
walk|v|4|walk,stroll,wander,amble
run|v|4|run,dash,sprint,race
jump|v|4|jump,leap,hop,spring
begin|v|4|begin,start,commence
finish|v|4|finish,end,complete
break|v|4|break,smash,shatter
hide|v|4|hide,conceal,cover
help|v|4|help,assist,aid,support
choose|v|4|choose,pick,select
shut|v|4|shut,close,seal
build|v|4|build,make,construct,create
throw|v|4|throw,toss,hurl,fling
laugh|v|4|laugh,giggle,chuckle,snigger
cry|v|4|cry,weep,sob
eat|v|4|eat,consume,devour,gobble
grab|v|4|grab,seize,snatch,grasp
mend|v|4|mend,fix,repair
shake|v|4|shake,tremble,shiver,quiver
pull|v|4|pull,tug,drag,haul
house|n|4|house,home,dwelling
path|n|4|path,track,trail,lane
rubbish|n|4|rubbish,litter,waste,junk
friend|n|4|friend,pal,mate,companion
gift|n|4|present,gift
noise|n|4|noise,sound,din,racket
hole|n|4|hole,gap,opening
stone|n|4|stone,rock,pebble
child|n|4|child,kid,youngster
angry|a|5|furious,livid,enraged,irate
small|a|5|tiny,minute,microscopic,minuscule
big|a|5|vast,immense,colossal,massive,gigantic
short|a|5|brief,short,concise
famous|a|5|famous,well-known,renowned,celebrated
calm|a|5|calm,peaceful,tranquil,serene
ready|a|5|ready,prepared,set
boring|a|5|dull,boring,tedious
weak|a|5|weak,feeble,frail
strong|a|5|strong,powerful,mighty,sturdy
honest|a|5|honest,truthful,sincere
lazy|a|5|lazy,idle,slothful
careful|a|5|careful,cautious,wary
busy|a|5|busy,hectic,bustling
wild|a|5|wild,untamed,feral
tidy|a|5|tidy,neat,orderly
smooth|a|5|smooth,sleek,silky
rough|a|5|rough,coarse,bumpy
sad|a|5|gloomy,dismal,dreary,bleak
generous|a|5|generous,giving,charitable
precious|a|5|precious,valuable,priceless
vital|a|5|vital,essential,crucial
fast|a|5|swift,brisk,nimble
curious|a|5|curious,nosy,inquisitive
whisper|v|5|mumble,mutter,murmur,whisper
gather|v|5|gather,collect,assemble
reply|v|5|reply,answer,respond
vanish|v|5|vanish,disappear,fade
allow|v|5|allow,let,permit
damage|v|5|damage,harm,injure,hurt
argue|v|5|argue,quarrel,squabble,bicker
shine|v|5|shine,glow,gleam,glint
fall|v|5|tumble,fall,topple
wander|v|5|wander,roam,ramble,stray
push|v|5|push,shove,thrust
stare|v|5|stare,gaze,gape
hurry|v|5|hurry,rush,hasten
discover|v|5|discover,find,uncover
try|v|5|try,attempt,endeavour
save|v|5|rescue,save,free
praise|v|5|praise,compliment,applaud
journey|n|5|journey,trip,voyage,expedition
danger|n|5|danger,peril,hazard,risk
mistake|n|5|mistake,error,blunder
fear|n|5|fear,terror,dread,fright
courage|n|5|courage,bravery,valour,nerve
anger|n|5|anger,rage,fury
joy|n|5|delight,joy,pleasure,glee
prize|n|5|reward,prize,award
idea|n|5|idea,thought,notion
enemy|n|5|enemy,foe,opponent,rival
crowd|n|5|crowd,mob,throng,horde
centre|n|5|centre,middle,core,heart
edge|n|5|edge,border,rim,brink
storm|n|5|storm,tempest,gale
hut|n|5|hut,shack,shed,cabin
wealth|n|5|wealth,riches,fortune
plenty|a|6|abundant,plentiful,ample,copious
scarce|a|6|scarce,rare,sparse
hostile|a|6|hostile,unfriendly,antagonistic
stubborn|a|6|obstinate,stubborn,headstrong,wilful
shy|a|6|timid,shy,bashful,meek
frugal|a|6|frugal,thrifty,economical
lazy|a|6|lethargic,sluggish,listless
careful|a|6|meticulous,thorough,painstaking
honest|a|6|candid,frank,blunt,forthright
real|a|6|authentic,genuine,real
danger|a|6|hazardous,dangerous,perilous,risky
sinister|a|6|ominous,threatening,menacing,sinister
happy|a|6|jovial,jolly,merry
dry|a|6|arid,dry,parched
clear|a|6|lucid,clear,coherent
old|a|6|obsolete,outdated,old-fashioned
happy|a|6|elated,overjoyed,ecstatic,jubilant
sad|a|6|dejected,downcast,despondent,crestfallen
vague|a|6|ambiguous,unclear,vague
unwilling|a|6|reluctant,unwilling,hesitant
tough|a|6|resilient,tough,hardy
abandon|v|6|abandon,desert,forsake
deter|v|6|deter,discourage,dissuade
reduce|v|6|diminish,lessen,reduce,decrease
endure|v|6|endure,tolerate,bear
exaggerate|v|6|exaggerate,overstate,magnify
annoy|v|6|vex,annoy,irritate,irk
examine|v|6|scrutinise,examine,inspect
buy|v|6|purchase,buy,acquire
copy|v|6|imitate,copy,mimic
persuade|v|6|persuade,convince,coax
climb|v|6|ascend,climb,rise
problem|n|6|dilemma,problem,predicament,quandary
tired|n|6|fatigue,tiredness,exhaustion,weariness
summit|n|6|summit,peak,top,pinnacle
cure|n|6|remedy,cure,treatment
copy|n|6|replica,copy,duplicate,reproduction
worry|n|6|anxiety,worry,unease,apprehension
disaster|n|6|catastrophe,disaster,calamity
area|n|6|vicinity,area,neighbourhood,locality
piece|n|6|fragment,piece,scrap,shard
fuss|n|6|commotion,fuss,uproar,hubbub
keen|n|6|zeal,enthusiasm,eagerness,passion`;
const SYN = SYN_RAW.split('\n').map(l => { const [fam, pos, lv, w] = l.split('|'); return { fam, pos, lv: +lv, w: w.split(',') }; });
const FAM = {};               // word -> set of families it belongs to
SYN.forEach(s => s.w.forEach(w => (FAM[w] = FAM[w] || new Set()).add(s.fam)));

/* opposites: level | part of speech | word | opposite */
const ANT_RAW = `4|a|hot|cold
4|a|big|small
4|a|happy|sad
4|a|fast|slow
4|a|open|shut
4|a|empty|full
4|a|wet|dry
4|a|early|late
4|a|young|old
4|a|hard|soft
4|a|rich|poor
4|a|loud|quiet
4|a|strong|weak
4|a|tall|short
4|a|clean|dirty
4|v|win|lose
4|v|push|pull
4|v|give|take
4|v|buy|sell
4|v|arrive|leave
4|v|laugh|cry
4|n|day|night
4|a|first|last
4|n|top|bottom
4|a|heavy|light
4|a|thick|thin
4|a|wide|narrow
4|a|high|low
4|n|friend|enemy
4|a|noisy|silent
4|a|smooth|rough
4|a|sharp|blunt
4|a|true|false
4|a|safe|dangerous
4|a|polite|rude
4|a|kind|cruel
4|a|awake|asleep
4|a|sweet|sour
4|v|remember|forget
4|v|float|sink
4|a|easy|difficult
4|a|cheap|expensive
4|a|wild|tame
4|a|deep|shallow
4|n|question|answer
4|a|brave|cowardly
5|a|ancient|modern
5|a|generous|mean
5|v|accept|refuse
5|n|victory|defeat
5|v|include|exclude
5|v|increase|decrease
5|n|entrance|exit
5|a|permanent|temporary
5|n|maximum|minimum
5|v|depart|arrive
5|a|rare|common
5|a|fresh|stale
5|a|brief|lengthy
5|n|success|failure
5|v|praise|criticise
5|a|cautious|reckless
5|a|humble|proud
5|a|clumsy|graceful
5|a|lazy|hardworking
5|a|guilty|innocent
5|v|attack|defend
5|v|borrow|lend
5|v|export|import
5|a|vertical|horizontal
5|n|hero|villain
5|n|dawn|dusk
5|a|careful|careless
5|a|calm|stormy
5|a|tidy|messy
5|a|ordinary|extraordinary
5|a|frequent|occasional
5|v|expand|contract
5|a|minor|major
5|a|private|public
5|a|absent|present
5|v|reveal|hide
6|a|abundant|scarce
6|a|hostile|friendly
6|a|obscure|obvious
6|a|timid|bold
6|v|conceal|reveal
6|a|transparent|opaque
6|a|inferior|superior
6|a|frugal|extravagant
6|v|cease|continue
6|a|artificial|natural
6|n|ally|foe
6|n|amateur|professional
6|a|valiant|cowardly
6|a|tranquil|turbulent
6|a|vague|precise
6|n|novice|expert
6|a|reluctant|eager
6|v|praise|condemn
6|a|elated|dejected
6|n|optimist|pessimist
6|v|approve|disapprove
6|a|sociable|reclusive
6|a|compulsory|optional
6|a|fertile|barren
6|v|adore|detest
6|a|flexible|rigid
6|v|ascend|descend
6|a|plentiful|sparse
6|a|lethargic|energetic
6|a|candid|evasive
6|v|diminish|enlarge
6|a|benevolent|malevolent`;
const ANT = ANT_RAW.split('\n').map(l => { const [lv, pos, a, b] = l.split('|'); return { lv: +lv, pos, a, b }; });
const famOf = w => FAM[w] ? [...FAM[w]] : [w];
const ANTF = new Set();      // family|family pairs that are opposites
ANT.forEach(p => famOf(p.a).forEach(x => famOf(p.b).forEach(y => { ANTF.add(x + '|' + y); ANTF.add(y + '|' + x); })));
const isSyn = (x, y) => x === y || famOf(x).some(f => famOf(y).includes(f));
const isAnt = (x, y) => famOf(x).some(f => famOf(y).some(g => ANTF.has(f + '|' + g)));
const synsOf = w => uniq(SYN.filter(s => s.w.includes(w)).flatMap(s => s.w)).filter(x => x !== w);
const antsOf = w => uniq(ANT.flatMap(p => p.a === w ? [p.b] : p.b === w ? [p.a] : []));
const POSW = pos => uniq(SYN.filter(s => s.pos === pos).flatMap(s => s.w));

/* word groups for odd-ones-out: name | level | words */
const CAT_RAW = `colours|4|red,blue,green,yellow,purple,pink,brown,grey
fruits|4|apple,pear,banana,plum,cherry,grape,peach,lemon,mango
vegetables|4|carrot,potato,pea,cabbage,onion,leek,turnip,parsnip,sprout
farm animals|4|cow,pig,sheep,goat,horse,hen,donkey
wild animals|4|lion,tiger,zebra,giraffe,elephant,monkey,hippo,rhino
birds|4|robin,sparrow,eagle,owl,crow,swan,pigeon,parrot,penguin
parts of the body|4|arm,leg,hand,foot,knee,elbow,nose,ear,chin
clothes|4|shirt,coat,sock,scarf,jumper,skirt,glove,trousers
furniture|4|table,chair,sofa,bed,desk,wardrobe,stool,cupboard
weather|4|rain,snow,fog,hail,wind,sleet,thunder,drizzle
shapes|4|circle,square,triangle,oval,rectangle,hexagon,pentagon
vehicles|4|car,bus,lorry,van,tractor,bicycle,train,scooter
drinks|4|milk,juice,tea,water,lemonade,cocoa,coffee
instruments|4|piano,guitar,drum,violin,flute,trumpet,harp,cello
sports|4|football,tennis,rugby,cricket,hockey,netball,golf,swimming
planets|4|Mars,Venus,Jupiter,Saturn,Mercury,Neptune,Uranus
tools|4|hammer,saw,spanner,drill,chisel,screwdriver,pliers
rooms|4|kitchen,bedroom,bathroom,hall,attic,cellar,lounge
days|4|Monday,Tuesday,Wednesday,Thursday,Friday,Saturday,Sunday
metals|5|iron,gold,silver,copper,zinc,aluminium,bronze
feelings|5|joy,anger,fear,sadness,pride,jealousy,surprise
trees|5|oak,ash,beech,elm,birch,willow,pine,yew,maple
flowers|5|rose,daisy,tulip,lily,daffodil,poppy,bluebell,snowdrop
containers|5|box,jar,basket,crate,bucket,bottle,barrel,sack
jobs|5|doctor,nurse,teacher,pilot,farmer,baker,builder,plumber
water|5|river,lake,pond,sea,ocean,stream,canal,brook
buildings|5|castle,palace,cottage,church,tower,barn,mansion,bungalow
insects|5|ant,bee,wasp,beetle,moth,ladybird,butterfly,grasshopper
months|5|January,March,April,June,July,August,October,December
reptiles|6|lizard,snake,crocodile,tortoise,turtle,gecko,iguana
shapes of land|6|valley,hill,mountain,plain,plateau,cliff,canyon,glacier
measures of length|6|metre,mile,inch,yard,foot,kilometre,centimetre
punctuation|6|comma,colon,hyphen,apostrophe,semicolon,bracket,dash
royalty|6|king,queen,prince,princess,duke,duchess,emperor`;
const CATS = CAT_RAW.split('\n').map(l => { const [name, lv, w] = l.split('|'); return { name, lv: +lv, w: w.split(',') }; });
const inCat = (w, c) => c.w.includes(w);

/* one word, two meanings: answer | pair 1 | pair 2 | two traps (each fits one pair) | level */
const HOMO_RAW = `ring|band,hoop|call,phone|loop,shout|4
light|weightless,feathery|lamp,torch|thin,candle|4
fair|just,honest|carnival,fete|true,circus|4
watch|look,observe|clock,timer|see,alarm|4
rock|stone,boulder|sway,swing|pebble,wobble|4
fly|soar,glide|gnat,midge|float,beetle|4
kind|nice,caring|type,sort|gentle,group|4
tip|point,end|hint,clue|top,idea|4
bow|bend,stoop|ribbon,knot|kneel,string|4
letter|note,message|character,symbol|card,number|4
stick|glue,attach|twig,branch|join,log|4
fire|blaze,flames|sack,dismiss|smoke,expel|4
trip|journey,outing|stumble,fall|tour,slip|4
change|alter,adjust|coins,cash|swap,money|4
club|bat,stick|society,group|racket,team|4
wave|breaker,ripple|signal,gesture|tide,point|4
spring|jump,leap|source,well|hop,stream|4
train|teach,coach|engine,carriage|instruct,coach|4
play|drama,show|frolic,romp|film,skip|4
present|gift,offering|here,attending|parcel,near|5
pen|biro,quill|enclosure,fold|pencil,cage|5
squash|crush,flatten|drink,cordial|squeeze,juice|5
mean|unkind,stingy|signify,imply|cruel,show|5
fine|well,healthy|penalty,charge|okay,payment|5
lean|thin,slim|tilt,slope|skinny,angle|5
row|line,rank|quarrel,argument|queue,fight|5
bolt|dash,sprint|lock,bar|race,key|5
seal|close,fasten|stamp,emblem|shut,badge|5
lie|fib,untruth|recline,rest|trick,sleep|5
hide|conceal,cover|skin,pelt|bury,fur|5
bright|clever,smart|shining,vivid|wise,colourful|5
jam|preserve,jelly|squeeze,cram|honey,crush|5
post|pole,stake|mail,send|fence,letter|5
draw|sketch,paint|tie,stalemate|colour,even|5
pitch|field,ground|throw,toss|park,catch|5
shed|hut,outbuilding|drop,cast|barn,lose|5
firm|solid,hard|company,business|stiff,shop|5
bowl|dish,basin|roll,pitch|plate,spin|5
match|game,contest|equal,pair|race,twin|5
nail|tack,pin|claw,talon|screw,paw|5
sink|basin,tub|descend,drop|bath,fall|5
compound|enclosure,yard|mixture,blend|garden,solution|6
novel|book,story|new,original|poem,fresh|6
stern|strict,severe|back,rear|harsh,deck|6
sound|noise,tone|healthy,solid|music,strong|6
plain|simple,ordinary|prairie,grassland|easy,meadow|6
sentence|punishment,term|phrase,clause|prison,word|6
season|period,spell|flavour,spice|summer,salt|6
cross|angry,annoyed|traverse,span|furious,bridge|6
stalk|stem,shoot|track,hunt|root,chase|6
suit|outfit,costume|befit,flatter|dress,match|6
scale|climb,ascend|flake,plate|mount,shell|6
lap|circuit,round|lick,slurp|race,sip|6
patient|calm,tolerant|invalid,sufferer|quiet,nurse|6
grate|grind,shred|fireplace,hearth|chop,chimney|6`;
const HOMO = HOMO_RAW.split('\n').map(l => { const [a, p1, p2, t, lv] = l.split('|'); return { a, p1: p1.split(','), p2: p2.split(','), t: t.split(','), lv: +lv }; });

/* connections for "is to" questions: name | level | explanation | pairs */
const REL_RAW = `young|4|A {b} is a young {a}.|cat:kitten,dog:puppy,cow:calf,sheep:lamb,horse:foal,pig:piglet,duck:duckling,frog:tadpole,bear:cub,goat:kid,hen:chick
young|5|A {b} is a young {a}.|deer:fawn,swan:cygnet,kangaroo:joey,owl:owlet,goose:gosling,eagle:eaglet,fox:cub
home|4|A {a} lives in a {b}.|bird:nest,bee:hive,dog:kennel,horse:stable,rabbit:burrow,pig:sty,spider:web,lion:den
home|6|A {a} lives in a {b}.|badger:sett,squirrel:drey,eagle:eyrie,beaver:lodge,otter:holt,hare:form
sound|4|A {a} makes the sound "{b}".|dog:bark,cow:moo,lion:roar,duck:quack,snake:hiss,horse:neigh,owl:hoot,bee:buzz,mouse:squeak,wolf:howl,pig:grunt
sound|5|A {a} makes the sound "{b}".|donkey:bray,frog:croak,dove:coo,crow:caw,elephant:trumpet,goose:honk
female|4|{b} is the female of {a}.|king:queen,prince:princess,boy:girl,uncle:aunt,nephew:niece,son:daughter,brother:sister,husband:wife,lord:lady
female|5|{b} is the female of {a}.|bull:cow,stallion:mare,ram:ewe,gander:goose,fox:vixen,drake:duck,cockerel:hen,stag:hind
part|4|A {a} is part of a {b}.|page:book,petal:flower,wheel:car,leaf:tree,finger:hand,toe:foot,brick:wall,link:chain,key:piano,word:sentence
tool|5|A {a} uses a {b}.|painter:brush,carpenter:saw,writer:pen,gardener:spade,doctor:stethoscope,fisherman:rod,artist:easel,surgeon:scalpel,astronomer:telescope
place|5|A {a} works in a {b}.|teacher:school,doctor:hospital,chef:kitchen,pilot:cockpit,judge:court,farmer:farm,actor:theatre,astronaut:spacecraft,librarian:library
group|6|A group of {a} is called a {b}.|sheep:flock,cows:herd,fish:shoal,wolves:pack,bees:swarm,lions:pride,geese:gaggle,puppies:litter,ships:fleet,owls:parliament
more|5|{b} is a stronger form of {a}.|warm:hot,cool:freezing,damp:soaked,hungry:starving,tired:exhausted,happy:ecstatic,angry:furious,big:enormous,small:tiny,cross:livid
past|4|{b} is the past tense of {a}.|run:ran,go:went,swim:swam,eat:ate,see:saw,fly:flew,write:wrote,sing:sang,drink:drank,ride:rode
past|5|{b} is the past tense of {a}.|buy:bought,catch:caught,think:thought,begin:began,freeze:froze,teach:taught,bring:brought,fight:fought,seek:sought,steal:stole
plural|4|{b} is the plural of {a}.|mouse:mice,child:children,foot:feet,tooth:teeth,man:men,woman:women,goose:geese,person:people
plural|6|{b} is the plural of {a}.|ox:oxen,cactus:cacti,fungus:fungi,crisis:crises,louse:lice,die:dice,medium:media,stimulus:stimuli`;
const REL = REL_RAW.split('\n').map(l => { const [name, lv, ex, p] = l.split('|'); return { name, lv: +lv, ex, pairs: p.split(',').map(x => x.split(':')) }; });

/* sentences for the GL layout of missing three letters: the word appears in capitals with the letters taken out */
const M3SENT = { weather: 'The {} was sunny all week.', husband: 'Her {} cooked dinner.', thousand: 'A {} people came to the match.',
  research: 'We did some {} on volcanoes.', tomorrow: 'We are going swimming {}.', another: 'Can I have {} biscuit?',
  argument: 'The twins had an {} about the remote.', actually: 'I thought it was easy, but it was {} hard.', attended: 'Everyone {} the school play.',
  improved: 'His handwriting has {} this term.', elements: 'Oxygen and gold are both chemical {}.', knowing: 'She smiled, {} the answer.',
  unknown: 'The letter came from an {} sender.', focused: 'The goalkeeper stayed {} on the ball.', creature: 'A strange {} crawled out of the pond.',
  accident: 'I spilt the paint by {}.', shouting: 'Stop {} in the corridor!', jumping: 'The horse was {} over the fences.',
  climbing: 'We went {} in the mountains.', opponent: 'He shook hands with his {} after the game.', forecast: 'The weather {} says it will rain.',
  offended: 'She was {} by the rude comment.', occupied: 'The bathroom was {}, so I waited.', sitting: 'The cat was {} on the wall.',
  grandma: 'My {} knits jumpers.', teenager: 'My brother is a {} now.', punished: 'He was {} for breaking the window.',
  delicate: 'Be careful with that {} vase.', earliest: 'What is your {} memory?', evidence: 'The detective found new {}.',
  counting: 'She was {} the sheep.', testing: 'The teacher is {} our spelling.' };

const NAMES = ['Ali', 'Ben', 'Cara', 'Dev', 'Ella', 'Finn', 'Grace', 'Harry', 'Isla', 'Jack', 'Kemi', 'Leo', 'Maya', 'Noah', 'Omar', 'Priya', 'Ruby', 'Sam', 'Tom', 'Zara'];
const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

/* ════════════════════════════════════════════════════════════════
   QUESTION MAKERS
   Each returns { kind, options|groups, answer, prompt, explain, key } or null.
   kind 'mc'   : one answer from a list
   kind 'pair' : one word from each of two groups
   kind 'two'  : two words from one list
   ════════════════════════════════════════════════════════════════ */
const box = s => `<span class="vr-show">${s}</span>`;
const word = s => `<b class="target">${esc(s)}</b>`;
const strip = () => helperOn() ? `<span class="vr-abc">${[...ABC].map((c, i) => `<i><b>${c}</b><small>${i + 1}</small></i>`).join('')}</span>` : '';

function synLevelSets(pos) { const a = age(); return SYN.filter(s => s.lv <= a && (!pos || s.pos === pos) && s.w.length >= 2); }
function otherWords(target, pos, n, avoid) {
  const a = age();
  const pool = shuffle(SYN.filter(s => s.pos === pos && s.lv <= a).flatMap(s => s.w))
    .filter(w => !isSyn(w, target) && !(avoid || []).some(x => isSyn(x, w) || x === w));
  return uniq(pool).slice(0, n);
}

const MAKE = {
  /* ── VOCABULARY ── */
  syn() {
    const s = byLevel(synLevelSets().map(x => Object.assign({}, x)), x => x.w[0]);
    const [t, c] = shuffle(s.w);
    const traps = antsOf(t).concat(antsOf(c)).filter(x => !isSyn(x, t));
    const q = mc(c, shuffle(traps).slice(0, 1).concat(otherWords(t, s.pos, 6, [c])));
    if (!q) return null;
    const rest = s.w.filter(x => x !== t && x !== c);
    return Object.assign(q, { key: 'syn:' + t, prompt: `Which word is closest in meaning to ${word(t)}?`,
      explain: `<b>${esc(t)}</b> and <b>${esc(c)}</b> mean nearly the same.${rest.length ? ` So do: ${esc(rest.join(', '))}.` : ''}` });
  },
  ant() {
    const p = byLevel(ANT, x => x.a);
    const [t, c] = Math.random() < 0.5 ? [p.a, p.b] : [p.b, p.a];
    const traps = synsOf(t).filter(x => !isAnt(x, t));             // a word with the SAME meaning is the classic trap
    const pool = shuffle(ANT.filter(x => x.pos === p.pos && x !== p && x.lv <= age()).flatMap(x => [x.a, x.b])).filter(w => !isAnt(w, t) && !isSyn(w, c) && w !== t);
    const q = mc(c, shuffle(traps).slice(0, age() === 4 ? 1 : 2).concat(pool));
    if (!q) return null;
    return Object.assign(q, { key: 'ant:' + t, prompt: `Which word is most nearly <u>opposite</u> in meaning to ${word(t)}?`,
      explain: `<b>${esc(t)}</b> and <b>${esc(c)}</b> are opposites.${traps.length ? ` <b>${esc(traps[0])}</b> means the same as ${esc(t)}, not the opposite.` : ''}` });
  },
  synpair() {
    for (let k = 0; k < 40; k++) {
      const s = byLevel(synLevelSets(), x => x.w[0]);
      const [a, b] = shuffle(s.w);
      const ap = pick(ANT.filter(x => x.lv <= age() && !isSyn(x.a, a) && !isSyn(x.b, a) && !isAnt(x.a, a) && !isAnt(x.b, a)));
      const fill = otherWords(a, pick(['a', 'v', 'n']), 6, [b, ap.a, ap.b]);
      if (fill.length < 2) continue;
      const g1 = [a, ap.a, fill[0]], g2 = [b, ap.b, fill[1]];
      let clash = false;
      g1.forEach(x => g2.forEach(y => { if (!(x === a && y === b) && isSyn(x, y)) clash = true; }));
      if (clash || new Set([...g1, ...g2]).size < 6) continue;
      const G1 = shuffle(g1), G2 = shuffle(g2);
      return { kind: 'pair', groups: [G1, G2], answer: [G1.indexOf(a), G2.indexOf(b)], key: 'synpair:' + a,
        prompt: `Choose one word from each group. The two words must be <b>closest in meaning</b>.`,
        explain: `<b>${esc(a)}</b> and <b>${esc(b)}</b> mean nearly the same. <b>${esc(ap.a)}</b> and <b>${esc(ap.b)}</b> are opposites, not the same.` };
    }
    return null;
  },
  antpair() {
    for (let k = 0; k < 40; k++) {
      const p = byLevel(ANT, x => x.a);
      const [a, b] = shuffle([p.a, p.b]);
      const s = pick(synLevelSets().filter(x => !isSyn(x.w[0], a) && !isSyn(x.w[0], b) && !isAnt(x.w[0], a) && !isAnt(x.w[0], b)));
      const [x1, x2] = shuffle(s.w);
      const fill = otherWords(a, pick(['a', 'v', 'n']), 8, [b, x1, x2]).filter(w => !isAnt(w, a) && !isAnt(w, b));
      if (fill.length < 2) continue;
      const g1 = [a, x1, fill[0]], g2 = [b, x2, fill[1]];
      let clash = false;
      g1.forEach(x => g2.forEach(y => { if (!(x === a && y === b) && isAnt(x, y)) clash = true; }));
      if (clash || new Set([...g1, ...g2]).size < 6) continue;
      const G1 = shuffle(g1), G2 = shuffle(g2);
      return { kind: 'pair', groups: [G1, G2], answer: [G1.indexOf(a), G2.indexOf(b)], key: 'antpair:' + a,
        prompt: `Choose one word from each group. The two words must be most nearly <b>opposite</b> in meaning.`,
        explain: `<b>${esc(a)}</b> and <b>${esc(b)}</b> are opposites. <b>${esc(x1)}</b> and <b>${esc(x2)}</b> mean the same, so they are not the answer.` };
    }
    return null;
  },
  homo() {
    const h = byLevel(HOMO, x => x.a);
    const others = shuffle(HOMO.filter(x => x !== h)).map(x => x.a);
    const q = mc(h.a, h.t.concat(others));
    if (!q) return null;
    return Object.assign(q, { key: 'homo:' + h.a,
      prompt: `Which word goes equally well with both pairs of words?${box(`( ${esc(h.p1.join(', '))} )&nbsp;&nbsp;&nbsp;( ${esc(h.p2.join(', '))} )`)}`,
      explain: `<b>${esc(h.a)}</b> can mean ${esc(h.p1.join(' or '))}. It can also mean ${esc(h.p2.join(' or '))}. <b>${esc(h.t[0])}</b> only fits the first pair.` });
  },
  odd2() {
    const a = age();
    if (a >= 5 && Math.random() < 0.45) {          // three words with the same meaning, two that do not belong
      for (let k = 0; k < 30; k++) {
        const s = byLevel(synLevelSets().filter(x => x.w.length >= 3), x => x.w[0]);
        const t = pick(SYN.filter(x => x.pos === s.pos && x.lv <= a && x.w.length >= 2 && !isSyn(x.w[0], s.w[0])));
        if (!t) continue;
        const three = shuffle(s.w).slice(0, 3), two = shuffle(t.w).slice(0, 2);
        if (two.some(w => three.some(x => isSyn(w, x)))) continue;
        const opts = shuffle([...three, ...two]);
        return { kind: 'two', options: opts, answer: two.map(w => opts.indexOf(w)).sort((x, y) => x - y), key: 'odd2:' + s.w[0],
          prompt: `Three of these words are related in meaning. Which <b>two</b> words do not go with them?`,
          explain: `<b>${esc(three.join(', '))}</b> all mean nearly the same. <b>${esc(two.join(' and '))}</b> do not.` };
      }
    }
    for (let k = 0; k < 30; k++) {
      const c = byLevel(CATS, x => x.name), d = pick(CATS.filter(x => x !== c && x.lv <= Math.max(a, 5)));
      const three = shuffle(c.w).slice(0, 3), two = shuffle(d.w.filter(w => !inCat(w, c))).slice(0, 2);
      if (two.length < 2 || three.some(w => inCat(w, d))) continue;
      const opts = shuffle([...three, ...two]);
      return { kind: 'two', options: opts, answer: two.map(w => opts.indexOf(w)).sort((x, y) => x - y), key: 'odd2:' + c.name,
        prompt: `Three of these words go together. Which <b>two</b> words do not go with them?`,
        explain: `<b>${esc(three.join(', '))}</b> are all ${esc(c.name)}. <b>${esc(two.join(' and '))}</b> are ${esc(d.name)}.` };
    }
    return null;
  },
  analogy() {
    const a = age();
    const rels = REL.filter(r => r.lv <= a);
    if (a >= 5) {   // opposites and same-meaning connections from the word lists
      rels.push({ name: 'opp', lv: 5, ex: '{a} and {b} are opposites.', pairs: shuffle(ANT.filter(p => p.lv <= a)).slice(0, 12).map(p => [p.a, p.b]) });
      rels.push({ name: 'same', lv: 5, ex: '{a} and {b} mean nearly the same.', pairs: shuffle(SYN.filter(s => s.lv <= a)).slice(0, 12).map(s => shuffle(s.w).slice(0, 2)) });
    }
    for (let k = 0; k < 30; k++) {
      const r = pick(rels);
      const [p1, p2] = shuffle(r.pairs).slice(0, 2);
      if (!p2 || p1[0] === p2[0] || p1[1] === p2[1]) continue;
      // traps: the same first word in a different connection (dog is to kennel, dog is to bark)
      const traps = REL.filter(x => x.name !== r.name).flatMap(x => x.pairs.filter(p => p[0] === p2[0]).map(p => p[1]));
      const same = r.pairs.map(p => p[1]).filter(w => w !== p2[1] && w !== p1[1] && !(r.name === 'opp' && isAnt(w, p2[0])) && !(r.name === 'same' && isSyn(w, p2[0])));
      const q = mc(p2[1], shuffle(traps).slice(0, 2).concat(shuffle(same)));
      if (!q) continue;
      const fill = (p) => r.ex.replace(/\{a\}/g, p[0]).replace(/\{b\}/g, p[1]);
      const cap = s => s.charAt(0).toUpperCase() + s.slice(1);
      return Object.assign(q, { key: 'analogy:' + p2[0],
        prompt: `Complete the connection.${box(`<b>${esc(p1[0])}</b> is to <b>${esc(p1[1])}</b> as <b>${esc(p2[0])}</b> is to <span class="blank">?</span>`)}`,
        explain: `${esc(cap(fill(p1)))} ${esc(cap(fill(p2)))}` });
    }
    return null;
  },

  /* ── FINDING WORDS ── */
  hidden() {
    if (Math.random() < 0.45) {                         // GL layout: choose the pair of words that hides the word
      const pool = BANK.hidden.filter(x => x.x && x.s.split(' ').length - 1 - x.x.length >= nOpts() - 1);
      if (pool.length) {
        const h = byLevel(pool, x => x.s + 'p'), ws = h.s.split(' '), clean = w => w.replace(/[^A-Za-z’']/g, '');
        const pairs = ws.slice(0, -1).map((w, i) => clean(w) + ' ' + clean(ws[i + 1]));
        let at = -1;
        for (let i = 0; i < pairs.length && at < 0; i++) { const a = clean(ws[i]).toLowerCase(), b = clean(ws[i + 1]).toLowerCase(); for (let k = 1; k <= 3; k++) if (a.length >= k && b.length >= 4 - k && a.slice(-k) + b.slice(0, 4 - k) === h.a) { at = i; break; } }
        if (at >= 0) {
          const wrong = pairs.filter((p, i) => i !== at && !h.x.includes(i));
          const q = mc(pairs[at], shuffle(wrong));
          if (q) return Object.assign(q, { key: 'hidden:' + h.a,
            prompt: `A four-letter word is hidden across the end of one word and the start of the next. Which <b>pair of words</b> hides it?<span class="sentence">${esc(h.s)}</span>`,
            explain: `<b>${esc(pairs[at])}</b> hides <b>${esc(h.a)}</b>.` });
        }
      }
    }
    const h = byLevel(BANK.hidden, x => x.s);
    const q = mc(h.a, shuffle(h.d));
    if (!q) return null;
    // show where it hides: find the four letters that run across a space
    const ch = [], wi = [];
    let wn = 0;
    [...h.s].forEach((c, i) => { if (c === ' ') wn++; else if (/[A-Za-z]/.test(c)) { ch.push(i); wi.push(wn); } });
    const flat = ch.map(i => h.s[i].toLowerCase()).join('');
    let at = -1;
    for (let i = 0; i + 4 <= flat.length; i++) if (flat.slice(i, i + 4) === h.a && wi[i] !== wi[i + 3]) { at = i; break; }
    let shown = esc(h.s);
    if (at >= 0) { const from = ch[at], to = ch[at + 3] + 1; shown = esc(h.s.slice(0, from)) + '<u>' + esc(h.s.slice(from, to)) + '</u>' + esc(h.s.slice(to)); }
    return Object.assign(q, { key: 'hidden:' + h.a,
      prompt: `A four-letter word is hidden across the end of one word and the start of the next. Which word is it?<span class="sentence">${esc(h.s)}</span>`,
      explain: `<b>${esc(h.a)}</b> is hidden here: ${shown}` });
  },
  jumbled() {
    const j = byLevel(BANK.jumbled, x => x.s);
    let mix = j.a;
    for (let k = 0; k < 20 && (mix === j.a); k++) mix = shuffle([...j.a]).join('');
    const sent = esc(j.s).replace(/\[\w+\]/, `<b class="target">${UP(mix)}</b>`);
    const q = mc(j.a, j.d);
    if (!q) return null;
    return Object.assign(q, { key: 'jumbled:' + j.a,
      prompt: `The letters of the word in capitals are mixed up. Which word should it be?<span class="sentence">${sent}</span>`,
      explain: `<b>${UP(mix)}</b> rearranged makes <b>${esc(j.a)}</b>: ${esc(j.s.replace(/[\[\]]/g, ''))}` });
  },
  jumsent() {
    const j = byLevel(BANK.jumsent, x => x.s);
    const words = j.s.split(' ');
    const mixed = shuffle([...words, j.x]);
    const others = shuffle(uniq(words.filter(w => !['the', 'a', 'an', 'in', 'on', 'at', 'to', 'of'].includes(w) && w !== j.x)));
    const q = mc(j.x, others);
    if (!q) return null;
    return Object.assign(q, { key: 'jumsent:' + j.x,
      prompt: `These words can be rearranged to make a sentence, with one word left over. Which word is <u>not</u> needed?${box(esc(mixed.join('  ')))}`,
      explain: `The sentence is: <i>${esc(j.s.charAt(0).toUpperCase() + j.s.slice(1))}.</i> <b>${esc(j.x)}</b> is not needed.` });
  },

  /* ── BUILDING WORDS ── */
  joining() {
    const j = byLevel(BANK.joining, x => x.w);
    const G1 = shuffle(j.g1), G2 = shuffle(j.g2);
    return { kind: 'pair', groups: [G1, G2], answer: [G1.indexOf(j.a[0]), G2.indexOf(j.a[1])], key: 'joining:' + j.w,
      prompt: `Choose one word from each group to make a new word. The word from the first group comes first.`,
      explain: `<b>${esc(j.a[0])}</b> + <b>${esc(j.a[1])}</b> = <b>${esc(j.w)}</b>` };
  },
  morph() {
    const m = byLevel(BANK.morph, x => x.w1 + x.w3);
    const q = mc(m.a, shuffle(m.d.filter(d => /[aeiouy]/.test(d))));
    if (!q) return null;
    q.options = q.options.map(UP);
    return Object.assign(q, { key: 'morph:' + m.a,
      prompt: `Change the first word into the last word by changing <b>one letter at a time</b>. Each step makes a real word. Which word goes in the middle?${box(`${UP(m.w1)} &nbsp;→&nbsp; <span class="blank">?</span> &nbsp;→&nbsp; ${UP(m.w3)}`)}`,
      explain: `${UP(m.w1)} → <b>${UP(m.a)}</b> → ${UP(m.w3)}. Each step changes one letter.` });
  },
  transfer() {
    const t = byLevel(BANK.transfer, x => x.w1 + x.w2);
    const letters = uniq([...t.w1.toUpperCase()]);
    const extra = shuffle([...'AEIOURSTLN'].filter(c => !letters.includes(c)));
    const opts = shuffle(letters).filter(c => c !== t.a.toUpperCase()).concat(extra);
    const q = mc(t.a.toUpperCase(), opts);
    if (!q) return null;
    return Object.assign(q, { key: 'transfer:' + t.w1,
      prompt: `Move <b>one letter</b> from the first word to the second word to make two new words. Do not change the order of the other letters. Which letter moves?${box(`${UP(t.w1)} &nbsp;&nbsp;&nbsp; ${UP(t.w2)}`)}`,
      explain: `Take <b>${UP(t.a)}</b> out of ${UP(t.w1)} to make <b>${UP(t.r[0])}</b>. Put it into ${UP(t.w2)} to make <b>${UP(t.r[1])}</b>.` });
  },
  missing3() {
    const withS = BANK.missing3.filter(x => M3SENT[x.w] && x.w.slice(x.i, x.i + 3) === x.a);
    if (withS.length && Math.random() < 0.5) {          // GL layout: the word sits in a sentence with three letters missing
      const m = byLevel(withS, x => x.w), W = UP(m.w), cut = W.slice(0, m.i) + W.slice(m.i + 3);
      const q = mc(m.a, shuffle(m.d.filter(d => /[aeiouy]/.test(d))));
      if (q) {
        q.options = q.options.map(UP);
        return Object.assign(q, { key: 'missing3:' + m.w,
          prompt: `The word in capitals has had three letters next to each other taken out. Those three letters spell a word. Which word completes the sentence?<span class="sentence">${esc(M3SENT[m.w]).replace('{}', '<b>' + cut + '</b>')}</span>`,
          explain: `${cut} needs <b>${UP(m.a)}</b> to make <b>${W}</b>: ${esc(M3SENT[m.w].replace('{}', m.w))}` });
      }
    }
    const m = byLevel(BANK.missing3, x => x.w);
    const q = mc(m.a, shuffle(m.d.filter(d => /[aeiouy]/.test(d))));
    if (!q) return null;
    q.options = q.options.map(UP);
    const W = UP(m.w);
    return Object.assign(q, { key: 'missing3:' + m.w,
      prompt: `Three letters next to each other are missing from the word in capitals. They spell a three-letter word. Which three-letter word completes it?${box(`${W.slice(0, m.i)}<span class="gaps">_ _ _</span>${W.slice(m.i + 3)}`)}`,
      explain: `${[W.slice(0, m.i), `<b>${UP(m.a)}</b>`, W.slice(m.i + 3)].filter(Boolean).join(' + ')} = <b>${W}</b>` });
  },
  letterpair() {
    const p = byLevel(BANK.letterpair, x => x.w.join());
    const common = shuffle([...'ETAOINSRHLDCUMPGBYWFK'].filter(c => c.toLowerCase() !== p.a));
    const q = mc(p.a.toUpperCase(), common);
    if (!q) return null;
    const f = p.f.map(UP);
    return Object.assign(q, { key: 'letterpair:' + p.a + p.w[0],
      prompt: `Find the <b>one letter</b> that completes all four words. It ends the first word and starts the second word in each pair.${box(`${f[0]} ( ? ) ${f[1]} &nbsp;&nbsp;&nbsp;&nbsp; ${f[2]} ( ? ) ${f[3]}`)}`,
      explain: `<b>${UP(p.a)}</b> makes ${p.w.map(w => '<b>' + UP(w) + '</b>').join(', ')}.` });
  },

  /* ── CODES AND SEQUENCES ── */
  alpha() {
    const a = age(), t = rint(0, a === 4 ? 1 : a === 5 ? 2 : 3);
    let right, prompt, explain;
    if (t === 0) {               // places after / before
      const k = rint(2, a === 4 ? 5 : a === 5 ? 9 : 14), fwd = Math.random() < (a === 4 ? 0.75 : 0.5);
      const s = fwd ? rint(0, 25 - k) : rint(k, 25), e = fwd ? s + k : s - k;
      right = LTR(e);
      prompt = `Which letter is <b>${k} places ${fwd ? 'after' : 'before'}</b> ${word(LTR(s))} in the alphabet?`;
      explain = `${LTR(s)} is letter ${s + 1}. ${s + 1} ${fwd ? '+' : '−'} ${k} = ${e + 1}, which is <b>${right}</b>.`;
    } else if (t === 1) {        // halfway
      const g = 2 * rint(2, a === 4 ? 4 : 8), s = rint(0, 25 - g), m = s + g / 2;
      right = LTR(m);
      prompt = `Which letter is exactly <b>halfway</b> between ${word(LTR(s))} and ${word(LTR(s + g))} in the alphabet?`;
      explain = `${LTR(s)} is ${s + 1} and ${LTR(s + g)} is ${s + g + 1}. Halfway is ${m + 1}, which is <b>${right}</b>.`;
    } else if (t === 2) {        // alphabet backwards
      const k = rint(3, 12);
      right = LTR(26 - k);
      prompt = `If the alphabet were written <b>backwards</b> (Z first), which letter would be number <b>${k}</b>?`;
      explain = `Count back from Z: Z is 1, Y is 2, X is 3 … letter ${k} is <b>${right}</b>.`;
    } else {                     // mirror letters
      const s = rint(1, 12);
      right = LTR(25 - s);
      prompt = `${word(LTR(s))} is letter ${s + 1} from the <b>start</b> of the alphabet. Which letter is in the same place counting from the <b>end</b>?`;
      explain = `Letter ${s + 1} from the end is <b>${right}</b>. Pairs from the outside in: A–Z, B–Y, C–X, D–W, E–V …`;
    }
    const near = shuffle([-2, -1, 1, 2, 3, -3].map(d => LTR(POS(right) + d)));
    const q = mc(right, near);
    return Object.assign(q, { key: 'alpha:' + t, prompt: prompt + strip(), explain, alpha: true });
  },
  letseq() {
    const a = age(), len = a === 4 ? (Math.random() < 0.4 ? 1 : 2) : a === 5 ? 2 : pick([2, 2, 3]);
    const pos = [];
    const same = a === 4 ? pick([1, 2]) : 0;
    for (let i = 0; i < len; i++) {
      let s = rint(0, 25), d, grow = 0;
      if (a === 4) d = same;
      else if (a === 5) d = pick([-3, -2, -1, 1, 2, 3, 4]);
      else { d = pick([-4, -3, -2, -1, 1, 2, 3, 5]); if (Math.random() < 0.35) grow = Math.sign(d); }
      pos.push({ s, d, grow });
    }
    const N = 5, term = (k) => pos.map(p => LTR(p.s + p.d * k + p.grow * k * (k - 1) / 2)).join('');
    const terms = Array.from({ length: N + 1 }, (_, k) => term(k));
    const miss = a === 6 && Math.random() < 0.35 ? rint(1, N - 1) : N;
    const right = terms[miss];
    const wrong = [];
    for (let i = 0; i < len; i++) for (const e of [1, -1, 2]) { const t = right.split(''); t[i] = LTR(POS(t[i]) + e); wrong.push(t.join('')); }
    if (len > 1) wrong.push([...right].reverse().join(''));
    const q = mc(right, shuffle(wrong));
    if (!q) return null;
    const shown = (miss === N ? terms : terms.slice(0, N)).map((t, k) => k === miss ? '<span class="blank">?</span>' : t);
    const descr = pos.map((p, i) => {
      const nm = len === 1 ? 'The letters' : ['First letters', 'Second letters', 'Third letters'][i];
      const sg = p.d > 0 ? '+' : '−';
      const steps = p.grow ? `${sg}${Math.abs(p.d)}, then ${sg}${Math.abs(p.d) + 1}, then ${sg}${Math.abs(p.d) + 2}: the jump grows by 1 each time` : `${sg}${Math.abs(p.d)} each time`;
      return `${nm}: ${steps} (${terms.slice(0, N + 1).map(t => t[i]).join(' ')}).`;
    }).join(' ');
    return Object.assign(q, { key: 'letseq', alpha: true,
      prompt: `Find the missing letters in the sequence.${box(shown.join(', '))}${strip()}`, explain: descr + ' The alphabet loops round from Z back to A.' });
  },
  numseq() {
    const a = age();
    let seq, rule, k = 6;
    const types = a === 4 ? ['add', 'sub', 'dbl', 'add'] : a === 5 ? ['add', 'sub', 'alt', 'grow', 'mul', 'sq', 'half'] : ['alt', 'grow', 'mul', 'sq', 'fib', 'inter', 'mul1', 'shrink', 'cube'];
    const t = pick(types);
    if (t === 'add') { const s = rint(1, 30), d = rint(2, a === 4 ? 10 : 15); seq = Array.from({ length: k }, (_, i) => s + d * i); rule = `Add ${d} each time.`; }
    if (t === 'sub') { const d = rint(2, a === 4 ? 9 : 13), s = d * k + rint(0, 30); seq = Array.from({ length: k }, (_, i) => s - d * i); rule = `Take away ${d} each time.`; }
    if (t === 'dbl') { const s = rint(1, 5); seq = Array.from({ length: k }, (_, i) => s * 2 ** i); rule = `Double each time.`; }
    if (t === 'half') { const s = rint(1, 3) * 64; seq = Array.from({ length: k }, (_, i) => s / 2 ** i); rule = `Halve each time.`; }
    if (t === 'mul') { const m = a === 5 ? 3 : pick([3, 4]), s = rint(1, 3); k = 5; seq = Array.from({ length: k }, (_, i) => s * m ** i); rule = `Multiply by ${m} each time.`; }
    if (t === 'mul1') { const s = rint(1, 4); seq = [s]; for (let i = 1; i < k; i++) seq.push(seq[i - 1] * 2 + 1); rule = `Double, then add 1.`; }
    if (t === 'alt') { const x = rint(3, 9), y = rint(1, x - 1), s = rint(5, 30); seq = [s]; for (let i = 1; i < k + 1; i++) seq.push(seq[i - 1] + (i % 2 ? x : -y)); seq = seq.slice(0, k); rule = `Add ${x}, then take away ${y}, and repeat.`; }
    if (t === 'grow') { const s = rint(1, 20), d = rint(1, 3); seq = [s]; for (let i = 1; i < k; i++) seq.push(seq[i - 1] + d + i - 1); rule = `The gap grows by 1 each time (+${d}, +${d + 1}, +${d + 2} …).`; }
    if (t === 'shrink') { const s = rint(60, 99), d = rint(6, 9); seq = [s]; for (let i = 1; i < k; i++) seq.push(seq[i - 1] - (d - i + 1)); rule = `Take away ${d}, then ${d - 1}, then ${d - 2} … one less each time.`; }
    if (t === 'sq') { const s = rint(1, 5); seq = Array.from({ length: k }, (_, i) => (s + i) ** 2); rule = `Square numbers: ${s}×${s}, ${s + 1}×${s + 1}, ${s + 2}×${s + 2} …`; }
    if (t === 'cube') { k = 5; seq = Array.from({ length: k }, (_, i) => (i + 1) ** 3); rule = `Cube numbers: 1×1×1, 2×2×2, 3×3×3 …`; }
    if (t === 'fib') { const x = rint(1, 4), y = rint(x, 6); seq = [x, y]; for (let i = 2; i < k; i++) seq.push(seq[i - 1] + seq[i - 2]); rule = `Add the two numbers before to get the next one.`; }
    if (t === 'inter') { const s1 = rint(1, 9), d1 = rint(2, 5), s2 = rint(20, 40), d2 = rint(1, 4); seq = []; for (let i = 0; i < k + 1; i++) seq.push(i % 2 ? s2 - d2 * ((i - 1) / 2) : s1 + d1 * (i / 2)); seq = seq.slice(0, k); rule = `Two sequences take turns: one adds ${d1}, the other takes away ${d2}.`; }
    const miss = a === 6 && Math.random() < 0.4 ? rint(1, k - 2) : k - 1;
    const right = seq[miss];
    const diff = Math.abs((seq[miss] - (seq[miss - 1] ?? seq[miss + 1])) || 2);
    const q = mc(String(right), shuffle([right + 1, right - 1, right + 2, right + diff, right - diff, right * 2, right + 10].filter(x => x > 0 && x !== right).map(String)));
    if (!q) return null;
    const shown = seq.map((n, i) => i === miss ? '<span class="blank">?</span>' : n);
    return Object.assign(q, { key: 'numseq:' + t, prompt: `Find the missing number in the sequence.${box(shown.join(', '))}`, explain: `${rule} So the missing number is <b>${right}</b>.` });
  },
  letanalogy() {
    const a = age(), len = 2;
    const mode = a === 4 ? 'shift' : a === 5 ? pick(['shift', 'shift', 'split']) : pick(['split', 'mirror', 'swap']);
    const s1 = [rint(0, 25), rint(0, 25)], s2 = [rint(0, 25), rint(0, 25)];
    let f, why;
    if (mode === 'shift') { const d = a === 4 ? rint(1, 2) : rint(1, 4) * pick([1, -1]); f = x => x.map(v => v + d); why = `Each letter moves ${Math.abs(d)} place${Math.abs(d) > 1 ? 's' : ''} ${d > 0 ? 'forward' : 'back'}.`; }
    if (mode === 'split') { const d1 = rint(1, 4) * pick([1, -1]), d2 = rint(1, 5) * pick([1, -1]); f = x => [x[0] + d1, x[1] + d2]; why = `The first letter moves ${d1 > 0 ? '+' : '−'}${Math.abs(d1)} and the second letter moves ${d2 > 0 ? '+' : '−'}${Math.abs(d2)}.`; }
    if (mode === 'mirror') { f = x => x.map(v => 25 - v); why = `Each letter becomes its mirror letter in the alphabet (A↔Z, B↔Y, C↔X …).`; }
    if (mode === 'swap') { const d = rint(1, 3); f = x => [x[1] + d, x[0] + d]; why = `The two letters swap places and each moves ${d} forward.`; }
    const w = x => x.map(LTR).join('');
    const right = w(f(s2));
    const wrongs = [w(f(s2).map((v, i) => i ? v : v + 1)), w(f(s2).map((v, i) => i ? v - 1 : v)), w(f(s2).reverse()), w(s2.map(v => v + 1)), w(f(s2).map(v => v + 1))];
    const q = mc(right, shuffle(wrongs));
    if (!q) return null;
    return Object.assign(q, { key: 'letanalogy:' + mode, alpha: true,
      prompt: `Find the letters that complete the sentence in the best way.${box(`<b>${w(s1)}</b> is to <b>${w(f(s1))}</b> as <b>${w(s2)}</b> is to <span class="blank">?</span>`)}${strip()}`,
      explain: `${why} ${w(s2)} becomes <b>${right}</b>.` });
  },
  wordcode() {
    const a = age();
    const mode = a === 4 ? 'shift' : a === 5 ? pick(['shift', 'shift', 'alt']) : pick(['shift', 'mirror', 'alt', 'pos']);
    const d = a === 4 ? pick([1, 1, -1]) : rint(1, 3) * pick([1, -1]);
    const enc = (w) => [...w.toUpperCase()].map((c, i) => {
      const p = POS(c);
      if (mode === 'shift') return LTR(p + d);
      if (mode === 'mirror') return LTR(25 - p);
      if (mode === 'alt') return LTR(p + (i % 2 ? -1 : 1) * Math.abs(d));
      return LTR(p + i + 1);
    }).join('');
    const why = mode === 'shift' ? `Each letter moves ${Math.abs(d)} place${Math.abs(d) > 1 ? 's' : ''} ${d > 0 ? 'forward' : 'back'} in the alphabet.`
      : mode === 'mirror' ? `Each letter becomes its mirror letter (A↔Z, B↔Y, C↔X …).`
      : mode === 'alt' ? `The letters move +${Math.abs(d)}, −${Math.abs(d)}, +${Math.abs(d)}, −${Math.abs(d)} in turn.`
      : `The first letter moves 1 place forward, the second 2 places, the third 3 places, and so on.`;
    const n = a === 4 ? 3 : pick([4, 4, 5]);
    const pool = BANK.codewords[String(n)].filter(w => (BANK.codelv[w] || 5) <= Math.max(a, 5));
    const ex = pick(BANK.codewords[String(mode === 'shift' || mode === 'mirror' ? pick([3, 4, 5]) : Math.max(n, 4))]), tgt = pick(pool.filter(w => w !== ex));
    const decode = Math.random() < (a === 4 ? 0.3 : 0.5);
    const right = decode ? tgt.toUpperCase() : enc(tgt);
    const wrongCode = (w, k) => { const e = enc(w).split(''); e[k] = LTR(POS(e[k]) + 1); return e.join(''); };
    let wrongs;
    if (decode) wrongs = shuffle(pool.filter(w => w !== tgt && [...w].some((c, i) => c === tgt[i]))).slice(0, 6).map(UP);
    else wrongs = [wrongCode(tgt, 0), wrongCode(tgt, n - 1), [...tgt.toUpperCase()].map(c => LTR(POS(c) - d)).join(''), [...tgt.toUpperCase()].map(c => LTR(POS(c) + d + 1)).join(''), enc(tgt).split('').reverse().join('')];
    const q = mc(right, shuffle(wrongs));
    if (!q) return null;
    const lead = `If <b>${UP(ex)}</b> is written in code as <b>${enc(ex)}</b>,`;
    return Object.assign(q, { key: 'wordcode:' + mode, alpha: true,
      prompt: decode ? `${lead} what does <b>${enc(tgt)}</b> mean?${strip()}` : `${lead} how is <b>${UP(tgt)}</b> written in the same code?${strip()}`,
      explain: `${why} ${UP(tgt)} ↔ <b>${enc(tgt)}</b>.` });
  },
  numcode() {
    const a = age();
    if (a === 6 || (a === 5 && Math.random() < 0.4)) {
      const c = byLevel(BANK.numcode, x => x.w.join());
      const q = mc(c.a, shuffle(uniq(c.c.filter(x => x !== c.a).concat(shuffle([...c.a]).join(''), [...c.a].reverse().join(''), c.a.slice(1) + c.a[0])).filter(x => x !== c.a)));
      if (!q) return null;
      return Object.assign(q, { key: 'numcode:' + c.q,
        prompt: `Here are four words. Three of them have been written in a number code, but the codes are in a different order to the words. What is the code for <b>${UP(c.q)}</b>?${box(c.w.map(UP).join(' &nbsp; '))}${box(c.c.join(' &nbsp; '))}`,
        explain: `Look for words that share letters in the same places. The codes match like this: ${c.m.map(([w, d]) => `${UP(w)} = ${d}`).join(', ')}. ${c.m.some(([w]) => w === c.q) ? '' : `Use those letters to build ${UP(c.q)}: `}${UP(c.q)} = <b>${c.a}</b>.` });
    }
    // one or two words given with their codes; work out the code for a word made from the same letters
    for (let k = 0; k < 60; k++) {
      const n = a === 4 ? 4 : pick([4, 5]);
      const w = pick(BANK.codewords[String(n)].filter(x => new Set(x).size === n));
      if (!w) continue;
      const others = BANK.codewords[String(n)].filter(x => x !== w && [...x].every(c => w.includes(c)) && new Set(x).size === n);
      if (!others.length) continue;
      const t = pick(others);
      const digits = shuffle([...'123456789']).slice(0, n);
      const code = {}; [...w].forEach((c, i) => code[c] = digits[i]);
      const enc = x => [...x].map(c => code[c]).join('');
      const right = enc(t);
      const q = mc(right, shuffle([enc(w), [...right].reverse().join(''), right.slice(1) + right[0], right[1] + right[0] + right.slice(2), right.slice(0, -2) + right.slice(-1) + right.slice(-2, -1)]));
      if (!q) continue;
      return Object.assign(q, { key: 'numcode:' + t,
        prompt: `If the code for <b>${UP(w)}</b> is <b>${enc(w)}</b>, what is the code for <b>${UP(t)}</b>?`,
        explain: `${[...w.toUpperCase()].map(c => `${c} = ${code[c.toLowerCase()]}`).join(', ')}. So ${UP(t)} = <b>${right}</b>.` });
    }
    return null;
  },

  /* ── LOGIC ── */
  deduce() {
    const a = age();
    if (Math.random() < (a === 4 ? 0.5 : 0.3)) {          // days of the week
      const today = rint(0, 6), n = a === 4 ? rint(2, 9) : rint(5, 25), fwd = Math.random() < 0.5;
      let prompt, right, explain;
      const count = (k) => { const w = Math.floor(Math.abs(k) / 7), r = Math.abs(k) % 7; return w ? `${Math.abs(k)} days is ${w} week${w > 1 ? 's' : ''} and ${r} day${r === 1 ? '' : 's'}. Whole weeks land on the same day, so only count the ${r}.` : ''; };
      if (a === 6 && Math.random() < 0.5) {
        const shift = pick([[2, 'The day after tomorrow'], [-2, 'The day before yesterday'], [1, 'Tomorrow'], [-1, 'Yesterday']]);
        const ask = pick([[n, `${n} days after today`], [-n, `${n} days before today`]]);
        const known = (today + shift[0] + 70) % 7;
        right = DAYS[(today + ask[0] + 700) % 7];
        prompt = `${shift[1]} is <b>${DAYS[known]}</b>. What day of the week is it ${ask[1]}?`;
        explain = `${shift[1]} is ${DAYS[known]}, so today is ${DAYS[today]}. ${count(ask[0])} The answer is <b>${right}</b>.`;
      } else {
        right = DAYS[(today + (fwd ? n : -n) + 700) % 7];
        prompt = `Today is <b>${DAYS[today]}</b>. What day of the week ${fwd ? 'will it be' : 'was it'} <b>${n} days ${fwd ? 'from now' : 'ago'}</b>?`;
        explain = `${count(n)} Count ${fwd ? 'on' : 'back'} from ${DAYS[today]}: the answer is <b>${right}</b>.`;
      }
      const q = mc(right, shuffle(DAYS.filter(d => d !== right)));
      return Object.assign(q, { key: 'deduce:days', prompt, explain: explain.trim() });
    }
    const n = a === 4 ? 3 : a === 5 ? 4 : 5;
    const [big, small, noun] = pick([['taller', 'shorter', 'tallest|shortest'], ['older', 'younger', 'oldest|youngest'], ['faster', 'slower', 'fastest|slowest'], ['heavier', 'lighter', 'heaviest|lightest']]);
    const [most, least] = noun.split('|');
    const order = shuffle(NAMES).slice(0, n);         // order[0] is the most
    const facts = [];
    for (let i = 0; i < n - 1; i++) facts.push(Math.random() < 0.5 ? `${order[i]} is ${big} than ${order[i + 1]}.` : `${order[i + 1]} is ${small} than ${order[i]}.`);
    const askT = a === 4 ? pick([0, n - 1]) : a === 5 ? pick([0, n - 1, 1, n - 2]) : pick([1, n - 2, 2, 0, n - 1]);
    const ordinal = ['', 'second ', 'third ', 'fourth '];
    const ask = askT === 0 ? `Who is the ${most}?` : askT === n - 1 ? `Who is the ${least}?` : askT < n / 2 ? `Who is the ${ordinal[askT]}${most}?` : `Who is the ${ordinal[n - 1 - askT]}${least}?`;
    const right = order[askT];
    const q = mc(right, shuffle(order.filter(x => x !== right)), n);
    return Object.assign(q, { key: 'deduce:order', prompt: `Read the information, then answer the question.${box(shuffle(facts).join(' '))}<b>${ask}</b>`,
      explain: `Put them in order from ${most} to ${least}: <b>${order.join(' → ')}</b>.` });
  },
  statement() {
    const a = age(), n = a === 4 ? 3 : a === 5 ? 4 : 5;
    const [big, small] = pick([['taller', 'shorter'], ['older', 'younger'], ['faster', 'slower'], ['heavier', 'lighter']]);
    const order = shuffle(NAMES).slice(0, n);
    const facts = [];
    for (let i = 0; i < n - 1; i++) facts.push(Math.random() < 0.5 ? `${order[i]} is ${big} than ${order[i + 1]}.` : `${order[i + 1]} is ${small} than ${order[i]}.`);
    const say = (i, j) => Math.random() < 0.5 ? `${order[i]} is ${big} than ${order[j]}.` : `${order[j]} is ${small} than ${order[i]}.`;
    // a true statement that needs two facts put together (not one of the facts)
    const i = rint(0, n - 3), j = rint(i + 2, n - 1);
    const right = say(i, j);
    const wrongs = [];
    for (let k = 0; k < 20; k++) { const x = rint(0, n - 2), y = rint(x + 1, n - 1); wrongs.push(say(y, x)); }   // the wrong way round
    if (a >= 5) wrongs.push(`${order[n - 1]} is the ${big.replace(/er$/, 'est')}.`, `${order[0]} is the ${small.replace(/er$/, 'est')}.`);
    const q = mc(right, shuffle(uniq(wrongs)));
    if (!q) return null;
    return Object.assign(q, { key: 'statement',
      prompt: `Read the information. Which statement <b>must</b> be true?${box(shuffle(facts).join(' '))}`,
      explain: `Put them in order: <b>${order.join(' → ')}</b> (${big} on the left). Only “${esc(right)}” fits that order.` });
  },
  letnum() {
    const a = age();
    for (let k = 0; k < 80; k++) {
      const vals = shuffle(uniq(Array.from({ length: 12 }, () => rint(1, a === 4 ? 12 : a === 5 ? 20 : 30)))).slice(0, 5).sort((x, y) => x - y);
      if (vals.length < 5) continue;
      const m = {}; 'ABCDE'.split('').forEach((c, i) => m[c] = vals[i]);
      const ks = shuffle('ABCDE'.split(''));
      const [x, y, z] = ks;
      const forms = a === 4 ? [[`${x} + ${y}`, m[x] + m[y]], [`${x} − ${y}`, m[x] - m[y]], [`${x} + ${y} − ${z}`, m[x] + m[y] - m[z]]]
        : a === 5 ? [[`${x} × ${y}`, m[x] * m[y]], [`${x} + ${y} − ${z}`, m[x] + m[y] - m[z]], [`${x} ÷ ${y}`, m[x] / m[y]], [`${x} × ${y} − ${z}`, m[x] * m[y] - m[z]]]
        : [[`(${x} + ${y}) ÷ ${z}`, (m[x] + m[y]) / m[z]], [`${x} × ${y} − ${z}`, m[x] * m[y] - m[z]], [`${x} ÷ ${y} + ${z}`, m[x] / m[y] + m[z]], [`(${x} − ${y}) × ${z}`, (m[x] - m[y]) * m[z]]];
      const [f, v] = pick(forms);
      const hit = Object.keys(m).find(c => m[c] === v);
      if (!hit) continue;
      const q = mc(hit, shuffle('ABCDE'.split('')));
      const nf = f.replace(/[A-E]/g, c => m[c]);
      return Object.assign(q, { key: 'letnum',
        prompt: `Use the values to work out the answer. Give your answer as a <b>letter</b>.${box(Object.keys(m).map(c => `${c} = ${m[c]}`).join(' &nbsp; '))}${box(`${f} = <span class="blank">?</span>`)}`,
        explain: `${f} is ${nf} = ${v}. ${v} is the value of <b>${hit}</b>.` });
    }
    return null;
  },
  related() {
    const a = age();
    const RULES = [
      ['a+b', (x, y) => x + y, 'add the two outside numbers', 4], ['a-b', (x, y) => x - y, 'take the second outside number from the first', 4],
      ['2(a+b)', (x, y) => 2 * (x + y), 'add the outside numbers, then double', 5], ['a*b', (x, y) => x * y, 'multiply the outside numbers', 5],
      ['a+b+1', (x, y) => x + y + 1, 'add the outside numbers, then add 1', 5], ['(a+b)/2', (x, y) => (x + y) / 2, 'add the outside numbers, then halve', 5],
      ['a*b-1', (x, y) => x * y - 1, 'multiply the outside numbers, then take away 1', 6], ['2a+b', (x, y) => 2 * x + y, 'double the first outside number, then add the second', 6],
      ['a*b/2', (x, y) => x * y / 2, 'multiply the outside numbers, then halve', 6], ['a-b-1', (x, y) => x - y - 1, 'take the second from the first, then take away 1', 6],
      ['(a-b)*2', (x, y) => (x - y) * 2, 'take the second from the first, then double', 6], ['a*a-b', (x, y) => x * x - y, 'square the first number, then take away the second', 6],
    ];
    const use = RULES.filter(r => r[3] <= a);
    for (let k = 0; k < 80; k++) {
      const r = a === 4 ? pick(use) : pick(use.filter(x => x[3] >= a - 1) .concat(use));
      const max = a === 4 ? 12 : a === 5 ? 15 : 12;
      const tr = Array.from({ length: 3 }, () => { const x = rint(2, max), y = rint(1, x); return [x, y]; });
      const vals = tr.map(([x, y]) => r[1](x, y));
      if (vals.some(v => !Number.isInteger(v) || v < 0 || v > 200)) continue;
      // the first two brackets must point to one answer only
      const answers = new Set(RULES.filter(o => tr.slice(0, 2).every(([x, y], i) => o[1](x, y) === vals[i])).map(o => o[1](...tr[2])));
      if (answers.size !== 1) continue;
      const right = vals[2];
      const q = mc(String(right), shuffle([right + 1, right - 1, right + 2, tr[2][0] + tr[2][1], tr[2][0] * tr[2][1], tr[2][0] - tr[2][1], right * 2].filter(x => x >= 0 && x !== right).map(String)));
      if (!q) continue;
      const show = tr.map(([x, y], i) => `(${x} [${i < 2 ? vals[i] : '<span class="blank">?</span>'}] ${y})`).join(' &nbsp; ');
      return Object.assign(q, { key: 'related:' + r[0],
        prompt: `The numbers in each group are worked out in the same way. Find the missing number.${box(show)}`,
        explain: `In each group, ${r[2]}. ${tr[2][0]} and ${tr[2][1]} give <b>${right}</b>.` });
    }
    return null;
  },
  sums() {
    const a = age();
    for (let k = 0; k < 60; k++) {
      const x = rint(2, a === 4 ? 20 : 30), y = rint(2, a === 4 ? 12 : 15), m = rint(2, a === 5 ? 6 : 9);
      const lefts = a === 4 ? [[`${x} + ${y}`, x + y], [`${x + y} − ${y}`, x]]
        : a === 5 ? [[`${x} + ${y}`, x + y], [`${x} × ${m}`, x * m], [`${x * 2} ÷ 2`, x], [`${x + y} − ${y}`, x]]
        : [[`${x} × ${m}`, x * m], [`${x * m} ÷ ${m}`, x], [`${x} + ${y} × 2`, x + y * 2], [`(${x} + ${y}) × 2`, (x + y) * 2]];
      const [left, lv] = pick(lefts);
      const op = pick(a === 4 ? ['+', '−'] : ['+', '−', '×', '÷']);
      let b, right;
      if (op === '+') { b = rint(1, Math.max(1, lv - 1)); right = lv - b; }
      if (op === '−') { b = lv + rint(1, 20); right = b - lv; }
      if (op === '×') { const ds = [2, 3, 4, 5, 6].filter(d => lv % d === 0 && d !== lv); if (!ds.length) continue; b = pick(ds); right = lv / b; }
      if (op === '÷') { b = lv * pick([2, 3]); right = b / lv; }
      if (!(right > 0) || !Number.isInteger(right)) continue;
      const rop = `${b} ${op} ?`;
      const q = mc(String(right), shuffle([right + 1, right - 1, right + 2, right + 10, lv, right * 2].filter(v => v > 0 && v !== right).map(String)));
      if (!q) continue;
      return Object.assign(q, { key: 'sums',
        prompt: `Find the number that completes the sum. Both sides must be equal.${box(`${left} = ${rop.replace('?', '<span class="blank">?</span>')}`)}`,
        explain: `${left} = ${lv}. ${rop.replace('?', right)} = ${lv} too, so the missing number is <b>${right}</b>.` });
    }
    return null;
  },
};

/* ════════════════════════════════════════════════════════════════
   TOPICS (grouped like Atom Learning)
   eg: a short example shown in the topic list. how: the method, shown on request.
   ════════════════════════════════════════════════════════════════ */
const GROUPS = [
  { id: 'vocab', name: 'Vocabulary', topics: [
    ['syn', 'Synonyms', 'closest meaning to BRAVE', 'Say the word in a sentence. Try each choice in its place and pick the one that keeps the meaning. Watch out for a word with the opposite meaning.'],
    ['synpair', 'Synonym pairs', '(glad, tall, open) (shut, happy, long)', 'Take each word in the first group and look for a word with the same meaning in the second group. One pair will often be opposites: that is a trap.'],
    ['ant', 'Antonyms', 'opposite of ANCIENT', 'Think what the word means, then think of its opposite before you read the choices. A word with the SAME meaning is a common trap.'],
    ['antpair', 'Antonym pairs', '(hot, quick, sad) (fast, cold, kind)', 'Take each word in the first group and look for its opposite in the second group. Two words that mean the same are a trap.'],
    ['homo', 'Homonyms', '(band, hoop) (call, phone) → RING', 'The answer has two meanings. Find a word that fits the first pair, then check it also fits the second pair.'],
    ['odd2', 'Odd ones out', 'apple, pear, plum, sock, coat', 'Find the three words that belong together and say what links them. The two left over are the answer.'],
    ['analogy', 'Spot the connection', 'dog is to puppy as cat is to ?', 'Make a sentence that links the first pair (“A puppy is a young dog”). Use the same sentence for the second pair.'],
    ['define', 'Definitions', 'what does CORDIAL mean here?', 'Read the whole sentence. Decide what kind of word fits (a describing word, a thing, an action), then test each choice in its place.'],
    ['choose', 'Choose the word', 'Used items are ____ than new items.', 'Read the sentence with each choice in the gap. Check it makes sense and fits the grammar (one or many, describing or doing).'],
  ] },
  { id: 'find', name: 'Finding words', topics: [
    ['hidden', 'Hidden words', 'bat[s and] → SAND', 'Look at the end of each word joined to the start of the next. Cover the spaces with your finger and read the letters across them.'],
    ['jumbled', 'Jumbled words', 'the sun is a TSAR → STAR', 'Use the sentence to guess what the word should be, then check every letter is used once.'],
    ['jumsent', 'Jumbled sentences', 'cat the mat sat sky on the', 'Build the sentence from the words. The word that has no place in it is the answer.'],
    ['anagram', 'Anagrams', 'HISF · lives in water → FISH', 'Use the clue to guess the word, then check it uses every letter once.'],
    ['complete', 'Complete the sentence', 'The colour of the rose is _INK.', 'Read the sentence to work out what the word means, then find the letters that spell it.'],
    ['stolen', 'Stolen words', 'COCO + ? · grows on a palm tree', 'Use the clue to work out the full word, then see which letters are missing from the capitals.'],
  ] },
  { id: 'build', name: 'Building words', topics: [
    ['joining', 'Joining words', '(car, sun) (pet, ten) → CARPET', 'Join each word in the first group to each word in the second group. Say each one aloud. Only one makes a real word.'],
    ['morph', 'Morphing words', 'CAMP → ? → LAMP… one letter at a time', 'Compare the first and last words letter by letter. Change one of the different letters and see if it makes a word.'],
    ['transfer', 'Transferring letters', 'HUNT SIP → HUT SNIP (N)', 'Take out one letter at a time from the first word. If what is left is a word, try putting that letter into the second word.'],
    ['missing3', 'Missing three letters', 'CH _ _ _ R → AIR', 'Try each three-letter word in the gap and read the whole word aloud.'],
    ['letterpair', 'Find the link', 'for ( ? ) ap · doub ( ? ) heme → T', 'Try a letter in the first pair. If it makes two words, check it works for the second pair too.'],
    ['rearrange', 'Word rules', 'heat → hear · beat → bear · neat → ?', 'Compare each pair letter by letter to find what changes. Make the same change to the last word.'],
    ['rearrlet', 'Rearrange letters', '( PURE PUSH SHOE ) ( SNOW ? APES )', 'Find which letters of the outer words make the middle word in the first group. Take the same letters from the second group.'],
  ] },
  { id: 'codes', name: 'Codes and sequences', topics: [
    ['alpha', 'Alphabet positions', '3 places after K', 'Write the alphabet with numbers underneath (A = 1 … Z = 26). Count on or back using the numbers.'],
    ['letseq', 'Letter sequences', 'AZ, BY, CX, DW, ?', 'Look at the first letters on their own, then the second letters on their own. Count the jumps.'],
    ['letanalogy', 'Letter connections', 'AB is to CD as PQ is to ?', 'Count how far each letter moves in the first pair. Move the letters in the second pair the same way.'],
    ['numseq', 'Number sequences', '3, 7, 11, 15, ?', 'Write the difference between each pair of numbers. If the differences do not stay the same, look at how they change.'],
    ['wordcode', 'Letter codes', 'CAT = DBU, so DOG = ?', 'Match each letter to its code letter and count the jump. Check the same rule works for every letter.'],
    ['numcode', 'Number codes', 'STOP = 1234, so POTS = ?', 'Match the letters to the numbers in the same places. Look for words that start or end with the same letter.'],
    ['symbol', 'Symbol codes', 'SEED = ^!!#', 'Write each letter above its symbol. Repeated symbols show repeated letters.'],
  ] },
  { id: 'logic', name: 'Logic', topics: [
    ['statement', 'Statement logic', 'which statement must be true?', 'Put the people in order on a line. Check each statement against your line.'],
    ['deduce', 'Deductions', 'who is the tallest? what day is it?', 'Draw a line and place each person as you read. For days, take away whole weeks of 7 first.'],
    ['letnum', 'Letters for numbers', 'A = 2, B = 5 … A × B = ?', 'Swap each letter for its number, work out the answer, then find the letter with that value.'],
    ['related', 'Related numbers', '(4 [10] 6) (7 [12] 5) (8 [?] 3)', 'Test the first group with +, −, × and ÷. Check your rule on the second group before using it.'],
    ['sums', 'Complete the sum', '12 + 8 = 30 − ?', 'Work out the side with no gap first. Then find the number that makes the other side equal.'],
    ['ordering', 'Ordering words', 'Bed, Lamp, Shelf, Desk: which is first?', 'Decide what the order is (size, time, age, the alphabet), then place each one in turn.'],
    ['numlogic', 'Number logic', 'half of 20 · 7 less than 19', 'Turn the words into a sum: half means divide by 2, less than means take away.'],
    ['subst', 'Substitutions', 'football = 20, basketball = 11', 'Replace each picture or word with its number, then work out the sum.'],
  ] },
];
const TOPICS = {};
GROUPS.forEach(g => g.topics.forEach(([id, name, eg, how]) => TOPICS[id] = { id, group: g.id, groupName: g.name, name, eg, how }));
const ALL_TOPICS = Object.keys(TOPICS);
function chosenTopics() { const t = (SAVE.topics || ALL_TOPICS).filter(x => TOPICS[x]); return t.length ? t : ALL_TOPICS; }

/* hand-entered questions from atom.js */
const ATOMBY = {};
(typeof ATOM !== 'undefined' ? ATOM : []).forEach((it, i) => { it.id = i; (ATOMBY[it.t] = ATOMBY[it.t] || []).push(it); });
const STRIP_TOPICS = ['alpha', 'letseq', 'letanalogy', 'wordcode'];
function fromAtom(t) {
  const list = ATOMBY[t]; if (!list) return null;
  const it = byLevel(list, x => 'atom' + x.id);
  let q;
  if (it.g) {
    const G = it.g.map(g => shuffle(g));
    q = { kind: 'pair', groups: G, answer: [G[0].indexOf(it.a[0]), G[1].indexOf(it.a[1])] };
  } else if (Array.isArray(it.a)) {
    const o = shuffle(it.o);
    q = { kind: 'two', options: o, answer: it.a.map(w => o.indexOf(w)).sort((x, y) => x - y) };
  } else {
    const o = /order|sentence/.test(it.p) && t === 'jumsent' ? it.o.slice() : shuffle(it.o);
    q = { kind: 'mc', options: o, answer: o.indexOf(it.a) };
  }
  return Object.assign(q, { fixed: true, key: 'atom:' + it.id, explain: it.e,
    prompt: it.p + (it.s ? box(it.s) : '') + (STRIP_TOPICS.includes(t) ? strip() : '') });
}
/* a topic with both kinds: about a third of its questions come from the hand-entered bank,
   but only when the bank has questions at this age */
function useAtom(t) {
  if (!ATOMBY[t]) return false;
  if (!MAKE[t]) return true;
  return ATOMBY[t].some(x => x.lv <= age()) && Math.random() < 0.3;
}

/* topics you get wrong come back more often; the last two topics are avoided */
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
    try { q = useAtom(t) ? fromAtom(t) : MAKE[t](); } catch (e) { console.error(t, e); }
    if (q) {
      recentTopics.push(t); if (recentTopics.length > Math.min(2, list.length - 1)) recentTopics.shift();
      q.topic = t; q.label = TOPICS[t].name; q.how = TOPICS[t].how;
      return q;
    }
  }
  const q = MAKE.syn(); q.topic = 'syn'; q.label = TOPICS.syn.name; q.how = TOPICS.syn.how; return q;
}
function record(q, ok) { [('t:' + q.topic), q.key].filter(Boolean).forEach(k => { const s = stat(k); ok ? s.r++ : s.w++; }); persist(); }

/* ════════════════════════════════════════════════════════════════
   ANSWER CONTROLS (shared by both games)
   ════════════════════════════════════════════════════════════════ */
function isRight(q, sel) {
  if (q.kind === 'mc') return sel === q.answer;
  if (q.kind === 'pair') return sel[0] === q.answer[0] && sel[1] === q.answer[1];
  return sel.slice().sort((a, b) => a - b).join() === q.answer.join();
}
function answerText(q) {
  if (q.kind === 'mc') return `${LET[q.answer]}: ${q.options[q.answer]}`;
  if (q.kind === 'pair') return `${q.groups[0][q.answer[0]]} and ${q.groups[1][q.answer[1]]}`;
  return q.answer.map(i => q.options[i]).join(' and ');
}
/* cfg: { btn: class for list buttons, key: class for the letter badge, chip: class for word chips, onAnswer(sel) } */
function answerUI(q, el, cfg) {
  const st = { q, cfg, el, sel: q.kind === 'mc' ? null : q.kind === 'pair' ? [null, null] : [], locked: false };
  let h = '';
  if (q.kind === 'mc') {
    h = `<div class="${cfg.wrap || 'choices'}">${q.options.map((o, i) => `<button class="${cfg.btn}" data-o="${i}"><span class="${cfg.key}">${LET[i]}</span><span>${esc(o)}</span></button>`).join('')}</div>`;
  } else if (q.kind === 'pair') {
    h = `<div class="vr-groups">${q.groups.map((g, gi) => `<div class="vr-group"><span class="vr-gl">Group ${gi + 1}</span><span class="vr-br">(</span>${g.map((w, i) => `<button class="${cfg.chip}" data-g="${gi}" data-o="${i}">${esc(w)}</button>`).join('')}<span class="vr-br">)</span></div>`).join('')}</div>
      <div class="vr-pick-note">Choose one word from each group.</div>`;
  } else {
    h = `<div class="vr-groups"><div class="vr-group">${q.options.map((w, i) => `<button class="${cfg.chip}" data-o="${i}">${esc(w)}</button>`).join('')}</div></div>
      <div class="vr-pick-note">Choose two words.</div>`;
  }
  el.innerHTML = h;
  el.onclick = e => {
    const b = e.target.closest('[data-o]'); if (!b || st.locked || b.disabled) return;
    const o = +b.dataset.o;
    if (q.kind === 'mc') { st.locked = true; cfg.onAnswer(o, st); return; }
    if (q.kind === 'pair') {
      const g = +b.dataset.g;
      el.querySelectorAll(`[data-g="${g}"]`).forEach(x => x.classList.remove('sel'));
      st.sel[g] = st.sel[g] === o ? null : o;
      if (st.sel[g] !== null) b.classList.add('sel');
      if (st.sel[0] !== null && st.sel[1] !== null) { st.locked = true; cfg.onAnswer(st.sel.slice(), st); }
      return;
    }
    const at = st.sel.indexOf(o);
    if (at >= 0) { st.sel.splice(at, 1); b.classList.remove('sel'); }
    else { st.sel.push(o); b.classList.add('sel'); }
    if (st.sel.length === 2) { st.locked = true; cfg.onAnswer(st.sel.slice(), st); }
  };
  return st;
}
/* key press A–E on a one-answer question */
function answerKey(st, i) { if (!st || st.locked || st.q.kind !== 'mc' || i >= st.q.options.length) return; const b = st.el.querySelector(`[data-o="${i}"]`); if (b && !b.disabled) b.click(); }
/* after a wrong first try: mark what was picked and let them try again */
function answerRetry(st, el, sel) {
  const q = st.q;
  if (q.kind === 'mc') { const b = el.querySelector(`[data-o="${sel}"]`); b.classList.add('no'); b.disabled = true; }
  else { el.querySelectorAll('.sel').forEach(b => b.classList.remove('sel')); st.sel = q.kind === 'pair' ? [null, null] : []; }
  st.locked = false;
}
/* final: show the right answer and what they chose */
function answerReveal(st, el, sel) {
  const q = st.q, right = [], chosen = [];
  if (q.kind === 'mc') { right.push(`[data-o="${q.answer}"]`); if (sel != null) chosen.push(`[data-o="${sel}"]`); }
  else if (q.kind === 'pair') { q.answer.forEach((a, g) => right.push(`[data-g="${g}"][data-o="${a}"]`)); (sel || []).forEach((a, g) => a != null && chosen.push(`[data-g="${g}"][data-o="${a}"]`)); }
  else { q.answer.forEach(a => right.push(`[data-o="${a}"]`)); (sel || []).forEach(a => chosen.push(`[data-o="${a}"]`)); }
  chosen.forEach(s => { const b = el.querySelector(s); if (b) b.classList.add('no'); });
  right.forEach(s => { const b = el.querySelector(s); if (b) { b.classList.remove('no'); b.classList.add('ok'); } });
  el.querySelectorAll('[data-o]').forEach(b => { b.disabled = true; b.classList.remove('sel'); if (!b.classList.contains('ok') && !b.classList.contains('no')) b.classList.add('faded'); });
  st.locked = true;
}

/* ════════════════════════════════════════════════════════════════
   TOPIC PICKER AND AGE SETTING (shared markup; each page styles it)
   ════════════════════════════════════════════════════════════════ */
function ageHTML() {
  return `<div class="vr-ages">${AGES.map(a => `<button class="vr-age" data-age="${a.id}" aria-pressed="${a.id === age()}"><b>${a.label}</b><small>${a.note}</small></button>`).join('')}</div>`;
}
function pickerHTML() {
  const on = new Set(chosenTopics());
  return `<div class="vr-presets">
      <button class="vr-pre" data-pre="all">All topics</button>
      ${GROUPS.map(g => `<button class="vr-pre" data-pre="${g.id}">${g.name} only</button>`).join('')}
    </div>
    <div class="vr-topics">${GROUPS.map(g => {
      const all = g.topics.every(t => on.has(t[0]));
      return `<div class="vr-tg"><label class="vr-tick vr-tgh"><input type="checkbox" data-grp="${g.id}" ${all ? 'checked' : ''}><span class="box"></span><span>${g.name}</span></label>
        ${g.topics.map(([id, name, eg]) => `<label class="vr-tick"><input type="checkbox" data-top="${id}" ${on.has(id) ? 'checked' : ''}><span class="box"></span><span>${name}<span class="vr-eg">${esc(eg)}</span></span></label>`).join('')}</div>`;
    }).join('')}</div>`;
}
/* wire up the picker inside el; onChange() is called after any change */
function bindSetup(el, onChange) {
  const redraw = () => { const ap = el.querySelector('[data-slot="age"]'), tp = el.querySelector('[data-slot="topics"]'); if (ap) ap.innerHTML = ageHTML(); if (tp) tp.innerHTML = pickerHTML(); onChange && onChange(); };
  el.addEventListener('click', e => {
    const a = e.target.closest('[data-age]'); if (a) { SAVE.age = +a.dataset.age; persist(); redraw(); return; }
    const p = e.target.closest('[data-pre]');
    if (p) { SAVE.topics = p.dataset.pre === 'all' ? ALL_TOPICS.slice() : GROUPS.find(g => g.id === p.dataset.pre).topics.map(t => t[0]); persist(); redraw(); }
  });
  el.addEventListener('change', e => {
    const i = e.target;
    let cur = new Set(SAVE.topics || ALL_TOPICS);
    if (i.dataset.grp) { GROUPS.find(g => g.id === i.dataset.grp).topics.forEach(t => i.checked ? cur.add(t[0]) : cur.delete(t[0])); }
    else if (i.dataset.top) { i.checked ? cur.add(i.dataset.top) : cur.delete(i.dataset.top); }
    else return;
    SAVE.topics = [...cur]; persist(); redraw();
  });
  redraw();
}
function setupStatus() {
  const n = (SAVE.topics || ALL_TOPICS).filter(t => TOPICS[t]).length;
  const a = AGES.find(x => x.id === age());
  return n ? `${a.label} · ${n} of ${ALL_TOPICS.length} topics chosen.` : `No topics ticked, so every topic will be used. ${a.label}.`;
}

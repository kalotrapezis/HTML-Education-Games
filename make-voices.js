#!/usr/bin/env node
/* Φτιάχνει μία φορά τα mp3 της φωνής (Mistral Voxtral TTS), για να παίζουν και χωρίς ίντερνετ.
     node make-voices.js --dry      πόσα κείμενα λείπουν και πόσο θα κοστίσουν, χωρίς χρέωση
     node make-voices.js            φτιάχνει μόνο όσα λείπουν και ξαναγράφει voices/<πακέτο>/index.js
   Το κλειδί διαβάζεται από το MISTRAL_API_KEY ή το ~/.config/mistral/api_key — ποτέ από το repo. */
const fs = require('fs'), path = require('path'), os = require('os'), { execFileSync } = require('child_process');
const ROOT = __dirname, DRY = process.argv.includes('--dry');
const MODEL = 'voxtral-mini-tts-3-0', VOICE = 'voice_447';  // Margaret
const PRICE = 0.016 / 1000;                                  // $ ανά χαρακτήρα (εκτίμηση)
const read = f => fs.readFileSync(path.join(ROOT, f), 'utf8');

global.window = {};
eval(read('voice.js'));
const { clean, hash } = window.Voice;

// Τι διαβάζεται: εδώ αλλάζεις τάξεις (κόστος: node make-voices.js --dry)
const BOOKS = ['BOOK_A', 'BOOK_B'];  // pliroforiki.html
const BANK = ['a', 'b'];             // bank/*-<τάξη>.js, για milioner.html και wheel.html

// αριθμός → ελληνικές λέξεις (μόνο του, το «24» το μοντέλο μπορεί να το πει στα αγγλικά)
const U = ['μηδέν', 'ένα', 'δύο', 'τρία', 'τέσσερα', 'πέντε', 'έξι', 'επτά', 'οκτώ', 'εννέα'];
const TEEN = ['δέκα', 'έντεκα', 'δώδεκα', 'δεκατρία', 'δεκατέσσερα', 'δεκαπέντε', 'δεκαέξι', 'δεκαεπτά', 'δεκαοκτώ', 'δεκαεννέα'];
const TENS = ['', '', 'είκοσι', 'τριάντα', 'σαράντα', 'πενήντα', 'εξήντα', 'εβδομήντα', 'ογδόντα', 'ενενήντα'];
const HUND = ['', 'εκατό', 'διακόσια', 'τριακόσια', 'τετρακόσια', 'πεντακόσια', 'εξακόσια', 'επτακόσια', 'οκτακόσια', 'εννιακόσια'];
function greekNum(n) {
  if (n < 10) return U[n];
  if (n < 20) return TEEN[n - 10];
  if (n < 100) return TENS[Math.floor(n / 10)] + (n % 10 ? ' ' + U[n % 10] : '');
  if (n < 1000) return n === 100 ? 'εκατό' : (n < 200 ? 'εκατόν' : HUND[Math.floor(n / 100)]) + (n % 100 ? ' ' + greekNum(n % 100) : '');
  const k = Math.floor(n / 1000);
  return (k === 1 ? 'χίλια' : greekNum(k).replace(/τρία$/, 'τρεις').replace(/τέσσερα$/, 'τέσσερις') + ' χιλιάδες') + (n % 1000 ? ' ' + greekNum(n % 1000) : '');
}
console.assert(greekNum(24) === 'είκοσι τέσσερα' && greekNum(105) === 'εκατόν πέντε' && greekNum(3400) === 'τρεις χιλιάδες τετρακόσια', 'greekNum');
// ένα γράμμα ή σημείο μόνο του βγαίνει μια στιγμή και χάνεται: λέμε το όνομά του
const NAMES = { α: 'άλφα', β: 'βήτα', γ: 'γάμμα', δ: 'δέλτα', ε: 'έψιλον', ζ: 'ζήτα', η: 'ήτα', θ: 'θήτα', ι: 'γιώτα', κ: 'κάπα', λ: 'λάμδα', μ: 'μι',
  ν: 'νι', ξ: 'ξι', ο: 'όμικρον', π: 'πι', ρ: 'ρο', σ: 'σίγμα', ς: 'τελικό σίγμα', τ: 'ταυ', υ: 'ύψιλον', φ: 'φι', χ: 'χι', ψ: 'ψι', ω: 'ωμέγα',
  '.': 'τελεία', ',': 'κόμμα', '!': 'θαυμαστικό', ';': 'ερωτηματικό', '@': 'παπάκι', '#': 'δίεση', '&': 'και' };
function say(t) {
  const c = clean(t), plain = c.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  if (/^\d{1,4}$/.test(c)) return greekNum(+c) + '.';
  if (NAMES[plain]) return NAMES[plain][0].toUpperCase() + NAMES[plain].slice(1) + (plain !== c.toLowerCase() ? ' με τόνο.' : '.');
  return c;
}
const pairs = list => list.filter(t => typeof t === 'string' && clean(t)).map(t => [t, say(t)]);

// ---- «words»: λέξεις του lexilogio.js και του abc.html, συλλαβές, αριθμοί 1–10
function words() {
  eval(read('lexilogio.js'));
  const abc = read('abc.html').match(/const WORDS = \[([\s\S]*?)\];/)[1];
  const ws = new Set([...window.PIC_WORDS.map(p => p.w), ...[...abc.matchAll(/\['[^']+', '([^']+)'\]/g)].map(m => m[1])]);
  return [
    ...[...ws].map(w => [w, w + '.']),
    ...window.PIC_WORDS.map(p => [p.syl.join(' - '), p.syl.join(', ') + '.']),  // lexeis: «γά - τα» (με «...» το μοντέλο δεν σταματούσε)
    ...pairs(Array.from({ length: 10 }, (_, i) => String(i + 1))),               // abc: say('7') → «επτά»
    ...pairs([...read('abc.html').match(/const HOW_MANY = \{([\s\S]*?)\};/)[1].matchAll(/: '([^']+)'/g)].map(m => m[1])),  // abc «Πόσα είναι;»
    ...pairs([read('abc.html').match(/const LETS_COUNT = '([^']+)'/)[1]]),
    ...pairs([...read('lexeis.html').match(/const TOUR = \[([\s\S]*?)\];/)[1].matchAll(/, '([^']+)'\]/g)].map(m => m[1])),  // lexeis «Όλες με τη σειρά»
    ...pairs([read('lexeis.html').match(/const TOUR_DONE = '([^']+)'/)[1]]),
  ];
}

// ---- «pliroforiki»: κάρτες, θεωρία και οδηγίες των BOOKS
function pliroforiki() {
  const html = read('pliroforiki.html');
  const block = name => html.slice(html.indexOf(`const ${name} =`)).match(new RegExp(`const ${name} = ([\\s\\S]*?\\n[\\]}];)`))[1];
  // ό,τι άλλο αναφέρουν τα δεδομένα (σταθερές, συναρτήσεις) γίνεται κενό: εδώ θέλουμε μόνο τα κείμενα
  const stub = new Proxy(function () {}, { get: (t, k) => ['map', 'filter', 'flatMap'].includes(k) ? () => [] : k === Symbol.toPrimitive || k === 'toString' ? () => '' : stub, apply: () => stub });
  const env = new Proxy({}, { has: (t, k) => !(k in globalThis), get: (t, k) => k === Symbol.unscopables ? undefined : stub });
  const load = name => new Function('env', `with (env) { return ${block(name).replace(/;$/, '')} }`)(env);
  const GUIDE = load('GUIDE'), out = [];
  for (const name of BOOKS) for (const ch of load(name)) for (const les of ch.lessons) {
    // όπως τα προσθέτει η σελίδα όταν φορτώνει (pliroforiki.html, «les.practice» / «les.ext»)
    const acts = [...les.acts, ...(les.practice || [])];
    if (les.ext) acts.push({ type: 'info', text: '🌍 Υλικό από το Διαδίκτυο: συνεχίζω στον υπολογιστή ή στο σπίτι!', guide: 'Πάτησε έναν σύνδεσμο για να ανοίξει η άσκηση και μετά «Επόμενο».', cards: les.ext });
    for (const a of acts) {
      out.push(a.text, a.guide || GUIDE[a.type + '.' + a.mode] || GUIDE[a.type]);
      if (a.type === 'info') a.cards.forEach(c => out.push(c[1]));
      if (a.type === 'theory') a.sections.forEach(([h, p, ex = []]) => out.push(h, p, ...ex));
    }
  }
  return pairs(out);
}

// ---- «bank»: ερωτήσεις και απαντήσεις της τράπεζας για τις τάξεις BANK
function bank() {
  const out = [];
  window.registerQuiz = o => { if (BANK.includes(o.grade)) o.chapters.forEach(c => c.questions.forEach(q => out.push(q.q, ...q.answers.map(String)))); };
  for (const f of fs.readdirSync(path.join(ROOT, 'bank'))) if (f !== 'manifest.js') eval(read('bank/' + f));
  // γράμματα απαντήσεων του Παντογνώστη (milioner.html LETTERS) και απαντήσεις «Α», «Β»…: ολογράφως
  return pairs([...out, 'Α', 'Β', 'Γ', 'Δ']);  // + γράμματα απαντήσεων του Παντογνώστη (milioner.html LETTERS)
}

// mp3 24 kbps mono (μισό μέγεθος, αρκεί για ομιλία) και έλεγχος διάρκειας:
// κάποιες φορές το μοντέλο δεν σταματάει και βγάζει λεπτά ήχου για μία λέξη
const TMP = path.join(os.tmpdir(), 'make-voices-' + process.pid);
function shrink(mp3, input, n) {
  const f = `${TMP}-${n}.mp3`;
  fs.writeFileSync(f, execFileSync('ffmpeg', ['-v', 'error', '-i', 'pipe:0', '-ac', '1', '-b:a', '24k', '-f', 'mp3', 'pipe:1'], { input: mp3, maxBuffer: 1 << 28 }));
  const secs = +execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f]);
  const out = fs.readFileSync(f); fs.unlinkSync(f);
  return secs <= 2 + input.length * 0.12 ? out : null;
}

async function tts(input, key, n) {
  for (let tryNo = 1, bad = 0, blocked = 0, body = input; ; tryNo++) {
    let r;
    try {
      r = await fetch('https://api.mistral.ai/v1/audio/speech', {
        method: 'POST', headers: { Authorization: 'Bearer ' + key, 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: MODEL, input: body, voice_id: VOICE, response_format: 'mp3' }),
      });
    } catch (e) {  // δίκτυο: ξαναδοκιμάζει
      if (tryNo >= 5) throw e;
      await new Promise(ok => setTimeout(ok, 3000 * tryNo)); continue;
    }
    if (r.ok) {
      const mp3 = shrink(Buffer.from((await r.json()).audio_data, 'base64'), input, n);
      if (mp3) return mp3;
      if (++bad >= 3) return null;  // τρεις φορές πολύ μεγάλο: χωρίς ήχο
      continue;
    }
    // το φίλτρο του Mistral κόβει τυχαία αθώες λέξεις (κάβουρας, τσάντα): δοκιμάζει άλλη γραφή
    if (r.status === 403 && (await r.clone().text()).includes('guardrail')) {
      const alt = [input.replace(/\.$/, ''), input[0].toUpperCase() + input.slice(1).replace(/\.$/, '!'), input.replace(/\.$/, '...')];
      if (++blocked > alt.length) return null;
      body = alt[blocked - 1]; tryNo--; continue;
    }
    if (tryNo >= 4 || ![429, 500, 502, 503].includes(r.status)) throw new Error(`${r.status} ${await r.text()} — «${input}»`);
    await new Promise(ok => setTimeout(ok, 3000 * tryNo));
  }
}

async function main() {
  const key = DRY ? '' : (process.env.MISTRAL_API_KEY || fs.readFileSync(path.join(os.homedir(), '.config/mistral/api_key'), 'utf8')).trim();
  for (const [pack, list] of [['words', words()], ['pliroforiki', pliroforiki()], ['bank', bank()]]) {
    const dir = path.join(ROOT, 'voices', pack);
    fs.mkdirSync(dir, { recursive: true });
    const want = new Map();
    for (const [text, input] of list) want.set(hash(text), input);  // ίδιο κείμενο → ένα αρχείο
    const todo = [...want].filter(([h]) => !fs.existsSync(path.join(dir, h + '.mp3')));
    const chars = todo.reduce((s, [, t]) => s + t.length, 0);
    console.log(`${pack}: ${want.size} κείμενα, λείπουν ${todo.length} (${chars} χαρακτήρες ≈ $${(chars * PRICE).toFixed(2)})`);
    if (DRY) continue;
    let done = 0; const failed = [];
    const worker = async () => { for (let job; (job = todo.shift());) {
      const mp3 = await tts(job[1], key, todo.length);
      if (!mp3) { failed.push(job[1]); continue; }
      fs.writeFileSync(path.join(dir, job[0] + '.mp3'), mp3);
      process.stdout.write(`\r  ${++done} έτοιμα`);
    } };
    await Promise.all([1, 2, 3, 4].map(worker));
    if (done) console.log();
    if (failed.length) console.log('  χωρίς ήχο (φίλτρο του Mistral ή λάθος διάρκεια):', failed.join(' | '));
    // ήχοι κειμένων που άλλαξαν ή σβήστηκαν φεύγουν, για να μη φουσκώνει το offline αρχείο
    for (const f of fs.readdirSync(dir)) if (f.endsWith('.mp3') && !want.has(f.slice(0, -4))) fs.unlinkSync(path.join(dir, f));
    fs.writeFileSync(path.join(dir, 'index.js'), `Voice.add('voices/${pack}/', '${[...want.keys()].filter(h => fs.existsSync(path.join(dir, h + '.mp3'))).sort().join(' ')}');\n`);
  }
}
main().catch(e => { console.error('\n' + e.message); process.exit(1); });

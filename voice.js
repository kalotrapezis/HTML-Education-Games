/* Φωνή: παίζει έτοιμα mp3 (φτιαγμένα μία φορά με make-voices.js), όχι τη φωνή του browser.
   Κάθε «πακέτο» voices/<όνομα>/ έχει index.js που λέει ποια κείμενα έχουν ήχο:
     <script src="voice.js"></script>
     <script src="voices/words/index.js"></script>
   Voice.say('γάτα') ή Voice.say(['οδηγία', 'δεύτερη πρόταση'], i => …κάθε κομμάτι που ξεκινά) · Voice.has(κείμενο) · Voice.stop() */
window.Voice = (function () {
  var files = {}, audio = null, queue = [], onStep = null, step = 0;
  var ARROWS = { '↑': 'πάνω', '⬆': 'μπροστά', '↓': 'κάτω', '⬇': 'πίσω', '←': 'αριστερά', '→': 'δεξιά', '↶': 'στρίψε αριστερά', '↷': 'στρίψε δεξιά' };
  // ίδιο καθάρισμα στον browser και στο make-voices.js: χωρίς HTML, emoji, βελάκια
  function clean(s) {
    return String(s).replace(/<br\s*\/?>/gi, ' ').replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').replace(/&[a-z]+;/g, '')
      .replace(/(\p{L}[.!»]?)\s*→\s*(?=\p{L})/gu, '$1, ')            // «παίρνω → βάζω»: σειρά βημάτων
      .replace(/[↑⬆↓⬇←→↶↷]/g, function (a) { return ' ' + ARROWS[a] + ' '; })  // βελάκια εντολών
      .replace(/ = /g, ' ίσον ').replace(/ \+ /g, ' συν ').replace(/(\d) ?[−-] ?(?=\d)/g, '$1 μείον ').replace(/ ?× ?/g, ' επί ').replace(/ ?÷ ?/g, ' διά ')  // αλλιώς «plus», «equals»
      .replace(/[\p{Extended_Pictographic}\u{1F1E6}-\u{1F1FF}️‍⃣]/gu, '')
      .replace(/\s*[→⇒➜]\s*/g, ', ').replace(/\s+/g, ' ').replace(/ ([,.;!])/g, '$1').trim();
  }
  function hash(s) {  // FNV-1a 32 bit των UTF-8 bytes → όνομα αρχείου
    var h = 0x811c9dc5, b = unescape(encodeURIComponent(clean(s)));
    for (var i = 0; i < b.length; i++) h = Math.imul(h ^ b.charCodeAt(i), 0x01000193) >>> 0;
    return ('0000000' + h.toString(16)).slice(-8);
  }
  function file(s) { return files[hash(s)]; }
  function stop() { queue = []; onStep = null; if (audio) { audio.onended = null; audio.pause(); audio = null; } }
  function next() {
    var f = queue.shift();
    if (!f) { audio = null; return; }
    audio = new Audio(f); audio.onended = next;
    if (onStep) onStep(step++);
    audio.play().catch(function () {});
  }
  return {
    clean: clean, hash: hash, stop: stop,
    add: function (dir, list) { list.split(' ').forEach(function (h) { files[h] = dir + h + '.mp3'; }); },
    has: function (s) { return !!file(s); },
    say: function (texts, each) {  // true αν βρέθηκε ήχος
      stop(); onStep = each || null; step = 0;
      queue = [].concat(texts).map(file).filter(Boolean);
      var ok = queue.length > 0; next(); return ok;
    },
  };
})();

/* Πληκτρολόγιο για παιχνίδια με επιλογές: γράφεις ό,τι λέει ένα κουμπί (αριθμό, γράμμα, συλλαβή, λέξη)
   και πατιέται — μόλις μείνει ένα μόνο κουμπί που ταιριάζει. Με το ποντίκι/δάχτυλο δουλεύουν όπως πριν.
     KeyPick.watch('#opts button')                    κείμενο = ό,τι γράφει το κουμπί
     KeyPick.watch('.ans', el => el.dataset.letter)   δικό του κείμενο
   Αν κανένα κουμπί δεν αρχίζει με αριθμό, τα 1, 2, 3… διαλέγουν κατά σειρά.
   Γράφει ελληνικά και όταν τα Windows είναι στα αγγλικά. */
(function () {
  var LATIN = { A: 'Α', B: 'Β', G: 'Γ', D: 'Δ', E: 'Ε', Z: 'Ζ', H: 'Η', U: 'Θ', I: 'Ι', K: 'Κ', L: 'Λ', M: 'Μ', N: 'Ν', J: 'Ξ', O: 'Ο', P: 'Π', R: 'Ρ', S: 'Σ', W: 'Σ', T: 'Τ', Y: 'Υ', F: 'Φ', X: 'Χ', C: 'Ψ', V: 'Ω' };
  var GR_ABCD = { 'Α': 'A', 'Β': 'B', 'Γ': 'C', 'Δ': 'D' };  // Α/Β/Γ/Δ στο ελληνικό πληκτρολόγιο για απαντήσεις A–D
  function norm(s) {  // χωρίς τόνους, κεφαλαία, μόνο γράμματα/ψηφία (το 3:30 γράφεται 330)
    return String(s == null ? '' : s).normalize('NFD').replace(/[̀-ͯ]/g, '').toUpperCase().replace(/[^0-9A-ZΑ-Ω]/g, '');
  }
  function usable(el) {
    if (el.offsetParent === null || el.disabled) return false;
    if (el.classList.contains('no') || el.classList.contains('used')) return false;
    return getComputedStyle(el).visibility !== 'hidden';
  }
  var watchers = [], buf = '', timer = 0, pending = null;
  function collect() {
    var items = [];
    watchers.forEach(function (w) {
      document.querySelectorAll(w.sel).forEach(function (el) {
        if (usable(el)) items.push({ el: el, lab: norm(w.label ? w.label(el) : el.textContent) });
      });
    });
    return items.filter(function (it) { return it.lab; });
  }
  function fire(el) { buf = ''; pending = null; clearTimeout(timer); el.click(); }
  document.addEventListener('keydown', function (e) {
    if (e.ctrlKey || e.altKey || e.metaKey || e.repeat || e.defaultPrevented) return;
    var t = e.target;
    if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return;
    var items = collect();
    if (!items.length) return;
    var latinLabels = items.some(function (it) { return /[A-Z]/.test(it.lab); });
    var ch = e.key.length === 1 ? norm(e.key) : '';
    if (!latinLabels && /^Key[A-Z]$/.test(e.code) && !/[Α-Ω]/.test(ch)) ch = LATIN[e.code[3]] || ch;
    if (latinLabels && GR_ABCD[ch]) ch = GR_ABCD[ch];
    if (!ch) return;
    var startsWith = function (pre) { return items.filter(function (it) { return it.lab.indexOf(pre) === 0; }); };
    var next = buf + ch, starts = startsWith(next);
    if (!starts.length && pending) {  // το νέο πλήκτρο δεν συνεχίζει: πάτα πρώτα αυτό που περίμενε
      var el = pending; fire(el);
      items = collect(); next = ch; starts = startsWith(next);
    }
    if (!starts.length) {
      if (/^[1-9]$/.test(ch) && !items.some(function (it) { return /^[0-9]/.test(it.lab); })) {  // κατά σειρά
        var it = items[+ch - 1];
        if (it) { e.preventDefault(); fire(it.el); }
        return;
      }
      next = ch; starts = startsWith(next);
      if (!starts.length) { buf = ''; pending = null; return; }
    }
    e.preventDefault();
    clearTimeout(timer);
    var exacts = starts.filter(function (it) { return it.lab === next; });
    // ένα μόνο ταιριάζει, ή όλα είναι το ίδιο (π.χ. α και ά): πάτα το πρώτο
    if (starts.length === 1 || exacts.length === starts.length) { fire(starts[0].el); return; }
    buf = next; pending = exacts.length ? exacts[0].el : null;
    // π.χ. «1» και «12»: περίμενε λίγο μήπως ακολουθεί κι άλλο ψηφίο
    timer = setTimeout(function () { var el = pending; buf = ''; pending = null; if (el && el.isConnected && usable(el)) el.click(); }, 800);
  });
  window.KeyPick = { watch: function (sel, label) { watchers.push({ sel: sel, label: label }); } };
})();

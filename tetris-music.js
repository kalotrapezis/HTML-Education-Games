// Μουσική υποβάθρου για το Tetris — «Korobeiniki» (παραδοσιακό, δημόσια κτήση).
// Συνθετικό (Web Audio), χωρίς αρχεία. Πολυφωνικό: μελωδία + μπάσο + συγχορδίες.
// Επιταχύνει με το level. API: TetrisMusic.start/stop/setLevel/setEnabled/isEnabled
(function () {
  let actx = null, masterGain = null, enabled = true;
  const voices = [];

  function ac() {
    if (!actx) actx = new (window.AudioContext || window.webkitAudioContext)();
    if (actx.state === 'suspended') actx.resume();
    return actx;
  }
  function master() {
    const c = ac();
    if (!masterGain) { masterGain = c.createGain(); masterGain.gain.value = 0.55; masterGain.connect(c.destination); }
    return masterGain;
  }
  const N = n => 440 * Math.pow(2, (n - 69) / 12);

  function note(freq, when, dur, { type = 'sine', vol = 0.25, attack = 0.01, release = 0.06 } = {}) {
    const c = ac(); const t = c.currentTime + when;
    const o = c.createOscillator(); const g = c.createGain();
    o.type = type; o.frequency.setValueAtTime(freq, t);
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(vol, t + attack);
    g.gain.setValueAtTime(vol, Math.max(t + attack, t + dur - release));
    g.gain.linearRampToValueAtTime(0.0001, t + dur);
    o.connect(g).connect(master());
    o.start(t); o.stop(t + dur + 0.03);
    voices.push(o);
    o.onended = () => { const i = voices.indexOf(o); if (i >= 0) voices.splice(i, 1); };
  }
  function killVoices() {
    for (const o of voices.splice(0)) { try { o.stop(); o.disconnect(); } catch (e) {} }
  }

  // [midi, beats] (0 = παύση). Τέταρτο = 1 beat.
  const MEL = [
    [76,1],[71,.5],[72,.5],[74,1],[72,.5],[71,.5],
    [69,1],[69,.5],[72,.5],[76,1],[74,.5],[72,.5],
    [71,1.5],[72,.5],[74,1],[76,1],
    [72,1],[69,1],[69,1],[0,1],
    [0,.5],[74,1],[77,.5],[81,1],[79,.5],[77,.5],
    [76,1.5],[72,.5],[76,1],[74,.5],[72,.5],
    [71,1.5],[72,.5],[74,1],[76,1],
    [72,1],[69,1],[69,1],[0,1],
    [76,2],[72,2],
    [74,2],[71,2],
    [72,2],[69,2],
    [68,2],[71,1],[0,1],
    [76,2],[72,2],
    [74,2],[71,2],
    [72,1],[76,1],[81,2],
    [80,2],[0,2]
  ];
  const PROG = ['Am','Am','Em','Am','Dm','C','Em','Am','Am','G','Am','E','Am','G','Am','E'];
  const CH = {
    Am:{root:45, fifth:52, triad:[57,60,64]},
    Em:{root:40, fifth:47, triad:[52,55,59]},
    E :{root:40, fifth:47, triad:[52,56,59]},
    Dm:{root:38, fifth:45, triad:[50,53,57]},
    C :{root:36, fifth:43, triad:[48,52,55]},
    G :{root:43, fifth:50, triad:[55,59,62]}
  };
  const TOTAL_BEATS = 64;

  let loopTimer = null, playing = false, level = 1;

  // ταχύτητα ανά level: αργό στο 1, πιο γρήγορο όσο ανεβαίνει
  function beatSecForLevel() {
    return Math.max(0.16, 0.34 - (level - 1) * 0.012);
  }

  function scheduleOnce(beatSec) {
    let pos = 0;
    for (const [m, b] of MEL) {
      if (m > 0) note(N(m), pos * beatSec, b * beatSec * 0.95, { type: 'square', vol: 0.16, release: 0.05 });
      pos += b;
    }
    for (let mi = 0; mi < 16; mi++) {
      const c = CH[PROG[mi]];
      const base = mi * 4 * beatSec;
      const bassSeq = [c.root, c.fifth, c.root + 12, c.fifth];
      for (let bt = 0; bt < 4; bt++) {
        note(N(bassSeq[bt]), base + bt * beatSec, beatSec * 0.85, { type: 'triangle', vol: 0.13, release: 0.06 });
      }
      c.triad.forEach(tn => note(N(tn), base, 4 * beatSec * 0.96, { type: 'sine', vol: 0.04, attack: 0.03, release: 0.3 }));
    }
  }

  function run() {
    if (!playing || !enabled) return;
    const beatSec = beatSecForLevel();
    scheduleOnce(beatSec);
    loopTimer = setTimeout(run, TOTAL_BEATS * beatSec * 1000); // νέα ταχύτητα διαβάζεται στο επόμενο loop
  }

  window.TetrisMusic = {
    start() {
      if (!enabled || playing) return;
      ac(); playing = true; run();
    },
    stop() {
      playing = false;
      if (loopTimer) { clearTimeout(loopTimer); loopTimer = null; }
      killVoices();
    },
    setLevel(n) { level = Math.max(1, n || 1); },
    setEnabled(v) { enabled = v; if (!v) this.stop(); },
    isEnabled() { return enabled; }
  };
})();

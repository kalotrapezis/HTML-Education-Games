// Συνθετικοί ήχοι για το Space Invaders — όλα Web Audio, χωρίς αρχεία (copyright-safe).
// Επιλογές χρήστη από το invaders-soundlab.html.
(function () {
  let actx = null, masterGain = null, enabled = true;

  function ac() {
    if (!actx) actx = new (window.AudioContext || window.webkitAudioContext)();
    if (actx.state === 'suspended') actx.resume();
    return actx;
  }
  function master() {
    const c = ac();
    if (!masterGain) { masterGain = c.createGain(); masterGain.gain.value = 0.9; masterGain.connect(c.destination); }
    return masterGain;
  }
  const N = n => 440 * Math.pow(2, (n - 69) / 12);

  function note(freq, when, dur, { type = 'sine', vol = 0.25, attack = 0.01, release = 0.06, glideTo = null, vibrato = 0 } = {}) {
    const c = ac(); const t = c.currentTime + when;
    const o = c.createOscillator(); const g = c.createGain();
    o.type = type; o.frequency.setValueAtTime(freq, t);
    if (glideTo) o.frequency.exponentialRampToValueAtTime(glideTo, t + dur);
    if (vibrato) {
      const lfo = c.createOscillator(), lg = c.createGain();
      lfo.frequency.value = vibrato; lg.gain.value = freq * 0.02;
      lfo.connect(lg).connect(o.frequency); lfo.start(t); lfo.stop(t + dur + 0.05);
    }
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(vol, t + attack);
    g.gain.setValueAtTime(vol, Math.max(t + attack, t + dur - release));
    g.gain.linearRampToValueAtTime(0.0001, t + dur);
    o.connect(g).connect(master());
    o.start(t); o.stop(t + dur + 0.03);
  }

  function noise(when, dur, { vol = 0.18, hp = 600, lp = null } = {}) {
    const c = ac(); const t = c.currentTime + when;
    const n = Math.floor(c.sampleRate * dur);
    const buf = c.createBuffer(1, n, c.sampleRate); const d = buf.getChannelData(0);
    for (let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / n);
    const s = c.createBufferSource(); s.buffer = buf;
    let node = s;
    const f = c.createBiquadFilter(); f.type = 'highpass'; f.frequency.value = hp;
    node.connect(f); node = f;
    if (lp) { const l = c.createBiquadFilter(); l.type = 'lowpass'; l.frequency.value = lp; node.connect(l); node = l; }
    const g = c.createGain(); g.gain.value = vol;
    node.connect(g).connect(master()); s.start(t);
  }

  // ---- Εφέ (επιλογές χρήστη) ----
  function shootA() { // κλασικό pew
    note(900, 0, 0.10, { type: 'square', vol: 0.16, glideTo: 240, release: 0.05 });
    note(1800, 0, 0.05, { type: 'triangle', vol: 0.06, glideTo: 600 });
  }
  function shootB() { // πιο «laser»
    note(1200, 0, 0.14, { type: 'sawtooth', vol: 0.14, glideTo: 300 });
    noise(0, 0.04, { vol: 0.06, hp: 2000 });
  }
  function explodeA() { // μικρή
    noise(0, 0.18, { vol: 0.16, hp: 500, lp: 3000 });
    note(N(45), 0, 0.18, { type: 'sine', vol: 0.18, glideTo: N(33) });
  }
  function explodeB() { // βαριά
    noise(0, 0.32, { vol: 0.22, hp: 250, lp: 2200 });
    note(N(40), 0, 0.30, { type: 'sine', vol: 0.28, glideTo: N(26) });
    note(N(52), 0, 0.12, { type: 'sawtooth', vol: 0.10, glideTo: N(40) });
  }
  function laserFx() {
    const dur = 1.2;
    note(N(64), 0, dur, { type: 'sawtooth', vol: 0.10, vibrato: 18, release: 0.2 });
    note(N(76), 0, dur, { type: 'square', vol: 0.05, vibrato: 24, release: 0.2 });
    noise(0, dur, { vol: 0.04, hp: 1500 });
  }
  function playerHitFx() {
    note(N(52), 0, 0.16, { type: 'sawtooth', vol: 0.20, glideTo: N(44) });
    note(N(45), 0.16, 0.40, { type: 'sawtooth', vol: 0.20, glideTo: N(33) });
    noise(0.16, 0.4, { vol: 0.10, hp: 300 });
  }
  function shieldFx() {
    note(N(72), 0, 0.18, { type: 'sine', vol: 0.16, glideTo: N(79) });
    note(N(79), 0.06, 0.22, { type: 'triangle', vol: 0.10, vibrato: 30 });
    noise(0, 0.10, { vol: 0.04, hp: 3000 });
  }
  function powerupFx() { // Α — λαμπερό
    [72, 76, 79, 84].forEach((m, i) => note(N(m), i * 0.07, 0.16, { type: 'triangle', vol: 0.18, release: 0.1 }));
  }
  function waveClearFx() {
    [60, 67, 72].forEach((m, i) => note(N(m), i * 0.10, 0.16, { type: 'triangle', vol: 0.18 }));
    note(N(76), 0.30, 0.40, { type: 'sawtooth', vol: 0.14, release: 0.3, vibrato: 6 });
  }
  function victoryFx() {
    [60, 64, 67, 72, 76].forEach((m, i) => note(N(m), i * 0.09, 0.16, { type: 'sawtooth', vol: 0.15 }));
    [72, 76, 79, 84].forEach(m => note(N(m), 0.5, 0.9, { type: 'sawtooth', vol: 0.11, release: 0.6, vibrato: 6 }));
    noise(0.5, 0.3, { vol: 0.10, hp: 800 });
  }
  function gameOverFx() {
    note(N(57), 0.00, 0.22, { type: 'sawtooth', vol: 0.18, glideTo: N(53) });
    note(N(53), 0.24, 0.30, { type: 'sawtooth', vol: 0.18, glideTo: N(48) });
    note(N(48), 0.56, 0.30, { type: 'sawtooth', vol: 0.18, glideTo: N(43) });
    note(N(36), 0.90, 1.2, { type: 'sine', vol: 0.30, glideTo: N(31) });
    noise(0.90, 0.5, { vol: 0.08, hp: 200 });
  }

  // ---- Μαρς υπόβαθρου (χαμηλή ένταση, αργό→γρήγορο ανάλογα με την προσέγγιση του κύματος) ----
  const MARCH = [40, 38, 36, 34];
  const SLOW = 0.52, FAST = 0.20; // δευτερόλεπτα ανά βήμα
  let marchTimer = null, marchI = 0, marchIntensity = 0, marchOn = false;

  function marchBeat() {
    if (!marchOn || !enabled) return;
    const interval = SLOW + (FAST - SLOW) * marchIntensity;
    const m = MARCH[marchI % 4];
    note(N(m), 0, interval * 0.7, { type: 'square', vol: 0.07, release: 0.06 });
    note(N(m - 12), 0, interval * 0.7, { type: 'sine', vol: 0.045 });
    marchI++;
    marchTimer = setTimeout(marchBeat, interval * 1000);
  }
  function marchStartInternal() {
    if (marchOn) return;
    marchOn = true; marchI = 0;
    marchBeat();
  }
  function marchStopInternal() {
    marchOn = false;
    if (marchTimer) { clearTimeout(marchTimer); marchTimer = null; }
  }

  window.InvSounds = {
    unlock() { ac(); },
    setEnabled(v) { enabled = v; if (!v) marchStopInternal(); },
    isEnabled() { return enabled; },
    shoot() { if (!enabled) return; (Math.random() < 0.5 ? shootA : shootB)(); },
    explode(big) { if (!enabled) return; (big ? explodeB : explodeA)(); },
    laser() { if (!enabled) return; laserFx(); },
    playerHit() { if (!enabled) return; playerHitFx(); },
    shield() { if (!enabled) return; shieldFx(); },
    powerup() { if (!enabled) return; powerupFx(); },
    waveClear() { if (!enabled) return; waveClearFx(); },
    victory() { if (!enabled) return; victoryFx(); },
    gameOver() { if (!enabled) return; gameOverFx(); },
    marchStart() { if (!enabled) return; marchStartInternal(); },
    marchStop() { marchStopInternal(); },
    setMarchIntensity(p) { marchIntensity = Math.max(0, Math.min(1, p)); }
  };
})();

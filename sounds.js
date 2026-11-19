/* ============================================================
   GameSounds — synthesized game cues (Web Audio API).
   No audio files, no copyrighted material; everything is generated live.
   Finalized in sound-lab.html. Shared by milioner.html, MathGame.html, ...

   API:
     GameSounds.unlock()          // call on first user gesture (resumes AudioContext)
     GameSounds.background()      // start looping background music (idempotent)
     GameSounds.backgroundStop()
     GameSounds.suspense()        // tik-tak-tok + held low tone (until stopped)
     GameSounds.suspenseStop()
     GameSounds.correct()         // simple correct chime (tu-ru-ru-ru)
     GameSounds.bigCorrect()      // rich win fanfare (pillow / big correct)
     GameSounds.wrong()           // simple wrong (tu-tuu)
     GameSounds.bigWrong()        // big wrong (tu-tuu-tuuu-crash)
     GameSounds.pop(step) / thud() // short blips for fast games
     GameSounds.spinMusic(rate)   // upbeat loop while a wheel spins; rate() → speed (1 = normal)
     GameSounds.spinMusicStop()
     GameSounds.ratchet(step) / boing() // winding a spring / letting it go
     GameSounds.tak(step)         // a wheel's flapper hitting a peg (lower step = higher)
     GameSounds.stopAll()
   ============================================================ */
(function(){
  let actx = null;
  let bg = null;              // background loop handle
  const held = new Set();     // sustained drones (suspense)

  function ac(){
    if(!actx) actx = new (window.AudioContext || window.webkitAudioContext)();
    if(actx.state === 'suspended') actx.resume();
    return actx;
  }
  function master(){
    const c = ac();
    if(!c._m){ const g = c.createGain(); g.gain.value = 0.9; g.connect(c.destination); c._m = g; }
    return c._m;
  }
  const N = n => 440 * Math.pow(2, (n-69)/12);   // MIDI note -> Hz

  function note(freq, when, dur, o){
    o = o || {};
    const type = o.type || 'sine', vol = o.vol == null ? 0.25 : o.vol;
    const attack = o.attack == null ? 0.01 : o.attack;
    const release = o.release == null ? 0.06 : o.release;
    const c = ac(), t = c.currentTime + when;
    const osc = c.createOscillator(), g = c.createGain();
    osc.type = type; osc.frequency.setValueAtTime(freq, t);
    if(o.glideTo) osc.frequency.exponentialRampToValueAtTime(o.glideTo, t+dur);
    if(o.vibrato){
      const lfo = c.createOscillator(), lg = c.createGain();
      lfo.frequency.value = o.vibrato; lg.gain.value = freq*0.012;
      lfo.connect(lg).connect(osc.frequency); lfo.start(t); lfo.stop(t+dur+0.05);
    }
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(vol, t+attack);
    g.gain.setValueAtTime(vol, Math.max(t+attack, t+dur-release));
    g.gain.linearRampToValueAtTime(0.0001, t+dur);
    osc.connect(g).connect(master());
    osc.start(t); osc.stop(t+dur+0.03);
  }

  function noise(when, dur, o){
    o = o || {};
    const vol = o.vol == null ? 0.18 : o.vol, hp = o.hp == null ? 600 : o.hp;
    const c = ac(), t = c.currentTime + when;
    const n = Math.floor(c.sampleRate*dur);
    const buf = c.createBuffer(1, n, c.sampleRate), d = buf.getChannelData(0);
    for(let i=0;i<n;i++) d[i] = (Math.random()*2-1)*(1-i/n);
    const s = c.createBufferSource(); s.buffer = buf;
    const f = c.createBiquadFilter(); f.type='highpass'; f.frequency.value = hp;
    const g = c.createGain(); g.gain.value = vol;
    s.connect(f).connect(g).connect(master()); s.start(t);
  }

  // sustained tone that holds until stopped; starts after `when` seconds
  function drone(freq, when, o){
    o = o || {};
    const type = o.type || 'sine', vol = o.vol == null ? 0.12 : o.vol;
    const c = ac(), t = c.currentTime + when;
    const osc = c.createOscillator(), g = c.createGain();
    osc.type = type; osc.frequency.value = freq;
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vol, t+0.3);
    osc.connect(g).connect(master()); osc.start(t);
    const h = { stop(){ const now = c.currentTime;
        g.gain.cancelScheduledValues(now); g.gain.setValueAtTime(g.gain.value, now);
        g.gain.linearRampToValueAtTime(0.0001, now+0.15);
        osc.stop(now+0.2); held.delete(h); } };
    held.add(h); return h;
  }

  // ---- background: minor progression Am-F-C-G, "rich" version ----
  const PROG = [ [45,[57,60,64]], [41,[53,57,60]], [48,[60,64,67]], [43,[55,59,62]] ];
  function background(){
    if(bg) return;                       // idempotent: already playing
    let i = 0;
    const step = ()=>{
      const p = PROG[i%4], b = p[0], tr = p[1];
      note(N(b),    0,    1.45, {type:'sine', vol:0.11});
      note(N(b),    0,    0.22, {type:'sine', vol:0.06});
      note(N(b),    0.78, 0.22, {type:'sine', vol:0.05});
      tr.forEach(m=> note(N(m), 0, 1.45, {type:'triangle', vol:0.03, release:0.7}));
      tr.forEach((m,k)=> note(N(m+12), 0.12+k*0.34, 0.4, {type:'sine', vol:0.045, release:0.25}));
      i++;
    };
    step();
    const id = setInterval(step, 1500);
    bg = { stop(){ clearInterval(id); bg = null; } };
  }
  function backgroundStop(){ if(bg) bg.stop(); }

  // ---- suspense: tik-tak-tok then held 3rd tone ----
  function suspense(){
    suspenseStop();
    note(N(74), 0.00, 0.13, {type:'triangle', vol:0.22});  // tik
    note(N(69), 0.34, 0.13, {type:'triangle', vol:0.22});  // tak
    note(N(62), 0.68, 0.18, {type:'triangle', vol:0.22});  // tok
    drone(N(62), 0.86, {type:'triangle', vol:0.06});
    drone(N(50), 0.86, {type:'triangle', vol:0.03});
  }
  function suspenseStop(){ Array.from(held).forEach(h=>h.stop()); }

  // ---- correct (simple): four ascending notes, last higher ----
  function correct(){
    const seq = [60,64,67,72];
    seq.forEach((m,i)=>{
      const last = i === seq.length-1;
      note(N(m+12), i*0.11, last?0.34:0.18, {type:'triangle', vol:0.22, release:last?0.22:0.1});
    });
    note(N(72), 3*0.11, 0.34, {type:'sine', vol:0.06, release:0.22});
  }

  // ---- big correct / pillow win: rich fanfare ----
  function bigCorrect(){
    [60,64,67,72,76].forEach((m,i)=> note(N(m), i*0.09, 0.16, {type:'sawtooth', vol:0.16}));
    [72,76,79,84].forEach(m=> note(N(m), 0.5, 0.9, {type:'sawtooth', vol:0.12, release:0.6, vibrato:6}));
    noise(0.5, 0.3, {vol:0.12});
  }

  // ---- wrong (simple): tu-tuu ----
  function wrong(){
    note(N(57), 0,   0.18, {type:'sawtooth', vol:0.2});
    note(N(53), 0.2, 0.45, {type:'sawtooth', vol:0.2, glideTo:N(48)});
  }

  // ---- big wrong: tu-tuu-tuuu-crash ----
  function bigWrong(){
    note(N(57), 0.00, 0.18, {type:'sawtooth', vol:0.2});
    note(N(53), 0.20, 0.40, {type:'sawtooth', vol:0.2, glideTo:N(48)});
    note(N(48), 0.60, 0.50, {type:'sawtooth', vol:0.2, glideTo:N(43)});
    const c = 1.15;
    note(N(36), c, 1.4, {type:'sine', vol:0.34});
    note(N(50), c, 0.9, {type:'sawtooth', vol:0.16, glideTo:N(38), vibrato:7});
    note(N(51), c, 0.9, {type:'sawtooth', vol:0.10, glideTo:N(39)});
    noise(c, 0.5, {vol:0.10, hp:300});
  }

  // σύντομα για γρήγορα παιχνίδια: pop ανεβαίνει με το σερί, thud = χάθηκε κάτι
  function pop(step){ note(N(72 + (step||0) % 12), 0, 0.09, {type:'triangle', vol:0.22}); }
  function thud(){ note(N(45), 0, 0.14, {type:'square', vol:0.12, glideTo:N(38)}); }

  // ---- spin music: χαρούμενο λουπάκι όσο γυρνάει ο τροχός, επιβραδύνει μαζί του ----
  const SPIN_MEL  = [72,76,79,76, 74,77,81,77, 72,76,79,84, 83,79,74,71];
  const SPIN_BASS = [48,0,55,0,   50,0,57,0,   48,0,55,0,   43,0,50,0];
  let spinT = null;
  function spinMusic(rate){
    spinMusicStop();
    let i = 0;
    const step = ()=>{
      const r = Math.max(0.4, Math.min(1.8, rate ? rate() : 1)), d = 0.12 / r;
      note(N(SPIN_MEL[i%16]), 0, d*0.9, {type:'square', vol:0.06});
      if(SPIN_BASS[i%16]) note(N(SPIN_BASS[i%16]), 0, d*1.8, {type:'triangle', vol:0.18});
      noise(0, 0.03, {vol: i%2 ? 0.03 : 0.06, hp:6000});
      i++; spinT = setTimeout(step, d*1000);
    };
    step();
  }
  function spinMusicStop(){ clearTimeout(spinT); spinT = null; }
  // κούρδισμα: «κρρκ» της καστάνιας, ψηλότερα όσο σφίγγει· boing: το ελατήριο ξεκουρδίζεται
  function ratchet(step){ noise(0, 0.025, {vol:0.12, hp:2500}); note(N(40 + (step||0)), 0, 0.03, {type:'square', vol:0.06}); }
  function tak(step){ noise(0, 0.018, {vol:0.22, hp:1800}); note(N(79 - (step||0)), 0, 0.035, {type:'triangle', vol:0.2, glideTo:N(67 - (step||0))}); }
  function boing(){ note(N(50), 0, 0.5, {type:'sine', vol:0.25, glideTo:N(74), vibrato:12}); }

  function stopAll(){ backgroundStop(); suspenseStop(); spinMusicStop(); }

  window.GameSounds = {
    unlock: ac,
    background, backgroundStop,
    suspense, suspenseStop,
    correct, bigCorrect,
    wrong, bigWrong,
    pop, thud,
    spinMusic, spinMusicStop, ratchet, boing, tak,
    stopAll
  };
})();

/* Shared touch-controls helper for the HTML games.
   Original code, no external assets. Exposes window.TouchControls with:
     - isTouch                : boolean, true on touch-capable devices
     - button(opts)           : create a floating on-screen button
     - group()                : a show/hide-able set of buttons
     - attachDrag(canvas,opts): single-finger drag + tap on a canvas
   Buttons are hidden on non-touch devices, so desktop play is unaffected. */
(function () {
  'use strict';

  var isTouch = (window.matchMedia && window.matchMedia('(pointer: coarse)').matches)
    || ('ontouchstart' in window)
    || (navigator.maxTouchPoints || 0) > 0;

  function baseStyle(el, o) {
    var s = el.style;
    s.position = 'fixed';
    s.zIndex = '300';
    s.display = 'none';
    s.alignItems = 'center';
    s.justifyContent = 'center';
    s.width = (o.size || 74) + 'px';
    s.height = (o.size || 74) + 'px';
    s.borderRadius = o.radius || '50%';
    s.border = '2px solid rgba(255,255,255,0.6)';
    s.background = o.bg || 'rgba(0,0,0,0.28)';
    s.color = '#fff';
    s.fontSize = (o.fontSize || 28) + 'px';
    s.fontWeight = 'bold';
    s.fontFamily = 'inherit';
    s.lineHeight = '1';
    s.padding = '0';
    s.boxShadow = '0 2px 12px rgba(0,0,0,0.4)';
    s.userSelect = 'none';
    s.webkitUserSelect = 'none';
    s.webkitTapHighlightColor = 'transparent';
    s.touchAction = 'none';
    if (!o.anchorTo) {                       // viewport-corner positioning (default)
      s.bottom = (o.bottom != null ? o.bottom : 26) + 'px';
      if (o.left != null) s.left = o.left + 'px';
      if (o.right != null) s.right = o.right + 'px';
    }
    el.textContent = o.label || '';
  }

  /* Pin a fixed-position element to a corner of a reference element (e.g. the
     game canvas) so controls float over the game instead of the far viewport
     corner. Re-positions on resize / orientation / scroll / fullscreen. */
  function anchorTo(el, w, h, o) {
    var ref = o.anchorTo, corner = o.corner || 'br';
    var ix = o.insetX != null ? o.insetX : 14;
    var iy = o.insetY != null ? o.insetY : 14;
    var leftCorner = (corner === 'bl' || corner === 'tl');
    var topCorner = (corner === 'tl' || corner === 'tr');
    function place() {
      var r = ref.getBoundingClientRect();
      if (!r.width) return;
      var vw = window.innerWidth, vh = window.innerHeight, M = 6;
      // centerY vertically centers the control on the reference (read live so it
      // can be toggled per game mode); otherwise pin to the top or bottom edge.
      var top = o.centerY
        ? (r.top + r.height / 2 - h / 2)
        : (topCorner ? (r.top + iy) : (r.bottom - h - iy));
      // edgeX hugs the viewport edge (uses the empty margins beside a
      // letterboxed canvas); otherwise inset from the canvas edge.
      var left = o.edgeX
        ? (leftCorner ? ix : (vw - w - ix))
        : (leftCorner ? (r.left + ix) : (r.right - w - ix));
      left = Math.max(M, Math.min(left, vw - w - M));
      top = Math.max(M, Math.min(top, vh - h - M));
      el.style.left = left + 'px';
      el.style.top = top + 'px';
      el.style.right = 'auto';
      el.style.bottom = 'auto';
    }
    place();
    window.addEventListener('resize', place);
    window.addEventListener('orientationchange', place);
    window.addEventListener('scroll', place, true);
    document.addEventListener('fullscreenchange', function () { setTimeout(place, 80); });
    return place;
  }

  function makeButton(o) {
    var el = document.createElement('button');
    el.type = 'button';
    baseStyle(el, o);
    var bg = o.bg || 'rgba(0,0,0,0.28)';
    var bgA = o.bgActive || 'rgba(255,255,255,0.3)';
    function press(e) {
      if (e) e.preventDefault();
      el.style.background = bgA;
      el.style.transform = 'scale(0.9)';
      if (o.onDown) o.onDown();
    }
    function release(e) {
      if (e) e.preventDefault();
      el.style.background = bg;
      el.style.transform = '';
      if (o.onUp) o.onUp();
    }
    el.addEventListener('touchstart', press, { passive: false });
    el.addEventListener('touchend', release, { passive: false });
    el.addEventListener('touchcancel', release, { passive: false });
    el.addEventListener('mousedown', press);
    el.addEventListener('mouseup', release);
    el.addEventListener('mouseleave', function (e) { if (e.buttons) release(e); });
    document.body.appendChild(el);
    if (o.anchorTo) el._place = anchorTo(el, o.size || 74, o.size || 74, o);
    return el;
  }

  function group() {
    var els = [], visible = false;
    function refresh() {
      var d = (visible && isTouch) ? 'flex' : 'none';
      for (var i = 0; i < els.length; i++) {
        els[i].style.display = d;
        // Re-anchor on show: position may have been computed while the canvas
        // was still hidden (zero-size), so recompute now that it's visible.
        if (d !== 'none' && els[i]._place) els[i]._place();
      }
    }
    return {
      button: function (o) { var el = makeButton(o); els.push(el); refresh(); return el; },
      show: function () { visible = true; refresh(); },
      hide: function () { visible = false; refresh(); },
      visible: function () { return visible; }
    };
  }

  /* Single-finger drag + tap on a canvas. Coordinates are mapped to the
     canvas's internal resolution, so CSS scaling is handled.
     opts: onStart(x,y), onMove(x,y,dx,dy), onTap(x,y), onEnd(), tapThreshold */
  function attachDrag(canvas, o) {
    o = o || {};
    var active = false, sx = 0, sy = 0, moved = 0, lx = 0, ly = 0;
    function pt(t) {
      var r = canvas.getBoundingClientRect();
      return {
        x: (t.clientX - r.left) * (canvas.width / r.width),
        y: (t.clientY - r.top) * (canvas.height / r.height)
      };
    }
    function start(e) {
      e.preventDefault();
      active = true; moved = 0;
      var p = pt(e.touches ? e.touches[0] : e);
      sx = lx = p.x; sy = ly = p.y;
      if (o.onStart) o.onStart(p.x, p.y);
    }
    function move(e) {
      if (!active) return;
      e.preventDefault();
      var p = pt(e.touches ? e.touches[0] : e);
      moved += Math.abs(p.x - lx) + Math.abs(p.y - ly);
      if (o.onMove) o.onMove(p.x, p.y, p.x - lx, p.y - ly);
      lx = p.x; ly = p.y;
    }
    function end(e) {
      if (!active) return;
      e.preventDefault();
      active = false;
      if (moved < (o.tapThreshold || 14) && o.onTap) o.onTap(sx, sy);
      if (o.onEnd) o.onEnd();
    }
    canvas.addEventListener('touchstart', start, { passive: false });
    canvas.addEventListener('touchmove', move, { passive: false });
    canvas.addEventListener('touchend', end, { passive: false });
    canvas.addEventListener('touchcancel', end, { passive: false });
  }

  /* Encourage landscape on touch devices. Shows a full-screen "rotate your
     device" overlay while in portrait, hides it in landscape, and makes a
     best-effort attempt to lock orientation (works only in fullscreen on
     some browsers; silently ignored elsewhere). No-op on non-touch devices. */
  function requireLandscape(opts) {
    if (!isTouch) return;
    opts = opts || {};
    var msg = opts.message || 'Γύρισε τη συσκευή σου σε οριζόντια θέση';

    var ov = document.createElement('div');
    var s = ov.style;
    s.position = 'fixed';
    s.left = '0'; s.top = '0'; s.right = '0'; s.bottom = '0';
    s.zIndex = '9999';
    s.display = 'none';
    s.flexDirection = 'column';
    s.alignItems = 'center';
    s.justifyContent = 'center';
    s.gap = '18px';
    s.background = 'rgba(5,10,32,0.97)';
    s.color = '#fff';
    s.textAlign = 'center';
    s.padding = '24px';
    s.fontFamily = 'inherit';
    s.userSelect = 'none';
    s.webkitUserSelect = 'none';

    var icon = document.createElement('div');
    icon.textContent = '🔄';
    icon.style.fontSize = '64px';
    icon.style.animation = 'tcRotateHint 1.6s ease-in-out infinite';

    var phone = document.createElement('div');
    phone.textContent = '📱';
    phone.style.fontSize = '54px';

    var text = document.createElement('div');
    text.textContent = msg;
    text.style.fontSize = '20px';
    text.style.fontWeight = 'bold';
    text.style.maxWidth = '320px';
    text.style.lineHeight = '1.4';

    var style = document.createElement('style');
    style.textContent = '@keyframes tcRotateHint{0%,100%{transform:rotate(0)}50%{transform:rotate(90deg)}}';
    document.head.appendChild(style);

    ov.appendChild(icon);
    ov.appendChild(phone);
    ov.appendChild(text);
    document.body.appendChild(ov);

    function isPortrait() {
      if (window.matchMedia) return window.matchMedia('(orientation: portrait)').matches;
      return window.innerHeight > window.innerWidth;
    }
    function update() {
      ov.style.display = isPortrait() ? 'flex' : 'none';
    }
    window.addEventListener('resize', update);
    window.addEventListener('orientationchange', update);
    update();

    try {
      if (screen.orientation && screen.orientation.lock) {
        var p = screen.orientation.lock('landscape');
        if (p && p.catch) p.catch(function () {});
      }
    } catch (e) { /* unsupported — overlay is the fallback */ }

    return { overlay: ov, update: update };
  }

  /* Best-effort fullscreen request. Must be called from a user gesture
     (e.g. a click/tap handler). No-op on non-touch devices and silently
     ignored where unsupported (e.g. iOS Safari has no element fullscreen). */
  function goFullscreen(el) {
    if (!isTouch) return;
    el = el || document.documentElement;
    var req = el.requestFullscreen || el.webkitRequestFullscreen || el.msRequestFullscreen;
    if (!req) return;
    try {
      var p = req.call(el);
      if (p && p.catch) p.catch(function () {});
    } catch (e) { /* unsupported — ignore */ }
  }

  /* Analog joystick. A visible base with a knob the thumb drags; the knob is
     capped to the base radius. value() returns a {x,y} vector in [-1,1] that
     the game reads each frame (so the finger stays on the stick, never over
     the player). Anchor it to the game canvas via opts.anchorTo. */
  function joystick(o) {
    o = o || {};
    var R = o.size || 132, KR = o.knobSize || 58, maxR = (R - KR) / 2;
    var base = document.createElement('div'), knob = document.createElement('div');
    var bs = base.style;
    bs.position = 'fixed'; bs.zIndex = '300'; bs.display = 'none';
    bs.width = R + 'px'; bs.height = R + 'px'; bs.borderRadius = '50%';
    bs.border = '2px solid rgba(255,255,255,0.4)';
    bs.background = 'rgba(255,255,255,0.1)';
    bs.boxShadow = '0 2px 14px rgba(0,0,0,0.4)';
    bs.touchAction = 'none'; bs.userSelect = 'none'; bs.webkitUserSelect = 'none';
    bs.webkitTapHighlightColor = 'transparent';
    var ks = knob.style;
    ks.position = 'absolute'; ks.left = '50%'; ks.top = '50%';
    ks.width = KR + 'px'; ks.height = KR + 'px'; ks.borderRadius = '50%';
    ks.marginLeft = (-KR / 2) + 'px'; ks.marginTop = (-KR / 2) + 'px';
    ks.background = 'rgba(255,255,255,0.32)';
    ks.border = '2px solid rgba(255,255,255,0.7)';
    ks.pointerEvents = 'none';
    base.appendChild(knob);
    document.body.appendChild(base);
    var anchorOpts = { anchorTo: o.anchorTo, corner: o.corner || 'bl', insetX: o.insetX, insetY: o.insetY, edgeX: o.edgeX, centerY: o.centerY };
    var place = o.anchorTo ? anchorTo(base, R, R, anchorOpts) : null;

    var vec = { x: 0, y: 0 }, id = null;
    function setKnob(dx, dy) { knob.style.transform = 'translate(' + dx + 'px,' + dy + 'px)'; }
    function track(cx, cy) {
      var r = base.getBoundingClientRect();
      var dx = cx - (r.left + r.width / 2), dy = cy - (r.top + r.height / 2);
      var d = Math.hypot(dx, dy);
      if (d > maxR && d > 0) { dx = dx / d * maxR; dy = dy / d * maxR; }
      setKnob(dx, dy);
      vec.x = dx / maxR; vec.y = dy / maxR;
    }
    base.addEventListener('touchstart', function (e) {
      e.preventDefault(); var t = e.changedTouches[0]; id = t.identifier; track(t.clientX, t.clientY);
    }, { passive: false });
    base.addEventListener('touchmove', function (e) {
      e.preventDefault();
      for (var i = 0; i < e.changedTouches.length; i++) {
        var t = e.changedTouches[i]; if (t.identifier === id) { track(t.clientX, t.clientY); break; }
      }
    }, { passive: false });
    function release(e) {
      e.preventDefault();
      for (var i = 0; i < e.changedTouches.length; i++) {
        if (e.changedTouches[i].identifier === id) { id = null; vec.x = vec.y = 0; setKnob(0, 0); break; }
      }
    }
    base.addEventListener('touchend', release, { passive: false });
    base.addEventListener('touchcancel', release, { passive: false });

    return {
      el: base,
      value: function () { return vec; },
      setCenterY: function (b) { anchorOpts.centerY = b; if (place && base.style.display !== 'none') place(); },
      show: function () { if (isTouch) { base.style.display = 'block'; if (place) place(); } },
      hide: function () { base.style.display = 'none'; id = null; vec.x = vec.y = 0; setKnob(0, 0); }
    };
  }

  window.TouchControls = {
    isTouch: isTouch,
    button: makeButton,
    group: group,
    joystick: joystick,
    attachDrag: attachDrag,
    requireLandscape: requireLandscape,
    goFullscreen: goFullscreen
  };
})();

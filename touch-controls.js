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
    s.border = '2px solid rgba(255,255,255,0.75)';
    s.background = o.bg || 'rgba(0,0,0,0.42)';
    s.color = '#fff';
    s.fontSize = (o.fontSize || 28) + 'px';
    s.fontWeight = 'bold';
    s.fontFamily = 'inherit';
    s.lineHeight = '1';
    s.padding = '0';
    s.boxShadow = '0 2px 12px rgba(0,0,0,0.45)';
    s.userSelect = 'none';
    s.webkitUserSelect = 'none';
    s.webkitTapHighlightColor = 'transparent';
    s.touchAction = 'none';
    s.bottom = (o.bottom != null ? o.bottom : 26) + 'px';
    if (o.left != null) s.left = o.left + 'px';
    if (o.right != null) s.right = o.right + 'px';
    el.textContent = o.label || '';
  }

  function makeButton(o) {
    var el = document.createElement('button');
    el.type = 'button';
    baseStyle(el, o);
    var bg = o.bg || 'rgba(0,0,0,0.42)';
    var bgA = o.bgActive || 'rgba(255,255,255,0.32)';
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
    return el;
  }

  function group() {
    var els = [], visible = false;
    function refresh() {
      var d = (visible && isTouch) ? 'flex' : 'none';
      for (var i = 0; i < els.length; i++) els[i].style.display = d;
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

  window.TouchControls = {
    isTouch: isTouch,
    button: makeButton,
    group: group,
    attachDrag: attachDrag,
    requireLandscape: requireLandscape,
    goFullscreen: goFullscreen
  };
})();

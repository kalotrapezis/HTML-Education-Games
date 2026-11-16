/* Στην αφή, ένα αργό πάτημα ανοίγει το μενού του συστήματος (δεξί κλικ) αντί για κλικ.
   Εδώ: κανένα μενού συστήματος, και το αργό πάτημα με το δάχτυλο μετράει ως κανονικό κλικ. */
(function () {
  var touch = false, held = null;
  document.addEventListener('pointerdown', function (e) { touch = e.pointerType !== 'mouse'; held = null; }, true);
  document.addEventListener('contextmenu', function (e) {
    e.preventDefault();
    if (touch) held = e.target;
  });
  document.addEventListener('pointerup', function () {
    var el = held; held = null;
    if (!el) return;
    var clicked = false;
    function seen() { clicked = true; }
    document.addEventListener('click', seen, true);
    setTimeout(function () {  // ο browser έδωσε κλικ μόνος του; τότε όχι δεύτερο
      document.removeEventListener('click', seen, true);
      if (!clicked && el.isConnected) el.click();
    }, 80);
  }, true);
  var st = document.createElement('style');  // όχι αναδυόμενο «αντιγραφή/αποθήκευση εικόνας» στο iPad/Android
  st.textContent = 'body{-webkit-touch-callout:none}';
  document.head.appendChild(st);
})();

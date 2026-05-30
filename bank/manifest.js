/* ============================================================
   ΤΡΑΠΕΖΑ ΕΡΩΤΗΣΕΩΝ — Manifest
   ------------------------------------------------------------
   Αυτό το αρχείο περιγράφει:
   1. Τις τάξεις (grades) με σειρά εμφάνισης και όνομα.
   2. Τα μαθήματα (subjects) με εικονίδιο.
   3. Τα αρχεία δεδομένων (files) που πρέπει να φορτωθούν — ένα
      ανά μάθημα+τάξη. Κάθε αρχείο καλεί registerQuiz({...}).

   ΠΩΣ ΠΡΟΣΘΕΤΕΙΣ ΝΕΟ ΜΑΘΗΜΑ/ΤΑΞΗ:
   - Φτιάξε ένα νέο αρχείο π.χ. bank/mathimatika-e.js (αντίγραψε
     τη μορφή ενός υπάρχοντος).
   - Πρόσθεσε μία γραμμή στο "files" παρακάτω.
   Τίποτα άλλο. Το παιχνίδι το βρίσκει αυτόματα.
   ============================================================ */

window.QUIZ_MANIFEST = {
  grades: [
    { id: "a",  name: "Α' Δημοτικού",  order: 1 },
    { id: "b",  name: "Β' Δημοτικού",  order: 2 },
    { id: "g",  name: "Γ' Δημοτικού",  order: 3 },
    { id: "d",  name: "Δ' Δημοτικού",  order: 4 },
    { id: "e",  name: "Ε' Δημοτικού",  order: 5 },
    { id: "st", name: "ΣΤ' Δημοτικού", order: 6 }
  ],

  subjects: [
    { id: "istoria",      name: "Ιστορία",                     icon: "📜" },
    { id: "glossa",       name: "Γλώσσα",                      icon: "✍️" },
    { id: "mathimatika",  name: "Μαθηματικά",                  icon: "➗" },
    { id: "fisiki",       name: "Φυσική",                      icon: "🔬" },
    { id: "geografia",    name: "Γεωγραφία",                   icon: "🌍" },
    { id: "thriskeftika", name: "Θρησκευτικά",                 icon: "⛪" },
    { id: "koinoniki",    name: "Κοινωνική & Πολιτική Αγωγή",  icon: "🏛️" },
    { id: "eikastika",    name: "Εικαστικά",                   icon: "🎨" },
    { id: "agglika",      name: "Αγγλικά",                     icon: "🔤" }
  ],

  /* Τα αρχεία που φορτώνονται. Πρόσθεσε εδώ νέα αρχεία. */
  files: [
    "istoria-g.js",
    "istoria-d.js",
    "istoria-e.js",
    "istoria-st.js",
    "glossa-a.js",
    "glossa-b.js",
    "glossa-g.js",
    "glossa-d.js",
    "glossa-e.js",
    "glossa-st.js",
    "geografia-e.js",
    "geografia-st.js",
    "fisiki-e.js",
    "fisiki-st.js",
    "thriskeftika-g.js",
    "thriskeftika-d.js",
    "thriskeftika-e.js",
    "thriskeftika-st.js",
    "koinoniki-e.js",
    "koinoniki-st.js",
    "mathimatika-a.js",
    "mathimatika-b.js",
    "mathimatika-g.js",
    "mathimatika-d.js",
    "mathimatika-e.js",
    "mathimatika-st.js",
    "agglika-a.js",
    "agglika-b.js",
    "agglika-g.js",
    "agglika-d.js",
    "agglika-e.js",
    "agglika-st.js",
    "eikastika-a.js",
    "eikastika-b.js",
    "eikastika-g.js",
    "eikastika-d.js",
    "eikastika-e.js",
    "eikastika-st.js"
  ]
};

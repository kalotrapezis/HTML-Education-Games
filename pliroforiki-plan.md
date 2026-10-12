# Πληροφορική Δημοτικού — development plan (`pliroforiki.html`)

Source books (two editions per grade):
`~/Tetra/Files/Documents/Δουλειά ⚒️/Εκπαίδευση 🧱/Πληροφορική 🖥️/ΤΠΕ/Books/`

| Grade | Older edition (Υπατία & Ήρωνας, 30 lessons) | Newer edition (ΙΕΠ, chapters x.y.z) |
|---|---|---|
| Α΄ | v6.0 | v09 |
| Β΄ | v7.0 | v08 |
| Γ΄ | v7.0 | v09 |
| Δ΄ | v6.0 | v07 |
| Ε΄ | v6.0 (+ τετράδιο) | v08 |
| ΣΤ΄ | v8.0 | v8.02 |

Text extraction: `pdftotext -layout <book>.pdf out.txt`, then grep the lesson title.

## Lesson template (every lesson from now on)

1. **📖 Διαβάζω** — `info`, the 3 headline cards (definitions in the book's own words).
2. **📘 Θεωρία** — `theory`, right after the headline cards *when the lesson brings more
   than the headlines can hold* (material merged from the other edition, an extension we
   add, a concept that needs a worked example). 2–4 sections, each: a short explanation +
   1–3 worked examples. Must fit the 1600×900 stage without scrolling; split into two
   theory pages if it does not.
3. Activities from **both** editions, merged: the older edition's exercises first, then the
   newer edition's ones that add something (avoid two copies of the same exercise). Each
   carries `ref: 'έκδ. X σελ. Y · έκδ. Z σελ. W'`.
4. **💪 Εξάσκηση** — `practice: [...]` on the lesson: 2–4 extra exercises *not* in the books,
   aimed at remembering (definitions, vocabulary → `match`, `mcq`) and understanding
   (new examples → `sort`, `order`, `trace`, «what happens if…» `mcq` with `explain`).
   The engine appends them after the lesson's activities, labelled «💪 Εξάσκηση».

No textbook images (licences) — emoji, SVG and simulations only.

## Status

Done = in the book with activities. Lesson numbers = older edition.

### Α΄ — Κεφ. 1 done (lessons 1–9 + Επανάληψη)
- Κεφ. 2 (10–14 · v09 2.1.1–2.2.1): ο υπολογιστής, συσκευές, άνοιγμα/κλείσιμο, δίκτυα,
  δίκτυα στη ζωή μας → reuse `sort`/`match`, the `desktop` simulator (power on/off).
- Κεφ. 3 (15–18 · v09 3.1.1–3.1.2): αρχεία & φάκελοι, μορφές αρχείων, εννοιολογικός χάρτης
  → new `conceptmap` activity (drag words onto nodes).
- Κεφ. 4 (19–30 · v09 4.1.1–4.2.2): ποντίκι (κλικ, διπλό, δεξί, σύρε, ροδέλα), πληκτρολόγιο
  (κεφαλαία, αριθμοί, λέξεις), ιστοσελίδες, ζωγραφική → new `mouse` and `keys` mini-games.

### Β΄ — Κεφ. 1 & 2 done
- Κεφ. 3 (15–18 · v08 3.1.1–3.2.2): αποθήκευση/άνοιγμα αρχείων, φάκελοι, εννοιολογικοί
  χάρτες → `desktop` save dialog task + `conceptmap`.
- Κεφ. 4 (19–29 · v08 4.1.1–4.2.2): φυλλομετρητής, πόροι ιστοσελίδας, χαρακτήρες
  πληκτρολογίου, επεξεργασία με ποντίκι, ζωγραφική, e-me, email → `keys`, mock browser.
- Κεφ. 5 (30): ψηφιακή πολιτειότητα → `sort` (safe / unsafe).

### Γ΄ — lesson 1 done (with v09 «λογικές εκφράσεις»)
- Κεφ. 1 next: 2 Αλήθεια ή ψέματα; · 3 Οι υπολογιστές παίρνουν αποφάσεις ·
  4–6 Scratch & εντολή επιλογής · 7–8 ρομπότ εδάφους (v09 1.2–1.3).
- Κεφ. 2 (9–13): ψηφιακή εικόνα (pixel grid — reuse `pixelart.html` idea), εξαρτήματα,
  εφαρμογές, δικτύωση, κακόβουλο λογισμικό.
- Κεφ. 3 (14–16), Κεφ. 4 (17–28), Κεφ. 5 (29–30).

### Δ΄ — lesson 1 done
- Κεφ. 1 next: 2 Νέα εντολή επιλογής (Αν… αλλιώς) & επανάληψης (Επανάλαβε ώσπου) ·
  3 Ξανά και ξανά · 4 Αριθμητικές πράξεις · 5 Επανάλαβε ώσπου · 6–7 Scratch ·
  8–10 ρομπότ (πίστα, μαύρες γραμμές, λαβύρινθος → grid robot with sensor).
- Κεφ. 2 (11–15 · v07 2.1.1–2.2.2), Κεφ. 3 (16–19 · v07 3.1.1–3.2.1), Κεφ. 4–5 (20–30).

### Ε΄ — lessons 1–2 done (Καίσαρας, merged as one lesson)
- Κεφ. 1 next: 3 Σύνθετες λογικές εκφράσεις (v08 1.1.2, 1.2.3 — reuse `logic`) ·
  4–7 παιχνίδι στο Scratch, μεταβλητές, συνθήκη τέλους · 8 υποπρογράμματα ·
  9 παράλληλες ακολουθίες · 10 μηνύματα · 11 γενέθλια.
- Κεφ. 2 (12–15): ψηφιοποίηση κειμένου (ASCII/binary — reuse `bits`), υλικό, δίκτυα.
- Κεφ. 3 (16–20): υπολογιστικό φύλλο (mini spreadsheet activity), ΤΝ & μηχανική μάθηση.
- Κεφ. 4–5 (21–30).

### ΣΤ΄ — lessons 1–2 done
- Κεφ. 1 next: 3 Είσοδος/έξοδος · 4–5 υποπρογράμματα με παραμέτρους (reuse `stepper`) ·
  6–7 Μάντεψε τον αριθμό στο Scratch, επίπεδα δυσκολίας · 8–11 αισθητήρες (micro:bit).
- Κεφ. 2 (12–15 · 8.02 2.1.1–2.2.2), Κεφ. 3 (16–20 · 8.02 3.1.1–3.2.3: φόρμες, φίλτρα),
  Κεφ. 4–5 (21–30).

## Order of work

- **Phase 0** — engine: `theory` page type + per-lesson `practice`. Retrofit all existing
  lessons: practice set for every lesson, theory page where the lesson has extra info.
- **Phase 1** — finish Κεφ. 1 (algorithms) for Γ΄, Δ΄, Ε΄, ΣΤ΄ in that order: these reuse the
  existing engine (grid, logic, stepper, sort, mcq) so they are cheap.
- **Phase 2** — Κεφ. 2 for all grades (computers, binary, networks, safety).
- **Phase 3** — Κεφ. 3 (files, concept maps, spreadsheets) — needs `conceptmap` + mini sheet.
- **Phase 4** — Κεφ. 4 digital literacy — `mouse`/`keys` games; platform-specific lessons
  (e-me, Φωτόδεντρο, email) become info + quiz.
- **Phase 5** — Κεφ. 5 society & safety for all grades.

- **Later (not on GitHub Pages)** — an emoji self-assessment rubric at the end of every
  lesson (😀 🙂 😐 per learning goal), on a proper page backed by Firebase so the teacher
  gets a dashboard with analytics per class / lesson. Needs hosting with a backend
  (Firebase Hosting + Firestore), so it is planned separately from this static book.

Lessons that need physical hardware (Έντισον, Bee-Bot, micro:bit sensors) get a simulator
when one is cheap (grid robot), otherwise info + «Στην τάξη» card + quiz.

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

## Status (2026-10-12)

Chapter 1 (algorithms · programming · robotics) is **done for every grade**, both editions merged,
every lesson with practice; theory pages where the lesson brings extra material.

| Grade | Κεφ. 1 lessons in the book | Older-edition lessons covered | Newer-edition sections covered |
|---|---|---|---|
| Α΄ | 9 | 1–9 | 1.1.1–1.3.3 |
| Β΄ | 8 (+5 in Κεφ. 2) | 1–9 | 1.1–1.3 |
| Γ΄ | 8 | 1–8 | 1.1–1.3 (Blockly, Scratch quiz, Lightbot) |
| Δ΄ | 10 | 1–10 | 1.1–1.3 (pen shapes, data types, Blockly maze) |
| Ε΄ | 9 | 1–11 | 1.1.1–1.3 (sensors, automation) |
| ΣΤ΄ | 9 | 1–11 | 1.1.1–1.3.2 (computational thinking, debugging) |

Engine pieces added for chapter 1: theory pages, practice sets, «Βρες ποιος είναι» cards, a rules
mini-game, Έντισον obstacle robot, robot commands «💡 Άναψε φως» and «⏩ Προχώρα όσο υπάρχει άσπρο»,
a mini-Scratch stage (events, motion, looks, sound, pen, control, sensing, operators, variables with
sliders, messages, subprograms with parameters, ask/answer, draggable sprites) and micro:bit modes
(birthday melody, light / sound / temperature sensors, data logging).

Known source issue: the newer Ε΄ edition (v08, 1.1.2) prints «12 > 15 ΑΛΗΘΗΣ» — the book uses correct examples instead.

Chapter 2 (computers · devices · networks) is **done for every grade** (2026-10-12), both editions
merged, every lesson with practice, a chapter review per grade.

| Grade | Older-edition lessons | Newer-edition sections | Lessons in the book |
|---|---|---|---|
| Α΄ | 10–14 | 2.1.1–2.2.1 + review | 6 |
| Β΄ | 10–14 | 2.1.1–2.2.1 + review | 7 |
| Γ΄ | 9–13 | 2.1–2.2 + review | 6 |
| Δ΄ | 11–15 | 2.1.1–2.2.2 + review | 6 |
| Ε΄ | 12–15 | 2.1.1–2.2.2 + review | 6 |
| ΣΤ΄ | 12–15 | 2.1.1–2.2.2 + review | 6 |

Engine pieces added for chapter 2: `net` (connect devices with cables; `mode: 'path'` = packet routing
with shortest path and broken routers; `hideTasks` hides the answer list), `pixels` (decode/encode 1-, 2-, 3-bit
images with bit/Byte count; `rle: true` = run-length rows), `binword` (letters ↔ bits with the 5-bit Greek
table or ASCII), `password` (strength trainer, local only), desktop `boot` (power on/off) and the
`settings` tasks (wallpaper, brightness, resolution) with a ⚙️ Ρυθμίσεις app.

### Next: chapter 3 (data · files · concept maps · spreadsheets)
- Α΄ (15–18): αρχεία και φάκελοι, αποθήκευση, ο πρώτος εννοιολογικός χάρτης.
- Γ΄ (14–16): αρχεία και φάκελοι, είδη εννοιολογικών χαρτών, πρόβλημα με εννοιολογικό χάρτη.
- Δ΄ (16–19): ψηφιακό περιεχόμενο, μεγέθη αρχείων και κάδος ανακύκλωσης, επεξεργασία δεδομένων, χάρτης με εικόνες.
- Ε΄ (16–20): υπολογιστικό φύλλο (πίνακας, πράξεις, διαγράμματα), τεχνητή νοημοσύνη.
- ΣΤ΄ (16–20): φόρμες, υπολογιστικό φύλλο (ταξινόμηση, φίλτρα), ερωτήματα σε δεδομένα.
- Β΄: check the older edition's chapter-3 lessons against both editions.

Needs a `conceptmap` activity and a mini spreadsheet. Then chapters 4–5.

## Order of work

- **Phase 0** ✅ — engine: `theory` page type + per-lesson `practice`. Retrofit all existing
  lessons: practice set for every lesson, theory page where the lesson has extra info.
- **Phase 1** ✅ — Κεφ. 1 (algorithms) finished for Γ΄, Δ΄, Ε΄, ΣΤ΄.
- **Phase 2** ✅ — Κεφ. 2 for all grades (computers, binary, networks, safety).
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

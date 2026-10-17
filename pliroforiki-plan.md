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

## Status (2026-10-17)

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

Chapter 3 (data · files · concept maps · spreadsheets) is **done for every grade** (2026-10-12), both
editions merged, every lesson with practice, a chapter review per grade.

| Grade | Older-edition lessons | Newer-edition sections | Lessons in the book |
|---|---|---|---|
| Α΄ | 15–18 | 3.1.1–3.2 + review | 5 |
| Β΄ | 15–18 | 3.1.1–3.2.2 + review | 6 |
| Γ΄ | 14–16 | 3.1–3.2 + review | 4 |
| Δ΄ | 16–19 | 3.1.1–3.2.1 + review | 6 |
| Ε΄ | 16–20 | 3.1.1–3.2.4 + review | 6 |
| ΣΤ΄ | 16–20 | 3.1.1–3.2.3 + review | 6 |

Engine pieces added for chapter 3: `conceptmap` (fill concepts and link words from a card bank; sibling
slots accept answers in any order; `read: true` reads the map back as sentences; `arrows: true` for
organisational maps), `files` (file explorer: locations, folders, `app` with Αρχείο → Αποθήκευση ως / Άνοιγμα,
new folder/file, rename keeps the extension, copy/cut/paste, delete with `bin: true` recycle bin and restore,
list view with sizes, ℹ️ properties; task predicates get `ev.here`), `sheet` (mini spreadsheet: formula bar,
safe parser with + − * / and SUM AVERAGE MAX MIN COUNT COUNTIF, Greek-keyboard cell names, Σ, fill-down with
`$` locking, column and pie charts, `sortFilter: true` for ascending/descending sort and an autofilter),
`mltrain` (teach a classifier with labelled examples, then test it).

Note: the newer Β΄/Γ΄/Δ΄ editions point to CmapTools / Φωτόδεντρο tools; we keep those as «Στην τάξη» cards
next to the in-book concept-map games.

Chapters 4 (digital literacy) and 5 (society) are **done for every grade** (2026-10-17), both editions merged, every
lesson with practice, a review per chapter where the newer edition has one. Α΄ has no chapter 5 in either edition.

| Grade | Κεφ. 4 older / newer | Lessons | Κεφ. 5 older / newer | Lessons |
|---|---|---|---|---|
| Α΄ | 19–30 / 4.1.1–4.2.2 + review | 13 | — | — |
| Β΄ | 19–29 / 4.1.1–4.2.2 + review | 13 | 30 / 5.1–5.2 + review | 3 |
| Γ΄ | 17–28 / 4.1.1–4.2.3 + review | 13 | 29–30 / 5.1.1–5.2 + review | 4 |
| Δ΄ | 20–27 / 4.1–4.2 + review | 11 | 28–30 / 5.1–5.2 + review | 5 |
| Ε΄ | 21–27 / 4.1.1–4.2.2 + review | 9 | 28–30 / 5.1.1–5.2.3 + review | 8 |
| ΣΤ΄ | 21–27 / 4.1.1–4.2.2 + review | 10 | 28–30 / 5.1.1–5.2.1 + review | 6 |

Practice websites are invented (`X_` constants before each `BOOK_X`); government services use clearly fake practice
domains (`gov-exaskisi.gr` …) with a «Ψεύτικος ιστότοπος για εξάσκηση» banner. Things the engine cannot do (browser tabs,
tables and page layout in the word processor, Scratch Jr, real logins) became theory, quizzes or «Στην τάξη» cards.

Engine pieces added for chapter 4: `mouse` (parts, real buttons, hover, click, double, right-click menu, drag and drop,
emoji puzzle, scroll), `keys` (Greek on-screen keyboard that follows the real keyboard by key position: find letters,
key names, typing with Caps Lock, tonos, Backspace, arrows, Enter), `browser` (address bar, ⬅ ➡, links, ☆ bookmarks,
search engine results with `kw`/`ad`, posts with ❤️/comments, notice board, ▶ videos, `data-form` + `data-append`),
`paint`, `editor` (word processor), `slides` (presentations with transitions and slideshow), `mail` (login, inbox,
reply, forward, attachments, spam), `anim` (flipbook), a working calculator in `desktop`; inline task lists for `desktop`.

**🐧 Tux Paint** — a separate chapter (tab) in Α΄ and Β΄ at the teacher's request (the class paints in Tux Paint and has no
interactive whiteboard): `tux` simulator with the same tools/layout (Paint, Stamp, Lines, Shapes, Text, Label, Fill, Magic —
Grass, Rainbow, Googly Eyes, Bricks, Spray Paint, Foam, Squiggles —, Undo/Redo, Eraser, New, Open, Save…), the penguin's tip for
every tool, a tool tour, and «Το σπιτάκι μου» in three parts that keep the same drawing (`keep`).

### Next: Phase 6 (⌨️ Συντομεύσεις) — see Order of work.

## Order of work

- **Phase 0** ✅ — engine: `theory` page type + per-lesson `practice`. Retrofit all existing
  lessons: practice set for every lesson, theory page where the lesson has extra info.
- **Phase 1** ✅ — Κεφ. 1 (algorithms) finished for Γ΄, Δ΄, Ε΄, ΣΤ΄.
- **Phase 2** ✅ — Κεφ. 2 for all grades (computers, binary, networks, safety).
- **Phase 3** ✅ — Κεφ. 3 (files, concept maps, spreadsheets) — `conceptmap`, `files`, `sheet`, `mltrain`.
- **Phase 4** ✅ — Κεφ. 4 digital literacy — `mouse`/`keys` games; platform-specific lessons
  (e-me, Φωτόδεντρο, email) become info + quiz.
- **Phase 5** ✅ — Κεφ. 5 society & safety for all grades.
- **🐧 Tux Paint** ✅ — extra chapter for Α΄/Β΄ (teacher's request).
- **Phase 6** — ⌨️ Συντομεύσεις extra chapter (Β΄–ΣΤ΄): `keys` trainer + on-screen keyboard (built with
  Phase 4's keyboard games), shortcut layer in `desktop` / `files` / `sheet` / `editor` (the editor exists since Phase 4); then «⌨️ Συντόμευση»
  cards in the regular lessons.

- **Later (not on GitHub Pages)** — an emoji self-assessment rubric at the end of every
  lesson (😀 🙂 😐 per learning goal), on a proper page backed by Firebase so the teacher
  gets a dashboard with analytics per class / lesson. Needs hosting with a backend
  (Firebase Hosting + Firestore), so it is planned separately from this static book.

Lessons that need physical hardware (Έντισον, Bee-Bot, micro:bit sensors) get a simulator
when one is cheap (grid robot), otherwise info + «Στην τάξη» card + quiz.

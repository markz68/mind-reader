# Mind Reader

An Akinator-style, local-first guessing game built as a progressive web app.

## Current status: v0.2.2 prototype

The first playable prototype has been committed to the `main` branch. It is **not yet v1.0**.

### Implemented
- Quick Play and five Category Play options
- Small starter knowledge set (46 entries) and 35 attribute questions
- Probability-weighted candidate scoring, category contradiction handling, and information-aware question selection\n- Unknown attributes distinguished from explicit negative facts\n- Expandable question history during gameplay\n- Regression tests: run `npm test` with Node.js 20+
- Yes, No, Probably, Probably Not, Don't Know
- Early guesses, three incorrect guesses maximum, up to 30 questions
- Undo, restart, local statistics, statistics JSON export/import
- Installable PWA manifest and offline asset caching

### Not yet implemented
- Curated 100-entry validation dataset, eventual 1,000-entry target
- Further calibration and accuracy benchmarking on a larger verified dataset
- Guided learning and IndexedDB personal knowledge
- Adaptive difficulty based on historical performance
- Full game history and appearance settings
- Automated accuracy tests and multi-device acceptance tests
- Optional AI backend

### Running
Open `index.html` through an HTTP server, or enable GitHub Pages for the repository's `main` branch at the root. Installability and offline caching require HTTPS or localhost. After first online load, the app shell is cached for offline use.

### Notes
This prototype uses a small hand-authored dataset and probability-weighted scoring. It is intended for testing the basic gameplay, not yet for reliable general-purpose guessing. Data currently saved locally is statistics only; there is no knowledge training yet. Export/import covers statistics only.

### Planned release
Version 1.0.0 after learning, persistence, accuracy benchmarks, accessibility review, and offline/update tests are complete.

## v0.2.2 place-logic fix
- Explicit country and place-type exclusions prevent incompatible follow-up questions.
- London and Paris can now be distinguished by United Kingdom and France questions.
- Regression coverage for a European-city answer path.
- The knowledge set is still small; the engine may not recognize places outside it.

# Mind Reader

An Akinator-style, local-first guessing game built as a progressive web app.

## Current status: v0.5.2 prototype

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

## v0.5.2 place-logic fix
- Explicit country and place-type exclusions prevent incompatible follow-up questions.
- London and Paris can now be distinguished by United Kingdom and France questions.
- Regression coverage for a European-city answer path.
- The knowledge set is still small; the engine may not recognize places outside it.

## v0.5.2 category-play correction
- Fixes immediate name guessing in fictional characters by making category-specific trait negatives explicit for the curated starter data.
- Adds tests for first-question behavior across all five categories and three unanswered fictional-character questions.

## v0.5.2 asset refresh fix
- Versioned module imports for app, engine and data to avoid loading old engine code with a newer HTML title.
- Network-first asset fetching with offline cache fallback, preserving local statistics.

## v0.5.2 guided learning
- Confirmation-required teaching with Yes, No and Unknown traits
- Local IndexedDB learned answers, editable and removable in Settings
- JSON schema 2 backup includes statistics and learned answers; legacy statistics backup import supported
- Database count and cautious guessing when evidence is weak
- The curated built-in dataset remains 46 entries; expansion toward 1,000 is a separate validation task

## v0.5.2
- When questions run out, make candidate guesses rather than immediately ending the game due to low confidence.
- Regression test for a learned Bruce Springsteen answer.

## v0.5.2
- 124 built-in answers across five categories, up from 46.
- New questions distinguish music genres, performers, animals, instruments and other common subjects.
- Existing locally learned answers remain in IndexedDB. Matching built-in facts enrich existing learned answers without duplicate candidates.
- Missing traits in learned entries remain unknown rather than automatically becoming No.
- This is a curated starter expansion, not the eventual 1,000-answer goal. Accuracy still requires field testing.

## v0.5.2
- More diagnostic big-cat questions (fastest land animal, spotted coat, stripes, mane).
- Cheetah, lion, leopard and tiger traits refined.
- Delay high-confidence guesses while useful questions remain.

## v0.5.2
- Question selection now considers candidates with unknown facts instead of stopping when both explicit Yes and No are absent.
- More conservative early-guess thresholds while useful questions remain.
- Regression scenarios for Cheetah vs Horse after speed and stripes answers.

## v0.5.2
- Require at least six answered questions before guessing if no useful questions remain.
- Candidate-aware fallback question selection when the usual information-gain calculation finds no question.
- Added tests for speed/stripes premature guessing and lion speed classification.

## v0.5.2
- Candidate scoring no longer restores definitively excluded answers when compatible candidates run out.
- Regression for fast, non-striped, spotted African cheetah versus elephant, giraffe and lion.

## v0.5.2
- Show complete question history and incorrect guesses on both result screens.
- Continue asking questions when candidates are exhausted instead of prematurely ending after five questions.
- Allow a supported guess after three or more answers if no useful questions remain.

## v0.5.2
- Animal Category Play begins with mammal classification.
- High-confidence leaders enter a one-to-two-question confirmation phase before a guess, with candidate-specific distinguishing traits.
- No premature defeat while a follow-up question is available, even if no current candidate matches.
- Regression coverage for the Cheetah confirmation sequence.

## v0.5.2
- Reviewed animal traits, including Elephant and Giraffe, and added explicit negative facts for well-known distinguishing traits.
- Missing animal traits are unknown rather than automatically No; core category traits retain curated classifications.
- Question selection continues with remaining useful questions, and the game attempts a guess when questions are exhausted.
- Added Elephant six-answer and missing-fact regression tests.

## v0.5.2: first major animal knowledge expansion
- Added 135 curated animal entries, including Cow, Sheep, Goat, Pig, farm birds, fish, amphibians, insects, and more. The existing five categories remain available.
- Added 16 animal questions for farm/domesticated, diet, hooves, horns, wool, antlers, eggs, taxonomy and habitat.
- Expanded animal taxonomy and explicit distinguishing traits while retaining unknown values for unrecorded facts.
- Added 16px spacing between Question History and the following buttons on both play and results screens.
- Added Cow and regression tests. Local learned answers and statistics are not migrated or reset.

## v0.5.2
- Suppress fastest-land-animal question after a definite No to speed, and generic speed after Yes to fastest-land-animal.
- Prefer questions that split plausible remaining candidates; confirmation questions must offer meaningful separation.
- Permit a supported early guess when a distinctive positive fact identifies the leading candidate.
- Remove duplicated numeric prefixes in active Question History.
- Add elephant and speed-dependency regression tests. Existing learned answers and statistics are unchanged.

## v0.5.2
- Prefer familiar generic animal names over sex-specific alternatives unless answers support the distinction.
- Added an adult-male confirmation question for Cow/Bull and Chicken/Rooster when both remain plausible.
- Horns do not determine cattle sex; Cow remains possible with a Yes to horns.
- Added regression tests for horned cows and explicit male bulls. Existing local data is preserved.

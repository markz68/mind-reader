# Mind Reader

An Akinator-style guessing game and installable progressive web app.

## Current version: 0.7.0 prototype

Think of a real person, fictional character, animal, place, or object. Choose Quick Play or a category, then answer Yes, No, Probably, Probably not, or Don't know. The game aims for 20 questions and allows up to 30, with a maximum of three incorrect guesses.

The curated database is still limited. It cannot recognize everything, and confidence represents the remaining recorded candidates rather than certainty about every possible answer.

## v0.6.1 telephone correction

- Added Telephone (landline/home/desk phone aliases), plus phone-call, mobile-phone, and touchscreen distinctions.
- Fixed missing power facts that previously excluded Smartphone when answering Yes to needing a power source.
- Unrecorded object power requirements stay unknown. Known electrical and engine-driven objects have explicit power facts.
- Communication and other purpose questions precede device guesses when they can separate candidates.
- A Yes to electricity suppresses the redundant power-source question.
- Added regression coverage for the reported 12-answer telephone history, full phone games, power facts, dependencies, undo, and learned overrides. The sleigh/carriage regression remains in the suite.

## v0.7.0 branching progression

- Replaces the fixed handheld/indoors/transport checklist with context-sensitive object branches.
- Handheld indoor objects move toward electricity and purpose. Outdoor objects that cannot be held in one hand move toward transportation.
- Positive purpose answers keep later questions within that branch: communication to phone calls to mobile/cellular phone; instruments to strings/material; transportation to travel mechanics.
- Context guides question order without silently converting assumptions into candidate facts. An indoor object can still be transportation.
- Electronics can be distinguished by communication, photography, and lighting purposes. Camera and Flashlight now have explicit distinguishing facts.
- Phone games avoid unrelated transportation, kitchen, sports, size, flight, and material questions. Yes to electricity still suppresses the redundant power question.
- Expected information gain and fallback selection avoid universal-answer filler.
- Regression tests check question continuity, uncertain context, undo, indoor transportation, device purpose, and the existing sleigh path.

## Question logic

- Broad object questions establish whether it is handheld and typically indoors, then follow a supported purpose branch before asking specific details.
- Transport questions distinguish land travel, rails, engines, animal pulling, passengers, wheels, and runners.
- A sleigh and horse-drawn carriage remain plausible until a distinguishing answer separates them.
- Narrow follow-ups require an established broader trait. No to wheels suppresses the two-wheel question; music genres wait for music; mammal anatomy waits for mammal classification.
- These eligibility rules apply during ordinary selection, confirmation, and fallback selection.
- Definite contradictions exclude candidates. Missing learned facts remain unknown; Probably and Don't know do not establish prerequisites as certain.
- Animal category starts with mammal classification. Cow/Bull and Chicken/Rooster use an explicit adult-male question when both terms are plausible.
- Strong candidates can enter a short confirmation phase before a guess. Useful distinguishing questions are preferred over filler.

## Features and data

- Five categories, an expanded animal database, and common objects, people, characters, and places.
- Undo, restart, question history during play and on both result screens, and local statistics.
- Guided teaching after a missed answer, with review and confirmation before saving.
- Learned answers are stored in this browser's IndexedDB; statistics are stored in localStorage.
- Settings provides learned-answer editing/removal and JSON export/import. Schema 2 backups include statistics and learned answers; legacy statistics backups are accepted.
- Existing data and storage keys are preserved in v0.7.0. Data stays on this device/browser unless exported. There is no cloud synchronization or AI backend.

## Running and installing

Serve the repository root over HTTP for development. GitHub Pages can serve the root of the main branch over HTTPS. No build step is needed.

On Android or desktop, open the site in a compatible browser and use Install app or Add to Home screen when offered. On iPad, open it in Safari and use Share > Add to Home Screen.

After the first successful online load, the service worker caches the app for offline use. Reopen online to receive updates. v0.7.0 refreshes versioned module URLs and the app cache without clearing saved statistics or learned answers. Browser installation, offline behavior, and device layout still require device acceptance testing.

## Validation

Run `npm test` with Node.js 20 or later. GitHub Actions runs the same command for main-branch pushes and pull requests.

Tests cover candidate exclusions, unknown facts, early guessing, confirmation, animal classification, Cow/Bull, question dependencies, undo, and the sleigh-versus-carriage path.

## Remaining work

Expand and verify the knowledge base, benchmark accuracy on a broader set of answers, and complete accessibility and multi-device acceptance testing before v1.0.

# EY Gogo Japan

Offline-first PWA that shows a 9-day Japan Trip (Day 0–8, 24/11–2/12/2026) from a Trello board. Vue 3 + TypeScript + Vite + Tailwind v4.

## Read before working

- **Domain terms**: `CONTEXT.md` is the glossary. Use its terms (Trip, Day, Destination, Plan Card, Published Card, Snapshot, Translation, Sensitive Detail) in code, commits and UI copy.
- **Building the app**: `docs/PLAN.md` holds the ordered tasks. Work one task at a time and finish on its **Done when** check before you start the next.
- **Any visual or UI work**: follow `docs/DESIGN.md` exactly (palette, type, layout, the bar).
- **Why it is shaped this way**: `docs/adr/`. Read it before you change how data gets from Trello into the app.

## Rules the code cannot show

- **The Snapshot (`src/data/snapshot.json`) is input data, owned by Claude Code.** Claude Code writes it from Trello. The coding agent reads it and imports it, and keeps its shape as given. If the app needs a different shape, ask for a new Snapshot rather than editing the file.
- **`src/data/translations.en.json` is owned by Claude Code too.** It holds English versions of Published Cards. Each entry carries the FNV-1a fingerprint of the Thai markdown it was translated from, and the app falls back to Thai once a card changes (`src/content.ts`).
- **`src/data/covers.json` and `src/assets/covers/` are owned by Claude Code too.** They hold cover photos and their licence credits. Keep the credits shown in the app.
- **The app has no Trello code or credentials.** `npm run build` (also run by Cloudflare Pages) only bundles the committed Snapshot.
- **Only Published Cards reach the app.** These are cards with the `Gogo` label, matched case-insensitively.
- **The app works with zero network after first load.** Bundle every runtime asset and precache it. Self-host fonts and photos through the bundle so they precache; the app makes no request to a CDN at runtime.
- **The Packing List content (`src/packing.ts`) is owned by Claude Code too.** It is long-form copy in both languages, kept out of `i18n.ts`; its Decathlon prices carry the date they were read (`KIT_PRICES_CHECKED`). Link to products; never bundle shop photos.
- **UI copy lives in `src/i18n.ts` in both Thai and English.** Every visible string goes through `t()`. The `Day N` label stays the same in both languages ("วันที่ 4" would read as a calendar date). Card text comes from `cardContent()`, never straight from the Snapshot.

# Build plan

Work the tasks in order. Each task ends on a **Done when** check. Run it, see it pass, and tick the box before you move on. Tasks marked 👤 are for the human. If one blocks you, stop and say which task it is.

Terms come from `CONTEXT.md`. The trip data is already in `src/data/snapshot.json`. Treat it as read-only input (see `AGENTS.md`).

---

## Task 1: Scaffold

- [x] `git init` if the repo is not a git repo yet.
- [x] Scaffold Vite's `vue-ts` template into the repo root. Keep the existing `AGENTS.md`, `CLAUDE.md` (symlink), `CONTEXT.md`, `docs/` and `src/data/snapshot.json`. If `create-vite` refuses a non-empty directory, scaffold into a temp dir and copy the files over.
- [x] Remove the template's demo component and assets. `App.vue` renders only a placeholder heading.
- [x] `.gitignore` covers `node_modules`, `dist`, `dev-dist`, `.env`.
- [x] Set `"engines": { "node": ">=22" }` in `package.json`.

**Done when:** `npm run build` exits 0, `git status` does not show `node_modules`, and `src/data/snapshot.json` is unchanged.

---

## Task 2: Tailwind v4

- [x] Install `tailwindcss`, `@tailwindcss/vite` and `@tailwindcss/typography`, and register the Vite plugin.
- [x] `src/style.css`: `@import "tailwindcss"; @plugin "@tailwindcss/typography";`
- [x] Use the system font stack only (no web fonts). Dark mode follows `prefers-color-scheme`, which is Tailwind's default `dark:` variant.

**Done when:** a `dark:` class on the placeholder heading visibly switches when the OS theme changes in `npm run dev`, and `npm run build` exits 0.

---

## Task 3: Snapshot type and markdown rendering

The Snapshot's shape is fixed. Declare it in `src/snapshot.ts`:

```ts
export interface Snapshot {
  generatedAt: string;        // ISO 8601 UTC
  days: Day[];                // Day 0..8, already in order
}
export interface Day {
  index: number;              // 0-based
  date: string;               // "2026-11-24"
  destination: string | null;
  cards: PublishedCard[];     // already in Trello order
}
export interface PublishedCard {
  id: string;
  title: string;
  markdown: string;           // Trello card description, as written
}
```

- [x] Import `snapshot.json` statically and type it as `Snapshot`, so it is bundled and needs no fetch.
- [x] Add `marked` and a `renderCard(markdown): string` helper that uses GFM with `breaks: true`. Bare URLs become links, and every `<a>` gets `target="_blank" rel="noopener"`.

**Done when:** a Vitest test feeds `renderCard` the Day 4 card's markdown and checks three things: the output contains `<a href="https://maps.app.goo.gl/KJumsxANsbUqFmQg7" target="_blank" rel="noopener"`, it contains `<strong>Lunch</strong>`, and single newlines become `<br>`. `npm test` passes and `npm run build` exits 0.

---

## Task 4: Trip page

Build it to `docs/DESIGN.md`, including the palette tokens, the timeline cards and the sticky Day strip.

- [x] A header shows the Trip title (`🇯🇵 EY Japan · 24 Nov – 2 Dec 2026`) and `ข้อมูล ณ <generatedAt>`, formatted in Asia/Bangkok time as `2026-10-04 14:50 (GMT+7)`.
- [x] One section per Day with the heading `Day 1 · Wed 25 Nov 2026 · <destination>`. Omit the destination part when it is null.
- [x] Each Published Card is a card block with its title, and `renderCard(markdown)` inside a `prose dark:prose-invert` container via `v-html`.
- [x] A Day with no Published Cards shows `ยังไม่มีแผน`.
- [x] Layout is mobile-first: single column, readable at 360px width, no horizontal scroll. Long URLs wrap (`break-words`).

**Done when:** `npm run dev` at 360px width shows all 9 Days in order. The 3 current cards (Day 0, 4, 5) render with working links, the other Days show the placeholder, and nothing scrolls horizontally.

---

## Task 5: Jump to today

- [x] On mount, compute today's date in `Asia/Tokyo` (`Intl.DateTimeFormat` with `timeZone`).
- [x] If it matches a Day's `date`, scroll that Day into view and highlight it (ring or accent border plus a `Today` badge). Otherwise start at the top (Day 0).
- [x] Keep the "today" logic in a small pure function (`(snapshot, now: Date) => dayIndex | null`).

**Done when:** a Vitest test covers three cases: a time inside the Trip returns the right index, a date before the Trip returns `null`, and 2026-11-24 23:30 JST returns 0 while 2026-11-25 00:30 JST returns 1. `npm test` passes.

---

## Task 6: PWA and offline

- [x] Add `vite-plugin-pwa` with `registerType: 'autoUpdate'` and Workbox `globPatterns` covering `**/*.{html,js,css,json,svg,png,ico,webmanifest}`.
- [x] Manifest: name `EY Gogo Japan`, short_name `Gogo JP`, `display: standalone`, theme and background colours matching the page, and `lang: th`.
- [x] Icons: create `public/icon.svg` (a simple 🗻 or torii mark), then generate 192/512/maskable PNGs with `@vite-pwa/assets-generator`.

**Done when:** after `npm run build && npm run preview`, the page loads once online. The browser then goes offline (DevTools → Network → Offline, or a Playwright `context.setOffline(true)`), and a hard reload still renders all 9 Days. Lighthouse reports the app as installable.

---

## Task 6b: UI v2

Build the **(v2)** sections of `docs/DESIGN.md`: Reading aids, Itinerary overview and Day strip.

- [x] `renderCard` collapses map and bare URLs and wraps line-start times in `<time class="slot">`, as specified. Keep `target="_blank" rel="noopener"` on every link.
- [x] Card rhythm, compact empty-Day rows and the `DAY` eyebrow.
- [x] `Itinerary` overview section with 9 tappable rows.
- [x] Day strip shows each Day's date under its numeral.

**Done when:**
- New Vitest cases pass, and `npm test` is green:
  - `https://maps.app.goo.gl/KJumsxANsbUqFmQg7` renders as a link with text `แผนที่ ↗` and that href.
  - `10:30  ไป Gotokuji` renders `<time class="slot">10:30</time>`.
  - `Open 17.30-21.00` renders with no `<time>`.
  - A markdown link with custom text keeps that text.
- `npm run build` exits 0.
- Playwright at 390×844 (light and dark) shows no visible raw `https://` text anywhere on the page, no horizontal scroll, and all 9 overview rows. Save `docs/screenshots/v2-top-light.png`, `v2-top-dark.png` and `v2-day4-light.png` (scrolled to Day 4).
- The offline reload check from Task 6 still passes.

---

## Task 6c: UI v3 (photo travel app)

Rebuild the UI to `docs/DESIGN.md` v3, which supersedes v1/v2 visuals. Reuse the existing pure logic: `renderCard`, `findTodayIndex` and the snapshot import. The sticky Day strip and the washi timeline go away.

- [x] Tokens, Poppins + Prompt via `@fontsource` (latin + thai subsets, 400/500/600), radii and the single shadow.
- [x] Hash views `#/` and `#/day/:index` via a small composable, with tests for parsing (`#/day/4` → 4; an unknown or out-of-range hash → home).
- [x] Home: top bar, hero collage, `Plan by Day` carousel (Today first), `Itinerary` list (all 9 Days), footer with the `ข้อมูล ณ` line and `Photo credits` from `covers.json`.
- [x] Day view: hero, floating title panel, card bodies, sticky prev/next pills that skip empty Days.
- [x] Reading aids restyled per v3 (time pills, `primary` map links). Update the existing tests where the markup changed; keep their intent.
- [x] Workbox `globPatterns` include `webp` and `woff2`.

**Done when:**
- `npm test` is green and `npm run build` exits 0.
- Playwright at 390×844, after an offline reload of `npm run preview`, shows the fonts loaded (`document.fonts.check('16px Poppins')` is true), the Home carousel photos rendered (`naturalWidth > 0`), and `#/day/5` showing the Kamakura hero. There is no horizontal page scroll (the carousel scrolls inside its own row).
- Screenshots saved: `docs/screenshots/v3-home-light.png`, `v3-home-dark.png`, `v3-day4-light.png` and `v3-itinerary-light.png` (scrolled to the Itinerary).

---

## Task 6d: Desktop and polish (done by Claude Code)

- [x] Responsive layout per DESIGN.md v4 (tablet 3-column cards, desktop split Home and two-column Day).
- [x] Keyboard shortcuts on a Day (← → Esc) and `:focus-visible` rings.
- [x] Tidy-ups: `<title>`, `lang="th"`, theme-color and icons in `index.html`; Trello titles tidied for display (`Kamakura , Enoshima` → `Kamakura, Enoshima`); link attributes escaped; the Trello `smartCard-inline` title dropped; the trip range is derived from the Snapshot; Prompt is loaded for Thai only; markdown tests merged into one file; photo credits read `"Title" by Artist, Licence`.

**Verified:** `npm test` 26/26, `npm run build`, no horizontal scroll at 390/768/1024/1440, an offline reload with fonts and 9/9 images, `#/day/5`, and `→` from Day 4 opening Day 5. Screenshots: `docs/screenshots/v4-*.png`.

---

## Task 6e: Language toggle (done by Claude Code)

- [x] `ไทย | EN` toggle in the Home navbar and on the Day hero. It is remembered per device (`localStorage`, guarded), the first visit follows the browser language, and `<html lang>` follows it.
- [x] UI strings in `src/i18n.ts`. Thai dates use the Gregorian year (`th-TH-u-ca-gregory`), so they read `อ. 24 พ.ย. 2026`.
- [x] Card content in English from `src/data/translations.en.json`, guarded by fingerprint (`src/content.ts`). Collapsed map links read `Map ↗` in English.

**Verified:** `npm test` 32/32 (including fallback to Thai when a card changes and the cross-language fingerprint), `npm run build`, and, offline after a reload, the chosen language persists with no Thai left in English card bodies at 390 and 1440px.

---

## Task 7 👤: Deploy

- [ ] Mirror the GitLab repo to a **private** GitHub repo.
- [ ] Cloudflare Pages → connect the GitHub repo. Build command `npm run build`, output `dist`, env `NODE_VERSION=22`. Choose a project name that is hard to guess, e.g. `ey-gogo-7k3q`.
- [ ] On both Android phones, open the URL **while online**, then use **Add to Home screen**. Turn on airplane mode, open the app, and confirm it renders.

**Done when:** both phones open the installed app in airplane mode, and the header shows the latest `ข้อมูล ณ` date.

---

## Updating the Trip later

1. Edit in Trello. Add the `Gogo` label to anything that should appear, and keep Sensitive Details on unlabelled cards.
2. Ask Claude Code to refresh the Snapshot. It rewrites `src/data/snapshot.json`.
3. Commit, push and let Cloudflare deploy. Open the app on each phone while online and check the `ข้อมูล ณ` date.

# Design brief (v3: photo travel app)

The app looks like a polished consumer travel app: bright white surfaces, big rounded photo cards, a single friendly blue, soft depth and generous whitespace. It must still read well in a station on a phone, sometimes in the dark, with no network.

Reference: a 3-screen travel concept (welcome with pill-shaped photo collage → explore list with horizontal photo cards → detail with full-bleed hero and a floating title card). This file supersedes v1/v2 (washi paper, unboxed timeline, sticky Day strip). The **reading aids** below carry over.

## Tokens

Define as Tailwind v4 `@theme` colours, with dark overrides under `prefers-color-scheme: dark`.

| Token | Light | Dark | Use |
|---|---|---|---|
| `bg` | `#FFFFFF` | `#0E1116` | page |
| `surface` | `#F4F6F9` | `#181C23` | search-style fields, empty thumbs, chips |
| `ink` | `#1E2330` | `#F1F3F7` | headings, body |
| `muted` | `#8A909C` | `#98A0AD` | meta, dates, captions |
| `line` | `#E9ECF1` | `#262B34` | hairlines |
| `primary` | `#4A8FE7` | `#6AA6F2` | accent words, buttons, active states, links |
| `primary-soft` | `#E7F0FC` | `#1B2A40` | chip/pill backgrounds |

- Radius: photo cards `rounded-[28px]`, floating panels `rounded-[20px]`, list thumbnails `rounded-2xl`, buttons and chips `rounded-full`.
- Depth: one soft shadow, used only on floating panels and the primary button: `0 10px 30px -12px rgb(16 24 40 / .18)`. Photo cards get no shadow. In dark mode, swap the shadow for a 1px `line` border.

## Type

- **Poppins** (Latin) + **Prompt** (Thai; it is designed to pair with Poppins), weights 400/500/600, self-hosted via `@fontsource/poppins` and `@fontsource/prompt` so they precache for offline. Stack: `"Poppins", "Prompt", system-ui, sans-serif`. Load the `latin` and `thai` subsets only; Japanese falls back to the system font.
- Screen title: `text-[28px] font-semibold leading-tight`, with one key word in `primary` (e.g. "Japan **Trip**").
- Card title: `text-[17px] font-semibold`. Meta: `text-[13px] muted`. Body: `text-[15px] leading-[1.7]`.

## Screens

Hash-based views (`#/` and `#/day/:index`) driven by a tiny composable on top of `hashchange`. No router library. Reload and the browser back button work offline. Keep the scroll position of Home when coming back.

### Home (`#/`)

1. **Top bar**: on the left, a 2-line title `Japan` / `Trip 2026` with `Trip` in `primary`, and under it `24 Nov – 2 Dec · 9 days` in `muted`. On the right, a 44px circular avatar-like badge showing the Japan flag emoji on `surface`.
2. **Hero collage** (the reference's welcome screen, condensed): the hero photo in a tall pill (`rounded-full` ends) beside two smaller rounded photos (Day cover images), height ~180px. Purely decorative: `aria-hidden`, no text on it.
3. **Section "Plan by Day"**: a section title (`text-[17px] font-semibold`) with a `primary` text button `See all` on the right that scrolls to the Itinerary.
4. **Day carousel**: horizontal scroll-snap row of photo cards (~78% of the viewport width, aspect ~4:5), one per Day that has Published Cards. The photo fills the card. At the bottom, inset 12px, sits a frosted info panel (`bg-white/85 dark:bg-[#181C23]/85 backdrop-blur-md rounded-[20px] p-4`) with the first card title (one line, ellipsis) and a meta row `Day 4 · Sat 28 Nov`. If the Trip is on, Today's card comes first and carries a `primary` pill `Today`. Tapping a card goes to `#/day/:index`.
5. **Section "Itinerary"**: a list of all 9 Days (the immigration-officer view). Each row has a 56px rounded thumbnail (the cover, or for an empty Day a `surface` square with the Day numeral), then the Day title (Published Card titles joined with ` · `, or `ยังไม่มีแผน` in `muted`) and a meta line `Day 1 · Wed 25 Nov`. Rows are ≥ 64px tall, separated by `line` hairlines. Rows of Days with cards link to the Day; empty rows are not links.
6. **Footer**: `ข้อมูล ณ 2026-10-04 14:50 (GMT+7)` and a `Photo credits` disclosure (`<details>`) listing each photo's title, artist and licence, with a link to its source.

### Day (`#/day/:index`)

1. **Hero**: the Day's cover photo full-bleed, ~44vh, with a 44px round translucent back button (`←`) top-left that goes to `#/`.
2. **Floating title panel**: overlaps the hero bottom by ~40px, inset 16px, `bg` colour, shadow, `rounded-[20px] p-5`. It holds the Day's first card title (wrapping allowed), a meta row `Day 4 · Sat 28 Nov 2026`, and, right-aligned, a `primary` pill with the Destination when present.
3. **Body**: each Published Card of the Day in order, with its title as a `text-[17px] font-semibold` subheading when the Day has more than one card, then the rendered markdown with the reading aids below.
4. **Bottom bar**: sticky, safe-area aware, with two pills. `← Day N-1` is outlined (`border primary`, `primary` text). `Day N+1 →` is filled (`primary` bg, white text, shadow). It skips to the nearest Day that has cards; a pill is hidden when there is no such Day.

### Cover photos

`src/data/covers.json` (owned by Claude Code, like the Snapshot) maps Published Card ids to an image in `src/assets/covers/`, and names a `hero` and a `fallback`. A Day's cover is the cover of its first card, else the fallback. Import images through Vite so they are hashed and precached. Every `<img>` sets `width`/`height` (or an aspect ratio) and `alt` (the card title), with `loading="lazy"` except the first carousel card and the Day hero.

## Responsive (v4)

The phone layout above is the base. The other sizes reuse the same components; only the layout changes.

- **Tablet (`md`, ≥ 768px)**: content sits in side gutters of 32px. The hero collage becomes three tall columns (capsule + two tiles side by side), so tiles never stretch into strips. `Plan by Day` becomes a 3-column grid instead of a carousel. The Day view is a centred `max-w-2xl` column with a rounded 420px hero.
- **Desktop (`lg`, ≥ 1024px)**: the page is `max-w-6xl` and centred. On Home, the title (56px) sits beside the collage in a 5:6 grid, the flag badge is hidden, and the Itinerary flows in two columns (`columns-2`, top to bottom so Day order holds). The Day view has two columns: a sticky rounded photo on the left (up to 720px tall), and on the right a `DAY N` eyebrow, a 32px title, the plan, and the prev/next pills as a floating rounded bar.
- **Pointer and keyboard**: hover states exist only as refinements (photo zoom 1.04, title turns `primary`). On a Day, `←`/`→` switch Day and `Esc` goes Home. Every link and button shows a 2px `primary` focus ring on `:focus-visible`.

## Reading aids (carried over)

- Map URLs render as the link label `แผนที่ ↗`, and other bare URLs as their hostname plus ` ↗`. They are styled as small `primary` links (`text-sm font-medium`), each on its own line.
- A time at the start of a line becomes `<time class="slot">`, styled as a `primary-soft` pill with `primary` text, `tabular-nums font-semibold text-[13px] px-2 py-0.5 rounded-full`, followed by the text.
- List markers use `primary` at 60% opacity. Paragraph spacing is `0.6em`. Extra blank lines from Trello produce no extra gaps.

## Motion

- Carousel: native scroll-snap. A card scales to `0.98` on press (`active:`).
- Home → Day: the hero fades in over 200ms. Everything is disabled under `prefers-reduced-motion`.

## The bar

It should look like a shipped app from a good studio, not a template. The reference's quality comes from photography, generous spacing, consistent radii and one accent colour. Match those. Use only the blue: no gradients except the photo itself, and no other accent colours. Use no icon library; the only glyphs are `←`, `→` and `↗`. The UI adds no emoji; the emoji already in Trello card titles stay as written. Text on photos sits only inside the frosted or solid panels, never directly on the image.

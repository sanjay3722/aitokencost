---
name: visual-design-system
description: >-
  The aitokencost.dev visual language — an Apple-referenced greyscale system
  with one blue accent. Use when editing src/app/globals.css, adding or
  restyling components, changing className markup, adjusting layout/spacing/
  type, or reviewing any visual change. Covers the colour rules, the two
  permitted blue uses, the type scale, the band/wrap layout, component
  tokens, and the accessibility requirements (focus, reduced motion, 360px,
  tabular numerals).
---

# Visual design system (aitokencost.dev)

One plain stylesheet: `src/app/globals.css`. No Tailwind, no CSS-in-JS, no
second `.css` file. New styles go here using the existing token vocabulary.

## Colour

| Token | Value | Use |
| --- | --- | --- |
| `--white` | `#ffffff` | page base, cards, inputs |
| `--grey` | `#f5f5f7` | alternating section bands, quiet highlights, notice background |
| `--text` | `#1d1d1f` | primary text, headings, active tab indicator |
| `--text-2` | `#6e6e73` | secondary text, hints, captions, labels-as-metadata |
| `--rule` | `#d2d2d7` | borders, dividers, input outlines |
| `--blue` | `#0071e3` | **accent — see the two-uses rule** |
| `--blue-glow` | `rgba(0,113,227,0.26)` | input focus ring only |
| `--blue-row` | `#edf4fd` | cheapest results row only |

**Blue appears in exactly two places. Do not add a third.**

1. The focus ring on form controls (`textarea`, `input`, `select`): border
   `--blue` + `box-shadow: 0 0 0 4px var(--blue-glow)`.
2. The cheapest model row in the results table: `--blue-row` background with
   rounded outer corners.

Everything else is greyscale — including the cost deltas (direction is carried
by the `+` / `−` sign, not by red/green), the "current model" row (`--grey`),
tags, badges, links, and the active-tab underline (`--text`).

No gradients anywhere.

## Type

Fonts are loaded in `src/app/layout.tsx` via `next/font/google`:

- **Inter** — weights 400 / 500 / 600, `--font-sans`. Body text.
- **IBM Plex Mono** — weights 400 / 500, `--font-mono`. The `<textarea>`,
  number `<input>`s, and every figure in the results table (`.results .num`).

Rules:

- **Never use weight 700 / `bold`.** 600 is the heaviest weight in the system.
- Headings are weight 600 with tight tracking:
  - `h1`: `letter-spacing: -0.035em`, `line-height: 1.05`,
    `font-size: clamp(1.75rem, 6vw, 3.25rem)`, `max-width: 16ch`, centred.
  - `h2`: `letter-spacing: -0.028em`, `line-height: 1.15`,
    `font-size: clamp(1.5rem, 4vw, 2rem)`.
  - Footer section headings deliberately override this down to a 0.8rem/500
    grey label — scope such overrides under `.site-footer`.
- No all-caps. No `text-transform: uppercase`, no wide positive tracking on
  labels.
- `font-variant-numeric: tabular-nums` is set on `body` and re-asserted on
  `.results .num`. Any new figure must render tabular — keep it on mono
  contexts and add it explicitly if you introduce a new numeric element.

## Layout

- **`.wrap`** — `max-width: 60rem`, centred, `padding-inline: clamp(1rem, 5vw,
  2rem)`, generous `padding-block: clamp(3rem, 8vw, 6rem)`. The content column.
- **`.shell`** — same horizontal centring, *no* vertical padding. For bars like
  the header.
- **`.band` + `.band-white` / `.band-grey`** — full-bleed background strips.
  Sections alternate white / grey down the page. The `.band` is the coloured
  strip; a `.wrap` (or `.shell`) inside it holds the content.
- The hero is centred, with a short headline (`max-width: 16ch`) and a quiet
  `--text-2` `.lede`, and extra vertical breathing room
  (`clamp(4.5rem, 13vw, 9rem)`).
- Anchor targets under the sticky header carry `scroll-margin-top: 3.5rem`
  (`main section[id]`).

## Components

- **Card** (`.calculator`): `--white` on the grey band, `border-radius:
  var(--radius-card)` (18px), `box-shadow: var(--shadow-card)`
  (`0 4px 24px rgba(0,0,0,0.06)` — very soft, single layer), padding
  `clamp(1.25rem, 4vw, 2.75rem)`. **No hover state on cards**, no transform,
  no shadow animation.
- **Inputs**: `border-radius: var(--radius-input)` (12px), `1px solid
  var(--rule)`, `--white` background. Focus per the blue rule above. `<select>`
  uses an inline SVG chevron stroked in `#6e6e73`.
- **Results table**: dense (`padding: 0.55rem 0.85rem`), model column
  left-aligned, every number column right-aligned and mono. Row dividers only
  — `1px solid var(--rule)` bottom border, `border-collapse: separate`. No
  per-row card styling, no centring. Cheapest row (`.results tbody
  tr:first-child`) gets `--blue-row` + `var(--radius-row)` (10px) outer
  corners; this rule is declared *after* `.baseline-row` so blue wins when a
  row is both cheapest and the current model.
- **Header** (`.site-header`): sticky, 3rem tall, `1px` bottom rule,
  translucent `rgba(255,255,255,0.82)` with `backdrop-filter: saturate(180%)
  blur(12px)` (keep the `-webkit-` prefix).

## Accessibility (all required)

- **Focus visible on everything.** Global `:focus-visible { outline: 2px solid
  var(--text); outline-offset: 2px }` for links and buttons; form controls
  swap that for the blue border + glow. Never `outline: none` without a
  replacement indicator.
- **`prefers-reduced-motion: reduce`** — the stylesheet ends with a block that
  neutralises animations, transitions, and smooth scroll. Any new animation
  must still be covered by it; prefer not adding motion at all.
- **Responsive to 360px** — `.wrap` padding bottoms out at `1rem`; wide content
  (the table) scrolls inside `.table-wrap { overflow: auto hidden }`; form
  fields go full-width at `max-width: 560px`. Test the narrow end.
- **Tabular numerals** on every figure (see Type).

## When reviewing a visual change, reject

- A new colour literal instead of a token; blue used anywhere beyond the two
  sanctioned spots.
- `font-weight: 700` / `bold`; `text-transform: uppercase`.
- A second stylesheet, Tailwind classes, or `style={}` beyond a computed
  dynamic value.
- `:hover` on `.calculator` or any card; transform/shadow transitions on cards.
- `outline: none` with no visible replacement; a new keyframe animation with no
  reduced-motion consideration.
- A number rendered without tabular figures; a new table with centred numeric
  columns.
- Horizontal page scroll at 360px.

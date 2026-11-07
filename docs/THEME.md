# NAVICORE ONE themes (light and dark)

Light is the original design and the default. Dark follows the dark brand artwork: near-black navy, cyan / teal accent,
soft cyan glow, a horizon arc under the hero and the final call to action.

## How it works
- `src/lib/theme-init.ts` (inline in `<head>`, before first paint) sets `<html data-theme="light|dark">`: the visitor's saved
  choice (`localStorage["navicore-theme"]`), then the OS setting, then light. In dark it also preloads the dark logo.
  Without JavaScript the page is the light theme. To make light the default regardless of the OS, drop the `matchMedia` branch.
- `src/components/layout/ThemeToggle.tsx`: header button (`aria-pressed`, one fixed label "Dark theme"; the icon shows the mode it
  switches to). It saves the choice and updates the `theme-color` meta tags.
- `src/app/globals.css`: the light values live in `@theme`; the dark theme re-points the same variables under
  `html[data-theme="dark"]` (block "Dark theme" at the end of the file). Every Tailwind utility follows, so there are no
  `dark:` variants in the components.
- Hard-coded colours were turned into RGB-triplet variables (`--shade`, `--glow-a/b/c`, `--canvas-rgb`, `--line-rgb`) so glows,
  shadows and the glass header follow the theme. Light values are unchanged.

## Token roles (names describe the light palette; the role is what carries over)
| Token | Light | Dark | Use |
|---|---|---|---|
| `white` | #FFF | #FFF | text on fills, glass overlays; never a surface |
| `canvas` / `surface` / `blush` | #FFF7F9 / #FFF / #FFF7F9 | #02050B / #0A1522 / #07111C | page / card / quiet panel |
| `baby-pink` | #FADADF | #14323F | tint fill and hairline |
| `rose` | #F4A9BA | #1D8FAB | decorative strokes and glows |
| `red` | #C8102E | #18E8D8 | accent: links, primary buttons (cyan in dark) |
| `on-red` | #FFF | #03121A | text on an accent fill |
| `maroon` | #6B1220 | #E9F5FA | strong text and outlines |
| `deep` | #6B1220 | #0B4357 | fills that carry white text (chips, bands) |
| `mist` | #FADADF | #B4C9D6 | soft text on dark bands |
| `ink` / `ink-soft` | #2A0A10 / existing | #CDDAE4 / #8EA6B7 | body text |
| `danger` | #C8102E | #FF7A8C | errors only (stays red in dark) |
| `void` | #2A0A10 | #010308 | device hardware (notch) |

Rules: use `surface` (not `white`) for a card fill; `text-white` only on a fill that is dark in both themes (`deep`, dark bands);
`text-on-red` on `bg-red`; `text-mist` for soft text on a dark band; `danger` for errors. `red` renders cyan in dark: that is
deliberate, not a bug, but a future rename to `accent` is a mechanical find and replace.

## Assets
- `public/brand/logo-dark.webp` (480 x 126, transparent): the cyan lockup, keyed from the dark brand artwork supplied for this
  work. It is a raster, so replace it with the official transparent SVG or a larger PNG when the brand kit has one; the paths and
  sizes are in `src/content/brand.ts` (`logo.darkTheme`). The light logos are unchanged.
- The 3D module icons are pink and maroon, so the dark theme recolours them with `filter: hue-rotate` (`.icon-float`).
  Replace with true cyan renders if you want exact brand colour.
- Not themed: favicon, Open Graph image and the web manifest colours (they stay maroon).

## Verified
Light mode matches the previous build pixel for pixel apart from the new toggle (frozen-animation screenshots, 1440 px, whole
page; run-to-run noise is the only difference). axe: no violations on 7 pages at 1440 and 390 px in both themes. Contrast figures
for the dark tokens are in the comment above the "Dark theme" block in `globals.css`.

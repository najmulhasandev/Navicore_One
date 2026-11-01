# NAVICORE ONE motion system

Source: `src/app/motion.css` (all CSS), `src/components/motion/MotionController.tsx` (about 3 KB gzipped, plain DOM),
`src/lib/motion-init.ts` (inline policy script).

## Policy
Motion is **always on**: the inline script in `<head>` sets `<html data-motion="full">` before first paint, ignoring the OS
"reduce motion" setting. There is no toggle. The `reduced` rules in `motion.css` (opacity fades and colour changes only, no
translate, scale, parallax, float, 3D or loops) are kept as unused code, so an OS check or a toggle can be restored by changing
`src/lib/motion-init.ts`. The "Reduced mode" column below describes those unused rules.
No blanket `animation: none !important` anywhere. Only transform and opacity are animated. Without JS the page is visible and still.

## Performance rules
- Infinite animations pause off-screen: `data-live="eager"` (runs from first paint, JS adds `.is-off`) or `data-live="lazy"` (paused until JS adds `.is-on`). Observed per element, rootMargin 0.
- `will-change: transform` is set only on floating cards while their wrapper is on-screen.
- Mobile (max-width 767px): amplitudes halved (`--m-amp: .5`), pointer effects off (fine pointers only), aurora layers smaller, no blur filter.
- Scroll parallax uses a CSS scroll timeline where supported; otherwise JS writes `--sy` (rAF, passive) on `[data-parallax-root]`.

## Inventory
| # | Animation | Trigger | Duration | Reduced rules (unused) |
|---|---|---|---|---|
| 1 | Hero entrance: eyebrow, H1 line 1, line 2, sub, buttons, status, note (`.hero-in`, `m-rise`) | page load, CSS only | 0.55 s each, 60 ms stagger (text ends at 0.91 s) | 180 ms fade |
| 2 | Hero devices and chips entrance (`.fc-enter`, `m-device-in`) | page load | 0.55 s, 50 ms stagger + 0.2 s (the whole entrance ends at 1.05 s) | 200 ms fade |
| 3 | Hero aurora, 3 gradient layers (`m-aurora-a/b/c`) | endless, paused off-screen | 22 s / 28 s / 18 s alternate | none |
| 4 | Device and chip float (`.fc-float`, `m-float`) | endless, paused off-screen | 7-11 s, amplitude 12-22 px (halved on phones), per-element phase | none (resting rotation only) |
| 5 | Pointer tilt / shift (`.fc-tilt`) | mouse over hero or wall, fine pointer only | eased in rAF (lerp 0.08), max 6 deg | none |
| 6 | Chip and device scroll parallax (`.fc-parallax`, `m-parallax`) | scroll, first 90vh, three depths 0.15 / 0.4 / 0.7 | scroll-linked | none |
| 7 | Section reveal (`[data-reveal]`) | enters viewport, once (IntersectionObserver) | 0.7 s, cards stagger 70 ms (max 8) | 180 ms fade |
| 8 | Reveal safety net (`m-failsafe`) | element still hidden after 4 s | 0.01 s | same |
| 9 | Button light sweep + 3 px lift (`.btn`) | hover | 0.85 s sweep, 0.25 s lift | colour change only |
| 10 | Card lift + cursor glow (`[data-glow]`) | hover, pointer position | 0.35 s lift, 0.3 s glow | glow and shadow colour only |
| 11 | 3D icon bob (`m-icon-bob`) | hover on card / marquee pill | 1.7 s loop while hovered | none |
| 12 | Nav underline slide (`.nav-link`) | hover / focus | 0.35 s | instant underline, colour fade |
| 13 | Header condense (`.hdr-bg`, `.hdr-inner`, `.hdr-logo`) | scrollY > 8, transform only (fixed 72 px footprint) | 0.35 s | glass tint and shadow colour only |
| 14 | Device wall drift (`m-wall-drift`) | endless, lazy-paused | 26 s alternate | none |
| 15 | Device wall pointer parallax and 3D tilt (58 deg / -28 deg) | mouse over wall | eased, max 4 deg | the wall keeps its fixed tilted composition, but nothing moves (no drift, no pointer response) |
| 16 | Module marquee (`m-marquee`) | endless, lazy-paused, pauses on hover / focus | 75 s linear | still wrapped row, clone hidden |
| 17 | Status strip count-up (JS) and bars (`m-bar`) | strip enters viewport, once | 1.1 s / 1.2 s | final numbers and full bars at once |
| 18 | Smooth anchors | in-page links | browser | `scroll-behavior: auto` |

## Verification (Playwright, Chromium, 1440x900, served by `next start`)
Re-run: `npm run build && npm run start`, then `python3 scripts/verify-motion.py http://localhost:3000` (needs Python Playwright; the criteria are in the script header).
- Full motion, about 1.0 s and 1.7 s after load of `/`: `document.getAnimations().length` = 48 (13 of them are the 4 s reveal safety timers,
  so 35 real animations; 12 are infinite: 3 aurora, 8 floats, 1 marquee). Requirement: at least 12.
- Hero entrance: the last entrance animation ends at 1050 ms (limit 1100 ms), starting at first paint with no JavaScript involved.
- Infinite animations running while their element is off-screen: 0 at every sampled scroll position (every 700 px down the whole page, and at the bottom).
- OS "reduce motion" turned on: `data-motion` is still `full`, 48 animations, 12 infinite, no footer button (always-on policy).

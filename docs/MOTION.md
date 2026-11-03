# NAVICORE ONE motion system

Source: `src/app/motion.css` (all CSS), `src/components/motion/MotionController.tsx` (about 3 KB gzipped, plain DOM),
`src/lib/motion-init.ts` (inline policy script). Layout state for the pinned "How it works" stage lives in `src/app/globals.css`.

## Policy
- Motion is **always on**: the inline script in `<head>` sets `<html data-motion="full">` before first paint and ignores the OS
  "reduce motion" setting. There is no toggle anywhere (the Sparrow-grade brief asked for a footer Motion On/Off switch; an earlier
  instruction to keep motion always on takes precedence, so it was not built).
- The `reduced` rules in `motion.css` (opacity fades and colour changes only; no translate, scale, parallax, float, 3D or loops)
  are kept as unused code, so an OS check or a toggle can be restored by changing `src/lib/motion-init.ts` alone.
- Only `transform`, `translate` and `opacity` are animated. Nothing animates layout. No blanket `animation: none !important`.
- Without JavaScript (no `data-js` / `data-motion` attribute) the page is fully visible and still.

## Performance rules
- **Off-screen pause.** Every infinite animation lives under `data-live="eager"` (runs from first paint; JS adds `.is-off` when it
  leaves the viewport) or `data-live="lazy"` (paused until JS adds `.is-on`). The pause rules in `motion.css` name the animated
  classes explicitly (`.fc-float`, `.marquee-track`, `.wall-col`, `.core-dot`, `.core-hub`, `.aurora > i`, plus `.core-hub::before`).
  A universal `*` selector was tried and removed: every class toggle re-matched every descendant. **A new infinite animation must be
  added to that list**; `scripts/verify-motion.py` fails if one keeps running off-screen.
- **Below-the-fold sections** (wall, core diagram, bento, comparison, timeline, sponsors, FAQ) use `content-visibility: auto`
  (`.defer`), so their style, layout and paint cost is paid when they approach the viewport, not at load. Each sets
  `--cis-m` / `--cis-d` (phone / 768px+) to its content height so in-page anchors such as `#build-status` land correctly
  before the section has rendered once; re-measure if a section changes a lot.
- `will-change: transform` is set only on floating cards while their wrapper is on-screen.
- Mobile (max-width 767px): amplitudes halved (`--m-amp: .5`), pointer effects off (fine pointers only), aurora layers smaller,
  no blur filter, wall shows 3 columns at scale .52, the core diagram falls back to a hub plus a 2-column list, and the
  "How it works" stage is a plain stacked list.
- Scroll-driven reveal uses CSS view timelines where supported; an IntersectionObserver path does the same elsewhere.
- Scroll parallax uses a CSS scroll timeline where supported; otherwise JS writes `--sy` (rAF, passive) on `[data-parallax-root]`.
- Fonts: Outfit (display, variable, self-hosted via `next/font/local`) and Inter (body). No other runtime libraries; Three.js was removed.

## Inventory
| # | Animation | Trigger | Duration | Reduced rules (unused) |
|---|---|---|---|---|
| 1 | Hero entrance: eyebrow, H1 lines, sub, buttons, chips (`.hero-in`, `m-rise`) | page load, CSS only | 0.55 s each, 60 ms stagger | 180 ms fade |
| 2 | Hero devices and chips entrance (`.fc-enter`, `m-device-in`) | page load | 0.55 s, 50 ms stagger + 0.2 s; **whole entrance ends at 1.05 s** | 200 ms fade |
| 3 | Hero aurora, 3 gradient layers on the dark band (`m-aurora-a/b/c`); the final CTA card has its own set | endless, paused off-screen | 22 s / 28 s / 18 s alternate | none |
| 4 | Device and chip float (`.fc-float`, `m-float`) | endless, paused off-screen | 7-11 s, amplitude 12-22 px (halved on phones) | none (resting rotation only) |
| 5 | Pointer tilt / shift (`.fc-tilt`, wall plane) | mouse over hero or wall, fine pointer only | eased in rAF (lerp .08), max 6 deg (wall 4 deg) | none |
| 6 | Scroll parallax (`.fc-parallax`, `m-parallax`) | scroll, first 90vh, three depths | scroll-linked | none |
| 7 | Section reveal (`[data-reveal]`, `m-reveal-sd` / IO fallback) | element enters viewport, once | scroll-linked over the entry range with 3 % stagger per `--i`; fallback 0.7 s, 70 ms stagger (max 8) | 180 ms fade |
| 8 | Reveal safety net (`m-failsafe`) | element still hidden after 4 s | 0.01 s | same |
| 9 | Module marquee (`m-marquee`) | endless, paused off-screen, pauses on hover / focus | 75 s linear | still wrapped row |
| 10 | "How it works" pinned stage: screens crossfade, active step highlights | scroll; three invisible zones cross the viewport middle (IO, -45 % margins); also `focusin` on a step | 0.55 s opacity, 0.6 s transform, 0.4 s step highlight | 200 ms fade |
| 11 | Tilted wall: columns drift in opposite directions (`m-col-up`, `m-col-down`) | endless, paused off-screen | 24 s alternate, travel 7 rem (halved on phones) | none (columns still) |
| 12 | Shared core: a pulse travels each line (`m-core-pulse`), hub rings out (`m-hub-ping`) | endless, paused off-screen, from `md` up only | 3.6 s per dot (phase-shifted), 3.2 s ping | none |
| 13 | Bento and timeline numbers count up (JS rAF) | block enters viewport, once | 1.1 s ease-out cubic | final numbers at once |
| 14 | Build-status bars (`m-bar`) | strip enters viewport, once | 1.2 s, 110 ms stagger | full bars at once |
| 15 | Build timeline: the line draws itself (scaleX on desktop, scaleY on mobile) | timeline enters viewport, once | 1.3 s | drawn at once |
| 16 | Button light sweep + 3 px lift (`.btn`) | hover | 0.85 s sweep, 0.25 s lift | colour change only |
| 17 | Card lift + cursor glow (`[data-glow]`) | hover, pointer position | 0.35 s lift, 0.3 s glow | glow and shadow colour only |
| 18 | 3D icon bob (`m-icon-bob`) | hover on card / marquee pill | 1.7 s loop while hovered | none |
| 19 | Nav underline slide, header condense, FAQ icon rotate | hover / focus, scrollY > 8, details open | 0.35 s / 0.35 s / 0.3 s | colour and tint only |
| 20 | Smooth anchors | in-page links | browser | `scroll-behavior: auto` |

## Verification (Playwright, Chromium, 1440x900, served by `next start`)
Re-run: `npm run build && npm run start`, then `python3 scripts/verify-motion.py http://localhost:3000` (needs Python Playwright;
the criteria are in the script header).
- Full motion, 1.7 s after load of `/`: `document.getAnimations().length` = 42 (15 time-based entrances, 12 scroll-linked, 15 infinite:
  3 hero aurora, 8 floats, 1 marquee, 3 CTA aurora). Requirement: at least 12.
- Hero entrance: the last entrance animation ends at 1050 ms (limit 1100 ms), starting at first paint with no JavaScript involved.
- Infinite animations running while their element is off-screen: 0 at every sampled scroll position (every 700 px down the whole page,
  and at the bottom), including the pseudo-element hub ring.
- OS "reduce motion" turned on: `data-motion` is still `full`, 42 animations, 15 infinite, no footer button (always-on policy).

## Lighthouse (mobile, Lighthouse 12, local `next start`, headless Chromium, 2 CPU cores, benchmarkIndex about 2200)
Method: `lighthouse <url> --form-factor=mobile --screenEmulation.mobile --throttling-method=simulate|devtools`, 5 simulated runs and
3 applied-throttling runs of the home page (taken one revision earlier; the last change only altered `content-visibility` placeholder heights), compared with the previous production build served the same way.

| | Performance (median) | LCP (median) | TBT (median) | CLS | A11y / Best practices / SEO |
|---|---|---|---|---|---|
| New home, simulated | 82 (range 82-87) | 3.15 s | 442 ms | 0 | 100 / 100 / 100 |
| Previous build, simulated | 82 (range 74-85) | 3.1 s | 468 ms | 0 | not measured |
| New home, applied throttling | 72 | 2.1 s | 1,274 ms | 0 | not measured |
| Previous build, applied throttling | 73 | 2.0 s | 1,208 ms | 0 | not measured |

Reading: the rebuild is performance-neutral against the previous build, which is not the same as meeting the brief's Lighthouse
90 target. It does not. LCP passes 2.5 s with applied throttling and misses it under Lighthouse's simulated model; the element is
the header logo (the only candidate Chromium reports; observed time 0.25-0.3 s unthrottled). The gap is main-thread work
shared by both builds (HTML parse and hydration of the React runtime, about 186 KB gzipped of JavaScript, one font-swap layout of
about 70 ms). Run-to-run spread on this machine is 10+ points, so treat single runs as noise. A further pass would target that shared
shell, not the home sections.

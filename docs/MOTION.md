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
  classes explicitly (`.fc-float`, `.marquee-track`, `.wall-col`, `.core-dot`, `.core-hub`, `.aurora > i`, `.sx`, plus `.core-hub::before`).
  A universal `*` selector was tried and removed: every class toggle re-matched every descendant. **A new infinite animation must be
  added to that list**; `scripts/verify-motion.py` fails if one keeps running off-screen.
- **In-screen activity (`.sx`).** Every illustrative app screen (`ScreenMock`, `Phone`) is one `data-live="lazy"` block. Pausing is per
  screen, not per element, on purpose: the pointer, the Pending/Approved chips and the dragged card are one choreography on one
  shared loop length, and pausing them separately would desynchronise them. Consequence: a screen that is only partly visible keeps
  running as a whole. `verify-motion.py` therefore measures off-screen at **block level** (the nearest `[data-live]` ancestor must
  intersect the viewport) and reports partly visible screens separately (`running_in_partly_visible_blocks`).
- **Play-once entrances in screens.** `MotionController` adds `.is-seen` (never removed) the first time a `[data-live]` block
  intersects. Screen entrances (`.sx-in`, `.sx-grow`, `.sx-cover`, `.sx-line`) are gated by `.is-seen`, so they play once, when the
  screen is first seen, not at load for screens far down the page. Loops start with `.is-on` and pause with `.is-off`.
- **Finished state at rest.** Nothing in a screen is hidden without an animation that reveals it. Without JavaScript, or in the
  unused `reduced` mode, every screen is drawn finished and still (the pointer is `display: none` at rest).
- Screen animation is `transform`, `translate`, `scale`, `rotate` and `opacity` only. Moves are percentages of the element's own
  box or of the whole screen (the pointer lives in an `inset-0` overlay), so they stay on the compositor; `cqw` is not used inside
  keyframes. Tailwind's `scale-x-0` / `translate-*` use the same individual properties, so keyframes override them; do not mix in `transform:`.
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
| 21 | Screen entrance: rows, KPI cards and chart pieces rise in; bars grow, sparklines and chart area wipe in, tree connectors draw, form check marks tick (`.sx-in`, `.sx-grow`, `.sx-cover`, `.sx-line`, `.sx-check`) | first time a screen is on screen (`.is-seen`), once | 0.4-1.3 s each, stagger by `--k` (70-120 ms steps, 80-500 ms start offsets) | none (screens drawn finished) |
| 22 | Pointer: moves across the screen and clicks (`.sx-cursor`, `.sx-click`); on the kanban screen it grabs a card and drags it to the next column (`.sx-cursor-drag`, `.sx-grab`, `.sx-drag`) | endless while the screen is on screen | 9 s loop (10 s for the drag) | pointer hidden |
| 23 | Approval: a Pending pill flips to Approved when the pointer clicks it (`.sx-swap-out`, `.sx-swap-in`) | same 9 s loop as 22 | 9 s | static Pending pill |
| 24 | Live signals: bell and avatar ping (`.sx-ping`), search caret (`.sx-caret`), chart end dot | endless while on screen | 2.4 s ping, 1.1 s caret blink | none |
| 25 | Highlight sweeps over list rows, table rows, calendar days, tree chains, cards (`.sx-hl3/4/6`, `.sx-sweep4/6`) | endless while on screen | 4.5-12 s, staggered by `--k` | none |
| 26 | Typing indicator and arriving message in chat and phone screens (`.sx-typing`, `.sx-dot`, `.sx-msg`) | endless while on screen | 9 s (dots 1 s) | none |
| 27 | Settings toggles flip (`.sx-flip`, `.sx-flip-bg`, `.sx-flip-bg-inv`) with a per-row phase offset (`--on`) | endless while on screen | 7 s | none |
| 28 | Form fields fill, flow nodes fill, search text types (`.sx-fill`, `.sx-type`) | endless while on screen | 5-7.2 s | none |

## Verification (Playwright, Chromium, 1440x900, served by `next start`)
Re-run: `npm run build && npm run start`, then `python3 scripts/verify-motion.py http://localhost:3000` (needs Python Playwright;
the criteria are in the script header).
- Full motion, 1.7 s after load of `/`: `document.getAnimations().length` = 110 (57 infinite, of which only the hero aurora runs at
  scroll 0 because the devices start below the first 900 px; the rest are paused until their screen scrolls in). Requirement: at least 12.
- Hero entrance: the last entrance animation ends at 1050 ms (limit 1100 ms), starting at first paint with no JavaScript involved.
- Infinite animations running while their whole `data-live` block is off-screen: 0 at every sampled scroll position (every 700 px
  down the whole page, and at the bottom), including the pseudo-element hub ring.
- The opposite check: infinite animations paused while their block is entirely inside the viewport: 0 at every sample. Without it a
  pause rule that never lifts would pass the off-screen check.
- Partly visible screens keep their loops running (per-screen pausing, see Performance rules): up to 29 loops at one scroll position
  (`scroll_max_running_in_partly_visible_blocks`). Most loops running at once: 84 (wall section on desktop); all are transform or opacity.
- OS "reduce motion" turned on: `data-motion` is still `full`, 110 animations, 57 infinite, no footer button (always-on policy).

## Lighthouse (mobile, Lighthouse 12, local `next start`, headless Chromium, 2 CPU cores)
Method: `lighthouse <url> --form-factor=mobile --screenEmulation.mobile --throttling-method=simulate --only-categories=performance`,
6 runs per build, **interleaved** (A, B, A, B ...) against the previous main (the Sparrow-grade home, without the in-screen
animation) served the same way on the same machine. The sandbox's own speed drifts between sessions (benchmarkIndex about 2200 to
2800), so absolute scores from different sessions are not comparable; only an interleaved A/B is.

| | Performance (median, range) | FCP | LCP | TBT | CLS |
|---|---|---|---|---|---|
| Previous main (static screens) | 92 (88-98) | 0.93 s | 2.97 s | 182 ms | 0 |
| Animated app screens | 91.5 (90-94) | 1.08 s | 2.83 s | 243 ms | 0 |

Reading: score-neutral within run-to-run noise (the ranges overlap). The measurable cost of the richer screens is about +60 ms TBT
and +0.15 s FCP (more DOM to parse and style in the hero and wall). An earlier interleaved run on a slower sandbox showed the same
direction (about 2-4 points, LCP +0.4 s, TBT +15 to +65 ms). The brief's Lighthouse 90 target is met on this machine and not
guaranteed on slower ones; real-device numbers are not measured. If the cost matters, the lever is DOM size in the hero screens.

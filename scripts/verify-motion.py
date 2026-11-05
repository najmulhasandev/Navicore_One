#!/usr/bin/env python3
"""Motion checks for NAVICORE ONE (docs/MOTION.md, "Verification"). Run against a started `npm run start`.
Needs Python Playwright with Chromium:  pip install playwright && playwright install chromium
Usage:  python3 scripts/verify-motion.py http://localhost:3000
Pass criteria: full_getAnimations_at_1.7s >= 12, entrance_max_end_ms <= 1100, scroll_max_offscreen_running == 0
(block level: an infinite animation counts as off-screen when its whole data-live block is outside the viewport),
scroll_max_paused_in_view == 0 (the opposite check: a looping animation whose data-live block is entirely inside the viewport
must be running, so a pause rule that never lifts cannot pass; oversized clipped layers such as the aurora are excluded by that rule), os_reduced_attr == "full", os_reduced_infinite >= 12, footer_buttons == 0.
Measures: getAnimations() counts, entrance timing, off-screen infinite animations,
that motion stays on when the OS asks for reduced motion (always-on policy), and that there is no motion toggle.
"""
import json, sys
from playwright.sync_api import sync_playwright

BASE = sys.argv[1] if len(sys.argv) > 1 else "http://localhost:3000"

LIST_JS = """() => document.getAnimations().map(a => {
  const e = a.effect, t = e && e.target, ct = e && e.getComputedTiming ? e.getComputedTiming() : {};
  const r = t && t.getBoundingClientRect ? t.getBoundingClientRect() : null;
  const inView = r ? (r.bottom > 0 && r.top < innerHeight && r.right > 0 && r.left < innerWidth) : null;
  // Pausing happens per data-live block (a whole screen, a card, a band), so that choreographed loops (pointer, chips,
  // card drag) stay in sync. A block that is partly visible keeps all its loops running; a block that is fully
  // outside the viewport must have none. blockInView is the block-level answer; inView stays the per-element one.
  const blk = t && t.closest ? t.closest('[data-live]') : null;
  const br = blk ? blk.getBoundingClientRect() : r;
  const blockInView = br ? (br.bottom > 0 && br.top < innerHeight && br.right > 0 && br.left < innerWidth) : null;
  const cls = t && typeof t.className === 'string' ? t.className : '';
  return {
    kind: a.constructor.name,
    name: a.animationName || a.transitionProperty || '',
    state: a.playState,
    infinite: ct.iterations === Infinity,
    dur: typeof ct.duration === 'number' ? ct.duration : String(ct.duration),
    delay: ct.delay, end: ct.endTime,
    cls: cls.slice(0, 60),
    tag: t ? t.tagName.toLowerCase() : '',
    inView, blockInView,
    blockFullyIn: br ? (br.top >= 0 && br.bottom <= innerHeight && br.left >= 0 && br.right <= innerWidth) : null,
    blockOn: blk ? blk.classList.contains('is-on') : null,
    blockTop: br ? Math.round(br.top) : null, blockBottom: br ? Math.round(br.bottom) : null,
    timeline: a.timeline && a.timeline.constructor ? a.timeline.constructor.name : ''
  };
})"""

def summarize(items):
    names = {}
    for i in items:
        names.setdefault(i["name"] or i["kind"], 0)
        names[i["name"] or i["kind"]] += 1
    return names

def run():
    out = {}
    with sync_playwright() as p:
        b = p.chromium.launch()

        # ---------- FULL MOTION, desktop, pointer:fine ----------
        ctx = b.new_context(viewport={"width": 1440, "height": 900}, reduced_motion="no-preference")
        pg = ctx.new_page()
        pg.goto(BASE + "/", wait_until="load")
        html_attrs = pg.evaluate("() => ({motion: document.documentElement.dataset.motion, js: document.documentElement.dataset.js})")
        out["full_attrs"] = html_attrs
        pg.wait_for_timeout(1000)
        a1 = pg.evaluate(LIST_JS)
        pg.wait_for_timeout(700)  # ~1.7 s after load
        a2 = pg.evaluate(LIST_JS)
        out["full_getAnimations_at_1s"] = len(a1)
        out["full_getAnimations_at_1.7s"] = len(a2)
        out["full_names"] = summarize(a2)
        out["full_infinite_total"] = sum(1 for i in a2 if i["infinite"])
        out["full_infinite_running"] = sum(1 for i in a2 if i["infinite"] and i["state"] == "running")
        out["full_infinite_paused"] = sum(1 for i in a2 if i["infinite"] and i["state"] == "paused")
        out["full_scroll_timeline_anims"] = sum(1 for i in a2 if "Scroll" in i["timeline"])
        # entrance: first-load timing from a fresh load (animations may already be finished), so measure on a new page
        pg2 = ctx.new_page()
        pg2.goto(BASE + "/", wait_until="commit")
        pg2.wait_for_timeout(120)
        ent = pg2.evaluate(LIST_JS)
        ent = [i for i in ent if i["name"] in ("m-rise", "m-device-in")]
        out["entrance_anims_seen_at_120ms"] = len(ent)
        out["entrance_max_end_ms"] = max([ (i["end"] or 0) for i in ent ] or [0])
        pg2.close()

        # ---------- OFF-SCREEN infinite animations while scrolling ----------
        H = pg.evaluate("() => document.documentElement.scrollHeight")
        out["page_height"] = H
        samples = []
        y = 0
        while y <= H:
            pg.evaluate("(y) => window.scrollTo(0, y)", y)
            pg.wait_for_timeout(450)
            lst = pg.evaluate(LIST_JS)
            bad = [i for i in lst if i["infinite"] and i["state"] == "running" and i["blockInView"] is False]
            partial = [i for i in lst if i["infinite"] and i["state"] == "running" and i["inView"] is False and i["blockInView"] is True]
            stuck = [i for i in lst if i["infinite"] and i["state"] == "paused" and i["blockFullyIn"] is True]
            samples.append({"y": y, "running_infinite": sum(1 for i in lst if i["infinite"] and i["state"] == "running"),
                            "paused_in_view": len(stuck),
                            "paused_in_view_examples": [(i["name"], i["cls"][:30], i["blockOn"], i["blockTop"], i["blockBottom"]) for i in stuck[:4]],
                            "running_infinite_offscreen": len(bad),
                            "running_in_partly_visible_blocks": len(partial),
                            "offscreen_examples": [(i["name"], i["cls"]) for i in bad[:4]]})
            y += 700
        pg.evaluate("() => window.scrollTo(0, document.documentElement.scrollHeight)")
        pg.wait_for_timeout(600)
        lst = pg.evaluate(LIST_JS)
        out["bottom_running_infinite"] = sum(1 for i in lst if i["infinite"] and i["state"] == "running")
        out["bottom_running_infinite_offscreen"] = sum(1 for i in lst if i["infinite"] and i["state"] == "running" and i["blockInView"] is False)
        out["scroll_samples"] = samples
        out["scroll_max_offscreen_running"] = max(s["running_infinite_offscreen"] for s in samples)
        out["scroll_max_paused_in_view"] = max(s["paused_in_view"] for s in samples)
        out["scroll_max_running_in_partly_visible_blocks"] = max(s["running_in_partly_visible_blocks"] for s in samples)

        ctx.close()

        # ---------- OS reduced-motion: motion must stay on (always-on policy) ----------
        ctx = b.new_context(viewport={"width": 1440, "height": 900}, reduced_motion="reduce")
        pg = ctx.new_page()
        pg.goto(BASE + "/", wait_until="load")
        pg.wait_for_timeout(1800)
        out["os_reduced_attr"] = pg.evaluate("() => document.documentElement.dataset.motion")
        rl = pg.evaluate(LIST_JS)
        out["os_reduced_getAnimations"] = len(rl)
        out["os_reduced_names"] = summarize(rl)
        out["os_reduced_infinite"] = sum(1 for i in rl if i["infinite"])
        out["footer_buttons"] = pg.locator("footer button").count()
        ctx.close()

        b.close()
    return out

if __name__ == "__main__":
    res = run()
    print(json.dumps(res, indent=1, default=str))

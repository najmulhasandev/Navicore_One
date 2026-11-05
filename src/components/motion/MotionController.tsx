"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * The only script behind the motion system (about 3 KB gzipped, plain DOM, no libraries).
 *  - per page:   scroll reveal (once), off-screen pause of infinite animations, count-up, "How it works" stage
 *  - global:     header "scrolled" state, pointer tilt / cursor glow (fine pointers only),
 *                scroll parallax fallback for browsers without CSS scroll-driven animations
 * Everything respects <html data-motion>; see docs/MOTION.md.
 */

const root = () => document.documentElement;
const isFull = () => root().getAttribute("data-motion") === "full";
const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

function countUp(el: HTMLElement) {
  const to = Number(el.dataset.count);
  if (!Number.isFinite(to)) return;
  const t0 = performance.now();
  const dur = 1100;
  el.textContent = "0";
  const step = (t: number) => {
    const k = Math.min((t - t0) / dur, 1);
    el.textContent = String(Math.round(to * (1 - Math.pow(1 - k, 3))));
    if (k < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

export function MotionController() {
  const pathname = usePathname();

  // Per page: observers that need the new page's DOM.
  useEffect(() => {
    const revealIO = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          e.target.classList.add("is-in");
          revealIO.unobserve(e.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );
    const liveIO = new IntersectionObserver((entries) => {
      for (const e of entries) {
        e.target.classList.toggle("is-on", e.isIntersecting);
        e.target.classList.toggle("is-off", !e.isIntersecting);
        // One-way: lets one-shot entrances (e.g. the in-screen rise) play once, the first time a block is seen.
        if (e.isIntersecting) e.target.classList.add("is-seen");
      }
    });
    const countIO = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          countIO.unobserve(e.target);
          if (isFull()) e.target.querySelectorAll<HTMLElement>("[data-count]").forEach(countUp);
        }
      },
      { threshold: 0.35 },
    );

    // "How it works" stage: whichever zone crosses the middle of the viewport decides which step is active.
    const stepsIO = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          const el = e.target as HTMLElement;
          el.parentElement?.setAttribute("data-active", el.dataset.zone ?? "0");
        }
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    const onFocusIn = (e: FocusEvent) => {
      const step = (e.target as Element | null)?.closest<HTMLElement>(".step");
      const stage = step?.closest<HTMLElement>("[data-steps]");
      if (step && stage) stage.setAttribute("data-active", step.dataset.i ?? "0");
    };
    document.addEventListener("focusin", onFocusIn);

    const scan = () => {
      document.querySelectorAll("[data-zone]").forEach((el) => stepsIO.observe(el));
      document.querySelectorAll("[data-reveal]:not(.is-in)").forEach((el) => revealIO.observe(el));
      document.querySelectorAll("[data-live]").forEach((el) => liveIO.observe(el));
      document.querySelectorAll("[data-countup]").forEach((el) => countIO.observe(el));
    };
    scan();
    return () => {
      revealIO.disconnect();
      liveIO.disconnect();
      countIO.disconnect();
      stepsIO.disconnect();
      document.removeEventListener("focusin", onFocusIn);
    };
  }, [pathname]);

  // Global: mounted once.
  useEffect(() => {
    const html = root();
    let raf = 0;

    // Header condense state + scroll parallax fallback.
    const nativeScrollTimeline = typeof CSS !== "undefined" && CSS.supports("animation-timeline: scroll()");
    let scrollTick = 0;
    const onScroll = () => {
      if (scrollTick) return;
      scrollTick = requestAnimationFrame(() => {
        scrollTick = 0;
        const y = window.scrollY;
        if (y > 8) html.setAttribute("data-scrolled", "");
        else html.removeAttribute("data-scrolled");
        if (!nativeScrollTimeline && isFull()) {
          const sy = clamp(y / (window.innerHeight * 0.9), 0, 1);
          document.querySelectorAll<HTMLElement>("[data-parallax-root]").forEach((el) => el.style.setProperty("--sy", sy.toFixed(3)));
        }
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    // Pointer effects: fine pointers only.
    const fine = window.matchMedia("(pointer: fine)").matches && window.matchMedia("(hover: hover)").matches;
    const cleanups: Array<() => void> = [];
    if (fine) {
      const pos = { x: -1, y: -1, active: false };
      const cur = new Map<HTMLElement, { x: number; y: number }>();
      let glowEl: HTMLElement | null = null;
      let glowTick = 0;

      const tick = () => {
        raf = 0;
        let moving = false;
        const full = isFull();
        document.querySelectorAll<HTMLElement>("[data-tilt-root]").forEach((el) => {
          const c = cur.get(el) ?? { x: 0, y: 0 };
          let tx = 0;
          let ty = 0;
          if (full && pos.active) {
            const r = el.getBoundingClientRect();
            if (pos.y >= r.top && pos.y <= r.bottom && pos.x >= r.left && pos.x <= r.right) {
              tx = clamp(((pos.x - r.left) / r.width) * 2 - 1, -1, 1);
              ty = clamp(((pos.y - r.top) / r.height) * 2 - 1, -1, 1);
            }
          }
          c.x += (tx - c.x) * 0.08;
          c.y += (ty - c.y) * 0.08;
          if (Math.abs(tx - c.x) < 0.002 && Math.abs(ty - c.y) < 0.002) {
            c.x = tx;
            c.y = ty;
          } else moving = true;
          cur.set(el, c);
          el.style.setProperty("--px", c.x.toFixed(3));
          el.style.setProperty("--py", c.y.toFixed(3));
        });
        if (moving) raf = requestAnimationFrame(tick);
      };
      const kick = () => {
        if (!raf) raf = requestAnimationFrame(tick);
      };

      const onMove = (e: PointerEvent) => {
        if (e.pointerType !== "mouse") return;
        pos.x = e.clientX;
        pos.y = e.clientY;
        pos.active = true;
        if (isFull()) kick();
        const g = (e.target as Element | null)?.closest<HTMLElement>("[data-glow]") ?? null;
        if (g) {
          glowEl = g;
          if (!glowTick) {
            glowTick = requestAnimationFrame(() => {
              glowTick = 0;
              if (!glowEl) return;
              const r = glowEl.getBoundingClientRect();
              glowEl.style.setProperty("--mx", `${(pos.x - r.left).toFixed(0)}px`);
              glowEl.style.setProperty("--my", `${(pos.y - r.top).toFixed(0)}px`);
            });
          }
        }
      };
      const onLeave = () => {
        pos.active = false;
        kick();
      };
      document.addEventListener("pointermove", onMove, { passive: true });
      document.documentElement.addEventListener("pointerleave", onLeave);
      cleanups.push(() => {
        document.removeEventListener("pointermove", onMove);
        document.documentElement.removeEventListener("pointerleave", onLeave);
      });
    }

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
      if (scrollTick) cancelAnimationFrame(scrollTick);
      cleanups.forEach((fn) => fn());
    };
  }, []);

  return null;
}

"use client";

import { useState } from "react";
import { MOTION_STORAGE_KEY } from "@/lib/motion-init";

interface Labels {
  on: string;
  off: string;
  announceOn: string;
  announceOff: string;
}

/**
 * Footer "Motion: On / Off" switch. The visible label is switched by CSS from <html data-motion>,
 * so server and client markup always match. The choice is saved in localStorage (in try/catch).
 */
export function MotionToggle({ labels }: { labels: Labels }) {
  const [announce, setAnnounce] = useState("");

  const toggle = () => {
    const d = document.documentElement;
    const next = d.getAttribute("data-motion") === "full" ? "reduced" : "full";
    d.setAttribute("data-motion", next);
    try {
      localStorage.setItem(MOTION_STORAGE_KEY, next === "full" ? "on" : "off");
    } catch {
      /* storage unavailable: the choice still applies for this visit */
    }
    window.dispatchEvent(new Event("navicore-motion"));
    setAnnounce(next === "full" ? labels.announceOn : labels.announceOff);
  };

  return (
    <button
      type="button"
      onClick={toggle}
      className="inline-flex min-h-11 items-center gap-2 rounded-full bg-white/10 px-4 text-sm font-semibold text-white ring-1 ring-white/40 transition-colors hover:bg-white/20"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
        <path d="M3 12c3-6 6-6 9 0s6 6 9 0" />
      </svg>
      <span className="mo-on">{labels.on}</span>
      <span className="mo-off">{labels.off}</span>
      <span role="status" className="sr-only">{announce}</span>
    </button>
  );
}

import type { CSSProperties, ReactNode } from "react";
import type { PartStatus } from "@/content/types";
import { getMessages } from "@/i18n/messages";
import { StatusDot } from "../ui/StatusDot";
import { statusLook } from "../ui/StatusBadge";

/**
 * Building blocks for the illustrative NAVICORE ONE screens (see ScreenMock).
 * Everything is sized in container units (cqw), so one layout works in a hero laptop, a wall tile or a window.
 * Animated elements carry the class "sx" plus one behaviour class (sx-in, sx-grow, sx-hl ...). Those behaviours are
 * defined in motion.css, start only when the screen is on screen and are listed in docs/MOTION.md.
 * No people, customers or figures are drawn: labels are the guide's own function names, the rest is neutral shapes.
 */

/** Stagger index for CSS: --k drives delays. */
export const k = (i: number, extra: Record<string, string | number> = {}) => ({ "--k": i, ...extra }) as CSSProperties;

export const W = [72, 54, 88, 64, 80, 46, 92, 60, 70, 50];

export const T = ({ children, cls = "" }: { children: ReactNode; cls?: string }) => (
  <p className={`min-w-0 truncate text-[1.8cqw] leading-tight ${cls}`}>{children}</p>
);

/** A neutral text-line placeholder. */
export const Line = ({ i = 0, cls = "bg-baby-pink", h = "1.2cqw" }: { i?: number; cls?: string; h?: string }) => (
  <i className={`block rounded-full ${cls}`} style={{ width: `${W[i % W.length]}%`, height: h }} />
);

const tones = ["from-rose to-baby-pink", "from-maroon to-red", "from-red to-rose"] as const;

/** Abstract person marker (head and shoulders). Not a real person. */
export function Avatar({ size = "3cqw", tone = 0, ping = false }: { size?: string; tone?: number; ping?: boolean }) {
  return (
    <span className="relative block shrink-0" style={{ height: size, width: size }}>
      <span className={`absolute inset-0 overflow-hidden rounded-full bg-linear-to-br ring-1 ring-white ${tones[tone % 3]}`}>
        <i className="absolute left-1/2 top-[20%] h-[36%] w-[36%] -translate-x-1/2 rounded-full bg-white/90" />
        <i className="absolute -bottom-[16%] left-1/2 h-[50%] w-[70%] -translate-x-1/2 rounded-full bg-white/90" />
      </span>
      {ping ? (
        <span className="absolute -bottom-[6%] -right-[6%] block h-[34%] w-[34%]">
          <i className="sx sx-ping absolute inset-0 rounded-full bg-red" />
          <i className="absolute inset-0 rounded-full bg-red ring-[0.3cqw] ring-white" />
        </span>
      ) : null}
    </span>
  );
}

/** Status shown the way the rest of the site shows it: label plus a shape. */
export function StatusChip({ status }: { status: PartStatus }) {
  const s = getMessages().status[status];
  return (
    <span className={`inline-flex items-center gap-[0.6cqw] whitespace-nowrap rounded-full px-[1.2cqw] py-[0.5cqw] text-[1.4cqw] font-semibold ${statusLook[status]}`}>
      <StatusDot status={status} className="!h-[1.2cqw] !w-[1.2cqw] !border" />
      {s.label}
    </span>
  );
}

/** Pending / Approved pill. */
export function StateChip({ done }: { done: boolean }) {
  const s = getMessages().screen;
  return (
    <span className={`inline-block whitespace-nowrap rounded-full px-[1.2cqw] py-[0.5cqw] text-[1.4cqw] font-semibold ${done ? "bg-maroon text-white" : "bg-baby-pink text-maroon"}`}>
      {done ? s.approved : s.pending}
    </span>
  );
}

/** A pill that flips Pending to Approved when the screen's cursor clicks it. */
export function ApproveChip() {
  return (
    <span className="relative grid">
      <span className="sx sx-swap-out col-start-1 row-start-1"><StateChip done={false} /></span>
      <span className="sx sx-swap-in col-start-1 row-start-1 opacity-0"><StateChip done /></span>
    </span>
  );
}

/** Mouse pointer that travels over the screen. Positions are percentages of the screen, so it scales with it. */
export function Cursor({ points, kind = "click" }: { points: readonly [string, string][]; kind?: "click" | "drag" }) {
  const style: Record<string, string> = {};
  points.forEach(([x, y], i) => {
    style[`--x${i}`] = x;
    style[`--y${i}`] = y;
  });
  return (
    <div aria-hidden="true" className={`sx sx-cursor ${kind === "drag" ? "sx-cursor-drag" : ""} pointer-events-none absolute inset-0 z-10`} style={style as CSSProperties}>
      <svg viewBox="0 0 24 24" className="sx sx-click absolute left-0 top-0 h-[3.2cqw] w-[3.2cqw] drop-shadow-[0_1px_1px_rgb(42_10_16/0.45)]">
        <path d="M4 2.5 5 21l4.6-5 4.4 6.4 3-2-4.4-6.4 6.8-.8z" fill="#fff" stroke="#6b1220" strokeWidth="1.5" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

export const Bell = () => (
  <svg viewBox="0 0 24 24" className="h-[2.6cqw] w-[2.6cqw] text-maroon" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 16V11a6 6 0 1 1 12 0v5l1.5 2h-15z" />
    <path d="M10 20.5a2.2 2.2 0 0 0 4 0" />
  </svg>
);

export const Magnifier = () => (
  <svg viewBox="0 0 24 24" className="h-[1.9cqw] w-[1.9cqw] shrink-0 text-maroon" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
    <circle cx="10.5" cy="10.5" r="6" />
    <path d="m15.5 15.5 5 5" />
  </svg>
);

export const Check = ({ cls = "" }: { cls?: string }) => (
  <svg viewBox="0 0 24 24" className={`h-[1.8cqw] w-[1.8cqw] shrink-0 ${cls}`} fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <path d="m5 12.5 4.5 4.5L19 7.5" />
  </svg>
);

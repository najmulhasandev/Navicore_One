import type { CSSProperties, ReactNode } from "react";

interface FloatingCardProps {
  children: ReactNode;
  /** Positioning classes for the wrapper, e.g. "absolute -left-4 top-10". */
  className?: string;
  /** 0 to 1: how far the card drifts on scroll (parallax depth). */
  depth?: number;
  /** Seconds before the drift starts, and one drift cycle. */
  delay?: number;
  duration?: number;
  /** Drift height in px and resting rotation in degrees. */
  amp?: number;
  rot?: number;
  /** Extra classes for the card itself. */
  cardClassName?: string;
  /** true = no card chrome (use around a device frame that has its own shadow). */
  bare?: boolean;
}

type Vars = CSSProperties & Record<`--${string}`, string | number>;

/**
 * A card that drifts gently (CSS keyframes) and shifts slightly on scroll (CSS scroll-driven animation).
 * Two nested elements so the two animations never fight over `transform`.
 * Everything stops under prefers-reduced-motion (see globals.css). No JavaScript.
 */
export function FloatingCard({
  children,
  className = "",
  depth = 0.3,
  delay = 0,
  duration = 7,
  amp = 10,
  rot = 0,
  cardClassName = "",
  bare = false,
}: FloatingCardProps) {
  const outer: Vars = { "--depth": depth };
  const inner: Vars = { "--dur": `${duration}s`, "--delay": `${delay}s`, "--amp": `${amp}px`, "--rot": `${rot}deg` };
  return (
    <div className={`parallax ${className}`} style={outer}>
      <div
        className={`float ${bare ? "" : "rounded-2xl bg-white/90 shadow-float ring-1 ring-baby-pink backdrop-blur"} ${cardClassName}`}
        style={inner}
      >
        {children}
      </div>
    </div>
  );
}

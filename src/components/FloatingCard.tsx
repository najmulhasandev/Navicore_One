import type { CSSProperties, ReactNode } from "react";

interface FloatingCardProps {
  children: ReactNode;
  /** Positioning classes for the outermost wrapper, e.g. "absolute -left-4 top-10". */
  className?: string;
  /** 0 to 1: scroll-parallax depth (0.15 far, 0.4 middle, 0.7 near). */
  depth?: number;
  /** Seconds before the float starts (negative = start mid-cycle, so devices are out of phase) and one cycle. */
  delay?: number;
  duration?: number;
  /** Float height in px (halved on phones by --m-amp) and resting rotation in degrees. */
  amp?: number;
  rot?: number;
  /** Pointer-tilt strength, 0 to 1 (max 6 degrees at 1), and pointer shift in px. */
  tilt?: number;
  shift?: number;
  /** Entrance order for the hero stagger. */
  enter?: number;
  /** Extra classes for the card itself. */
  cardClassName?: string;
  /** true = no card chrome (use around a device frame that has its own shadow). */
  bare?: boolean;
}

type Vars = CSSProperties & Record<`--${string}`, string | number>;

/**
 * Four nested wrappers so that four transform-based effects never fight over `transform`:
 *   fc-parallax  scroll-driven parallax (CSS scroll timeline, JS fallback)
 *   fc-enter     entrance
 *   fc-tilt      pointer tilt / shift (JS sets --px / --py on the tilt root)
 *   fc-float     endless float
 * All effects are opt-in under html[data-motion="full"] (see motion.css); reduced mode keeps only a fade.
 */
export function FloatingCard({
  children,
  className = "",
  depth = 0.3,
  delay = 0,
  duration = 8,
  amp = 14,
  rot = 0,
  tilt = 1,
  shift = 12,
  enter = 0,
  cardClassName = "",
  bare = false,
}: FloatingCardProps) {
  const parallax: Vars = { "--depth": depth };
  const enterVars: Vars = { "--i": enter };
  const tiltVars: Vars = { "--tf": tilt, "--shift": shift };
  const floatVars: Vars = { "--dur": `${duration}s`, "--delay": `${delay}s`, "--amp": amp, "--rot": `${rot}deg` };
  return (
    <div data-live="eager" className={`fc-parallax ${className}`} style={parallax}>
      <div className="fc-enter" style={enterVars}>
        <div className="fc-tilt" style={tiltVars}>
          <div
            className={`fc-float ${bare ? "" : "rounded-2xl bg-white/90 shadow-float ring-1 ring-baby-pink backdrop-blur"} ${cardClassName}`}
            style={floatVars}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

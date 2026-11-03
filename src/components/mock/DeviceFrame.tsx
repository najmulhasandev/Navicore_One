import type { ReactNode } from "react";
import { getMessages } from "@/i18n/messages";

type Variant = "laptop" | "tablet" | "phone" | "window";

interface DeviceFrameProps {
  variant: Variant;
  children: ReactNode;
  /** Title shown in a window frame's title bar. */
  title?: string;
  className?: string;
  /** Window frame only: on phones, drop the title and shrink the bar so the "Illustrative screen" label fits a small tile. */
  compact?: boolean;
}

/**
 * Pure-CSS device and window frames with depth (bezel gradient, inner edge), a glass glare, a soft reflection
 * and fine grain. Fixed aspect ratios, so the layout never shifts while content loads.
 * Laptop and window frames carry an "Illustrative screen" label. The same frames show the responsive web app;
 * they do not imply a native app, and nothing on them is a real screenshot.
 */
export function DeviceFrame({ variant, children, title, className = "", compact = false }: DeviceFrameProps) {
  const label = getMessages().device.illustrative;
  const dot = compact ? "h-2 w-2 sm:h-2.5 sm:w-2.5" : "h-2.5 w-2.5";

  if (variant === "laptop") {
    return (
      <div className={`dev-reflect relative ${className}`}>
        <div className="dev-bezel dev-grain relative rounded-t-[1.1rem] p-[2.2%]">
          <div className="dev-screen aspect-[16/10] overflow-hidden rounded-[0.5rem] bg-white">
            {children}
            <span className="illus-tag">{label}</span>
            <i className="dev-glass" />
          </div>
        </div>
        <div className="relative mx-[-4%] h-[0.9rem] rounded-b-[1rem] bg-linear-to-b from-baby-pink via-rose to-[#d98a9d] shadow-soft">
          <i className="absolute left-1/2 top-0 block h-[0.3rem] w-[14%] -translate-x-1/2 rounded-b-md bg-maroon/25" />
        </div>
      </div>
    );
  }
  if (variant === "tablet") {
    return (
      <div className={`dev-reflect dev-bezel dev-grain relative rounded-[1.6rem] p-[3%] ${className}`}>
        <div className="dev-screen aspect-[4/3] overflow-hidden rounded-[1rem] bg-white">
          {children}
          <i className="dev-glass" />
        </div>
      </div>
    );
  }
  if (variant === "phone") {
    return (
      <div className={`dev-reflect dev-bezel dev-grain relative rounded-[2rem] p-[5%] ${className}`}>
        <i className="absolute left-1/2 top-[3.2%] z-10 block h-[1.4%] w-[26%] -translate-x-1/2 rounded-full bg-ink" />
        <div className="dev-screen aspect-[9/17] overflow-hidden rounded-[1.4rem] bg-white">
          {children}
          <i className="dev-glass" />
        </div>
      </div>
    );
  }
  return (
    <div className={`wall-tile overflow-hidden rounded-2xl bg-white shadow-float ring-1 ring-baby-pink ${className}`}>
      <div className={`flex items-center border-b border-baby-pink bg-blush ${compact ? "gap-1.5 px-2.5 py-2 sm:gap-2 sm:px-4 sm:py-2.5" : "gap-2 px-4 py-2.5"}`}>
        <i className={`block rounded-full bg-rose ${dot}`} />
        <i className={`block rounded-full bg-baby-pink ${dot}`} />
        <i className={`block rounded-full bg-baby-pink ${dot}`} />
        {title ? <span className={`ml-3 truncate text-xs font-medium text-ink-soft ${compact ? "max-sm:hidden" : ""}`}>{title}</span> : null}
        <span className="ml-auto shrink-0 rounded-full bg-white px-2 py-0.5 text-[0.62rem] font-semibold text-maroon ring-1 ring-baby-pink">{label}</span>
      </div>
      <div className="dev-screen relative aspect-[16/10]">
        {children}
        <i className="dev-glass" />
      </div>
    </div>
  );
}

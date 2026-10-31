import type { ReactNode } from "react";

type Variant = "laptop" | "tablet" | "phone" | "window";

interface DeviceFrameProps {
  variant: Variant;
  children: ReactNode;
  /** Title shown in a window frame's title bar. */
  title?: string;
  className?: string;
}

/**
 * Pure-CSS device and window frames. Fixed aspect ratios, so the layout never shifts while content loads.
 * The same frames show the responsive web app; they do not imply a native app.
 */
export function DeviceFrame({ variant, children, title, className = "" }: DeviceFrameProps) {
  if (variant === "laptop") {
    return (
      <div className={`relative ${className}`}>
        <div className="rounded-t-[1.1rem] bg-maroon p-[2.2%] shadow-float">
          <div className="aspect-[16/10] overflow-hidden rounded-[0.5rem] bg-white">{children}</div>
        </div>
        <div className="mx-[-4%] h-[0.9rem] rounded-b-[1rem] bg-linear-to-b from-baby-pink to-rose shadow-soft" />
      </div>
    );
  }
  if (variant === "tablet") {
    return (
      <div className={`rounded-[1.6rem] bg-maroon p-[3%] shadow-float ${className}`}>
        <div className="aspect-[4/3] overflow-hidden rounded-[1rem] bg-white">{children}</div>
      </div>
    );
  }
  if (variant === "phone") {
    return (
      <div className={`relative rounded-[2rem] bg-maroon p-[5%] shadow-float ${className}`}>
        <i className="absolute left-1/2 top-[3.2%] z-10 block h-[1.4%] w-[26%] -translate-x-1/2 rounded-full bg-ink" />
        <div className="aspect-[9/17] overflow-hidden rounded-[1.4rem] bg-white">{children}</div>
      </div>
    );
  }
  return (
    <div className={`overflow-hidden rounded-2xl bg-white shadow-float ring-1 ring-baby-pink ${className}`}>
      <div className="flex items-center gap-2 border-b border-baby-pink bg-blush px-4 py-2.5">
        <i className="block h-2.5 w-2.5 rounded-full bg-rose" />
        <i className="block h-2.5 w-2.5 rounded-full bg-baby-pink" />
        <i className="block h-2.5 w-2.5 rounded-full bg-baby-pink" />
        {title ? <span className="ml-3 truncate text-xs font-medium text-ink-soft">{title}</span> : null}
      </div>
      <div className="aspect-[16/10]">{children}</div>
    </div>
  );
}

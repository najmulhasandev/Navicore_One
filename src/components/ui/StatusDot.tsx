import type { PartStatus } from "@/content/types";

/**
 * A small drawn marker per status, told apart by shape and not by colour alone. Drawn in CSS, so it never depends on
 * a font having the Unicode glyph. Takes its colour from the surrounding text (currentColor).
 */
export function StatusDot({ status, className = "" }: { status: PartStatus; className?: string }) {
  const ring = "rounded-full border-[1.5px] border-current";
  const shape =
    status === "live"
      ? "rounded-full bg-current"
      : status === "building"
        ? ring
        : status === "planned"
          ? ring
          : status === "future"
            ? `${ring} border-dashed`
            : "rotate-[45deg] scale-[0.8] bg-current";
  return (
    <i
      aria-hidden="true"
      className={`inline-block h-2.5 w-2.5 shrink-0 ${shape} ${className}`}
      style={status === "building" ? { background: "linear-gradient(90deg, currentColor 50%, transparent 50%)" } : undefined}
    />
  );
}

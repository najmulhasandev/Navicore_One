import type { PartStatus } from "@/content/types";
import { getMessages } from "@/i18n/messages";

const look: Record<PartStatus, { cls: string; glyph: string }> = {
  live: { cls: "bg-maroon text-white", glyph: "●" },
  building: { cls: "bg-baby-pink text-maroon ring-1 ring-inset ring-rose", glyph: "◐" },
  planned: { cls: "bg-white text-maroon ring-1 ring-inset ring-maroon/50", glyph: "○" },
  future: { cls: "bg-blush text-ink-soft ring-1 ring-inset ring-rose", glyph: "◌" },
  foundation: { cls: "bg-white text-maroon ring-1 ring-inset ring-maroon", glyph: "◆" },
};

/** Status is always told by the label and a shape, never by colour alone. */
export function StatusBadge({ status, className = "" }: { status: PartStatus; className?: string }) {
  const m = getMessages();
  const s = m.status[status];
  return (
    <span
      title={s.description}
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold tracking-wide ${look[status].cls} ${className}`}
    >
      <span aria-hidden="true" className="text-[0.7rem] leading-none">{look[status].glyph}</span>
      {s.label}
    </span>
  );
}

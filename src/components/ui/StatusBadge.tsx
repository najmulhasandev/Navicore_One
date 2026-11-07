import type { PartStatus } from "@/content/types";
import { getMessages } from "@/i18n/messages";
import { StatusDot } from "./StatusDot";

export const statusLook: Record<PartStatus, string> = {
  live: "bg-deep text-white",
  building: "bg-baby-pink text-maroon ring-1 ring-inset ring-rose",
  planned: "bg-surface text-maroon ring-1 ring-inset ring-maroon/50",
  future: "bg-blush text-ink-soft ring-1 ring-inset ring-rose",
  foundation: "bg-surface text-maroon ring-1 ring-inset ring-maroon",
};

/** Status is always told by the label and a shape, never by colour alone. */
export function StatusBadge({ status, className = "" }: { status: PartStatus; className?: string }) {
  const m = getMessages();
  const s = m.status[status];
  return (
    <span
      title={s.description}
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold tracking-wide ${statusLook[status]} ${className}`}
    >
      <StatusDot status={status} className="!h-2 !w-2" />
      {s.label}
    </span>
  );
}

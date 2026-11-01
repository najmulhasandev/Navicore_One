import Link from "next/link";
import type { OsPart } from "@/content/types";
import { getCopy, pad2, partHref } from "@/lib/parts";
import { StatusBadge } from "./StatusBadge";

export function PartCard({ part, showOutcome = true }: { part: OsPart; showOutcome?: boolean }) {
  const c = getCopy(part);
  return (
    <Link
      href={partHref(part)}
      data-glow
      className="group flex h-full flex-col gap-3 rounded-3xl bg-white p-5 shadow-soft ring-1 ring-baby-pink hover:shadow-glow"
    >
      <div className="flex items-center justify-between gap-3">
        <span className="font-display text-sm font-semibold text-red">Part {pad2(part.number)}</span>
        <StatusBadge status={part.status} />
      </div>
      <h3 className="font-display text-xl font-semibold text-maroon group-hover:underline">{c.name}</h3>
      {showOutcome ? <p className="text-[0.95rem] leading-relaxed text-ink-soft">{c.outcome}</p> : null}
    </Link>
  );
}

import type { PartStatus } from "@/content/types";
import { STATUS_AS_OF_LABEL } from "@/content/site";
import { getMessages } from "@/i18n/messages";
import { allParts, statusCounts } from "@/lib/parts";
import { StatusBadge } from "./ui/StatusBadge";

const ROWS: readonly PartStatus[] = ["live", "building", "planned", "future"];
const BAR: Record<PartStatus, string> = {
  live: "bg-maroon",
  building: "bg-rose",
  planned: "bg-maroon/45",
  future: "bg-ink-soft/40",
  foundation: "bg-maroon",
};

/**
 * Build status, computed from the data: how many parts carry each status label.
 * Numbers count up and bars grow when the strip scrolls into view (full motion only);
 * the final figures are already in the HTML, so no-JS and reduced-motion readers see them at once.
 */
export function StatusStrip() {
  const m = getMessages();
  const t = m.home.status;
  const counts = statusCounts();
  const total = allParts.length;
  return (
    <div id="build-status" data-reveal data-countup className="scroll-mt-28 rounded-[2rem] bg-white p-6 shadow-soft ring-1 ring-baby-pink sm:p-10">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h3 className="font-display text-2xl font-semibold sm:text-3xl">{t.title}</h3>
          <p className="mt-2 max-w-xl text-ink-soft">{t.lead}</p>
        </div>
        <p className="text-sm font-semibold text-maroon">
          {t.asOf} {STATUS_AS_OF_LABEL}
        </p>
      </div>

      <ul className="mt-9 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {ROWS.map((s, i) => (
          <li key={s}>
            <div className="flex items-baseline gap-2">
              <span aria-hidden="true" data-count={counts[s]} className="font-display text-5xl font-semibold tabular-nums text-maroon">
                {counts[s]}
              </span>
              <span className="sr-only">{counts[s]}</span>
              <span className="text-sm text-ink-soft">{t.parts.replace("{n}", String(total))}</span>
            </div>
            <div className="mt-3">
              <StatusBadge status={s} />
            </div>
            <div aria-hidden="true" className="mt-4 h-2.5 overflow-hidden rounded-full bg-baby-pink/70">
              <i
                className={`status-bar block h-full w-full rounded-full ${BAR[s]}`}
                style={{ "--v": counts[s] / total, "--i": i } as React.CSSProperties}
              />
            </div>
            <p className="mt-3 text-sm leading-snug text-ink-soft">{m.status[s].description}</p>
          </li>
        ))}
      </ul>
      <p className="mt-8 text-sm text-ink-soft">{t.foundationNote.replace("{n}", String(counts.foundation))}</p>
    </div>
  );
}

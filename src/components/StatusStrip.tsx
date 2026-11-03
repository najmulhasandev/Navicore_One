import Link from "next/link";
import type { PartStatus } from "@/content/types";
import { STATUS_AS_OF_LABEL } from "@/content/site";
import { getMessages } from "@/i18n/messages";
import { allParts, getCopy, partHref, statusCounts } from "@/lib/parts";
import { SectionHeading } from "./ui/SectionHeading";
import { StatusBadge } from "./ui/StatusBadge";
import { StatusDot } from "./ui/StatusDot";

const STAGES: readonly PartStatus[] = ["live", "building", "planned", "future"];
const BAR: Record<PartStatus, string> = {
  live: "bg-maroon",
  building: "bg-rose",
  planned: "bg-maroon/45",
  future: "bg-ink-soft/40",
  foundation: "bg-maroon",
};
/** How many part names to list under each stage (every Live area is listed). */
const SHOWN: Record<PartStatus, number> = { live: 7, building: 4, planned: 4, future: 4, foundation: 0 };

/**
 * Build status and roadmap, computed from the data: how many parts carry each status label, and which ones.
 * A timeline from Live to Later horizon. Numbers count up and bars grow when it scrolls into view (motion only);
 * the final figures are already in the HTML, so no-JS readers see them at once.
 */
export function StatusStrip() {
  const m = getMessages();
  const t = m.home.status;
  const counts = statusCounts();
  const total = allParts.length;

  return (
    <section className="defer [--cis-m:1740px] [--cis-d:876px] bg-white py-20 sm:py-28" aria-labelledby="status-title">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading id="status-title" eyebrow={t.eyebrow} title={t.title} lead={t.lead} />
          <p className="text-sm font-semibold text-maroon">
            {t.asOf} {STATUS_AS_OF_LABEL}
          </p>
        </div>

        <div id="build-status" data-reveal data-countup className="timeline scroll-mt-28">
          <ol className="tl-list relative mt-14 grid gap-12 lg:grid-cols-4 lg:gap-6">
            {STAGES.map((s, i) => {
              const parts = allParts.filter((p) => p.status === s);
              const shown = parts.slice(0, SHOWN[s]);
              const rest = parts.length - shown.length;
              return (
                <li key={s} className="tl-step relative pl-16 lg:pl-0 lg:pt-16" style={{ "--i": i } as React.CSSProperties}>
                  <span aria-hidden="true" className="tl-node absolute left-0 top-0 grid h-11 w-11 place-items-center rounded-full bg-white text-lg text-maroon ring-2 ring-maroon">
                    <StatusDot status={s} className="!h-4 !w-4" />
                  </span>
                  <div className="flex items-baseline gap-3">
                    <span aria-hidden="true" data-count={counts[s]} className="font-display text-6xl font-extrabold tracking-[-0.05em] tabular-nums text-maroon">
                      {counts[s]}
                    </span>
                    <span className="sr-only">{counts[s]}</span>
                    <span className="text-sm text-ink-soft">{t.parts.replace("{n}", String(total))}</span>
                  </div>
                  <div className="mt-3">
                    <StatusBadge status={s} />
                  </div>
                  <div aria-hidden="true" className="mt-4 h-2.5 overflow-hidden rounded-full bg-baby-pink/70">
                    <i className={`status-bar block h-full w-full rounded-full ${BAR[s]}`} style={{ "--v": counts[s] / total, "--i": i } as React.CSSProperties} />
                  </div>
                  <p className="mt-3 text-sm leading-snug text-ink-soft">{m.status[s].description}</p>
                  <ul className="mt-4 flex flex-wrap gap-1.5">
                    {shown.map((p) => (
                      <li key={p.slug}>
                        <Link href={partHref(p)} className="inline-block rounded-full bg-blush px-2.5 py-1 text-[0.8rem] font-semibold text-maroon ring-1 ring-baby-pink hover:bg-baby-pink">
                          {getCopy(p).name}
                        </Link>
                      </li>
                    ))}
                    {rest > 0 ? (
                      <li>
                        <Link href="/os" className="inline-block px-1.5 py-1 text-[0.8rem] font-semibold text-red underline-offset-4 hover:underline">
                          +{rest}
                        </Link>
                      </li>
                    ) : null}
                  </ul>
                </li>
              );
            })}
          </ol>
        </div>
        <p className="mt-10 text-sm text-ink-soft">{t.foundationNote.replace("{n}", String(counts.foundation))}</p>
        <p className="mt-3">
          <Link href="/os" className="font-semibold text-red underline underline-offset-4 hover:text-maroon">{t.link} →</Link>
        </p>
      </div>
    </section>
  );
}

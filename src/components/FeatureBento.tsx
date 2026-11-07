import Link from "next/link";
import { moduleGroups } from "@/content/module-groups";
import { getMessages } from "@/i18n/messages";
import { allParts, mustGetPart, pad2, partHref, statusCounts } from "@/lib/parts";
import { SectionHeading } from "./ui/SectionHeading";
import { StatusBadge } from "./ui/StatusBadge";

const stagger = (i: number) => ({ "--i": i }) as React.CSSProperties;

function BigNumber({ n, label, tone, i, className = "" }: { n: number; label: string; tone: string; i: number; className?: string }) {
  return (
    <li data-reveal data-countup style={stagger(i)} className={`flex min-h-52 flex-col justify-between rounded-3xl p-7 sm:p-8 ${tone} ${className}`}>
      <span aria-hidden="true" data-count={n} className="font-display text-[clamp(4.5rem,11vw,8.5rem)] font-extrabold leading-[0.9] tracking-[-0.06em] tabular-nums">{n}</span>
      <span className="sr-only">{n}</span>
      <span className="mt-6 text-lg font-semibold">{label}</span>
    </li>
  );
}

/**
 * Feature bento: three big numbers (parts, groups, live areas, all computed) and six tiles taken from
 * "what makes it different". Each tile carries the status label of the part it links to.
 */
export function FeatureBento() {
  const h = getMessages().home;
  const c = statusCounts();
  const tiles = h.different.cards.slice(0, 6);
  const wide = new Set([0, 5]);

  return (
    <section className="defer [--cis-m:2840px] [--cis-d:1376px] bg-surface py-20 sm:py-28" aria-labelledby="different">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading id="different" eyebrow={h.different.eyebrow} title={h.different.title} lead={h.different.lead} />
        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
          <BigNumber n={allParts.length} label={h.bento.numbers.parts} i={0} tone="bg-deep text-white" className="sm:col-span-2" />
          <BigNumber n={moduleGroups.length} label={h.bento.numbers.groups} i={1} tone="bg-baby-pink text-maroon" />
          <BigNumber n={c.live} label={h.bento.numbers.live} i={2} tone="bg-blush text-maroon ring-1 ring-baby-pink" />
          {tiles.map((tile, i) => {
            const part = mustGetPart(tile.slug);
            return (
              <li key={tile.title} data-reveal style={stagger(i + 3)} className={wide.has(i) ? "lg:col-span-2" : ""}>
                <Link href={partHref(part)} data-glow className="group flex h-full min-h-52 flex-col rounded-3xl bg-blush p-7 ring-1 ring-baby-pink hover:bg-baby-pink/50 hover:shadow-glow">
                  <StatusBadge status={part.status} className="self-start" />
                  <h3 className="mt-5 font-display text-2xl font-extrabold tracking-[-0.03em] group-hover:underline">{tile.title}</h3>
                  <p className="mt-3 flex-1 text-ink-soft">{tile.text}</p>
                  <span className="mt-5 text-sm font-semibold text-red">{h.bento.partLabel.replace("{n}", pad2(part.number))} →</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

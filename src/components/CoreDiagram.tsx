import Link from "next/link";
import { getMessages } from "@/i18n/messages";
import { getCopy, mustGetPart, partHref } from "@/lib/parts";
import { SectionHeading } from "./ui/SectionHeading";
import { StatusBadge } from "./ui/StatusBadge";

/**
 * Parts shown around the workspace: every Live area plus the three shared services that the comparison table talks
 * about. Names and statuses are read from the data, so a status change in os-parts.ts changes this diagram.
 * Order alternates Live and In build around the ring so neighbours differ.
 */
const NODE_SLUGS = [
  "people-directory",
  "rbac-permissions",
  "project-management",
  "approval-engine",
  "time-tracking",
  "audit-system",
  "crm-clients",
  "multi-tenancy",
  "authentication-identity",
  "public-website",
] as const;

/** Ring radii as a percentage of the diagram's width and height (the diagram is 16:10). */
const RX = 41;
const RY = 39;
const ASPECT = 10 / 16;

/**
 * Shared core diagram. Desktop: the company workspace in the centre, the parts on a ring, a line to each,
 * and a small pulse travelling along every line (transform and opacity only). Phones: the hub, then a two-column list.
 */
export function CoreDiagram() {
  const t = getMessages().home.core;
  const nodes = NODE_SLUGS.map((slug, i) => {
    const part = mustGetPart(slug);
    const a = (-90 + (i * 360) / NODE_SLUGS.length) * (Math.PI / 180);
    return { part, x: 50 + RX * Math.cos(a), y: 50 + RY * Math.sin(a) };
  });

  return (
    <section className="defer [--cis-m:940px] [--cis-d:996px] bg-section-pink py-20 sm:py-28" aria-labelledby="core-title">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading id="core-title" eyebrow={t.eyebrow} title={t.title} lead={getMessages().home.different.lead} />
        <div data-reveal data-live="lazy" className="core relative mx-auto mt-14 w-full max-w-5xl md:aspect-[16/10]">
          <svg aria-hidden="true" viewBox={`0 0 100 ${100 * ASPECT}`} preserveAspectRatio="none" className="absolute inset-0 hidden h-full w-full md:block">
            {nodes.map(({ part, x, y }) => (
              <line key={part.slug} x1={50} y1={50 * ASPECT} x2={x} y2={y * ASPECT} vectorEffect="non-scaling-stroke" className="core-line" />
            ))}
          </svg>
          {nodes.map(({ part, x, y }, i) => (
            <i
              key={part.slug}
              aria-hidden="true"
              data-live="lazy"
              className="core-dot hidden md:block"
              style={{ "--dx": (x - 50).toFixed(2), "--dy": ((y - 50) * ASPECT).toFixed(2), "--n": i } as React.CSSProperties}
            />
          ))}

          <Link
            href="/os/os-core-shared-services"
            data-live="lazy"
            className="core-hub grid place-items-center rounded-3xl bg-deep px-6 py-8 text-center text-white shadow-float md:absolute md:z-10 md:left-1/2 md:top-1/2 md:aspect-square md:w-[25%] md:-translate-x-1/2 md:-translate-y-1/2 md:rounded-full md:p-4"
          >
            <span>
              <span className="block font-display text-xl font-extrabold leading-tight tracking-[-0.03em] sm:text-2xl md:text-[clamp(1rem,2.3vw,1.7rem)]">{t.centerTitle}</span>
              <span className="mt-1 block text-sm font-semibold text-mist">{t.centerSub}</span>
            </span>
          </Link>

          <ul className="mt-6 grid grid-cols-2 gap-3 md:mt-0 md:block">
            {nodes.map(({ part, x, y }) => (
              <li
                key={part.slug}
                className="md:absolute md:z-10 md:w-[19%] md:-translate-x-1/2 md:-translate-y-1/2"
                style={{ left: `${x.toFixed(2)}%`, top: `${y.toFixed(2)}%` }}
              >
                <Link
                  href={partHref(part)}
                  data-glow
                  className="flex h-full flex-col items-center gap-1.5 rounded-2xl bg-surface px-2.5 py-3 text-center shadow-soft ring-1 ring-baby-pink hover:shadow-glow"
                >
                  <span className="font-display text-[0.9rem] font-bold leading-tight tracking-[-0.02em] text-maroon md:text-[clamp(0.7rem,1.25vw,0.95rem)]">{getCopy(part).name}</span>
                  <StatusBadge status={part.status} className="!px-2 !py-0.5 !text-[0.65rem]" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <p className="mx-auto mt-10 max-w-2xl text-center text-sm text-ink-soft">{t.caption}</p>
      </div>
    </section>
  );
}

import Link from "next/link";
import { FOUNDER } from "@/content/team";
import { getMessages } from "@/i18n/messages";
import { allParts, getCopy, partHref } from "@/lib/parts";
import { SectionHeading } from "./ui/SectionHeading";

/**
 * "Back NAVICORE ONE": facts only. What exists and what is later are read from the status label of each part;
 * only the founder is named (src/content/team.ts). No customers, numbers, prices or traction are shown.
 */
export function SponsorSection() {
  const m = getMessages();
  const t = m.home.sponsor;
  const live = allParts.filter((p) => p.status === "live");
  const later = allParts.filter((p) => p.status === "future");

  return (
    <section className="defer [--cis-m:1240px] [--cis-d:676px] bg-section-soft py-20 sm:py-28" aria-labelledby="sponsor">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div data-reveal>
          <SectionHeading id="sponsor" eyebrow={t.eyebrow} title={t.title} lead={t.lead} />
        </div>

        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          <article data-reveal data-glow style={{ "--i": 0 } as React.CSSProperties} className="rounded-3xl bg-surface p-7 shadow-soft ring-1 ring-baby-pink">
            <h3 className="font-display text-xl font-semibold">{t.existsTitle}</h3>
            <p className="mt-2 text-sm text-ink-soft">{t.existsText}</p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {live.map((p) => (
                <li key={p.slug}>
                  <Link href={partHref(p)} className="inline-block rounded-full bg-blush px-3 py-1.5 text-sm font-semibold text-maroon ring-1 ring-baby-pink hover:bg-baby-pink">
                    {getCopy(p).name}
                  </Link>
                </li>
              ))}
            </ul>
          </article>

          <article data-reveal data-glow style={{ "--i": 1 } as React.CSSProperties} className="rounded-3xl bg-surface p-7 shadow-soft ring-1 ring-baby-pink">
            <h3 className="font-display text-xl font-semibold">{t.plannedTitle}</h3>
            <p className="mt-2 text-sm text-ink-soft">{t.plannedText}</p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {later.map((p) => (
                <li key={p.slug}>
                  <Link href={partHref(p)} className="inline-block rounded-full bg-surface px-3 py-1.5 text-sm font-semibold text-maroon ring-1 ring-maroon/40 hover:bg-baby-pink">
                    {getCopy(p).name}
                  </Link>
                </li>
              ))}
            </ul>
          </article>

          <article data-reveal data-glow style={{ "--i": 2 } as React.CSSProperties} className="rounded-3xl bg-surface p-7 shadow-soft ring-1 ring-baby-pink">
            <h3 className="font-display text-xl font-semibold">{t.teamTitle}</h3>
            <div className="mt-4">
              <p className="font-display text-lg font-semibold text-maroon">{FOUNDER.name}</p>
              <p className="text-sm text-ink-soft">{FOUNDER.role}</p>
            </div>
          </article>
        </div>

        <div data-reveal className="mt-10 flex flex-wrap items-center gap-4">
          <Link href="/contact?intent=sponsor" className="btn btn-red">{t.cta}</Link>
          <Link href="/os" className="btn btn-outline">{t.ctaSecondary}</Link>
          <p className="text-sm text-ink-soft">{t.ctaNote}</p>
        </div>
      </div>
    </section>
  );
}

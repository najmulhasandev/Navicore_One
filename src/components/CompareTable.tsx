import Link from "next/link";
import { getMessages } from "@/i18n/messages";
import { mustGetPart, pad2, partHref } from "@/lib/parts";
import { SectionHeading } from "./ui/SectionHeading";
import { StatusBadge } from "./ui/StatusBadge";

/**
 * "Separate tools vs NAVICORE ONE". Rows come from the existing copy: the first column repeats the problem statements,
 * the NAVICORE ONE column repeats the "what makes it different" cards, and every row carries the real status badge of
 * the part it describes. No competitor is named. A real table on desktop; on phones each row becomes a stacked card.
 */
export function CompareTable() {
  const h = getMessages().home;
  const t = h.compare;
  const rows = t.rows.map((r) => {
    const part = mustGetPart(r.slug);
    const card = h.different.cards.find((c) => c.slug === r.slug);
    if (!card) throw new Error(`Comparison row "${r.topic}": no "what makes it different" card for ${r.slug}`);
    return { ...r, part, one: card.text };
  });

  return (
    <section className="defer [--cis-m:2140px] [--cis-d:926px] bg-blush py-20 sm:py-28" aria-labelledby="compare-title">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading id="compare-title" eyebrow={t.eyebrow} title={t.title} lead={t.lead} />
        <div data-reveal className="mt-12 overflow-hidden rounded-[2rem] bg-white shadow-soft ring-1 ring-baby-pink">
          <table className="compare w-full text-left">
            <caption className="sr-only">{t.title}</caption>
            <thead>
              <tr>
                <th scope="col">{t.cols.topic}</th>
                <th scope="col">{t.cols.separate}</th>
                <th scope="col" className="compare-one">{t.cols.one}</th>
                <th scope="col">{t.cols.status}</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.slug}>
                  <th scope="row">{r.topic}</th>
                  <td data-label={t.cols.separate}>
                    <span aria-hidden="true" className="compare-mark text-ink-soft">–</span>
                    {r.separate}
                  </td>
                  <td data-label={t.cols.one} className="compare-one">
                    <span aria-hidden="true" className="compare-mark text-maroon">✓</span>
                    {r.one}{" "}
                    <Link href={partHref(r.part)} className="whitespace-nowrap font-semibold text-red underline-offset-4 hover:underline">
                      {h.bento.partLabel.replace("{n}", pad2(r.part.number))} →
                    </Link>
                  </td>
                  <td data-label={t.cols.status}>
                    <StatusBadge status={r.part.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-5 text-sm text-ink-soft">{t.note}</p>
      </div>
    </section>
  );
}

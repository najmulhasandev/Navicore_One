import Link from "next/link";
import { SHOW_TODOS } from "@/content/site";
import { getMessages } from "@/i18n/messages";
import { allParts, getCopy, mustGetPart, statusCounts } from "@/lib/parts";
import { SectionHeading } from "./ui/SectionHeading";
import { TodoNotes } from "./ui/TodoNotes";

/**
 * Six questions, answered only from the product data. Figures and names are computed (status labels, part names);
 * where the data has no answer, the neutral "not published" text is shown and a TODO marker is kept for the founder
 * (visible in development only, and listed in FOUNDER-CHECKLIST.md).
 */
export function HomeFaq() {
  const m = getMessages();
  const t = m.home.faq;
  const c = statusCounts();
  const live = allParts.filter((p) => p.status === "live").map((p) => getCopy(p).name);
  const iso = mustGetPart("multi-tenancy");

  const fill = (s: string) =>
    s
      .replace("{live}", String(c.live))
      .replace("{liveNames}", live.join(", "))
      .replace("{building}", String(c.building))
      .replace("{planned}", String(c.planned))
      .replace("{future}", String(c.future))
      .replace("{isolationName}", getCopy(iso).name)
      .replace("{isolationStatus}", m.status[iso.status].label);

  const todos = t.items.flatMap((i) => ("todo" in i ? [i.todo] : []));

  return (
    <section className="defer [--cis-m:640px] [--cis-d:476px] bg-white py-20 sm:py-28" aria-labelledby="faq-title">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[0.8fr_1.2fr]">
        <SectionHeading id="faq-title" eyebrow={t.eyebrow} title={t.title} />
        <div>
          <ul className="divide-y divide-baby-pink rounded-3xl bg-blush ring-1 ring-baby-pink">
            {t.items.map((item, i) => (
              <li key={item.id} data-reveal style={{ "--i": i } as React.CSSProperties}>
                <details className="faq group px-6 py-5 sm:px-8">
                  <summary className="flex items-center justify-between gap-6 font-display text-lg font-bold tracking-[-0.02em] text-maroon sm:text-xl">
                    {item.q}
                    <span aria-hidden="true" className="faq-icon grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white text-xl leading-none text-maroon ring-1 ring-baby-pink">+</span>
                  </summary>
                  <div className="mt-3 max-w-2xl text-ink-soft">
                    <p>{fill(item.a)}</p>
                    {item.id === "pricing" || item.id === "demo" ? (
                      <p className="mt-3">
                        <Link href="/contact?intent=demo" className="font-semibold text-red underline underline-offset-4 hover:text-maroon">{m.nav.bookDemo} →</Link>
                      </p>
                    ) : null}
                  </div>
                </details>
              </li>
            ))}
          </ul>
          {SHOW_TODOS ? <div className="mt-6"><TodoNotes todos={todos} /></div> : null}
        </div>
      </div>
    </section>
  );
}

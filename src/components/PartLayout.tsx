import Link from "next/link";
import type { OsPart } from "@/content/types";
import { SITE } from "@/content/site";
import { groupById } from "@/content/module-groups";
import { getMessages } from "@/i18n/messages";
import { getCopy, neighbors, pad2, partHref, relatedParts } from "@/lib/parts";
import { DeviceFrame } from "./mock/DeviceFrame";
import { ScreenMock } from "./mock/ScreenMock";
import { FlowDiagram } from "./FlowDiagram";
import { FloatingCard } from "./FloatingCard";
import { Sidebar } from "./Sidebar";
import { PartCard } from "./ui/PartCard";
import { StatusBadge } from "./ui/StatusBadge";
import { TodoNotes } from "./ui/TodoNotes";

const H2 = ({ children, id }: { children: React.ReactNode; id?: string }) => (
  <h2 id={id} className="font-display text-3xl font-semibold sm:text-4xl">{children}</h2>
);

/** The template for all 52 part pages. Structure is shared; every word of content comes from os-parts.ts. */
export function PartLayout({ part }: { part: OsPart }) {
  const m = getMessages();
  const c = getCopy(part);
  const group = groupById(part.group);
  const { prev, next } = neighbors(part);
  const related = relatedParts(part);
  const labels = c.functions.map((f) => f.name);
  const scopeCount = part.scope.reduce((n, g) => n + g.items.length, 0);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:grid lg:grid-cols-[17rem_minmax(0,1fr)] lg:gap-12 lg:py-12">
      <aside className="mb-8 lg:sticky lg:top-24 lg:mb-0 lg:max-h-[calc(100vh-7rem)] lg:self-start lg:overflow-y-auto lg:pr-2">
        <Sidebar key={part.slug} active={part} />
      </aside>

      <article className="min-w-0">
        <nav aria-label="Breadcrumb" className="text-sm text-ink-soft">
          <ol className="flex flex-wrap items-center gap-x-2">
            <li><Link href="/" className="hover:text-maroon hover:underline">{m.part.breadcrumbHome}</Link></li>
            <li aria-hidden="true">/</li>
            <li><Link href="/os" className="hover:text-maroon hover:underline">{m.part.breadcrumbProduct}</Link></li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="font-medium text-maroon">{c.name}</li>
          </ol>
        </nav>

        {/* 1 + 7: H1 with outcome, and the floating screen mockup */}
        <header className="mt-8 grid items-center gap-12 xl:grid-cols-[1.05fr_0.95fr]">
          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.14em] text-red">
              {SITE.fullName} · {m.part.part} {pad2(part.number)} · {group.name}
            </p>
            <h1 className="font-display text-4xl font-semibold sm:text-5xl lg:text-6xl">{c.name}</h1>
            <p className="mt-5 max-w-xl text-xl leading-relaxed text-ink sm:text-2xl">{c.outcome}</p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <StatusBadge status={part.status} />
              {c.statusNote ? <span className="text-sm text-ink-soft">{c.statusNote}</span> : null}
            </div>
            <p className="mt-3 max-w-xl text-sm text-ink-soft">{m.statusLegend.scopeNote}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/contact?intent=demo" className="btn btn-red">{m.nav.bookDemo}</Link>
              <Link href="/partners" className="btn btn-outline">{m.nav.becomePartner}</Link>
            </div>
          </div>
          <div className="relative pb-8">
            <DeviceFrame variant="window" title={c.name}>
              <ScreenMock kind={part.screen} labels={labels} title={c.name} status={part.status} group={part.group} />
            </DeviceFrame>
            {labels[0] ? (
              <FloatingCard className="absolute -left-4 top-10 hidden sm:block" depth={0.45} delay={0.4} rot={-3} cardClassName="px-4 py-2.5 text-sm font-semibold text-maroon">
                {labels[0]}
              </FloatingCard>
            ) : null}
            {labels[1] ? (
              <FloatingCard className="absolute -right-3 bottom-2 hidden sm:block" depth={0.2} delay={1.2} duration={8} rot={2} cardClassName="px-4 py-2.5 text-sm font-semibold text-maroon">
                {labels[1]}
              </FloatingCard>
            ) : null}
            <p className="mt-4 text-center text-xs text-ink-soft">{m.part.screenCaption}</p>
          </div>
        </header>

        {/* 2: what it is */}
        <section className="mt-20" aria-labelledby="what">
          <H2 id="what">{m.part.whatItIs}</H2>
          <p className="mt-4 max-w-3xl text-lg leading-relaxed">{c.whatItIs}</p>
        </section>

        {/* problem -> what NAVICORE ONE does -> result */}
        <section className="mt-16" aria-label={m.part.problemTitle}>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-3xl bg-white p-6 shadow-soft ring-1 ring-baby-pink">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-ink-soft">{m.part.problem}</p>
              <p className="mt-3 leading-relaxed">{c.problem}</p>
            </div>
            <div className="rounded-3xl bg-maroon p-6 text-white shadow-soft">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-baby-pink">{m.part.does}</p>
              <p className="mt-3 leading-relaxed">{c.does}</p>
            </div>
            <div className="rounded-3xl bg-baby-pink p-6 shadow-soft">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-maroon">{m.part.result}</p>
              <p className="mt-3 font-medium leading-relaxed text-maroon">{c.result}</p>
            </div>
          </div>
        </section>

        {/* 3: who uses it and when */}
        <section className="mt-20" aria-labelledby="who">
          <H2 id="who">{m.part.whoWhen}</H2>
          <dl className="mt-6 grid gap-4 sm:grid-cols-2">
            {c.whoWhen.map((w) => (
              <div key={w.who} className="rounded-2xl bg-white p-5 ring-1 ring-baby-pink">
                <dt className="font-display text-lg font-semibold text-maroon">{w.who}</dt>
                <dd className="mt-1 text-ink-soft">{w.when}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* 4: step-by-step process as flow diagram(s) */}
        <section className="mt-20" aria-labelledby="how">
          <H2 id="how">{m.part.howItWorks}</H2>
          <div className="mt-6 space-y-6">
            {part.flows.map((f) => (
              <FlowDiagram key={f.title} flow={f} />
            ))}
          </div>
        </section>

        {/* 5: key functions */}
        <section className="mt-20" aria-labelledby="functions">
          <H2 id="functions">{m.part.keyFunctions}</H2>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2">
            {c.functions.map((f) => (
              <li key={f.name} className="rounded-2xl bg-white p-5 shadow-soft ring-1 ring-baby-pink">
                <h3 className="font-display text-lg font-semibold text-maroon">{f.name}</h3>
                <p className="mt-1.5 leading-relaxed text-ink-soft">{f.line}</p>
              </li>
            ))}
          </ul>

          {part.scope.length > 0 ? (
            <details className="mt-6 rounded-2xl bg-white p-5 ring-1 ring-baby-pink">
              <summary className="font-semibold text-maroon">
                {m.part.scopeSummary} ({scopeCount} {m.part.scopeItems})
              </summary>
              <div className="mt-5 space-y-6">
                {part.scope.map((g, gi) => (
                  <div key={`${g.label}-${gi}`}>
                    {g.label || g.kind !== "scope" ? (
                      <h3 className="mb-2 text-sm font-bold uppercase tracking-wide text-ink-soft">
                        {g.kind === "future" ? `${m.part.scopeFuture}: ` : ""}
                        {g.label ?? ""}
                      </h3>
                    ) : null}
                    <ul className="flex flex-wrap gap-2">
                      {g.items.map((it) => (
                        <li key={it} className={`rounded-full px-3 py-1 text-sm ${g.kind === "limits" ? "bg-blush text-ink-soft ring-1 ring-rose line-through decoration-maroon/50" : "bg-baby-pink text-maroon"}`}>
                          {it}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </details>
          ) : null}
        </section>

        {/* 6: how it connects */}
        <section className="mt-20" aria-labelledby="connects">
          <H2 id="connects">{m.part.connects}</H2>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {related.map((r) => (
              <li key={r.slug}><PartCard part={r} /></li>
            ))}
          </ul>
        </section>

        {/* 8: CTA */}
        <section className="mt-20 overflow-hidden rounded-[2rem] bg-maroon p-8 text-white sm:p-12" aria-labelledby="cta">
          <h2 id="cta" className="font-display text-3xl font-semibold !text-white sm:text-4xl">{m.part.cta}</h2>
          <p className="mt-3 max-w-xl text-lg text-baby-pink">{m.part.ctaText}</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="/contact?intent=demo" className="btn btn-light">{m.nav.bookDemo}</Link>
            <Link href="/partners" className="btn btn-on-maroon">{m.nav.becomePartner}</Link>
          </div>
        </section>

        <div className="mt-8"><TodoNotes todos={part.todos} /></div>

        {/* 9: previous / next */}
        <nav aria-label="Part navigation" className="mt-12 grid gap-4 sm:grid-cols-2">
          {prev ? (
            <Link href={partHref(prev)} rel="prev" className="rounded-2xl bg-white p-5 ring-1 ring-baby-pink transition hover:shadow-glow">
              <span className="text-xs font-bold uppercase tracking-wide text-ink-soft">← {m.part.prev}</span>
              <span className="mt-1 block font-display text-lg font-semibold text-maroon">{pad2(prev.number)} · {getCopy(prev).name}</span>
            </Link>
          ) : <span />}
          {next ? (
            <Link href={partHref(next)} rel="next" className="rounded-2xl bg-white p-5 text-right ring-1 ring-baby-pink transition hover:shadow-glow sm:col-start-2">
              <span className="text-xs font-bold uppercase tracking-wide text-ink-soft">{m.part.next} →</span>
              <span className="mt-1 block font-display text-lg font-semibold text-maroon">{pad2(next.number)} · {getCopy(next).name}</span>
            </Link>
          ) : null}
        </nav>
      </article>
    </div>
  );
}

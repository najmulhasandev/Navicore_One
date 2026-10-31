import Link from "next/link";
import { SHOW_TODOS, SITE } from "@/content/site";
import { getMessages } from "@/i18n/messages";
import { mustGetPart, partHref, pad2 } from "@/lib/parts";
import { pageMetadata } from "@/lib/seo";
import { ContactForm } from "@/components/ContactForm";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { TodoNotes } from "@/components/ui/TodoNotes";

/**
 * The product specification says nothing about a partner programme, so this page states no terms, benefits or
 * eligibility. It shows neutral text plus the product facts that exist, and (in development) the open questions.
 * It stays noindex until the founder supplies the programme details.
 */
export const metadata = pageMetadata({
  title: "Become a partner",
  description: `Tell us how you would like to work with ${SITE.fullName}. Partner details are not published yet.`,
  path: "/partners",
  noindex: true,
});

export default function PartnersPage() {
  const m = getMessages();
  const p = m.partners;
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
      <SectionHeading as="h1" eyebrow={`${p.eyebrow} · ${SITE.fullName}`} title={p.title} lead={p.lead} />

      <div className="mt-12 grid gap-5 md:grid-cols-2">
        <section aria-labelledby="who" className="rounded-3xl bg-white p-7 shadow-soft ring-1 ring-baby-pink">
          <h2 id="who" className="font-display text-2xl font-semibold">{p.who.heading}</h2>
          <p className="mt-3 text-ink-soft">{p.who.fallback}</p>
        </section>
        <section aria-labelledby="gets" className="rounded-3xl bg-white p-7 shadow-soft ring-1 ring-baby-pink">
          <h2 id="gets" className="font-display text-2xl font-semibold">{p.gets.heading}</h2>
          <p className="mt-3 text-ink-soft">{p.gets.fallback}</p>
        </section>
      </div>

      <section aria-labelledby="apply" className="mt-12">
        <h2 id="apply" className="font-display text-3xl font-semibold">{p.apply.heading}</h2>
        <ol className="mt-6 grid gap-4 sm:grid-cols-2">
          {p.apply.steps.map((s, i) => (
            <li key={s.title} className="rounded-2xl bg-blush p-5 ring-1 ring-baby-pink">
              <span className="mb-2 flex h-7 w-7 items-center justify-center rounded-full bg-maroon text-xs font-bold text-white">{i + 1}</span>
              <h3 className="font-semibold text-maroon">{s.title}</h3>
              <p className="mt-1 text-ink-soft">{s.text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="blocks" className="mt-16">
        <h2 id="blocks" className="font-display text-3xl font-semibold">{p.blocks.heading}</h2>
        <p className="mt-3 max-w-2xl text-ink-soft">{p.blocks.lead}</p>
        <ul className="mt-6 grid gap-4 sm:grid-cols-2">
          {p.blocks.items.map((it) => {
            const part = mustGetPart(it.slug);
            return (
              <li key={it.slug}>
                <Link href={partHref(part)} className="group block h-full rounded-2xl bg-white p-5 shadow-soft ring-1 ring-baby-pink transition hover:shadow-glow">
                  <h3 className="font-display text-lg font-semibold group-hover:underline">{it.title}</h3>
                  <p className="mt-1 text-[0.95rem] text-ink-soft">{it.text}</p>
                  <span className="mt-3 block text-sm font-semibold text-red">Part {pad2(part.number)} →</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      <section aria-labelledby="form" className="mt-16 scroll-mt-24">
        <h2 id="form" className="mb-6 font-display text-3xl font-semibold">{p.formTitle}</h2>
        <ContactForm t={m.form} defaultIntent="partner" />
      </section>

      {SHOW_TODOS ? (
        <div className="mt-10">
          <TodoNotes todos={[p.who.todo, p.gets.todo, p.apply.todo]} />
        </div>
      ) : null}
    </div>
  );
}

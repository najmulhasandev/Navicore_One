import { SHOW_TODOS, SITE } from "@/content/site";
import { getMessages } from "@/i18n/messages";
import { pageMetadata } from "@/lib/seo";
import { ContactForm } from "@/components/ContactForm";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { TodoNotes } from "@/components/ui/TodoNotes";

export const metadata = pageMetadata({
  title: "Book a demo or contact us",
  description: `Ask for a demo of ${SITE.fullName}, ask a question, or tell us how you would like to partner.`,
  path: "/contact",
});

export default function ContactPage() {
  const m = getMessages();
  const c = m.contact;
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
      <SectionHeading as="h1" eyebrow={`${c.eyebrow} · ${SITE.fullName}`} title={c.title} lead={c.lead} />

      <div className="mt-12 grid items-start gap-8 lg:grid-cols-[1fr_20rem]">
        <ContactForm t={m.form} defaultIntent="demo" />
        <aside className="space-y-5">
          <div className="rounded-3xl bg-baby-pink p-6">
            <h2 className="font-display text-xl font-semibold">{c.pricingTitle}</h2>
            <p className="mt-2 text-maroon">{c.pricingText}</p>
          </div>
          <div className="rounded-3xl bg-white p-6 ring-1 ring-baby-pink">
            <p className="text-ink-soft">{c.demoNote}</p>
          </div>
          {SHOW_TODOS ? <TodoNotes todos={[c.todoDemo, c.todoEmail]} /> : null}
        </aside>
      </div>
    </div>
  );
}

import { SHOW_TODOS, SITE } from "@/content/site";
import { getMessages } from "@/i18n/messages";
import { pageMetadata } from "@/lib/seo";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { TodoNotes } from "@/components/ui/TodoNotes";

/** noindex until the founder has had this page reviewed (legal review is not something the build can supply). */
export const metadata = pageMetadata({
  title: "Privacy",
  description: `What the ${SITE.fullName} website collects, in plain words: the contact form, spam protection and hosting.`,
  path: "/privacy",
  noindex: true,
});

export default function PrivacyPage() {
  const m = getMessages();
  const p = m.privacy;
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <SectionHeading as="h1" eyebrow={SITE.fullName} title={p.title} lead={p.lead} />
      <div className="mt-10 space-y-8">
        {p.sections.map((s) => (
          <section key={s.title}>
            <h2 className="font-display text-2xl font-semibold">{s.title}</h2>
            <p className="mt-2 text-lg">{s.text}</p>
          </section>
        ))}
      </div>
      {SHOW_TODOS ? (
        <div className="mt-12 space-y-4">
          <p className="rounded-2xl bg-baby-pink p-4 text-maroon">{p.reviewNote}</p>
          <TodoNotes todos={p.todos} />
        </div>
      ) : null}
    </div>
  );
}

import Link from "next/link";
import { groupSlugAnchor } from "@/content/messages";
import { SITE } from "@/content/site";
import { getMessages } from "@/i18n/messages";
import { groupsWithParts } from "@/lib/parts";
import { pageMetadata } from "@/lib/seo";
import { Icon3D } from "@/components/Icon3D";
import { PartCard } from "@/components/ui/PartCard";
import { SectionHeading } from "@/components/ui/SectionHeading";

export const metadata = pageMetadata({
  title: "All 52 parts",
  description: `Browse all 52 parts of ${SITE.fullName}, from isolated company workspaces to the shared core. Each part has its own page.`,
  path: "/os",
});

export default function ProductOverviewPage() {
  const m = getMessages();
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
      <SectionHeading as="h1" eyebrow={`${SITE.fullName}`} title={m.os.title} lead={m.os.lead} />

      <nav aria-label="Groups" className="mt-10 flex flex-wrap gap-2">
        {groupsWithParts.map(({ group, parts }) => (
          <Link key={group.id} href={`#${groupSlugAnchor(group.id)}`} className="rounded-full bg-surface px-4 py-2 text-sm font-semibold text-maroon ring-1 ring-baby-pink hover:bg-baby-pink">
            {group.name} <span className="text-ink-soft">({parts.length})</span>
          </Link>
        ))}
      </nav>

      <div className="mt-16 space-y-20">
        {groupsWithParts.map(({ group, parts }) => (
          <section key={group.id} id={groupSlugAnchor(group.id)} aria-labelledby={`h-${group.id}`} className="scroll-mt-24">
            <div className="flex items-center gap-5">
              <Icon3D group={group.id} size={80} className="h-20 w-20 shrink-0" />
              <div>
                <h2 id={`h-${group.id}`} className="font-display text-3xl font-semibold">{group.name}</h2>
                <p className="mt-1 text-ink-soft">{group.summary} · {parts.length} {m.os.counts}</p>
              </div>
            </div>
            <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {parts.map((p) => (
                <li key={p.slug}><PartCard part={p} /></li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}

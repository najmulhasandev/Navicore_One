import Link from "next/link";
import type { OsPart } from "@/content/types";
import { getCopy, groupsWithParts, pad2, partHref } from "@/lib/parts";
import { getMessages } from "@/i18n/messages";

/**
 * All 52 parts, grouped by module. Server-rendered with native <details>, so it needs no JavaScript.
 * On phones it collapses into one "Browse all 52 parts" disclosure; on large screens it is a sticky list.
 */
export function Sidebar({ active }: { active?: OsPart }) {
  const m = getMessages();

  const list = (
    <nav aria-label={m.part.sidebarTitle} className="space-y-1">
      {groupsWithParts.map(({ group, parts }) => (
        <details key={group.id} open={active?.group === group.id} className="rounded-xl">
          <summary className="flex items-center justify-between gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-maroon hover:bg-baby-pink/60">
            <span>{group.name}</span>
            <span className="rounded-full bg-baby-pink px-2 text-xs font-medium text-maroon">{parts.length}</span>
          </summary>
          <ul className="ml-3 border-l border-baby-pink py-1">
            {parts.map((p) => {
              const here = p.slug === active?.slug;
              return (
                <li key={p.slug}>
                  <Link
                    href={partHref(p)}
                    aria-current={here ? "page" : undefined}
                    className={`block rounded-lg py-1.5 pl-3 pr-2 text-sm leading-snug hover:bg-baby-pink/50 ${
                      here ? "bg-baby-pink font-semibold text-maroon" : "text-ink-soft hover:text-maroon"
                    }`}
                  >
                    <span className="mr-1.5 font-display text-xs text-red">{pad2(p.number)}</span>
                    {getCopy(p).name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </details>
      ))}
    </nav>
  );

  return (
    <>
      <details className="rounded-2xl bg-white p-3 shadow-soft ring-1 ring-baby-pink lg:hidden">
        <summary className="px-1 py-1 text-sm font-semibold text-maroon">{m.part.browse}</summary>
        <div className="mt-3">{list}</div>
      </details>
      <div className="hidden lg:block">{list}</div>
    </>
  );
}

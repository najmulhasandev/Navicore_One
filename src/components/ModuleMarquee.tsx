import Link from "next/link";
import { groupSlugAnchor } from "@/content/messages";
import { moduleGroups } from "@/content/module-groups";
import { getMessages } from "@/i18n/messages";
import { Icon3D } from "./Icon3D";

const pill =
  "marquee-pill inline-flex items-center gap-3 rounded-full bg-white py-2 pl-2 pr-5 text-[0.95rem] font-semibold text-maroon shadow-soft ring-1 ring-baby-pink";

/**
 * A looping row of the 13 module groups with their 3D icons (pauses on hover or focus, and whenever it is off-screen).
 * Full motion: one endless row (the second set is a visual clone, hidden from assistive technology).
 * Reduced motion / no script: a still, wrapped row of the first set only.
 */
export function ModuleMarquee() {
  const m = getMessages();
  return (
    <div className="marquee" data-live="lazy" role="region" aria-label={m.home.marquee.label}>
      <div className="marquee-track">
        <ul className="marquee-set">
          {moduleGroups.map((g) => (
            <li key={g.id}>
              <Link href={`/os#${groupSlugAnchor(g.id)}`} className={`${pill} transition-colors hover:bg-baby-pink`}>
                <Icon3D group={g.id} size={44} className="h-11 w-11 shrink-0" />
                {g.name}
              </Link>
            </li>
          ))}
        </ul>
        <ul className="marquee-set marquee-clone" aria-hidden="true">
          {moduleGroups.map((g) => (
            <li key={g.id}>
              <span className={pill}>
                <Icon3D group={g.id} size={44} className="h-11 w-11 shrink-0" />
                {g.name}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

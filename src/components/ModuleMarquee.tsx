import Link from "next/link";
import { groupSlugAnchor } from "@/content/messages";
import { moduleGroups } from "@/content/module-groups";
import { getMessages } from "@/i18n/messages";
import { allParts, statusCounts } from "@/lib/parts";
import { Icon3D } from "./Icon3D";
import { StatusDot } from "./ui/StatusDot";

const pill =
  "marquee-pill inline-flex items-center gap-3 rounded-full bg-surface py-2 pl-2 pr-5 text-[0.95rem] font-semibold text-maroon shadow-soft ring-1 ring-baby-pink";
const factPill =
  "inline-flex h-[3.25rem] items-center gap-2.5 rounded-full bg-deep px-5 text-[0.95rem] font-semibold text-white";

/**
 * A looping row: product facts (computed from the data) followed by the module groups with their 3D icons.
 * Pauses on hover or focus, and whenever it is off-screen.
 * Full motion: one endless row (the second set is a visual clone, hidden from assistive technology).
 * Reduced motion / no script: a still, wrapped row of the first set only.
 */
export function ModuleMarquee() {
  const m = getMessages();
  const f = m.home.marquee.facts;
  const c = statusCounts();
  const facts = [
    f.parts.replace("{n}", String(allParts.length)),
    f.groups.replace("{n}", String(moduleGroups.length)),
    f.live.replace("{n}", String(c.live)),
    f.building.replace("{n}", String(c.building)),
  ];
  return (
    <div className="marquee" data-live="lazy" role="region" aria-label={m.home.marquee.label}>
      <div className="marquee-track">
        <ul className="marquee-set">
          {facts.map((t) => (
            <li key={t}>
              <span className={factPill}>
                <span className="text-mist"><StatusDot status="live" /></span>
                {t}
              </span>
            </li>
          ))}
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
          {facts.map((t) => (
            <li key={t}>
              <span className={factPill}>
                <span className="text-mist"><StatusDot status="live" /></span>
                {t}
              </span>
            </li>
          ))}
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

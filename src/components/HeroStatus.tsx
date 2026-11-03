import { moduleGroups } from "@/content/module-groups";
import { getMessages } from "@/i18n/messages";
import { allParts, statusCounts } from "@/lib/parts";
import { StatusDot } from "./ui/StatusDot";

/**
 * Store-style trust chips under the hero buttons. Every figure is computed from the data
 * (the status label on each part, the part list and the module groups); nothing is typed in.
 */
export function HeroStatus() {
  const h = getMessages().home.hero;
  const c = statusCounts();
  const chips = [
    { key: "live", n: c.live, text: h.chips.live, dot: <StatusDot status="live" /> },
    { key: "building", n: c.building, text: h.chips.building, dot: <StatusDot status="building" /> },
    { key: "parts", n: allParts.length, text: h.chips.parts, dot: <StatusDot status="foundation" /> },
    { key: "groups", n: moduleGroups.length, text: h.chips.groups, dot: <i aria-hidden="true" className="inline-block h-2.5 w-2.5 rounded-[3px] bg-current" /> },
  ];
  return (
    <ul aria-label={h.chipsLabel} className="mt-10 flex flex-wrap justify-center gap-2.5">
      {chips.map((chip) => (
        <li key={chip.key}>
          <a
            href="#build-status"
            className="inline-flex items-center gap-2.5 rounded-full bg-white/10 py-2 pl-3.5 pr-4 text-sm font-semibold text-white ring-1 ring-white/30 backdrop-blur-sm transition-colors hover:bg-white/20"
          >
            <span className="text-baby-pink">{chip.dot}</span>
            {chip.text.replace("{n}", String(chip.n))}
          </a>
        </li>
      ))}
    </ul>
  );
}

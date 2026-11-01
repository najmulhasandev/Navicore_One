import { getMessages } from "@/i18n/messages";
import { statusCounts } from "@/lib/parts";
import type { PartStatus } from "@/content/types";

const SHOWN: readonly PartStatus[] = ["live", "building", "planned", "future"];

/** Four counts under the hero buttons, computed from the status label of every part. Links to the full strip. */
export function HeroStatus() {
  const m = getMessages();
  const counts = statusCounts();
  return (
    <div className="mt-7">
      <p className="text-sm font-semibold text-maroon">{m.home.hero.statusLabel}</p>
      <ul className="mt-3 flex flex-wrap gap-2">
        {SHOWN.map((s) => (
          <li key={s}>
            <a
              href="#build-status"
              className="inline-flex items-baseline gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-maroon ring-1 ring-rose transition-colors hover:bg-baby-pink"
            >
              <span className="font-display text-lg leading-none">{counts[s]}</span>
              {m.status[s].label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

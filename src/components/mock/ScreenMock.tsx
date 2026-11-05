import type { PartStatus, ScreenKind } from "@/content/types";
import { moduleGroups } from "@/content/module-groups";
import { getMessages } from "@/i18n/messages";
import { Calendar, Cards, Chat, Dashboard, Docs, Flow, Form, Kanban, Search, Settings, Table, Tree, type LFn } from "./screens";
import { Phone } from "./Phone";
import { Avatar, Bell, Magnifier, StatusChip } from "./ui";

/**
 * Illustrative NAVICORE ONE screens, drawn in CSS: the app shell (official logo, module navigation, search,
 * notifications, workspace) around a working layout that shows a little activity. Not screenshots, and free of
 * people, customers and figures: every label is a function or group name from the guide, everything else is a
 * neutral shape. The status chip shows the part's real status. Sizes use container units (cqw) so the same layout
 * fits a hero laptop, a wall tile or a window. The screen is decorative and hidden from assistive technology.
 * The whole screen is one "data-live" block: its animations run only while it is on screen (docs/MOTION.md).
 */
interface Props {
  kind: ScreenKind;
  /** Real function names from the guide. */
  labels: readonly string[];
  title?: string;
  /** Phone-width mobile layout instead of the desktop shell. */
  compact?: boolean;
  /** The part's real status, shown as a chip in the screen header. */
  status?: PartStatus;
  /** The part's module group, highlighted in the navigation. */
  group?: string;
  /** Draw the "Illustrative screen" label in the header (frames without their own label). */
  tag?: boolean;
}

const NAV_COUNT = 6;

function navGroups(active?: string) {
  const list = moduleGroups.slice(0, NAV_COUNT);
  const hit = moduleGroups.find((g) => g.id === active);
  if (hit && !list.includes(hit)) list[NAV_COUNT - 1] = hit;
  return list;
}

export function ScreenMock({ kind, labels, title, compact = false, status, group, tag = false }: Props) {
  const m = getMessages();
  const L: LFn = (i) => (labels.length ? (labels[i % labels.length] ?? "") : "");
  if (compact) return <Phone L={L} title={title} />;

  return (
    <div aria-hidden="true" data-live="lazy" className="@container relative flex h-full w-full overflow-hidden bg-white text-left text-ink">
      <aside className="flex w-[20%] shrink-0 flex-col gap-[0.5cqw] border-r border-baby-pink bg-blush p-[1.3cqw]">
        {/* eslint-disable-next-line @next/next/no-img-element -- official brand-kit logo, tiny and decorative */}
        <img src="/brand/logo-light.svg" alt="" width={1314} height={481} loading="lazy" decoding="async" draggable={false} className="mb-[1.2cqw] h-[4.4cqw] w-auto self-start" />
        {navGroups(group).map((g) => {
          const on = g.id === group;
          return (
            <div key={g.id} className={`flex items-center gap-[0.7cqw] rounded-[0.7cqw] px-[0.7cqw] py-[0.75cqw] ${on ? "bg-white font-semibold text-maroon shadow-[0_0_0_1px_var(--color-baby-pink)]" : "text-ink-soft"}`}>
              <i className={`block h-[1.5cqw] w-[1.5cqw] shrink-0 rounded-[0.4cqw] ${on ? "bg-red" : "bg-rose"}`} />
              <span className="min-w-0 truncate text-[1.4cqw] leading-tight">{g.name}</span>
            </div>
          );
        })}
        <div className="mt-auto flex items-center gap-[0.8cqw] rounded-[0.8cqw] bg-white p-[0.9cqw] ring-1 ring-baby-pink">
          <Avatar size="2.6cqw" tone={1} />
          <span className="min-w-0 truncate text-[1.4cqw] leading-tight text-ink-soft">{m.screen.workspace}</span>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center gap-[1.4cqw] border-b border-baby-pink px-[2cqw] py-[1.2cqw]">
          <span className="flex w-[46%] items-center gap-[0.9cqw] rounded-full bg-blush px-[1.4cqw] py-[0.9cqw] ring-1 ring-baby-pink">
            <Magnifier />
            <span className="min-w-0 truncate text-[1.5cqw] text-ink-soft">{m.screen.search}</span>
            <i className="sx sx-caret ml-[-0.3cqw] block h-[1.7cqw] w-px shrink-0 bg-maroon" />
          </span>
          <span className="ml-auto flex items-center gap-[1.4cqw]">
            {tag ? <span className="shrink-0 whitespace-nowrap rounded-full bg-white px-[1.2cqw] py-[0.5cqw] text-[1.5cqw] font-semibold text-maroon ring-1 ring-baby-pink">{m.device.illustrative}</span> : null}
            <span className="relative block">
              <Bell />
              <span className="absolute -right-[0.2cqw] -top-[0.2cqw] block h-[1.1cqw] w-[1.1cqw]">
                <i className="sx sx-ping absolute inset-0 rounded-full bg-red" />
                <i className="absolute inset-0 rounded-full bg-red ring-[0.3cqw] ring-white" />
              </span>
            </span>
            <Avatar size="3cqw" tone={1} />
          </span>
        </header>

        <div className="flex min-h-0 flex-1 flex-col gap-[1.4cqw] p-[2cqw]">
          <div className="flex items-center gap-[1.2cqw]">
            {title ? <p className="truncate font-display text-[2.7cqw] font-bold leading-none tracking-[-0.02em] text-maroon">{title}</p> : null}
            {status ? <StatusChip status={status} /> : null}
            <span className="ml-auto shrink-0 rounded-full bg-red px-[1.8cqw] py-[0.8cqw] text-[1.5cqw] font-semibold text-white">+ {m.screen.create}</span>
          </div>
          {kind === "dashboard" && <Dashboard L={L} />}
          {kind === "table" && <Table L={L} />}
          {kind === "kanban" && <Kanban L={L} />}
          {kind === "calendar" && <Calendar L={L} />}
          {kind === "chat" && <Chat L={L} />}
          {kind === "form" && <Form L={L} />}
          {kind === "tree" && <Tree L={L} />}
          {kind === "settings" && <Settings L={L} n={labels.length} />}
          {kind === "docs" && <Docs L={L} />}
          {kind === "flow" && <Flow L={L} />}
          {kind === "search" && <Search L={L} />}
          {kind === "cards" && <Cards L={L} />}
        </div>
      </div>
    </div>
  );
}

import type { ReactNode } from "react";
import type { ScreenKind } from "@/content/types";

/**
 * Illustrative NAVICORE ONE screen layouts, drawn in CSS.
 * Not screenshots, and deliberately free of numbers: every label comes from the guide's own
 * function names, and everything else is a neutral bar or shape. Sizes use container units (cqw)
 * so the same layout works in a hero laptop, a wall tile or a small window.
 */
const W = [72, 54, 88, 64, 80, 46, 92, 60, 70, 50];
const bar = (i: number, cls = "bg-baby-pink") => (
  <i className={`block h-[1.5cqw] rounded-full ${cls}`} style={{ width: `${W[i % W.length]}%` }} />
);
const T = ({ children, cls = "" }: { children: ReactNode; cls?: string }) => (
  <p className={`min-w-0 truncate text-[2.1cqw] leading-tight ${cls}`}>{children}</p>
);

interface Props {
  kind: ScreenKind;
  /** Real function names from the guide. */
  labels: readonly string[];
  title?: string;
  /** Drop the left navigation column (for phone-width screens). */
  compact?: boolean;
}

export function ScreenMock({ kind, labels, title, compact = false }: Props) {
  const L = (i: number) => (labels.length ? (labels[i % labels.length] ?? "") : "");
  return (
    <div aria-hidden="true" className="@container flex h-full w-full overflow-hidden bg-white text-ink">
      {compact ? null : (
        <div className="flex w-[15%] flex-col gap-[2.2cqw] bg-blush p-[2cqw]">
          <i className="block h-[3.4cqw] w-[3.4cqw] rounded-[0.8cqw] bg-maroon" />
          {[0, 1, 2, 3, 4].map((i) => (
            <i key={i} className={`block h-[1.4cqw] rounded-full ${i === 1 ? "bg-rose" : "bg-baby-pink"}`} style={{ width: `${W[i + 2] ?? 60}%` }} />
          ))}
        </div>
      )}
      <div className="flex min-w-0 flex-1 flex-col gap-[1.8cqw] p-[2.4cqw]">
        {title ? <p className="truncate text-[2.8cqw] font-semibold text-maroon">{title}</p> : null}
        {kind === "dashboard" && <Dashboard L={L} />}
        {kind === "table" && <Table L={L} />}
        {kind === "kanban" && <Kanban L={L} />}
        {kind === "calendar" && <Calendar L={L} />}
        {kind === "chat" && <Chat L={L} />}
        {kind === "form" && <Form L={L} />}
        {kind === "tree" && <Tree L={L} />}
        {kind === "settings" && <Settings L={L} />}
        {kind === "docs" && <Docs L={L} />}
        {kind === "flow" && <Flow L={L} />}
        {kind === "search" && <Search L={L} />}
        {kind === "cards" && <Cards L={L} />}
      </div>
    </div>
  );
}

type LFn = (i: number) => string;

function Dashboard({ L }: { L: LFn }) {
  return (
    <>
      <div className="grid grid-cols-3 gap-[1.6cqw]">
        {[0, 1, 2].map((i) => (
          <div key={i} className="rounded-[1cqw] bg-blush p-[1.6cqw]">
            <T cls="text-ink-soft">{L(i)}</T>
            <i className="mt-[1cqw] block h-[1.8cqw] rounded-full bg-maroon" style={{ width: `${[64, 48, 78][i]}%` }} />
          </div>
        ))}
      </div>
      <div className="grid flex-1 grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)] gap-[1.6cqw]">
        <div className="rounded-[1cqw] bg-blush p-[1.6cqw]">
          <T cls="text-ink-soft">{L(3)}</T>
          <svg viewBox="0 0 100 36" className="mt-[1cqw] h-[16cqw] w-full" preserveAspectRatio="none">
            <polygon points="0,36 0,28 16,24 32,26 48,14 64,18 80,7 100,10 100,36" className="fill-baby-pink" />
            <polyline fill="none" strokeWidth="1.4" points="0,28 16,24 32,26 48,14 64,18 80,7 100,10" className="stroke-red" />
          </svg>
        </div>
        <div className="flex flex-col gap-[1.4cqw] rounded-[1cqw] bg-blush p-[1.6cqw]">
          {[4, 5, 6, 7].map((i) => (
            <div key={i} className="flex items-center gap-[1.2cqw]">
              <i className="block h-[1.8cqw] w-[1.8cqw] shrink-0 rounded-full bg-rose" />
              <T>{L(i)}</T>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

function Table({ L }: { L: LFn }) {
  return (
    <>
      <div className="flex items-center justify-between">
        <i className="block h-[3cqw] w-[34%] rounded-full bg-blush" />
        <i className="block h-[3cqw] w-[14%] rounded-full bg-red" />
      </div>
      <div className="flex flex-col gap-[1cqw]">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="grid grid-cols-[2fr_1.2fr_0.8fr] items-center gap-[2cqw] rounded-[0.8cqw] bg-blush px-[1.6cqw] py-[1.3cqw]">
            <T>{L(i)}</T>
            {bar(i)}
            <i className={`block h-[2cqw] rounded-full ${i % 3 === 0 ? "bg-maroon" : "bg-rose"}`} />
          </div>
        ))}
      </div>
    </>
  );
}

function Kanban({ L }: { L: LFn }) {
  return (
    <div className="grid flex-1 grid-cols-3 gap-[1.6cqw]">
      {[0, 1, 2].map((c) => (
        <div key={c} className="flex flex-col gap-[1.4cqw] rounded-[1cqw] bg-blush p-[1.4cqw]">
          <T cls="font-semibold text-maroon">{L(c)}</T>
          {Array.from({ length: 3 - (c % 2) }).map((_, r) => (
            <div key={r} className="rounded-[0.8cqw] bg-white p-[1.4cqw] ring-1 ring-baby-pink">
              {bar(c + r)}
              <i className="mt-[1cqw] block h-[1.2cqw] w-1/3 rounded-full bg-rose" />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

function Calendar({ L }: { L: LFn }) {
  const on = new Set([3, 9, 10, 16, 22, 23, 24]);
  return (
    <>
      <T cls="text-ink-soft">{L(0)}</T>
      <div className="grid flex-1 grid-cols-7 gap-[1cqw]">
        {Array.from({ length: 35 }).map((_, i) => (
          <div key={i} className={`rounded-[0.7cqw] p-[0.8cqw] ${on.has(i) ? "bg-baby-pink" : "bg-blush"}`}>
            {on.has(i) ? <i className="block h-[1.2cqw] w-3/4 rounded-full bg-maroon" /> : null}
          </div>
        ))}
      </div>
    </>
  );
}

function Chat({ L }: { L: LFn }) {
  return (
    <div className="grid flex-1 grid-cols-[28%_1fr] gap-[1.6cqw]">
      <div className="flex flex-col gap-[1.4cqw] rounded-[1cqw] bg-blush p-[1.4cqw]">
        {[0, 1, 2, 3, 4].map((i) => (
          <T key={i} cls={i === 1 ? "font-semibold text-maroon" : "text-ink-soft"}>{L(i)}</T>
        ))}
      </div>
      <div className="flex flex-col gap-[1.4cqw]">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className={`max-w-[75%] rounded-[1.2cqw] p-[1.4cqw] ${i % 2 ? "self-end bg-maroon" : "bg-baby-pink"}`}>
            <i className={`block h-[1.3cqw] rounded-full ${i % 2 ? "bg-white/80" : "bg-white"}`} style={{ width: `${W[i + 3] ?? 60}%` }} />
            <i className={`mt-[0.9cqw] block h-[1.3cqw] w-1/2 rounded-full ${i % 2 ? "bg-white/60" : "bg-white"}`} />
          </div>
        ))}
        <i className="mt-auto block h-[3.6cqw] rounded-full bg-blush" />
      </div>
    </div>
  );
}

function Form({ L }: { L: LFn }) {
  return (
    <div className="flex flex-1 flex-col gap-[1.6cqw]">
      {[0, 1, 2, 3].map((i) => (
        <div key={i}>
          <T cls="text-ink-soft">{L(i)}</T>
          <i className="mt-[0.6cqw] block h-[3.6cqw] rounded-[0.8cqw] bg-blush ring-1 ring-baby-pink" />
        </div>
      ))}
      <i className="mt-auto block h-[3.8cqw] w-[24%] rounded-full bg-red" />
    </div>
  );
}

function Tree({ L }: { L: LFn }) {
  const node = (t: string, k: string, strong = false) => (
    <div key={k} className={`rounded-[0.9cqw] px-[1.6cqw] py-[1.2cqw] text-center ${strong ? "bg-maroon text-white" : "bg-blush ring-1 ring-baby-pink"}`}>
      <T>{t}</T>
    </div>
  );
  return (
    <div className="flex flex-1 flex-col items-center gap-[1.6cqw]">
      <div className="w-[34%]">{node(L(0), "r", true)}</div>
      <i className="block h-[2.4cqw] w-px bg-rose" />
      <div className="grid w-full grid-cols-3 gap-[1.6cqw]">{[1, 2, 3].map((i) => node(L(i), `m${i}`))}</div>
      <i className="block h-[2.4cqw] w-px bg-rose" />
      <div className="grid w-full grid-cols-5 gap-[1.2cqw]">{[4, 5, 6, 7, 8].map((i) => node(L(i), `l${i}`))}</div>
    </div>
  );
}

function Settings({ L }: { L: LFn }) {
  return (
    <div className="flex flex-col gap-[1.2cqw]">
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="flex items-center justify-between rounded-[0.8cqw] bg-blush px-[1.8cqw] py-[1.5cqw]">
          <T>{L(i)}</T>
          <i className={`relative block h-[2.6cqw] w-[5cqw] rounded-full ${i % 2 ? "bg-maroon" : "bg-rose"}`}>
            <b className={`absolute top-[0.4cqw] block h-[1.8cqw] w-[1.8cqw] rounded-full bg-white ${i % 2 ? "right-[0.4cqw]" : "left-[0.4cqw]"}`} />
          </i>
        </div>
      ))}
    </div>
  );
}

function Docs({ L }: { L: LFn }) {
  return (
    <div className="grid flex-1 grid-cols-[26%_1fr] gap-[1.6cqw]">
      <div className="flex flex-col gap-[1.4cqw] rounded-[1cqw] bg-blush p-[1.4cqw]">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-[1cqw]">
            <i className="block h-[2cqw] w-[2.6cqw] rounded-[0.4cqw] bg-rose" />
            <T>{L(i)}</T>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-3 gap-[1.4cqw]">
        {[4, 5, 6, 7, 8, 9].map((i) => (
          <div key={i} className="rounded-[0.9cqw] bg-blush p-[1.4cqw] ring-1 ring-baby-pink">
            <i className="block h-[7cqw] rounded-[0.6cqw] bg-white" />
            <T cls="mt-[1cqw]">{L(i)}</T>
          </div>
        ))}
      </div>
    </div>
  );
}

function Flow({ L }: { L: LFn }) {
  return (
    <div className="flex flex-1 flex-col justify-center gap-[3cqw]">
      <div className="flex items-center gap-[1.2cqw]">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="flex min-w-0 flex-1 items-center gap-[1.2cqw]">
            <div className={`min-w-0 flex-1 rounded-[1cqw] px-[1.2cqw] py-[1.8cqw] text-center ${i === 3 ? "bg-maroon text-white" : "bg-baby-pink"}`}>
              <T>{L(i)}</T>
            </div>
            {i < 3 ? <span className="text-[2.6cqw] text-maroon">→</span> : null}
          </div>
        ))}
      </div>
      <div className="flex items-center justify-center gap-[1.2cqw]">
        {[4, 5, 6].map((i) => (
          <div key={i} className="min-w-0 flex-1 rounded-[1cqw] bg-blush px-[1.2cqw] py-[1.5cqw] text-center ring-1 ring-baby-pink">
            <T>{L(i)}</T>
          </div>
        ))}
      </div>
    </div>
  );
}

function Search({ L }: { L: LFn }) {
  return (
    <>
      <div className="flex items-center gap-[1.4cqw] rounded-full bg-blush px-[2cqw] py-[1.8cqw] ring-1 ring-rose">
        <i className="block h-[2.2cqw] w-[2.2cqw] rounded-full ring-[0.5cqw] ring-maroon" />
        <T>{L(0)}</T>
      </div>
      {[1, 2, 3].map((g) => (
        <div key={g} className="rounded-[1cqw] bg-blush p-[1.4cqw]">
          <T cls="font-semibold text-maroon">{L(g)}</T>
          <div className="mt-[1cqw] flex flex-col gap-[0.9cqw]">{bar(g)}{bar(g + 3)}</div>
        </div>
      ))}
    </>
  );
}

function Cards({ L }: { L: LFn }) {
  return (
    <div className="grid flex-1 grid-cols-3 gap-[1.6cqw]">
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="rounded-[1cqw] bg-blush p-[1.6cqw] ring-1 ring-baby-pink">
          <i className={`block h-[5cqw] w-[5cqw] rounded-[1.2cqw] ${i % 3 === 0 ? "bg-maroon" : "bg-rose"}`} />
          <T cls="mt-[1.4cqw] font-semibold">{L(i)}</T>
          <div className="mt-[1cqw]">{bar(i + 2)}</div>
        </div>
      ))}
    </div>
  );
}

import { getMessages } from "@/i18n/messages";
import { ApproveChip, Avatar, Check, Cursor, Line, StateChip, T, W, k } from "./ui";

/**
 * The twelve screen bodies. Each one is a believable working layout (lists, boards, charts, forms) with a few
 * pieces of in-screen activity: charts that draw, rows that come in, a pointer that approves or drags, toggles that flip.
 * Labels are the guide's own function names (L). Nothing here is a real record.
 */
export type LFn = (i: number) => string;

const card = "rounded-[1cqw] bg-blush ring-1 ring-baby-pink";

/** A sparkline with a cover that wipes away from left to right when the screen first appears. */
function Spark({ i }: { i: number }) {
  const lines = [
    "0,26 14,22 28,24 42,14 56,17 70,8 84,11 100,4",
    "0,20 14,24 28,14 42,18 56,10 70,14 84,6 100,9",
    "0,28 14,25 28,26 42,19 56,21 70,12 84,13 100,5",
  ];
  return (
    <div className="relative mt-[0.9cqw] h-[4.4cqw]">
      <svg viewBox="0 0 100 32" preserveAspectRatio="none" className="h-full w-full overflow-visible">
        <polyline fill="none" strokeWidth="1.6" vectorEffect="non-scaling-stroke" strokeLinejoin="round" strokeLinecap="round" points={lines[i % 3]} className="stroke-maroon" />
      </svg>
      <i className="sx sx-cover absolute inset-0 origin-right scale-x-0 bg-blush" style={k(i)} />
    </div>
  );
}

export function Dashboard({ L }: { L: LFn }) {
  return (
    <>
      <div className="grid grid-cols-3 gap-[1.4cqw]">
        {[0, 1, 2].map((i) => (
          <div key={i} className={`sx sx-in ${card} p-[1.3cqw]`} style={k(i)}>
            <div className="flex items-center justify-between gap-[1cqw]">
              <T cls="text-ink-soft">{L(i)}</T>
              <i className={`block h-[1.5cqw] w-[1.5cqw] shrink-0 rounded-full ${i === 1 ? "bg-red" : "bg-maroon"}`} />
            </div>
            <Spark i={i} />
            <span className="mt-[0.8cqw] block h-[0.9cqw] rounded-full bg-white">
              <i className="sx sx-grow block h-full origin-left rounded-full bg-maroon" style={k(i, { width: `${[64, 48, 78][i]}%` })} />
            </span>
          </div>
        ))}
      </div>
      <div className="grid min-h-0 flex-1 grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)] gap-[1.4cqw]">
        <div className={`sx sx-in flex flex-col ${card} p-[1.3cqw]`} style={k(3)}>
          <div className="flex items-center justify-between gap-[1cqw]">
            <T cls="font-semibold text-maroon">{L(3)}</T>
            <span className="flex gap-[0.7cqw]">
              {[0, 1, 2].map((p) => (
                <i key={p} className={`block h-[1.2cqw] w-[3.2cqw] rounded-full ${p === 1 ? "bg-maroon" : "bg-baby-pink"}`} />
              ))}
            </span>
          </div>
          <div className="relative mt-[1cqw] min-h-0 flex-1">
            <svg viewBox="0 0 100 36" preserveAspectRatio="none" className="h-full w-full overflow-visible">
              {[9, 18, 27].map((y) => (
                <line key={y} x1="0" x2="100" y1={y} y2={y} strokeWidth="1" vectorEffect="non-scaling-stroke" strokeDasharray="3 3" className="stroke-baby-pink" />
              ))}
              <polygon points="0,36 0,28 16,24 32,26 48,14 64,18 80,7 100,10 100,36" className="fill-baby-pink/70" />
              <polyline fill="none" strokeWidth="2" vectorEffect="non-scaling-stroke" strokeLinejoin="round" points="0,28 16,24 32,26 48,14 64,18 80,7 100,10" className="stroke-red" />
            </svg>
            <i className="sx sx-cover absolute inset-0 origin-right scale-x-0 bg-blush" style={k(2)} />
            <span className="absolute right-0 top-[27.8%] block h-[1.8cqw] w-[1.8cqw] -translate-y-1/2 translate-x-1/2">
              <i className="sx sx-ping absolute inset-0 rounded-full bg-red" />
              <i className="absolute inset-0 rounded-full bg-red ring-[0.4cqw] ring-white" />
            </span>
          </div>
        </div>
        <div className={`sx sx-in flex flex-col ${card} p-[1.3cqw]`} style={k(4)}>
          <T cls="font-semibold text-maroon">{L(4)}</T>
          <div className="relative mt-[0.8cqw] flex min-h-0 flex-1 flex-col">
            <i className="sx sx-sweep4 absolute inset-x-0 top-0 h-1/4 rounded-[0.8cqw] bg-white opacity-0 ring-1 ring-baby-pink" />
            {[5, 6, 7, 8].map((n, r) => (
              <div key={n} className="relative flex flex-1 items-center gap-[1cqw]">
                <Avatar size="2.6cqw" tone={r} />
                <T cls="flex-1">{L(n)}</T>
                {r === 0 ? <ApproveChip /> : <StateChip done={r === 2} />}
              </div>
            ))}
          </div>
        </div>
      </div>
      <Cursor points={[["62%", "88%"], ["91%", "54%"], ["30%", "74%"]]} />
    </>
  );
}

export function Table({ L }: { L: LFn }) {
  return (
    <>
      <div className="flex items-center gap-[1.2cqw]">
        {[0, 1, 2].map((i) => (
          <span key={i} className={`flex items-center gap-[0.8cqw] rounded-full bg-blush px-[1.4cqw] py-[0.9cqw] ring-1 ring-baby-pink ${i === 0 ? "w-[22%]" : "w-[14%]"}`}>
            <i className="block h-[1.2cqw] w-[1.2cqw] shrink-0 rounded-full bg-rose" />
            <Line i={i + 3} cls="bg-baby-pink" h="1cqw" />
          </span>
        ))}
      </div>
      <div className={`flex min-h-0 flex-1 flex-col overflow-hidden ${card}`}>
        <div className="grid grid-cols-[2fr_1.2fr_0.9fr_0.5fr] items-center gap-[2cqw] bg-baby-pink/60 px-[1.6cqw] py-[1cqw]">
          {[0, 1, 2, 3].map((i) => (
            <i key={i} className="block h-[1cqw] rounded-full bg-maroon/40" style={{ width: `${[46, 38, 50, 40][i]}%` }} />
          ))}
        </div>
        <div className="relative flex min-h-0 flex-1 flex-col">
          <i className="sx sx-sweep6 absolute inset-x-0 top-0 h-[16.666%] bg-white/80 opacity-0" />
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="sx sx-in relative grid flex-1 grid-cols-[2fr_1.2fr_0.9fr_0.5fr] items-center gap-[2cqw] border-b border-baby-pink/70 px-[1.6cqw] last:border-0" style={k(i)}>
              <span className="flex min-w-0 items-center gap-[1cqw]">
                <Avatar size="2.4cqw" tone={i} />
                <T>{L(i)}</T>
              </span>
              <span className="block h-[0.9cqw] rounded-full bg-white">
                <i className="sx sx-grow block h-full origin-left rounded-full bg-maroon" style={k(i, { width: `${W[i + 1]}%` })} />
              </span>
              {i === 1 ? <ApproveChip /> : <StateChip done={i % 3 === 0} />}
              <i className="block h-[1.1cqw] w-[60%] rounded-full bg-rose" />
            </div>
          ))}
        </div>
      </div>
      <Cursor points={[["88%", "88%"], ["77%", "49%"], ["40%", "66%"]]} />
    </>
  );
}

export function Kanban({ L }: { L: LFn }) {
  const counts = [3, 2, 1];
  return (
    <>
      <div className="grid min-h-0 flex-1 grid-cols-3 gap-[1.4cqw]">
        {counts.map((n, c) => (
          <div key={c} className={`sx sx-in flex flex-col gap-[1.2cqw] ${card} p-[1.3cqw]`} style={k(c)}>
            <div className="flex items-center gap-[0.9cqw]">
              <i className={`block h-[1.3cqw] w-[1.3cqw] rounded-full ${["bg-rose", "bg-red", "bg-maroon"][c]}`} />
              <T cls="font-semibold text-maroon">{L(c)}</T>
            </div>
            {Array.from({ length: n }).map((_, r) => {
              const dragged = c === 1 && r === 0;
              return (
                <div key={r} className={`${dragged ? "sx sx-drag relative z-10" : ""} rounded-[0.8cqw] bg-white p-[1.2cqw] ring-1 ring-baby-pink shadow-[0_1px_2px_rgb(107_18_32/0.08)]`}>
                  <i className="block h-[1cqw] w-[34%] rounded-full bg-rose" />
                  <div className="mt-[0.9cqw]"><Line i={c * 2 + r} cls="bg-baby-pink" h="1.2cqw" /></div>
                  <div className="mt-[0.6cqw]"><Line i={c * 2 + r + 5} cls="bg-blush" h="1cqw" /></div>
                  <div className="mt-[1cqw] flex items-center justify-between">
                    <span className="flex -space-x-[0.7cqw]">
                      <Avatar size="2.2cqw" tone={c + r} />
                      <Avatar size="2.2cqw" tone={c + r + 1} />
                    </span>
                    <span className="block h-[0.9cqw] w-[36%] rounded-full bg-baby-pink">
                      <i className="sx sx-grow block h-full origin-left rounded-full bg-maroon" style={k(c + r, { width: `${[70, 40, 90, 55, 30, 80][c + r]}%` })} />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
      <Cursor kind="drag" points={[["90%", "88%"], ["58%", "36%"], ["85%", "58%"]]} />
    </>
  );
}

export function Calendar({ L }: { L: LFn }) {
  const events = new Map<number, number>([[3, 0], [9, 1], [10, 2], [16, 0], [22, 1], [23, 2], [24, 0]]);
  const picks = [3, 10, 16, 23];
  return (
    <>
      <div className="flex items-center gap-[1.2cqw]">
        <T cls="font-semibold text-maroon">{L(0)}</T>
        <span className="ml-auto flex gap-[0.8cqw]">
          {[0, 1].map((i) => (
            <i key={i} className="block h-[2.6cqw] w-[2.6cqw] rounded-full bg-blush ring-1 ring-baby-pink" />
          ))}
          <i className="block h-[2.6cqw] w-[9cqw] rounded-full bg-maroon" />
        </span>
      </div>
      <div className="grid grid-cols-7 gap-[1cqw] px-[0.4cqw]">
        {Array.from({ length: 7 }).map((_, i) => (
          <i key={i} className="mx-auto block h-[1cqw] w-[40%] rounded-full bg-rose" />
        ))}
      </div>
      <div className="grid min-h-0 flex-1 grid-cols-7 grid-rows-5 gap-[0.9cqw]">
        {Array.from({ length: 35 }).map((_, i) => {
          const ev = events.get(i);
          const pick = picks.indexOf(i);
          return (
            <div key={i} className={`sx sx-in relative rounded-[0.7cqw] p-[0.7cqw] ${i === 16 ? "bg-white ring-2 ring-red" : "bg-blush ring-1 ring-baby-pink"}`} style={k((i % 7) + Math.floor(i / 7))}>
              <i className="block h-[1cqw] w-[1cqw] rounded-full bg-baby-pink" />
              {ev !== undefined ? (
                <i className={`sx sx-grow mt-[0.7cqw] block h-[1.4cqw] origin-left rounded-[0.4cqw] ${["bg-maroon", "bg-red", "bg-rose"][ev]}`} style={k(i % 7)} />
              ) : null}
              {pick >= 0 ? <i className="sx sx-hl4 absolute inset-0 rounded-[0.7cqw] bg-white/0 opacity-0 ring-2 ring-maroon" style={k(pick)} /> : null}
            </div>
          );
        })}
      </div>
    </>
  );
}

export function Chat({ L }: { L: LFn }) {
  const m = getMessages();
  return (
    <div className="grid min-h-0 flex-1 grid-cols-[30%_minmax(0,1fr)] gap-[1.4cqw]">
      <div className={`flex flex-col gap-[0.6cqw] ${card} p-[1cqw]`}>
        {[0, 1, 2, 3, 4].map((i) => (
          <div key={i} className={`sx sx-in flex items-center gap-[0.9cqw] rounded-[0.8cqw] px-[0.9cqw] py-[0.9cqw] ${i === 1 ? "bg-white ring-1 ring-baby-pink" : ""}`} style={k(i)}>
            <Avatar size="2.6cqw" tone={i} ping={i === 2} />
            <T cls={i === 1 ? "font-semibold text-maroon" : "text-ink-soft"}>{L(i)}</T>
          </div>
        ))}
      </div>
      <div className="flex min-h-0 flex-col gap-[1cqw]">
        {[0, 1, 2].map((i) => (
          <div key={i} className={`sx sx-in rounded-[1.2cqw] px-[1.4cqw] py-[1.1cqw] ${i === 1 ? "self-end bg-maroon" : "bg-baby-pink"}`} style={k(i + 1, { width: `${[62, 46, 68][i]}%` })}>
            <Line i={i + 3} cls={i === 1 ? "bg-white/85" : "bg-white"} h="1.1cqw" />
            <div className="mt-[0.7cqw]"><Line i={i + 6} cls={i === 1 ? "bg-white/60" : "bg-white/80"} h="1.1cqw" /></div>
          </div>
        ))}
        <div className="grid">
          <div className="sx sx-typing col-start-1 row-start-1 flex w-[16%] items-center justify-center gap-[0.7cqw] rounded-[1.2cqw] bg-baby-pink py-[1.3cqw] opacity-0">
            {[0, 1, 2].map((d) => (
              <i key={d} className="sx sx-dot block h-[1cqw] w-[1cqw] rounded-full bg-maroon" style={k(d)} />
            ))}
          </div>
          <div className="sx sx-msg col-start-1 row-start-1 w-[52%] self-end justify-self-end rounded-[1.2cqw] bg-maroon px-[1.4cqw] py-[1.1cqw] opacity-0">
            <Line i={4} cls="bg-white/85" h="1.1cqw" />
          </div>
        </div>
        <div className="mt-auto flex items-center gap-[1cqw] rounded-full bg-blush py-[0.9cqw] pl-[1.6cqw] pr-[0.9cqw] ring-1 ring-baby-pink">
          <span className="min-w-0 flex-1 truncate text-[1.6cqw] text-ink-soft">{m.screen.message}</span>
          <i className="grid h-[3cqw] w-[3cqw] place-items-center rounded-full bg-red text-white"><Check cls="!h-[1.6cqw] !w-[1.6cqw]" /></i>
        </div>
      </div>
    </div>
  );
}

export function Form({ L }: { L: LFn }) {
  return (
    <div className="flex min-h-0 flex-1 flex-col gap-[1.3cqw]">
      {[0, 1, 2, 3].map((i) => (
        <div key={i} className="sx sx-in" style={k(i)}>
          <T cls="text-ink-soft">{L(i)}</T>
          <span className={`mt-[0.6cqw] flex items-center gap-[1cqw] rounded-[0.8cqw] bg-white px-[1.4cqw] py-[1.1cqw] ring-1 ${i === 1 ? "ring-2 ring-red" : "ring-baby-pink"}`}>
            <span className="block h-[1.2cqw] flex-1">
              <i className="sx sx-grow block h-full origin-left rounded-full bg-baby-pink" style={k(i, { width: `${[62, 40, 74, 52][i]}%` })} />
            </span>
            {i === 1 ? <i className="sx sx-caret block h-[2cqw] w-px bg-maroon" /> : null}
            {i !== 1 ? <Check cls="sx sx-check text-maroon" /> : null}
          </span>
        </div>
      ))}
      <span className="relative mt-auto block h-[3.6cqw] w-[22%]">
        <i className="sx sx-ping absolute inset-0 rounded-full bg-red" />
        <i className="absolute inset-0 rounded-full bg-red" />
      </span>
    </div>
  );
}

export function Tree({ L }: { L: LFn }) {
  const node = (t: string, key: string, i: number, strong = false, hl = -1) => (
    <div key={key} className={`sx sx-in relative flex items-center justify-center gap-[0.9cqw] rounded-[0.9cqw] px-[1.2cqw] py-[1.1cqw] ${strong ? "bg-maroon text-white" : "bg-white ring-1 ring-baby-pink"}`} style={k(i)}>
      <Avatar size="2.4cqw" tone={i} />
      <T>{t}</T>
      {hl >= 0 ? <i className="sx sx-hl3 absolute inset-0 rounded-[0.9cqw] opacity-0 ring-2 ring-red" style={k(hl)} /> : null}
    </div>
  );
  return (
    <div className={`flex min-h-0 flex-1 flex-col items-center gap-[1.2cqw] ${card} p-[1.6cqw]`}>
      <div className="w-[40%]">{node(L(0), "r", 0, true, 0)}</div>
      <i className="sx sx-line block h-[2.4cqw] w-px origin-top bg-rose" />
      <div className="grid w-full grid-cols-3 gap-[1.4cqw]">{[1, 2, 3].map((i) => node(L(i), `m${i}`, i, false, i === 2 ? 1 : -1))}</div>
      <i className="sx sx-line block h-[2.4cqw] w-px origin-top bg-rose" />
      <div className="grid w-full grid-cols-5 gap-[1cqw]">{[4, 5, 6, 7, 8].map((i) => node(L(i), `l${i}`, i, false, i === 6 ? 2 : -1))}</div>
    </div>
  );
}

export function Settings({ L, n = 6 }: { L: LFn; n?: number }) {
  return (
    <div className="flex min-h-0 flex-1 flex-col gap-[1cqw]">
      {Array.from({ length: Math.min(6, Math.max(3, n)) }).map((_, i) => {
        const on = i % 2 === 1;
        return (
          <div key={i} className={`sx sx-in flex flex-1 items-center justify-between gap-[2cqw] ${card} px-[1.6cqw]`} style={k(i)}>
            <span className="min-w-0">
              <T cls="font-semibold">{L(i)}</T>
              <div className="mt-[0.6cqw] w-[60%]"><Line i={i + 2} cls="bg-baby-pink" h="1cqw" /></div>
            </span>
            <span className={`relative block h-[2.8cqw] w-[5.2cqw] shrink-0 rounded-full ${on ? "bg-maroon" : "bg-rose"}`}>
              <i className={`sx absolute inset-0 rounded-full opacity-0 ${on ? "sx-flip-bg-inv bg-rose" : "sx-flip-bg bg-maroon"}`} style={k(i, { "--on": on ? 1 : 0 })} />
              <b className={`sx sx-flip absolute left-[0.4cqw] top-[0.4cqw] block h-[2cqw] w-[2cqw] rounded-full bg-white shadow-sm ${on ? "translate-x-[130%]" : ""}`} style={k(i, { "--on": on ? 1 : 0 })} />
            </span>
          </div>
        );
      })}
    </div>
  );
}

export function Docs({ L }: { L: LFn }) {
  return (
    <div className="grid min-h-0 flex-1 grid-cols-[28%_minmax(0,1fr)] gap-[1.4cqw]">
      <div className={`flex flex-col gap-[1cqw] ${card} p-[1.3cqw]`}>
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className={`sx sx-in flex items-center gap-[1cqw] rounded-[0.7cqw] px-[0.8cqw] py-[0.8cqw] ${i === 1 ? "bg-white ring-1 ring-baby-pink" : ""}`} style={k(i)}>
            <i className={`block h-[2cqw] w-[2.6cqw] rounded-[0.4cqw] ${i === 1 ? "bg-red" : "bg-rose"}`} />
            <T cls={i === 1 ? "font-semibold text-maroon" : "text-ink-soft"}>{L(i)}</T>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-3 gap-[1.2cqw]">
        {[4, 5, 6, 7, 8, 9].map((n, i) => (
          <div key={n} className={`sx sx-in relative flex flex-col ${card} p-[1.2cqw]`} style={k(i)}>
            <div className="flex-1 rounded-[0.6cqw] bg-white p-[1cqw]">
              <Line i={i} cls="bg-baby-pink" h="0.9cqw" />
              <div className="mt-[0.7cqw]"><Line i={i + 3} cls="bg-blush" h="0.9cqw" /></div>
              <div className="mt-[0.7cqw]"><Line i={i + 6} cls="bg-blush" h="0.9cqw" /></div>
            </div>
            <T cls="mt-[0.9cqw]">{L(n)}</T>
            <i className="sx sx-hl6 absolute inset-0 rounded-[1cqw] opacity-0 ring-2 ring-red" style={k(i)} />
          </div>
        ))}
      </div>
    </div>
  );
}

export function Flow({ L }: { L: LFn }) {
  return (
    <div className={`flex min-h-0 flex-1 flex-col justify-center gap-[3cqw] ${card} p-[2cqw]`}>
      <div className="flex items-center gap-[1cqw]">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="flex min-w-0 flex-1 items-center gap-[1cqw]">
            <div className={`sx sx-in relative min-w-0 flex-1 rounded-[1cqw] px-[1cqw] py-[1.8cqw] text-center ${i === 3 ? "bg-maroon text-white" : "bg-white ring-1 ring-baby-pink"}`} style={k(i)}>
              <T>{L(i)}</T>
              <i className="sx sx-hl4 absolute inset-0 rounded-[1cqw] opacity-0 ring-2 ring-red" style={k(i)} />
            </div>
            {i < 3 ? (
              <span className="relative block h-[0.5cqw] w-[4cqw] shrink-0 rounded-full bg-baby-pink">
                <i className="sx sx-fill absolute inset-0 origin-left rounded-full bg-red" style={k(i)} />
              </span>
            ) : null}
          </div>
        ))}
      </div>
      <div className="flex items-center justify-center gap-[1cqw]">
        {[4, 5, 6].map((i) => (
          <div key={i} className="sx sx-in min-w-0 flex-1 rounded-[1cqw] bg-white px-[1cqw] py-[1.4cqw] text-center ring-1 ring-baby-pink" style={k(i)}>
            <T>{L(i)}</T>
          </div>
        ))}
      </div>
    </div>
  );
}

export function Search({ L }: { L: LFn }) {
  return (
    <>
      <div className="flex items-center gap-[1.2cqw] rounded-full bg-white px-[1.8cqw] py-[1.5cqw] ring-2 ring-rose">
        <i className="block h-[1.9cqw] w-[1.9cqw] shrink-0 rounded-full ring-[0.45cqw] ring-maroon" />
        <span className="block h-[1.4cqw] w-[44%]"><i className="sx sx-type block h-full origin-left rounded-full bg-baby-pink" /></span>
        <i className="sx sx-caret block h-[2cqw] w-px bg-maroon" />
        <T cls="ml-auto text-ink-soft">{L(0)}</T>
      </div>
      <div className="relative flex min-h-0 flex-1 flex-col gap-[1cqw]">
        {[1, 2, 3].map((g) => (
          <div key={g} className={`sx sx-in relative flex-1 ${card} p-[1.3cqw]`} style={k(g)}>
            <T cls="font-semibold text-maroon">{L(g)}</T>
            <div className="mt-[0.9cqw] flex flex-col gap-[0.8cqw]">
              <Line i={g} cls="bg-baby-pink" h="1cqw" />
              <Line i={g + 4} cls="bg-white" h="1cqw" />
            </div>
            <i className="sx sx-hl3 absolute inset-0 rounded-[1cqw] opacity-0 ring-2 ring-red" style={k(g - 1)} />
          </div>
        ))}
      </div>
    </>
  );
}

export function Cards({ L }: { L: LFn }) {
  return (
    <div className="grid min-h-0 flex-1 grid-cols-3 grid-rows-2 gap-[1.3cqw]">
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <div key={i} className={`sx sx-in relative flex flex-col items-center justify-center gap-[0.9cqw] ${card} p-[1.3cqw] text-center`} style={k(i)}>
          <Avatar size="5.4cqw" tone={i} ping={i % 3 === 0} />
          <T cls="w-full font-semibold">{L(i)}</T>
          <div className="w-[60%]"><Line i={i + 2} cls="bg-baby-pink" h="1cqw" /></div>
          <i className="sx sx-hl6 absolute inset-0 rounded-[1cqw] opacity-0 ring-2 ring-red" style={k(i)} />
        </div>
      ))}
    </div>
  );
}

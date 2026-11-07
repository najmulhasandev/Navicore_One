import { getMessages } from "@/i18n/messages";
import type { LFn } from "./screens";
import { Avatar, Bell, Check, Line, MockLogo, k } from "./ui";

/**
 * The mobile web app inside a phone frame: app bar with the official logo, one conversation (a message arrives
 * after a typing indicator), a composer and a tab bar. Sized for a narrow screen, so units are about twice the desktop ones.
 */
export function Phone({ L, title }: { L: LFn; title?: string }) {
  const m = getMessages();
  return (
    <div aria-hidden="true" data-live="lazy" className="@container flex h-full w-full flex-col overflow-hidden bg-surface text-left text-ink">
      <div className="flex items-center justify-between bg-blush px-[5cqw] pb-[3cqw] pt-[9cqw]">
        <MockLogo lightCls="h-[9cqw]" darkCls="h-[8cqw]" />
        <span className="flex items-center gap-[3cqw]">
          <span className="relative block [&_svg]:!h-[6cqw] [&_svg]:!w-[6cqw]">
            <Bell />
            <span className="absolute -right-[0.5cqw] -top-[0.5cqw] block h-[2.6cqw] w-[2.6cqw]">
              <i className="sx sx-ping absolute inset-0 rounded-full bg-red" />
              <i className="absolute inset-0 rounded-full bg-red ring-[0.8cqw] ring-surface" />
            </span>
          </span>
          <Avatar size="7cqw" tone={1} />
        </span>
      </div>
      <div className="flex items-center gap-[3cqw] border-b border-baby-pink px-[5cqw] py-[3cqw]">
        <Avatar size="8cqw" tone={0} ping />
        <p className="min-w-0 flex-1 truncate text-[4.4cqw] font-semibold leading-tight text-maroon">{title ?? L(0)}</p>
      </div>
      <div className="flex min-h-0 flex-1 flex-col gap-[3cqw] px-[4cqw] py-[3.5cqw]">
        {[0, 1, 2, 3, 4].map((i) => (
          <div key={i} className={`sx sx-in rounded-[3.4cqw] px-[3.4cqw] py-[2.8cqw] ${i % 2 === 1 ? "self-end bg-deep" : "bg-baby-pink"}`} style={k(i + 1, { width: `${[66, 52, 74, 44, 60][i]}%` })}>
            <Line i={i + 3} cls={i % 2 === 1 ? "bg-surface/85" : "bg-surface"} h="2.6cqw" />
            {i !== 3 ? <div className="mt-[1.8cqw]"><Line i={i + 6} cls={i % 2 === 1 ? "bg-surface/60" : "bg-surface/80"} h="2.6cqw" /></div> : null}
          </div>
        ))}
        <div className="grid">
          <div className="sx sx-typing col-start-1 row-start-1 flex w-[26%] items-center justify-center gap-[1.6cqw] rounded-[3.4cqw] bg-baby-pink py-[3.4cqw] opacity-0">
            {[0, 1, 2].map((d) => (
              <i key={d} className="sx sx-dot block h-[2.4cqw] w-[2.4cqw] rounded-full bg-deep" style={k(d)} />
            ))}
          </div>
          <div className="sx sx-msg col-start-1 row-start-1 w-[56%] self-end justify-self-end rounded-[3.4cqw] bg-deep px-[3.4cqw] py-[2.8cqw] opacity-0">
            <Line i={4} cls="bg-surface/85" h="2.6cqw" />
          </div>
        </div>
      </div>
      <div className="mx-[4cqw] mb-[3cqw] flex items-center gap-[2cqw] rounded-full bg-blush py-[2cqw] pl-[4cqw] pr-[2cqw] ring-1 ring-baby-pink">
        <span className="min-w-0 flex-1 truncate text-[3.8cqw] text-ink-soft">{m.screen.message}</span>
        <i className="grid h-[8cqw] w-[8cqw] place-items-center rounded-full bg-red text-on-red"><Check cls="!h-[4.4cqw] !w-[4.4cqw]" /></i>
      </div>
      <div className="grid grid-cols-4 border-t border-baby-pink bg-blush px-[4cqw] py-[3cqw]">
        {[0, 1, 2, 3].map((i) => (
          <span key={i} className="grid place-items-center gap-[1cqw]">
            <i className={`block h-[6cqw] w-[6cqw] rounded-[1.8cqw] ${i === 2 ? "bg-red" : "bg-rose"}`} />
            <i className={`block h-[1.2cqw] w-[8cqw] rounded-full ${i === 2 ? "bg-deep" : "bg-baby-pink"}`} />
          </span>
        ))}
      </div>
    </div>
  );
}

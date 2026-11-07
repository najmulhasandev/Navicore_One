import type { Flow } from "@/content/types";
import { getMessages } from "@/i18n/messages";

const Right = () => (
  <svg viewBox="0 0 24 24" className="flow-arrow-r absolute -right-[1.65rem] top-7 h-6 w-6 text-rose" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);
const Down = () => (
  <svg viewBox="0 0 24 24" className="flow-arrow-d absolute -bottom-[1.5rem] left-5 h-6 w-6 text-rose" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 5v14M6 13l6 6 6-6" />
  </svg>
);

const columnsFor = (n: number): number => (n <= 4 ? Math.max(n, 1) : n <= 6 ? 3 : 4);

/**
 * A process drawn in HTML and inline SVG (no images). Three shapes:
 *  - sequence: numbered steps joined by arrows (wraps to 1, 2 or up to 4 columns)
 *  - fan:      the first step feeds or uses all the others (shared services, company structure)
 *  - stack:    layers listed top to bottom (product layers)
 * An ordered list underneath keeps it readable for screen readers and search engines.
 */
export function FlowDiagram({ flow }: { flow: Flow }) {
  const m = getMessages();
  const [first, ...rest] = flow.steps;
  const cols = columnsFor(flow.steps.length);

  return (
    <figure className="rounded-3xl bg-surface p-5 shadow-soft ring-1 ring-baby-pink sm:p-7">
      <figcaption className="mb-6 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
        <h3 className="font-display text-xl font-semibold sm:text-2xl">{flow.title}</h3>
        <span className="text-xs text-ink-soft">{flow.source === "guide" ? m.part.flowGuide : m.part.flowComposed}</span>
      </figcaption>

      {flow.kind === "sequence" && (
        <ol className="flow-grid grid gap-x-12 gap-y-9" style={{ ["--cols" as string]: cols }}>
          {flow.steps.map((s, i) => (
            <li
              key={`${s.label}-${i}`}
              className="flow-step relative rounded-2xl bg-blush p-4 ring-1 ring-baby-pink"
              data-last={i === flow.steps.length - 1 ? "" : undefined}
              data-end-md={i % 2 === 1 ? "" : undefined}
              data-end-lg={(i + 1) % cols === 0 ? "" : undefined}
            >
              <span className="mb-2 flex h-7 w-7 items-center justify-center rounded-full bg-deep text-xs font-bold text-white">{i + 1}</span>
              <p className="font-semibold text-maroon">{s.label}</p>
              {s.detail ? <p className="mt-1 text-sm leading-snug text-ink-soft">{s.detail}</p> : null}
              <Right />
              <Down />
            </li>
          ))}
        </ol>
      )}

      {flow.kind === "fan" && first && (
        <div>
          <div className="mx-auto w-fit max-w-full rounded-2xl bg-deep px-6 py-4 text-center text-white shadow-soft">
            <p className="font-display text-lg font-semibold">{first.label}</p>
            {first.detail ? <p className="text-sm text-white/90">{first.detail}</p> : null}
          </div>
          <div className="mx-auto h-6 w-0.5 bg-rose" aria-hidden="true" />
          <ul className="flex flex-wrap justify-center gap-3 border-t-2 border-rose pt-6">
            {rest.map((s, i) => (
              <li
                key={`${s.label}-${i}`}
                className="relative rounded-xl bg-blush px-4 py-2.5 text-sm font-medium text-maroon ring-1 ring-baby-pink before:absolute before:-top-6 before:left-1/2 before:h-6 before:w-0.5 before:bg-rose"
              >
                {s.label}
              </li>
            ))}
          </ul>
        </div>
      )}

      {flow.kind === "stack" && (
        <ol className="mx-auto flex max-w-2xl flex-col gap-2">
          {flow.steps.map((s, i) => (
            <li
              key={`${s.label}-${i}`}
              className={`flex items-center gap-4 rounded-2xl px-5 py-3 ring-1 ring-baby-pink ${
                i === 0 ? "bg-deep text-white" : i % 2 ? "bg-surface text-maroon" : "bg-baby-pink text-maroon"
              }`}
            >
              <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${i === 0 ? "bg-surface text-maroon" : "bg-deep text-white"}`}>{i + 1}</span>
              <span className="font-semibold">{s.label}</span>
            </li>
          ))}
        </ol>
      )}
    </figure>
  );
}

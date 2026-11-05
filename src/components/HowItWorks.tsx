import Link from "next/link";
import { getMessages } from "@/i18n/messages";
import { functionLabels, getCopy, mustGetPart, partHref } from "@/lib/parts";
import { DeviceFrame } from "./mock/DeviceFrame";
import { ScreenMock } from "./mock/ScreenMock";
import { SectionHeading } from "./ui/SectionHeading";
import { StatusBadge } from "./ui/StatusBadge";

/** The three steps are Live areas only. Each one is read from the data: name, outcome, functions and status. */
const STEP_SLUGS = ["people-directory", "project-management", "time-tracking"] as const;

/**
 * "How it works": three Live areas, each with an illustrative screen.
 * Phones and no-JS: three stacked steps (text, then screen).
 * Desktop: a tall scroll track with a pinned stage. The text column stays put, the screens crossfade as you scroll
 * (motion controller sets data-active from the invisible zones). See docs/MOTION.md.
 */
export function HowItWorks() {
  const m = getMessages();
  const t = m.home.steps;
  const steps = STEP_SLUGS.map((slug) => {
    const part = mustGetPart(slug);
    return { part, copy: getCopy(part), labels: functionLabels(part) };
  });

  return (
    <section id="how" className="bg-white py-20 sm:py-28" aria-labelledby="how-title">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading id="how-title" eyebrow={t.eyebrow} title={t.title} lead={t.lead} />
        <div data-steps data-active="0" className="steps mt-12">
          <div className="steps-pin">
            <ol className="steps-list">
              {steps.map(({ part, copy, labels }, i) => (
                <li key={part.slug} className="step" data-i={i}>
                  <div className="step-text">
                    <p className="flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.16em] text-red">
                      <span aria-hidden="true" className="grid h-8 w-8 place-items-center rounded-full bg-maroon font-display text-base font-bold tracking-normal text-white">{i + 1}</span>
                      {t.stepLabel} {i + 1}
                    </p>
                    <h3 className="mt-3 font-display text-3xl font-extrabold tracking-[-0.035em] sm:text-4xl">{copy.name}</h3>
                    <p className="mt-2 text-lg text-ink-soft">{copy.outcome}</p>
                    <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2">
                      <StatusBadge status={part.status} />
                      <Link href={partHref(part)} className="text-sm font-semibold text-red underline-offset-4 hover:underline">
                        {t.link}: {copy.name} →
                      </Link>
                    </div>
                  </div>
                  <div className="step-screen" data-i={i}>
                    <div aria-hidden="true">
                      <DeviceFrame variant="window" title={copy.name}>
                        <ScreenMock kind={part.screen} labels={labels} title={copy.name} status={part.status} group={part.group} />
                      </DeviceFrame>
                    </div>
                    <ul aria-label={t.functions} className="mt-5 flex flex-wrap gap-2">
                      {copy.functions.slice(0, 4).map((f) => (
                        <li key={f.name} className="rounded-full bg-blush px-3 py-1 text-sm font-semibold text-maroon ring-1 ring-baby-pink">{f.name}</li>
                      ))}
                    </ul>
                  </div>
                </li>
              ))}
            </ol>
          </div>
          {steps.map(({ part }, i) => (
            <i key={part.slug} className="steps-zone" data-zone={i} style={{ "--z": i } as React.CSSProperties} aria-hidden="true" />
          ))}
        </div>
      </div>
    </section>
  );
}

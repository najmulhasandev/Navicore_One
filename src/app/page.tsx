import Link from "next/link";
import { SITE } from "@/content/site";
import { moduleGroups } from "@/content/module-groups";
import { groupSlugAnchor } from "@/content/messages";
import { getMessages } from "@/i18n/messages";
import { allParts, functionLabels, getCopy, mustGetPart, partHref, partsInGroup, pad2 } from "@/lib/parts";
import { organizationLd, pageMetadata, softwareApplicationLd, websiteLd } from "@/lib/seo";
import { DeviceWall, type WallScreen } from "@/components/DeviceWall";
import { FlowDiagram } from "@/components/FlowDiagram";
import { HeroStatus } from "@/components/HeroStatus";
import { HeroVisual } from "@/components/HeroVisual";
import { ModuleMarquee } from "@/components/ModuleMarquee";
import { SponsorSection } from "@/components/SponsorSection";
import { Icon3D } from "@/components/Icon3D";
import { JsonLd } from "@/components/ui/JsonLd";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { Flow } from "@/content/types";

export const metadata = pageMetadata({
  title: SITE.homeTitle,
  description: SITE.homeDescription,
  path: "/",
  absoluteTitle: true,
});

const wallScreen = (slug: string): WallScreen => {
  const p = mustGetPart(slug);
  return { kind: p.screen, title: getCopy(p).name, labels: functionLabels(p) };
};

/** A shorter run of the guide's own "candidate to active employee" flow: same steps, same order, fewer of them. */
function homeFlow(): Flow {
  const full = mustGetPart("core-employee-flow").flows[0];
  if (!full) throw new Error("core-employee-flow has no flows");
  const wanted = ["Candidate", "Interview", "Offer", "HR approval", "Employee created", "Company account created", "Equipment assigned", "Employee active"];
  const steps = wanted.map((label) => {
    const s = full.steps.find((x) => x.label === label);
    if (!s) throw new Error(`Home flow: step "${label}" not found in the guide flow`);
    return s;
  });
  return { ...full, steps };
}

/** Split a heading into two balanced lines at a word boundary, so each line can enter on its own. */
function splitTitle(t: string): [string, string] {
  const words = t.split(" ");
  let best = 1;
  let bestDiff = Number.POSITIVE_INFINITY;
  for (let i = 1; i < words.length; i++) {
    const diff = Math.abs(words.slice(0, i).join(" ").length - words.slice(i).join(" ").length);
    if (diff < bestDiff) {
      bestDiff = diff;
      best = i;
    }
  }
  return [words.slice(0, best).join(" "), words.slice(best).join(" ")];
}

const stagger = (i: number) => ({ "--i": i }) as React.CSSProperties;

export default function HomePage() {
  const m = getMessages();
  const h = m.home;
  const [line1, line2] = splitTitle(h.hero.title);
  const wallSlugs = ["project-management", "people-directory", "leave-management", "communication", "document-management", "approval-engine", "company-settings", "finance-accounting"];

  return (
    <>
      <JsonLd data={[organizationLd(), websiteLd(), softwareApplicationLd()]} />

      {/* 1. Hero: entrance, aurora, floating devices and pointer tilt (see docs/MOTION.md) */}
      <section data-live="eager" data-tilt-root data-parallax-root className="bg-hero relative overflow-hidden">
        <div className="aurora" aria-hidden="true"><i data-live="eager" /><i data-live="eager" /><i data-live="eager" /></div>
        <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-14 px-4 pb-24 pt-14 sm:px-6 lg:grid-cols-[1fr_1.05fr] lg:gap-8 lg:pb-32 lg:pt-24">
          <div>
            <h1 className="font-display text-5xl font-semibold leading-[1.04] sm:text-6xl xl:text-7xl">
              <span style={stagger(0)} className="hero-in mb-6 flex items-center gap-3 font-sans text-sm font-semibold uppercase tracking-[0.2em] text-maroon sm:text-base">
                <i aria-hidden="true" className="block h-2 w-2 rounded-full bg-red" />
                {h.hero.eyebrow}
              </span>
              <span style={stagger(1)} className="hero-in block">{line1}{" "}</span>
              <span style={stagger(2)} className="hero-in accent-text block">{line2}</span>
            </h1>
            <p style={stagger(3)} className="hero-in mt-8 max-w-xl text-lg leading-relaxed sm:text-xl">{h.hero.sub}</p>
            <div style={stagger(4)} className="hero-in mt-10 flex flex-wrap gap-3">
              <Link href="/contact?intent=demo" className="btn btn-red">{m.nav.bookDemo}</Link>
              <Link href="/os" className="btn btn-outline">{h.modules.all}</Link>
            </div>
            <div style={stagger(5)} className="hero-in"><HeroStatus /></div>
            <p style={stagger(6)} className="hero-in mt-6 max-w-xl text-sm text-ink-soft">{h.hero.note}</p>
          </div>
          <HeroVisual />
        </div>
      </section>

      {/* 1b. Looping band of the 13 module groups */}
      <section className="bg-white py-8" aria-label={h.marquee.label}>
        <ModuleMarquee />
      </section>

      {/* 2. Problem */}
      <section className="bg-white py-20 sm:py-28 defer" aria-labelledby="problem">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading id="problem" eyebrow={h.problem.eyebrow} title={h.problem.title} lead={h.problem.lead} />
          <ul className="mt-12 grid gap-5 md:grid-cols-3">
            {h.problem.cards.map((c, i) => (
              <li key={c.title} data-reveal data-glow style={stagger(i)} className="rounded-3xl bg-blush p-7 ring-1 ring-baby-pink">
                <h3 className="font-display text-xl font-semibold">{c.title}</h3>
                <p className="mt-3 text-ink-soft">{c.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 3. What makes it different */}
      <section className="bg-section-soft py-20 sm:py-28 defer" aria-labelledby="different">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading id="different" eyebrow={h.different.eyebrow} title={h.different.title} lead={h.different.lead} />
          <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {h.different.cards.map((c, i) => {
              const p = mustGetPart(c.slug);
              return (
                <li key={c.title} data-reveal style={stagger(i)}>
                  <Link href={partHref(p)} data-glow className="group flex h-full flex-col rounded-3xl bg-white p-6 shadow-soft ring-1 ring-baby-pink hover:shadow-glow">
                    <h3 className="font-display text-lg font-semibold group-hover:underline">{c.title}</h3>
                    <p className="mt-2 flex-1 text-[0.95rem] text-ink-soft">{c.text}</p>
                    <span className="mt-4 text-sm font-semibold text-red">Part {pad2(p.number)} →</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* 4. Module overview with 3D icons */}
      <section className="bg-white py-20 sm:py-28 defer" aria-labelledby="modules">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading id="modules" eyebrow={h.modules.eyebrow} title={h.modules.title} lead={h.modules.lead} />
          <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {moduleGroups.map((g, i) => (
              <li key={g.id} data-reveal style={stagger(i)}>
                <Link href={`/os#${groupSlugAnchor(g.id)}`} data-glow className="group flex h-full items-center gap-5 rounded-3xl bg-blush p-5 ring-1 ring-baby-pink hover:bg-baby-pink/50 hover:shadow-glow">
                  <Icon3D group={g.id} size={88} className="h-[88px] w-[88px] shrink-0" />
                  <span>
                    <span className="block font-display text-lg font-semibold text-maroon group-hover:underline">{g.name}</span>
                    <span className="mt-1 block text-[0.95rem] leading-snug text-ink-soft">{g.summary}</span>
                    <span className="mt-2 block text-sm font-semibold text-red">{partsInGroup(g.id).length} {h.modules.partsLabel}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-10"><Link href="/os" className="btn btn-maroon">{h.modules.all}</Link></div>
        </div>
      </section>

      {/* 5. Tilted perspective wall of screens */}
      <section className="bg-section-pink overflow-hidden py-20 sm:py-28 defer" aria-labelledby="wall">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading id="wall" eyebrow={h.wall.eyebrow} title={h.wall.title} lead={h.wall.lead} align="center" />
        </div>
        <div data-reveal className="mt-10">
          <DeviceWall screens={wallSlugs.map(wallScreen)} focal={wallScreen("executive-control-center")} />
        </div>
        <p className="mx-auto mt-4 max-w-2xl px-4 text-center text-sm text-ink-soft">{h.wall.caption}</p>
      </section>

      {/* 6. How it works end to end */}
      <section className="bg-white py-20 sm:py-28 defer" aria-labelledby="flow">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading id="flow" eyebrow={h.flow.eyebrow} title={h.flow.title} lead={h.flow.lead} />
          <div data-reveal className="mt-10"><FlowDiagram flow={homeFlow()} /></div>
          <p className="mt-6">
            <Link href="/os/core-employee-flow" className="font-semibold text-red underline underline-offset-4 hover:text-maroon">{h.flow.link} →</Link>
          </p>
        </div>
      </section>

      {/* 6b. Back NAVICORE ONE: facts only, computed from the data */}
      <SponsorSection />

      {/* 7. Partner programme */}
      <section className="bg-section-soft py-20 sm:py-24 defer" aria-labelledby="partner">
        <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 sm:px-6 lg:grid-cols-[1fr_auto]">
          <SectionHeading id="partner" eyebrow={h.partner.eyebrow} title={h.partner.title} lead={h.partner.text} />
          <div className="lg:justify-self-end"><Link href="/partners" className="btn btn-outline">{h.partner.cta}</Link></div>
        </div>
      </section>

      {/* 8. Final CTA */}
      <section className="mx-auto mt-4 max-w-7xl px-4 sm:px-6" aria-labelledby="final">
        <div className="rounded-[2rem] bg-maroon px-6 py-14 text-center text-white sm:px-12 sm:py-20">
          <h2 id="final" className="font-display text-4xl font-semibold !text-white sm:text-5xl">{h.final.title}</h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-baby-pink">{h.final.text}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/contact?intent=demo" className="btn btn-light">{m.nav.bookDemo}</Link>
            <Link href="/partners" className="btn btn-on-maroon">{m.nav.becomePartner}</Link>
          </div>
          <p className="mx-auto mt-8 max-w-xl text-sm text-baby-pink">{allParts.length} parts · {moduleGroups.length} groups · {SITE.fullName}</p>
        </div>
      </section>
    </>
  );
}

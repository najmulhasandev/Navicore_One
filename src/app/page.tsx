import Link from "next/link";
import { SITE } from "@/content/site";
import { getMessages } from "@/i18n/messages";
import { functionLabels, getCopy, mustGetPart } from "@/lib/parts";
import { organizationLd, pageMetadata, softwareApplicationLd, websiteLd } from "@/lib/seo";
import { CompareTable } from "@/components/CompareTable";
import { CoreDiagram } from "@/components/CoreDiagram";
import { DeviceWall, type WallScreen } from "@/components/DeviceWall";
import { FeatureBento } from "@/components/FeatureBento";
import { HeroStatus } from "@/components/HeroStatus";
import { HeroVisual } from "@/components/HeroVisual";
import { HomeFaq } from "@/components/HomeFaq";
import { HowItWorks } from "@/components/HowItWorks";
import { ModuleMarquee } from "@/components/ModuleMarquee";
import { SponsorSection } from "@/components/SponsorSection";
import { StatusStrip } from "@/components/StatusStrip";
import { JsonLd } from "@/components/ui/JsonLd";
import { SectionHeading } from "@/components/ui/SectionHeading";

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

/** Three columns of three illustrative screens, plus one straight focal screen: ten in all. */
const WALL_COLUMNS = [
  ["project-management", "leave-management", "finance-accounting"],
  ["people-directory", "document-management", "time-tracking"],
  ["communication", "approval-engine", "company-settings"],
] as const;

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

  return (
    <>
      <JsonLd data={[organizationLd(), websiteLd(), softwareApplicationLd()]} />

      {/* 1. Hero: dark maroon, aurora, two-tone headline, trust chips, three floating devices (see docs/MOTION.md) */}
      <section data-live="eager" data-tilt-root data-parallax-root className="bg-dark on-dark relative overflow-hidden text-white">
        <div className="aurora" aria-hidden="true"><i data-live="eager" /><i data-live="eager" /><i data-live="eager" /></div>
        <div className="relative z-10 mx-auto max-w-7xl px-4 pb-20 pt-14 text-center sm:px-6 lg:pb-28 lg:pt-20">
          <h1 className="mx-auto max-w-6xl font-display text-[clamp(2.6rem,9.2vw,7rem)] font-extrabold leading-[0.98] tracking-[-0.05em] text-white">
            <span style={stagger(0)} className="hero-in mb-7 inline-flex items-center gap-3 rounded-full bg-white/10 px-4 py-2 font-sans text-xs font-semibold uppercase leading-none tracking-[0.2em] text-baby-pink ring-1 ring-white/25 sm:text-sm">
              <i aria-hidden="true" className="block h-2 w-2 rounded-full bg-red ring-2 ring-baby-pink/60" />
              {h.hero.eyebrow}
            </span>
            <span style={stagger(1)} className="hero-in block">{line1}{" "}</span>
            <span style={stagger(2)} className="hero-in block text-baby-pink">{line2}</span>
          </h1>
          <p style={stagger(3)} className="hero-in mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-baby-pink sm:text-xl">{h.hero.sub}</p>
          <div style={stagger(4)} className="hero-in mt-10 flex flex-wrap justify-center gap-3">
            <Link href="/contact?intent=demo" className="btn btn-red">{m.nav.bookDemo}</Link>
            <Link href="#build-status" className="btn btn-on-maroon">{h.hero.secondary}</Link>
          </div>
          <div style={stagger(5)} className="hero-in"><HeroStatus /></div>
          <p style={stagger(6)} className="hero-in mx-auto mt-6 max-w-2xl text-sm text-baby-pink">{h.hero.note}</p>
          <HeroVisual />
        </div>
      </section>

      {/* 2. Marquee: product facts and module groups */}
      <div className="bg-white py-8">
        <ModuleMarquee />
      </div>

      {/* 3. How it works: three Live areas, pinned stage with crossfading screens on desktop */}
      <HowItWorks />

      {/* 4. Tilted wall: dark band, ten illustrative screens, one straight focal screen */}
      <section className="defer [--cis-m:790px] [--cis-d:926px] bg-dark on-dark overflow-hidden py-20 sm:py-28" aria-labelledby="wall">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading id="wall" eyebrow={h.wall.eyebrow} title={h.wall.title} lead={h.wall.lead} align="center" tone="dark" />
        </div>
        <div data-reveal className="-mt-6 sm:mt-0 lg:-mt-10">
          <DeviceWall columns={WALL_COLUMNS.map((c) => c.map(wallScreen))} focal={wallScreen("executive-control-center")} />
        </div>
        <p className="mx-auto mt-4 max-w-2xl px-4 text-center text-sm text-baby-pink">{h.wall.caption}</p>
      </section>

      {/* 5. Shared core diagram */}
      <CoreDiagram />

      {/* 6. Feature bento: computed numbers and the "what makes it different" tiles */}
      <FeatureBento />

      {/* 7. Separate tools vs NAVICORE ONE */}
      <CompareTable />

      {/* 8. Build status and roadmap timeline */}
      <StatusStrip />

      {/* 9. Back NAVICORE ONE: facts only, only the founder is named */}
      <SponsorSection />

      {/* 10. FAQ and final call to action */}
      <HomeFaq />
      <section className="bg-blush px-4 pb-20 pt-4 sm:px-6 sm:pb-28" aria-labelledby="final">
        <div className="bg-dark on-dark relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] px-6 py-16 text-center sm:px-12 sm:py-24">
          <div className="aurora" aria-hidden="true"><i data-live="lazy" /><i data-live="lazy" /><i data-live="lazy" /></div>
          <div className="relative z-10">
            <h2 id="final" data-reveal className="mx-auto max-w-4xl font-display text-[clamp(2.4rem,6.5vw,5rem)] font-extrabold leading-[1.02] tracking-[-0.045em] text-white">{h.final.title}</h2>
            <p data-reveal style={stagger(1)} className="mx-auto mt-5 max-w-xl text-lg text-baby-pink sm:text-xl">{h.final.text}</p>
            <div data-reveal style={stagger(2)} className="mt-9 flex flex-wrap justify-center gap-3">
              <Link href="/contact?intent=demo" className="btn btn-red">{m.nav.bookDemo}</Link>
              <Link href="/partners" className="btn btn-on-maroon">{m.nav.becomePartner}</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

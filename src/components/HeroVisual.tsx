import { getMessages } from "@/i18n/messages";
import { functionLabels, getCopy, mustGetPart } from "@/lib/parts";
import { FloatingCard } from "./FloatingCard";
import HeroSceneGate from "./HeroSceneGate";
import { DeviceFrame } from "./mock/DeviceFrame";
import { ScreenMock } from "./mock/ScreenMock";

/**
 * Hero: three overlapping devices, fanned out, each drifting slightly and shifting at its own depth on scroll.
 * Drawn in HTML/CSS (no images), with a fixed aspect ratio so nothing moves while the page loads.
 * The optional 3D layer (HeroSceneGate) sits behind them on capable devices only.
 */
export function HeroVisual() {
  const m = getMessages();
  const exec = mustGetPart("executive-control-center");
  const projects = mustGetPart("project-management");
  const chat = mustGetPart("communication");
  const approvals = mustGetPart("approval-engine");
  const audit = mustGetPart("audit-system");

  return (
    <div className="relative mx-auto w-full max-w-[42rem]">
      <div className="relative aspect-[5/4]">
        <HeroSceneGate />

        <FloatingCard bare className="absolute left-[15%] top-[7%] z-10 w-[72%]" depth={0.12} duration={9} amp={8}>
          <DeviceFrame variant="laptop">
            <ScreenMock kind={exec.screen} labels={functionLabels(exec)} title={getCopy(exec).name} />
          </DeviceFrame>
        </FloatingCard>

        <FloatingCard bare className="absolute bottom-[3%] left-0 z-20 w-[41%]" depth={0.4} delay={0.8} duration={8} amp={12} rot={-5}>
          <DeviceFrame variant="tablet">
            <ScreenMock kind={projects.screen} labels={functionLabels(projects)} title={getCopy(projects).name} />
          </DeviceFrame>
        </FloatingCard>

        <FloatingCard bare className="absolute -bottom-[1%] right-[1%] z-20 w-[21%]" depth={0.65} delay={1.6} duration={7} amp={14} rot={5}>
          <DeviceFrame variant="phone">
            <ScreenMock kind={chat.screen} labels={functionLabels(chat)} compact />
          </DeviceFrame>
        </FloatingCard>

        <FloatingCard className="absolute right-0 top-[1%] z-30 hidden sm:block" depth={0.5} delay={0.4} duration={8} rot={3} cardClassName="px-4 py-2.5 text-sm font-semibold text-maroon">
          {getCopy(approvals).name}
        </FloatingCard>
        <FloatingCard className="absolute left-[3%] top-[30%] z-30 hidden sm:block" depth={0.3} delay={1.1} duration={9} rot={-3} cardClassName="px-4 py-2.5 text-sm font-semibold text-maroon">
          {getCopy(audit).name}
        </FloatingCard>
      </div>
      <p className="mt-5 text-center text-xs text-ink-soft">{m.home.hero.caption}</p>
    </div>
  );
}

import { moduleGroups } from "@/content/module-groups";
import { getMessages } from "@/i18n/messages";
import { functionLabels, getCopy, mustGetPart } from "@/lib/parts";
import { FloatingCard } from "./FloatingCard";
import HeroSceneGate from "./HeroSceneGate";
import { DeviceFrame } from "./mock/DeviceFrame";
import { ScreenMock } from "./mock/ScreenMock";

const chip = "px-4 py-2.5 text-sm font-semibold text-maroon";

/**
 * Hero: three overlapping devices, fanned out, each floating with its own amplitude and phase,
 * tilting slightly toward the pointer, and drifting at its own depth on scroll. Five chips float at three depths.
 * Drawn in HTML/CSS (no images) with a fixed aspect ratio, so nothing moves while the page loads.
 * The optional 3D layer (HeroSceneGate) sits behind them on capable devices only.
 * The whole cluster is decorative: hidden from assistive technology, and the page text carries the meaning.
 */
export function HeroVisual() {
  const m = getMessages();
  const exec = mustGetPart("executive-control-center");
  const projects = mustGetPart("project-management");
  const chat = mustGetPart("communication");
  const approvals = mustGetPart("approval-engine");
  const audit = mustGetPart("audit-system");
  const group = (id: string) => moduleGroups.find((g) => g.id === id)?.name ?? id;

  return (
    <div className="relative mx-auto w-full max-w-[44rem]">
      <div aria-hidden="true" className="relative aspect-[5/4]">
        <HeroSceneGate />

        {/* far depth */}
        <FloatingCard className="absolute left-[44%] top-[-3%] z-0 hidden opacity-80 sm:block" depth={0.15} tilt={0.35} shift={5} amp={12} duration={11} delay={-3} rot={-2} enter={5} cardClassName={chip}>
          {group("people")}
        </FloatingCard>
        <FloatingCard className="absolute bottom-[12%] left-[49%] z-0 hidden opacity-80 sm:block" depth={0.15} tilt={0.35} shift={5} amp={12} duration={10} delay={-6} rot={2} enter={6} cardClassName={chip}>
          {group("finance")}
        </FloatingCard>

        {/* devices */}
        <FloatingCard bare className="absolute left-[15%] top-[7%] z-10 w-[72%]" depth={0.12} tilt={1} shift={14} duration={9} delay={0} amp={12} enter={1}>
          <DeviceFrame variant="laptop">
            <ScreenMock kind={exec.screen} labels={functionLabels(exec)} title={getCopy(exec).name} />
          </DeviceFrame>
        </FloatingCard>

        <FloatingCard bare className="absolute bottom-[3%] left-0 z-20 w-[41%]" depth={0.4} tilt={0.85} shift={20} delay={-2.4} duration={8} amp={18} rot={-5} enter={2}>
          <DeviceFrame variant="tablet">
            <ScreenMock kind={projects.screen} labels={functionLabels(projects)} title={getCopy(projects).name} />
          </DeviceFrame>
        </FloatingCard>

        <FloatingCard bare className="absolute -bottom-[1%] right-[1%] z-20 w-[21%]" depth={0.65} tilt={0.7} shift={26} delay={-4.6} duration={7} amp={22} rot={5} enter={3}>
          <DeviceFrame variant="phone">
            <ScreenMock kind={chat.screen} labels={functionLabels(chat)} compact />
          </DeviceFrame>
        </FloatingCard>

        {/* near depth chips */}
        <FloatingCard className="absolute right-0 top-[1%] z-30 hidden sm:block" depth={0.7} tilt={0.6} shift={30} delay={-1.2} duration={8} amp={16} rot={3} enter={4} cardClassName={chip}>
          {getCopy(approvals).name}
        </FloatingCard>
        <FloatingCard className="absolute left-[3%] top-[30%] z-30 hidden sm:block" depth={0.45} tilt={0.6} shift={24} delay={-5} duration={9} amp={14} rot={-3} enter={5} cardClassName={chip}>
          {getCopy(audit).name}
        </FloatingCard>
        <FloatingCard className="absolute bottom-[-4%] left-[40%] z-30 hidden sm:block" depth={0.7} tilt={0.6} shift={30} delay={-2} duration={7} amp={16} rot={2} enter={6} cardClassName={chip}>
          {group("insight")}
        </FloatingCard>
      </div>
      <p className="mt-9 text-center text-xs text-ink-soft">{m.home.hero.caption}</p>
    </div>
  );
}

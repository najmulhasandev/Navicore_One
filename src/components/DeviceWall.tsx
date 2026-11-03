import type { ScreenKind } from "@/content/types";
import { DeviceFrame } from "./mock/DeviceFrame";
import { ScreenMock } from "./mock/ScreenMock";

export interface WallScreen {
  kind: ScreenKind;
  title: string;
  labels: readonly string[];
}

interface DeviceWallProps {
  /** Columns of tilted screens. Together with the focal screen the wall shows at most 10 screens. */
  columns: readonly (readonly WallScreen[])[];
  /** The one screen shown straight on, at the centre. */
  focal: WallScreen;
}

/**
 * "Every screen": a tilted perspective wall (CSS perspective + rotateX/rotateZ) built from columns that drift up and
 * down in opposite directions, with one straight focal screen in the middle and an edge mask that fades the wall
 * into the maroon band. Built from DOM mock screens (no image bytes, no layout shift).
 * Decorative: hidden from assistive technology; the section text carries the meaning.
 */
export function DeviceWall({ columns, focal }: DeviceWallProps) {
  const total = columns.reduce((n, c) => n + c.length, 0) + 1;
  if (total > 10) throw new Error("DeviceWall shows at most 10 screens");

  return (
    <div aria-hidden="true" className="relative mx-auto h-[30rem] w-full max-w-7xl overflow-hidden sm:h-[38rem] lg:h-[46rem]">
      <div data-live="lazy" data-tilt-root className="wall absolute inset-0 grid place-items-center [--wall-scale:0.52] sm:[--wall-scale:0.74] lg:[--wall-scale:1]">
        <div className="wall-plane flex w-[68rem] items-start gap-8">
          {columns.map((col, ci) => (
            <div key={ci} data-live="lazy" className={`wall-col ${ci % 2 === 0 ? "wall-col-up" : "wall-col-down"} flex min-w-0 flex-1 flex-col gap-8`}>
              {col.map((s) => (
                <DeviceFrame key={s.title} variant="window" compact title={s.title}>
                  <ScreenMock kind={s.kind} labels={s.labels} />
                </DeviceFrame>
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="absolute left-1/2 top-1/2 z-10 w-[12.5rem] -translate-x-1/2 -translate-y-1/2 sm:w-[24rem] lg:w-[33rem]">
        <div className="rounded-[1.4rem] bg-white/15 p-2 shadow-glow ring-1 ring-white/30 backdrop-blur-sm">
          <DeviceFrame variant="window" compact title={focal.title}>
            <ScreenMock kind={focal.kind} labels={focal.labels} />
          </DeviceFrame>
        </div>
      </div>
    </div>
  );
}

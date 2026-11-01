import type { ScreenKind } from "@/content/types";
import { DeviceFrame } from "./mock/DeviceFrame";
import { ScreenMock } from "./mock/ScreenMock";

export interface WallScreen {
  kind: ScreenKind;
  title: string;
  labels: readonly string[];
}

interface DeviceWallProps {
  /** Tilted screens behind the focal one. With the focal screen the wall shows at most 10 screens. */
  screens: readonly WallScreen[];
  /** The one screen shown straight on, at the centre. */
  focal: WallScreen;
}

/**
 * "Every screen": a tilted perspective wall (CSS perspective + rotateX/rotateZ) with one straight
 * focal screen in the middle and a gradient mask that fades the edges into the page.
 * Built from DOM mock screens, so it costs no image bytes and cannot shift layout.
 * Decorative: hidden from assistive technology; the section text carries the meaning.
 */
export function DeviceWall({ screens, focal }: DeviceWallProps) {
  const tiles = screens.slice(0, 8);
  const total = tiles.length + 1;
  if (total > 10) throw new Error("DeviceWall shows at most 10 screens");
  // 3 x 3 grid: the 9th cell (centre) belongs to the focal screen.
  const grid = [...tiles.slice(0, 4), null, ...tiles.slice(4, 8)];

  return (
    <div aria-hidden="true" className="relative mx-auto h-[26rem] w-full max-w-6xl overflow-hidden sm:h-[34rem] lg:h-[40rem]">
      <div data-live="lazy" data-tilt-root className="wall absolute inset-0 grid place-items-center [--wall-scale:0.62] sm:[--wall-scale:0.85] lg:[--wall-scale:1]">
        <div className="wall-plane grid w-[64rem] grid-cols-3 gap-8">
          {grid.map((s, i) =>
            s ? (
              <DeviceFrame key={s.title} variant="window" title={s.title} className="opacity-95">
                <ScreenMock kind={s.kind} labels={s.labels} />
              </DeviceFrame>
            ) : (
              <div key={`gap-${i}`} />
            ),
          )}
        </div>
      </div>
      <div className="absolute left-1/2 top-1/2 z-10 w-[17rem] -translate-x-1/2 -translate-y-1/2 sm:w-[24rem] lg:w-[30rem]">
        <div className="rounded-[1.4rem] bg-white/60 p-2 shadow-glow backdrop-blur-sm">
          <DeviceFrame variant="window" title={focal.title}>
            <ScreenMock kind={focal.kind} labels={focal.labels} />
          </DeviceFrame>
        </div>
      </div>
    </div>
  );
}

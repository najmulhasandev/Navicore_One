"use client";

import dynamic from "next/dynamic";
import { Component, type ReactNode, useEffect, useRef, useState } from "react";

// ssr:false + dynamic import: three.js is a separate chunk that is only ever requested if every check below passes.
const HeroScene3D = dynamic(() => import("./HeroScene3D"), { ssr: false });

interface ConnectionInfo {
  saveData?: boolean;
  effectiveType?: string;
}
type NavigatorHints = Navigator & { connection?: ConnectionInfo; deviceMemory?: number };

/** Capable = large screen, motion allowed, no data-saver, decent connection, enough CPU/RAM, and WebGL works. */
function deviceIsCapable(): boolean {
  const mq = (q: string) => window.matchMedia(q).matches;
  if (!mq("(min-width: 1024px)")) return false;
  if (document.documentElement.getAttribute("data-motion") !== "full") return false;
  const nav = navigator as NavigatorHints;
  if (nav.connection?.saveData) return false;
  if (nav.connection?.effectiveType && /(^|-)(2g|3g)$/.test(nav.connection.effectiveType)) return false;
  if ((nav.hardwareConcurrency ?? 4) < 4) return false;
  if ((nav.deviceMemory ?? 8) < 4) return false;
  try {
    const c = document.createElement("canvas");
    const gl = (c.getContext("webgl2") ?? c.getContext("webgl")) as WebGLRenderingContext | null;
    if (!gl) return false;
    gl.getExtension("WEBGL_lose_context")?.loseContext();
  } catch {
    return false;
  }
  return true;
}

/** If the 3D layer ever fails (context lost, driver issue), drop it silently; the static hero is already on screen. */
class SceneBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  override state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  override render() {
    return this.state.failed ? null : this.props.children;
  }
}

/**
 * Decorative 3D layer behind the hero devices. Renders nothing on the server and nothing on devices that
 * are not capable. The static fanned-device hero is always there, so removing this changes nothing about content.
 */
export default function HeroSceneGate() {
  const box = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [visible, setVisible] = useState(true);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let idle: number | undefined;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const start = () => {
      if (!cancelled && deviceIsCapable()) setEnabled(true);
    };
    if ("requestIdleCallback" in window) idle = window.requestIdleCallback(start, { timeout: 2500 });
    else timer = setTimeout(start, 1500);


    return () => {
      cancelled = true;
      if (idle !== undefined) window.cancelIdleCallback(idle);
      if (timer) clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    if (!enabled || !box.current) return;
    const io = new IntersectionObserver(([e]) => setVisible(Boolean(e?.isIntersecting)));
    io.observe(box.current);
    return () => io.disconnect();
  }, [enabled]);

  return (
    <div
      ref={box}
      aria-hidden="true"
      data-hero-3d={enabled ? (shown ? "on" : "loading") : "off"}
      className={`pointer-events-none absolute -inset-[8%] transition-opacity duration-700 [mask-image:radial-gradient(closest-side,#000_62%,transparent_100%)] ${shown ? "opacity-100" : "opacity-0"}`}
    >
      {enabled ? (
        <SceneBoundary>
          <HeroScene3D active={visible} onReady={() => setShown(true)} />
        </SceneBoundary>
      ) : null}
    </div>
  );
}

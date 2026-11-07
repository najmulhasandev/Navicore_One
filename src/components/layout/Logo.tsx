import Link from "next/link";
import { BRAND } from "@/content/brand";

/**
 * Official NAVICORE ONE logo. The light theme uses the SVG masters (wordmark outlined, so they render the same
 * everywhere; the white variant sits on the maroon footer). The dark theme uses the cyan lockup (WebP, transparent).
 * Both <img> are in the markup and CSS shows one (.logo-light / .logo-dark in globals.css); the one that is not
 * shown is lazy, so it is never fetched. A plain <img> is used on purpose: next/image does not optimise SVG.
 */
export function Logo({ className = "", onDark = false, priority = false }: { className?: string; onDark?: boolean; priority?: boolean }) {
  const light = onDark ? BRAND.logo.onDark : BRAND.logo.onLight;
  const dark = BRAND.logo.darkTheme;
  return (
    <Link href="/" className={`inline-flex items-center ${onDark ? "" : "hdr-logo"} ${className}`} aria-label={`${BRAND.name} home`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={light.src}
        width={light.width}
        height={light.height}
        alt=""
        decoding="async"
        loading={onDark ? "lazy" : undefined}
        fetchPriority={priority ? "high" : "auto"}
        className={`logo-light shrink-0 w-auto ${onDark ? "h-20 md:h-24" : "h-14 md:h-16"}`}
        draggable={false}
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={dark.src}
        width={dark.width}
        height={dark.height}
        alt=""
        decoding="async"
        loading="lazy"
        className={`logo-dark shrink-0 w-auto ${onDark ? "h-16 md:h-[4.75rem]" : "h-12 md:h-14"}`}
        draggable={false}
      />
    </Link>
  );
}

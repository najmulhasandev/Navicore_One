import Link from "next/link";
import { BRAND } from "@/content/brand";

/**
 * Official NAVICORE ONE logo (SVG master, wordmark outlined, so it renders the same everywhere).
 * `onDark` uses the white variant for the maroon footer. A plain <img> is used on purpose:
 * next/image does not optimise SVG, and these files are about 9 KB each.
 */
export function Logo({ className = "", onDark = false, priority = false }: { className?: string; onDark?: boolean; priority?: boolean }) {
  const asset = onDark ? BRAND.logo.onDark : BRAND.logo.onLight;
  return (
    <Link href="/" className={`inline-flex items-center ${onDark ? "" : "hdr-logo"} ${className}`} aria-label={`${BRAND.name} home`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={asset.src}
        width={asset.width}
        height={asset.height}
        alt=""
        decoding="async"
        fetchPriority={priority ? "high" : "auto"}
        className={onDark ? "h-20 w-auto shrink-0 md:h-24" : "h-14 w-auto shrink-0 md:h-16"}
        draggable={false}
      />
    </Link>
  );
}

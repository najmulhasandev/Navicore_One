import Image from "next/image";
import Link from "next/link";
import { BRAND } from "@/content/brand";

/** Official NAVICORE ONE logo. `onDark` uses the white variant for the maroon footer. */
export function Logo({ className = "", onDark = false, priority = false }: { className?: string; onDark?: boolean; priority?: boolean }) {
  const asset = onDark ? BRAND.logo.onDark : BRAND.logo.onLight;
  return (
    <Link href="/" className={`inline-flex items-center ${className}`} aria-label={`${BRAND.name} home`}>
      <Image
        src={asset.src}
        width={asset.width}
        height={asset.height}
        alt={BRAND.name}
        priority={priority}
        sizes="(min-width: 768px) 240px, 160px"
        className={onDark ? "h-16 w-auto shrink-0 md:h-20" : "h-12 w-auto shrink-0 md:h-[3.75rem]"}
      />
    </Link>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/** Phone-only "Book a demo" bar. Hidden on the contact page, where the form is the call to action. */
export function StickyCta({ label }: { label: string }) {
  const pathname = usePathname();
  if (pathname.startsWith("/contact")) return null;
  return (
    <aside aria-label={label} className="sticky-cta fixed inset-x-0 bottom-0 z-30 border-t border-baby-pink bg-surface/95 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur md:hidden">
      <Link href="/contact?intent=demo" className="btn btn-red w-full">
        {label}
      </Link>
    </aside>
  );
}

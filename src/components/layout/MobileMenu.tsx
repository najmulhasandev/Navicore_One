"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

interface Item {
  href: string;
  label: string;
}

/**
 * Phone menu: a native <details>, so it opens without any script.
 * The only JavaScript is closing it again after a navigation (the header persists between pages).
 */
export function MobileMenu({ items, cta, menuLabel }: { items: readonly Item[]; cta: Item; menuLabel: string }) {
  const ref = useRef<HTMLDetailsElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (ref.current) ref.current.open = false;
  }, [pathname]);

  return (
    <details ref={ref} className="relative md:hidden">
      <summary
        className="flex min-h-12 min-w-12 items-center justify-center rounded-full bg-surface px-4 text-sm font-semibold text-maroon ring-1 ring-baby-pink"
        aria-label={menuLabel}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true" className="mr-2">
          <path d="M4 7h16M4 12h16M4 17h16" />
        </svg>
        {menuLabel}
      </summary>
      <nav
        aria-label={menuLabel}
        className="absolute right-0 top-14 z-50 w-[min(18rem,calc(100vw-2rem))] rounded-3xl bg-surface p-3 shadow-float ring-1 ring-baby-pink"
      >
        <ul className="flex flex-col">
          {items.map((it) => (
            <li key={it.href}>
              <Link href={it.href} className="block rounded-2xl px-4 py-3 text-base font-semibold text-maroon hover:bg-baby-pink/60">
                {it.label}
              </Link>
            </li>
          ))}
        </ul>
        <Link href={cta.href} className="btn btn-red mt-2 w-full">
          {cta.label}
        </Link>
      </nav>
    </details>
  );
}

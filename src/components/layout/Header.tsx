import Link from "next/link";
import { getMessages } from "@/i18n/messages";
import { Logo } from "./Logo";
import { MobileMenu } from "./MobileMenu";

/**
 * Sticky glass header. It keeps a fixed 72 px footprint (no layout shift) and "condenses" on scroll with
 * transforms only: the glass bar scales to about 58 px and the content lifts into it (see motion.css).
 */
export function Header() {
  const m = getMessages();
  const items = [
    { href: "/os", label: m.nav.product },
    { href: "/partners", label: m.nav.partners },
    { href: "/contact", label: m.nav.contact },
  ];
  const cta = { href: "/contact?intent=demo", label: m.nav.bookDemo };

  return (
    <header className="hdr sticky top-0 z-40 h-[4.5rem]">
      <div className="hdr-bg" aria-hidden="true" />
      <div className="hdr-inner relative mx-auto flex h-[4.5rem] max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <Logo priority />
        <nav aria-label="Main" className="hidden items-center gap-2 md:flex">
          {items.map((it) => (
            <Link key={it.href} href={it.href} className="nav-link px-3 py-2 text-[0.95rem] font-semibold text-maroon hover:text-red">
              {it.label}
            </Link>
          ))}
          <Link href={cta.href} className="btn btn-red btn-sm ml-3">
            {cta.label}
          </Link>
        </nav>
        <MobileMenu items={items} cta={cta} menuLabel={m.nav.menu} />
      </div>
    </header>
  );
}

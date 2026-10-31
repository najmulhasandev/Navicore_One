import Link from "next/link";
import { getMessages } from "@/i18n/messages";
import { Logo } from "./Logo";
import { MobileMenu } from "./MobileMenu";

export function Header() {
  const m = getMessages();
  const items = [
    { href: "/os", label: m.nav.product },
    { href: "/partners", label: m.nav.partners },
    { href: "/contact", label: m.nav.contact },
  ];
  const cta = { href: "/contact?intent=demo", label: m.nav.bookDemo };

  return (
    <header className="sticky top-0 z-40 border-b border-baby-pink bg-blush/90 backdrop-blur">
      <div className="mx-auto flex h-[4.5rem] max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <Logo priority />
        <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
          {items.map((it) => (
            <Link key={it.href} href={it.href} className="rounded-full px-4 py-2 text-[0.95rem] font-semibold text-maroon hover:bg-baby-pink/70">
              {it.label}
            </Link>
          ))}
          <Link href={cta.href} className="btn btn-red btn-sm ml-2">
            {cta.label}
          </Link>
        </nav>
        <MobileMenu items={items} cta={cta} menuLabel={m.nav.menu} />
      </div>
    </header>
  );
}

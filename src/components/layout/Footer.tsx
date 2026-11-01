import Link from "next/link";
import { SITE } from "@/content/site";
import { moduleGroups } from "@/content/module-groups";
import { groupSlugAnchor } from "@/content/messages";
import { getMessages } from "@/i18n/messages";
import { MotionToggle } from "@/components/motion/MotionToggle";
import { Logo } from "./Logo";

export function Footer() {
  const m = getMessages();
  return (
    <footer className="mt-24 bg-maroon pb-28 pt-14 text-white md:pb-12">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[1.2fr_1.6fr_1fr]">
        <div>
          <Logo onDark />
          <p className="mt-5 max-w-sm text-baby-pink">{SITE.fullName}.</p>
          <p className="mt-2 max-w-sm font-display text-lg text-white">{SITE.tagline}</p>
        </div>

        <nav aria-label={m.footer.product}>
          <h2 className="font-display text-lg font-semibold !text-white">{m.footer.product}</h2>
          <ul className="mt-4 grid gap-x-8 gap-y-2 text-[0.95rem] sm:grid-cols-2">
            {moduleGroups.map((g) => (
              <li key={g.id}>
                <Link href={`/os#${groupSlugAnchor(g.id)}`} className="text-baby-pink underline-offset-4 hover:text-white hover:underline">
                  {g.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label={m.footer.company}>
          <h2 className="font-display text-lg font-semibold !text-white">{m.footer.company}</h2>
          <ul className="mt-4 space-y-2 text-[0.95rem]">
            <li>
              <a href={SITE.orgUrl} rel="noopener" className="text-baby-pink underline-offset-4 hover:text-white hover:underline">
                {m.footer.companyLink}
              </a>
            </li>
            <li>
              <Link href="/partners" className="text-baby-pink underline-offset-4 hover:text-white hover:underline">{m.nav.partners}</Link>
            </li>
            <li>
              <Link href="/contact" className="text-baby-pink underline-offset-4 hover:text-white hover:underline">{m.footer.contact}</Link>
            </li>
            <li>
              <Link href="/privacy" className="text-baby-pink underline-offset-4 hover:text-white hover:underline">{m.footer.privacy}</Link>
            </li>
          </ul>
        </nav>
      </div>
      <div className="mx-auto mt-12 flex max-w-7xl flex-wrap items-center justify-between gap-4 border-t border-white/20 px-4 pt-6 sm:px-6">
        <p className="max-w-3xl text-sm text-baby-pink">{m.footer.disclaimer}</p>
        <MotionToggle labels={m.footer.motion} />
      </div>
    </footer>
  );
}

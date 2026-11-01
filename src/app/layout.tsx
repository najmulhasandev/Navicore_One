import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { fontBody, fontDisplay } from "./fonts";
import { BRAND } from "@/content/brand";
import { SITE } from "@/content/site";
import { getMessages } from "@/i18n/messages";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { StickyCta } from "@/components/layout/StickyCta";
import { MotionController } from "@/components/motion/MotionController";
import { motionInitScript } from "@/lib/motion-init";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: SITE.homeTitle, template: `%s | ${SITE.name}` },
  description: SITE.homeDescription,
  applicationName: SITE.name,
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 } },
  verification: process.env.GOOGLE_SITE_VERIFICATION ? { google: process.env.GOOGLE_SITE_VERIFICATION } : undefined,
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: BRAND.theme.color,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  const m = getMessages();
  return (
    <html lang="en" className={`${fontDisplay.variable} ${fontBody.variable}`} suppressHydrationWarning>
      <head>
        {/* Sets data-motion before first paint. See src/lib/motion-init.ts. */}
        <script dangerouslySetInnerHTML={{ __html: motionInitScript }} />
      </head>
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-maroon focus:px-5 focus:py-3 focus:font-semibold focus:text-white"
        >
          {m.skip}
        </a>
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <StickyCta label={m.nav.bookDemo} />
        <MotionController />
      </body>
    </html>
  );
}

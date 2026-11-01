import type { Metadata } from "next";

// Canonical host is www: navicore.co and navicore.com.bd both 308 to their www versions.
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.navicore.co"
).replace(/\/$/, "");

export const siteConfig = {
  name: "NAVICORE",
  legalName: "NAVICORE",
  tagline: "Innovating Journeys, Building Futures.",
  // Always pair the brand with a descriptor. "navicore" alone collides with other products/companies.
  description:
    "NAVICORE is a Bangladesh technology company building RailMate, NAVICORE OS and custom software, automation and platform audits.",
  locale: "en_BD",
  defaultOgImage: "/og/default.png", // 1200x630, place in /public/og/
  // Public attribution policy: only the founder named below appears in public markup and JSON-LD.
  founders: [{ name: "Najmul Hasan", jobTitle: "Founder & CEO" }],
  // Verified profile URLs only (LinkedIn company page, GitHub org, Play developer page).
  sameAs: [] as string[],
} as const;

export type RouteSeo = {
  path: string;
  title: string; // < 60 chars
  description: string; // < 155 chars
  lastModified: string; // ISO date; bump only when content really changes
  changeFrequency: "daily" | "weekly" | "monthly" | "yearly";
  priority: number;
  indexable: boolean;
};

/**
 * Routes of www.navicore.co only (confirmed in Search Console: /, /ventures, /privacy).
 * software., about., os., najmulhasan., profile. are separate hosts:
 * each needs its own seo.config.ts, sitemap.ts and robots.ts.
 */
export const routes: Record<string, RouteSeo> = {
  home: {
    path: "/",
    title: "NAVICORE | Technology Company in Bangladesh",
    description: siteConfig.description,
    lastModified: "2026-10-16",
    changeFrequency: "monthly",
    priority: 1,
    indexable: true,
  },
  ventures: {
    path: "/ventures",
    title: "NAVICORE Ventures | RailMate & NAVICORE Software",
    description:
      "The NAVICORE ecosystem: RailMate Bangladesh for rail travel and NAVICORE Software for custom apps, automation and audits.",
    lastModified: "2026-10-16",
    changeFrequency: "monthly",
    priority: 0.8,
    indexable: true,
  },
  privacy: {
    path: "/privacy",
    title: "Privacy Policy | NAVICORE",
    description: "How NAVICORE collects, uses and protects your information.",
    lastModified: "2026-10-16",
    changeFrequency: "yearly",
    priority: 0.2,
    indexable: true,
  },
};

export function absoluteUrl(path = "/"): string {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

/** Use inside each page: export const metadata = buildMetadata(routes.railmate) */
export function buildMetadata(route: RouteSeo): Metadata {
  const url = absoluteUrl(route.path);
  return {
    metadataBase: new URL(SITE_URL),
    title: route.title,
    description: route.description,
    alternates: { canonical: url },
    robots: route.indexable
      ? { index: true, follow: true }
      : { index: false, follow: false },
    openGraph: {
      type: "website",
      url,
      siteName: siteConfig.name,
      title: route.title,
      description: route.description,
      locale: siteConfig.locale,
      images: [{ url: siteConfig.defaultOgImage, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: route.title,
      description: route.description,
      images: [siteConfig.defaultOgImage],
    },
  };
}

/** Render once in the root layout via <JsonLd data={organizationJsonLd} /> */
export const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${SITE_URL}/#organization`,
  name: siteConfig.name,
  legalName: siteConfig.legalName,
  url: SITE_URL,
  slogan: siteConfig.tagline,
  description: siteConfig.description,
  disambiguatingDescription:
    "Technology company based in Bangladesh; builds RailMate Bangladesh, NAVICORE OS and custom software.",
  logo: absoluteUrl("/logo.png"),
  address: { "@type": "PostalAddress", addressCountry: "BD" },
  founder: siteConfig.founders.map((f) => ({
    "@type": "Person",
    name: f.name,
    jobTitle: f.jobTitle,
  })),
  ...(siteConfig.sameAs.length > 0 && { sameAs: siteConfig.sameAs }),
};

export const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  url: SITE_URL,
  name: siteConfig.name,
  publisher: { "@id": `${SITE_URL}/#organization` },
};

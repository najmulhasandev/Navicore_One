import type { Metadata } from "next";
import { BRAND } from "@/content/brand";
import { SITE } from "@/content/site";
import type { OsPart } from "@/content/types";
import { getCopy, partHref, pad2 } from "./parts";

export const TITLE_SUFFIX = ` | ${SITE.name}`;
export const MAX_TITLE = 60;
export const MAX_DESCRIPTION = 155;

export const absoluteUrl = (path: string): string => new URL(path, SITE.url).toString();

/** The final <title> a page will have (the root layout applies "%s | NAVICORE ONE"). */
export const fullTitle = (title: string, absolute = false): string => (absolute ? title : `${title}${TITLE_SUFFIX}`);

interface PageMeta {
  title: string;
  description: string;
  path: string;
  /** Use the title as-is, without the " | NAVICORE ONE" suffix. */
  absoluteTitle?: boolean;
  noindex?: boolean;
}

export function pageMetadata(m: PageMeta): Metadata {
  const title = fullTitle(m.title, m.absoluteTitle);
  return {
    title: m.absoluteTitle ? { absolute: m.title } : m.title,
    description: m.description,
    alternates: { canonical: m.path },
    robots: m.noindex ? { index: false, follow: true } : undefined,
    openGraph: {
      type: "website",
      siteName: SITE.name,
      title,
      description: m.description,
      url: m.path,
      locale: SITE.locale,
      images: [{ url: SITE.ogImage, width: 1200, height: 630, alt: SITE.fullName, type: "image/webp" }],
    },
    twitter: { card: "summary_large_image", title, description: m.description, images: [SITE.ogImage] },
  };
}

/** Unique meta for a part page. Pairs the brand with its descriptor in the description. */
export const partTitle = (part: OsPart): string => getCopy(part).name;
export const partDescription = (part: OsPart): string => `${getCopy(part).outcome} ${SITE.fullName}.`;

export const partMetadata = (part: OsPart): Metadata =>
  pageMetadata({
    title: partTitle(part),
    description: partDescription(part),
    path: partHref(part),
    noindex: !part.indexable,
  });

// ── JSON-LD ────────────────────────────────────────────────────────────────

const ORG_ID = `${SITE.orgUrl}/#organization`;

export const organizationLd = () => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": ORG_ID,
  name: SITE.orgName,
  url: SITE.orgUrl,
  slogan: SITE.orgTagline,
});

export const websiteLd = () => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE.url}/#website`,
  name: SITE.name,
  url: SITE.url,
  description: SITE.homeDescription,
  inLanguage: "en",
  publisher: { "@id": ORG_ID },
});

export const softwareApplicationLd = () => ({
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: SITE.name,
  alternateName: SITE.fullName,
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  url: SITE.url,
  description: SITE.homeDescription,
  inLanguage: "en",
  featureList: [...BRAND.coreAreas],
  publisher: { "@id": ORG_ID },
  // No offers, ratings or reviews: none exist in the product specification.
});

export const breadcrumbLd = (items: readonly { name: string; path: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((it, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: it.name,
    item: absoluteUrl(it.path),
  })),
});

export const partBreadcrumb = (part: OsPart) =>
  breadcrumbLd([
    { name: "Home", path: "/" },
    { name: "Product", path: "/os" },
    { name: `Part ${pad2(part.number)}: ${getCopy(part).name}`, path: partHref(part) },
  ]);

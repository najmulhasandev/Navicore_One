import type { MetadataRoute } from "next";
import { SITE } from "@/content/site";
import { indexableParts, partHref } from "@/lib/parts";

/**
 * Only genuinely unique, indexable pages. Pages that still depend on an open founder question
 * (noindex) are left out, and so are /partners and /privacy until they are signed off.
 * No lastModified / priority values: none are known, and none are invented.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ["/", "/os", "/contact", ...indexableParts.map(partHref)];
  return paths.map((p) => ({ url: new URL(p, SITE.url).toString() }));
}

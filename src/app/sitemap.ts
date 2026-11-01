import type { MetadataRoute } from "next";
import { SITE, STATUS_AS_OF } from "@/content/site";
import { indexableParts, partHref } from "@/lib/parts";

/**
 * Only genuinely unique, indexable pages. Pages that still depend on an open founder question
 * (noindex) are left out, and so are /partners and /privacy until they are signed off.
 * lastModified is set only where a real date exists: part pages carry the date of the product
 * specification's status entries (STATUS_AS_OF). Other pages get none. No changeFrequency or priority.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const abs = (p: string) => new URL(p, SITE.url).toString();
  const lastModified = new Date(STATUS_AS_OF);
  return [
    ...["/", "/os", "/contact"].map((p) => ({ url: abs(p) })),
    ...indexableParts.map((p) => ({ url: abs(partHref(p)), lastModified })),
  ];
}

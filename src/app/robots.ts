import type { MetadataRoute } from "next";
import { SITE } from "@/content/site";

/** Production allows crawling; Vercel preview and development deployments disallow it. */
export default function robots(): MetadataRoute.Robots {
  const nonProduction = Boolean(process.env.VERCEL_ENV) && process.env.VERCEL_ENV !== "production";
  if (nonProduction) return { rules: { userAgent: "*", disallow: "/" } };
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: new URL("/sitemap.xml", SITE.url).toString(),
  };
}

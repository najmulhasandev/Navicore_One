import type { MetadataRoute } from "next";
import { BRAND } from "@/content/brand";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: BRAND.name,
    short_name: BRAND.name,
    description: BRAND.tagline,
    start_url: "/",
    display: "standalone",
    background_color: BRAND.theme.background,
    theme_color: BRAND.theme.color,
    icons: [
      { src: "/brand/pwa-192.webp", sizes: "192x192", type: "image/webp", purpose: "any" },
      { src: "/brand/pwa-512.webp", sizes: "512x512", type: "image/webp", purpose: "any" },
    ],
  };
}

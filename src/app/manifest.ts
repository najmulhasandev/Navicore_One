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
    theme_color: BRAND.theme.themeColor,
    icons: [
      { src: "/brand/pwa-192.png", sizes: "192x192", type: "image/png" },
      { src: "/brand/pwa-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}

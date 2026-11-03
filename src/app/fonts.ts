import localFont from "next/font/local";

/**
 * Two families only, latin subset, self-hosted from npm (no network at build time):
 *  - Outfit (display): a heavy, geometric grotesk variable font, set tight, for headings and big numbers
 *  - Inter (text) for everything else
 * Bangla later: add a Bengali font on bn routes only (see messages.bn.ts).
 */
export const fontDisplay = localFont({
  src: "../../node_modules/@fontsource-variable/outfit/files/outfit-latin-wght-normal.woff2",
  variable: "--font-display-face",
  weight: "100 900",
  style: "normal",
  display: "swap",
  fallback: ["system-ui", "Segoe UI", "Arial", "sans-serif"],
});

export const fontBody = localFont({
  src: "../../node_modules/@fontsource-variable/inter/files/inter-latin-wght-normal.woff2",
  variable: "--font-body",
  weight: "100 900",
  style: "normal",
  display: "swap",
  fallback: ["system-ui", "Segoe UI", "Arial", "sans-serif"],
});

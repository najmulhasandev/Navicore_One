/** Single source of truth for the product brand. Change brand strings and asset paths here only. */
export const BRAND = {
  name: "NAVICORE ONE",
  category: "Company Operating System",
  /** Lowercase descriptor that always accompanies the name in SEO copy. */
  descriptor: "company operating system",
  mainHeading: "Your company's operating system.",
  tagline: "One platform. Your entire company.",
  shortDescription:
    "The company operating system that brings people, projects, time tracking, and customer relationships into one connected workspace.",
  positioning:
    "NAVICORE ONE is a unified operating platform designed to bring an entire company's people, projects, time tracking, customers, and business workflows together in one connected workspace.",
  /** Areas that are part of the product today. Everything else must stay labelled planned / in build. */
  coreAreas: ["People Directory", "Projects & Tasks", "Time Tracking", "Customers"],
  /** Parent company tagline (NAVICORE), used for the Organization entity only. */
  orgTagline: "Innovating Journeys. Building Futures.",
  logo: {
    /** Official SVG masters with the wordmark outlined (renders identically without the Inter font). */
    /** For light backgrounds (header). */
    onLight: { src: "/brand/logo-light.svg", width: 1314, height: 481 },
    /** For dark / maroon backgrounds (footer in the light theme). */
    onDark: { src: "/brand/logo-white.svg", width: 1314, height: 481 },
    /** Dark theme: cyan lockup on a transparent background (WebP, keyed from the dark brand artwork). */
    darkTheme: { src: "/brand/logo-dark.webp", width: 480, height: 126 },
  },
  /** WebP only (no large PNG/JPG in the repo). 1200x630. */
  ogImage: "/brand/navicore-one-og-1200x630.webp",
  /**
   * One value each, used by BOTH the <meta name="theme-color"> viewport entry and the web manifest:
   *  - color: browser / status-bar tint = brand maroon (--maroon in globals.css); darkColor: the same in the dark theme
   *  - background: page and splash background = blush (--blush in globals.css)
   */
  theme: { color: "#6B1220", background: "#FFF7F9", darkColor: "#02050B" },
} as const;

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
    /** For light backgrounds (header). */
    onLight: { src: "/brand/logo-light.webp", width: 1245, height: 413 },
    /** For dark / maroon backgrounds (footer). */
    onDark: { src: "/brand/logo-white.webp", width: 1245, height: 413 },
  },
  ogImage: "/brand/navicore-one-og-1200x630.png",
  theme: { background: "#250006", themeColor: "#5B0012" },
} as const;

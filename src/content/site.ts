import { BRAND } from "./brand";

/** Site-wide constants. Nothing here is a claim about customers, numbers or prices. */
export const SITE = {
  name: BRAND.name,
  descriptor: BRAND.descriptor,
  /** Always pair the brand with a descriptor; never target bare "navicore". */
  fullName: `${BRAND.name} ${BRAND.descriptor}`,
  homeTitle: `${BRAND.name}: ${BRAND.mainHeading.replace(/\.$/, "")}`,
  homeDescription: BRAND.shortDescription,
  tagline: BRAND.tagline,
  orgTagline: BRAND.orgTagline,
  orgName: "NAVICORE",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://os.navicore.co",
  orgUrl: process.env.NEXT_PUBLIC_ORG_URL ?? "https://www.navicore.co",
  locale: "en_US",
  ogImage: BRAND.ogImage,
} as const;

/**
 * The statuses on this site come from the Master Reference (internal product document).
 * Its latest dated status entry is 24 August 2026.
 * [TODO: confirm with founder] Re-confirm every status label before launch.
 */
export const STATUS_AS_OF = "2026-08-24";
export const STATUS_AS_OF_LABEL = "August 2026";

/** Show the founder-question markers in the page? Always in dev; opt-in in production. */
export const SHOW_TODOS =
  process.env.NODE_ENV !== "production" || process.env.SHOW_TODOS === "1";

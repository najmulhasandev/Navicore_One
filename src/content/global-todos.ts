/**
 * Site-wide open questions for the founder. Part-specific ones live in os-parts.ts (`todos`), and UI-copy ones in
 * messages.ts; scripts/gen-founder-checklist.ts merges all three into FOUNDER-CHECKLIST.md.
 * Nothing here is shown on the live site.
 */
export interface GlobalTodo {
  id: string;
  topic: string;
  note: string;
  /** true = should be settled before the site goes public. */
  beforeLaunch: boolean;
}

export const globalTodos: readonly GlobalTodo[] = [
  { id: "G01", topic: "Statuses", beforeLaunch: true,
    note: "Every Live / In build / Planned / Later label comes from the Master Reference, whose latest dated status entry is 24 August 2026. Re-confirm each label (see the status table) before launch." },
  { id: "G02", topic: "52 parts vs the guide's 53 entries", beforeLaunch: true,
    note: "The guide has entries 00 to 52. The brief says 52 pages, so Parts 01-52 each have a page and Part 00 (positioning and build order) only informs the home page and the status labels. Confirm this reading." },
  { id: "G03", topic: "Facts that are not in the guide", beforeLaunch: true,
    note: "The hero line 'a technology company in Bangladesh' and the tagline 'Innovating Journeys. Building Futures.' come from the NAVICORE company brief, not from the Master Reference. Confirm they may appear on this site." },
  { id: "G04", topic: "Older presentation claims not used", beforeLaunch: true,
    note: "The earlier presentation zip contains statistics and claims that the guide does not support (for example project counts, countries, on-time delivery, delivery days). None of them is used here. If that older site is still public, confirm each claim with evidence or remove it." },
  { id: "G05", topic: "Domain", beforeLaunch: true,
    note: "The brief says os.navicore.co; the older presentation used a different host. Confirm the final domain, any redirects from the old one, and set NEXT_PUBLIC_SITE_URL." },
  { id: "G06", topic: "Company site URL (www or not)", beforeLaunch: true,
    note: "Organization JSON-LD and the footer link use https://www.navicore.co (from the brief). Confirm whether www is the canonical form; set NEXT_PUBLIC_ORG_URL." },
  { id: "G07", topic: "Where enquiries go", beforeLaunch: true,
    note: "The contact and partner forms post to LEAD_WEBHOOK_URL. Choose the destination (for example a Zapier or Make webhook into the Lead Tracker, or an email service), who answers, and a public contact email if wanted. In production the form shows 'temporarily unavailable' until this is set." },
  { id: "G08", topic: "Partner programme", beforeLaunch: true,
    note: "The guide says nothing about a partner programme: who it is for, what partners receive, how to apply. The /partners page therefore states no terms and is noindex. Supply the details, then remove noindex." },
  { id: "G09", topic: "Pricing", beforeLaunch: false,
    note: "No prices appear anywhere on this site. The brief lists a 'pricing-or-contact' page; it is built as a contact page that says pricing is not published. Confirm that approach (exact pricing is given after a call)." },
  { id: "G10", topic: "Customer stories and testimonials", beforeLaunch: false,
    note: "None exist in the guide, so none are shown and no page was created for them. Add real ones, with written permission, when they exist." },
  { id: "G11", topic: "Confidentiality of the Master Reference", beforeLaunch: true,
    note: "The Master Reference is marked confidential. The part pages publish its function names and scope lists. Confirm which of this may be public; items you want withheld can be moved into a part's `withhold` list in os-parts.ts." },
  { id: "G12", topic: "Privacy page legal review", beforeLaunch: true,
    note: "/privacy plainly describes what this site does today. It needs a legal review, the legal entity name and address, a retention period and a contact for data requests. It stays noindex until then." },
  { id: "G13", topic: "Legal entity name", beforeLaunch: false,
    note: "The guide uses an entity name that is not used on this site. Confirm the correct legal name and registered address for the footer and the privacy page." },
  { id: "G14", topic: "Flow sequences assembled by us", beforeLaunch: true,
    note: "Flows marked 'composed' arrange the guide's listed functions into plain-language steps; their order is not stated in the guide. They are labelled as such on each page. Confirm or correct them (list below)." },
  { id: "G15", topic: "Module group names", beforeLaunch: false,
    note: "The 13 group names follow the guide's Part 51 layers plus Start, Developers and Core, but the wording is ours. Confirm or rename (src/content/module-groups.ts)." },
  { id: "G16", topic: "Home page wording", beforeLaunch: true,
    note: "The problem cards and 'what makes it different' cards are plain-language framings of the guide's positioning and foundations. Confirm the wording, especially the three problem statements." },
  { id: "G17", topic: "Screens are illustrative", beforeLaunch: false,
    note: "All screens are drawn layouts built from the guide's function names, not screenshots, and say so. Replace them with real screenshots when the UI is stable and you approve what may be shown." },
  { id: "G18", topic: "No certifications or compliance claims", beforeLaunch: false,
    note: "No certification, compliance or security-standard claims are made anywhere. If you want any, provide the evidence first." },
  { id: "G19", topic: "Logo", beforeLaunch: false,
    note: "No logo files were provided; the header uses a plain wordmark with a simple geometric mark. Provide the official logo and favicon." },
  { id: "G20", topic: "Bot protection", beforeLaunch: false,
    note: "The form already has a honeypot, a timing check and a rate limit. Decide whether to also switch on Cloudflare Turnstile (TURNSTILE_SECRET_KEY and NEXT_PUBLIC_TURNSTILE_SITE_KEY); the privacy page already mentions it." },
  { id: "G21", topic: "Bangla", beforeLaunch: false,
    note: "The site is structured for Bangla (copy.bn on parts, messages.bn.ts for the interface) but has no translation yet. A Bengali font is added for bn routes only when translation starts." },
];

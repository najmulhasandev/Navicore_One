/**
 * All page-level and UI copy for the site, in English.
 * i18n-ready: a Bangla file (messages.bn.ts) can override any key; missing keys fall back to English.
 * Rules: no customers, testimonials, numbers, prices, dates or certifications that are not in the guide.
 * Strings that start with "[TODO: confirm with founder]" are data placeholders, shown only in dev
 * (or when SHOW_TODOS=1); production shows the neutral `fallback` text next to them instead.
 */
import type { GroupId, PartStatus } from "./types";
import { BRAND } from "./brand";

export const TODO_PREFIX = "[TODO: confirm with founder]";

export const en = {
  skip: "Skip to content",
  nav: {
    product: "Product",
    partners: "Partners",
    contact: "Contact",
    bookDemo: "Book a demo",
    becomePartner: "Become a partner",
    menu: "Menu",
  },
  status: {
    live: { label: "Live", description: "Screens for this area have shipped." },
    building: { label: "In build", description: "Being built now. Some of it may already work; the rest is on its way." },
    planned: { label: "Planned", description: "Specified, but not in the current build scope." },
    future: { label: "Later horizon", description: "Deliberately left for later. Not started." },
    foundation: { label: "Foundation", description: "A shared layer or design principle, not a separate feature." },
  } satisfies Record<PartStatus, { label: string; description: string }>,
  statusLegend: {
    title: "How to read the status labels",
    asOf: "Labels follow the NAVICORE ONE product specification, last dated",
    scopeNote:
      "What this page describes is the intended scope from the product specification. The status label shows how far along this area is.",
  },
  home: {
    hero: {
      eyebrow: BRAND.category,
      title: BRAND.mainHeading,
      sub: `${BRAND.shortDescription} From NAVICORE, a technology company in Bangladesh.`,
      note: `${BRAND.tagline} Available today: ${BRAND.coreAreas.join(", ")}. Every other area on this site is labelled In build, Planned or Later horizon.`,
      caption: "Illustrative layouts of the responsive web app. Not live screenshots.",
    },
    problem: {
      eyebrow: "The problem",
      title: "A company run on a patchwork of tools",
      lead: "Many companies run on separate tools that were never designed to work together. NAVICORE ONE is positioned as one platform instead of a stitched-together toolchain.",
      cards: [
        {
          title: "Separate sign-ins, separate rules",
          text: "Each tool has its own users and permissions, so access has to be set up, and kept right, in many places.",
        },
        {
          title: "Approvals and history in different places",
          text: "A leave approval in one tool, an expense approval in another, and no single record of who decided what.",
        },
        {
          title: "Nobody sees the whole company",
          text: "To know how the company is doing, you ask several people and open several tools.",
        },
      ],
    },
    different: {
      eyebrow: "What makes it different",
      title: "Shared foundations under every module",
      lead: "NAVICORE ONE is built so that every module uses the same permissions, approvals, notifications and audit trail. That depth is what the 52 parts on this site describe.",
      cards: [
        { title: "One shared core", text: "Identity, permissions, workflow, notifications, audit, files, search and AI are shared by every module, so everything behaves the same way.", slug: "os-core-shared-services" },
        { title: "Permissions with scope", text: "Not a few fixed roles: a user has a role, the role grants permissions, and each permission applies to a scope such as a department, team or project.", slug: "rbac-permissions" },
        { title: "One approval engine", text: "Leave, expenses, purchases, salary, roles and access all run through the same reusable engine.", slug: "approval-engine" },
        { title: "A record of every important action", text: "Who did what, when, and what it looked like before and after, in an append-only audit trail.", slug: "audit-system" },
        { title: "Each company in its own workspace", text: "Isolation is a hard rule: a customer must never be able to access another customer's data.", slug: "multi-tenancy" },
        { title: "AI that follows the permissions", text: "Built-in assistants only work with what the user may see, and sensitive actions need confirmation.", slug: "ai-platform" },
        { title: "English and Bangla from day one", text: "Local dates, numbers, currency and timezones, on a translation framework that can take more languages.", slug: "internationalization" },
        { title: "See the whole company from anywhere", text: "An executive overview and a daily 'what happened' feed make remote management possible.", slug: "executive-control-center" },
      ],
    },
    modules: {
      eyebrow: "The product",
      title: "Thirteen groups, 52 parts",
      lead: "Every part has its own page: what it is, who uses it, how it works step by step, and how it connects to the rest.",
      partsLabel: "parts",
      all: "See all 52 parts",
    },
    wall: {
      eyebrow: "Every screen",
      title: "Every screen, one system",
      lead: "A tilted look at the kinds of screens NAVICORE ONE is designed around: dashboards, tables, boards, calendars, chat, documents, approvals and settings.",
      caption: "Illustrative layouts built from the guide's module lists. Not live screenshots.",
    },
    flow: {
      eyebrow: "How it works",
      title: "How it works, end to end",
      lead: "One of the product's core flows: a candidate becomes an active employee. It is designed so that a single HR approval sets most of it in motion.",
      link: "See the whole flow, including what happens when someone leaves",
    },
    partner: {
      eyebrow: "Partners",
      title: "Work with NAVICORE\u00a0ONE as a partner",
      text: "Partner details are not published yet. Tell us about your business and how you would like to work together.",
      cta: "See the partner page",
    },
    final: {
      title: "See NAVICORE ONE for yourself",
      text: "Ask for a demo, or tell us how you would like to partner.",
    },
  },
  os: {
    eyebrow: "The product",
    title: "All 52 parts of NAVICORE ONE",
    lead: "NAVICORE ONE is described in 52 parts, from isolated company workspaces to the shared core. Pick any part to see what it is, who uses it, how it works and what it connects to.",
    counts: "parts in this group",
  },
  part: {
    breadcrumbHome: "Home",
    breadcrumbProduct: "Product",
    part: "Part",
    whatItIs: "What it is",
    problemTitle: "Problem, solution, result",
    problem: "The problem",
    does: "What NAVICORE ONE does",
    result: "The result",
    whoWhen: "Who uses it, and when",
    howItWorks: "How it works, step by step",
    flowGuide: "Sequence stated in the product specification.",
    flowComposed: "Sequence assembled from this part's listed functions, in plain language.",
    keyFunctions: "Key functions",
    scopeSummary: "Full scope from the product specification",
    scopeItems: "items",
    scopeFuture: "Planned for later",
    scopeLimits: "Limits",
    connects: "How it connects to other parts",
    screenTitle: "What it looks like",
    screenCaption: "Illustrative layout, not a live screenshot.",
    cta: "See it in action",
    ctaText: "Ask for a demo, or tell us how you would like to partner.",
    prev: "Previous part",
    next: "Next part",
    browse: "Browse all 52 parts",
    sidebarTitle: "All parts, by group",
    todoHeading: "Open questions (shown in development only)",
  },
  partners: {
    eyebrow: "Partners",
    title: "Become a partner",
    lead: "Tell us how you would like to work with NAVICORE ONE.",
    who: {
      heading: "Who it is for",
      todo: `${TODO_PREFIX} Who is the partner programme for (resellers, implementers, referrers, technology partners, others)? The guide does not say.`,
      fallback: "Partner details are not published yet. If you build, sell or support business software and want to talk, use the form below.",
    },
    gets: {
      heading: "What partners get",
      todo: `${TODO_PREFIX} What do partners receive (pricing terms, white-label rights, training, support, leads)? The guide does not say, so nothing is promised here.`,
      fallback: "Partner benefits are not published yet, and nothing is promised on this page.",
    },
    apply: {
      heading: "How to apply",
      steps: [
        { title: "Tell us about your business", text: "Use the form below: who you are, what you do and how you would like to work with NAVICORE ONE." },
        { title: "We read it", text: "The NAVICORE team reads what you send." },
      ],
      todo: `${TODO_PREFIX} What are the next steps after the form (call, application, agreement)?`,
    },
    blocks: {
      heading: "Parts of the product that partners may be interested in",
      lead: "These describe the product, not a partner offer. They are taken from the product specification.",
      items: [
        { title: "Licence types", text: "The licence model is specified with several types, including SaaS, Private, Enterprise and White-label.", slug: "license-platform" },
        { title: "API and webhooks", text: "A versioned REST API with keys, permissions, webhooks and OAuth applications.", slug: "api-developer-platform" },
        { title: "Isolated workspaces", text: "Each company gets its own workspace, with strict isolation between customers.", slug: "multi-tenancy" },
        { title: "Extensions, later", text: "A marketplace, SDK and extension system are on the later horizon.", slug: "marketplace-extensions" },
      ],
    },
    formTitle: "Tell us about your business",
  },
  contact: {
    eyebrow: "Contact",
    title: "Book a demo or contact us",
    lead: "Ask for a demo, ask a question, or tell us how you would like to partner.",
    pricingTitle: "About pricing",
    pricingText: "NAVICORE ONE pricing is not published on this site. Tell us about your company and what you need.",
    demoNote: "No demo link is live on this site yet. Send your details and say what you would like to see.",
    todoDemo: `${TODO_PREFIX} Is the public demo built? If yes, link it here.`,
  },
  form: {
    intent: "I would like to",
    intents: { demo: "Book a demo", partner: "Become a partner", question: "Ask a question" },
    name: "Your name",
    email: "Work email",
    company: "Company",
    companyOptional: "Company (optional)",
    role: "Your role (optional)",
    message: "What are you looking for?",
    send: "Send",
    sending: "Sending...",
    privacy: "We use what you send to reply to you. See the privacy page.",
    success: "Thank you. Your message has been sent.",
    unavailable: "The form is temporarily unavailable. Please try again later.",
    tooFast: "That was very quick. Please check your details and try again.",
    limited: "Too many messages from this connection. Please try again later.",
    fix: "Please check the highlighted fields.",
    errors: {
      name: "Please enter your name (2 to 80 characters).",
      email: "Please enter a valid email address.",
      message: "Please write a few words (10 to 2000 characters, at most two links).",
      company: "Company name is too long.",
      role: "Role is too long.",
      intent: "Please choose one option.",
    },
  },
  privacy: {
    title: "Privacy",
    lead: "What this website collects, in plain words.",
    sections: [
      { title: "What the contact form collects", text: "Your name, email address, company, role, what you would like to do and your message. You choose what to write." },
      { title: "How it is used", text: "To read and answer your message. Messages are forwarded to the place the NAVICORE team uses to receive enquiries." },
      { title: "What this site does not do", text: "It does not run advertising or analytics scripts, and it does not set tracking cookies." },
      { title: "Spam protection", text: "The form uses a hidden field, a timing check and a per-connection limit to reduce automated messages. If bot protection is switched on, a challenge from the provider may load on the form page." },
      { title: "Hosting", text: "The site is hosted on Vercel." },
    ],
    todos: [
      `${TODO_PREFIX} Legal entity name and registered address.`,
      `${TODO_PREFIX} How long enquiries are kept.`,
      `${TODO_PREFIX} Who to contact about access, correction or deletion of personal data.`,
      `${TODO_PREFIX} Legal review of this whole page.`,
    ],
    reviewNote: "This page is a plain description of the site's current behaviour. It has not had a legal review yet.",
  },
  footer: {
    product: "Product",
    company: "NAVICORE",
    companyLink: "NAVICORE website",
    privacy: "Privacy",
    contact: "Contact",
    disclaimer:
      "Layouts on this site are illustrative, not live screenshots. Statuses follow the NAVICORE ONE product specification.",
  },
  notFound: {
    title: "Page not found",
    text: "That page does not exist. You can browse all 52 parts of NAVICORE ONE.",
    cta: "See all parts",
  },
} as const;

export type Messages = typeof en;

export const groupSlugAnchor = (id: GroupId) => `group-${id}`;

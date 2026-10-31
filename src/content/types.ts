/**
 * Content model for NAVICORE ONE part pages.
 * One OsPart per part of the Master Reference (Parts 01-52).
 * All human-readable text lives under `copy[locale]` so a Bangla ("bn") translation
 * can be added later without touching structure, routing or components.
 */
import type { ScopeGroup } from "./spec-scope.generated";

export type Locale = "en" | "bn";

/** How far along an area is, per the guide's own status sections (see STATUS_AS_OF in site.ts). */
export type PartStatus = "live" | "building" | "planned" | "future" | "foundation";

export type GroupId =
  | "start"
  | "platform"
  | "security"
  | "people"
  | "work"
  | "finance"
  | "comms"
  | "knowledge"
  | "automation"
  | "insight"
  | "apps"
  | "dev"
  | "core";

/** Which illustrative screen layout to draw for a part (see ScreenMock). */
export type ScreenKind =
  | "dashboard"
  | "table"
  | "kanban"
  | "calendar"
  | "chat"
  | "form"
  | "tree"
  | "settings"
  | "docs"
  | "flow"
  | "search"
  | "cards";

export type FlowKind = "sequence" | "fan" | "stack";

export interface FlowStep {
  label: string;
  detail?: string;
}

export interface Flow {
  title: string;
  /**
   * "guide"    = the order is stated in the guide (diagram or explicit arrow chain).
   * "composed" = assembled by us from the guide's listed functions; order needs founder sign-off.
   */
  source: "guide" | "composed";
  /** sequence: left-to-right steps. fan: first step feeds/uses the rest. stack: vertical layers. */
  kind: FlowKind;
  steps: readonly FlowStep[];
}

export interface KeyFunction {
  name: string;
  line: string;
}

export interface WhoWhen {
  who: string;
  when: string;
}

export interface Todo {
  id: string;
  /** Always starts with the "[TODO: confirm with founder]" marker. */
  note: string;
  /** true = the page's content depends on this, so the page is noindex and left out of the sitemap. */
  blocksIndexing: boolean;
}

export interface PartCopy {
  /** Short display name, also used in <title> (keep <= 30 chars). */
  name: string;
  /** One plain-language sentence: what this lets your business do (<= 105 chars, used in meta description). */
  outcome: string;
  whatItIs: string;
  whoWhen: readonly WhoWhen[];
  problem: string;
  does: string;
  result: string;
  functions: readonly KeyFunction[];
  /** Optional public note shown beside the status badge. */
  statusNote?: string;
}

export interface OsPart {
  /** 1-52, equal to the guide's part number. */
  number: number;
  slug: string;
  /** Exact part title as written in the guide, for traceability. */
  specTitle: string;
  group: GroupId;
  status: PartStatus;
  screen: ScreenKind;
  flows: readonly Flow[];
  /** Slugs of related parts (internal links). */
  related: readonly string[];
  /** Full checklist from the guide, minus anything withheld pending founder confirmation. */
  scope: readonly ScopeGroup[];
  todos: readonly Todo[];
  /** false when any todo blocks indexing. */
  indexable: boolean;
  copy: { en: PartCopy } & Partial<Record<Exclude<Locale, "en">, PartCopy>>;
}

export interface ModuleGroup {
  id: GroupId;
  name: string;
  /** One line, plain language. */
  summary: string;
  /** Pre-rendered transparent WebP in /public/icons */
  icon: string;
}

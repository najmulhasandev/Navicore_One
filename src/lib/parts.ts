import { osParts } from "@/content/os-parts";
import { moduleGroups } from "@/content/module-groups";
import type { GroupId, Locale, OsPart, PartCopy, PartStatus } from "@/content/types";

export const allParts: readonly OsPart[] = osParts;

export const getPart = (slug: string): OsPart | undefined => allParts.find((p) => p.slug === slug);

export function mustGetPart(slug: string): OsPart {
  const p = getPart(slug);
  if (!p) throw new Error(`Unknown part slug: ${slug}`);
  return p;
}

export const getCopy = (part: OsPart, locale: Locale = "en"): PartCopy => part.copy[locale] ?? part.copy.en;

export const partHref = (part: OsPart): string => `/os/${part.slug}`;

export const pad2 = (n: number): string => String(n).padStart(2, "0");

export function neighbors(part: OsPart): { prev: OsPart | null; next: OsPart | null } {
  const i = part.number - 1;
  return { prev: allParts[i - 1] ?? null, next: allParts[i + 1] ?? null };
}

export const partsInGroup = (id: GroupId): OsPart[] => allParts.filter((p) => p.group === id);

export const groupsWithParts = moduleGroups.map((g) => ({ group: g, parts: partsInGroup(g.id) }));

export const indexableParts: readonly OsPart[] = allParts.filter((p) => p.indexable);

export function statusCounts(): Record<PartStatus, number> {
  const c: Record<PartStatus, number> = { live: 0, building: 0, planned: 0, future: 0, foundation: 0 };
  for (const p of allParts) c[p.status] += 1;
  return c;
}

export function relatedParts(part: OsPart): OsPart[] {
  return part.related.map((s) => getPart(s)).filter((p): p is OsPart => p !== undefined);
}

/** Step-count of a part's flows, used to size flow diagrams. */
export const totalSteps = (part: OsPart): number => part.flows.reduce((n, f) => n + f.steps.length, 0);

/** Real function names of a part, used as labels on illustrative screens. */
export const functionLabels = (part: OsPart): string[] => getCopy(part).functions.map((f) => f.name);

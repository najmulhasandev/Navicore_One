/**
 * Content integrity and SEO checks. Run: npm run check
 * Exits non-zero on any error. Warnings need a human look but do not fail the run.
 */
import { osParts } from "../src/content/os-parts";
import { specScope } from "../src/content/spec-scope.generated";
import { moduleGroups } from "../src/content/module-groups";
import { en, TODO_PREFIX } from "../src/content/messages";
import { SITE } from "../src/content/site";
import { MAX_DESCRIPTION, MAX_TITLE, partDescription, partTitle, fullTitle } from "../src/lib/seo";

const errors: string[] = [];
const warnings: string[] = [];
const err = (m: string) => errors.push(m);
const warn = (m: string) => warnings.push(m);

// 1. Structure: 52 parts, 1..52, unique slugs, every part maps to a guide part
if (osParts.length !== 52) err(`Expected 52 parts, found ${osParts.length}`);
const slugs = new Set<string>();
osParts.forEach((p, i) => {
  if (p.number !== i + 1) err(`Part at index ${i} has number ${p.number}`);
  if (slugs.has(p.slug)) err(`Duplicate slug ${p.slug}`);
  slugs.add(p.slug);
  const spec = specScope[p.number];
  if (!spec) err(`${p.slug}: no guide part ${p.number} in spec-scope.generated.ts`);
  else if (!p.specTitle) err(`${p.slug}: missing specTitle`);
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(p.slug)) err(`${p.slug}: slug must be lowercase kebab-case`);
});
const groupIds = new Set(moduleGroups.map((g) => g.id));
if (moduleGroups.length !== 13) err(`Expected 13 module groups, found ${moduleGroups.length}`);
for (const g of moduleGroups) if (!osParts.some((p) => p.group === g.id)) err(`Group ${g.id} has no parts`);

// 2. Required elements on every part page
for (const p of osParts) {
  const c = p.copy.en;
  const at = `${String(p.number).padStart(2, "0")} ${p.slug}`;
  if (!groupIds.has(p.group)) err(`${at}: unknown group ${p.group}`);
  for (const k of ["name", "outcome", "whatItIs", "problem", "does", "result"] as const) if (!c[k]?.trim()) err(`${at}: empty ${k}`);
  if (c.whoWhen.length < 1) err(`${at}: no who/when`);
  if (p.flows.length < 1) err(`${at}: no flow diagram`);
  for (const f of p.flows) if (f.steps.length < 2) err(`${at}: flow "${f.title}" has fewer than 2 steps`);
  if (c.functions.length < 3) warn(`${at}: only ${c.functions.length} key functions`);
  if (p.related.length < 1) err(`${at}: no related parts (internal links)`);
  for (const r of p.related) {
    if (!slugs.has(r)) err(`${at}: related slug "${r}" does not exist`);
    if (r === p.slug) err(`${at}: relates to itself`);
  }
  if (p.scope.length === 0) warn(`${at}: no scope list from the guide`);
  if (p.indexable === p.todos.some((t) => t.blocksIndexing)) err(`${at}: indexable flag disagrees with blocking todos`);
  for (const t of p.todos) if (!t.note.startsWith(TODO_PREFIX)) err(`${at}: todo ${t.id} lacks the marker`);
}

// 3. SEO: lengths and uniqueness
const titles = new Map<string, string>();
const descs = new Map<string, string>();
const seo = (id: string, title: string, desc: string) => {
  if (title.length >= MAX_TITLE) err(`${id}: title is ${title.length} chars (limit < ${MAX_TITLE}): ${title}`);
  if (desc.length >= MAX_DESCRIPTION) err(`${id}: description is ${desc.length} chars (limit < ${MAX_DESCRIPTION})`);
  if (desc.length < 60) warn(`${id}: description is short (${desc.length})`);
  if (titles.has(title)) err(`${id}: title duplicates ${titles.get(title)}: ${title}`);
  if (descs.has(desc)) err(`${id}: description duplicates ${descs.get(desc)}`);
  titles.set(title, id);
  descs.set(desc, id);
  if (!/NAVICORE ONE/.test(desc + title)) err(`${id}: brand missing`);
};
seo("home", SITE.homeTitle, SITE.homeDescription);
for (const p of osParts) {
  seo(`part ${p.slug}`, fullTitle(partTitle(p)), partDescription(p));
  if (!partDescription(p).includes(SITE.fullName)) err(`${p.slug}: description lacks "${SITE.fullName}"`);
}

// 4. Text scan: claims that must not appear. Hits are warnings to read, not automatic failures.
const strings: { where: string; text: string }[] = [];
const walk = (v: unknown, where: string) => {
  if (typeof v === "string") strings.push({ where, text: v });
  else if (Array.isArray(v)) v.forEach((x, i) => walk(x, `${where}[${i}]`));
  else if (v && typeof v === "object") for (const [k, x] of Object.entries(v)) walk(x, `${where}.${k}`);
};
walk(en, "messages");
for (const p of osParts) {
  walk(p.copy.en, `part ${p.slug}`);
  walk(p.flows, `part ${p.slug} flows`);
}
const risky: [RegExp, string][] = [
  [/[$€£৳]|\b(BDT|USD|Tk\.?)\b/, "currency / price"],
  [/\b\d+\s?%/, "percentage"],
  [/\b(guarantee[sd]?|guaranteed|100%)\b/i, "guarantee"],
  [/\b(ISO\s?\d+|SOC\s?2|GDPR|HIPAA|PCI|certified|certification)\b/i, "certification / compliance"],
  [/\b(award|trusted by|testimonial|case study|customers? (love|say)|reviews?)\b/i, "social proof"],
  [/\b(will be (released|launched|available)|coming (in|on)|by (Q[1-4]|\d{4}))\b/i, "date or promise"],
  [/\b(FlyMate|TravelMate|RailMate)\b/i, "other NAVICORE ventures (never mention)"],
];
for (const { where, text } of strings) {
  for (const [re, what] of risky) {
    const m = text.match(re);
    if (m) warn(`review (${what}) in ${where}: "…${m[0]}…"  ←  ${text.slice(0, 90)}`);
  }
  if (/\bNavicore\b|\bNAVICORE\s?Os\b|\bnavicore os\b|\bNavicore One\b|\bnavicore one\b|\bNAVICORE\s?OS\b/.test(text)) err(`brand casing in ${where}: ${text.slice(0, 80)}`);
}

// 5. Report
const todos = osParts.flatMap((p) => p.todos);
console.log(`Parts: ${osParts.length}  Groups: ${moduleGroups.length}  Indexable parts: ${osParts.filter((p) => p.indexable).length}  noindex: ${osParts.filter((p) => !p.indexable).length}`);
console.log(`Part TODOs: ${todos.length} (blocking indexing: ${todos.filter((t) => t.blocksIndexing).length})`);
console.log(`Flows: ${osParts.reduce((n, p) => n + p.flows.length, 0)}  (guide-stated: ${osParts.flatMap((p) => p.flows).filter((f) => f.source === "guide").length}, composed: ${osParts.flatMap((p) => p.flows).filter((f) => f.source === "composed").length})`);
const longestTitle = [...titles.keys()].sort((a, b) => b.length - a.length)[0] ?? "";
const longestDesc = [...descs.keys()].sort((a, b) => b.length - a.length)[0] ?? "";
console.log(`Longest title: ${longestTitle.length}  Longest description: ${longestDesc.length}`);
if (warnings.length) console.log(`\nWARNINGS (${warnings.length})\n- ${warnings.join("\n- ")}`);
if (errors.length) {
  console.error(`\nERRORS (${errors.length})\n- ${errors.join("\n- ")}`);
  process.exit(1);
}
console.log("\nContent checks passed.");

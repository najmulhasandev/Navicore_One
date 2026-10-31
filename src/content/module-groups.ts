import type { GroupId, ModuleGroup } from "./types";

/**
 * Module groups. The guide's Part 51 ("Master Product Layers") defines the layers;
 * these 13 groups follow those layers, and add "Start", "Developers" and "Core" so that
 * every one of Parts 01-52 has exactly one home. Naming is ours (see founder checklist).
 * Each group has one pre-rendered 3D icon in /public/icons.
 */
export const moduleGroups: readonly ModuleGroup[] = [
  { id: "start", name: "Start & explore", summary: "The public site, the demo and how a company comes on board.", icon: "start" },
  { id: "platform", name: "Platform & licensing", summary: "Isolated company workspaces, licences and company settings.", icon: "platform" },
  { id: "security", name: "Security & trust", summary: "Sign-in, permissions, audit, devices, backup and privacy.", icon: "security" },
  { id: "people", name: "People & HR", summary: "Directory, hiring to exit, attendance, leave and structure.", icon: "people" },
  { id: "work", name: "Projects & clients", summary: "Projects, tasks, time tracking and the sales pipeline.", icon: "work" },
  { id: "finance", name: "Finance & assets", summary: "Money in and out, invoices, equipment and IT operations.", icon: "finance" },
  { id: "comms", name: "Communication", summary: "Chat, announcements, calendar and notifications.", icon: "comms" },
  { id: "knowledge", name: "Documents & knowledge", summary: "Files, company wiki and search across everything you may see.", icon: "knowledge" },
  { id: "automation", name: "Approvals, AI & automation", summary: "One approval engine, built-in AI and a trigger-to-result workflow engine.", icon: "automation" },
  { id: "insight", name: "Insight & control", summary: "The executive overview, role dashboards and reports.", icon: "insight" },
  { id: "apps", name: "Apps & experience", summary: "Web app, desktop and mobile, offline sync, languages and accessibility.", icon: "apps" },
  { id: "dev", name: "Developers & extensions", summary: "API, integrations, extensions and how the product is tested.", icon: "dev" },
  { id: "core", name: "How it fits together", summary: "The shared core, the product layers and the big picture.", icon: "core" },
];

export const groupById = (id: GroupId): ModuleGroup => {
  const g = moduleGroups.find((m) => m.id === id);
  if (!g) throw new Error(`Unknown module group: ${id}`);
  return g;
};

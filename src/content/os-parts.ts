/**
 * NAVICORE ONE part pages: one typed entry per part of the Master Reference (Parts 01-52).
 *
 * Source of truth: the Master Reference. Rules followed in this file:
 *  - Only functions, flows and facts that appear in the guide. Nothing invented: no customers,
 *    numbers, prices, testimonials, awards or certifications.
 *  - The full checklist for each part comes from spec-scope.generated.ts (extracted by script,
 *    never retyped). Anything the founder has not confirmed is listed in `withhold` and `todos`.
 *  - A flow marked "guide" has its order stated in the guide. A flow marked "composed" is our
 *    arrangement of the guide's listed functions into a plain-language sequence; the founder
 *    should confirm those sequences (see FOUNDER-CHECKLIST.md).
 *  - Part 00 of the guide (positioning and build sequencing) is internal; it informs the home
 *    page and the status labels but has no page of its own. The site therefore has 52 part
 *    pages, Parts 01-52.
 *  - Text lives under copy.en so a Bangla translation can be added as copy.bn later.
 */
import { specScope } from "./spec-scope.generated";
import type { ScopeGroup } from "./spec-scope.generated";
import type {
  Flow,
  FlowKind,
  GroupId,
  OsPart,
  PartStatus,
  ScreenKind,
  Todo,
} from "./types";

export const TODO_MARKER = "[TODO: confirm with founder]";

/** A todo. `blocks` = true makes the page noindex and removes it from the sitemap. */
const todo = (id: string, note: string, blocks = false): Todo => ({
  id,
  note: `${TODO_MARKER} ${note}`,
  blocksIndexing: blocks,
});

type StepInput = string | readonly [label: string] | readonly [label: string, detail: string];

interface FlowInput {
  title: string;
  src: "guide" | "composed";
  kind?: FlowKind;
  steps: readonly StepInput[];
}

interface PartInput {
  n: number;
  slug: string;
  group: GroupId;
  status: PartStatus;
  screen: ScreenKind;
  name: string;
  outcome: string;
  what: string;
  who: readonly (readonly [who: string, when: string])[];
  pdr: readonly [problem: string, does: string, result: string];
  flows: readonly FlowInput[];
  fns: readonly (readonly [name: string, line: string])[];
  rel: readonly string[];
  note?: string;
  todos?: readonly Todo[];
  /** Exact guide checklist items we do not publish until the founder confirms them. */
  withhold?: readonly string[];
}

const toFlow = (f: FlowInput): Flow => ({
  title: f.title,
  source: f.src,
  kind: f.kind ?? "sequence",
  steps: f.steps.map((s) => {
    if (typeof s === "string") return { label: s };
    const detail = s.length > 1 ? s[1] : undefined;
    return detail ? { label: s[0], detail } : { label: s[0] };
  }),
});

function part(i: PartInput): OsPart {
  const spec = specScope[i.n];
  if (!spec) throw new Error(`Part ${i.n}: missing from spec-scope.generated.ts`);

  const withheld = new Set(i.withhold ?? []);
  const allItems = new Set(spec.groups.flatMap((g) => g.items));
  for (const w of withheld) {
    if (!allItems.has(w)) throw new Error(`Part ${i.n}: withheld item not found in the guide: "${w}"`);
  }
  const scope: ScopeGroup[] = spec.groups
    .map((g) => ({ ...g, items: g.items.filter((x) => !withheld.has(x)) }))
    .filter((g) => g.items.length > 0);

  const todos = [...(i.todos ?? [])];
  if (withheld.size > 0 && !todos.some((t) => t.id.endsWith("-withheld"))) {
    throw new Error(`Part ${i.n}: withheld items need a "-withheld" todo explaining why`);
  }

  return {
    number: i.n,
    slug: i.slug,
    specTitle: spec.specTitle,
    group: i.group,
    status: i.status,
    screen: i.screen,
    flows: i.flows.map(toFlow),
    related: i.rel,
    scope,
    todos,
    indexable: !todos.some((t) => t.blocksIndexing),
    copy: {
      en: {
        name: i.name,
        outcome: i.outcome,
        whatItIs: i.what,
        whoWhen: i.who.map(([who, when]) => ({ who, when })),
        problem: i.pdr[0],
        does: i.pdr[1],
        result: i.pdr[2],
        functions: i.fns.map(([name, line]) => ({ name, line })),
        statusNote: i.note,
      },
    },
  };
}

const parts: OsPart[] = [
  // ───────────────────────── PART 01 ─────────────────────────
  part({
    n: 1, slug: "public-website", group: "start", status: "live", screen: "cards",
    name: "Public website & demo",
    outcome: "Understand NAVICORE ONE and ask for a demo before you commit to anything.",
    what: "The public face of NAVICORE ONE: a product overview, a showcase for each area of the business, documentation, security and privacy information, a changelog and a status page. A separate sales demo is specified too, kept completely apart from any real company's data.",
    who: [
      ["Prospective customers", "When they first look at NAVICORE ONE and compare it with what they use today"],
      ["The NAVICORE team", "When presenting the product or running a demo for a prospect"],
      ["IT and security reviewers", "When checking security, privacy and current status before a decision"],
    ],
    pdr: [
      "A business platform is hard to judge from a slogan, and buyers worry about what is real today versus only promised.",
      "NAVICORE ONE gives each area its own showcase, with security, privacy, changelog and status pages alongside, and labels each module honestly as live, in build or planned.",
      "You can see what exists, what is being built and what is planned before you speak to anyone.",
    ],
    flows: [{
      title: "From first visit to a demo", src: "composed",
      steps: [
        ["Product overview", "A hero and a plain explanation of what a Company OS is"],
        ["Area showcases", "HR, finance, projects, communication, AI, security, automation"],
        ["Docs, security, privacy", "Documentation, security, privacy, terms, changelog, status"],
        ["Request a demo", "Or contact sales"],
        ["Demo company", "A fictional company with demo employees, projects, finance and HR"],
        ["Guided tour", "Walked through the demo step by step"],
      ],
    }],
    fns: [
      ["Product overview", "A plain-language explanation of what NAVICORE ONE is and who it is for."],
      ["What is a Company OS?", "A short explainer for people new to the idea of one platform running a whole company."],
      ["Area showcases", "Separate showcases for HR, finance, projects, communication, AI, security, automation, desktop and mobile, and the executive dashboard."],
      ["Request demo / Contact sales", "A form that sends your details to the NAVICORE team."],
      ["Documentation, changelog, status", "Where to read how things work, what changed and how the service is doing."],
      ["Demo company", "A completely fictional company with demo employees, departments, projects, finance, HR, communication, documents and analytics."],
      ["Demo role switching", "See the same demo as different roles, to understand what each person would see."],
      ["Demo reset & guided tour", "Return the demo to a clean state, and be walked through it."],
      ["Isolation rule", "There is absolutely no real NAVICORE data in the public demo."],
    ],
    rel: ["multi-tenancy", "license-platform", "client-onboarding", "executive-control-center"],
    note: "The marketing site is shipped; the demo environment is specified.",
    todos: [
      todo("p01-demo", "Is the public demo environment (demo login, demo company, role switching, reset, guided tour) built yet? No demo link is shown on this site until you confirm."),
      todo("p01-stories-pricing", "Customer stories and Pricing are on the guide's checklist, but there are no customers or prices in the guide. Neither is shown. Pricing goes through the contact form."),
    ],
  }),

  // ───────────────────────── PART 02 ─────────────────────────
  part({
    n: 2, slug: "multi-tenancy", group: "platform", status: "live", screen: "settings",
    name: "Companies & workspaces",
    outcome: "Give each company its own isolated workspace, set up the way that company actually runs.",
    what: "Every company on NAVICORE ONE gets its own organization and workspace, with a profile, logo, branding, domain, timezone, currency, language, working days and hours, holidays and a fiscal year. Isolation is a hard rule: a customer must never be able to access another customer's data.",
    who: [
      ["Company owners", "When setting up the company, and whenever its basics change"],
      ["The NAVICORE platform owner", "When managing customer organizations and their lifecycle"],
      ["Everyone at the company", "Every working day: each person works inside their own company's workspace"],
    ],
    pdr: [
      "When several companies share one platform, the worry is one company seeing another's records.",
      "NAVICORE ONE gives each organization a separate workspace, with isolation specified across the database, API, storage, search, AI, notifications, audit and billing.",
      "Each company works in a space of its own, with its own settings and its own data boundary.",
    ],
    flows: [{
      title: "The life of a workspace", src: "composed",
      steps: [
        "Organization created",
        ["Company profile", "Name, logo, branding and company domain"],
        ["Working setup", "Timezone, currency, language, working days and hours, holidays, fiscal year"],
        "Day-to-day use",
        ["Export, backup, restore", "Take data out, protect it, bring it back"],
        "Suspension",
        "Archive",
        "Deletion",
      ],
    }],
    fns: [
      ["Organization & workspace", "The company, and the private space it works in."],
      ["Tenant ID", "A unique identifier that marks which company every piece of data belongs to."],
      ["Company profile & branding", "Your name, logo and look, shown across your workspace."],
      ["Company domain", "The web domain that identifies your company."],
      ["Timezone, currency, language", "Dates, money and wording appear the way your company works."],
      ["Working days, hours, holidays, fiscal year", "The calendar rules the rest of the system builds on."],
      ["Export, backup & restore", "Take your workspace data out, protect it and bring it back."],
      ["Suspension, archive & deletion", "Controlled ways to pause, retire or remove a workspace."],
      ["Strict isolation", "Database, API, storage, search, AI, notification, audit and billing separation between customers."],
    ],
    rel: ["license-platform", "company-settings", "client-onboarding", "backup-disaster-recovery", "privacy-data-governance"],
    note: "Organization and workspace management screens are shipped.",
  }),

  // ───────────────────────── PART 03 ─────────────────────────
  part({
    n: 3, slug: "license-platform", group: "platform", status: "building", screen: "table",
    name: "License platform",
    outcome: "Control which modules, users and limits each customer gets, from one place.",
    what: "The system that turns NAVICORE ONE into a commercial product. A license is generated, signed, activated, validated, renewed, suspended, revoked or rotated, and carries entitlements: maximum users, enabled modules, platform access, storage, AI, API and automation limits, and the support level.",
    who: [
      ["The NAVICORE Owner", "When creating, renewing, suspending or revoking a license, changing a plan or user limit, or switching modules on and off"],
      ["Customer organizations", "From the day a license is activated until it expires or is renewed"],
      ["Demo and evaluation users", "When trying NAVICORE ONE under a demo or evaluation license type"],
    ],
    pdr: [
      "Selling software without clear limits makes it hard to say what a customer is entitled to.",
      "Each license names the plan, the enabled modules, the user limit and the usage limits, and moves through activation, validation, renewal or suspension.",
      "What a company can use is decided in one place, and follows its license.",
    ],
    flows: [{
      title: "A license from start to finish", src: "composed",
      steps: [
        "License generated",
        ["License key & signature", "A signed license identifies the customer"],
        "Activation",
        "Validation",
        ["Usage", "License usage is tracked"],
        ["Expiration or renewal", "A license expires unless renewed"],
        ["Suspension, revocation, rotation", "When something changes or goes wrong"],
        "History kept",
      ],
    }],
    fns: [
      ["License generation", "Create a new license for a customer."],
      ["Signed license & key", "A license key plus a signature, so a license can be checked as genuine."],
      ["Activation & validation", "Turn a license on, and check it is valid when the product runs."],
      ["Expiration & renewal", "Licenses have an end date and can be renewed."],
      ["Suspension, revocation & rotation", "Pause a license, cancel it, or replace its key."],
      ["License history & usage", "See what happened to a license and how much of it is used."],
      ["Entitlements", "Maximum users, enabled modules, platform access, and storage, AI, API and automation limits."],
      ["Support level", "Which level of support a license includes."],
      ["Eight license types", "Internal, Demo, SaaS, Private, Enterprise, White-label, Development and Evaluation."],
      ["NAVICORE Control Center", "Owner-only: create, revoke, suspend and renew licenses, change plan and user limit, enable or disable modules, view usage and manage customer organizations."],
    ],
    rel: ["multi-tenancy", "company-settings", "public-website", "client-onboarding", "rbac-permissions"],
    todos: [
      todo("p03-types", "May the license types (SaaS, Private, Enterprise, White-label...) and the owner-only Control Center be described publicly?"),
      todo("p03-billing", "Billing/Stripe code exists but is unverified against a live account (guide 0.6). This page makes no payment or pricing claims. Confirm the wording."),
    ],
  }),

  // ───────────────────────── PART 04 ─────────────────────────
  part({
    n: 4, slug: "authentication-identity", group: "security", status: "live", screen: "form",
    name: "Sign-in & identity",
    outcome: "Let the right people into your company's workspace, and keep everyone else out.",
    what: "Registration for companies and individuals, employee invitations and domain verification, then sign-in with passwords, multi-factor authentication, passkeys, OAuth and single sign-on. Sessions and devices are tracked, and protections such as rate limiting, lockout and secure cookies sit around all of it.",
    who: [
      ["Company owners", "When registering the company and proving it owns its domain"],
      ["Employees", "When accepting an invitation, and every time they sign in"],
      ["Owners and super admins", "When reviewing login history, active sessions and suspicious activity"],
    ],
    pdr: [
      "Weak sign-up and sign-in is how the wrong person gets into company data.",
      "Companies verify their domain and company email, employees join by invitation, sign-in can add MFA, passkeys or SSO, and sessions and devices can be reviewed and ended remotely.",
      "Only verified people from the right company get in, and you can see and end their sessions.",
    ],
    flows: [
      {
        title: "A company registers", src: "composed",
        steps: [
          "Company registration",
          ["Domain ownership verification", "Prove the company owns its domain"],
          ["Verified company email", "Public and temporary email providers are blocked"],
          "Email verification",
          "Signup approval",
          ["Sign in", "Password, MFA, passkey, OAuth or SSO"],
        ],
      },
      {
        title: "An employee joins", src: "composed",
        steps: ["Employee invitation", "Invitation verification", "Account created", ["Sign in", "With the company's sign-in rules"]],
      },
    ],
    fns: [
      ["Company & personal registration", "Two ways to start: as a company, or as an individual."],
      ["Domain verification", "Proves a company really owns the domain it registers with."],
      ["Public & temporary email blocking", "Keeps free and throwaway email addresses from registering a company."],
      ["Invitation verification", "An employee can only join through a valid invitation."],
      ["MFA & TOTP", "A second step at sign-in, such as a one-time code from an authenticator app."],
      ["Passkeys", "Sign in with a device-based key instead of typing a password."],
      ["OAuth & SSO", "Sign in through another trusted account, with a SAML/OIDC architecture for enterprise single sign-on."],
      ["Sessions, devices & remote logout", "See active sessions and devices, and sign one out from afar."],
      ["Login history", "A record of who signed in, and when."],
      ["Suspicious login & lockout", "Detect unusual sign-ins and lock an account that is being attacked."],
      ["Built-in protections", "Rate limiting, secure cookies, CSRF and XSS protection, secure headers, encryption and server-side authorization."],
    ],
    rel: ["rbac-permissions", "device-management", "security-center", "audit-system", "client-onboarding"],
    note: "Sign-in and organization screens are shipped; individual options are being built.",
    todos: [todo("p04-options", "Which sign-in options (MFA, TOTP, passkeys, OAuth, SSO) are live today? Listed as scope only; SAML/OIDC is described as architecture, not as a shipped feature.")],
  }),

  // ───────────────────────── PART 05 ─────────────────────────
  part({
    n: 5, slug: "rbac-permissions", group: "security", status: "building", screen: "table",
    name: "Roles & permissions",
    outcome: "Decide exactly who can see and do what, down to a department, team or single project.",
    what: "Instead of a few fixed roles, NAVICORE ONE builds access as a chain: a user has a role, the role grants permissions, each permission has a scope, and the scope applies to a resource. Eleven default roles, from Owner to Guest, give you a starting point.",
    who: [
      ["Owners and super admins", "When deciding who can approve, export, configure or delete"],
      ["HR, finance and project managers", "When their area needs its own level of access"],
      ["Every employee", "Every time they open a record: they see what their role and scope allow"],
    ],
    pdr: [
      "Fixed roles force a company to give people too much access, or too little.",
      "NAVICORE ONE lets a role carry specific permission types (create, read, update, delete, approve, manage, export, configure) over a chosen scope.",
      "Access matches how your company is actually organized.",
    ],
    flows: [{
      title: "The permission chain", src: "guide",
      steps: [
        ["User", "The person"],
        ["Role", "What they are, for example HR Manager"],
        ["Permissions", "What that role may do"],
        ["Scope", "Where: organization, department, team, project, own or assigned records"],
        ["Resource", "The record the permission applies to"],
      ],
    }],
    fns: [
      ["Eleven default roles", "Owner, Super Admin, Admin, HR Manager, Finance Manager, Accountant, Project Manager, Manager, Team Lead, Employee and Guest."],
      ["Eight permission types", "Create, read, update, delete, approve, manage, export and configure."],
      ["Six permission scopes", "Organization, department, team, project, own records and assigned records."],
      ["Role-then-scope design", "A permission is never just 'yes'; it applies to a defined scope."],
      ["Owner authority", "Organization deletion, ownership transfer, system configuration, license management, demo management and destructive operations."],
      ["Super Admin limits", "Almost everything operationally, but cannot delete the organization, remove the Owner, transfer ownership or destroy the company setup."],
    ],
    rel: ["authentication-identity", "approval-engine", "audit-system", "people-directory", "security-center"],
  }),

  // ───────────────────────── PART 06 ─────────────────────────
  part({
    n: 6, slug: "people-directory", group: "people", status: "live", screen: "cards",
    name: "People directory",
    outcome: "Keep one complete, searchable record for every person in your company.",
    what: "A profile for every employee: ID, photo, contact and emergency contact, department, team, position, manager, joining date, employment details, skills and certifications. The profile also links to that person's projects, tasks, attendance, leave, salary, benefits, documents, assets and performance history.",
    who: [
      ["HR managers", "When creating and maintaining employee records"],
      ["Managers and team leads", "When they need to know who is on the team and who reports to whom"],
      ["Employees", "When looking up a colleague or checking their own profile"],
    ],
    pdr: [
      "Employee details end up scattered across spreadsheets, chats and folders.",
      "NAVICORE ONE keeps each person's profile, reporting line and linked records in one directory.",
      "Anyone with permission can find who someone is, where they sit and who they report to.",
    ],
    flows: [{
      title: "Building an employee record", src: "composed",
      steps: [
        "Employee ID",
        ["Profile & contact", "Photo, contact information, emergency contact"],
        ["Place in the company", "Department, team, position, manager, reporting structure"],
        ["Employment details", "Status, type, work location, remote or hybrid, joining date"],
        ["Skills & certifications"],
        ["Linked records", "Projects, tasks, attendance, leave, salary, benefits, documents, assets, performance"],
      ],
    }],
    fns: [
      ["Employee directory & ID", "A searchable list of everyone, each with a unique employee ID."],
      ["Profile & photo", "The core record for each person."],
      ["Contact & emergency contact", "How to reach someone, and who to call if something happens."],
      ["Department, team & position", "Where the person sits in the company and what they do."],
      ["Manager & reporting structure", "Who they report to."],
      ["Employment status, type & location", "Active or not, full-time or other, office, remote or hybrid."],
      ["Skills & certifications", "What each person can do and has qualified in."],
      ["Linked records", "Projects, tasks, attendance, leave, salary, benefits, documents, assets and performance history in one place."],
    ],
    rel: ["hr-lifecycle", "organization-structure", "attendance-schedules", "leave-management", "asset-management"],
  }),

  // ───────────────────────── PART 07 ─────────────────────────
  part({
    n: 7, slug: "hr-lifecycle", group: "people", status: "planned", screen: "form",
    name: "HR & employee lifecycle",
    outcome: "Hire, change and offboard employees through one approved, recorded flow.",
    what: "The whole employment story: recruitment from candidate to offer, everything set up the moment HR approves a new employee, every later change, and a structured exit. Every important change follows the same path: approval, then an effective date, then an audit trail.",
    who: [
      ["HR managers", "From a candidate's application to the final settlement"],
      ["Hiring managers", "When interviewing candidates and making the hiring decision"],
      ["Approvers", "When an offer, or a change such as pay or role, needs a decision"],
    ],
    pdr: [
      "Hiring, onboarding and exit steps get forgotten when they live in people's heads.",
      "One HR approval sets up the employee ID, role, permissions, department, manager, pay structure, schedule, policies, account and equipment; later changes and exits follow their own approved paths.",
      "Nothing is missed when someone joins, changes role or leaves.",
    ],
    flows: [
      {
        title: "Recruitment", src: "guide",
        steps: ["Candidate", "Application", "Interview", ["Interview notes"], "Hiring decision", "Offer", "Offer approval"],
      },
      {
        title: "When HR approves a new employee", src: "composed",
        steps: [
          ["Identity", "Employee ID, role, permissions"],
          ["Place", "Department, team, job title, manager"],
          ["Pay", "Salary, salary structure, payment frequency"],
          ["Time", "Work time, working days, timezone, employment type, probation, joining date"],
          ["Policies & benefits", "Leave, attendance and overtime policy, benefits"],
          ["Paperwork", "Documents and contract"],
          ["Onboarding", "Onboarding checklist and tasks"],
          ["Access", "Company account, application permissions, company email, equipment"],
          "Employee activation",
        ],
      },
      {
        title: "Any important change", src: "guide",
        steps: [
          ["Approval", "Salary, role, department, manager, promotion, schedule, location, status or permission change"],
          "Effective date",
          "Audit trail",
        ],
      },
      {
        title: "Someone leaves", src: "guide",
        steps: [
          "Resignation / termination", "Approval", "Offboarding", "Project reassignment", "Task reassignment",
          "Asset return", "Access revocation", "Session termination", "Final settlement", "Archive",
        ],
      },
    ],
    fns: [
      ["Recruitment pipeline", "Candidates, applications, interviews and notes, the hiring decision, the offer and its approval."],
      ["One-step employee setup", "Approving a new employee prepares their ID, role, permissions, team, manager and more together."],
      ["Salary & pay structure", "Salary, salary structure and payment frequency are part of the employee record."],
      ["Probation & contract", "Probation terms and the contract are attached from the start."],
      ["Onboarding checklist & tasks", "A checklist and tasks so a new starter's first days are organized."],
      ["Equipment & accounts", "Company account, email, application permissions and equipment are assigned as part of joining."],
      ["Approved changes", "Salary, role, department, manager, schedule, location, status and permission changes, each with an effective date and an audit trail."],
      ["Structured offboarding", "Notice period, exit approval, exit interview, final settlement, asset return, access and session end, reassignment, knowledge transfer and document archive."],
    ],
    rel: ["people-directory", "approval-engine", "core-employee-flow", "automation-engine", "attendance-schedules", "leave-management", "asset-management", "audit-system"],
    todos: [todo("p07-scope", "The guide is inconsistent: Part 00.6.1 says 'HR lifecycle beyond directory' stays deferred, but also calls HR lifecycle 'confirmed-in-scope'. Shown as Planned. Confirm the true status.")],
  }),

  // ───────────────────────── PART 08 ─────────────────────────
  part({
    n: 8, slug: "attendance-schedules", group: "people", status: "planned", screen: "table",
    name: "Attendance & schedules",
    outcome: "Know who is working, where and when, without chasing anyone.",
    what: "Employees check in and out, take breaks and follow a work schedule (fixed or flexible; office, remote or hybrid). Late arrivals, early departures and overtime are recorded, corrections go through manager approval, and monthly, team and company reports are available.",
    who: [
      ["Employees", "At the start and end of each working day"],
      ["Managers", "When approving attendance corrections and checking their team"],
      ["HR and owners", "When reading monthly, team or company attendance reports"],
    ],
    pdr: [
      "Paper registers and message-based check-ins make attendance records unreliable.",
      "NAVICORE ONE records check-in, check-out and breaks against each person's work schedule, and notes late arrival, early departure and overtime.",
      "Attendance data is consistent, can be corrected with approval and is ready for reporting.",
    ],
    flows: [{
      title: "A working day", src: "composed",
      steps: [
        "Check-in",
        ["Work & breaks", "Against the person's work schedule"],
        "Check-out",
        ["Late, early, overtime", "Recorded against the schedule"],
        ["Correction request", "If a record is wrong"],
        "Manager approval",
        ["Reports", "Monthly, team and company"],
      ],
    }],
    fns: [
      ["Check-in, check-out & breaks", "Record when work starts, pauses and ends."],
      ["Work schedules", "Define working hours, including flexible schedules."],
      ["Remote, office & hybrid", "Record where each person works."],
      ["Late arrival & early departure", "Notice when someone starts late or leaves early."],
      ["Overtime", "Track hours worked beyond the schedule."],
      ["Attendance correction", "Fix a missed or wrong record, with manager approval."],
      ["Monthly, team & company reports", "See attendance at three levels."],
      ["Mobile, desktop & offline", "Mobile attendance, desktop integration and offline attendance sync arrive alongside the mobile and desktop apps."],
    ],
    rel: ["leave-management", "hr-lifecycle", "people-directory", "time-tracking", "sync-offline"],
  }),

  // ───────────────────────── PART 09 ─────────────────────────
  part({
    n: 9, slug: "leave-management", group: "people", status: "planned", screen: "calendar",
    name: "Leave management",
    outcome: "Handle time off from request to approval, with balances and team availability always clear.",
    what: "Employees request leave against their leave policy and balance, managers and HR approve, and owners keep visibility. A leave calendar shows team availability and holidays. Half-day and emergency leave are covered, with cancellation, history and reports.",
    who: [
      ["Employees", "When they need time off, or want to check their balance"],
      ["Managers", "When a team member's request needs approval and absences need planning around"],
      ["HR", "When approving requests, setting leave policy and reading leave reports"],
      ["Owners", "When they want visibility of who is away"],
    ],
    pdr: [
      "Leave tracked in chats and spreadsheets leads to lost requests, wrong balances and surprise absences.",
      "Requests follow the leave policy, check the balance, go through manager and HR approval and land on a shared leave calendar.",
      "Everyone can see who is away and what is left, and every decision is on record.",
    ],
    flows: [{
      title: "A leave request", src: "composed",
      steps: [
        ["Request", "Leave type, dates; half-day or emergency if needed"],
        ["Balance & policy", "Checked against the leave policy and balance"],
        "Manager approval",
        "HR approval",
        "Owner visibility",
        ["Leave calendar", "Team availability and holidays"],
        ["History & reports"],
      ],
    }],
    fns: [
      ["Leave types & policy", "The kinds of leave your company offers, and the rules for each."],
      ["Leave balance", "How much leave each person has left."],
      ["Leave request", "Ask for time off in a few steps."],
      ["Manager & HR approval", "Two levels of sign-off where your policy needs them."],
      ["Owner visibility", "Owners can see leave without chasing anyone."],
      ["Leave calendar & team availability", "A shared view of who is away and when."],
      ["Holidays", "Company holidays appear on the calendar."],
      ["Half-day & emergency leave", "For shorter or unplanned absences."],
      ["Cancellation, history & reports", "Withdraw a request, look back, and report across the company."],
    ],
    rel: ["approval-engine", "attendance-schedules", "people-directory", "calendar-meetings", "hr-lifecycle"],
  }),

  // ───────────────────────── PART 10 ─────────────────────────
  part({
    n: 10, slug: "organization-structure", group: "people", status: "planned", screen: "tree",
    name: "Organization structure",
    outcome: "Show how your company is organized: who leads what, and who reports to whom.",
    what: "Departments, teams, divisions and locations, drawn as an organizational chart with a clear reporting hierarchy. Department heads, team leads and managers are named, and cross-functional or temporary teams cover work that cuts across the structure.",
    who: [
      ["Owners and HR", "When designing or changing how the company is organized"],
      ["Managers and team leads", "When they need to see their team and their own place in the hierarchy"],
      ["Every employee", "When finding out who leads a department or who someone reports to"],
    ],
    pdr: [
      "Reporting lines kept in someone's head, or an old slide, go out of date as soon as people move.",
      "NAVICORE ONE keeps departments, teams, divisions, locations and the reporting hierarchy as live structure that the rest of the system can use.",
      "Directories, approvals and reports can follow the real shape of the company.",
    ],
    flows: [{
      title: "Shaping the organization", src: "composed",
      steps: [
        "Departments",
        "Teams",
        ["Divisions & locations"],
        ["Leaders", "Department heads, team leads and managers"],
        "Reporting hierarchy",
        "Organizational chart",
        ["Cross-functional & temporary teams", "When work cuts across the structure"],
      ],
    }],
    fns: [
      ["Departments", "The main functions of the company."],
      ["Teams", "Smaller groups that work together."],
      ["Divisions", "A level above departments, where a company needs one."],
      ["Locations", "Offices and sites."],
      ["Organizational chart", "A picture of the whole structure."],
      ["Reporting hierarchy", "Who reports to whom, all the way up."],
      ["Department heads, team leads & managers", "Named leaders at each level."],
      ["Cross-functional teams", "People from different departments working on one goal."],
      ["Temporary teams", "Teams that exist for a short effort and then end."],
    ],
    rel: ["people-directory", "hr-lifecycle", "rbac-permissions", "project-management", "approval-engine"],
  }),

  // ───────────────────────── PART 11 ─────────────────────────
  part({
    n: 11, slug: "project-management", group: "work", status: "live", screen: "kanban",
    name: "Projects & tasks",
    outcome: "Plan, assign and track every project and task, so everyone sees who is doing what.",
    what: "Projects have members, a project manager, a client, a budget, a timeline, milestones, a status and a health indicator. Tasks carry an assignee, priority, status, deadline, labels, subtasks, dependencies, comments, attachments and mentions, and can be viewed as a list, Kanban board, calendar, timeline or Gantt chart.",
    who: [
      ["Project managers", "When setting up a project, its milestones and budget, and watching its health"],
      ["Team members", "Every day, working through their own tasks"],
      ["Managers and owners", "When checking team tasks, deadlines and project dashboards"],
    ],
    pdr: [
      "Work spread across chats, notes and spreadsheets makes it unclear who owns what, and what is late.",
      "Projects hold the plan, tasks hold the work, and views show it as a list, board, calendar, timeline or Gantt chart.",
      "Everyone can see who is doing what, by when, and whether the project is healthy.",
    ],
    flows: [{
      title: "From project to done", src: "composed",
      steps: [
        "Create project",
        ["Members & project manager", "Plus the client, if there is one"],
        ["Budget, timeline & milestones"],
        ["Create & assign tasks", "Priority, deadline, labels, subtasks, dependencies"],
        ["Work moves through statuses", "Comments, attachments, mentions, time"],
        ["Health, activity & reports"],
      ],
    }],
    fns: [
      ["Projects", "Members, project manager, client, budget, timeline, milestones, status and health."],
      ["Project documents & activity", "Files and a running record of what happened on a project."],
      ["Tasks", "Create, assign, set a priority, status and deadline."],
      ["Labels, subtasks & dependencies", "Break work down and show what must happen first."],
      ["Comments, attachments & mentions", "Discuss work where it happens and call in the right person."],
      ["Recurring tasks & templates", "Repeat work that comes back regularly, or start from a template."],
      ["Task history & notifications", "See what changed and be told when it matters."],
      ["Eight views", "List, Kanban, calendar, timeline, Gantt, My tasks, Team tasks and a project dashboard."],
    ],
    rel: ["time-tracking", "crm-clients", "dashboards", "notification-center", "organization-structure", "document-management"],
    note: "Projects, tasks and Kanban boards are shipped.",
  }),

  // ───────────────────────── PART 12 ─────────────────────────
  part({
    n: 12, slug: "time-tracking", group: "work", status: "live", screen: "table",
    name: "Time tracking",
    outcome: "Record where working hours go, approve timesheets and see what is billable.",
    what: "Start a timer or enter time by hand against a task or project. Time rolls up into timesheets that managers approve, is marked billable or non-billable, and feeds reports.",
    who: [
      ["Employees", "While they work on tasks, or at the end of the day"],
      ["Managers", "When approving timesheets"],
      ["Project managers", "When comparing billable and non-billable time on a project"],
    ],
    pdr: [
      "Guessing how long work took makes planning and billing unreliable.",
      "NAVICORE ONE records time on the task or project itself, collects it into timesheets and routes them for manager approval.",
      "Effort is on record, approved and ready for reports.",
    ],
    flows: [{
      title: "From timer to report", src: "composed",
      steps: [
        ["Timer or manual time", "Start a timer, or add time by hand"],
        ["On a task or project"],
        "Timesheet",
        "Manager approval",
        "Billable or non-billable",
        "Reports",
      ],
    }],
    fns: [
      ["Timer", "Start and stop a clock while you work."],
      ["Manual time", "Add time you forgot to track."],
      ["Task time & project time", "Attach hours to the exact task and project."],
      ["Timesheets", "A period's worth of time, gathered in one place."],
      ["Manager approval", "A manager reviews and signs off the timesheet."],
      ["Billable / non-billable", "Separate work that can be charged from work that cannot."],
      ["Reports", "See time by person, task or project."],
    ],
    rel: ["project-management", "attendance-schedules", "crm-clients", "reporting-analytics", "approval-engine"],
  }),

  // ───────────────────────── PART 13 ─────────────────────────
  part({
    n: 13, slug: "crm-clients", group: "work", status: "live", screen: "table",
    name: "Clients & sales pipeline",
    outcome: "Keep every lead, client and deal in one place, from first contact to signed contract.",
    what: "Leads, companies, contacts, opportunities and deals move through a sales pipeline, with follow-ups, notes and the full communication history. Contracts and client documents stay with the client, which also links to that client's projects and a client portal.",
    who: [
      ["The sales team", "From the first lead to a closed deal"],
      ["Account and project managers", "When delivering work for a client and keeping the history straight"],
      ["Owners", "When reviewing the pipeline"],
    ],
    pdr: [
      "Leads and conversations scattered across inboxes and notebooks get forgotten.",
      "NAVICORE ONE keeps leads, companies, contacts, deals and every note and follow-up on one client record.",
      "Nobody has to ask where a conversation was left.",
    ],
    flows: [{
      title: "From lead to client", src: "composed",
      steps: [
        "Lead",
        ["Company & contact"],
        "Opportunity",
        ["Deal", "Moves through the sales pipeline"],
        ["Follow-ups & notes", "With communication history"],
        "Contract",
        ["Client projects & documents", "Plus the client portal"],
      ],
    }],
    fns: [
      ["Leads", "People and companies who might buy."],
      ["Companies & contacts", "Who they are and who to talk to."],
      ["Opportunities & deals", "Possible sales, and the ones actively being pursued."],
      ["Sales pipeline", "See every deal by stage."],
      ["Follow-ups & notes", "Never lose track of the next step."],
      ["Communication history", "Every conversation on one timeline."],
      ["Contracts & client documents", "Agreements and files kept with the client."],
      ["Client projects", "The work you are doing for them."],
      ["Client portal", "A place for clients to see their side of the work."],
    ],
    rel: ["project-management", "finance-accounting", "document-management", "communication", "dashboards"],
    note: "The deals and CRM pipeline screens are shipped.",
  }),
  // ───────────────────────── PART 14 ─────────────────────────
  part({
    n: 14, slug: "finance-accounting", group: "finance", status: "building", screen: "dashboard",
    name: "Finance & accounting",
    outcome: "Track money in and out, claims and invoices, with approvals and a permanent history.",
    what: "Cash and bank accounts, funds, categories, vendors and clients. Income, expense and transfer transactions with receipts. Expense claims and employee reimbursement. Invoices with numbering, items, tax, discount, due date, payment status and PDF. Reports cover profit and loss, cash flow, budget and outstanding invoices.",
    who: [
      ["Accountants and finance managers", "Day to day: recording transactions, handling claims and raising invoices"],
      ["Employees", "When submitting an expense claim with a receipt"],
      ["Owners", "When they want the cash position, revenue, expenses and the monthly report"],
    ],
    pdr: [
      "Money tracked across spreadsheets and bank statements is hard to reconcile and hard to trust.",
      "NAVICORE ONE records each transaction with its receipt, routes claims and invoices through approval workflows, and keeps an immutable transaction history with audit.",
      "Finance data is traceable, permissioned and ready for reporting.",
    ],
    flows: [
      {
        title: "An expense claim", src: "composed",
        steps: ["Claim submitted", ["Receipt upload", "Attached to the claim"], "Approval", "Employee reimbursement", ["Transaction history", "Recorded and kept"]],
      },
      {
        title: "An invoice", src: "composed",
        steps: ["Create invoice", ["Client & items", "Numbered automatically"], ["Tax, discount, due date"], "PDF", "Payment status", ["Receivables", "What is still owed"]],
      },
    ],
    fns: [
      ["Accounts", "Cash accounts, bank accounts, funds, categories, vendors and clients."],
      ["Transactions", "Income, expense and transfer, each with history, receipt and attachment."],
      ["Expense claims", "Employees claim costs with a receipt and are reimbursed after approval."],
      ["Invoices", "Create, number, itemize, add tax and discount, set a due date, track payment status and produce a PDF."],
      ["Receivables", "See what clients still owe."],
      ["Reports", "Income, expenses, profit and loss, cash flow, budget, outstanding invoices and a monthly report."],
      ["Financial dashboard & export", "A live view of finances, with export."],
      ["Finance controls", "Finance permissions, approval workflows, immutable transaction history, audit and reconciliation support."],
    ],
    rel: ["approval-engine", "reporting-analytics", "executive-control-center", "crm-clients", "audit-system", "rbac-permissions"],
    note: "The finance backend exists; the screens are being built.",
  }),

  // ───────────────────────── PART 15 ─────────────────────────
  part({
    n: 15, slug: "communication", group: "comms", status: "building", screen: "chat",
    name: "Chat & communication",
    outcome: "Talk to your team in one place: chat, channels, files, calls and meetings.",
    what: "Chat covers one-to-one, group, team, department and project channels, with threads, reactions, mentions, read receipts, typing indicators, editing, search, pins and saved messages. Media covers file sharing, images, documents, voice messages, audio and video calls, screen sharing and meeting recording.",
    who: [
      ["Everyone in the company", "Every day, for quick questions and decisions"],
      ["Team leads and project managers", "When running team or project channels"],
      ["Owners and HR", "When broadcasting something to many people"],
    ],
    pdr: [
      "Conversations in personal chat apps leave company knowledge outside the company.",
      "NAVICORE ONE puts chat, channels, files and calls in the same workspace as projects and people, with transport encryption and encryption at rest.",
      "Conversations stay close to the work they are about.",
    ],
    flows: [{
      title: "A conversation", src: "composed",
      steps: [
        ["Choose who", "A person, a group or a channel"],
        ["Send a message", "Threads, mentions, reactions"],
        ["Share", "Files, images, documents, voice messages"],
        ["Call", "Audio or video, with screen sharing"],
        ["Record", "Meeting recording"],
        ["Find it later", "Search, pins and saved messages"],
      ],
    }],
    fns: [
      ["One-to-one & group chat", "Talk directly, or with a few people."],
      ["Team, department & project channels", "Shared spaces that match how the company is organized."],
      ["Threads, reactions & mentions", "Keep replies together, react quickly and call someone in."],
      ["Read receipts & typing indicator", "See that a message was read and that someone is replying."],
      ["Edit, delete, search, pin & save", "Correct, find and keep what matters."],
      ["Files, images & documents", "Share work directly in the conversation."],
      ["Voice messages", "Send a spoken message."],
      ["Audio & video calls", "Talk face to face, with screen sharing and meeting recording."],
      ["Encryption", "Transport encryption and encryption at rest."],
    ],
    rel: ["announcements-broadcast", "notification-center", "calendar-meetings", "document-management", "project-management"],
    note: "The chat backend exists; the screens are being built.",
    withhold: ["E2EE for supported private communications", "Key management", "Device keys"],
    todos: [todo("p15-e2ee-withheld", "The guide lists end-to-end encryption, key management and device keys for chat, but the earlier presentation site says E2EE chat is 'not planned'. Those three items are withheld from this page until you decide.")],
  }),

  // ───────────────────────── PART 16 ─────────────────────────
  part({
    n: 16, slug: "announcements-broadcast", group: "comms", status: "building", screen: "cards",
    name: "Announcements",
    outcome: "Reach the whole company, a department or a team, and know who has read it.",
    what: "Company, department and team announcements, plus emergency alerts. Announcements can be scheduled and given a priority, delivered by push, email, desktop and mobile notification, tracked with read confirmation and kept in a history.",
    who: [
      ["Owners and HR", "When something concerns everyone"],
      ["Department heads and team leads", "When a message is only for their own group"],
      ["Employees", "When they need to know what changed, and to confirm they have read it"],
    ],
    pdr: [
      "Important news shared in a chat gets buried, and nobody knows who saw it.",
      "NAVICORE ONE sends announcements to a chosen audience, with a priority, optional scheduling and read confirmation.",
      "The right people are told, and you can see who has read it.",
    ],
    flows: [{
      title: "Sending an announcement", src: "composed",
      steps: [
        "Write the announcement",
        ["Choose the audience", "Company, department or team"],
        ["Set priority", "Or schedule it for later; emergency alerts for urgent news"],
        ["Deliver", "Push, email, desktop and mobile notifications"],
        "Read confirmation",
        "History",
      ],
    }],
    fns: [
      ["Company, department & team announcements", "Pick the audience that needs to know."],
      ["Emergency alert", "A louder, urgent kind of announcement."],
      ["Scheduled announcement", "Write now and send at the right time."],
      ["Priority", "Mark what is urgent and what is routine."],
      ["Read confirmation", "See who has read it."],
      ["Push, email, desktop & mobile", "Delivery on the channels people actually watch."],
      ["History", "A record of everything announced."],
    ],
    rel: ["notification-center", "communication", "calendar-meetings", "executive-control-center"],
  }),

  // ───────────────────────── PART 17 ─────────────────────────
  part({
    n: 17, slug: "calendar-meetings", group: "comms", status: "building", screen: "calendar",
    name: "Calendar & meetings",
    outcome: "Schedule events and meetings, see availability and keep the notes with the meeting.",
    what: "Personal, team, department and company calendars with events, meetings and recurring meetings. Attendees, meeting rooms and availability are handled, invitations and reminders go out, meeting notes and attachments stay with the event, and calendar integrations connect other calendars.",
    who: [
      ["Everyone", "When scheduling or accepting a meeting"],
      ["Managers", "When checking their team's availability before planning"],
      ["Meeting organizers", "When booking rooms and sending invitations"],
    ],
    pdr: [
      "Finding a time that works, and a room, takes a chain of messages.",
      "NAVICORE ONE shows availability, books meeting rooms, sends invitations and reminders, and keeps notes and attachments with the event.",
      "Meetings are easier to set up, and what was decided stays attached to them.",
    ],
    flows: [{
      title: "Setting up a meeting", src: "composed",
      steps: [
        "Create the event or meeting",
        ["Add attendees & a meeting room"],
        "Check availability",
        "Invitations",
        "Reminders",
        ["Meeting notes & attachments", "Kept with the event"],
      ],
    }],
    fns: [
      ["Personal, team, department & company calendars", "Four levels of calendar."],
      ["Events & meetings", "Anything with a time and a purpose."],
      ["Recurring meetings", "Set a regular meeting once."],
      ["Attendees & availability", "Invite people and see when they are free."],
      ["Meeting rooms", "Book a room as part of the meeting."],
      ["Invitations & reminders", "People are asked, and reminded."],
      ["Meeting notes & attachments", "Write down decisions and attach files."],
      ["Calendar integrations", "Connect other calendar providers."],
    ],
    rel: ["leave-management", "communication", "announcements-broadcast", "notification-center", "company-settings"],
  }),

  // ───────────────────────── PART 18 ─────────────────────────
  part({
    n: 18, slug: "document-management", group: "knowledge", status: "building", screen: "docs",
    name: "Documents & knowledge base",
    outcome: "Store, share and find every document, policy and procedure, with the right permissions.",
    what: "Files and folders with upload, download, preview, sharing, permissions, version history, file activity, search, tags, categories and archive. A knowledge base adds a company wiki, policies, procedures, technical documentation, team and project knowledge and FAQs. Existing company documents can be imported, categorized, permission-mapped, migrated and backed up.",
    who: [
      ["Every employee", "When looking for a file, a policy or an answer"],
      ["Managers and team leads", "When sharing documents with their team and keeping procedures current"],
      ["Admins and HR", "When moving the company's existing documents into NAVICORE ONE"],
    ],
    pdr: [
      "Documents in personal drives and old email threads get lost, duplicated and shared with the wrong people.",
      "NAVICORE ONE keeps files in folders with permissions and version history, and keeps company knowledge in a wiki that has its own permissions and versions.",
      "People find the current version, and only the right people can open it.",
    ],
    flows: [
      {
        title: "A document's life", src: "composed",
        steps: ["Upload", ["Organize", "Folders, tags, categories"], ["Share", "With permissions"], "Version history", "Search", "Archive"],
      },
      {
        title: "Bringing in existing documents", src: "composed",
        steps: ["Import", "Categorize", "Permission mapping", "Migration", "Backup"],
      },
    ],
    fns: [
      ["Files & folders", "Upload, download and preview, organized the way you work."],
      ["Sharing & permissions", "Decide who can see or change each file."],
      ["Version history", "Go back to an earlier version."],
      ["File activity", "See who did what with a file."],
      ["Search, tags & categories", "Find things by name, label or type."],
      ["Archive", "Keep old files without cluttering current ones."],
      ["Company wiki & policies", "Policies, procedures and technical documentation in one place."],
      ["Team & project knowledge, FAQs", "What each team and project needs everyone to know."],
      ["Import existing documents", "Import, categorize, map permissions, migrate and back up what you already have."],
    ],
    rel: ["global-search", "approval-engine", "project-management", "crm-clients", "ai-platform"],
  }),

  // ───────────────────────── PART 19 ─────────────────────────
  part({
    n: 19, slug: "asset-management", group: "finance", status: "building", screen: "table",
    name: "Asset management",
    outcome: "Know which laptop, phone or software license each person holds, and what happened to it.",
    what: "A register of laptops, desktops, monitors, phones, accessories and software licenses, each with an asset ID, serial number, purchase date, cost, warranty and assigned employee. Assignment, return, and loss or damage are kept in the asset's history.",
    who: [
      ["IT and admins", "When buying, assigning and recovering equipment"],
      ["HR", "When equipment is issued at joining and returned at exit"],
      ["Employees", "When they receive, hold or return equipment"],
    ],
    pdr: [
      "Equipment tracked in a spreadsheet loses track of who has what, and what it cost.",
      "NAVICORE ONE gives every asset an ID, a serial number, a cost, a warranty and a named holder, with a history.",
      "You always know where equipment is, and what is lost, damaged or returned.",
    ],
    flows: [{
      title: "An asset's life", src: "composed",
      steps: [
        ["Register the asset", "Asset ID, serial number, purchase date, cost, warranty"],
        ["Assign to an employee"],
        "Asset history",
        ["Return", "Or recorded as lost or damaged"],
      ],
    }],
    fns: [
      ["Hardware", "Laptops, desktops, monitors, phones and accessories."],
      ["Software licenses", "Track licenses next to hardware."],
      ["Asset ID & serial number", "A unique identity for every item."],
      ["Purchase date & cost", "When it was bought and what it cost."],
      ["Warranty", "Know when cover ends."],
      ["Assigned employee", "Who has it now."],
      ["Asset history", "Every assignment and return."],
      ["Return & lost/damaged", "Record the end of an asset's time with a person."],
    ],
    rel: ["it-operations", "people-directory", "hr-lifecycle", "finance-accounting", "approval-engine"],
    note: "Built; managed by owners and admins.",
  }),

  // ───────────────────────── PART 20 ─────────────────────────
  part({
    n: 20, slug: "it-operations", group: "finance", status: "planned", screen: "table",
    name: "IT operations",
    outcome: "Handle IT requests, tickets, accounts and incidents in one tracked place.",
    what: "IT requests and support tickets, device and software inventory, access requests, account provisioning and deprovisioning, security incidents, maintenance, internal services and a system status view.",
    who: [
      ["The IT team", "When resolving tickets, provisioning accounts and managing devices and software"],
      ["Employees", "When they need help or access to something"],
      ["Managers", "When approving an access request for their team"],
    ],
    pdr: [
      "IT help asked for in passing is hard to track, and accounts get left open when people leave.",
      "NAVICORE ONE turns requests into tickets, tracks access requests, and provisions and deprovisions accounts.",
      "IT work is visible, and access follows who is actually in the company.",
    ],
    flows: [{
      title: "From request to resolved", src: "composed",
      steps: [
        ["IT request or ticket"],
        ["Access request", "Approved where needed"],
        "Account provisioning",
        ["Inventory", "Devices and software"],
        ["Maintenance & incidents"],
        ["Account deprovisioning", "When someone leaves"],
      ],
    }],
    fns: [
      ["IT requests & support tickets", "Ask for help and follow it through."],
      ["Device & software inventory", "A list of what the company runs and owns."],
      ["Access requests", "Ask for access, and have it approved."],
      ["Account provisioning & deprovisioning", "Create accounts when people join, and remove them when they leave."],
      ["Security incidents", "Log and follow up on security events."],
      ["Maintenance", "Plan and record upkeep."],
      ["Internal services & system status", "Know what is running and whether it is healthy."],
    ],
    rel: ["asset-management", "approval-engine", "security-center", "hr-lifecycle", "device-management"],
    note: "Not yet started; it will build on the asset inventory.",
  }),

  // ───────────────────────── PART 21 ─────────────────────────
  part({
    n: 21, slug: "approval-engine", group: "automation", status: "building", screen: "flow",
    name: "Approval engine",
    outcome: "Run every kind of approval through one engine, with a clear record of who decided what.",
    what: "One reusable engine for the whole OS. It handles leave, employee, salary, role-change, expense, purchase, invoice, document and access approvals, plus custom workflows, with sequential or parallel approval, delegation, rejection, comments, escalation, deadlines and history.",
    who: [
      ["Approvers", "Whenever a request lands on them"],
      ["Requesters", "When they ask for leave, expenses, purchases, access and more"],
      ["Admins and owners", "When setting up how each kind of approval should work"],
    ],
    pdr: [
      "Approvals handled by message and memory get stuck, skipped or forgotten.",
      "NAVICORE ONE has one approval engine that every module uses, so each request follows a defined route with comments, deadlines and escalation.",
      "Requests do not stall, and every decision is on record.",
    ],
    flows: [{
      title: "An approval", src: "composed",
      steps: [
        ["Request raised", "In any module"],
        ["Routed to approvers", "One after another, or all at once"],
        ["Decision", "Approve, reject, comment or delegate"],
        ["Escalation", "If the deadline passes"],
        "Final outcome",
        "History",
      ],
    }],
    fns: [
      ["Leave, expense, purchase & invoice approval", "The everyday approvals."],
      ["Employee, salary & role-change approval", "Approvals for people decisions."],
      ["Document & access approval", "Sign-off for files and for who gets in."],
      ["Custom workflows", "Define your own approval routes."],
      ["Sequential & parallel approval", "One after another, or together."],
      ["Delegation & rejection", "Hand a decision on, or turn a request down."],
      ["Comments", "Explain a decision."],
      ["Escalation & deadlines", "Chase automatically when time runs out."],
      ["History", "A full record of the route a request took."],
    ],
    rel: ["leave-management", "hr-lifecycle", "finance-accounting", "rbac-permissions", "audit-system", "automation-engine"],
    note: "Built as one shared engine.",
  }),

  // ───────────────────────── PART 22 ─────────────────────────
  part({
    n: 22, slug: "executive-control-center", group: "insight", status: "building", screen: "dashboard",
    name: "Executive control center",
    outcome: "See the health of the whole company from anywhere, without asking anyone for a report.",
    what: "A single overview for the Owner and Super Admin: company health, employees, attendance, leave, projects and project health, deadlines, finance, revenue, expenses, cash position, pending approvals, new employees and changes, security events, recent activity and system alerts. A 'What happened today?' feed summarizes the day.",
    who: [
      ["Owners", "When starting or ending the day, or checking in while away from the office"],
      ["Super admins", "When acting on pending approvals, alerts and security events"],
    ],
    pdr: [
      "Owners often learn what happened in the company days later, in meetings.",
      "NAVICORE ONE pulls people, projects, finance, approvals and security into one overview and a daily 'what happened' feed.",
      "You can manage the company remotely, with the whole picture in front of you.",
    ],
    flows: [{
      title: "From activity to overview", src: "composed",
      steps: [
        ["Things happen in modules", "A person joins, a task slips, an expense is approved"],
        ["'What happened today?'", "A daily feed of the day's events"],
        ["Overview panels", "People, projects, finance, approvals, security"],
        ["Act", "Handle pending approvals and alerts"],
      ],
    }],
    fns: [
      ["Company health", "A single read on how the company is doing."],
      ["People, attendance & leave", "Employees, who is in, and who is away."],
      ["Projects, health & deadlines", "What is on track, and what is slipping."],
      ["Finance: revenue, expenses & cash position", "The money picture."],
      ["Pending approvals", "What is waiting for a decision."],
      ["New employees & employee changes", "Who joined, and what changed."],
      ["Security events & system alerts", "What needs attention."],
      ["What happened today?", "Joins and exits, projects and tasks, leave, expenses, invoices, documents, permission changes and security events."],
    ],
    rel: ["dashboards", "reporting-analytics", "approval-engine", "audit-system", "security-center", "finance-accounting", "project-management"],
    note: "The backend exists; the screens are being built.",
  }),

  // ───────────────────────── PART 23 ─────────────────────────
  part({
    n: 23, slug: "audit-system", group: "security", status: "building", screen: "table",
    name: "Audit trail",
    outcome: "Keep a permanent record of who did what, when and what changed, for every important action.",
    what: "Every important operation is recorded with the actor, action, resource, resource ID, organization, timestamp, context, before and after state, and a reason where required. Logins, user and role changes, HR, salary, finance, projects, documents, security and settings are all tracked.",
    who: [
      ["Owners and super admins", "When investigating what happened, or showing who approved something"],
      ["HR and finance leads", "When a change to pay, roles or records needs a trail"],
      ["Security reviewers", "When looking into suspicious activity"],
    ],
    pdr: [
      "When something goes wrong, nobody can say who changed what, or what it was before.",
      "NAVICORE ONE records each important action with its before and after state in an append-only log, with restricted access.",
      "You can look back and see exactly what happened.",
    ],
    flows: [{
      title: "Recording an action", src: "composed",
      steps: [
        ["Someone acts", "Sign-in, role change, salary change, finance, settings..."],
        ["Event recorded", "Actor, action, resource, time, context, before and after"],
        "Stored append-only",
        ["Search & filter"],
        "Export",
        ["Retention policy"],
      ],
    }],
    fns: [
      ["What is recorded", "Actor, action, resource, resource ID, organization, timestamp, context, before and after state, and a reason where required."],
      ["What is tracked", "Login, logout, user, role and permission changes, HR and salary changes, finance, projects, documents, security and settings."],
      ["Append-only", "Records are added, not rewritten."],
      ["Searchable & filterable", "Find the one event you need."],
      ["Exportable", "Take records out for review."],
      ["Retention policy", "Decide how long records are kept."],
      ["Restricted access", "Only people with permission can read the trail."],
    ],
    rel: ["rbac-permissions", "security-center", "hr-lifecycle", "finance-accounting", "executive-control-center", "ai-platform"],
  }),

  // ───────────────────────── PART 24 ─────────────────────────
  part({
    n: 24, slug: "global-search", group: "knowledge", status: "building", screen: "search",
    name: "Global search",
    outcome: "Find any person, project, task, client, document or message you are allowed to see, in one search.",
    what: "One search across people, projects, tasks, clients, documents, messages, invoices, transactions, events and knowledge, always limited to what you are authorized to see. Semantic, natural-language and AI search are planned for later.",
    who: [
      ["Everyone", "Whenever they cannot remember where something lives"],
      ["New employees", "While they are learning where things are"],
      ["Managers", "When looking across projects, people and clients"],
    ],
    pdr: [
      "Finding something means knowing which tool, folder or chat to open first.",
      "NAVICORE ONE searches ten kinds of records at once, and only returns what the person is authorized to see.",
      "One box finds it, and nobody sees what they should not.",
    ],
    flows: [{
      title: "A search", src: "composed",
      steps: [
        "Type your search",
        ["Searched across ten areas", "People, projects, tasks, clients, documents, messages, invoices, transactions, events, knowledge"],
        ["Results limited to what you may see"],
        "Open the record",
      ],
    }],
    fns: [
      ["People & clients", "Find colleagues and client records."],
      ["Projects & tasks", "Find the work."],
      ["Documents & knowledge", "Find files, policies and wiki pages."],
      ["Messages", "Find what was said."],
      ["Invoices & transactions", "Find finance records (if you have access)."],
      ["Events", "Find meetings and calendar events."],
      ["Authorized results only", "Search never returns records you are not allowed to see."],
      ["Semantic, natural-language & AI search", "Planned for later."],
    ],
    rel: ["document-management", "ai-platform", "rbac-permissions", "people-directory", "project-management"],
  }),

  // ───────────────────────── PART 25 ─────────────────────────
  part({
    n: 25, slug: "ai-platform", group: "automation", status: "building", screen: "chat",
    name: "AI platform",
    outcome: "Get help from built-in AI assistants that follow the same permissions as the people using them.",
    what: "AI is built into the OS: personal, company, project, HR, finance, document and knowledge assistants. They summarize, search, generate reports, create tasks, analyze documents and meetings, draft email, assist HR, analyze finances and projects, and create workflows. They respect roles and tenant isolation, cannot reach unauthorized records, ask for confirmation on sensitive actions and are auditable.",
    who: [
      ["Employees", "For summaries, drafts, search and everyday help"],
      ["Managers and project leads", "For project analysis, reports and meeting summaries"],
      ["HR and finance teams", "For analysis in their own area, within their permissions"],
    ],
    pdr: [
      "Adding AI to company data raises a fair worry: will it see or do something it should not?",
      "NAVICORE ONE builds AI inside the permission system: it works only with what the user may see, needs permission to act, confirms sensitive actions and is audited.",
      "You get the help without opening a back door to company data.",
    ],
    flows: [{
      title: "Asking an assistant", src: "composed",
      steps: [
        ["Ask", "Personal, company, project, HR, finance, document or knowledge assistant"],
        ["Permissions checked", "Roles and tenant isolation apply"],
        ["Answer", "Using only records you are authorized to see"],
        ["Action proposed", "Create a task, draft an email, build a workflow"],
        ["Confirmation", "Required for sensitive actions"],
        ["Audit", "AI activity is auditable"],
      ],
    }],
    fns: [
      ["Seven assistants", "Personal, company, project, HR, finance, document and knowledge AI."],
      ["Summarization & search", "Condense long material and find what you need."],
      ["Report generation", "Draft reports from company data."],
      ["Task creation", "Turn a request into tasks."],
      ["Document analysis & meeting summary", "Understand a document, or what happened in a meeting."],
      ["Email drafting", "Start a message for you."],
      ["HR, financial & project analysis", "Assistance in each specialist area."],
      ["Workflow creation", "Help build automations."],
      ["AI security rules", "Respects RBAC and tenant isolation, cannot reach unauthorized records, actions need permission, sensitive actions need confirmation, and activity is auditable."],
    ],
    rel: ["global-search", "document-management", "rbac-permissions", "audit-system", "automation-engine", "reporting-analytics"],
    note: "The backend exists; the screens are being built.",
  }),

  // ───────────────────────── PART 26 ─────────────────────────
  part({
    n: 26, slug: "automation-engine", group: "automation", status: "building", screen: "flow",
    name: "Automation engine",
    outcome: "Turn repeated work into rules: when something happens, check a condition, then act automatically.",
    what: "A workflow builder in which every automation has a trigger, optional conditions, actions and a result. It supports delays, branches, templates, execution history, retry and failure handling.",
    who: [
      ["Admins and operations leads", "When building workflows for the company"],
      ["HR", "Where onboarding steps should happen without being typed in again"],
      ["Managers", "When they want to be notified automatically"],
    ],
    pdr: [
      "The same follow-up steps get done by hand, every time, and sometimes get missed.",
      "NAVICORE ONE lets you define a trigger, a condition and actions once, and runs them for you, with history, retries and failure handling.",
      "Repeated work happens the same way every time, and you can see what ran.",
    ],
    flows: [
      {
        title: "How an automation runs", src: "guide",
        steps: [["Trigger", "Something happens"], ["Condition", "A check is made"], ["Action", "Something is done"], ["Result", "The outcome is recorded"]],
      },
      {
        title: "Example from the guide", src: "guide",
        steps: ["Employee approved", "Create account", "Assign role", "Assign onboarding tasks", "Notify manager"],
      },
    ],
    fns: [
      ["Workflow builder", "Create automations without code."],
      ["Triggers", "The event that starts a workflow."],
      ["Conditions", "Only continue if something is true."],
      ["Actions", "What the workflow does."],
      ["Delays & branches", "Wait before acting, or take a different path."],
      ["Templates", "Start from a ready-made workflow."],
      ["Execution history", "See what ran, and when."],
      ["Retry & failure handling", "Try again, and deal with what goes wrong."],
    ],
    rel: ["approval-engine", "hr-lifecycle", "ai-platform", "notification-center", "core-employee-flow"],
    note: "The backend exists; the screens are being built.",
  }),
  // ───────────────────────── PART 27 ─────────────────────────
  part({
    n: 27, slug: "notification-center", group: "comms", status: "building", screen: "cards",
    name: "Notification center",
    outcome: "Make sure people hear about what matters, on the channel they prefer, and not when they should not.",
    what: "Notifications arrive in-app, as web push, on desktop, on Android and iOS, and by email. Each person sets preferences and quiet hours. Notifications carry a priority, are grouped, marked read or unread and kept in a history.",
    who: [
      ["Every employee", "Whenever something needs their attention, from a task to an approval"],
      ["Managers and approvers", "When a request is waiting for their decision"],
      ["Anyone who wants fewer interruptions", "When setting their preferences and quiet hours"],
    ],
    pdr: [
      "Too many pings, or too few, and the important thing gets missed.",
      "NAVICORE ONE sends notifications on the right channel, groups them, ranks them by priority and respects each person's preferences and quiet hours.",
      "People are told what matters, without being overwhelmed.",
    ],
    flows: [{
      title: "From event to notification", src: "composed",
      steps: [
        ["Something happens", "A task is assigned, a request needs approval..."],
        ["Notification created", "With a priority"],
        ["Channel chosen", "In-app, web push, desktop, Android, iOS or email, from preferences"],
        ["Quiet hours respected"],
        "Read or unread",
        "History",
      ],
    }],
    fns: [
      ["In-app & web push", "Alerts inside NAVICORE ONE and in the browser."],
      ["Email", "For people who live in their inbox."],
      ["Desktop, Android & iOS", "Notifications on those apps, arriving with the apps."],
      ["Notification preferences", "Each person chooses what they receive and how."],
      ["Priority & grouping", "Urgent things stand out; related ones are bundled."],
      ["Read / unread", "See what you have already dealt with."],
      ["Quiet hours", "No pings when you are off."],
      ["Notification history", "Go back and find one."],
    ],
    rel: ["announcements-broadcast", "communication", "approval-engine", "project-management", "dashboards"],
  }),

  // ───────────────────────── PART 28 ─────────────────────────
  part({
    n: 28, slug: "dashboards", group: "insight", status: "building", screen: "dashboard",
    name: "Role dashboards",
    outcome: "Open NAVICORE ONE and see what your role needs first, from employee to owner.",
    what: "A dashboard for each kind of person. Employees see tasks, calendar, leave, attendance, chat, announcements and notifications. Managers, HR, accountants, project managers and the owner each get a dashboard built from the modules their role uses.",
    who: [
      ["Employees", "At the start of each day"],
      ["Managers, HR, accountants and project managers", "When running their own area"],
      ["Owners", "When they want the company in one view, with people, HR, projects, finance, security, audit and system control"],
    ],
    pdr: [
      "One generic home page shows everyone the same clutter.",
      "NAVICORE ONE gives each role its own dashboard built from the modules that role actually uses.",
      "Each person starts the day with a view that fits their job.",
    ],
    flows: [{
      title: "Your dashboard", src: "composed",
      steps: [
        "Sign in",
        ["Dashboard for your role", "Employee, manager, HR, accountant, project manager or owner"],
        ["Items from the modules you use"],
        "Open an item and act",
      ],
    }],
    fns: [
      ["Employee dashboard", "Tasks, calendar, leave, attendance, chat, announcements, notifications."],
      ["Manager dashboard", "Team, tasks, projects, leave, performance, approvals."],
      ["HR dashboard", "People, hiring, leave, attendance, employee lifecycle, HR approvals."],
      ["Accountant dashboard", "Cash, income, expenses, invoices, approvals, reports."],
      ["Project manager dashboard", "Projects, tasks, deadlines, team, health."],
      ["Owner dashboard", "Company overview, people, HR, projects, finance, security, audit, system control."],
    ],
    rel: ["executive-control-center", "reporting-analytics", "project-management", "notification-center", "approval-engine"],
    note: "A dashboard shell is shipped; role dashboards are being built.",
  }),

  // ───────────────────────── PART 29 ─────────────────────────
  part({
    n: 29, slug: "reporting-analytics", group: "insight", status: "building", screen: "table",
    name: "Reports & analytics",
    outcome: "Turn company data into reports you can read, export and schedule.",
    what: "Reports for HR, attendance, leave, employees, projects, tasks, finance, expenses, clients and management, plus custom reports. Reports export to CSV or PDF and can be scheduled.",
    who: [
      ["Managers and HR", "When reviewing their team, attendance and leave"],
      ["Finance and owners", "When looking at finance, expenses and management reports"],
      ["Anyone who needs a regular report", "When they want it scheduled instead of rebuilt each time"],
    ],
    pdr: [
      "Building a report by hand from several tools takes time, and each person's version differs.",
      "NAVICORE ONE reports from the same live records the modules use, with custom reports, CSV and PDF export and scheduling.",
      "Reports are consistent, repeatable and shareable.",
    ],
    flows: [{
      title: "From question to report", src: "composed",
      steps: [
        ["Choose a report", "Or build a custom one"],
        "Filter",
        "View",
        ["Export", "CSV or PDF"],
        "Schedule it",
      ],
    }],
    fns: [
      ["HR, attendance, leave & employee reports", "The people side of the company."],
      ["Project & task reports", "Progress and workload."],
      ["Finance & expense reports", "Money in and out."],
      ["Client reports", "Activity and results by client."],
      ["Management reports", "A summary for decision-makers."],
      ["Custom reports", "Build the report you need."],
      ["CSV & PDF export", "Take it out of the system."],
      ["Scheduled reports", "Have it prepared for you at regular intervals."],
    ],
    rel: ["dashboards", "executive-control-center", "finance-accounting", "attendance-schedules", "time-tracking"],
    note: "The analytics backend exists; the screens are being built.",
  }),

  // ───────────────────────── PART 30 ─────────────────────────
  part({
    n: 30, slug: "company-settings", group: "platform", status: "building", screen: "settings",
    name: "Company settings",
    outcome: "Set up and change how your company runs in NAVICORE ONE, from one settings area.",
    what: "General settings (name, logo, domain, branding, timezone, currency, language, working schedule), HR policies (leave, attendance, work schedules, employment types), finance setup (accounts, categories, fiscal year, tax), security (MFA, SSO, sessions, devices, IP restrictions, security policies) and integrations (email, calendar, storage, AI, payments, webhooks, API).",
    who: [
      ["Owners and admins", "When first setting up the company, and when its rules change"],
      ["HR", "When changing leave, attendance and schedule policies"],
      ["Finance", "When setting up accounts, categories, fiscal year and tax"],
    ],
    pdr: [
      "Company rules scattered across modules are hard to find and easy to leave inconsistent.",
      "NAVICORE ONE keeps general, HR, finance, security and integration settings in one area, each controlled by permission.",
      "Changing a rule happens in one place, and the modules follow it.",
    ],
    flows: [{
      title: "Setting up the company", src: "composed",
      steps: [
        ["General", "Name, logo, domain, branding, timezone, currency, language, schedule"],
        ["HR", "Leave and attendance policies, work schedules, employment types"],
        ["Finance", "Accounts, categories, fiscal year, tax"],
        ["Security", "MFA, SSO, sessions, devices, IP restrictions, policies"],
        ["Integrations", "Email, calendar, storage, AI, payments, webhooks, API"],
      ],
    }],
    fns: [
      ["General", "Name, logo, domain, branding, timezone, currency, language and working schedule."],
      ["HR settings", "Leave policies, attendance policies, work schedules and employment types."],
      ["Finance settings", "Accounts, categories, fiscal year and tax settings."],
      ["Security settings", "MFA, SSO, sessions, devices, IP restrictions and security policies."],
      ["Integration settings", "Email, calendar, storage, AI, payments, webhooks and API."],
    ],
    rel: ["multi-tenancy", "license-platform", "security-center", "api-developer-platform", "client-onboarding"],
    note: "The backend exists; the screens are being built.",
  }),

  // ───────────────────────── PART 31 ─────────────────────────
  part({
    n: 31, slug: "api-developer-platform", group: "dev", status: "building", screen: "settings",
    name: "API & developer platform",
    outcome: "Connect NAVICORE ONE to your own systems with a documented, permissioned API and webhooks.",
    what: "A REST API with authentication, API keys, API permissions, rate limiting and versioning. Webhooks with retries and logs, OpenAPI and developer documentation, and OAuth applications. A plugin SDK is planned for the future.",
    who: [
      ["Developers", "When building their own connections to NAVICORE ONE"],
      ["Admins", "When creating API keys and deciding what each key may do"],
      ["Security reviewers", "When checking which API keys and webhooks exist"],
    ],
    pdr: [
      "A business system that cannot talk to anything else ends up with data typed in twice.",
      "NAVICORE ONE offers a versioned REST API with keys, permissions and rate limits, and webhooks that retry and keep logs.",
      "Your systems can read and react to NAVICORE ONE, within limits you control.",
    ],
    flows: [{
      title: "Connecting a system", src: "composed",
      steps: [
        "Create an API key",
        ["Set its permissions"],
        ["Call the REST API", "Versioned, with rate limits"],
        ["Webhooks notify your system", "Retries and logs included"],
      ],
    }],
    fns: [
      ["REST API", "A standard way for software to talk to NAVICORE ONE."],
      ["Authentication & API keys", "Prove who is calling."],
      ["API permissions", "Limit what each key can do."],
      ["Rate limiting", "Protect the service from overuse."],
      ["API versioning", "Change the API without breaking existing connections."],
      ["Webhooks, retries & logs", "Be told when something happens, with a record of delivery."],
      ["OpenAPI & developer documentation", "Machine-readable and human-readable descriptions of the API."],
      ["OAuth applications", "Let other apps ask for access on a person's behalf."],
      ["Plugin SDK", "Planned for the future."],
    ],
    rel: ["company-settings", "security-center", "future-integrations", "marketplace-extensions", "rbac-permissions"],
  }),

  // ───────────────────────── PART 32 ─────────────────────────
  part({
    n: 32, slug: "web-app", group: "apps", status: "building", screen: "dashboard",
    name: "Web app",
    outcome: "Use NAVICORE ONE in a browser on desktop, tablet or phone, in light or dark mode.",
    what: "The web app is responsive across desktop, tablet and mobile web, with light and dark modes, keyboard shortcuts, a command palette, global search, a workspace switcher, notifications, accessibility and reduced-motion support.",
    who: [
      ["Every employee", "For everyday work on any screen size"],
      ["People who belong to more than one workspace", "When switching between them"],
      ["Keyboard-first users", "When using shortcuts and the command palette"],
    ],
    pdr: [
      "Business software that works only at a desk leaves half the day uncovered.",
      "NAVICORE ONE is built as a responsive web app, with the same search, notifications and shortcuts on every screen size.",
      "You can check, decide and act from wherever you are.",
    ],
    flows: [{
      title: "Using the web app", src: "composed",
      steps: [
        "Sign in",
        ["Pick a workspace", "Workspace switcher"],
        ["Find your way", "Command palette, global search or keyboard shortcuts"],
        "Open a module",
        ["Notifications bring you back"],
      ],
    }],
    fns: [
      ["Responsive layouts", "Desktop, tablet and mobile web."],
      ["Light & dark mode", "Choose the look that suits your eyes."],
      ["Keyboard shortcuts", "Move faster without a mouse."],
      ["Command palette", "Type what you want to do."],
      ["Global search", "Find anything you may see."],
      ["Workspace switcher", "Move between workspaces."],
      ["Notifications", "Be told what needs you."],
      ["Accessibility & reduced motion", "Works for more people, and respects motion preferences."],
    ],
    rel: ["global-search", "notification-center", "accessibility", "internationalization", "desktop-app", "mobile-app"],
    note: "Shipped in part; features arrive as each module does.",
  }),

  // ───────────────────────── PART 33 ─────────────────────────
  part({
    n: 33, slug: "desktop-app", group: "apps", status: "future", screen: "cards",
    name: "Desktop app",
    outcome: "Use NAVICORE ONE as an app on Windows, macOS and Linux, with notifications and an offline queue.",
    what: "A desktop app for Windows, macOS and Linux. It is specified with secure authentication, dashboard, tasks, chat, calls, notifications, calendar, attendance, file upload, background sync and an offline queue, plus automatic updates, crash reporting, installers, code signing and release channels.",
    who: [
      ["Employees who work at a computer all day", "For quick access, notifications and calls"],
      ["IT teams", "When installing and updating the app across a company"],
    ],
    pdr: [
      "A browser tab is easy to lose, and easy to miss notifications from.",
      "The planned desktop app keeps NAVICORE ONE in its own window, with notifications, calls and a queue for when the connection drops.",
      "NAVICORE ONE stays close at hand throughout the working day.",
    ],
    flows: [{
      title: "Planned: installing and using the app", src: "composed",
      steps: [
        ["Install", "Windows installer, macOS package or Linux package; code signed"],
        "Secure sign-in",
        ["Work", "Dashboard, tasks, chat, calls, calendar, attendance, file upload"],
        ["Background sync & offline queue"],
        ["Automatic updates", "Through release channels"],
      ],
    }],
    fns: [
      ["Windows, macOS & Linux", "Installers and packages for all three."],
      ["Secure authentication", "Signing in safely from a desktop app."],
      ["Dashboard, tasks, chat & calls", "The everyday modules in an app window."],
      ["Calendar & attendance", "Meetings and check-in from the desktop."],
      ["File upload", "Add files without opening a browser."],
      ["Background sync & offline queue", "Keep working when the connection drops."],
      ["Automatic updates & release channels", "Stay current, with a controlled rollout."],
      ["Crash reporting & code signing", "Find faults, and prove the app is genuine."],
    ],
    rel: ["web-app", "mobile-app", "sync-offline", "notification-center", "device-management"],
    note: "Not started. Shown here to explain the intended direction.",
    todos: [todo("p33-visibility", "The guide marks the Desktop App as OUT and dormant, while the earlier presentation site says it comes next. Should this page be public at all? It is noindex and left out of the sitemap until you decide.", true)],
  }),

  // ───────────────────────── PART 34 ─────────────────────────
  part({
    n: 34, slug: "mobile-app", group: "apps", status: "future", screen: "cards",
    name: "Mobile app",
    outcome: "Use NAVICORE ONE from Android and iOS for attendance, approvals, tasks and chat.",
    what: "A mobile app for Android and iOS. It is specified with login, dashboard, chat, push notifications, tasks, leave, attendance, calendar, announcements, documents, approvals and profile, plus offline support, sync, secure storage and biometrics.",
    who: [
      ["Employees on the move", "For check-in, leave, tasks and chat away from a desk"],
      ["Managers", "For approving requests wherever they are"],
    ],
    pdr: [
      "Many working days happen away from a desk, but approvals and check-ins still need doing.",
      "The planned mobile app brings attendance, leave, approvals, tasks and chat to a phone, with offline support and biometric sign-in.",
      "Decisions and check-ins no longer wait for a laptop.",
    ],
    flows: [{
      title: "Planned: a day on mobile", src: "composed",
      steps: [
        ["Sign in", "With biometrics, where the phone supports it"],
        "Dashboard",
        ["Do the quick things", "Attendance, leave, approvals, tasks, chat, announcements"],
        ["Offline support"],
        ["Sync", "Changes go up when the connection returns"],
      ],
    }],
    fns: [
      ["Android & iOS", "Both main phone platforms."],
      ["Login, dashboard & profile", "Sign in and see your own view."],
      ["Chat & push notifications", "Be reached, and reach people."],
      ["Tasks, leave & attendance", "Everyday self-service."],
      ["Calendar & announcements", "Know what is happening."],
      ["Documents & approvals", "Read, sign off and move on."],
      ["Offline support & sync", "Keep working with a weak connection."],
      ["Secure storage & biometrics", "Protect data on the device."],
    ],
    rel: ["web-app", "desktop-app", "sync-offline", "attendance-schedules", "approval-engine"],
    note: "Not started. Shown here to explain the intended direction.",
    todos: [todo("p34-visibility", "The guide lists the Mobile App as OUT (later horizon). Should this page be public? It is noindex and left out of the sitemap until you decide. The hero devices on this site show the responsive web app, not a native app.", true)],
  }),

  // ───────────────────────── PART 35 ─────────────────────────
  part({
    n: 35, slug: "sync-offline", group: "apps", status: "planned", screen: "flow",
    name: "Sync & offline",
    outcome: "Keep working without a connection, and have your changes sync safely when you are back online.",
    what: "A local cache supports offline reads and offline actions where they are safe. Changes wait in a sync queue and retry, conflicts are resolved, failed syncs and the last-synced time are shown, and the network is detected. Permissions, finance, security and destructive actions stay server-authoritative: they are never resolved on the device.",
    who: [
      ["Employees with a patchy connection", "When they need to keep working or check in"],
      ["Finance and security teams", "Where the server must always have the final say"],
    ],
    pdr: [
      "Connections drop, and an app that stops working leaves people stuck or guessing.",
      "NAVICORE ONE keeps a local cache and a sync queue, retries, resolves conflicts and shows the sync status, while sensitive operations stay on the server.",
      "People keep working, and nothing risky is decided on a device.",
    ],
    flows: [{
      title: "From offline action to synced", src: "composed",
      steps: [
        ["Offline", "Reads from the local cache; safe actions allowed"],
        ["Sync queue", "Changes wait their turn"],
        "Network detected",
        ["Sync with retry", "Conflicts resolved"],
        ["Status shown", "Last synced time, or a failed-sync notice"],
      ],
    }],
    fns: [
      ["Local cache & offline reads", "See recent data without a connection."],
      ["Offline actions where safe", "Do what can be done safely, and queue it."],
      ["Sync queue & retry", "Changes upload when the connection returns."],
      ["Conflict resolution", "Decide what to keep when two changes clash."],
      ["Failed-sync status & last synced", "Always know where you stand."],
      ["Network detection", "The app knows when it is offline."],
      ["Server-authoritative critical operations", "Permissions, finance, security and destructive actions are never resolved client-side."],
    ],
    rel: ["desktop-app", "mobile-app", "attendance-schedules", "device-management", "web-app"],
    todos: [todo("p35-visibility", "Sync and offline mainly serve the Desktop and Mobile apps, which the guide lists as out of current scope. Public, or hold? It is noindex until you decide.", true)],
  }),

  // ───────────────────────── PART 36 ─────────────────────────
  part({
    n: 36, slug: "device-management", group: "security", status: "planned", screen: "table",
    name: "Device management",
    outcome: "See every device signed in to your account, trust the ones you know and revoke the rest.",
    what: "Devices are registered with a name, platform and last-active time. Each device has sessions, can be marked trusted, logged out remotely or revoked, and keeps its own security history.",
    who: [
      ["Every employee", "When checking where their account is signed in"],
      ["Owners and super admins", "When a device is lost, or something looks suspicious"],
    ],
    pdr: [
      "A forgotten laptop or phone can stay signed in long after it should not be.",
      "NAVICORE ONE registers each device, shows its sessions and last activity, and lets you trust, log out or revoke it.",
      "You decide which devices are allowed, and can end one from anywhere.",
    ],
    flows: [{
      title: "Managing a device", src: "composed",
      steps: ["Device registered", ["Sessions", "Name, platform, last active"], "Trusted device", ["Remote logout or revoke"], "Device security history"],
    }],
    fns: [
      ["Device registration", "Each device is known to the system."],
      ["Name, platform & last active", "Recognize a device at a glance."],
      ["Sessions", "See what is signed in on it."],
      ["Trusted device", "Mark devices you know."],
      ["Remote logout & revoke", "End access from afar."],
      ["Device security history", "What has happened on this device."],
    ],
    rel: ["authentication-identity", "security-center", "it-operations", "desktop-app", "mobile-app"],
  }),

  // ───────────────────────── PART 37 ─────────────────────────
  part({
    n: 37, slug: "security-center", group: "security", status: "building", screen: "dashboard",
    name: "Security center",
    outcome: "Watch sign-ins, devices, permission changes and alerts for the whole company in one place.",
    what: "A security overview for the Owner and Super Admin: active sessions, devices, login attempts, suspicious activity, MFA status, permission changes, security alerts, IP restrictions, audit logs, API keys, webhooks and security policies.",
    who: [
      ["Owners", "When checking that the company's access is under control"],
      ["Super admins", "When responding to alerts and suspicious activity"],
    ],
    pdr: [
      "Security signals spread across tools mean problems are noticed late, or not at all.",
      "NAVICORE ONE brings sessions, devices, login attempts, suspicious activity, permission changes, keys and policies into one place.",
      "You can see what is happening and step in.",
    ],
    flows: [{
      title: "Watching and responding", src: "composed",
      steps: [
        ["Monitor", "Sessions, devices, login attempts, MFA status"],
        ["Alert", "Suspicious activity or security alerts"],
        ["Investigate", "Permission changes and audit logs"],
        ["Respond", "End sessions, IP restrictions, API keys, security policies"],
      ],
    }],
    fns: [
      ["Active sessions & devices", "Who is signed in, and from what."],
      ["Login attempts & suspicious activity", "Spot unusual behavior."],
      ["MFA status", "See who has the second step turned on."],
      ["Permission changes", "Watch changes to who can do what."],
      ["Security alerts", "Be told when something needs attention."],
      ["IP restrictions", "Limit where sign-in can come from."],
      ["Audit logs", "The full record behind each event."],
      ["API keys & webhooks", "See what is connected from outside."],
      ["Security policies", "Rules for the whole company."],
    ],
    rel: ["authentication-identity", "audit-system", "device-management", "company-settings", "api-developer-platform", "executive-control-center"],
    note: "The backend exists; the screens are being built.",
  }),

  // ───────────────────────── PART 38 ─────────────────────────
  part({
    n: 38, slug: "backup-disaster-recovery", group: "security", status: "building", screen: "settings",
    name: "Backup & recovery",
    outcome: "Protect company data with automated, encrypted backups and a way to restore it.",
    what: "Automated database and file backups, encrypted and kept under a retention policy, with restore, disaster recovery and recovery testing. Organizations can export their data, and data can be deleted.",
    who: [
      ["Owners", "When they need to know the company's data can be recovered"],
      ["The NAVICORE team", "When running backups and restores"],
    ],
    pdr: [
      "A company that has never tested a restore does not really know whether it has a backup.",
      "NAVICORE ONE plans automated database and file backups with encryption, retention, restore and recovery testing.",
      "Data can be brought back, and the process can be checked.",
    ],
    flows: [{
      title: "Backing up and restoring", src: "composed",
      steps: [
        ["Automated backups", "Database and files"],
        "Encryption",
        "Backup retention",
        ["Restore", "Or disaster recovery"],
        "Recovery testing",
      ],
    }],
    fns: [
      ["Automated backups", "Database backups and file backups, without manual steps."],
      ["Encryption", "Backups are encrypted."],
      ["Backup retention", "Decide how long backups are kept."],
      ["Restore & disaster recovery", "Bring data back after a failure."],
      ["Recovery testing", "Prove that a restore works."],
      ["Data & organization export", "Take your data out."],
      ["Data deletion", "Remove data when it should go."],
    ],
    rel: ["multi-tenancy", "privacy-data-governance", "observability", "company-settings", "security-center"],
    todos: [todo("p38-practices", "Which backup and recovery practices run today? Described as scope only. No retention periods, recovery times or guarantees are stated.")],
  }),

  // ───────────────────────── PART 39 ─────────────────────────
  part({
    n: 39, slug: "privacy-data-governance", group: "security", status: "building", screen: "settings",
    name: "Privacy & data governance",
    outcome: "Control how long data is kept, who can access it and how it is exported or deleted.",
    what: "Data retention, deletion and export, user data access, document and audit retention, privacy controls, organization policies and privacy documentation.",
    who: [
      ["Owners and admins", "When setting the company's retention and privacy policies"],
      ["Employees", "When asking what data the company holds about them"],
    ],
    pdr: [
      "Without clear rules, data is either kept forever or deleted too soon.",
      "NAVICORE ONE provides retention, export, deletion and access controls for company data, documents and audit records.",
      "The company decides how its data is handled, and can show it.",
    ],
    flows: [{
      title: "Governing data", src: "composed",
      steps: ["Organization policies", "Data retention", "User data access", "Data export", "Data deletion"],
    }],
    fns: [
      ["Data retention", "How long each kind of data is kept."],
      ["Document retention & audit retention", "Separate rules for files and for the audit trail."],
      ["User data access", "A person can see what is held about them."],
      ["Data export", "Take data out in a usable form."],
      ["Data deletion", "Remove data when it should go."],
      ["Privacy controls", "Settings that limit who sees what."],
      ["Organization policies", "Rules the company sets for itself."],
      ["Privacy documentation", "Written explanations of how data is handled."],
    ],
    rel: ["audit-system", "backup-disaster-recovery", "document-management", "company-settings", "multi-tenancy"],
    todos: [todo("p39-legal", "Privacy and data-handling statements need legal review before launch. This page makes no compliance claims (no GDPR, ISO or similar), because none are in the guide.")],
  }),
  // ───────────────────────── PART 40 ─────────────────────────
  part({
    n: 40, slug: "observability", group: "security", status: "building", screen: "dashboard",
    name: "Observability",
    outcome: "Spot and fix problems early with logs, error tracking, health checks and uptime monitoring.",
    what: "Application and API logs, error tracking, database and performance monitoring, distributed tracing, health checks, uptime, background jobs, notification delivery and security monitoring.",
    who: [
      ["The NAVICORE engineering team", "When something looks wrong or slow"],
      ["Customers and IT teams", "When checking whether the service is healthy"],
    ],
    pdr: [
      "Problems found by users first are problems found too late.",
      "NAVICORE ONE is specified with logs, error tracking, monitoring, tracing, health checks and uptime checks across the application, API, database, jobs and notifications.",
      "Faults are seen, traced and fixed sooner.",
    ],
    flows: [{
      title: "Watching the system", src: "composed",
      steps: [
        ["Logs", "Application and API"],
        "Error tracking",
        ["Monitoring", "Database and performance"],
        "Distributed tracing",
        ["Health checks & uptime"],
        ["Jobs, notifications & security", "Monitored too"],
      ],
    }],
    fns: [
      ["Application & API logs", "A record of what the system did."],
      ["Error tracking", "Catch and group errors."],
      ["Database & performance monitoring", "Watch for slowness."],
      ["Distributed tracing", "Follow one request across the system."],
      ["Health checks & uptime", "Know whether it is up."],
      ["Background jobs", "Watch work that runs behind the scenes."],
      ["Notification delivery", "Check that messages are being delivered."],
      ["Security monitoring", "Watch for security problems."],
    ],
    rel: ["it-operations", "security-center", "backup-disaster-recovery", "public-website", "notification-center"],
  }),

  // ───────────────────────── PART 41 ─────────────────────────
  part({
    n: 41, slug: "internationalization", group: "apps", status: "building", screen: "settings",
    name: "Languages & regions",
    outcome: "Use NAVICORE ONE in English or Bangla, with local dates, numbers, currency and time zones.",
    what: "English and Bangla are built in from day one, on a translation framework that can take further languages. Dates, numbers, currency and timezones follow the local format, and the architecture is ready for right-to-left languages.",
    who: [
      ["Employees", "When they want the product in their own language"],
      ["Owners and admins", "When setting the company's language, currency and timezone"],
    ],
    pdr: [
      "Software that treats language and local formats as an afterthought feels foreign to the people using it.",
      "NAVICORE ONE is built for English and Bangla from the start, with local dates, numbers, currency and timezones.",
      "People work in their own language, in the formats they know.",
    ],
    flows: [{
      title: "Making it local", src: "composed",
      steps: ["Choose a language", ["Local dates & numbers"], ["Currency & timezone"], ["Translation framework", "Powers every screen"], ["More languages & RTL-ready", "In the future"]],
    }],
    fns: [
      ["English & Bangla", "Both from day one."],
      ["Translation framework", "A shared way to translate every screen."],
      ["Local dates & numbers", "Written the way people expect."],
      ["Currency", "Money in the right currency."],
      ["Timezone", "Times that make sense where you are."],
      ["Future languages", "More languages can be added."],
      ["RTL-ready architecture", "Designed so right-to-left languages can be supported."],
    ],
    rel: ["company-settings", "web-app", "accessibility", "multi-tenancy", "public-website"],
  }),

  // ───────────────────────── PART 42 ─────────────────────────
  part({
    n: 42, slug: "accessibility", group: "apps", status: "building", screen: "form",
    name: "Accessibility",
    outcome: "Make NAVICORE ONE usable with a keyboard, a screen reader and reduced motion.",
    what: "Keyboard navigation, screen reader support, visible focus states, ARIA, readable contrast, reduced motion, and accessible forms, tables and notifications.",
    who: [
      ["People who use a keyboard or assistive technology", "Every time they use the product"],
      ["People who are sensitive to motion", "When they set a reduced-motion preference"],
      ["Everyone", "In poor light, or on a small screen"],
    ],
    pdr: [
      "Software built only for the mouse and the average eye leaves some colleagues out.",
      "NAVICORE ONE treats keyboard use, screen readers, focus, contrast and reduced motion as requirements for every screen.",
      "More of your team can do their job without extra effort.",
    ],
    flows: [{
      title: "What every screen is checked for", src: "composed",
      steps: ["Keyboard navigation", "Focus states", "ARIA & screen readers", "Contrast", "Reduced motion", ["Forms, tables & notifications", "Made accessible"]],
    }],
    fns: [
      ["Keyboard navigation", "Everything reachable without a mouse."],
      ["Screen readers & ARIA", "Content that assistive tools can read."],
      ["Focus states", "You can always see where you are."],
      ["Contrast", "Text that is readable."],
      ["Reduced motion", "Less movement for those who need it."],
      ["Accessible forms", "Clear labels and errors."],
      ["Accessible tables", "Data tables that can be navigated."],
      ["Accessible notifications", "Alerts that everyone can notice."],
    ],
    rel: ["web-app", "internationalization", "notification-center", "testing"],
  }),

  // ───────────────────────── PART 43 ─────────────────────────
  part({
    n: 43, slug: "testing", group: "dev", status: "building", screen: "table",
    name: "Testing",
    outcome: "Understand the areas NAVICORE ONE is planned to be tested in: logic, security and full flows.",
    what: "Four kinds of testing are specified: unit (business logic, permission logic, validation, financial calculations), integration (API, database, authentication, authorization, notifications), security (tenant isolation, RBAC, privilege escalation, unauthorized access, session security) and end-to-end flows.",
    who: [
      ["The NAVICORE engineering team", "Whenever a module changes"],
      ["Technical reviewers", "When asking how quality and security are checked"],
    ],
    pdr: [
      "A business system that handles pay, approvals and company data cannot rely on hoping it works.",
      "NAVICORE ONE specifies tests for business logic, permissions and money calculations, for the systems it connects, for tenant isolation and privilege escalation, and for whole user journeys.",
      "The riskiest parts are the most carefully checked.",
    ],
    flows: [{
      title: "Layers of testing", src: "composed",
      steps: [
        ["Unit", "Business logic, permissions, validation, financial calculations"],
        ["Integration", "API, database, authentication, authorization, notifications"],
        ["Security", "Tenant isolation, RBAC, privilege escalation, unauthorized access, sessions"],
        ["End to end", "Registration through chat, with demo and organization isolation"],
      ],
    }],
    fns: [
      ["Unit tests", "Business logic, permission logic, validation and financial calculations."],
      ["Integration tests", "API, database, authentication, authorization and notifications."],
      ["Security tests", "Tenant isolation, RBAC, privilege escalation, unauthorized access and session security."],
      ["End-to-end flows", "Registration, domain verification, invitation, HR approval, onboarding, leave, task, finance, approval and chat."],
      ["Isolation checks", "Demo isolation and organization isolation."],
    ],
    rel: ["rbac-permissions", "multi-tenancy", "hr-lifecycle", "public-website", "security-center"],
    todos: [todo("p43-visibility", "Testing is an internal engineering practice. This page lists planned test areas only and makes no coverage or pass-rate claim. Should it be public? It is noindex until you decide.", true)],
  }),

  // ───────────────────────── PART 44 ─────────────────────────
  part({
    n: 44, slug: "client-onboarding", group: "start", status: "planned", screen: "form",
    name: "Client onboarding",
    outcome: "Bring your company onto NAVICORE ONE in four stages, from registration to launch day.",
    what: "When a company comes to navicore.co, setting it up follows four stages: company creation, configuration, people, and go-live. Along the way the company's departments, teams, policies, employees, documents, clients and projects are set up or imported.",
    who: [
      ["Company owners", "At the very start, when registering and verifying the company"],
      ["Admins", "When configuring departments, teams, hours, roles and policies, and inviting people"],
      ["HR, finance and project leads", "When configuring their own areas before launch"],
    ],
    pdr: [
      "Moving a whole company onto a new system can feel like starting from nothing.",
      "NAVICORE ONE sets out onboarding in stages, with import for employees, documents, clients and projects.",
      "You know what comes next, and you do not have to retype what the company already has.",
    ],
    flows: [{
      title: "The four stages", src: "guide",
      steps: [
        ["Company creation", "Company registration, domain verification, owner verification, company profile"],
        ["Configuration", "Departments, teams, working hours, holidays, currency, timezone, roles, permissions, policies"],
        ["People", "Invite admins and employees; import employees, documents, clients and projects"],
        ["Go live", "Configure HR, finance, projects, communication and security; employee onboarding; company launch"],
      ],
    }],
    fns: [
      ["Company registration & verification", "Register, then verify the domain and the owner."],
      ["Company profile", "The basics of who you are."],
      ["Departments & teams", "Set up how the company is organized."],
      ["Hours, holidays, currency & timezone", "The calendar and money rules."],
      ["Roles, permissions & policies", "Who can do what, and the company's rules."],
      ["Invite admins & employees", "Bring people in."],
      ["Import employees, documents, clients & projects", "Bring over what you already have."],
      ["Go live", "Configure each area, onboard employees and launch the company."],
    ],
    rel: ["multi-tenancy", "authentication-identity", "license-platform", "company-settings", "hr-lifecycle", "public-website"],
    todos: [todo("p44-model", "Is onboarding self-service, guided by the NAVICORE team, or both? The guide describes the stages only, so this page does too.")],
  }),

  // ───────────────────────── PART 45 ─────────────────────────
  part({
    n: 45, slug: "personal-os", group: "core", status: "future", screen: "cards",
    name: "Personal OS",
    outcome: "A planned personal version of NAVICORE ONE for your own tasks, notes, goals and habits.",
    what: "An individual productivity and life operating system, planned for the future: a personal dashboard, tasks, projects, calendar, notes, documents, knowledge, personal AI, automation, goals and habits. Personal finance is a further future step.",
    who: [
      ["Individuals", "For organizing their own work and life"],
      ["People who use NAVICORE ONE at work", "When they want the same approach for their own projects"],
    ],
    pdr: [
      "Personal plans and notes live in different apps from work, and none of them talk to each other.",
      "The planned Personal OS applies the same idea as the Company OS to one person: dashboard, tasks, calendar, notes, knowledge, AI and automation.",
      "One personal home for everything you manage yourself.",
    ],
    flows: [{
      title: "Planned: a personal OS", src: "composed",
      steps: ["Personal dashboard", "Tasks, projects & calendar", "Notes, documents & knowledge", "Personal AI & automation", "Goals & habits"],
    }],
    fns: [
      ["Personal dashboard", "Your day in one view."],
      ["Personal tasks & projects", "Plan your own work."],
      ["Personal calendar", "Your own time."],
      ["Notes, documents & knowledge", "Keep what you learn."],
      ["Personal AI", "An assistant for your own things."],
      ["Automation", "Rules for your own routines."],
      ["Goals & habits", "Track what you are building."],
      ["Personal finance", "A later step."],
    ],
    rel: ["ai-platform", "project-management", "calendar-meetings", "document-management", "product-layers"],
    note: "A later horizon. Not started.",
    todos: [todo("p45-visibility", "The guide lists Personal OS as OUT (later horizon). Should it be described publicly? It is noindex until you decide.", true)],
  }),

  // ───────────────────────── PART 46 ─────────────────────────
  part({
    n: 46, slug: "future-integrations", group: "dev", status: "future", screen: "cards",
    name: "Future integrations",
    outcome: "See which outside tools NAVICORE ONE is being designed to connect to.",
    what: "NAVICORE ONE is designed so that integrations can be added later: Google Workspace, Microsoft 365, GitHub, GitLab, Slack, Jira, Linear, accounting platforms, payment providers, calendar and email providers, cloud storage, enterprise SSO, SCIM and AI providers. None of these is stated to be available today.",
    who: [
      ["IT leads", "When checking whether NAVICORE ONE can fit alongside what the company already uses"],
      ["Admins", "When connecting email, calendar, storage and similar services in company settings"],
    ],
    pdr: [
      "A new system that cannot connect to the tools you already use becomes one more island.",
      "NAVICORE ONE keeps integrations as a shared service and a settings area, so connections can be added without rebuilding the product.",
      "Over time, the tools you use can connect to NAVICORE ONE.",
    ],
    flows: [{
      title: "Where connections are configured", src: "composed", kind: "fan",
      steps: [
        ["Integrations", "A shared service in the NAVICORE ONE core"],
        "Email", "Calendar", "Storage", "AI", "Payments", "Webhooks", "API",
      ],
    }],
    fns: [
      ["Work suites", "Google Workspace and Microsoft 365."],
      ["Developer tools", "GitHub and GitLab."],
      ["Team & project tools", "Slack, Jira and Linear."],
      ["Accounting & payments", "Accounting platforms and payment providers."],
      ["Calendar, email & cloud storage", "Provider connections."],
      ["Enterprise SSO & SCIM", "Single sign-on and user provisioning for larger organizations."],
      ["AI providers", "The AI services behind the assistants."],
    ],
    rel: ["company-settings", "api-developer-platform", "marketplace-extensions", "os-core-shared-services", "authentication-identity"],
    note: "Design intent only. Nothing here is available today.",
    todos: [todo("p46-names", "This page names third-party products as design targets. Confirm you are comfortable naming them publicly (trademarks, expectations). It is noindex until you decide.", true)],
  }),

  // ───────────────────────── PART 47 ─────────────────────────
  part({
    n: 47, slug: "marketplace-extensions", group: "dev", status: "future", screen: "cards",
    name: "Marketplace & extensions",
    outcome: "A planned way to add plugins, custom modules, workflow templates and AI agents.",
    what: "A planned marketplace and extension system: plugins, integrations, custom modules, workflow templates and AI agents, with a developer SDK, app permissions and installation management.",
    who: [
      ["Developers", "When building something to add to NAVICORE ONE"],
      ["Company admins", "When choosing, permitting and installing extensions"],
    ],
    pdr: [
      "A product that cannot be extended forces every special need back onto its makers.",
      "The planned marketplace lets extensions be built with an SDK, installed under app permissions and managed by the company.",
      "Companies can add what they need, within the limits they set.",
    ],
    flows: [{
      title: "Planned: an extension's journey", src: "composed",
      steps: ["Built with the developer SDK", ["Listed in the marketplace", "Plugin, integration, module, template or AI agent"], "Installed by a company", "App permissions", "Installation management"],
    }],
    fns: [
      ["Plugins & integrations", "Add capabilities."],
      ["Custom modules", "Add areas of your own."],
      ["Workflow templates", "Share ready-made automations."],
      ["AI agents", "Add specialist assistants."],
      ["Marketplace", "A place to find them."],
      ["Developer SDK", "Tools to build them."],
      ["App permissions", "Control what an extension may access."],
      ["Installation management", "Install, update and remove."],
    ],
    rel: ["api-developer-platform", "automation-engine", "ai-platform", "future-integrations", "rbac-permissions"],
    note: "A later horizon. Not started.",
    todos: [todo("p47-visibility", "The guide lists the Marketplace as OUT (later horizon). Should it be described publicly? It is noindex until you decide.", true)],
  }),

  // ───────────────────────── PART 48 ─────────────────────────
  part({
    n: 48, slug: "internal-mode", group: "core", status: "planned", screen: "tree",
    name: "NAVICORE internal mode",
    outcome: "See the principle behind NAVICORE ONE: build it to run NAVICORE first, then others.",
    what: "The guide's principle is that NAVICORE's own company should be the reference implementation: NAVICORE ONE is built to run NAVICORE first. When another company buys it, the same platform hosts that company beside NAVICORE and a demo company.",
    who: [
      ["The NAVICORE team", "As the first company the platform is built to run"],
      ["Prospective customers", "When they want to understand how the product is shaped"],
    ],
    pdr: [
      "Software built in the abstract tends to miss what a real company needs every day.",
      "NAVICORE ONE is designed around running a real company first, then offering the same platform to others.",
      "The product is shaped by real needs, not guesses.",
    ],
    flows: [
      {
        title: "NAVICORE's own company on NAVICORE ONE", src: "guide", kind: "fan",
        steps: [
          ["NAVICORE.CO", "The reference implementation"],
          "People", "HR", "Finance", "Projects", "Clients", "Communication", "Documents", "IT", "Assets", "AI", "Executive control",
        ],
      },
      {
        title: "When other companies join", src: "guide", kind: "fan",
        steps: [
          ["NAVICORE platform"],
          "NAVICORE", "Customer company A", "Customer company B", "Customer company C", "Demo company",
        ],
      },
    ],
    fns: [
      ["Reference implementation", "NAVICORE's own company is the model for the product."],
      ["Eleven areas", "People, HR, finance, projects, clients, communication, documents, IT, assets, AI and executive control."],
      ["One platform, many companies", "NAVICORE, customer companies and a demo company side by side."],
      ["Demo company stays separate", "No real NAVICORE data in the public demo."],
    ],
    rel: ["public-website", "multi-tenancy", "license-platform", "core-employee-flow", "product-layers"],
    todos: [todo("p48-fact", "The guide states this as a principle ('should be the reference implementation'). Does NAVICORE actually run on NAVICORE ONE today? This page is noindex until you confirm.", true)],
  }),

  // ───────────────────────── PART 49 ─────────────────────────
  part({
    n: 49, slug: "core-employee-flow", group: "core", status: "planned", screen: "flow",
    name: "The core employee flow",
    outcome: "Follow a hire from candidate to active employee, and an exit to archive, step by step.",
    what: "The flow the guide says should eventually work almost automatically. A candidate becomes an employee through interview, offer and HR approval, with role, permissions, salary, schedule, policies, manager, department, account, equipment and onboarding tasks assigned along the way. When someone leaves, approval triggers offboarding, reassignment, asset return, access revocation and archive.",
    who: [
      ["HR managers", "From the first interview to the final settlement"],
      ["Hiring managers", "When a candidate becomes part of their team"],
      ["IT and admins", "When accounts, equipment and access are created or removed"],
      ["The new employee", "On the way in, and the leaver on the way out"],
    ],
    pdr: [
      "Joining and leaving involve dozens of small steps across several people, and some get missed.",
      "NAVICORE ONE is designed so one HR approval sets in motion the role, permissions, pay, schedule, policies, account and equipment, and an exit reverses them in order.",
      "A new starter is ready on day one, and a leaver leaves nothing open.",
    ],
    flows: [
      {
        title: "Candidate to active employee", src: "guide",
        steps: [
          "Candidate", "Interview", "Offer", "HR approval", "Employee created", "Role assigned", "Permissions assigned", "Salary configured",
          "Work schedule configured", "Leave policy assigned", "Attendance policy assigned", "Manager assigned", "Department assigned",
          "Company account created", "Equipment assigned", "Onboarding tasks", "Employee active",
        ],
      },
      {
        title: "Resignation to archive", src: "guide",
        steps: [
          "Resignation / termination", "Approval", "Offboarding", "Project reassignment", "Task reassignment", "Asset return",
          "Access revocation", "Session termination", "Final settlement", "Archive",
        ],
      },
    ],
    fns: [
      ["Hire to HR approval", "Candidate, interview, offer and HR approval start the flow."],
      ["Employee, role and permissions", "The record exists, with the right access from day one."],
      ["Pay and schedule", "Salary, work schedule, leave and attendance policy are configured."],
      ["Place in the company", "Manager and department assigned."],
      ["Account and equipment", "Company account created, equipment assigned."],
      ["Onboarding and activation", "Tasks guide the first days, then the employee is active."],
      ["Approved exit", "Resignation or termination goes through approval."],
      ["Clean offboarding", "Reassign projects and tasks, return assets, revoke access, end sessions, settle and archive."],
    ],
    rel: ["hr-lifecycle", "automation-engine", "approval-engine", "people-directory", "rbac-permissions", "asset-management"],
    todos: [todo("p49-status", "The guide says this flow 'should eventually work almost automatically'. Shown as Planned. Confirm which steps run automatically today.")],
  }),

  // ───────────────────────── PART 50 ─────────────────────────
  part({
    n: 50, slug: "os-core-shared-services", group: "core", status: "foundation", screen: "flow",
    name: "The shared core",
    outcome: "Understand the shared services every module builds on, so the whole product behaves as one.",
    what: "Fifteen shared services sit under every business module: identity, organizations, RBAC, permissions, workflow engine, notifications, audit, files, search, AI, automation, billing, licensing, analytics and integrations. Modules use them instead of building their own, which is what stops the product from becoming a pile of unrelated pages.",
    who: [
      ["Every module", "Each one consumes the services it needs"],
      ["The NAVICORE engineering team", "When adding a new feature to the right place"],
      ["Technical evaluators", "When judging whether a platform is one product or many"],
    ],
    pdr: [
      "A product built as separate pages repeats sign-in, permission and history logic in every corner, and behaves differently in each.",
      "NAVICORE ONE has fifteen shared services that every business module uses, rather than each module building its own.",
      "Permissions, approvals, notifications and audit behave the same way everywhere.",
    ],
    flows: [
      { title: "What HR uses", src: "guide", kind: "fan", steps: [["HR module"], "Identity", "RBAC", "Workflow", "Documents", "Notifications", "Audit"] },
      { title: "What Finance uses", src: "guide", kind: "fan", steps: [["Finance module"], "RBAC", "Workflow", "Documents", "Notifications", "Audit"] },
      { title: "What Projects uses", src: "guide", kind: "fan", steps: [["Projects module"], "RBAC", "Workflow", "Files", "Notifications", "Audit"] },
    ],
    fns: [
      ["Identity, organizations, RBAC & permissions", "Who you are, which company, and what you may do."],
      ["Workflow engine & automation", "Approvals and rule-driven work."],
      ["Notifications", "Telling people what matters."],
      ["Audit", "Recording what happened."],
      ["Files & search", "Storing and finding."],
      ["AI", "Built-in assistance."],
      ["Billing & licensing", "The commercial side."],
      ["Analytics & integrations", "Reporting, and connections to other tools."],
    ],
    rel: ["product-layers", "rbac-permissions", "approval-engine", "audit-system", "notification-center", "global-search"],
  }),

  // ───────────────────────── PART 51 ─────────────────────────
  part({
    n: 51, slug: "product-layers", group: "core", status: "foundation", screen: "flow",
    name: "Product layers",
    outcome: "See the ten layers NAVICORE ONE is made of, from licensing and identity to the apps.",
    what: "NAVICORE ONE is organized as one platform in ten layers: licensing, billing and organizations; identity, security, RBAC and SSO; AI, automation and workflows; communication and notifications; documents, search and knowledge; HR, people, attendance and leave; projects, tasks and CRM; finance, accounting and assets; analytics and executive control; and the web, desktop, Android and iOS apps.",
    who: [
      ["Buyers and evaluators", "When they want the whole product on one page"],
      ["The NAVICORE team", "When deciding where something belongs"],
    ],
    pdr: [
      "A long list of features makes it hard to see how a product fits together.",
      "NAVICORE ONE shows its structure as ten layers, each with its own set of modules.",
      "You can see what is covered and how the pieces stack up.",
    ],
    flows: [{
      title: "The ten layers", src: "guide", kind: "stack",
      steps: [
        ["Licensing, billing & organizations"],
        ["Identity, security, RBAC & SSO"],
        ["AI, automation & workflows"],
        ["Communication & notifications"],
        ["Documents, search & knowledge"],
        ["HR, people, attendance & leave"],
        ["Projects, tasks & CRM"],
        ["Finance, accounting & assets"],
        ["Analytics & executive control"],
        ["Web, desktop, Android & iOS"],
      ],
    }],
    fns: [
      ["Licensing, billing & organizations", "How customers and companies are set up and licensed."],
      ["Identity, security, RBAC & SSO", "Who gets in, and what they can do."],
      ["AI, automation & workflows", "Assistance and rules."],
      ["Communication & notifications", "How people talk and are told."],
      ["Documents, search & knowledge", "Where information lives."],
      ["HR, people, attendance & leave", "The people side."],
      ["Projects, tasks & CRM", "The work side."],
      ["Finance, accounting & assets", "The money and equipment side."],
      ["Analytics & executive control", "The overview."],
      ["Web, desktop, Android & iOS", "How people reach it."],
    ],
    rel: ["os-core-shared-services", "license-platform", "rbac-permissions", "executive-control-center", "web-app"],
  }),

  // ───────────────────────── PART 52 ─────────────────────────
  part({
    n: 52, slug: "decision-checklist", group: "core", status: "foundation", screen: "table",
    name: "Decision checklist",
    outcome: "See the questions NAVICORE asks before any new feature is added to NAVICORE ONE.",
    what: "Before a new feature is built, eleven questions are answered: where it belongs, which shared service it uses, what permissions it needs, what is audited, what happens in another company's workspace, whether it works across web, desktop and mobile, whether the demo stays isolated, whether licensing applies, whether another company can reuse it, whether it keeps the architecture intact, and whether it fits the current build scope.",
    who: [
      ["The NAVICORE engineering team", "Before building anything new"],
      ["Product decision-makers", "When deciding whether a feature belongs"],
    ],
    pdr: [
      "Features added in a hurry weaken permissions, auditing and isolation one shortcut at a time.",
      "NAVICORE ONE asks the same eleven questions of every new feature, covering module, shared services, permissions, audit, isolation, apps, demo, licensing, reuse, architecture and scope.",
      "New features strengthen the product instead of eroding it.",
    ],
    flows: [{
      title: "Eleven questions", src: "guide",
      steps: [
        ["Which module does it belong to?"],
        ["Which shared service does it use?"],
        ["What permissions does it need?"],
        ["What gets audited?"],
        ["What happens in another company's workspace?"],
        ["Does it work on web, desktop and mobile where appropriate?"],
        ["Does the demo stay isolated?"],
        ["Does licensing apply?"],
        ["Can another company reuse it?"],
        ["Does it keep the architecture intact?"],
        ["Does it fit the current build scope?"],
      ],
    }],
    fns: [
      ["Module & shared service", "Every feature has a home and uses the shared core."],
      ["Permissions & audit", "Every feature declares who can use it and what is recorded."],
      ["Isolation", "Every feature considers what happens in another company's workspace, and in the demo."],
      ["Apps", "Every feature considers web, desktop and mobile."],
      ["Licensing & reuse", "Every feature considers entitlements and reuse by other companies."],
      ["Architecture & scope", "Every feature preserves the architecture and fits the current scope."],
    ],
    rel: ["os-core-shared-services", "product-layers", "rbac-permissions", "audit-system", "multi-tenancy", "license-platform"],
    todos: [todo("p52-visibility", "This is an internal engineering checklist. Publish it, or keep it internal? It is noindex until you decide.", true)],
  }),
];

// ── Integrity checks: fail loudly at build time if the data is not exactly Parts 01-52 ──
(() => {
  if (parts.length !== 52) throw new Error(`Expected 52 parts, found ${parts.length}`);
  const slugs = new Set<string>();
  parts.forEach((p, i) => {
    if (p.number !== i + 1) throw new Error(`Part order: expected ${i + 1}, found ${p.number} (${p.slug})`);
    if (slugs.has(p.slug)) throw new Error(`Duplicate slug: ${p.slug}`);
    slugs.add(p.slug);
  });
  for (const p of parts) {
    for (const r of p.related) {
      if (!slugs.has(r)) throw new Error(`Part ${p.number}: related slug "${r}" does not exist`);
      if (r === p.slug) throw new Error(`Part ${p.number}: relates to itself`);
    }
  }
})();

export const osParts: readonly OsPart[] = parts;

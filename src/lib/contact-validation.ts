/** Pure validation for the contact / partner form. No framework imports, so it can be tested alone. */

export const INTENTS = ["demo", "partner", "question"] as const;
export type Intent = (typeof INTENTS)[number];
export type FieldName = "name" | "email" | "company" | "role" | "message" | "intent";

export interface ContactInput {
  intent: Intent;
  name: string;
  email: string;
  company: string;
  role: string;
  message: string;
}

export interface ContactState {
  status: "idle" | "ok" | "error";
  message?: string;
  errors?: Partial<Record<FieldName, string>>;
  values?: Partial<Record<FieldName, string>>;
}

export const initialContactState: ContactState = { status: "idle" };

export const MIN_FILL_MS = 2_500;
export const MAX_FILL_MS = 3 * 60 * 60 * 1000;

/** Trim, normalise newlines and strip control characters. */
export const clean = (v: unknown): string =>
  String(v ?? "")
    .replace(/\r\n?/g, "\n")
    // eslint-disable-next-line no-control-regex
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    .trim();

/** Single-line fields must not contain line breaks (blocks header-style injection into downstream tools). */
const oneLine = (v: unknown): string => clean(v).replace(/\s*\n+\s*/g, " ");

export const countLinks = (s: string): number => (s.match(/https?:\/\/|www\./gi) ?? []).length;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function timingOk(startedAt: number, now = Date.now()): boolean {
  if (!Number.isFinite(startedAt)) return false;
  const elapsed = now - startedAt;
  return elapsed >= MIN_FILL_MS && elapsed <= MAX_FILL_MS;
}

export type Validation =
  | { ok: true; data: ContactInput }
  | { ok: false; errors: Partial<Record<FieldName, true>>; values: Partial<Record<FieldName, string>> };

export function validateContact(raw: Record<string, unknown>): Validation {
  const values = {
    intent: oneLine(raw.intent),
    name: oneLine(raw.name),
    email: oneLine(raw.email).toLowerCase(),
    company: oneLine(raw.company),
    role: oneLine(raw.role),
    message: clean(raw.message),
  };
  const errors: Partial<Record<FieldName, true>> = {};
  if (!INTENTS.includes(values.intent as Intent)) errors.intent = true;
  if (values.name.length < 2 || values.name.length > 80) errors.name = true;
  if (values.email.length > 120 || !EMAIL.test(values.email)) errors.email = true;
  if (values.company.length > 120) errors.company = true;
  if (values.role.length > 80) errors.role = true;
  if (values.message.length < 10 || values.message.length > 2000 || countLinks(values.message) > 2) errors.message = true;

  if (Object.keys(errors).length > 0) return { ok: false, errors, values };
  return { ok: true, data: { ...values, intent: values.intent as Intent } };
}

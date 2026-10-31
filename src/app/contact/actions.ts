"use server";

import { headers } from "next/headers";
import { SITE } from "@/content/site";
import { getMessages } from "@/i18n/messages";
import { allow } from "@/lib/rate-limit";
import {
  type ContactInput,
  type ContactState,
  type FieldName,
  timingOk,
  validateContact,
} from "@/lib/contact-validation";

const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;

async function clientKey(): Promise<string> {
  const h = await headers();
  const fwd = h.get("x-forwarded-for")?.split(",")[0]?.trim();
  return fwd || h.get("x-real-ip") || "unknown";
}

/** Optional Cloudflare Turnstile check. Skipped entirely when no secret is configured. */
async function turnstileOk(token: string, ip: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true;
  if (!token) return false;
  try {
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body: new URLSearchParams({ secret, response: token, remoteip: ip }),
      signal: AbortSignal.timeout(6000),
      cache: "no-store",
    });
    const json = (await res.json()) as { success?: boolean };
    return json.success === true;
  } catch {
    return false;
  }
}

/** Forward the enquiry. Returns false if there is nowhere configured to send it (production). */
async function deliver(data: ContactInput): Promise<boolean> {
  const url = process.env.LEAD_WEBHOOK_URL;
  if (!url) {
    if (process.env.NODE_ENV !== "production") {
      console.info("[contact:dev] LEAD_WEBHOOK_URL not set; enquiry from", data.intent, "not forwarded.");
      return true;
    }
    return false;
  }
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ source: new URL(SITE.url).hostname, receivedAt: new Date().toISOString(), ...data }),
      signal: AbortSignal.timeout(8000),
      cache: "no-store",
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function submitContact(_prev: ContactState, formData: FormData): Promise<ContactState> {
  const m = getMessages();
  const raw = Object.fromEntries(formData.entries());

  // 1. Honeypot: real people never see or fill this field. Pretend success so bots learn nothing.
  if (String(raw.website ?? "") !== "") return { status: "ok", message: m.form.success };

  // 2. Timing: a human takes more than a couple of seconds.
  if (!timingOk(Number(raw.startedAt))) return { status: "error", message: m.form.tooFast };

  // 3. Per-connection rate limit.
  const ip = await clientKey();
  if (!allow(`contact:${ip}`, MAX_PER_WINDOW, WINDOW_MS)) return { status: "error", message: m.form.limited };

  // 4. Validation (server side; the browser's checks are only a convenience).
  const v = validateContact(raw);
  if (!v.ok) {
    const errors: Partial<Record<FieldName, string>> = {};
    for (const key of Object.keys(v.errors) as FieldName[]) errors[key] = m.form.errors[key];
    return { status: "error", message: m.form.fix, errors, values: v.values };
  }

  // 5. Optional bot challenge.
  if (!(await turnstileOk(String(raw["cf-turnstile-response"] ?? ""), ip))) {
    return { status: "error", message: m.form.tooFast, values: v.data };
  }

  // 6. Deliver.
  if (!(await deliver(v.data))) return { status: "error", message: m.form.unavailable, values: v.data };
  return { status: "ok", message: m.form.success };
}

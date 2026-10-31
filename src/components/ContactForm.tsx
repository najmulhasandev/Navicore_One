"use client";

import Script from "next/script";
import { useActionState, useEffect, useState } from "react";
import { submitContact } from "@/app/contact/actions";
import type { Messages } from "@/content/messages";
import { INTENTS, type FieldName, type Intent, initialContactState } from "@/lib/contact-validation";

type T = Messages["form"];

const field =
  "mt-1.5 block w-full min-h-12 rounded-2xl border-0 bg-white px-4 py-3 text-base text-ink shadow-sm ring-1 ring-rose placeholder:text-ink-soft focus:outline-none focus:ring-2 focus:ring-maroon aria-[invalid=true]:ring-2 aria-[invalid=true]:ring-red";

/**
 * Contact / partner form. Posts to a Next server action (validation and spam checks run on the server).
 * Spam protection here: a honeypot field, a hidden start-time stamp, and (when configured) Cloudflare Turnstile.
 */
export function ContactForm({ t, defaultIntent = "demo" }: { t: T; defaultIntent?: Intent }) {
  const [state, formAction, pending] = useActionState(submitContact, initialContactState);
  const [startedAt, setStartedAt] = useState("");
  const [intent, setIntent] = useState<Intent>(defaultIntent);
  const turnstileKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  useEffect(() => {
    setStartedAt(String(Date.now()));
    const q = new URLSearchParams(window.location.search).get("intent");
    if (q && (INTENTS as readonly string[]).includes(q)) setIntent(q as Intent);
  }, []);

  if (state.status === "ok") {
    return (
      <div role="status" className="rounded-3xl bg-baby-pink p-8 text-lg font-medium text-maroon">
        {state.message}
      </div>
    );
  }

  const v = state.values ?? {};
  const err = (n: FieldName) => state.errors?.[n];
  const props = (n: FieldName) => ({
    "aria-invalid": err(n) ? true : undefined,
    "aria-describedby": err(n) ? `err-${n}` : undefined,
  });
  const Err = ({ n }: { n: FieldName }) =>
    err(n) ? (
      <p id={`err-${n}`} className="mt-1.5 text-sm font-medium text-red">
        {err(n)}
      </p>
    ) : null;

  return (
    <form action={formAction} noValidate className="space-y-5 rounded-3xl bg-white p-6 shadow-soft ring-1 ring-baby-pink sm:p-8">
      {state.status === "error" && state.message ? (
        <p role="alert" className="rounded-2xl bg-blush p-4 text-base font-semibold text-red ring-1 ring-red">
          {state.message}
        </p>
      ) : null}

      <div>
        <label htmlFor="intent" className="text-sm font-semibold text-maroon">{t.intent}</label>
        <select
          id="intent"
          name="intent"
          value={intent}
          onChange={(e) => setIntent(e.target.value as Intent)}
          className={field}
          {...props("intent")}
        >
          {INTENTS.map((i) => (
            <option key={i} value={i}>{t.intents[i]}</option>
          ))}
        </select>
        <Err n="intent" />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="text-sm font-semibold text-maroon">{t.name}</label>
          <input id="name" name="name" type="text" autoComplete="name" required maxLength={80} defaultValue={v.name} className={field} {...props("name")} />
          <Err n="name" />
        </div>
        <div>
          <label htmlFor="email" className="text-sm font-semibold text-maroon">{t.email}</label>
          <input id="email" name="email" type="email" autoComplete="email" inputMode="email" required maxLength={120} defaultValue={v.email} className={field} {...props("email")} />
          <Err n="email" />
        </div>
        <div>
          <label htmlFor="company" className="text-sm font-semibold text-maroon">{t.companyOptional}</label>
          <input id="company" name="company" type="text" autoComplete="organization" maxLength={120} defaultValue={v.company} className={field} {...props("company")} />
          <Err n="company" />
        </div>
        <div>
          <label htmlFor="role" className="text-sm font-semibold text-maroon">{t.role}</label>
          <input id="role" name="role" type="text" autoComplete="organization-title" maxLength={80} defaultValue={v.role} className={field} {...props("role")} />
          <Err n="role" />
        </div>
      </div>

      <div>
        <label htmlFor="message" className="text-sm font-semibold text-maroon">{t.message}</label>
        <textarea id="message" name="message" rows={5} required minLength={10} maxLength={2000} defaultValue={v.message} className={`${field} resize-y`} {...props("message")} />
        <Err n="message" />
      </div>

      {/* Honeypot: invisible to people and to assistive technology; bots that fill every field give themselves away. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="website">Website</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" defaultValue="" />
      </div>
      <input type="hidden" name="startedAt" value={startedAt} />

      {turnstileKey ? (
        <>
          <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" strategy="lazyOnload" />
          <div className="cf-turnstile" data-sitekey={turnstileKey} />
        </>
      ) : null}

      <div className="flex flex-wrap items-center gap-4">
        <button type="submit" disabled={pending} className="btn btn-red disabled:cursor-wait disabled:opacity-70">
          {pending ? t.sending : t.send}
        </button>
        <p className="text-sm text-ink-soft">{t.privacy}</p>
      </div>
    </form>
  );
}

import { en, type Messages } from "@/content/messages";
import { bn } from "@/content/messages.bn";
import type { Locale } from "@/content/types";

type Plain = Record<string, unknown>;
const isObj = (v: unknown): v is Plain => typeof v === "object" && v !== null && !Array.isArray(v);

function merge(base: Plain, over: Plain): Plain {
  const out: Plain = { ...base };
  for (const [k, v] of Object.entries(over)) {
    const b = out[k];
    out[k] = isObj(b) && isObj(v) ? merge(b, v) : (v ?? b);
  }
  return out;
}

/** UI and page copy for a locale, falling back to English for anything not yet translated. */
export function getMessages(locale: Locale = "en"): Messages {
  if (locale === "en") return en;
  return merge(en as unknown as Plain, bn as unknown as Plain) as unknown as Messages;
}

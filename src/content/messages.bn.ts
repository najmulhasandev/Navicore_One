/**
 * Bangla (bn) overrides. Empty on purpose: the site is bilingual-ready, not yet translated.
 * Add keys here that mirror `en` in messages.ts; anything missing falls back to English.
 * Part-page text is translated by adding `copy.bn` to entries in os-parts.ts.
 * Fonts: load a Bengali font (for example Noto Sans Bengali) only on bn routes, so the
 * two-family budget on English pages is unchanged.
 */
import type { Messages } from "./messages";

type DeepPartial<T> = { [K in keyof T]?: T[K] extends readonly unknown[] ? T[K] : T[K] extends object ? DeepPartial<T[K]> : T[K] };

export const bn: DeepPartial<Messages> = {};

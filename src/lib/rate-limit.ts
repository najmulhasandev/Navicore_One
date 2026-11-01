/**
 * Tiny in-memory sliding-window limiter. Good enough to blunt a single noisy client.
 * On serverless hosting each instance has its own memory, so treat it as one layer of
 * several (honeypot, timing check, optional Turnstile), not as the only defence.
 *
 * Proposal (not implemented, needs credentials): keep the same allow(key, limit, windowMs) signature and back it
 * with a shared store, for example Upstash Redis / Vercel KV (INCR + EXPIRE per key), or Vercel's firewall
 * rate-limit rule on POST /contact. Either makes the limit hold across serverless instances.
 */
const hits = new Map<string, number[]>();

export function allow(key: string, limit: number, windowMs: number, now = Date.now()): boolean {
  const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  if (recent.length >= limit) {
    hits.set(key, recent);
    return false;
  }
  recent.push(now);
  hits.set(key, recent);
  if (hits.size > 5000) {
    for (const [k, v] of hits) if (v.every((t) => now - t >= windowMs)) hits.delete(k);
  }
  return true;
}

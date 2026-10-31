/**
 * Tiny in-memory sliding-window limiter. Good enough to blunt a single noisy client.
 * On serverless hosting each instance has its own memory, so treat it as one layer of
 * several (honeypot, timing check, optional Turnstile), not as the only defence.
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

#!/usr/bin/env node
/**
 * Runs before `next build` (npm "prebuild").
 * In a Vercel production build, NEXT_PUBLIC_SITE_URL must be set explicitly: canonicals, og:url,
 * the sitemap and robots.txt are all derived from it, and a wrong host there is invisible until
 * search engines have already indexed it. Preview and local builds are not blocked.
 */
const isProd = process.env.VERCEL_ENV === "production";
const url = process.env.NEXT_PUBLIC_SITE_URL;

const fail = (msg) => {
  console.error(`\n[check-env] ${msg}\n`);
  process.exit(1);
};

if (isProd) {
  if (!url || !url.trim()) {
    fail(
      "VERCEL_ENV=production but NEXT_PUBLIC_SITE_URL is not set.\n" +
        "Set it in Vercel (Project Settings > Environment Variables > Production), e.g. https://one.navicoresoftware.com",
    );
  }
  let parsed;
  try {
    parsed = new URL(url);
  } catch {
    fail(`NEXT_PUBLIC_SITE_URL is not a valid URL: "${url}"`);
  }
  if (parsed.protocol !== "https:") fail(`NEXT_PUBLIC_SITE_URL must be https in production (got "${url}")`);
  if (parsed.pathname !== "/" || parsed.search || parsed.hash) fail(`NEXT_PUBLIC_SITE_URL must be an origin only, without a path (got "${url}")`);
  console.log(`[check-env] production site URL: ${parsed.origin}`);
} else {
  console.log(`[check-env] skipped (VERCEL_ENV=${process.env.VERCEL_ENV ?? "unset"}); the code default is used when NEXT_PUBLIC_SITE_URL is unset.`);
}

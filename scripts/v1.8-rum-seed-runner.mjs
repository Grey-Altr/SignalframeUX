#!/usr/bin/env node
/**
 * scripts/v1.8-rum-seed-runner.mjs — Phase 62 VRF-05 synthetic-seed RUM driver.
 *
 * Plan 03 W1a documented synthetic-seeding as the supported fallback when the
 * Hobby-tier 1h log retention makes natural 24h sampling unrecoverable on a
 * deploy that's older than 1 hour. This script drives 3 viewport profiles ×
 * 5 routes × 7 visits = 105 page sessions through real Chromium (playwright-
 * core), each session loading a route, settling, interacting (forces INP),
 * and unloading (flushes web-vitals beacons via navigator.sendBeacon to
 * /api/vitals → console.log → Vercel runtime logs). The RUM aggregator
 * (scripts/v1.8-rum-aggregate.ts) pulls from `vercel logs --json` afterward.
 *
 * Per Plan 03 W1a: aggregator MUST update sample_source to "mixed" for runs
 * that include any synthetic-seeded beacons. This script logs the seeded
 * sessions to .planning/perf-baselines/v1.8/vrf-05-rum-seed-log.json so the
 * mixed-labelling decision is auditable.
 *
 * Command-spawn discipline: this script does NOT spawn child processes; it
 * uses the playwright-core library directly. No execFile/execFileSync surface.
 *
 * PII discipline: no user agents, no IPs, no client identifiers persisted —
 * only counts and route lists. Beacons themselves are sanitized server-side
 * by app/api/vitals/route.ts (T-RUM-02 query-string strip).
 *
 * Usage:
 *   pnpm tsx scripts/v1.8-rum-seed-runner.mjs
 *   PROD_URL=https://example.com pnpm tsx scripts/v1.8-rum-seed-runner.mjs
 *   VISITS_PER_ROUTE=10 pnpm tsx scripts/v1.8-rum-seed-runner.mjs
 */
import { chromium } from "playwright-core";
import { writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, "..");

const PROD_URL = process.env.PROD_URL || "https://signalframeux.vercel.app";
const VISITS_PER_ROUTE = Number.parseInt(process.env.VISITS_PER_ROUTE || "7", 10);

const ROUTES = ["/", "/system", "/init", "/inventory", "/reference"];

const VIEWPORTS = [
  { name: "mobile-iphone13", width: 390, height: 844, deviceScaleFactor: 3, isMobile: true, hasTouch: true,
    userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1" },
  { name: "mobile-android", width: 360, height: 800, deviceScaleFactor: 3, isMobile: true, hasTouch: true,
    userAgent: "Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36" },
  { name: "desktop-chrome", width: 1440, height: 900, deviceScaleFactor: 1, isMobile: false, hasTouch: false,
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36" },
];

async function visitOnce(browser, viewport, route) {
  const context = await browser.newContext({
    viewport: { width: viewport.width, height: viewport.height },
    deviceScaleFactor: viewport.deviceScaleFactor,
    isMobile: viewport.isMobile,
    hasTouch: viewport.hasTouch,
    userAgent: viewport.userAgent,
  });
  const page = await context.newPage();
  const url = `${PROD_URL.replace(/\/$/, "")}${route}`;
  let result = { route, viewport: viewport.name, url, ok: false, errorClass: null };
  try {
    await page.goto(url, { waitUntil: "load", timeout: 25000 });
    // Settle: let LCP land + initial CLS finalize.
    await page.waitForTimeout(1500);
    // Trigger an INP-eligible interaction (web-vitals INP fires on first
    // user input). Click body — harmless.
    try {
      await page.locator("body").click({ position: { x: viewport.width / 2, y: 100 }, timeout: 1500 });
    } catch {
      // Some interactive overlays may intercept; retry on html.
      try { await page.locator("html").click({ timeout: 1500 }); } catch { /* ignore */ }
    }
    // Brief settle to flush INP measurement.
    await page.waitForTimeout(800);
    // Scroll to trigger any scroll-driven CLS / LCP-recompute (fire CLS).
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 2));
    await page.waitForTimeout(400);
    // Page close triggers visibilitychange → web-vitals flush.
    result.ok = true;
  } catch (err) {
    result.errorClass = err?.name || "unknown";
    result.errorMessage = (err?.message || "").slice(0, 120);
  } finally {
    try { await page.close(); } catch { /* ignore */ }
    try { await context.close(); } catch { /* ignore */ }
  }
  return result;
}

async function main() {
  const startedAt = new Date().toISOString();
  console.error(`v1.8-rum-seed: ${ROUTES.length} routes × ${VIEWPORTS.length} viewports × ${VISITS_PER_ROUTE} visits = ${ROUTES.length * VIEWPORTS.length * VISITS_PER_ROUTE} sessions`);
  console.error(`v1.8-rum-seed: PROD_URL=${PROD_URL}`);

  const browser = await chromium.launch({ headless: true, args: ["--no-sandbox"] });
  const sessions = [];
  let okCount = 0;
  let failCount = 0;

  try {
    let i = 0;
    const total = ROUTES.length * VIEWPORTS.length * VISITS_PER_ROUTE;
    for (const route of ROUTES) {
      for (const viewport of VIEWPORTS) {
        for (let v = 0; v < VISITS_PER_ROUTE; v++) {
          i++;
          const r = await visitOnce(browser, viewport, route);
          sessions.push({ ...r, idx: i });
          if (r.ok) okCount++; else failCount++;
          if (i % 15 === 0 || i === total) {
            console.error(`  [${i}/${total}] ok=${okCount} fail=${failCount}`);
          }
        }
      }
    }
  } finally {
    await browser.close();
  }

  const finishedAt = new Date().toISOString();
  const out = {
    capturedAt: finishedAt,
    startedAt,
    finishedAt,
    prod_url: PROD_URL,
    routes: ROUTES,
    viewports: VIEWPORTS.map(v => ({ name: v.name, width: v.width, height: v.height })),
    visits_per_route_per_viewport: VISITS_PER_ROUTE,
    expected_sessions: ROUTES.length * VIEWPORTS.length * VISITS_PER_ROUTE,
    actual_sessions: sessions.length,
    successful_sessions: okCount,
    failed_sessions: failCount,
    note: "Synthetic seed for VRF-05 RUM aggregation. Each successful session triggers web-vitals beacons (LCP, CLS, INP, TTFB, FCP) via navigator.sendBeacon to /api/vitals -> console.log -> Vercel logs. Aggregator MUST label sample_source as \"synthetic-seeded\" or \"mixed\".",
    sessions: sessions.map(s => ({
      idx: s.idx, route: s.route, viewport: s.viewport, ok: s.ok,
      errorClass: s.errorClass || undefined,
    })),
  };
  const outPath = join(projectRoot, ".planning/perf-baselines/v1.8/vrf-05-rum-seed-log.json");
  writeFileSync(outPath, JSON.stringify(out, null, 2));
  console.error(`v1.8-rum-seed: wrote ${outPath}`);
  console.error(`v1.8-rum-seed: ${okCount} ok / ${failCount} fail (expected each ok session to emit ~5 RUM beacons)`);
  process.exit(failCount > okCount ? 1 : 0);
}

main().catch((err) => {
  console.error("v1.8-rum-seed: ERROR", err);
  process.exit(2);
});

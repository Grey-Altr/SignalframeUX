import { test, expect } from "@playwright/test";
import path from "node:path";
import { promises as fs } from "node:fs";

/**
 * Phase 57 DGN-01 — v1.8 LCP element identity capture.
 *
 * MUST run against `pnpm build && pnpm start` (production build), NOT `pnpm dev`.
 * Reasons identical to phase-35-lcp-homepage.spec.ts:5-8 — React dev double-render
 * inflates LCP timing; Next.js dev overlay markup pollutes element selection.
 *
 * Pitfall A (Anton bimodal LCP): Anton ships display: optional. On a cold visit
 * Anton may not paint (skipped after 100ms window). The LCP element under cold
 * state may differ from warm state. This spec captures BOTH so Phase 60 plan-phase
 * has the full picture.
 *
 * COLD-STATE DETERMINISM: Playwright spawns a fresh BrowserContext per test()
 * by default (no shared `storageState` declared in playwright.config.ts; default
 * `async ({ page })` fixture pattern). A fresh context = empty HTTP cache AND
 * empty font cache, so the cold-state runs truly experience Anton's
 * `display: optional` race against the 100ms window. No manual cache eviction
 * between cold and warm runs is required.
 *
 * Output: .planning/codebase/v1.8-lcp-evidence.json (4 entries — 2 viewports × 2 font states)
 * Re-run command: pnpm exec playwright test tests/v1.8-lcp-diagnosis.spec.ts --project=chromium
 */

const VIEWPORTS = [
  { name: "mobile-360x800", width: 360, height: 800 },
  { name: "desktop-1440x900", width: 1440, height: 900 },
] as const;

const FONT_STATES = [
  { name: "cold", forceLoad: false },
  { name: "warm", forceLoad: true },
] as const;

const EVIDENCE_PATH = path.resolve(
  process.cwd(),
  ".planning/codebase/v1.8-lcp-evidence.json"
);

type LcpEntry = {
  viewport: string;
  fontState: string;
  startTime: number;
  selector: string | null;
  elementSize: number;
  resourceUrl: string;
  capturedAt: string;
};

async function appendEvidence(entry: LcpEntry): Promise<void> {
  let existing: LcpEntry[] = [];
  try {
    const raw = await fs.readFile(EVIDENCE_PATH, "utf8");
    existing = JSON.parse(raw) as LcpEntry[];
  } catch {
    // First write — file doesn't exist yet.
  }
  // Replace entry for the same viewport/fontState if it already exists,
  // otherwise append. This makes re-runs idempotent.
  const filtered = existing.filter(
    (e) => !(e.viewport === entry.viewport && e.fontState === entry.fontState)
  );
  filtered.push(entry);
  await fs.mkdir(path.dirname(EVIDENCE_PATH), { recursive: true });
  await fs.writeFile(EVIDENCE_PATH, JSON.stringify(filtered, null, 2) + "\n");
}

test.describe("@v1.8-diagnosis LCP element identity (DGN-01)", () => {
  for (const vp of VIEWPORTS) {
    for (const state of FONT_STATES) {
      test(`/ @ ${vp.name} (${state.name}-Anton)`, async ({ page }) => {
        // Cold-state: Playwright's per-test page is a fresh BrowserContext
        // already, so font cache is naturally empty for the first request.
        // For warm-state, we explicitly force the font to load before measurement.
        await page.setViewportSize({ width: vp.width, height: vp.height });

        // Do NOT enable reduced-motion here — diagnosis captures the LIVE
        // first-paint state, not the curated reduced-motion variant. Plan 02
        // owns the reduced-motion baseline; Plan 03 owns the diagnosis.

        await page.goto("/", { waitUntil: "load" });

        if (state.forceLoad) {
          // Warm-state: force Anton to be present.
          await page.evaluate(() => document.fonts.load('700 100px "Anton"'));
          await page.evaluate(() => document.fonts.ready);
        } else {
          // Cold-state: let display: optional play out. Wait for any LCP
          // to fire by giving the page 2.5s (LCP detection window upper bound).
          await page.waitForTimeout(2500);
        }

        // Capture LCP entry with element identity.
        const lcpInfo = await page.evaluate(
          () =>
            new Promise<{
              startTime: number;
              selector: string | null;
              elementSize: number;
              resourceUrl: string;
            }>((resolve) => {
              new PerformanceObserver((list) => {
                const entries = list.getEntries();
                const last = entries[entries.length - 1] as PerformanceEntry & {
                  element?: Element;
                  size?: number;
                  url?: string;
                };
                const el = last.element ?? null;
                const selector = el
                  ? `${el.tagName.toLowerCase()}${
                      el.id ? "#" + el.id : ""
                    }${
                      el.className && typeof el.className === "string"
                        ? "." +
                          el.className
                            .split(/\s+/)
                            .filter(Boolean)
                            .join(".")
                        : ""
                    }`
                  : null;
                resolve({
                  startTime: last.startTime,
                  selector,
                  elementSize: last.size ?? 0,
                  resourceUrl: last.url ?? "",
                });
              }).observe({ type: "largest-contentful-paint", buffered: true });
            })
        );

        // Persist to evidence JSON.
        await appendEvidence({
          viewport: vp.name,
          fontState: state.name,
          startTime: lcpInfo.startTime,
          selector: lcpInfo.selector,
          elementSize: lcpInfo.elementSize,
          resourceUrl: lcpInfo.resourceUrl,
          capturedAt: new Date().toISOString(),
        });

        // Sanity: an LCP entry must have been captured.
        expect(lcpInfo.startTime).toBeGreaterThan(0);
      });
    }
  }
});

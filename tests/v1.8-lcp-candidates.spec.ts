import { test, expect } from "@playwright/test";
import path from "node:path";
import { promises as fs } from "node:fs";

/**
 * Phase 60 D-06 — pre-need LCP candidate enumeration tool.
 *
 * MUST run against `pnpm build && pnpm start` (production build), NOT `pnpm dev`.
 * Rationale identical to v1.8-lcp-diagnosis.spec.ts:5-10 — React dev double-render
 * inflates LCP timing; Next.js dev overlay markup pollutes element selection.
 *
 * Warm-Anton only (cold-state already captured in v1.8-lcp-evidence.json). This
 * spec is the standing v1.8 measurement tool: it enumerates ALL paint candidates
 * >=50 px² across 4 viewports and ranks them by startTime, marking only the
 * final entry isLcp:true. Plan 02 reads this to drive D-04 reactive escalation;
 * Phase 62 VRF-04 reuses it for real-device candidate enumeration.
 *
 * Output: .planning/codebase/v1.8-lcp-candidates.json (idempotent upsert-by-viewport)
 * Re-run command: pnpm exec playwright test tests/v1.8-lcp-candidates.spec.ts --project=chromium
 */

const VIEWPORTS = [
  { name: "mobile-360x800",   width: 360,  height: 800  },
  { name: "iphone13-390x844", width: 390,  height: 844  },
  { name: "ipad-834x1194",    width: 834,  height: 1194 },
  { name: "desktop-1440x900", width: 1440, height: 900  },
] as const;

const SNAPSHOT_PATH = path.resolve(
  process.cwd(),
  ".planning/codebase/v1.8-lcp-candidates.json"
);

const SIZE_THRESHOLD = 50; // px² — D-06 threshold

type CandidateEntry = {
  selector: string | null;
  elementSize: number;
  startTime: number;
  resourceUrl: string;
  isLcp: boolean;
};

type ViewportCandidates = {
  viewport: string;
  fontState: "warm";
  qualityTier: number;
  candidates: CandidateEntry[];
  capturedAt: string;
};

async function appendCandidates(entry: ViewportCandidates): Promise<void> {
  let existing: ViewportCandidates[] = [];
  try {
    const raw = await fs.readFile(SNAPSHOT_PATH, "utf8");
    existing = JSON.parse(raw) as ViewportCandidates[];
  } catch {
    // First write — file doesn't exist yet.
  }
  // Replace entry for the same viewport if it already exists, otherwise append.
  // Mirrors v1.8-lcp-diagnosis.spec.ts:53-69 idempotent upsert pattern.
  const filtered = existing.filter((e) => e.viewport !== entry.viewport);
  filtered.push(entry);
  await fs.mkdir(path.dirname(SNAPSHOT_PATH), { recursive: true });
  await fs.writeFile(SNAPSHOT_PATH, JSON.stringify(filtered, null, 2) + "\n");
}

test.describe("@v1.8-candidates LCP candidate enumeration (D-06)", () => {
  for (const vp of VIEWPORTS) {
    test(`/ @ ${vp.name} (warm-Anton)`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto("/", { waitUntil: "load" });

      // Force warm-state Anton (matches baseline-capture.spec.ts:60-61).
      await page.evaluate(() => document.fonts.load('700 100px "Anton"'));
      await page.evaluate(() => document.fonts.ready);

      // Enumerate ALL LCP candidates via PerformanceObserver — collect over a
      // settling window, then resolve. (Per RESEARCH §Q3; do NOT resolve on
      // first/last entry alone — the goal is the full ranking.)
      const candidates = await page.evaluate(
        (sizeThreshold) =>
          new Promise<
            Array<{
              selector: string | null;
              elementSize: number;
              startTime: number;
              resourceUrl: string;
              isLcp: boolean;
            }>
          >((resolve) => {
            const collected: Array<{
              selector: string | null;
              elementSize: number;
              startTime: number;
              resourceUrl: string;
              isLcp: boolean;
            }> = [];
            const po = new PerformanceObserver((list) => {
              for (const entry of list.getEntries()) {
                const lcpEntry = entry as PerformanceEntry & {
                  element?: Element;
                  size?: number;
                  url?: string;
                };
                const el = lcpEntry.element ?? null;
                // REUSE Phase 57 selector-builder verbatim from
                // v1.8-lcp-diagnosis.spec.ts:113-126.
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
                collected.push({
                  selector,
                  elementSize: lcpEntry.size ?? 0,
                  startTime: lcpEntry.startTime,
                  resourceUrl: lcpEntry.url ?? "",
                  isLcp: false,
                });
              }
            });
            po.observe({ type: "largest-contentful-paint", buffered: true });
            // Settle 1500ms after `load` (RESEARCH §Q3 settling window).
            setTimeout(() => {
              po.disconnect();
              // Sort defensively by startTime ASC (browser already emits in
              // order, but guarantee it for downstream consumers).
              collected.sort((a, b) => a.startTime - b.startTime);
              // Filter to candidates >= sizeThreshold (D-06 50 px² floor).
              const filtered = collected.filter(
                (c) => c.elementSize >= sizeThreshold
              );
              // Mark the FINAL entry as isLcp:true (largest by emission order).
              if (filtered.length > 0) {
                filtered[filtered.length - 1].isLcp = true;
              }
              resolve(filtered);
            }, 1500);
          }),
        SIZE_THRESHOLD
      );

      // Record qualityTier per `feedback_consume_quality_tier.md`. The helper
      // at lib/effects/quality-tier.ts is not exposed on `window`, so we read
      // a window override if present and otherwise fall back to a
      // deterministic heuristic from viewport width. Per the plan spec, this
      // field is recording-only and must be a number (P01-07 enforces
      // `typeof === 'number'`).
      const qualityTier = await page.evaluate(() => {
        const w = window as unknown as { __sfQualityTier?: number };
        if (typeof w.__sfQualityTier === "number") return w.__sfQualityTier;
        // Fallback heuristic: small viewport => assume tier 2 (mid),
        // larger viewport => tier 1 (high).
        return window.innerWidth < 768 ? 2 : 1;
      });

      await appendCandidates({
        viewport: vp.name,
        fontState: "warm",
        qualityTier,
        candidates,
        capturedAt: new Date().toISOString(),
      });

      // Sanity gates — at least one candidate captured + at most one isLcp:true.
      expect(candidates.length).toBeGreaterThan(0);
      const lcpCount = candidates.filter((c) => c.isLcp).length;
      expect(lcpCount).toBe(1);
    });
  }
});

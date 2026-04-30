// @path_decision: WMK-01
//   _wmk_01_decision:
//     decided: "2026-04-30"
//     audit: "wordmark-hoist:maxDiffPixelRatio"
//     original_threshold: 0.001
//     new_threshold: 0.001  (RETAINED — Path A)
//     rationale: |
//       The wordmark `[data-cd-corner-panel]` is one of three system-wide
//       trademark primitives (T1 pixel-sort, T2 nav glyph, T3 cube-tile box per
//       feedback_trademark_primitives.md). D-12 was set at 10× stricter than
//       AES-04 for exactly this reason — trademark fidelity drift is a BLOCK,
//       not a tolerance. Playwright's default per-platform snapshot routing
//       (`{name}-{projectName}-{platform}.png`) means there is NO cross-platform
//       pixel comparison happening: each test compares only against its own
//       platform baseline. The 8 baselines on disk (4 viewports × 2 platforms)
//       are committed at commit 68131f6 (chromium-linux via Path N bootstrap
//       from CI artifact, chromium-darwin via local capture at commit 34d8d4c
//       post-vectorization). Both platform sets show 0% historical pre/post-
//       hoist pixel diff. Loosening to AES-04's 0.5% would weaken the trademark
//       guard 5× without measurable cross-platform variance to justify it —
//       reality has already chosen per-platform baselines (per feedback_ratify_
//       reality_bias.md); the threshold should ratify that reality, not loosen
//       against it. The phrase "5× tolerance widening" in WMK-01 implies cross-
//       platform comparison; the actual mechanism is per-platform routing, so
//       that framing is reframed here as "retain per-platform 0.1%."
//     evidence:
//       - "tests/v1.8-phase63-1-wordmark-hoist.spec.ts-snapshots/ (8 PNGs at 200×40 RGB)"
//       - ".planning/phases/63.1-lcp-fast-path-remediation/63.1-03-SUMMARY.md (D-12 0% diff post-vectorization)"
//       - "git commit 68131f6 (chromium-linux Path N bootstrap from CI run 25136077631)"
//       - "git commit 34d8d4c (chromium-darwin re-baseline post wordmark vectorization)"
//     review_gate: |
//       Loosen to 0.005 ONLY if observed CI variance exceeds 0.001 on n≥3
//       same-code re-runs (no source change between runs, fresh CI environment).
//       Re-evaluate during BND-05/06/07 phase if barrel reshape changes
//       wordmark rendering path.
//     scope: "wordmark-hoist:maxDiffPixelRatio per-platform"
//     ratified_to_main_via: "Phase 69 (this commit)"
//
// Phase 63.1 Plan 03 Wave 0 — D-12 wordmark glyph fidelity spec.
//
// Playwright visual diff of [data-cd-corner-panel] across 4 viewports on homepage.
// D-12 threshold: <0.1% pixel diff (maxDiffPixelRatio: 0.001) — stricter than
// AES-04's 0.5% threshold because the wordmark is a trademark primitive.
//
// Run order:
//   1. BEFORE Task 1 hoist: run with --update-snapshots to capture Plan 02 tip baseline.
//      pnpm playwright test tests/v1.8-phase63-1-wordmark-hoist.spec.ts --update-snapshots
//   2. AFTER Task 1 hoist: run without --update-snapshots to verify diff <0.1%.
//      pnpm playwright test tests/v1.8-phase63-1-wordmark-hoist.spec.ts
//
// Snapshot storage: tests/v1.8-phase63-1-wordmark-hoist.spec.ts-snapshots/
// (Playwright's built-in snapshot directory alongside this spec file).
//
// D-12 fidelity properties being guarded:
//   - SVG mask kana-knockout (ユニバーサルデザインシステム / による cut-through)
//   - Yellow plaque with var(--sfx-cube-fill) CSS-var binding
//   - English overlay (CULTURE DIVISION) in JetBrains Mono
//   - clipPath corner notch (polygon(8px 0, 100% 0, 100% 100%, 0 100%, 0 8px))
//   - Fixed position: bottom-right with --sf-frame-bottom-gap + 24px offset

import { test, expect, type Page } from "@playwright/test";

// ---------------------------------------------------------------------------
// Viewport configurations (4 viewports per D-12 spec)
// ---------------------------------------------------------------------------
const VIEWPORTS = [
  { name: "mobile-360x800",   width: 360,  height: 800  },
  { name: "mobile-iphone13",  width: 390,  height: 844  },
  { name: "ipad",             width: 768,  height: 1024 },
  { name: "desktop-1440x900", width: 1440, height: 900  },
] as const;

const BASE_URL = process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:3000";

// ---------------------------------------------------------------------------
// Helper: wait for the corner panel to be fully painted
// ---------------------------------------------------------------------------
async function waitForCornerPanel(page: Page) {
  // Wait for the panel element to be visible in the DOM.
  const panel = page.locator("[data-cd-corner-panel]");
  await panel.waitFor({ state: "visible", timeout: 15_000 });
  // Brief settle — allow CSS vars (--sfx-cube-fill, --sf-frame-bottom-gap) to
  // resolve from the themeScript / scaleScript inline IIFEs. The scripts run at
  // HTML-parse time so by the time Playwright sees the DOM, they have already
  // written to document.documentElement.style. 100ms is a conservative buffer.
  await page.waitForTimeout(100);
  return panel;
}

// ---------------------------------------------------------------------------
// D-12 fidelity tests — one describe block per viewport
// ---------------------------------------------------------------------------
for (const viewport of VIEWPORTS) {
  test.describe(`D-12 wordmark fidelity — ${viewport.name}`, () => {
    test(`[data-cd-corner-panel] pixel diff <0.1% at ${viewport.name}`, async ({
      page,
    }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto(`${BASE_URL}/`, { waitUntil: "domcontentloaded" });

      const panel = await waitForCornerPanel(page);

      // D-12: strict 0.1% pixel-diff threshold (10× tighter than AES-04 0.5%).
      // First run (--update-snapshots): captures the pre-hoist Plan 02 tip baseline.
      // Subsequent runs (post-hoist): verifies the hoist preserved pixel-fidelity.
      await expect(panel).toHaveScreenshot(
        `wordmark-${viewport.name}.png`,
        {
          maxDiffPixelRatio: 0.001, // 0.1% — D-12 trademark primitive threshold
          // Threshold for anti-aliasing variance in glyph rendering across runs.
          // threshold: 0.02 (default Playwright — 2% per-pixel color tolerance).
        }
      );
    });
  });
}

// ---------------------------------------------------------------------------
// Structural invariant: [data-cd-corner-panel] is present exactly once on homepage
// ---------------------------------------------------------------------------
test("D-12 structural — [data-cd-corner-panel] present exactly once on homepage", async ({
  page,
}) => {
  await page.goto(`${BASE_URL}/`, { waitUntil: "domcontentloaded" });
  await page.waitForSelector("[data-cd-corner-panel]", { timeout: 10_000 });

  const count = await page.locator("[data-cd-corner-panel]").count();
  expect(
    count,
    `[data-cd-corner-panel] must appear EXACTLY ONCE in the DOM. Found ${count}. ` +
    `Task 1 hoist must remove the old mount site from <BorderlessProvider> ` +
    `and add a single mount as a direct <body> child.`
  ).toBe(1);
});

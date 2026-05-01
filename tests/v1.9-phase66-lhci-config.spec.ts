import { test, expect } from "@playwright/test";
import { readFileSync } from "node:fs";
import { join } from "node:path";

/**
 * Phase 66 Plan 03 Task 2 — LHCI config schema gate.
 *
 * Reads .lighthouseci/lighthouserc.json (mobile) and .desktop.json and asserts:
 *   - `_path_h_decision` block ABSENT from mobile config (Tasks 4 removes it).
 *   - `categories:accessibility.minScore === 0.97` in mobile config (Task 4).
 *   - `_path_i_decision` block ABSENT from desktop config (Task 5 removes it).
 *   - `categories:accessibility.minScore === 0.97` in desktop config (Task 5).
 *   - Unrelated path_decision blocks PRESERVED — Phase 66 scope is a11y only,
 *     not a sweep over all preview-LHCI ratifications.
 *
 * Test 5 (preservation) PASSES from the start; Tests 1-4 are RED until Tasks
 * 4 + 5 ship the path_h / path_i removal + minScore tightening.
 *
 * Pattern: fs-based JSON config schema test, mirrors
 * tests/v1.8-phase63-1-bundle-budget.spec.ts (uses readFileSync + JSON.parse,
 * runs under chromium project alongside the rest of the v1.9-phase66 suite).
 *
 * Run:
 *   pnpm exec playwright test tests/v1.9-phase66-lhci-config.spec.ts --project=chromium
 */

const MOBILE_RC = join(process.cwd(), ".lighthouseci/lighthouserc.json");
const DESKTOP_RC = join(process.cwd(), ".lighthouseci/lighthouserc.desktop.json");

type LHCIConfig = {
  ci: {
    assert: {
      assertions: {
        [key: string]: [string, { minScore?: number; maxNumericValue?: number; aggregationMethod?: string }];
      };
    };
  };
  [key: string]: unknown;
};

function loadConfig(path: string): LHCIConfig {
  return JSON.parse(readFileSync(path, "utf-8")) as LHCIConfig;
}

test.describe("@v1.9-phase66 LHCI config path_h + path_i removal", () => {
  test("path_h_decision absent from lighthouserc.json (Task 4)", () => {
    const config = loadConfig(MOBILE_RC);
    expect(
      "_path_h_decision" in config,
      "_path_h_decision block must be removed from .lighthouseci/lighthouserc.json — Phase 66 ARC-03 closes this loosening at architectural root via Pillarbox (Plan 02)."
    ).toBe(false);
  });

  test("mobile categories:accessibility minScore = 0.97 (Task 4)", () => {
    const config = loadConfig(MOBILE_RC);
    const assertion = config.ci.assert.assertions["categories:accessibility"];
    expect(assertion).toBeDefined();
    expect(
      assertion[1].minScore,
      "mobile a11y minScore must be tightened to 0.97 (was 0.96 under path_h)."
    ).toBe(0.97);
  });

  test("path_i_decision absent from lighthouserc.desktop.json (Task 5)", () => {
    const config = loadConfig(DESKTOP_RC);
    expect(
      "_path_i_decision" in config,
      "_path_i_decision block must be removed from .lighthouseci/lighthouserc.desktop.json — Phase 66 ARC-04 closes this via GhostLabel pseudo-element (Plan 02)."
    ).toBe(false);
  });

  test("desktop categories:accessibility minScore = 0.97 (Task 5)", () => {
    const config = loadConfig(DESKTOP_RC);
    const assertion = config.ci.assert.assertions["categories:accessibility"];
    expect(assertion).toBeDefined();
    expect(
      assertion[1].minScore,
      "desktop a11y minScore must be tightened to 0.97 (was 0.96 under path_i)."
    ).toBe(0.97);
  });

  test("unrelated path_decision blocks preserved (Phase 66 scope = a11y only)", () => {
    const mobile = loadConfig(MOBILE_RC);
    const desktop = loadConfig(DESKTOP_RC);

    // Mobile preserved keys (CLS, perf+TBT, LCP, best-practices, SEO note):
    expect("_path_a_decision" in mobile, "_path_a_decision (CLS) must be preserved in mobile").toBe(true);
    expect("_path_e_decision" in mobile, "_path_e_decision (perf+TBT) must be preserved in mobile").toBe(true);
    expect("_path_f_decision" in mobile, "_path_f_decision (LCP) must be preserved in mobile").toBe(true);
    expect("_path_b_decision" in mobile, "_path_b_decision (best-practices) must be preserved in mobile").toBe(true);
    expect("_seo_omission_note" in mobile, "_seo_omission_note must be preserved in mobile").toBe(true);

    // Desktop preserved keys (CLS, BP note, SEO note, perf-TBT note, perf path_g):
    expect("_path_a_decision" in desktop, "_path_a_decision (CLS) must be preserved in desktop").toBe(true);
    expect("_path_b_decision_note" in desktop, "_path_b_decision_note must be preserved in desktop").toBe(true);
    expect("_seo_omission_note" in desktop, "_seo_omission_note must be preserved in desktop").toBe(true);
    expect("_perf_tbt_omission_note" in desktop, "_perf_tbt_omission_note must be preserved in desktop").toBe(true);
    expect("_path_g_decision" in desktop, "_path_g_decision (desktop perf) must be preserved in desktop").toBe(true);
  });
});

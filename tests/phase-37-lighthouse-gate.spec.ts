import { spawnSync } from "child_process";
import { join } from "path";
import { test, expect } from "@playwright/test";

/**
 * Phase 37 MG-03 Lighthouse gate.
 *
 * Requirement: Lighthouse Performance, Accessibility, Best Practices, and SEO
 * must all score 100/100 after the Next.js 16 migration.
 *
 * Uses `scripts/launch-gate-runner.mjs` (native ESM) instead of
 * `scripts/launch-gate.ts` (tsx) — the tsx runner fails due to lighthouse@13
 * using `fileURLToPath(import.meta.url)` which tsx transforms incorrectly,
 * producing ERR_INVALID_ARG_TYPE at startup.
 *
 * Requires a production server running on http://localhost:3000.
 * Run with: pnpm start & pnpm exec playwright test tests/phase-37-lighthouse-gate.spec.ts
 */

const PROJECT_ROOT = join(__dirname, "..");
const RUNNER_PATH = join(PROJECT_ROOT, "scripts", "launch-gate-runner.mjs");
const TARGET_URL = "http://localhost:3000";
const TIMEOUT_MS = 5 * 60 * 1000; // 3 runs × up to 90s each

test.describe("@phase37 MG-03 Lighthouse gate", () => {
  test(
    "MG-03: all Lighthouse categories score 100/100 on Next.js 16",
    async ({ request }) => {
      // Guard: require production server to be reachable before burning Lighthouse time
      let serverReachable = false;
      try {
        const resp = await request.get(TARGET_URL, { timeout: 5000 });
        serverReachable = resp.ok();
      } catch {
        serverReachable = false;
      }
      if (!serverReachable) {
        throw new Error(
          `MG-03 Lighthouse gate cannot run: production server not reachable at ${TARGET_URL}.\n` +
            "Start it with: pnpm build && pnpm start"
        );
      }

      // Run the native-ESM lighthouse runner as a subprocess.
      // launch-gate-runner.mjs runs 3 audits, takes the worst score per category,
      // and exits non-zero if any category < 100.
      const result = spawnSync(
        "node",
        [RUNNER_PATH, "--url", TARGET_URL],
        {
          cwd: PROJECT_ROOT,
          encoding: "utf-8",
          timeout: TIMEOUT_MS,
          env: { ...process.env },
        }
      );

      // Surface runner stdout/stderr on failure for easy debugging
      if (result.status !== 0) {
        const output = [result.stdout, result.stderr].filter(Boolean).join("\n");
        throw new Error(
          `MG-03 Lighthouse gate FAILED (exit code ${result.status ?? "null"}):\n${output}`
        );
      }

      // Parse category scores from runner stdout for assertion-level visibility
      const stdout = result.stdout ?? "";
      const CATEGORIES = ["performance", "accessibility", "best-practices", "seo"] as const;
      for (const cat of CATEGORIES) {
        // Runner prints: "  performance        100 / 100  PASS"
        const match = stdout.match(new RegExp(`${cat}\\s+(\\d+)\\s*/\\s*100`));
        if (match) {
          const score = parseInt(match[1], 10);
          expect(
            score,
            `Lighthouse ${cat} score should be 100 (got ${score})`
          ).toBe(100);
        }
      }

      // Primary assertion: runner exit code 0 means all categories passed
      expect(result.status).toBe(0);
    },
    { timeout: TIMEOUT_MS + 10_000 }
  );
});

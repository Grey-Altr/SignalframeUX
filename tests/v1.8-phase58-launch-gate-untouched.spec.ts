import { test, expect } from "@playwright/test";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

/**
 * Phase 58 CIB-04 — `scripts/launch-gate.ts` byte-identity guard.
 *
 * The file is read-only for the duration of the v1.8 milestone (and for
 * Phase 58 specifically). If anyone modifies it in this phase's commit
 * range, this test fails and the workflow blocks merge.
 *
 * Detection: compare the git object SHA of the file at HEAD vs at the
 * merge-base with `main`. Equal SHAs prove byte-identity.
 *
 * T-EXEC-01: All subprocess calls use execFileSync (argument array form,
 * NO shell). The only string interpolated into an argument is the
 * merge-base SHA from `git merge-base` output — itself a hex hash, not
 * user input. No external input touches these calls.
 */

function gitArg(args: string[]): string {
  return execFileSync("git", args, { encoding: "utf8" }).trim();
}

test("@v18-phase58-cib-04 scripts/launch-gate.ts is byte-identical to merge-base with main", () => {
  const filePath = path.resolve(process.cwd(), "scripts/launch-gate.ts");
  expect(fs.existsSync(filePath), "scripts/launch-gate.ts must exist (CIB-04)").toBe(true);

  // Resolve merge-base. In a feature branch, this should be the commit on
  // main where the branch diverged.
  const mergeBase = gitArg(["merge-base", "HEAD", "main"]);
  expect(/^[0-9a-f]{40}$/.test(mergeBase), `Invalid SHA from merge-base: ${mergeBase}`).toBe(true);

  // Get git object SHA of the file at merge-base.
  let mergeBaseFileSha: string;
  try {
    mergeBaseFileSha = gitArg(["rev-parse", `${mergeBase}:scripts/launch-gate.ts`]);
  } catch {
    throw new Error(
      "CIB-04: scripts/launch-gate.ts did not exist at merge-base — phase 58 must not introduce it."
    );
  }

  // Get git object SHA of the file at HEAD.
  const headFileSha = gitArg(["rev-parse", "HEAD:scripts/launch-gate.ts"]);

  expect(
    headFileSha,
    `CIB-04 violation: scripts/launch-gate.ts modified between merge-base ${mergeBase.slice(0, 7)} and HEAD. ` +
      `Expected git-object SHA: ${mergeBaseFileSha}, got: ${headFileSha}. Revert all changes to this file before merging Phase 58.`
  ).toBe(mergeBaseFileSha);
});

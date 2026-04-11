/**
 * Phase 39-02: Tree-shaking verification script tests
 *
 * Verifies that:
 * 1. scripts/verify-tree-shake.ts exists
 * 2. It checks for "gsap" and "three" in core bundle
 * 3. When run against dist/, it exits 0 and outputs RESULT: PASS
 * 4. dist/index.mjs does NOT contain gsap/three imports
 * 5. dist/animation.mjs DOES contain gsap import
 * 6. dist/webgl.mjs DOES contain three import
 */
import { test, expect } from "@playwright/test";
import { execFileSync } from "child_process";
import { existsSync, readFileSync } from "fs";
import * as path from "path";

const ROOT = path.resolve(__dirname, "..");
const SCRIPT = path.join(ROOT, "scripts/verify-tree-shake.ts");
const DIST = path.join(ROOT, "dist");

test.describe("Phase 39-02: Tree-shaking verification script", () => {
  test("scripts/verify-tree-shake.ts exists", () => {
    expect(existsSync(SCRIPT)).toBe(true);
  });

  test("verify-tree-shake.ts contains readFileSync reference to dist/index", () => {
    const content = readFileSync(SCRIPT, "utf8");
    expect(content).toMatch(/readFileSync/);
    expect(content).toMatch(/dist\/index/);
  });

  test("verify-tree-shake.ts checks for gsap and three in core bundle", () => {
    const content = readFileSync(SCRIPT, "utf8");
    expect(content).toContain("gsap");
    expect(content).toContain("three");
  });

  test("dist/index.mjs does NOT contain gsap import", () => {
    const coreMjs = path.join(DIST, "index.mjs");
    expect(existsSync(coreMjs)).toBe(true);
    const content = readFileSync(coreMjs, "utf8");
    const gsapImport = /from\s+['"]gsap['"]|require\(\s*['"]gsap['"]|from\s+['"]gsap\//;
    expect(gsapImport.test(content)).toBe(false);
  });

  test("dist/index.cjs does NOT contain gsap import", () => {
    const coreCjs = path.join(DIST, "index.cjs");
    expect(existsSync(coreCjs)).toBe(true);
    const content = readFileSync(coreCjs, "utf8");
    const gsapImport = /from\s+['"]gsap['"]|require\(\s*['"]gsap['"]|from\s+['"]gsap\//;
    expect(gsapImport.test(content)).toBe(false);
  });

  test("dist/index.mjs does NOT contain three import", () => {
    const coreMjs = path.join(DIST, "index.mjs");
    const content = readFileSync(coreMjs, "utf8");
    const threeImport = /from\s+['"]three['"]|require\(\s*['"]three['"]|from\s+['"]three\//;
    expect(threeImport.test(content)).toBe(false);
  });

  test("dist/animation.mjs DOES contain gsap import", () => {
    const animMjs = path.join(DIST, "animation.mjs");
    expect(existsSync(animMjs)).toBe(true);
    const content = readFileSync(animMjs, "utf8");
    const gsapImport = /from\s+['"]gsap['"]|require\(\s*['"]gsap['"]|from\s+['"]gsap\//;
    expect(gsapImport.test(content)).toBe(true);
  });

  test("dist/webgl.mjs DOES contain three import", () => {
    const webglMjs = path.join(DIST, "webgl.mjs");
    expect(existsSync(webglMjs)).toBe(true);
    const content = readFileSync(webglMjs, "utf8");
    const threeImport = /from\s+['"]three['"]|require\(\s*['"]three['"]|from\s+['"]three\//;
    expect(threeImport.test(content)).toBe(true);
  });

  test("npx tsx scripts/verify-tree-shake.ts exits 0 and outputs RESULT: PASS", () => {
    let output = "";
    let exitCode = 0;

    try {
      output = execFileSync("npx", ["tsx", "scripts/verify-tree-shake.ts"], {
        cwd: ROOT,
        encoding: "utf8",
        timeout: 30000,
      });
    } catch (err: unknown) {
      const error = err as { stdout?: string; stderr?: string; status?: number };
      output = (error.stdout ?? "") + (error.stderr ?? "");
      exitCode = error.status ?? 1;
    }

    expect(exitCode).toBe(0);
    expect(output).toContain("RESULT: PASS");
  });
});

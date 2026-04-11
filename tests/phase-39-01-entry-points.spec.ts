/**
 * Phase 39-01: Library Entry Points + tokens.css verification
 *
 * These are file-content checks that verify:
 * - Core entry has no gsap/three/next/navigation imports
 * - Animation entry has gsap imports
 * - WebGL entry has signal-canvas/three imports
 * - tokens.css has correct token vars and no framework directives
 * - signalframe-provider has dynamic (not static) gsap import
 */

import { test, expect } from "@playwright/test";
import * as fs from "fs";
import * as path from "path";

const ROOT = path.resolve(__dirname, "..");

test("entry-core.ts: no gsap, three, or next/navigation imports", () => {
  const content = fs.readFileSync(path.join(ROOT, "lib/entry-core.ts"), "utf8");
  expect(content).not.toMatch(/\bgsap\b/);
  expect(content).not.toMatch(/\bthree\b/i);
  expect(content).not.toMatch(/next\/navigation/);
});

test("entry-core.ts: exports SFButton and cn and createSignalframeUX", () => {
  const content = fs.readFileSync(path.join(ROOT, "lib/entry-core.ts"), "utf8");
  expect(content).toContain("SFButton");
  expect(content).toContain("cn");
  expect(content).toContain("createSignalframeUX");
});

test("entry-animation.ts: contains gsap imports", () => {
  const content = fs.readFileSync(
    path.join(ROOT, "lib/entry-animation.ts"),
    "utf8"
  );
  expect(content).toMatch(/gsap/);
});

test("entry-animation.ts: exports sf-accordion and gsap-core", () => {
  const content = fs.readFileSync(
    path.join(ROOT, "lib/entry-animation.ts"),
    "utf8"
  );
  expect(content).toContain("sf-accordion");
  expect(content).toContain("gsap-core");
});

test("entry-webgl.ts: contains signal-canvas or three imports", () => {
  const content = fs.readFileSync(
    path.join(ROOT, "lib/entry-webgl.ts"),
    "utf8"
  );
  expect(content.toLowerCase()).toMatch(/signal-canvas|three/);
});

test("entry-webgl.ts: exports signal-canvas and use-signal-scene", () => {
  const content = fs.readFileSync(
    path.join(ROOT, "lib/entry-webgl.ts"),
    "utf8"
  );
  expect(content).toContain("signal-canvas");
  expect(content).toContain("use-signal-scene");
});

test("tokens.css: contains --color-background OKLCH token", () => {
  const content = fs.readFileSync(path.join(ROOT, "lib/tokens.css"), "utf8");
  expect(content).toContain("--color-background: oklch(");
});

test("tokens.css: contains --color-primary OKLCH token", () => {
  const content = fs.readFileSync(path.join(ROOT, "lib/tokens.css"), "utf8");
  expect(content).toContain("--color-primary: oklch(");
});

test("tokens.css: contains --duration-instant token", () => {
  const content = fs.readFileSync(path.join(ROOT, "lib/tokens.css"), "utf8");
  expect(content).toContain("--duration-instant: 34ms");
});

test("tokens.css: no @import or @source or @custom-variant directives", () => {
  const content = fs.readFileSync(path.join(ROOT, "lib/tokens.css"), "utf8");
  expect(content).not.toMatch(/@import/);
  expect(content).not.toMatch(/@source/);
  expect(content).not.toMatch(/@custom-variant/);
});

test("signalframe-provider.tsx: no static import gsap at module level", () => {
  const content = fs.readFileSync(
    path.join(ROOT, "lib/signalframe-provider.tsx"),
    "utf8"
  );
  // Must not have a static import gsap at the top level
  expect(content).not.toMatch(/^import gsap from ['"]gsap['"]/m);
});

test("signalframe-provider.tsx: has dynamic getGsap() or equivalent", () => {
  const content = fs.readFileSync(
    path.join(ROOT, "lib/signalframe-provider.tsx"),
    "utf8"
  );
  expect(content).toMatch(/import\(['"]gsap['"]\)/);
});

test("signalframe-provider.tsx: still exports createSignalframeUX and useSignalframe", () => {
  const content = fs.readFileSync(
    path.join(ROOT, "lib/signalframe-provider.tsx"),
    "utf8"
  );
  expect(content).toContain("createSignalframeUX");
  expect(content).toContain("useSignalframe");
  expect(content).toContain("SignalframeUXConfig");
  expect(content).toContain("UseSignalframeReturn");
});

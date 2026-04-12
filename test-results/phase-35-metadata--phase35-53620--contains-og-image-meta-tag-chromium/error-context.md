# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: phase-35-metadata.spec.ts >> @phase35 LR-02 metadata + OG image >> LR-02: / HTML contains og:image meta tag
- Location: tests/phase-35-metadata.spec.ts:13:7

# Error details

```
Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:3000/
Call log:
  - navigating to "http://localhost:3000/", waiting until "load"

```

# Test source

```ts
  1  | import { test, expect } from "@playwright/test";
  2  | import { readFileSync } from "fs";
  3  | import { join } from "path";
  4  | 
  5  | test.describe("@phase35 LR-02 metadata + OG image", () => {
  6  |   test("LR-02: /opengraph-image returns 200 image/png", async ({ request }) => {
  7  |     const response = await request.get("/opengraph-image");
  8  |     expect(response.status()).toBe(200);
  9  |     const contentType = response.headers()["content-type"];
  10 |     expect(contentType).toContain("image/png");
  11 |   });
  12 | 
  13 |   test("LR-02: / HTML contains og:image meta tag", async ({ page }) => {
> 14 |     await page.goto("/");
     |                ^ Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:3000/
  15 |     const ogImage = await page.locator('meta[property="og:image"]').first();
  16 |     const content = await ogImage.getAttribute("content");
  17 |     expect(content).toBeTruthy();
  18 |     expect(content!.startsWith("http")).toBeTruthy();
  19 |   });
  20 | 
  21 |   test("LR-02: app/opengraph-image.tsx is flex-only, inline-style-only, fs-based", () => {
  22 |     const src = readFileSync(join(process.cwd(), "app/opengraph-image.tsx"), "utf-8");
  23 |     expect(src).toContain('from "next/og"');
  24 |     expect(src).toContain('from "fs/promises"');
  25 |     expect(src).toContain('display: "flex"');
  26 |     expect(src).not.toContain('display: "grid"');
  27 |     expect(src).not.toContain("className");
  28 |     expect(src).not.toMatch(/export\s+const\s+runtime/);
  29 |     expect(src).not.toContain("fetch(");
  30 |   });
  31 | 
  32 |   test("LR-02: OG image contains all locked content fields", () => {
  33 |     const src = readFileSync(join(process.cwd(), "app/opengraph-image.tsx"), "utf-8");
  34 |     expect(src).toContain("[SF//UX]");
  35 |     expect(src).toContain("v1.7");
  36 |     expect(src).toContain("TIGHTENING");
  37 |     expect(src).toContain("COMPONENTS:48");
  38 |     expect(src).toContain("SIG:0.7");
  39 |     expect(src).toContain("CLS:0");
  40 |     expect(src).toContain("LCP:");
  41 |     expect(src).toContain("77/77");
  42 |     expect(src).toContain("BOOT OK");
  43 |   });
  44 | 
  45 |   test("LR-02: twitter-image.tsx re-exports from opengraph-image", () => {
  46 |     const src = readFileSync(join(process.cwd(), "app/twitter-image.tsx"), "utf-8");
  47 |     expect(src).toContain("./opengraph-image");
  48 |     expect(src.split("\n").length).toBeLessThan(15);
  49 |   });
  50 | });
  51 | 
```
import { test, expect } from "@playwright/test";
import { readFileSync } from "fs";
import { join } from "path";

test.describe("@phase35 LR-02 metadata + OG image", () => {
  test("LR-02: /opengraph-image returns 200 image/png", async ({ request }) => {
    const response = await request.get("/opengraph-image");
    expect(response.status()).toBe(200);
    const contentType = response.headers()["content-type"];
    expect(contentType).toContain("image/png");
  });

  test("LR-02: / HTML contains og:image meta tag", async ({ page }) => {
    await page.goto("/");
    const ogImage = await page.locator('meta[property="og:image"]').first();
    const content = await ogImage.getAttribute("content");
    expect(content).toBeTruthy();
    expect(content!.startsWith("http")).toBeTruthy();
  });

  test("LR-02: app/opengraph-image.tsx is flex-only, inline-style-only, fs-based", () => {
    const src = readFileSync(join(process.cwd(), "app/opengraph-image.tsx"), "utf-8");
    expect(src).toContain('from "next/og"');
    expect(src).toContain('from "fs/promises"');
    expect(src).toContain('display: "flex"');
    expect(src).not.toContain('display: "grid"');
    expect(src).not.toContain("className");
    expect(src).not.toMatch(/export\s+const\s+runtime/);
    expect(src).not.toContain("fetch(");
  });

  test("LR-02: OG image contains all locked content fields", () => {
    const src = readFileSync(join(process.cwd(), "app/opengraph-image.tsx"), "utf-8");
    expect(src).toContain("[SF//UX]");
    expect(src).toContain("v1.5");
    expect(src).toContain("REDESIGN");
    expect(src).toContain("COMPONENTS:54");
    expect(src).toContain("SIG:0.7");
    expect(src).toContain("CLS:0");
    expect(src).toContain("LCP:");
    expect(src).toContain("77/77");
    expect(src).toContain("BOOT OK");
  });

  test("LR-02: twitter-image.tsx re-exports from opengraph-image", () => {
    const src = readFileSync(join(process.cwd(), "app/twitter-image.tsx"), "utf-8");
    expect(src).toContain("./opengraph-image");
    expect(src.split("\n").length).toBeLessThan(15);
  });
});

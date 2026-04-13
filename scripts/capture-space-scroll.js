import { chromium } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

const BASE_URL = process.env.BASE_URL ?? "http://localhost:3001";
const VIEWPORT = { width: 1440, height: 900 };
const MAX_STEPS = 120;
const WAIT_AFTER_SPACE_MS = 1200;
const WAIT_AFTER_NAV_MS = 2000;

const ROUTES = [
  { name: "home", route: "/" },
  { name: "inventory", route: "/inventory" },
  { name: "system", route: "/system" },
  { name: "init", route: "/init" },
  { name: "reference", route: "/reference" },
];

function buildOutputDir() {
  const stamp = new Date().toISOString().replaceAll(":", "-");
  return path.join(process.cwd(), "test-results", `space-scroll-captures-${stamp}`);
}

async function run() {
  const outputDir = buildOutputDir();
  fs.mkdirSync(outputDir, { recursive: true });

  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize(VIEWPORT);

  const summary = [];

  for (const { name, route } of ROUTES) {
    const url = `${BASE_URL}${route}`;
    console.log(`\n[route] ${name} -> ${url}`);

    await page.goto(url, { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(WAIT_AFTER_NAV_MS);

    const viewportHeight = await page.evaluate(() => window.innerHeight);
    let step = 0;
    let staleSteps = 0;
    while (step < MAX_STEPS) {
      const screenshotPath = path.join(outputDir, `${name}-${String(step).padStart(3, "0")}.png`);
      await page.screenshot({ path: screenshotPath, fullPage: false });

      const before = await page.evaluate(() => Math.round(window.scrollY));
      await page.focus("body");
      await page.keyboard.press("Space");
      await page.waitForTimeout(WAIT_AFTER_SPACE_MS);
      const after = await page.evaluate(() => Math.round(window.scrollY));

      console.log(`  step=${step} y=${before} -> ${after}`);

      const wrappedToTop = after < before && before - after > viewportHeight / 2;
      if (wrappedToTop) {
        // Space on some pages wraps to top after reaching the bottom.
        break;
      }

      if (after === before) {
        staleSteps += 1;
        if (staleSteps >= 2) break;
      } else {
        staleSteps = 0;
      }
      step += 1;
    }

    summary.push({ page: name, stepsCaptured: step + 1 });
  }

  const summaryPath = path.join(outputDir, "summary.json");
  fs.writeFileSync(summaryPath, JSON.stringify({ baseUrl: BASE_URL, summary }, null, 2));
  console.log(`\nSaved captures to: ${outputDir}`);

  await browser.close();
}

run();

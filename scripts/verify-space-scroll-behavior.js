import { chromium } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

const BASE_URL = process.env.BASE_URL ?? "http://localhost:3001";
const VIEWPORT = { width: 1440, height: 900 };
const WAIT_MS = 1400;

const ROUTES = ["/", "/inventory", "/system", "/init", "/reference"];

function outputPath() {
  const stamp = new Date().toISOString().replaceAll(":", "-");
  return path.join(process.cwd(), "test-results", `space-scroll-verification-${stamp}.json`);
}

async function run() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize(VIEWPORT);

  const results = [];

  for (const route of ROUTES) {
    const url = `${BASE_URL}${route}`;
    await page.goto(url, { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(2000);

    // Mid-page test: Space should detent down (increase y).
    const midBefore = await page.evaluate(() => Math.round(window.scrollY));
    await page.focus("body");
    await page.keyboard.press("Space");
    await page.waitForTimeout(WAIT_MS);
    const midAfter = await page.evaluate(() => Math.round(window.scrollY));
    const midDetentPass = midAfter > midBefore;

    // Near-bottom test: Space should trigger back-to-top behavior.
    const nearBottomStart = await page.evaluate(() => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const target = Math.max(0, max - 120);
      window.scrollTo(0, target);
      return Math.round(window.scrollY);
    });
    await page.waitForTimeout(250);
    await page.focus("body");
    await page.keyboard.press("Space");
    await page.waitForTimeout(WAIT_MS);
    const nearBottomAfter = await page.evaluate(() => Math.round(window.scrollY));
    const backToTopPass = nearBottomAfter <= 5;

    results.push({
      route,
      detent: { before: midBefore, after: midAfter, pass: midDetentPass },
      backToTop: { before: nearBottomStart, after: nearBottomAfter, pass: backToTopPass },
      pass: midDetentPass && backToTopPass,
    });
  }

  const allPass = results.every((r) => r.pass);
  const report = { baseUrl: BASE_URL, viewport: VIEWPORT, allPass, results };

  const file = outputPath();
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(report, null, 2));

  console.log(JSON.stringify(report, null, 2));
  console.log(`Saved report: ${file}`);

  await browser.close();
}

run();

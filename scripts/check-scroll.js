import { chromium } from '@playwright/test';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto('http://localhost:3001/');
  await page.waitForTimeout(2000);
  
  const scrollHeight = await page.evaluate(() => document.body.scrollHeight);
  const docHeight = await page.evaluate(() => document.documentElement.scrollHeight);
  const maxScroll = await page.evaluate(() => Math.max(document.body.scrollHeight, document.documentElement.scrollHeight) - window.innerHeight);
  
  console.log('scrollHeight:', scrollHeight);
  console.log('docHeight:', docHeight);
  console.log('maxScroll:', maxScroll);
  
  await page.evaluate(() => window.scrollTo(0, 10000));
  await page.waitForTimeout(500);
  const actualMax = await page.evaluate(() => window.scrollY);
  console.log('actualMax:', actualMax);
  
  await browser.close();
})();

import { chromium } from '@playwright/test';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto('http://localhost:3001/');
  await page.waitForTimeout(2000);
  
  const thesisHtml = await page.evaluate(() => {
    return document.getElementById('thesis').outerHTML;
  });
  
  console.log(thesisHtml);
  await browser.close();
})();

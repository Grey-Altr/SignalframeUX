import { chromium } from '@playwright/test';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('BROWSER:', msg.text()));
  
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto('http://localhost:3001/');
  await page.waitForTimeout(2000);
  
  await page.evaluate(() => {
    console.log('Lenis limit:', window.lenis.limit);
  });
  
  await browser.close();
})();

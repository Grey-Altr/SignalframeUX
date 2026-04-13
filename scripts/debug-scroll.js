import { chromium } from '@playwright/test';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('BROWSER:', msg.text()));
  
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto('http://localhost:3001/');
  await page.waitForTimeout(2000);
  
  await page.evaluate(() => window.scrollTo(0, 4000));
  await page.waitForTimeout(1000);
  
  console.log('Scroll before space:', await page.evaluate(() => window.scrollY));
  
  await page.focus('body');
  await page.keyboard.press('Space');
  await page.waitForTimeout(1500);
  
  console.log('Scroll after space:', await page.evaluate(() => window.scrollY));
  
  await browser.close();
})();

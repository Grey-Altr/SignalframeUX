import { chromium } from '@playwright/test';
import fs from 'fs';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1280, height: 800 });
  
  const urls = [
    { name: 'home', url: 'http://localhost:3001/' },
    { name: 'inventory', url: 'http://localhost:3001/inventory' },
    { name: 'system', url: 'http://localhost:3001/system' },
    { name: 'init', url: 'http://localhost:3001/init' },
    { name: 'reference', url: 'http://localhost:3001/reference' }
  ];

  for (const { name, url } of urls) {
    console.log(`Processing ${name}...`);
    await page.goto(url);
    await page.waitForTimeout(2000); // wait for initial animations
    
    let scrollCount = 0;
    while (true) {
      await page.screenshot({ path: `screenshot-${name}-${scrollCount}.png` });
      console.log(`Saved screenshot-${name}-${scrollCount}.png`);
      
      const previousScrollY = await page.evaluate(() => window.scrollY);
      
      // Press space
      await page.focus('body');
      await page.keyboard.press('Space');
      await page.waitForTimeout(1500); // wait for scroll animation
      
      const currentScrollY = await page.evaluate(() => window.scrollY);
      console.log(`Scroll Y: ${currentScrollY}`);
      
      if (currentScrollY === previousScrollY) {
        break; // reached the bottom
      }
      scrollCount++;
      
      if (scrollCount > 10) break; // safety limit
    }
  }

  await browser.close();
})();
import { chromium } from '@playwright/test';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto('http://localhost:3001/');
  await page.waitForTimeout(2000);
  
  const heights = await page.evaluate(() => {
    const entry = document.getElementById('entry').getBoundingClientRect().height;
    const thesis = document.getElementById('thesis').getBoundingClientRect().height;
    const proof = document.getElementById('proof').getBoundingClientRect().height;
    const inventory = document.getElementById('inventory').getBoundingClientRect().height;
    const signal = document.getElementById('signal').getBoundingClientRect().height;
    const acquisition = document.getElementById('acquisition').getBoundingClientRect().height;
    return { entry, thesis, proof, inventory, signal, acquisition };
  });
  
  const debug = await page.evaluate(() => {
    return {
      innerWidth: window.innerWidth,
      mobileMQ: window.matchMedia("(max-width: 667px)").matches,
      pinSpacerPadding: document.querySelector('.pin-spacer')?.style.paddingBottom
    };
  });
  
  console.log(heights);
  console.log(debug);
  await browser.close();
})();

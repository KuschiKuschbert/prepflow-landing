const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

async function generateBackground() {
  const browser = await puppeteer.launch({
    headless: true,
    defaultViewport: { width: 1920, height: 1080 },
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  try {
    const page = await browser.newPage();
    const url = 'http://localhost:3000/generate-background';

    console.log(`Navigating to ${url}...`);
    try {
      await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });
    } catch (e) {
      console.error(
        'Error connecting to the application. Make sure the dev server is running on port 3000.',
      );
      console.error('Run: npm run dev');
      process.exit(1);
    }

    // Wait for the background container to be fully rendered
    // The container has the ref and specific dimensions
    const selector = 'div.relative.h-\\[1080px\\].w-\\[1920px\\]';
    await page.waitForSelector(selector);

    // Hide the controls overlay before taking the screenshot
    await page.evaluate(() => {
      const controls = document.querySelector('.fixed.top-4.left-4');
      if (controls) controls.style.display = 'none';
    });

    const outputPath = path.join(__dirname, '../public/background_extracted.png');

    console.log('Taking screenshot...');
    const element = await page.$(selector);

    await element.screenshot({
      path: outputPath,
      type: 'png',
      omitBackground: true,
    });

    console.log(`Background saved to ${outputPath}`);
  } catch (error) {
    console.error('Failed to generate background:', error);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

generateBackground();

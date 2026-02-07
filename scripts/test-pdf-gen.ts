import chromium from '@sparticuz/chromium';
import puppeteerCore, { Browser } from 'puppeteer-core';

async function test() {
  console.log('Launching browser...');
  let browser: Browser | null = null;
  try {
    if (process.env.NODE_ENV === 'production' || process.env.VERCEL) {
      chromium.setGraphicsMode = false;
      const executablePath = await chromium.executablePath();
      browser = (await puppeteerCore.launch({
        args: chromium.args,
        defaultViewport: { width: 1920, height: 1080 },
        executablePath,
        headless: true,
      })) as unknown as Browser;
    } else {
      // eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports
      const puppeteer = require('puppeteer');
      browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
      });
    }

    if (!browser) throw new Error('Failed to launch browser');

    console.log('Browser launched.');
    const page = await browser.newPage();
    console.log('Page created.');
    await page.setContent('<h1>Hello World</h1>');
    console.log('Content set.');
    const pdf = await page.pdf({ format: 'A4' });
    console.log('PDF generated, size:', pdf.length);
    await browser.close();
    console.log('Browser closed.');
  } catch (e) {
    console.error('Puppeteer failed:', e);
    if (browser) await browser.close();
    process.exit(1);
  }
}

test();

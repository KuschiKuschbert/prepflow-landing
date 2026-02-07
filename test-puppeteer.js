const puppeteer = require('puppeteer');

(async () => {
  try {
    console.log('Launching browser...');
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    console.log('Browser launched successfully!');
    const page = await browser.newPage();
    await page.setContent('<h1>Test</h1>');
    const pdf = await page.pdf({ format: 'A4' });
    console.log('PDF generated successfully, size:', pdf.length);
    await browser.close();
    process.exit(0);
  } catch (error) {
    console.error('Error launching browser:', error);
    process.exit(1);
  }
})();

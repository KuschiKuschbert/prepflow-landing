import { logger } from '@/lib/logger';
import chromium from '@sparticuz/chromium';
import puppeteerCore, { Browser } from 'puppeteer-core';

/**
 * Generate PDF from HTML content using Puppeteer
 *
 * @param {string} html - HTML content to render
 * @returns {Promise<Uint8Array>} PDF buffer
 */
export async function generatePDF(html: string): Promise<Uint8Array> {
  let browser: Browser | null = null;
  try {
    logger.dev('[generatePDF] Launching browser...');

    if (process.env.NODE_ENV === 'production' || process.env.VERCEL) {
      // Production (Vercel): Use puppeteer-core + @sparticuz/chromium
      chromium.setGraphicsMode = false;
      const executablePath = await chromium.executablePath();

      browser = await puppeteerCore.launch({
        args: chromium.args,
        defaultViewport: { width: 1920, height: 1080 },
        executablePath,
        headless: true,
      });
    } else {
      // Development: Use standard puppeteer (installed in devDependencies)
      // Dynamic import to avoid bundling it in production
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const puppeteer = require('puppeteer');
      browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      });
    }

    if (!browser) {
      throw new Error('Failed to launch browser');
    }

    const page = await browser.newPage();

    // Set content and wait for network idle to ensure assets load
    logger.dev('[generatePDF] Setting content...');
    await page.setContent(html, {
      waitUntil: ['load', 'networkidle0'],
    });

    // Generate PDF
    logger.dev('[generatePDF] Generating PDF buffer...');
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: undefined, // Let CSS control margins
    });

    logger.dev('[generatePDF] PDF generated successfully');
    return pdfBuffer;
  } catch (error) {
    logger.error('[generatePDF] Error generating PDF:', error);
    throw error;
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

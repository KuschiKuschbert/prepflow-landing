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
      // eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports
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

    // Set a reasonable timeout for the whole operation (Vercel has its own, but we should be stricter)
    page.setDefaultTimeout(25000); // 25 seconds

    // Set content and wait for load.
    // We avoid 'networkidle0' because it's slow and risky in serverless environments
    // where some assets (like tracking pixels or slow fonts) might never "idle".
    logger.dev('[generatePDF] Setting content...');
    await page.setContent(html, {
      waitUntil: 'load',
    });

    // Generate PDF
    logger.dev('[generatePDF] Generating PDF buffer...');
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '10mm',
        right: '10mm',
        bottom: '10mm',
        left: '10mm',
      },
    });

    logger.dev('[generatePDF] PDF generated successfully');
    return pdfBuffer;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logger.error('[generatePDF] Error generating PDF:', {
      error: errorMessage,
      stack: error instanceof Error ? error.stack : undefined,
    });
    throw error;
  } finally {
    if (browser) {
      try {
        await browser.close();
      } catch (closeError) {
        logger.warn('[generatePDF] Error closing browser:', closeError);
      }
    }
  }
}

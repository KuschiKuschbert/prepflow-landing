import { logger } from '@/lib/logger';
import puppeteer from 'puppeteer';

/**
 * Generate PDF from HTML content using Puppeteer
 *
 * @param {string} html - HTML content to render
 * @returns {Promise<Uint8Array>} PDF buffer
 */
export async function generatePDF(html: string): Promise<Uint8Array> {
  let browser = null;
  try {
    logger.dev('[generatePDF] Launching browser...');
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

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
      margin: undefined, // Let CSS control margins to ensure background color fills the page
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

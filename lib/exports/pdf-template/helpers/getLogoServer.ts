import { logger } from '@/lib/logger';
import fs from 'fs';
import path from 'path';

/**
 * Returns the PrepFlow logo as a Base64 string for server-side PDF generation.
 * Uses the WebP version for high quality and small file size.
 */
export function getLogoBase64(): string {
  try {
    const filePath = path.join(process.cwd(), 'public', 'images', 'prepflow-logo.webp');
    const fileBuffer = fs.readFileSync(filePath);
    const base64Image = fileBuffer.toString('base64');
    return `data:image/webp;base64,${base64Image}`;
  } catch (err) {
    logger.error('[getLogoServer] Error reading WebP logo file:', err);

    // Fallback: Try to use the absolute URL for Puppeteer
    const baseUrl = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    return `${baseUrl}/images/prepflow-logo.webp`;
  }
}

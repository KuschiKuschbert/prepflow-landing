import fs from 'fs';
import path from 'path';

/**
 * Reads the official PNG logo from the filesystem and returns it as a Base64 string.
 * This is for Server-Side use only (API routes) to ensure consistent rendering in PDFs.
 */
export function getLogoBase64(): string {
  try {
    const filePath = path.join(process.cwd(), 'public', 'images', 'prepflow-logo.png');
    const fileBuffer = fs.readFileSync(filePath);
    const base64Image = fileBuffer.toString('base64');
    return `data:image/png;base64,${base64Image}`;
  } catch {
    // Fallback if file read fails (though it shouldn't) - return absolute URL for Puppeteer
    const baseUrl = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    return `${baseUrl}/images/prepflow-logo.png`;
  }
}

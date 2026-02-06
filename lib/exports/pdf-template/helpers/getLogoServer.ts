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
  } catch (error) {
    console.error('Error reading logo file:', error);
    // Fallback if file read fails (though it shouldn't) - return empty or standard URL
    return '/images/prepflow-logo.png';
  }
}

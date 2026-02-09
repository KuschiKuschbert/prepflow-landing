import { LOGO_BASE64 } from '@/lib/exports/logo-base64';

/**
 * Returns the PrepFlow logo as a Base64 string for server-side PDF generation.
 * Uses the WebP version for high quality and small file size.
 * Now embedded to avoid Vercel FS/Network issues.
 */
export function getLogoBase64(): string {
  return LOGO_BASE64;
}

/**
 * Dynamic base URL detection for Auth0 SDK
 * Supports dev, preview (Vercel), and production environments
 */
export function getBaseUrl(): string {
  // Vercel Preview/Dev: Prioritize VERCEL_URL over AUTH0_BASE_URL (which might be set to prod)
  if (
    process.env.VERCEL_URL &&
    (process.env.VERCEL_ENV === 'preview' || process.env.VERCEL_ENV === 'development')
  ) {
    const protocol = process.env.VERCEL_URL.startsWith('localhost') ? 'http' : 'https';
    return `${protocol}://${process.env.VERCEL_URL}`;
  }

  // Use explicit AUTH0_BASE_URL if set (useful for tunnels like ngrok or Production)
  if (process.env.AUTH0_BASE_URL) {
    return process.env.AUTH0_BASE_URL;
  }

  // Fallback for local development
  return 'http://localhost:3000';
}

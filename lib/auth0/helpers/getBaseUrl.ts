/**
 * Dynamic base URL detection for Auth0 SDK
 * Supports dev, preview (Vercel), and production environments
 */
export function getBaseUrl(): string {
  // Use explicit AUTH0_BASE_URL if set (useful for tunnels like ngrok)
  if (process.env.AUTH0_BASE_URL) {
    return process.env.AUTH0_BASE_URL;
  }

  // Fallback for Vercel
  if (process.env.VERCEL_URL) {
    const protocol = process.env.VERCEL_URL.startsWith('localhost') ? 'http' : 'https';
    return `${protocol}://${process.env.VERCEL_URL}`;
  }

  // Default to localhost for local development
  return 'http://localhost:3000';
}

import { getLatestRelease } from '@/lib/github-release';
import { logger } from '@/lib/logger';
import LandingPageClient from './components/landing/LandingPageClient';

// Server Component (default in Next.js 13+ app directory)
export default async function Page() {
  let release = null;

  try {
    // Fetch release data on the server
    // This uses the shared helper with configured caching (5 mins)
    release = await getLatestRelease();
  } catch (error) {
    // Log error but don't crash - render page without release data
    logger.error('Failed to fetch release on server', error);
  }

  // Render the client-side landing page with the pre-fetched data
  return <LandingPageClient initialRelease={release} />;
}

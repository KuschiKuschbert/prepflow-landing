import LandingPageClient from './components/landing/LandingPageClient';

// Server Component (default in Next.js 13+ app directory)
/**
 * Public Landing Page.
 * Renders the Home page version of the LandingPageClient.
 *
 * @returns {JSX.Element} The rendered public home page.
 */
export default function Page() {
  // Render the client-side landing page with the pre-fetched data
  return <LandingPageClient />;
}

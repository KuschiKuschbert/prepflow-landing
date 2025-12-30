import LandingPageClient from './components/landing/LandingPageClient';

// Server Component (default in Next.js 13+ app directory)
export default function Page() {
  // Render the client-side landing page with the pre-fetched data
  return <LandingPageClient />;
}

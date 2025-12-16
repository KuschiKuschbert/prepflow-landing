import { redirect } from 'next/navigation';

/**
 * Redirect /terms to /terms-of-service
 */
export default function TermsRedirect() {
  redirect('/terms-of-service');
}





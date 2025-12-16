import { redirect } from 'next/navigation';

/**
 * Redirect /privacy to /privacy-policy
 */
export default function PrivacyRedirect() {
  redirect('/privacy-policy');
}




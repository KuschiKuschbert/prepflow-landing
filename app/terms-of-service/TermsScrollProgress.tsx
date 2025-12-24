'use client';

import { ScrollProgress } from '@/components/ui/ScrollProgress';

/**
 * Client component wrapper for ScrollProgress.
 * Allows Server Component page to use client-side scroll progress.
 */
export default function TermsScrollProgress() {
  return <ScrollProgress />;
}

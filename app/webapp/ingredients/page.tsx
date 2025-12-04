'use client';

import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { ResponsivePageContainer } from '@/components/ui/ResponsivePageContainer';
import { Suspense } from 'react';
import { PageSkeleton } from '@/components/ui/LoadingSkeleton';
import IngredientsClient from './components/IngredientsClient';

// Force dynamic rendering to prevent SSR hydration issues
export const dynamic = 'force-dynamic';

export default function IngredientsPage() {
  return (
    <ErrorBoundary>
      <ResponsivePageContainer>
        <Suspense fallback={<PageSkeleton />}>
          <IngredientsClient />
        </Suspense>
      </ResponsivePageContainer>
    </ErrorBoundary>
  );
}

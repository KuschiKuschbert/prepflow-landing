'use client';

import dynamic from 'next/dynamic';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { ResponsivePageContainer } from '@/components/ui/ResponsivePageContainer';
import { PageSkeleton } from '@/components/ui/LoadingSkeleton';

// Lazy load PerformanceClient to reduce initial bundle size (uses Recharts)
const PerformanceClient = dynamic(() => import('./components/PerformanceClient'), {
  ssr: false,
  loading: () => <PageSkeleton />,
});

export default function PerformancePage() {
  return (
    <ErrorBoundary>
      <ResponsivePageContainer>
        <div className="tablet:py-6 min-h-screen bg-transparent py-4">
          <PerformanceClient />
        </div>
      </ResponsivePageContainer>
    </ErrorBoundary>
  );
}

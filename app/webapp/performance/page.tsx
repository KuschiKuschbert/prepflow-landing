import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { ResponsivePageContainer } from '@/components/ui/ResponsivePageContainer';
import PerformanceClient from './components/PerformanceClient';

export default function PerformancePage() {
  return (
    <ErrorBoundary>
      <ResponsivePageContainer>
        <div className="min-h-screen bg-transparent py-4 tablet:py-6">
          <PerformanceClient />
        </div>
      </ResponsivePageContainer>
    </ErrorBoundary>
  );
}

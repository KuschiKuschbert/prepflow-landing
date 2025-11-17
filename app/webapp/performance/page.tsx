import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { ResponsivePageContainer } from '@/components/ui/ResponsivePageContainer';
import PerformanceClient from './components/PerformanceClient';

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

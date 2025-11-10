import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import PerformanceClient from './components/PerformanceClient';

export default function PerformancePage() {
  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-transparent p-4 sm:p-6">
        <div className="mx-auto max-w-7xl">
          <PerformanceClient />
        </div>
      </div>
    </ErrorBoundary>
  );
}

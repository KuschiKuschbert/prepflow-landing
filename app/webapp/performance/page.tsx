import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { AdaptiveContainer } from '../components/AdaptiveContainer';
import PerformanceClient from './components/PerformanceClient';

export default function PerformancePage() {
  return (
    <ErrorBoundary>
      <AdaptiveContainer>
        <div className="min-h-screen bg-transparent py-4 sm:py-6">
          <PerformanceClient />
        </div>
      </AdaptiveContainer>
    </ErrorBoundary>
  );
}

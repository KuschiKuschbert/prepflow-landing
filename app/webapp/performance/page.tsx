import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { PageHeader } from '../components/static/PageHeader';
import PerformanceClient from './components/PerformanceClient';

export default function PerformancePage() {
  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-transparent p-4 sm:p-6">
        <div className="mx-auto max-w-7xl">
          {/* Static Header - Renders Instantly */}
          <PageHeader
            title="Performance Analysis"
            subtitle="Analyze your menu performance and profitability"
            icon="📊"
          />

          {/* Dynamic Content - Loads After Initial Render */}
          <PerformanceClient />
        </div>
      </div>
    </ErrorBoundary>
  );
}

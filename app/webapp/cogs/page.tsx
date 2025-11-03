import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { PageHeader } from '../components/static/PageHeader';
import CogsClient from './components/CogsClient';

export default function COGSPage() {
  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-transparent p-4 sm:p-6">
        <div className="mx-auto max-w-7xl">
          {/* Static Header - Renders Instantly */}
          <PageHeader
            title="COGS Calculator"
            subtitle="Calculate Cost of Goods Sold and optimize your profit margins"
            icon="💰"
          />

          {/* Dynamic Content - Loads After Initial Render */}
          <CogsClient />
        </div>
      </div>
    </ErrorBoundary>
  );
}

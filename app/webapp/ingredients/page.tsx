import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { PageHeader } from '../components/static/PageHeader';
import IngredientsClient from './components/IngredientsClient';

export default function IngredientsPage() {
  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-transparent p-4 sm:p-6">
        <div className="mx-auto max-w-7xl">
          {/* Static Header - Renders Instantly */}
          <PageHeader
            title="Ingredients Management"
            subtitle="Manage your kitchen ingredients and inventory"
            icon="🥘"
          />

          {/* Dynamic Content - Loads After Initial Render */}
          <IngredientsClient />
        </div>
      </div>
    </ErrorBoundary>
  );
}

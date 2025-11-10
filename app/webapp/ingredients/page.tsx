import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import IngredientsClient from './components/IngredientsClient';

export default function IngredientsPage() {
  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-transparent p-4 sm:p-6">
        <div className="mx-auto max-w-7xl">
          {/* Page Content */}
          <IngredientsClient />
        </div>
      </div>
    </ErrorBoundary>
  );
}

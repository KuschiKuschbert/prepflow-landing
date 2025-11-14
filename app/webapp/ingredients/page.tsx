import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import IngredientsClient from './components/IngredientsClient';
import { ResponsivePageContainer } from '@/components/ui/ResponsivePageContainer';

export default function IngredientsPage() {
  return (
    <ErrorBoundary>
      <ResponsivePageContainer>
        <div className="min-h-screen bg-transparent py-4 tablet:py-6">
          {/* Page Content */}
          <IngredientsClient />
        </div>
      </ResponsivePageContainer>
    </ErrorBoundary>
  );
}

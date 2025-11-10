import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import IngredientsClient from './components/IngredientsClient';
import { AdaptiveContainer } from '../components/AdaptiveContainer';

export default function IngredientsPage() {
  return (
    <ErrorBoundary>
      <AdaptiveContainer>
        <div className="min-h-screen bg-transparent py-4 sm:py-6">
          {/* Page Content */}
          <IngredientsClient />
        </div>
      </AdaptiveContainer>
    </ErrorBoundary>
  );
}

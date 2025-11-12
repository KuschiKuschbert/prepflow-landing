import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { AdaptiveContainer } from '../components/AdaptiveContainer';
import DishCogsClient from './components/DishCogsClient';

export default function DishCOGSPage() {
  return (
    <ErrorBoundary>
      <AdaptiveContainer>
        <div className="min-h-screen bg-transparent py-4 sm:py-6">
          <DishCogsClient />
        </div>
      </AdaptiveContainer>
    </ErrorBoundary>
  );
}

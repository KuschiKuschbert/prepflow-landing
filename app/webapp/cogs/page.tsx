import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { AdaptiveContainer } from '../components/AdaptiveContainer';
import CogsClient from './components/CogsClient';

export default function COGSPage() {
  return (
    <ErrorBoundary>
      <AdaptiveContainer>
        <div className="min-h-screen bg-transparent py-4 sm:py-6">
          <CogsClient />
        </div>
      </AdaptiveContainer>
    </ErrorBoundary>
  );
}

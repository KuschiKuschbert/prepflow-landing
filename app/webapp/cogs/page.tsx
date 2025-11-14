import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { ResponsivePageContainer } from '@/components/ui/ResponsivePageContainer';
import CogsClient from './components/CogsClient';

export default function COGSPage() {
  return (
    <ErrorBoundary>
      <ResponsivePageContainer>
        <div className="min-h-screen bg-transparent py-4 tablet:py-6">
          <CogsClient />
        </div>
      </ResponsivePageContainer>
    </ErrorBoundary>
  );
}

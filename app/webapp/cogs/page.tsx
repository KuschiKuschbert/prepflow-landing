import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import CogsClient from './components/CogsClient';

export default function COGSPage() {
  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-transparent p-4 sm:p-6">
        <div className="mx-auto max-w-7xl">
          <CogsClient />
        </div>
      </div>
    </ErrorBoundary>
  );
}

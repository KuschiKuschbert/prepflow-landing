'use client';

import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { usePathname } from 'next/navigation';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function WebAppError({ error, reset }: ErrorProps) {
  const pathname = usePathname();

  // Suppress error UI on auth routes
  if (
    pathname &&
    (pathname.startsWith('/api/auth') ||
      pathname.startsWith('/login') ||
      pathname.startsWith('/auth'))
  ) {
    return null;
  }

  return (
    <ErrorBoundary>
      <div className="flex min-h-screen items-center justify-center bg-[var(--background)] p-4">
        <div className="max-w-md rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 text-center">
          <h1 className="mb-4 text-2xl font-bold text-[var(--foreground)]">Something went wrong</h1>
          <p className="mb-6 text-[var(--foreground-muted)]">
            {error.message || 'Something went wrong. Give it another go, chef.'}
          </p>
          <button
            onClick={reset}
            className="rounded-xl bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] px-6 py-3 font-semibold text-[var(--button-active-text)] transition-all duration-200 hover:shadow-lg hover:shadow-[var(--primary)]/20"
          >
            Try again
          </button>
        </div>
      </div>
    </ErrorBoundary>
  );
}

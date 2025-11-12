'use client';

import React from 'react';
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
      <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a] p-4">
        <div className="max-w-md rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f] p-6 text-center">
          <h1 className="mb-4 text-2xl font-bold text-white">Something went wrong</h1>
          <p className="mb-6 text-gray-400">
            {error.message || 'An unexpected error occurred. Please try again.'}
          </p>
          <button
            onClick={reset}
            className="rounded-xl bg-gradient-to-r from-[#29E7CD] to-[#D925C7] px-6 py-3 font-semibold text-white transition-all duration-200 hover:shadow-lg hover:shadow-[#29E7CD]/20"
          >
            Try again
          </button>
        </div>
      </div>
    </ErrorBoundary>
  );
}

'use client';

import { Component, ReactNode } from 'react';
import ErrorBoundary from '@/components/ui/ErrorBoundary';

interface NavigationErrorBoundaryProps {
  children: ReactNode;
}

/**
 * Error boundary wrapper for navigation components.
 * Catches errors in navigation components and displays a user-friendly fallback.
 *
 * @component
 * @param {Object} props - Component props
 * @param {ReactNode} props.children - Navigation components to wrap
 * @returns {JSX.Element} Error boundary wrapper
 */
export function NavigationErrorBoundary({ children }: NavigationErrorBoundaryProps) {
  return (
    <ErrorBoundary
      fallback={
        <div className="flex items-center justify-center p-4 text-gray-400">
          <div className="text-center">
            <p className="mb-2 text-sm">Navigation error. Please refresh the page.</p>
            <button
              onClick={() => window.location.reload()}
              className="rounded-lg bg-[#29E7CD]/10 px-4 py-2 text-sm text-[#29E7CD] transition-colors hover:bg-[#29E7CD]/20 focus:ring-2 focus:ring-[#29E7CD] focus:ring-offset-2 focus:ring-offset-[#1f1f1f] focus:outline-none"
            >
              Refresh Page
            </button>
          </div>
        </div>
      }
    >
      {children}
    </ErrorBoundary>
  );
}

'use client';

import { ApiError } from '@/lib/api-error-handler';
import React from 'react';

interface ApiErrorDisplayProps {
  error: ApiError;
  context?: string;
  onRetry?: () => void;
  className?: string;
}

export const ApiErrorDisplay: React.FC<ApiErrorDisplayProps> = ({
  error,
  context,
  onRetry,
  className = '',
}) => {
  const getErrorIcon = (code?: string) => {
    switch (code) {
      case 'NETWORK_ERROR':
        return (
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0"
            />
          </svg>
        );
      case 'SERVER_ERROR':
        return (
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        );
      case 'NOT_FOUND':
        return (
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.467-.881-6.08-2.33"
            />
          </svg>
        );
      default:
        return (
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        );
    }
  };

  const getErrorColor = (code?: string) => {
    switch (code) {
      case 'NETWORK_ERROR':
        return 'from-orange-500 to-orange-600';
      case 'SERVER_ERROR':
        return 'from-red-500 to-red-600';
      case 'NOT_FOUND':
        return 'from-blue-500 to-blue-600';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  return (
    <div
      className={`mx-auto max-w-md rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-lg ${className}`}
    >
      <div className="mb-4 flex items-center justify-center">
        <div
          className={`h-12 w-12 rounded-full bg-gradient-to-r ${getErrorColor(error.code)} flex items-center justify-center`}
        >
          <div className="text-[var(--button-active-text)]">{getErrorIcon(error.code)}</div>
        </div>
      </div>

      <h2 className="text-fluid-xl mb-2 text-center font-semibold text-[var(--foreground)]">
        {context ? `${context} Error` : 'API Error'}
      </h2>

      <p className="mb-4 text-center text-[var(--foreground-muted)]">{error.message}</p>

      {error.code && (
        <div className="mb-4 text-center">
          <span className="text-fluid-sm inline-block rounded-full bg-[var(--muted)] px-3 py-1 text-[var(--foreground-muted)]">
            Error Code: {error.code}
          </span>
        </div>
      )}

      {onRetry && (
        <div className="flex justify-center">
          <button
            onClick={onRetry}
            className="rounded-2xl bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] px-6 py-2 font-medium text-[var(--button-active-text)] transition-all duration-200 hover:shadow-xl"
          >
            Try Again
          </button>
        </div>
      )}

      {process.env.NODE_ENV === 'development' && !!error.details && (
        <details className="mt-4 rounded-xl bg-[var(--muted)] p-3">
          <summary className="cursor-pointer text-[var(--foreground-muted)]">Error Details</summary>
          <pre className="text-fluid-xs mt-2 overflow-auto text-[var(--color-error)]">
            {JSON.stringify(error.details, null, 2)}
          </pre>
        </details>
      )}
    </div>
  );
};

export default ApiErrorDisplay;

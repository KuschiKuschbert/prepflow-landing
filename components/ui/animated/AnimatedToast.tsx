/**
 * Animated Notification Toast
 *
 * @deprecated This component is deprecated. Use NotificationContext (useNotification hook) instead.
 * This component is kept only for AnimationShowcase demo purposes.
 * For production use, use: const { showSuccess, showError } = useNotification();
 */

'use client';

import React from 'react';
import { AnimatedDiv } from '../../../lib/animation-stubs';

interface AnimatedToastProps {
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  isVisible: boolean;
  onClose: () => void;
}

/**
 * @deprecated Use NotificationContext (useNotification hook) instead
 */
export function AnimatedToast({
  message,
  type = 'success',
  isVisible,
  onClose,
}: AnimatedToastProps) {
  const typeClasses = {
    success: 'bg-green-900/20 border-[var(--color-success)] text-[var(--color-success)]',
    error: 'bg-red-900/20 border-[var(--color-error)] text-[var(--color-error)]',
    warning: 'bg-yellow-900/20 border-[var(--color-warning)] text-[var(--color-warning)]',
    info: 'bg-blue-900/20 border-[var(--color-info)] text-[var(--color-info)]',
  };

  const icons = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ',
  };

  if (!isVisible) return null;

  return (
    <AnimatedDiv
      animation="slideInRight"
      className={`fixed top-4 right-4 z-50 w-full max-w-sm ${typeClasses[type]} rounded-xl border p-4 shadow-lg backdrop-blur-sm`}
    >
      <div className="flex items-center space-x-3">
        <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center">
          <span className="text-fluid-lg">{icons[type]}</span>
        </div>
        <div className="flex-1">
          <p className="text-fluid-sm font-medium">{message}</p>
        </div>
        <button
          onClick={onClose}
          className="flex-shrink-0 text-[var(--foreground-muted)] transition-colors hover:text-[var(--foreground)]"
        >
          <span className="sr-only">Close</span>
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </AnimatedDiv>
  );
}

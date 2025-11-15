/**
 * Animated Notification Toast
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

export function AnimatedToast({
  message,
  type = 'success',
  isVisible,
  onClose,
}: AnimatedToastProps) {
  const typeClasses = {
    success: 'bg-green-900/20 border-green-500 text-green-400',
    error: 'bg-red-900/20 border-red-500 text-red-400',
    warning: 'bg-yellow-900/20 border-yellow-500 text-yellow-400',
    info: 'bg-blue-900/20 border-blue-500 text-blue-400',
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
          className="flex-shrink-0 text-gray-400 transition-colors hover:text-white"
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

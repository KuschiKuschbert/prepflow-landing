'use client';

import React from 'react';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  variant?: 'danger' | 'warning' | 'info';
}

export function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
  variant = 'warning',
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  const variantStyles = {
    danger: {
      confirm: 'bg-red-500 hover:bg-red-600 text-white',
      icon: 'text-red-400',
    },
    warning: {
      confirm: 'bg-yellow-500 hover:bg-yellow-600 text-black',
      icon: 'text-yellow-400',
    },
    info: {
      confirm: 'bg-[#29E7CD] hover:bg-[#29E7CD]/80 text-black',
      icon: 'text-[#29E7CD]',
    },
  };

  const styles = variantStyles[variant];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onCancel}
        aria-hidden="true"
      />

      {/* Dialog */}
      <div
        className="relative z-50 mx-4 w-full max-w-md rounded-3xl border border-[#2a2a2a] bg-[#1f1f1f] p-6 shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
        aria-describedby="dialog-description"
      >
        {/* Icon */}
        <div className="mb-4 flex justify-center">
          {variant === 'danger' && (
            <svg
              className={`h-12 w-12 ${styles.icon}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          )}
          {variant === 'warning' && (
            <svg
              className={`h-12 w-12 ${styles.icon}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          )}
          {variant === 'info' && (
            <svg
              className={`h-12 w-12 ${styles.icon}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          )}
        </div>

        {/* Title */}
        <h2 id="dialog-title" className="mb-3 text-center text-fluid-xl font-bold text-white">
          {title}
        </h2>

        {/* Message */}
        <p id="dialog-description" className="mb-6 text-center text-gray-300">
          {message}
        </p>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 rounded-2xl border border-[#2a2a2a] bg-[#2a2a2a]/40 px-4 py-3 font-semibold text-gray-300 transition-all duration-200 hover:bg-[#2a2a2a]/60"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 rounded-2xl px-4 py-3 font-semibold transition-all duration-200 ${styles.confirm}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

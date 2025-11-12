'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Icon } from './Icon';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

interface InputDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  placeholder?: string;
  defaultValue?: string;
  type?: 'text' | 'number';
  min?: number;
  max?: number;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: (value: string) => void;
  onCancel: () => void;
  variant?: 'info' | 'warning';
  validation?: (value: string) => string | null; // Returns error message or null
}

export function InputDialog({
  isOpen,
  title,
  message,
  placeholder = '',
  defaultValue = '',
  type = 'text',
  min,
  max,
  confirmLabel = 'OK',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
  variant = 'info',
  validation,
}: InputDialogProps) {
  const [value, setValue] = useState(defaultValue);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setValue(defaultValue);
      setError(null);
      // Focus input when dialog opens
      setTimeout(() => {
        inputRef.current?.focus();
        inputRef.current?.select();
      }, 100);
    }
  }, [isOpen, defaultValue]);

  const handleConfirm = () => {
    if (validation) {
      const validationError = validation(value);
      if (validationError) {
        setError(validationError);
        return;
      }
    }

    // Additional type-specific validation
    if (type === 'number') {
      const numValue = parseFloat(value);
      if (isNaN(numValue)) {
        setError('Please enter a valid number');
        return;
      }
      if (min !== undefined && numValue < min) {
        setError(`Value must be at least ${min}`);
        return;
      }
      if (max !== undefined && numValue > max) {
        setError(`Value must be at most ${max}`);
        return;
      }
    }

    if (!value.trim()) {
      setError('This field is required');
      return;
    }

    onConfirm(value.trim());
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleConfirm();
    } else if (e.key === 'Escape') {
      onCancel();
    }
  };

  if (!isOpen) return null;

  const variantStyles = {
    info: {
      icon: 'text-[#29E7CD]',
      confirm: 'bg-gradient-to-r from-[#29E7CD] to-[#D925C7] hover:from-[#29E7CD]/80 hover:to-[#D925C7]/80',
    },
    warning: {
      icon: 'text-yellow-400',
      confirm: 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-500/80 hover:to-orange-500/80',
    },
  };

  const styles = variantStyles[variant];

  return (
    <div className="fixed inset-0 z-[65] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onCancel}
        aria-hidden="true"
      />

      {/* Dialog */}
      <div
        className="relative z-[65] w-full max-w-md rounded-3xl border border-[#2a2a2a] bg-[#1f1f1f] p-6 shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
        aria-describedby="dialog-description"
        onKeyDown={handleKeyDown}
      >
        {/* Icon */}
        <div className="mb-4 flex justify-center">
          <Icon
            icon={variant === 'warning' ? AlertCircle : CheckCircle2}
            size="lg"
            className={styles.icon}
            aria-hidden="true"
          />
        </div>

        {/* Title */}
        <h2 id="dialog-title" className="mb-2 text-center text-xl font-bold text-white">
          {title}
        </h2>

        {/* Message */}
        <p id="dialog-description" className="mb-4 text-center text-sm text-gray-300">
          {message}
        </p>

        {/* Input */}
        <div className="mb-4">
          <input
            ref={inputRef}
            type={type}
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              setError(null); // Clear error on input change
            }}
            placeholder={placeholder}
            min={min}
            max={max}
            className={`w-full rounded-2xl border ${
              error ? 'border-red-500' : 'border-[#2a2a2a]'
            } bg-[#0a0a0a] px-4 py-3 text-white placeholder-gray-500 transition-all duration-200 focus:border-[#29E7CD] focus:outline-none focus:ring-2 focus:ring-[#29E7CD]/20`}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={error ? 'error-message' : undefined}
          />
          {error && (
            <p id="error-message" className="mt-2 text-sm text-red-400" role="alert">
              {error}
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 rounded-2xl border border-[#2a2a2a] bg-[#2a2a2a]/40 px-4 py-3 font-semibold text-gray-300 transition-all duration-200 hover:bg-[#2a2a2a]/60"
          >
            {cancelLabel}
          </button>
          <button
            onClick={handleConfirm}
            className={`flex-1 rounded-2xl px-4 py-3 font-semibold text-white transition-all duration-200 ${styles.confirm}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

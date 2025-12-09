'use client';

import { AlertCircle, CheckCircle2 } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { Icon } from './Icon';

/**
 * Input dialog component with Cyber Carrot Design System styling.
 *
 * @component
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Whether the dialog is open
 * @param {string} props.title - Dialog title
 * @param {string} props.message - Dialog message
 * @param {string} [props.placeholder=''] - Input placeholder text
 * @param {string} [props.defaultValue=''] - Default input value
 * @param {'text' | 'number'} [props.type='text'] - Input type
 * @param {number} [props.min] - Minimum value (for number type)
 * @param {number} [props.max] - Maximum value (for number type)
 * @param {string} [props.confirmLabel='OK'] - Confirm button label
 * @param {string} [props.cancelLabel='Cancel'] - Cancel button label
 * @param {Function} props.onConfirm - Callback when confirmed (receives input value)
 * @param {Function} props.onCancel - Callback when cancelled
 * @param {'info' | 'warning'} [props.variant='info'] - Dialog variant
 * @param {Function} [props.validation] - Validation function (returns error message or null)
 * @returns {JSX.Element | null} Rendered dialog or null if not open
 *
 * @example
 * ```tsx
 * <InputDialog
 *   isOpen={showDialog}
 *   title="Enter Recipe Name"
 *   message="What should we call this recipe?"
 *   placeholder="Recipe name"
 *   type="text"
 *   onConfirm={(value) => handleSave(value)}
 *   onCancel={() => setShowDialog(false)}
 * />
 * ```
 */
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
  const dialogRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const cancelButtonRef = useRef<HTMLButtonElement>(null);
  const confirmButtonRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  // Focus trap and keyboard handling
  useEffect(() => {
    if (isOpen && dialogRef.current) {
      // Store trigger element (the element that opened the dialog)
      triggerRef.current = document.activeElement as HTMLElement;

      // Get all focusable elements within the dialog
      const getFocusableElements = (): HTMLElement[] => {
        if (!dialogRef.current) return [];
        return Array.from(
          dialogRef.current.querySelectorAll(
            'button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])',
          ),
        ) as HTMLElement[];
      };

      const focusableElements = getFocusableElements();
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      // Focus input when dialog opens
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
          inputRef.current.select();
        } else if (firstElement) {
          firstElement.focus();
        }
      }, 100);

      // Handle Tab key to trap focus
      const handleTab = (e: KeyboardEvent) => {
        if (e.key !== 'Tab') return;

        if (focusableElements.length === 0) {
          e.preventDefault();
          return;
        }

        if (e.shiftKey) {
          // Shift + Tab (backwards)
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement?.focus();
          }
        } else {
          // Tab (forwards)
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement?.focus();
          }
        }
      };

      // Handle Escape key
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onCancel();
        }
      };

      document.addEventListener('keydown', handleTab);
      document.addEventListener('keydown', handleEscape);

      return () => {
        document.removeEventListener('keydown', handleTab);
        document.removeEventListener('keydown', handleEscape);
        // Return focus to trigger element when dialog closes
        if (triggerRef.current && typeof triggerRef.current.focus === 'function') {
          triggerRef.current.focus();
        }
      };
    }
  }, [isOpen, onCancel]);

  useEffect(() => {
    if (isOpen) {
      setValue(defaultValue);
      setError(null);
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
    }
    // Escape is handled by the useEffect focus trap
  };

  if (!isOpen) return null;

  const variantStyles = {
    info: {
      icon: 'text-[#29E7CD]',
      confirm:
        'bg-gradient-to-r from-[#29E7CD] via-[#FF6B00] to-[#D925C7] hover:from-[#29E7CD]/80 hover:via-[#FF6B00]/80 hover:to-[#D925C7]/80 hover:shadow-[#FF6B00]/25',
    },
    warning: {
      icon: 'text-yellow-400',
      confirm:
        'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-500/80 hover:to-orange-500/80',
    },
  };

  const styles = variantStyles[variant];

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onCancel}
        aria-hidden={true}
      />

      {/* Dialog with gradient border */}
      <div className="relative z-50 w-full max-w-md rounded-3xl bg-gradient-to-r from-[#29E7CD]/20 via-[#D925C7]/20 via-[#FF6B00]/20 to-[#29E7CD]/20 p-[1px] shadow-2xl">
        <div
          ref={dialogRef}
          className="desktop:p-6 rounded-3xl bg-[#1f1f1f]/95 p-4"
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
              aria-hidden={true}
            />
          </div>

          {/* Title */}
          <h2 id="dialog-title" className="text-fluid-xl mb-2 text-center font-bold text-white">
            {title}
          </h2>

          {/* Message */}
          <p id="dialog-description" className="text-fluid-sm mb-4 text-center text-gray-300">
            {message}
          </p>

          {/* Input */}
          <div className="mb-4">
            <input
              ref={inputRef}
              type={type}
              value={value}
              onChange={e => {
                setValue(e.target.value);
                setError(null); // Clear error on input change
              }}
              placeholder={placeholder}
              min={min}
              max={max}
              className={`w-full rounded-2xl border ${
                error ? 'border-red-500' : 'border-[#2a2a2a]'
              } bg-[#0a0a0a] px-4 py-3 text-white placeholder-gray-500 transition-all duration-200 focus:border-[#29E7CD] focus:ring-2 focus:ring-[#29E7CD]/20 focus:outline-none`}
              aria-invalid={error ? 'true' : 'false'}
              aria-describedby={error ? 'error-message' : undefined}
            />
            {error && (
              <p id="error-message" className="text-fluid-sm mt-2 text-red-400" role="alert">
                {error}
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              ref={cancelButtonRef}
              onClick={onCancel}
              className="flex-1 rounded-2xl border border-[#2a2a2a] bg-[#2a2a2a]/40 px-4 py-3 font-semibold text-gray-300 transition-all duration-200 hover:bg-[#2a2a2a]/60 focus:ring-2 focus:ring-[#29E7CD] focus:ring-offset-2 focus:ring-offset-[#1f1f1f] focus:outline-none"
            >
              {cancelLabel}
            </button>
            <button
              ref={confirmButtonRef}
              onClick={handleConfirm}
              className={`flex-1 rounded-2xl px-4 py-3 font-semibold text-white transition-all duration-200 focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#1f1f1f] focus:outline-none ${styles.confirm}`}
            >
              {confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

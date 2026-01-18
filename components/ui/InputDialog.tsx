'use client';

import { AlertCircle, CheckCircle2 } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { Icon } from './Icon';
import { setupInputDialogFocusTrap } from './InputDialog/helpers/focusTrap';
import { validateInput } from './InputDialog/helpers/validation';

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
  const _triggerRef = useRef<HTMLElement | null>(null);

  // Focus trap and keyboard handling
  useEffect(() => {
    if (isOpen && dialogRef.current) {
      return setupInputDialogFocusTrap(dialogRef, inputRef, onCancel);
    }
  }, [isOpen, onCancel]);

  useEffect(() => {
    if (isOpen) {
      setValue(defaultValue);
      setError(null);
    }
  }, [isOpen, defaultValue]);

  const handleConfirm = () => {
    const validationError = validateInput(value, type, min, max, validation);
    if (validationError) {
      setError(validationError);
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
      icon: 'text-[var(--primary)]',
      confirm:
        'bg-gradient-to-r from-[var(--primary)] via-[var(--tertiary)] to-[var(--accent)] hover:from-[var(--primary)]/80 hover:via-[var(--tertiary)]/80 hover:to-[var(--accent)]/80 hover:shadow-[var(--tertiary)]/25',
    },
    warning: {
      icon: 'text-[var(--color-warning)]',
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
      <div className="relative z-50 w-full max-w-md rounded-3xl bg-gradient-to-r from-[var(--primary)]/20 via-[var(--accent)]/20 via-[var(--tertiary)]/20 to-[var(--primary)]/20 p-[1px] shadow-2xl">
        <div
          ref={dialogRef}
          className="desktop:p-6 rounded-3xl bg-[var(--surface)]/95 p-4"
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
          <h2
            id="dialog-title"
            className="text-fluid-xl mb-2 text-center font-bold text-[var(--foreground)]"
          >
            {title}
          </h2>

          {/* Message */}
          <p
            id="dialog-description"
            className="text-fluid-sm mb-4 text-center text-[var(--foreground)]/70"
          >
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
                error ? 'border-[var(--color-error)]' : 'border-[var(--border)]'
              } bg-[var(--background)] px-4 py-3 text-[var(--foreground)] placeholder-[var(--foreground)]/50 transition-all duration-200 focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 focus:outline-none`}
              aria-invalid={error ? 'true' : 'false'}
              aria-describedby={error ? 'error-message' : undefined}
            />
            {error && (
              <p
                id="error-message"
                className="text-fluid-sm mt-2 text-[var(--color-error)]"
                role="alert"
              >
                {error}
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              ref={cancelButtonRef}
              onClick={onCancel}
              className="flex-1 rounded-2xl border border-[var(--border)] bg-[var(--muted)]/40 px-4 py-3 font-semibold text-[var(--foreground)]/70 transition-all duration-200 hover:bg-[var(--muted)]/60 focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-2 focus:ring-offset-[var(--surface)] focus:outline-none"
            >
              {cancelLabel}
            </button>
            <button
              ref={confirmButtonRef}
              onClick={handleConfirm}
              className={`flex-1 rounded-2xl px-4 py-3 font-semibold text-[var(--foreground)] transition-all duration-200 focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--surface)] focus:outline-none ${styles.confirm}`}
            >
              {confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

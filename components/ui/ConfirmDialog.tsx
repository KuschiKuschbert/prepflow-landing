'use client';

import { AlertCircle, AlertTriangle, Info } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { Icon } from './Icon';

/**
 * Confirmation dialog component with Cyber Carrot Design System styling.
 *
 * @component
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Whether the dialog is open
 * @param {string} props.title - Dialog title
 * @param {string} props.message - Dialog message
 * @param {string} [props.confirmLabel='Confirm'] - Confirm button label
 * @param {string} [props.cancelLabel='Cancel'] - Cancel button label
 * @param {Function} props.onConfirm - Callback when confirmed
 * @param {Function} props.onCancel - Callback when cancelled
 * @param {'danger' | 'warning' | 'info'} [props.variant='warning'] - Dialog variant
 * @returns {JSX.Element | null} Rendered dialog or null if not open
 *
 * @example
 * ```tsx
 * <ConfirmDialog
 *   isOpen={showDialog}
 *   title="Delete Ingredient"
 *   message="Are you sure? This can't be undone."
 *   variant="danger"
 *   confirmLabel="Delete"
 *   cancelLabel="Cancel"
 *   onConfirm={handleDelete}
 *   onCancel={() => setShowDialog(false)}
 * />
 * ```
 */
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
  const dialogRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const cancelButtonRef = useRef<HTMLButtonElement>(null);
  const confirmButtonRef = useRef<HTMLButtonElement>(null);

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
            'button:not([disabled]), [tabindex]:not([tabindex="-1"])',
          ),
        ) as HTMLElement[];
      };

      const focusableElements = getFocusableElements();
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      // Focus first element (cancel button)
      if (cancelButtonRef.current) {
        cancelButtonRef.current.focus();
      } else if (firstElement) {
        firstElement.focus();
      }

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

  if (!isOpen) return null;

  const variantStyles = {
    danger: {
      confirm:
        'bg-[var(--color-error)] hover:bg-[var(--color-error)]/80 text-[var(--button-active-text)]',
      icon: 'text-[var(--color-error)]',
    },
    warning: {
      confirm:
        'bg-[var(--color-warning)] hover:bg-[var(--color-warning)]/80 text-[var(--button-active-text)]',
      icon: 'text-[var(--color-warning)]',
    },
    info: {
      confirm: 'bg-[var(--primary)] hover:bg-[var(--primary)]/80 text-[var(--button-active-text)]',
      icon: 'text-[var(--primary)]',
    },
  };

  const styles = variantStyles[variant];

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onCancel}
        aria-hidden={true}
      />

      {/* Dialog with gradient border */}
      <div className="relative z-50 mx-4 w-full max-w-md rounded-3xl bg-gradient-to-r from-[var(--primary)]/20 via-[var(--accent)]/20 via-[var(--tertiary)]/20 to-[var(--primary)]/20 p-[1px] shadow-2xl">
        <div
          ref={dialogRef}
          className="desktop:p-6 rounded-3xl bg-[var(--surface)]/95 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="dialog-title"
          aria-describedby="dialog-description"
        >
          {/* Icon */}
          <div className="mb-4 flex justify-center">
            {variant === 'danger' && (
              <Icon icon={AlertTriangle} size="xl" className={styles.icon} aria-hidden={true} />
            )}
            {variant === 'warning' && (
              <Icon icon={AlertCircle} size="xl" className={styles.icon} aria-hidden={true} />
            )}
            {variant === 'info' && (
              <Icon icon={Info} size="xl" className={styles.icon} aria-hidden={true} />
            )}
          </div>

          {/* Title */}
          <h2
            id="dialog-title"
            className="text-fluid-xl mb-3 text-center font-bold text-[var(--foreground)]"
          >
            {title}
          </h2>

          {/* Message */}
          <p id="dialog-description" className="mb-6 text-center text-[var(--foreground-muted)]">
            {message}
          </p>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              ref={cancelButtonRef}
              onClick={onCancel}
              className="flex-1 rounded-2xl border border-[var(--border)] bg-[var(--muted)]/40 px-4 py-3 font-semibold text-[var(--foreground-muted)] transition-all duration-200 hover:bg-[var(--muted)]/60 focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-2 focus:ring-offset-[var(--surface)] focus:outline-none"
            >
              {cancelLabel}
            </button>
            <button
              ref={confirmButtonRef}
              onClick={onConfirm}
              className={`flex-1 rounded-2xl px-4 py-3 font-semibold transition-all duration-200 focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--surface)] focus:outline-none ${styles.confirm}`}
            >
              {confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

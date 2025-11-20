'use client';

import { useState, useCallback } from 'react';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';

interface AlertOptions {
  title: string;
  message: string;
  variant?: 'danger' | 'warning' | 'info';
  confirmLabel?: string;
}

/**
 * Hook for showing alert dialogs with a promise-based API.
 *
 * Provides an easy way to show alert/info dialogs without managing dialog state manually.
 * Returns a promise that resolves when the user clicks OK.
 *
 * @returns {Object} Hook return value
 * @returns {Function} returns.showAlert - Function to show alert dialog
 * @returns {JSX.Element} returns.AlertDialog - Dialog component to render
 *
 * @example
 * ```typescript
 * const { showAlert, AlertDialog } = useAlert();
 *
 * const handleSuccess = async () => {
 *   await showAlert({
 *     title: 'Success!',
 *     message: 'All ingredients saved successfully.',
 *     variant: 'info'
 *   });
 * };
 *
 * return (
 *   <>
 *     <button onClick={handleSuccess}>Save</button>
 *     <AlertDialog />
 *   </>
 * );
 * ```
 */
export function useAlert() {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<AlertOptions | null>(null);
  const [resolvePromise, setResolvePromise] = useState<((value: void) => void) | null>(null);

  const showAlert = useCallback((alertOptions: AlertOptions): Promise<void> => {
    return new Promise(resolve => {
      setOptions(alertOptions);
      setIsOpen(true);
      setResolvePromise(() => resolve);
    });
  }, []);

  const handleConfirm = useCallback(() => {
    setIsOpen(false);
    if (resolvePromise) {
      resolvePromise();
      setResolvePromise(null);
    }
    // Clear options after a short delay to allow dialog to close
    setTimeout(() => setOptions(null), 200);
  }, [resolvePromise]);

  const AlertDialogComponent = () => {
    if (!options) return null;
    return (
      <ConfirmDialog
        isOpen={isOpen}
        title={options.title}
        message={options.message}
        variant={options.variant || 'info'}
        confirmLabel={options.confirmLabel || 'OK'}
        cancelLabel=""
        onConfirm={handleConfirm}
        onCancel={handleConfirm}
      />
    );
  };

  return {
    showAlert,
    AlertDialog: AlertDialogComponent,
  };
}

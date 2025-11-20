'use client';

import { useState, useCallback } from 'react';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';

interface ConfirmOptions {
  title: string;
  message: string;
  variant?: 'danger' | 'warning' | 'info';
  confirmLabel?: string;
  cancelLabel?: string;
}

/**
 * Hook for showing confirmation dialogs with a promise-based API.
 *
 * Provides an easy way to show confirmation dialogs without managing dialog state manually.
 * Returns a promise that resolves to true if confirmed, false if cancelled.
 *
 * @returns {Object} Hook return value
 * @returns {Function} returns.showConfirm - Function to show confirmation dialog
 * @returns {JSX.Element} returns.ConfirmDialog - Dialog component to render
 *
 * @example
 * ```typescript
 * const { showConfirm, ConfirmDialog } = useConfirm();
 *
 * const handleDelete = async () => {
 *   const confirmed = await showConfirm({
 *     title: 'Delete Ingredient',
 *     message: 'Are you sure? This can\'t be undone.',
 *     variant: 'danger',
 *     confirmLabel: 'Delete',
 *     cancelLabel: 'Cancel'
 *   });
 *
 *   if (confirmed) {
 *     // User confirmed, proceed with deletion
 *   }
 * };
 *
 * return (
 *   <>
 *     <button onClick={handleDelete}>Delete</button>
 *     <ConfirmDialog />
 *   </>
 * );
 * ```
 */
export function useConfirm() {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<ConfirmOptions | null>(null);
  const [resolvePromise, setResolvePromise] = useState<((value: boolean) => void) | null>(null);

  const showConfirm = useCallback((confirmOptions: ConfirmOptions): Promise<boolean> => {
    return new Promise(resolve => {
      setOptions(confirmOptions);
      setIsOpen(true);
      setResolvePromise(() => resolve);
    });
  }, []);

  const handleConfirm = useCallback(() => {
    setIsOpen(false);
    if (resolvePromise) {
      resolvePromise(true);
      setResolvePromise(null);
    }
    // Clear options after a short delay to allow dialog to close
    setTimeout(() => setOptions(null), 200);
  }, [resolvePromise]);

  const handleCancel = useCallback(() => {
    setIsOpen(false);
    if (resolvePromise) {
      resolvePromise(false);
      setResolvePromise(null);
    }
    // Clear options after a short delay to allow dialog to close
    setTimeout(() => setOptions(null), 200);
  }, [resolvePromise]);

  const ConfirmDialogComponent = () => {
    if (!options) return null;
    return (
      <ConfirmDialog
        isOpen={isOpen}
        title={options.title}
        message={options.message}
        variant={options.variant || 'warning'}
        confirmLabel={options.confirmLabel || 'Confirm'}
        cancelLabel={options.cancelLabel || 'Cancel'}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    );
  };

  return {
    showConfirm,
    ConfirmDialog: ConfirmDialogComponent,
  };
}

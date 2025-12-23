'use client';

import { useState, useCallback } from 'react';
import { InputDialog } from '@/components/ui/InputDialog';

interface PromptOptions {
  title: string;
  message: string;
  placeholder?: string;
  defaultValue?: string;
  type?: 'text' | 'number';
  min?: number;
  max?: number;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'info' | 'warning';
  validation?: (value: string) => string | null;
}

/**
 * Hook for showing input dialogs with a promise-based API.
 *
 * Provides an easy way to show input dialogs without managing dialog state manually.
 * Returns a promise that resolves to the input value (string) if confirmed, null if cancelled.
 *
 * @returns {Object} Hook return value
 * @returns {Function} returns.showPrompt - Function to show input dialog
 * @returns {JSX.Element} returns.InputDialog - Dialog component to render
 *
 * @example
 * ```typescript
 * const { showPrompt, InputDialog } = usePrompt();
 *
 * const handleSaveRecipe = async () => {
 *   const recipeName = await showPrompt({
 *     title: 'Save Recipe',
 *     message: 'What should we call this recipe?',
 *     placeholder: 'Recipe name',
 *     type: 'text',
 *     validation: (v) => v.length > 0 ? null : 'Recipe name is required'
 *   });
 *
 *   if (recipeName) {
 *     // User entered a name, proceed with save
 *   }
 * };
 *
 * return (
 *   <>
 *     <button onClick={handleSaveRecipe}>Save</button>
 *     <InputDialog />
 *   </>
 * );
 * ```
 */
export function usePrompt() {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<PromptOptions | null>(null);
  const [resolvePromise, setResolvePromise] = useState<((value: string | null) => void) | null>(
    null,
  );

  const showPrompt = useCallback((promptOptions: PromptOptions): Promise<string | null> => {
    return new Promise(resolve => {
      setOptions(promptOptions);
      setIsOpen(true);
      setResolvePromise(() => resolve);
    });
  }, []);

  const handleConfirm = useCallback(
    (value: string) => {
      setIsOpen(false);
      if (resolvePromise) {
        resolvePromise(value);
        setResolvePromise(null);
      }
      // Clear options after a short delay to allow dialog to close
      setTimeout(() => setOptions(null), 200);
    },
    [resolvePromise],
  );

  const handleCancel = useCallback(() => {
    setIsOpen(false);
    if (resolvePromise) {
      resolvePromise(null);
      setResolvePromise(null);
    }
    // Clear options after a short delay to allow dialog to close
    setTimeout(() => setOptions(null), 200);
  }, [resolvePromise]);

  const InputDialogComponent = () => {
    if (!options) return null;
    return (
      <InputDialog
        isOpen={isOpen}
        title={options.title}
        message={options.message}
        placeholder={options.placeholder}
        defaultValue={options.defaultValue}
        type={options.type || 'text'}
        min={options.min}
        max={options.max}
        confirmLabel={options.confirmLabel || 'OK'}
        cancelLabel={options.cancelLabel || 'Cancel'}
        variant={options.variant || 'info'}
        validation={options.validation}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    );
  };

  return { showPrompt, InputDialog: InputDialogComponent };
}

import { logger } from '../logger';

/**
 * Generic optimistic delete operation with revert capability.
 *
 * @template T - Type of item being deleted
 * @param {T[]} currentItems - Current array of items
 * @param {string} itemId - ID of item to delete
 * @param {Function} deleteFn - Async function to perform the delete operation
 * @param {Function} setItems - State setter function
 * @param {Function} onSuccess - Optional success callback
 * @param {Function} onError - Optional error callback
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await createOptimisticDelete(
 *   ingredients,
 *   ingredientId,
 *   () => fetch(`/api/ingredients/${ingredientId}`, { method: 'DELETE' }),
 *   setIngredients,
 *   () => showSuccess('Ingredient deleted'),
 *   (error) => showError(error)
 * );
 * ```
 */
export async function createOptimisticDelete<T extends { id: string }>(
  currentItems: T[],
  itemId: string,
  deleteFn: () => Promise<Response>,
  setItems: (items: T[] | ((prev: T[]) => T[])) => void,
  onSuccess?: () => void,
  onError?: (error: string) => void,
): Promise<void> {
  // Store original state for rollback
  const originalItems = [...currentItems];
  const itemToDelete = currentItems.find(item => item.id === itemId);

  if (!itemToDelete) {
    onError?.('Item not found');
    return;
  }

  // Optimistically remove from UI immediately
  setItems(prevItems => prevItems.filter(item => item.id !== itemId));

  try {
    const response = await deleteFn();
    const result = await response.json();

    if (response.ok) {
      onSuccess?.();
    } else {
      // Revert optimistic update on error
      setItems(originalItems);
      const errorMsg = result.error || result.message || 'Operation failed';
      onError?.(errorMsg);
    }
  } catch (err) {
    // Revert optimistic update on error
    setItems(originalItems);
    const errorMsg = err instanceof Error ? err.message : 'Operation failed';
    logger.error('Optimistic delete failed:', err);
    onError?.(errorMsg);
  }
}

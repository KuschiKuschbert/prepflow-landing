import { logger } from '../logger';
import { logger } from '@/lib/logger';

/**
 * Generic optimistic update operation with revert capability.
 *
 * @template T - Type of item being updated
 * @param {T[]} currentItems - Current array of items
 * @param {string} itemId - ID of item to update
 * @param {Partial<T>} updates - Partial updates to apply
 * @param {Function} updateFn - Async function to perform the update operation
 * @param {Function} setItems - State setter function
 * @param {Function} onSuccess - Optional success callback
 * @param {Function} onError - Optional error callback
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await createOptimisticUpdate(
 *   ingredients,
 *   ingredientId,
 *   { cost_per_unit: 5.50 },
 *   () => fetch(`/api/ingredients/${ingredientId}`, {
 *     method: 'PUT',
 *     body: JSON.stringify({ cost_per_unit: 5.50 })
 *   }),
 *   setIngredients,
 *   () => showSuccess('Ingredient updated'),
 *   (error) => showError(error)
 * );
 * ```
 */
export async function createOptimisticUpdate<T extends { id: string }>(
  currentItems: T[],
  itemId: string,
  updates: Partial<T>,
  updateFn: () => Promise<Response>,
  setItems: (items: T[] | ((prev: T[]) => T[])) => void,
  onSuccess?: () => void,
  onError?: (error: string) => void,
): Promise<void> {
  // Store original state for rollback
  const originalItems = [...currentItems];
  const itemToUpdate = currentItems.find(item => item.id === itemId);

  if (!itemToUpdate) {
    onError?.('Item not found');
    return;
  }

  // Optimistically update UI immediately
  setItems(prevItems =>
    prevItems.map(item => (item.id === itemId ? { ...item, ...updates } : item)),
  );

  try {
    const response = await updateFn();
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
    logger.error('Optimistic update failed:', err);
    onError?.(errorMsg);
  }
}

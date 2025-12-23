import { logger } from '../logger';
import { logger } from '@/lib/logger';

/**
 * Generic optimistic create operation with revert capability.
 *
 * @template T - Type of item being created
 * @param {T[]} currentItems - Current array of items
 * @param {T} newItem - New item to add (with temporary ID)
 * @param {Function} createFn - Async function to perform the create operation
 * @param {Function} setItems - State setter function
 * @param {Function} onSuccess - Optional success callback with created item
 * @param {Function} onError - Optional error callback
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * const tempId = `temp-${Date.now()}`;
 * await createOptimisticCreate(
 *   ingredients,
 *   { id: tempId, ingredient_name: 'Tomato', cost_per_unit: 2.50 },
 *   () => fetch('/api/ingredients', {
 *     method: 'POST',
 *     body: JSON.stringify({ ingredient_name: 'Tomato', cost_per_unit: 2.50 })
 *   }),
 *   setIngredients,
 *   (createdItem) => {
 *     // Replace temp item with real item from server
 *     setIngredients(prev => prev.map(item => item.id === tempId ? createdItem : item));
 *     showSuccess('Ingredient created');
 *   },
 *   (error) => showError(error)
 * );
 * ```
 */
export async function createOptimisticCreate<T extends { id: string }>(
  currentItems: T[],
  newItem: T,
  createFn: () => Promise<Response>,
  setItems: (items: T[] | ((prev: T[]) => T[])) => void,
  onSuccess?: (createdItem: T) => void,
  onError?: (error: string) => void,
): Promise<void> {
  // Store original state for rollback
  const originalItems = [...currentItems];

  // Optimistically add to UI immediately
  setItems(prevItems => [...prevItems, newItem]);

  try {
    const response = await createFn();
    const result = await response.json();

    if (response.ok && result.success && result.item) {
      // Replace optimistic item with real item from server
      setItems(prevItems => prevItems.map(item => (item.id === newItem.id ? result.item : item)));
      onSuccess?.(result.item);
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
    logger.error('Optimistic create failed:', err);
    onError?.(errorMsg);
  }
}

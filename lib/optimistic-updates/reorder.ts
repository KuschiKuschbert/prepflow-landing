import { logger } from '../logger';

/**
 * Generic optimistic reorder operation with revert capability.
 *
 * @template T - Type of item being reordered (must have position property)
 * @param {T[]} currentItems - Current array of items
 * @param {string[]} newOrder - Array of item IDs in new order
 * @param {Function} reorderFn - Async function to perform the reorder operation
 * @param {Function} setItems - State setter function
 * @param {Function} onSuccess - Optional success callback
 * @param {Function} onError - Optional error callback
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await createOptimisticReorder(
 *   menuItems,
 *   ['id1', 'id2', 'id3'],
 *   () => fetch('/api/menus/123/reorder', {
 *     method: 'POST',
 *     body: JSON.stringify({ items: ['id1', 'id2', 'id3'] })
 *   }),
 *   setMenuItems,
 *   () => showSuccess('Items reordered'),
 *   (error) => showError(error)
 * );
 * ```
 */
export async function createOptimisticReorder<T extends { id: string; position: number }>(
  currentItems: T[],
  newOrder: string[],
  reorderFn: () => Promise<Response>,
  setItems: (items: T[] | ((prev: T[]) => T[])) => void,
  onSuccess?: () => void,
  onError?: (error: string) => void,
): Promise<void> {
  // Store original state for rollback
  const originalItems = [...currentItems];

  // Optimistically reorder UI immediately
  const reorderedItems = newOrder
    .map(id => currentItems.find(item => item.id === id))
    .filter((item): item is T => item !== undefined)
    .map((item, index) => ({ ...item, position: index }));

  setItems(reorderedItems);

  try {
    const response = await reorderFn();
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
    logger.error('Optimistic reorder failed:', err);
    onError?.(errorMsg);
  }
}

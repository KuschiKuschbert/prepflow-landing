/**
 * Reusable optimistic update utilities for common CRUD operations.
 * Provides generic functions for optimistic updates with automatic rollback on error.
 */

import { logger } from './logger';

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

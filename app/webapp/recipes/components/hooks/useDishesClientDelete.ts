import { useCallback, useState } from 'react';
import { Dish, Recipe } from '../../types';
import { useNotification } from '@/contexts/NotificationContext';
import { logger } from '@/lib/logger';

type UnifiedItem = (Dish & { itemType: 'dish' }) | (Recipe & { itemType: 'recipe' });

interface UseDishesClientDeleteProps {
  dishes: Dish[];
  recipes: Recipe[];
  setDishes: (dishes: Dish[]) => void;
  setRecipes: (recipes: Recipe[]) => void;
  setError: (error: string | null) => void;
}

export function useDishesClientDelete({
  dishes,
  recipes,
  setDishes,
  setRecipes,
  setError,
}: UseDishesClientDeleteProps) {
  const { showSuccess } = useNotification();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<UnifiedItem | null>(null);

  const handleDeleteDish = useCallback((dish: Dish) => {
    setItemToDelete({ ...dish, itemType: 'dish' });
    setShowDeleteConfirm(true);
  }, []);

  const handleDeleteRecipe = useCallback((recipe: Recipe) => {
    setItemToDelete({ ...recipe, itemType: 'recipe' });
    setShowDeleteConfirm(true);
  }, []);

  const confirmDeleteItem = useCallback(async () => {
    if (!itemToDelete) return;

    // Store original state for rollback
    const originalDishes = [...dishes];
    const originalRecipes = [...recipes];
    const itemId = itemToDelete.id;
    const itemType = itemToDelete.itemType;

    // Optimistically remove from UI immediately
    if (itemType === 'dish') {
      setDishes(dishes.filter(d => d.id !== itemId));
    } else {
      setRecipes(recipes.filter(r => r.id !== itemId));
    }

    try {
      const endpoint = itemType === 'dish' ? `/api/dishes/${itemId}` : `/api/recipes/${itemId}`;
      const response = await fetch(endpoint, { method: 'DELETE' });

      if (!response.ok) {
        // Revert optimistic update on error
        if (itemType === 'dish') {
          setDishes(originalDishes);
        } else {
          setRecipes(originalRecipes);
        }
        const result = await response.json();
        setError(result.error || `Failed to delete ${itemType}`);
        return;
      }

      showSuccess(`${itemType === 'dish' ? 'Dish' : 'Recipe'} deleted successfully`);
      setShowDeleteConfirm(false);
      setItemToDelete(null);
    } catch (err) {
      logger.error('[useDishesClientDelete.ts] Error in catch block:', {
      error: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
    });

      // Revert optimistic update on error
      if (itemType === 'dish') {
        setDishes(originalDishes);
      } else {
        setRecipes(originalRecipes);
      }
      setError(`Failed to delete ${itemType}`);
    }
  }, [itemToDelete, dishes, recipes, setDishes, setRecipes, setError, showSuccess]);

  const cancelDeleteItem = useCallback(() => {
    setShowDeleteConfirm(false);
    setItemToDelete(null);
  }, []);

  return {
    showDeleteConfirm,
    itemToDelete,
    handleDeleteDish,
    handleDeleteRecipe,
    confirmDeleteItem,
    cancelDeleteItem,
  };
}

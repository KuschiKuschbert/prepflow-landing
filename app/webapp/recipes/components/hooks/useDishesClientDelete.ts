import { useCallback, useState } from 'react';
import { Dish, Recipe } from '../../types';

type UnifiedItem = (Dish & { itemType: 'dish' }) | (Recipe & { itemType: 'recipe' });

interface UseDishesClientDeleteProps {
  dishes: Dish[];
  recipes: Recipe[];
  setDishes: (dishes: Dish[]) => void;
  setRecipes: (recipes: Recipe[]) => void;
  setError: (error: string | null) => void;
  setSuccessMessage: (message: string | null) => void;
}

export function useDishesClientDelete({
  dishes,
  recipes,
  setDishes,
  setRecipes,
  setError,
  setSuccessMessage,
}: UseDishesClientDeleteProps) {
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

      setSuccessMessage(`${itemType === 'dish' ? 'Dish' : 'Recipe'} deleted successfully`);
      setShowDeleteConfirm(false);
      setItemToDelete(null);
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      // Revert optimistic update on error
      if (itemType === 'dish') {
        setDishes(originalDishes);
      } else {
        setRecipes(originalRecipes);
      }
      setError(`Failed to delete ${itemType}`);
    }
  }, [itemToDelete, dishes, recipes, setDishes, setRecipes, setError, setSuccessMessage]);

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

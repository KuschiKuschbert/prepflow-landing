import { useNotification } from '@/contexts/NotificationContext';
import { logger } from '@/lib/logger';
import { markFirstDone } from '@/lib/page-help/first-done-storage';
import type { SelectedIngredient, SelectedRecipe } from '../components/DishEditDrawerTypes';
import type { Dish } from '@/lib/types/recipes';

interface UseDishFormSubmitProps {
  dish: Dish | null;
  dishName: string;
  description: string;
  sellingPrice: string;
  selectedRecipes: SelectedRecipe[];
  selectedIngredients: SelectedIngredient[];
  onSave: () => void;
  onClose: () => void;
}

export function useDishFormSubmit({
  dish,
  dishName,
  description,
  sellingPrice,
  selectedRecipes,
  selectedIngredients,
  onSave,
  onClose,
}: UseDishFormSubmitProps) {
  const { showWarning, showError, showSuccess, showInfo } = useNotification();

  const handleSave = async () => {
    if (!dishName || !sellingPrice) {
      showWarning('Dish name and selling price are required');
      return;
    }

    if (selectedRecipes.length === 0 && selectedIngredients.length === 0) {
      showWarning('Dish must contain at least one recipe or ingredient');
      return;
    }

    try {
      const url = dish ? `/api/dishes/${dish.id}` : '/api/dishes';
      const method = dish ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dish_name: dishName,
          description: description || null,
          selling_price: parseFloat(sellingPrice),
          recipes: selectedRecipes,
          ingredients: selectedIngredients,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        showError(result.message || result.error || 'Failed to save dish');
        return;
      }

      showSuccess(dish ? 'Dish updated successfully!' : 'Dish created successfully!');
      if (selectedIngredients.length === 0 && selectedRecipes.length > 0) {
        showInfo(
          "Make sure your recipes have ingredients for accurate cost and COGS. Add ingredients in the COGS Calculator or run 'Populate empty items' later.",
        );
      }
      if (!dish) {
        markFirstDone('recipes');
      }
      onSave();
      onClose();
    } catch (err) {
      logger.error('Failed to save dish:', err);
      showError('Failed to save dish');
    }
  };

  return { handleSave };
}

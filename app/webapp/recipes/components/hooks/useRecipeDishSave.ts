import { useCallback, useState } from 'react';
import { RecipeDishItem } from './useRecipeDishEditorData';
import { Recipe, Dish } from '../../types';
import { COGSCalculation } from '../../../cogs/types';
import { logger } from '@/lib/logger';

interface UseRecipeDishSaveProps {
  selectedItem: RecipeDishItem | null;
  calculations: COGSCalculation[];
  allRecipes: Recipe[];
  allDishes: Dish[];
  onSave: () => void;
  showError: (message: string) => void;
  showSuccess: (message: string) => void;
}

export function useRecipeDishSave({
  selectedItem,
  calculations,
  allRecipes,
  allDishes,
  onSave,
  showError,
  showSuccess,
}: UseRecipeDishSaveProps) {
  const [saving, setSaving] = useState(false);
  const handleError = useCallback(
    async (response: Response, itemType: string, itemId: string, count: number) => {
      const result = await response.json().catch(() => ({ error: 'Unknown error' }));
      logger.error(`Failed to save ${itemType} ingredients:`, {
        status: response.status,
        error: result.error || result.message,
        [`${itemType}Id`]: itemId,
        ingredientsCount: count,
      });
      showError(
        result.error ||
          result.message ||
          `Failed to save ${itemType} ingredients (${response.status})`,
      );
    },
    [showError],
  );
  const handleSave = useCallback(async () => {
    if (!selectedItem) {
      showError('Please select a recipe or dish to edit');
      return;
    }
    if (calculations.length === 0) {
      showError(
        `${selectedItem.type === 'recipe' ? 'Recipe' : 'Dish'} must contain at least one ingredient`,
      );
      return;
    }
    setSaving(true);
    try {
      if (selectedItem.type === 'recipe') {
        const recipe = allRecipes.find(r => r.id === selectedItem.id);
        const recipeYield = recipe?.yield || 1;
        const recipeIngredients = calculations.map(calc => ({
          ingredient_id: calc.ingredientId,
          quantity: calc.quantity * recipeYield,
          unit: calc.unit,
        }));
        const response = await fetch(`/api/recipes/${selectedItem.id}/ingredients`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ingredients: recipeIngredients, isUpdate: true }),
        });
        if (!response.ok) {
          await handleError(response, 'recipe', selectedItem.id, recipeIngredients.length);
          return;
        }
        await response.json();
      } else {
        const dish = allDishes.find(d => d.id === selectedItem.id);
        if (!dish) {
          showError('Dish not found');
          return;
        }
        const dishIngredients = calculations.map(calc => ({
          ingredient_id: calc.ingredientId,
          quantity: calc.quantity,
          unit: calc.unit,
        }));
        const response = await fetch(`/api/dishes/${selectedItem.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            dish_name: dish.dish_name,
            description: dish.description,
            selling_price: dish.selling_price,
            recipes: [],
            ingredients: dishIngredients,
          }),
        });
        if (!response.ok) {
          await handleError(response, 'dish', selectedItem.id, dishIngredients.length);
          return;
        }
        await response.json();
      }
      showSuccess(
        `${selectedItem.type === 'recipe' ? 'Recipe' : 'Dish'} ingredients saved successfully`,
      );
      onSave();
    } catch (err) {
      logger.error('Failed to save:', err);
      showError('Failed to save ingredients');
    } finally {
      setSaving(false);
    }
  }, [
    calculations,
    selectedItem,
    allRecipes,
    allDishes,
    onSave,
    showError,
    showSuccess,
    handleError,
  ]);
  return { saving, handleSave };
}

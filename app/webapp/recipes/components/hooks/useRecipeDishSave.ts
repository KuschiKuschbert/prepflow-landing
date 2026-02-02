import { useCallback, useState } from 'react';
import { RecipeDishItem } from './useRecipeDishEditorData';
import { Recipe, Dish } from '@/lib/types/recipes';
import { COGSCalculation } from '@/lib/types/recipes';
import { logger } from '@/lib/logger';
import { saveDishIngredients } from './useRecipeDishSave/helpers/saveDishIngredients';
import { saveRecipeIngredients } from './useRecipeDishSave/helpers/saveRecipeIngredients';
import { handleSaveError } from './useRecipeDishSave/helpers/handleSaveError';

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
        const _result = await saveRecipeIngredients(selectedItem, calculations, allRecipes);
        showSuccess('Recipe ingredients saved successfully');
      } else {
        await saveDishIngredients(selectedItem, calculations, allDishes);
        showSuccess('Dish ingredients saved successfully');
      }
      onSave();
    } catch (err) {
      if (err instanceof Response) {
        await handleSaveError(
          err,
          selectedItem.type,
          selectedItem.id,
          calculations.length,
          showError,
        );
      } else {
        logger.error('Failed to save:', err);
        showError('Failed to save ingredients');
      }
    } finally {
      setSaving(false);
    }
  }, [calculations, selectedItem, allRecipes, allDishes, onSave, showError, showSuccess]);
  return { saving, handleSave };
}

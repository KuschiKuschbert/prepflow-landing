import { supabase } from '@/lib/supabase';
import { logger } from '@/lib/logger';

interface HandleCategorizeAllParams {
  ingredients: any[];
  setIngredients: React.Dispatch<React.SetStateAction<any[]>>;
  showSuccess: (message: string) => void;
  showError: (message: string) => void;
}

export async function handleCategorizeAllUncategorized(
  useAI: boolean,
  onRefresh: (() => void) | undefined,
  { ingredients, setIngredients, showSuccess, showError }: HandleCategorizeAllParams,
) {
  // Store original state for rollback
  const originalIngredientsState = [...ingredients];

  // Optimistically update UI immediately - mark uncategorized ingredients as "Categorizing..."
  setIngredients(prevIngredients =>
    prevIngredients.map(ing =>
      ing.category === 'Uncategorized'
        ? { ...ing, category: 'Categorizing...', is_active: true }
        : ing,
    ),
  );

  try {
    const response = await fetch('/api/ingredients/auto-categorize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ categorizeAll: true, useAI }),
    });

    const result = await response.json();

    if (!response.ok) {
      // Error - revert optimistic update
      setIngredients(originalIngredientsState);
      throw new Error(result.error || result.message || 'Failed to categorize all ingredients');
    }

    // Update state based on API response or refresh
    if (onRefresh) {
      onRefresh();
    } else {
      const { data: updatedIngredients, error: fetchError } = await supabase
        .from('ingredients')
        .select('id, category');
      if (!fetchError && updatedIngredients) {
        const categoryMap = new Map(updatedIngredients.map(ing => [ing.id, ing.category]));
        setIngredients(prevIngredients =>
          prevIngredients.map(ing => {
            const newCategory = categoryMap.get(ing.id);
            return newCategory ? { ...ing, category: newCategory } : ing;
          }),
        );
      }
    }
    showSuccess(
      result.message ||
        `Successfully categorized ${result.updated} ingredient${result.updated !== 1 ? 's' : ''}`,
    );
  } catch (error) {
    // Error - revert optimistic update
    setIngredients(originalIngredientsState);
    logger.error('Categorize all failed:', error);
    showError(error instanceof Error ? error.message : 'Failed to categorize all ingredients');
    throw error;
  }
}

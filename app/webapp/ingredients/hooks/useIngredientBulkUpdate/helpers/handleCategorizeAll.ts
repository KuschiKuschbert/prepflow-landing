import { supabase } from '@/lib/supabase';
import { logger } from '@/lib/logger';

interface HandleCategorizeAllParams {
  setIngredients: React.Dispatch<React.SetStateAction<any[]>>;
  showSuccess: (message: string) => void;
  showError: (message: string) => void;
}

export async function handleCategorizeAllUncategorized(
  useAI: boolean,
  onRefresh: (() => void) | undefined,
  { setIngredients, showSuccess, showError }: HandleCategorizeAllParams,
) {
  try {
    const response = await fetch('/api/ingredients/auto-categorize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ categorizeAll: true, useAI }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || result.message || 'Failed to categorize all ingredients');
    }
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
    logger.error('Categorize all failed:', error);
    showError(error instanceof Error ? error.message : 'Failed to categorize all ingredients');
    throw error;
  }
}




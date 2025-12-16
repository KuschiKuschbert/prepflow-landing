import { supabase } from '@/lib/supabase';
import { logger } from '@/lib/logger';

interface HandleBulkAutoCategorizeParams {
  ingredients: any[];
  setIngredients: React.Dispatch<React.SetStateAction<any[]>>;
  setSelectedIngredients: React.Dispatch<React.SetStateAction<Set<string>>>;
  exitSelectionMode: () => void;
  showSuccess: (message: string) => void;
  showError: (message: string) => void;
}

export async function handleBulkAutoCategorize(
  ids: string[],
  useAI: boolean,
  {
    ingredients,
    setIngredients,
    setSelectedIngredients,
    exitSelectionMode,
    showSuccess,
    showError,
  }: HandleBulkAutoCategorizeParams,
) {
  const originalIngredients = [...ingredients];
  try {
    const response = await fetch('/api/ingredients/auto-categorize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ingredientIds: ids, useAI }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || result.message || 'Failed to auto-categorize ingredients');
    }
    const { data: updatedIngredients, error: fetchError } = await supabase
      .from('ingredients')
      .select('id, category')
      .in('id', ids);

    if (fetchError) throw fetchError;
    if (updatedIngredients) {
      const categoryMap = new Map(updatedIngredients.map(ing => [ing.id, ing.category]));
      setIngredients(prevIngredients =>
        prevIngredients.map(ing => {
          const newCategory = categoryMap.get(ing.id);
          return newCategory ? { ...ing, category: newCategory } : ing;
        }),
      );
    }
    setSelectedIngredients(new Set());
    exitSelectionMode();
    showSuccess(
      result.message ||
        `Successfully categorized ${result.updated} ingredient${result.updated !== 1 ? 's' : ''}`,
    );
  } catch (error) {
    setIngredients(originalIngredients);
    logger.error('Bulk auto-categorize failed:', error);
    showError(error instanceof Error ? error.message : 'Failed to auto-categorize ingredients');
    throw error;
  }
}





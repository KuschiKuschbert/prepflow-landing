import { supabase } from '@/lib/supabase';
import { logger } from '@/lib/logger';

interface HandleBulkUpdateParams {
  ingredients: any[];
  setIngredients: React.Dispatch<React.SetStateAction<any[]>>;
  setSelectedIngredients: React.Dispatch<React.SetStateAction<Set<string>>>;
  exitSelectionMode: () => void;
  showSuccess: (message: string) => void;
  showError: (message: string) => void;
}

export async function handleBulkUpdate(
  ids: string[],
  updates: Partial<any>,
  {
    ingredients,
    setIngredients,
    setSelectedIngredients,
    exitSelectionMode,
    showSuccess,
    showError,
  }: HandleBulkUpdateParams,
) {
  const originalIngredients = [...ingredients];
  setIngredients(prevIngredients =>
    prevIngredients.map(ing => (ids.includes(ing.id) ? { ...ing, ...updates } : ing)),
  );

  try {
    const { error } = await supabase.from('ingredients').update(updates).in('id', ids);
    if (error) {
      setIngredients(originalIngredients);
      throw error;
    }
    setSelectedIngredients(new Set());
    exitSelectionMode();
    showSuccess('Ingredients updated successfully');
  } catch (error) {
    logger.error('Bulk update failed:', error);
    showError('Failed to update ingredients');
    throw error;
  }
}




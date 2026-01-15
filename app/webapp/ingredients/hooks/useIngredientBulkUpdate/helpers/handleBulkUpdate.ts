import { logger } from '@/lib/logger';
import { supabase } from '@/lib/supabase';

interface HandleBulkUpdateParams<T> {
  ingredients: T[];
  setIngredients: React.Dispatch<React.SetStateAction<T[]>>;
  setSelectedIngredients: React.Dispatch<React.SetStateAction<Set<string>>>;
  exitSelectionMode: () => void;
  showSuccess: (message: string) => void;
  showError: (message: string) => void;
}

export async function handleBulkUpdate<T extends { id: string }>(
  ids: string[],
  updates: Partial<T>,
  {
    ingredients,
    setIngredients,
    setSelectedIngredients,
    exitSelectionMode,
    showSuccess,
    showError,
  }: HandleBulkUpdateParams<T>,
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

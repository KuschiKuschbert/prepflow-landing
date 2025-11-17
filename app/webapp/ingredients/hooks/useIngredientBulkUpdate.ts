import { useCallback } from 'react';
import { useNotification } from '@/contexts/NotificationContext';
import { supabase } from '@/lib/supabase';
import { logger } from '@/lib/logger';

interface UseIngredientBulkUpdateProps {
  ingredients: any[];
  setIngredients: React.Dispatch<React.SetStateAction<any[]>>;
  setSelectedIngredients: React.Dispatch<React.SetStateAction<Set<string>>>;
  exitSelectionMode: () => void;
}

export function useIngredientBulkUpdate({
  ingredients,
  setIngredients,
  setSelectedIngredients,
  exitSelectionMode,
}: UseIngredientBulkUpdateProps) {
  const { showSuccess, showError } = useNotification();

  const handleBulkUpdate = useCallback(
    async (ids: string[], updates: Partial<any>) => {
      // Store original state for rollback
      const originalIngredients = [...ingredients];

      // Optimistically update UI immediately
      setIngredients(prevIngredients =>
        prevIngredients.map(ing => (ids.includes(ing.id) ? { ...ing, ...updates } : ing)),
      );

      try {
        const { error } = await supabase.from('ingredients').update(updates).in('id', ids);

        if (error) {
          // Revert optimistic update on error
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
    },
    [
      ingredients,
      setIngredients,
      setSelectedIngredients,
      exitSelectionMode,
      showSuccess,
      showError,
    ],
  );

  return { handleBulkUpdate };
}

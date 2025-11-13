import { useCallback } from 'react';
import { useNotification } from '@/contexts/NotificationContext';
import { supabase } from '@/lib/supabase';

interface UseIngredientBulkUpdateProps {
  refetchIngredients: () => Promise<any>;
  setSelectedIngredients: React.Dispatch<React.SetStateAction<Set<string>>>;
  exitSelectionMode: () => void;
}

export function useIngredientBulkUpdate({
  refetchIngredients,
  setSelectedIngredients,
  exitSelectionMode,
}: UseIngredientBulkUpdateProps) {
  const { showSuccess, showError } = useNotification();

  const handleBulkUpdate = useCallback(
    async (ids: string[], updates: Partial<any>) => {
      try {
        const { error } = await supabase.from('ingredients').update(updates).in('id', ids);

        if (error) throw error;

        await refetchIngredients();
        setSelectedIngredients(new Set());
        exitSelectionMode();
        showSuccess('Ingredients updated successfully');
      } catch (error) {
        showError('Failed to update ingredients');
        throw error;
      }
    },
    [refetchIngredients, setSelectedIngredients, exitSelectionMode, showSuccess, showError],
  );

  return { handleBulkUpdate };
}

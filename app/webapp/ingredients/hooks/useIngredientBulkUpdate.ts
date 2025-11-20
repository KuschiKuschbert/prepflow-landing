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
    },
    [ingredients, setIngredients, setSelectedIngredients, exitSelectionMode, showSuccess, showError],
  );
  const handleBulkAutoCategorize = useCallback(
    async (ids: string[], useAI: boolean = true) => {
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
          setIngredients(prevIngredients => prevIngredients.map(ing => {
            const newCategory = categoryMap.get(ing.id);
            return newCategory ? { ...ing, category: newCategory } : ing;
          }));
        }
        setSelectedIngredients(new Set());
        exitSelectionMode();
        showSuccess(result.message || `Successfully categorized ${result.updated} ingredient${result.updated !== 1 ? 's' : ''}`);
      } catch (error) {
        setIngredients(originalIngredients);
        logger.error('Bulk auto-categorize failed:', error);
        showError(error instanceof Error ? error.message : 'Failed to auto-categorize ingredients');
        throw error;
      }
    },
    [ingredients, setIngredients, setSelectedIngredients, exitSelectionMode, showSuccess, showError],
  );
  const handleCategorizeAllUncategorized = useCallback(
    async (useAI: boolean = true, onRefresh?: () => void) => {
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
          const { data: updatedIngredients, error: fetchError } = await supabase.from('ingredients').select('id, category');
          if (!fetchError && updatedIngredients) {
            const categoryMap = new Map(updatedIngredients.map(ing => [ing.id, ing.category]));
            setIngredients(prevIngredients => prevIngredients.map(ing => {
              const newCategory = categoryMap.get(ing.id);
              return newCategory ? { ...ing, category: newCategory } : ing;
            }));
          }
        }
        showSuccess(result.message || `Successfully categorized ${result.updated} ingredient${result.updated !== 1 ? 's' : ''}`);
      } catch (error) {
        logger.error('Categorize all failed:', error);
        showError(error instanceof Error ? error.message : 'Failed to categorize all ingredients');
        throw error;
      }
    },
    [showSuccess, showError, setIngredients],
  );
  return { handleBulkUpdate, handleBulkAutoCategorize, handleCategorizeAllUncategorized };
}

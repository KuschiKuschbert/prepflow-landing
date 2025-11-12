'use client';

import { useState, useCallback } from 'react';

interface UseIngredientEditingProps {
  updateCalculation: (ingredientId: string, newQuantity: number) => void;
  removeCalculation: (ingredientId: string) => void;
  saveNow?: () => Promise<void>;
}

export function useIngredientEditing({
  updateCalculation,
  removeCalculation,
  saveNow,
}: UseIngredientEditingProps) {
  const [editingIngredient, setEditingIngredient] = useState<string | null>(null);
  const [editQuantity, setEditQuantity] = useState<number>(0);

  const handleEditIngredient = useCallback((ingredientId: string, currentQuantity: number) => {
    setEditingIngredient(ingredientId);
    setEditQuantity(currentQuantity);
  }, []);

  const handleSaveEdit = useCallback(() => {
    if (editingIngredient && editQuantity > 0) {
      updateCalculation(editingIngredient, editQuantity);
    }
    setEditingIngredient(null);
    setEditQuantity(0);
  }, [editingIngredient, editQuantity, updateCalculation]);

  const handleCancelEdit = useCallback(() => {
    setEditingIngredient(null);
    setEditQuantity(0);
  }, []);

  const handleRemoveIngredient = useCallback(
    async (ingredientId: string) => {
      // Update state first
      removeCalculation(ingredientId);
      // Small delay to ensure state update is committed before save
      await new Promise(resolve => setTimeout(resolve, 0));
      // Trigger immediate save to persist removal before any potential reload
      if (saveNow) {
        try {
          await saveNow();
        } catch (err) {
          console.error('Failed to save after removal:', err);
        }
      }
    },
    [removeCalculation, saveNow],
  );

  return {
    editingIngredient,
    editQuantity,
    setEditQuantity,
    handleEditIngredient,
    handleSaveEdit,
    handleCancelEdit,
    handleRemoveIngredient,
  };
}

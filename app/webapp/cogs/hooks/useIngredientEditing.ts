'use client';

import { useState, useCallback } from 'react';

interface UseIngredientEditingProps {
  updateCalculation: (ingredientId: string, newQuantity: number) => void;
  removeCalculation: (ingredientId: string) => void;
}

export function useIngredientEditing({
  updateCalculation,
  removeCalculation,
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
    (ingredientId: string) => {
      removeCalculation(ingredientId);
    },
    [removeCalculation],
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

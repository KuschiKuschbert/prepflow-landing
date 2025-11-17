'use client';

import { useState, useCallback } from 'react';
import { flushSync } from 'react-dom';

import { logger } from '../../lib/logger';
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
      logger.dev('[useIngredientEditing] Removing ingredient:', ingredientId);
      // Use flushSync to ensure state update is committed synchronously before async save
      flushSync(() => {
        removeCalculation(ingredientId);
      });
      logger.dev('[useIngredientEditing] State updated, triggering save');
      // Trigger immediate save to persist removal before any potential reload
      if (saveNow) {
        try {
          await saveNow();
          logger.dev('[useIngredientEditing] Save completed successfully');
        } catch (err) {
          logger.error('[useIngredientEditing] Failed to save after removal:', err);
        }
      } else {
        logger.warn('[useIngredientEditing] saveNow not available');
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

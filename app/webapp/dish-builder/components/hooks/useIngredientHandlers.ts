/**
 * Hook for managing ingredient-related handlers (tap, quantity, edit).
 */

import { useState } from 'react';
import type { Ingredient } from '@/lib/types/cogs';
import type { COGSCalculation } from '@/lib/types/cogs';

interface UseIngredientHandlersProps {
  calculations: COGSCalculation[];
  handleIngredientAdded: (ingredient: Ingredient, quantity: number, unit: string) => void;
  editCalculation: (ingredientId: string, quantity: number, unit: string) => void;
  removeCalculation: (ingredientId: string) => void;
}

export function useIngredientHandlers({
  calculations,
  handleIngredientAdded,
  editCalculation,
  removeCalculation,
}: UseIngredientHandlersProps) {
  const [editingIngredient, setEditingIngredient] = useState<string | null>(null);
  const [editQuantity, setEditQuantity] = useState<number>(0);
  const [showQuantityModal, setShowQuantityModal] = useState(false);
  const [selectedIngredient, setSelectedIngredient] = useState<Ingredient | null>(null);

  // Handle ingredient tap - show quantity modal
  const handleIngredientTap = (ingredient: Ingredient) => {
    setSelectedIngredient(ingredient);
    setShowQuantityModal(true);
  };

  // Handle quantity confirmation
  const handleQuantityConfirm = (quantity: number) => {
    if (!selectedIngredient) return;

    // Add ingredient with provided quantity and ingredient's unit
    handleIngredientAdded(selectedIngredient, quantity, selectedIngredient.unit || 'kg');
    setShowQuantityModal(false);
    setSelectedIngredient(null);
  };

  // Handle quantity modal cancel
  const handleQuantityCancel = () => {
    setShowQuantityModal(false);
    setSelectedIngredient(null);
  };

  // Edit ingredient handlers
  const handleEditIngredient = (ingredientId: string, currentQuantity: number) => {
    setEditingIngredient(ingredientId);
    setEditQuantity(currentQuantity);
  };

  const handleSaveEdit = () => {
    if (editingIngredient && editQuantity > 0) {
      const calculation = calculations.find(calc => calc.ingredientId === editingIngredient);
      const unit = calculation?.unit || 'kg';
      editCalculation(editingIngredient, editQuantity, unit);
      setEditingIngredient(null);
      setEditQuantity(0);
    }
  };

  const handleCancelEdit = () => {
    setEditingIngredient(null);
    setEditQuantity(0);
  };

  const handleRemoveIngredient = async (ingredientId: string) => {
    removeCalculation(ingredientId);
  };

  return {
    editingIngredient,
    editQuantity,
    setEditQuantity,
    showQuantityModal,
    selectedIngredient,
    handleIngredientTap,
    handleQuantityConfirm,
    handleQuantityCancel,
    handleEditIngredient,
    handleSaveEdit,
    handleCancelEdit,
    handleRemoveIngredient,
  };
}

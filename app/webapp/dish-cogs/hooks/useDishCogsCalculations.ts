import { useState, useEffect } from 'react';
import { DishCOGSCalculation, Dish } from '../types';
import { loadDishData } from '../utils/loadDishData';

export function useDishCogsCalculations() {
  const [selectedDish, setSelectedDish] = useState<Dish | null>(null);
  const [calculations, setCalculations] = useState<DishCOGSCalculation[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingIngredient, setEditingIngredient] = useState<string | null>(null);
  const [editQuantity, setEditQuantity] = useState<number>(0);

  useEffect(() => {
    if (selectedDish) {
      setLoading(true);
      loadDishData(selectedDish)
        .then(setCalculations)
        .catch(() => setCalculations([]))
        .finally(() => setLoading(false));
    } else {
      setCalculations([]);
    }
  }, [selectedDish]);

  const handleEditIngredient = (ingredientId: string, currentQuantity: number) => {
    setEditingIngredient(ingredientId);
    setEditQuantity(currentQuantity);
  };

  const handleSaveEdit = () => {
    if (!editingIngredient) return;

    setCalculations(prev =>
      prev.map(calc => {
        if (calc.ingredientId === editingIngredient) {
          const newTotalCost = editQuantity * calc.costPerUnit;
          const wasteAdjustedCost = calc.wasteAdjustedCost
            ? (newTotalCost / calc.totalCost) * calc.wasteAdjustedCost
            : newTotalCost;
          const yieldAdjustedCost = calc.yieldAdjustedCost
            ? (newTotalCost / calc.totalCost) * calc.yieldAdjustedCost
            : newTotalCost;

          return {
            ...calc,
            quantity: editQuantity,
            totalCost: newTotalCost,
            wasteAdjustedCost,
            yieldAdjustedCost,
          };
        }
        return calc;
      }),
    );

    setEditingIngredient(null);
    setEditQuantity(0);
  };

  const handleCancelEdit = () => {
    setEditingIngredient(null);
    setEditQuantity(0);
  };

  const totalCOGS = calculations.reduce((sum, calc) => sum + calc.yieldAdjustedCost, 0);

  return {
    selectedDish,
    setSelectedDish,
    calculations,
    loading,
    editingIngredient,
    editQuantity,
    setEditQuantity,
    handleEditIngredient,
    handleSaveEdit,
    handleCancelEdit,
    totalCOGS,
  };
}

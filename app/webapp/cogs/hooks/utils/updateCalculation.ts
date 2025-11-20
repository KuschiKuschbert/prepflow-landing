import { COGSCalculation, Ingredient } from '../types';

interface UpdateCalculationParams {
  ingredientId: string;
  newQuantity: number;
  ingredients: Ingredient[];
  setCalculations: React.Dispatch<React.SetStateAction<COGSCalculation[]>>;
}

export function updateCalculation({
  ingredientId,
  newQuantity,
  ingredients,
  setCalculations,
}: UpdateCalculationParams): void {
  setCalculations(prev =>
    prev.map(calc => {
      if (calc.ingredientId !== ingredientId) return calc;
      const ingredient = ingredients.find(ing => ing.id === ingredientId);
      if (!ingredient) return calc;
      const isConsumable = ingredient.category === 'Consumables';
      const newTotalCost = newQuantity * calc.costPerUnit;
      if (isConsumable) {
        return {
          ...calc,
          quantity: newQuantity,
          totalCost: newTotalCost,
          wasteAdjustedCost: newTotalCost,
          yieldAdjustedCost: newTotalCost,
        };
      }
      const wastePercent = ingredient.trim_peel_waste_percentage || 0;
      const yieldPercent = ingredient.yield_percentage || 100;
      const wasteAdj = newTotalCost * (1 + wastePercent / 100);
      return {
        ...calc,
        quantity: newQuantity,
        totalCost: newTotalCost,
        wasteAdjustedCost: wasteAdj,
        yieldAdjustedCost: wasteAdj / (yieldPercent / 100),
      };
    }),
  );
}

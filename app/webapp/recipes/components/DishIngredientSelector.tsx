'use client';

import { Plus, Trash2 } from 'lucide-react';
import { Icon } from '@/components/ui/Icon';
import DishIngredientCombobox from './DishIngredientCombobox';

import { logger } from '@/lib/logger';
interface SelectedIngredient {
  ingredient_id: string;
  quantity: number;
  unit: string;
  ingredient_name?: string;
}

interface DishIngredientSelectorProps {
  ingredients: any[];
  selectedIngredients: SelectedIngredient[];
  onIngredientsChange: (ingredients: SelectedIngredient[]) => void;
}

export default function DishIngredientSelector({
  ingredients,
  selectedIngredients,
  onIngredientsChange,
}: DishIngredientSelectorProps) {
  const handleAddIngredient = () => {
    if (ingredients.length > 0) {
      const firstIngredient = ingredients[0];
      onIngredientsChange([
        ...selectedIngredients,
        {
          ingredient_id: firstIngredient.id,
          quantity: 0,
          unit: firstIngredient.unit || 'kg',
          ingredient_name: firstIngredient.ingredient_name || firstIngredient.name || 'Unknown',
        },
      ]);
    } else {
      logger.warn('No ingredients available to add');
    }
  };

  const handleRemoveIngredient = (index: number) => {
    onIngredientsChange(selectedIngredients.filter((_, i) => i !== index));
  };

  const handleIngredientSelect = (index: number, ingredient: any) => {
    onIngredientsChange(
      selectedIngredients.map((i, idx) =>
        idx === index
          ? {
              ingredient_id: ingredient.id,
              quantity: i.quantity,
              unit: ingredient.unit || i.unit,
              ingredient_name: ingredient.ingredient_name || ingredient.name,
            }
          : i,
      ),
    );
  };

  return (
    <div className="mb-6">
      <div className="mb-3 flex items-center justify-between">
        <label className="text-sm font-medium text-gray-300">Standalone Ingredients</label>
        <button
          type="button"
          onClick={handleAddIngredient}
          className="flex items-center gap-2 rounded-lg bg-[#2a2a2a] px-3 py-1.5 text-sm text-white transition-colors hover:bg-[#3a3a3a]"
        >
          <Icon icon={Plus} size="sm" />
          Add Ingredient
        </button>
      </div>
      <div className="space-y-3">
        {selectedIngredients.map((si, index) => (
          <div key={index} className="flex gap-3 rounded-lg bg-[#2a2a2a]/30 p-3">
            <DishIngredientCombobox
              ingredients={ingredients}
              selectedIngredient={si}
              onSelect={ingredient => handleIngredientSelect(index, ingredient)}
            />
            <input
              type="number"
              step="0.01"
              min="0"
              value={si.quantity}
              onChange={e =>
                onIngredientsChange(
                  selectedIngredients.map((i, idx) =>
                    idx === index ? { ...i, quantity: parseFloat(e.target.value) || 0 } : i,
                  ),
                )
              }
              className="w-24 rounded-lg border border-[#2a2a2a] bg-[#1f1f1f] px-3 py-2 text-white"
              placeholder="Qty"
            />
            <input
              type="text"
              value={si.unit}
              onChange={e =>
                onIngredientsChange(
                  selectedIngredients.map((i, idx) =>
                    idx === index ? { ...i, unit: e.target.value } : i,
                  ),
                )
              }
              className="w-20 rounded-lg border border-[#2a2a2a] bg-[#1f1f1f] px-3 py-2 text-white"
              placeholder="Unit"
            />
            <button
              type="button"
              onClick={() => handleRemoveIngredient(index)}
              className="rounded-lg p-2 text-red-400 transition-colors hover:bg-red-500/20"
            >
              <Icon icon={Trash2} size="sm" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

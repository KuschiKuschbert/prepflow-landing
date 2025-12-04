'use client';

import { Icon } from '@/components/ui/Icon';
import { BookOpen, ChefHat, DollarSign, Package, UtensilsCrossed } from 'lucide-react';
import { DishBuilderState } from '../types';

interface DishFormProps {
  dishState: DishBuilderState;
  setDishState: React.Dispatch<React.SetStateAction<DishBuilderState>>;
  recommendedPrice: number;
  ingredientCount: number;
  onSave: () => void;
  saving?: boolean;
}

export default function DishForm({
  dishState,
  setDishState,
  recommendedPrice,
  ingredientCount,
  onSave,
  saving = false,
}: DishFormProps) {
  const handleApplyRecommendedPrice = () => {
    if (recommendedPrice > 0) {
      setDishState(prev => ({
        ...prev,
        sellingPrice: recommendedPrice,
      }));
    }
  };

  return (
    <div className="rounded-xl border border-[#2a2a2a] bg-[#1f1f1f] p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-lg font-semibold text-white">
          <Icon icon={ChefHat} size="md" className="text-[#29E7CD]" aria-hidden={true} />
          {dishState.itemType === 'dish' ? 'Dish Details' : 'Recipe Details'}
        </h2>
        {ingredientCount > 0 && (
          <div className="flex items-center gap-2 rounded-full bg-[#29E7CD]/20 px-3 py-1.5">
            <Icon icon={Package} size="sm" className="text-[#29E7CD]" aria-hidden={true} />
            <span className="text-sm font-medium text-[#29E7CD]">
              {ingredientCount} ingredients
            </span>
          </div>
        )}
      </div>

      <div className="space-y-4">
        {/* Item Type Selector */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-300">Item Type *</label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() =>
                setDishState(prev => ({
                  ...prev,
                  itemType: 'dish',
                  sellingPrice: prev.itemType === 'recipe' ? 0 : prev.sellingPrice,
                }))
              }
              className={`flex flex-1 items-center justify-center gap-2 rounded-lg border px-4 py-3 font-medium transition-all duration-200 ${
                dishState.itemType === 'dish'
                  ? 'border-[#29E7CD] bg-[#29E7CD]/10 text-[#29E7CD]'
                  : 'border-[#2a2a2a] bg-[#0a0a0a] text-gray-400 hover:border-[#29E7CD]/50 hover:text-white'
              }`}
            >
              <Icon icon={UtensilsCrossed} size="sm" />
              <span>Dish</span>
            </button>
            <button
              type="button"
              onClick={() =>
                setDishState(prev => ({
                  ...prev,
                  itemType: 'recipe',
                  sellingPrice: 0, // Recipes don't have selling price
                  yield: prev.yield || 1,
                  yield_unit: prev.yield_unit || 'portion',
                }))
              }
              className={`flex flex-1 items-center justify-center gap-2 rounded-lg border px-4 py-3 font-medium transition-all duration-200 ${
                dishState.itemType === 'recipe'
                  ? 'border-[#3B82F6] bg-[#3B82F6]/10 text-[#3B82F6]'
                  : 'border-[#2a2a2a] bg-[#0a0a0a] text-gray-400 hover:border-[#3B82F6]/50 hover:text-white'
              }`}
            >
              <Icon icon={BookOpen} size="sm" />
              <span>Recipe</span>
            </button>
          </div>
        </div>

        {/* Name */}
        <div>
          <label htmlFor="dish-name" className="mb-2 block text-sm font-medium text-gray-300">
            {dishState.itemType === 'dish' ? 'Dish Name' : 'Recipe Name'} *
          </label>
          <input
            id="dish-name"
            type="text"
            value={dishState.dishName}
            onChange={e =>
              setDishState(prev => ({
                ...prev,
                dishName: e.target.value,
              }))
            }
            placeholder={
              dishState.itemType === 'dish'
                ? 'e.g., Grilled Salmon with Vegetables'
                : 'e.g., Chicken Stir-fry'
            }
            className="w-full rounded-lg border border-[#2a2a2a] bg-[#0a0a0a] px-4 py-2 text-white placeholder-gray-500 focus:border-[#29E7CD] focus:ring-2 focus:ring-[#29E7CD] focus:outline-none"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label
            htmlFor="dish-description"
            className="mb-2 block text-sm font-medium text-gray-300"
          >
            Description (Optional)
          </label>
          <textarea
            id="dish-description"
            value={dishState.description}
            onChange={e =>
              setDishState(prev => ({
                ...prev,
                description: e.target.value,
              }))
            }
            placeholder="Brief description of the dish..."
            rows={3}
            className="w-full rounded-lg border border-[#2a2a2a] bg-[#0a0a0a] px-4 py-2 text-white placeholder-gray-500 focus:border-[#29E7CD] focus:ring-2 focus:ring-[#29E7CD] focus:outline-none"
          />
        </div>

        {/* Recipe-specific fields */}
        {dishState.itemType === 'recipe' && (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="recipe-yield"
                  className="mb-2 block text-sm font-medium text-gray-300"
                >
                  Yield *
                </label>
                <input
                  id="recipe-yield"
                  type="number"
                  value={dishState.yield || 1}
                  onChange={e =>
                    setDishState(prev => ({
                      ...prev,
                      yield: parseInt(e.target.value) || 1,
                    }))
                  }
                  placeholder="1"
                  min="1"
                  className="w-full rounded-lg border border-[#2a2a2a] bg-[#0a0a0a] px-4 py-2 text-white placeholder-gray-500 focus:border-[#29E7CD] focus:ring-2 focus:ring-[#29E7CD] focus:outline-none"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="recipe-yield-unit"
                  className="mb-2 block text-sm font-medium text-gray-300"
                >
                  Yield Unit *
                </label>
                <input
                  id="recipe-yield-unit"
                  type="text"
                  value={dishState.yield_unit || 'portion'}
                  onChange={e =>
                    setDishState(prev => ({
                      ...prev,
                      yield_unit: e.target.value,
                    }))
                  }
                  placeholder="portion"
                  className="w-full rounded-lg border border-[#2a2a2a] bg-[#0a0a0a] px-4 py-2 text-white placeholder-gray-500 focus:border-[#29E7CD] focus:ring-2 focus:ring-[#29E7CD] focus:outline-none"
                  required
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="recipe-instructions"
                className="mb-2 block text-sm font-medium text-gray-300"
              >
                Instructions (Optional)
              </label>
              <textarea
                id="recipe-instructions"
                value={dishState.instructions || ''}
                onChange={e =>
                  setDishState(prev => ({
                    ...prev,
                    instructions: e.target.value,
                  }))
                }
                placeholder="Step-by-step cooking instructions..."
                rows={4}
                className="w-full rounded-lg border border-[#2a2a2a] bg-[#0a0a0a] px-4 py-2 text-white placeholder-gray-500 focus:border-[#29E7CD] focus:ring-2 focus:ring-[#29E7CD] focus:outline-none"
              />
            </div>
          </>
        )}

        {/* Selling Price (Dish only) */}
        {dishState.itemType === 'dish' && (
          <div>
            <label
              htmlFor="dish-price"
              className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-300"
            >
              <Icon icon={DollarSign} size="sm" className="text-[#29E7CD]" aria-hidden={true} />
              Selling Price (incl. GST) *
            </label>
            <div className="flex gap-2">
              <input
                id="dish-price"
                type="number"
                value={dishState.sellingPrice || ''}
                onChange={e =>
                  setDishState(prev => ({
                    ...prev,
                    sellingPrice: parseFloat(e.target.value) || 0,
                  }))
                }
                placeholder="0.00"
                step="0.01"
                min="0"
                className="flex-1 rounded-lg border border-[#2a2a2a] bg-[#0a0a0a] px-4 py-2 text-white placeholder-gray-500 focus:border-[#29E7CD] focus:ring-2 focus:ring-[#29E7CD] focus:outline-none"
                required
              />
              {recommendedPrice > 0 && (
                <button
                  type="button"
                  onClick={handleApplyRecommendedPrice}
                  className="rounded-lg border border-[#29E7CD]/50 bg-[#29E7CD]/10 px-4 py-2 text-sm font-medium text-[#29E7CD] transition-colors hover:bg-[#29E7CD]/20"
                >
                  Use Recommended (${recommendedPrice.toFixed(2)})
                </button>
              )}
            </div>
          </div>
        )}

        {/* Save Button */}
        <div className="pt-4">
          <button
            onClick={onSave}
            disabled={
              saving ||
              !dishState.dishName.trim() ||
              ingredientCount === 0 ||
              (dishState.itemType === 'dish' && dishState.sellingPrice <= 0) ||
              (dishState.itemType === 'recipe' && (!dishState.yield || dishState.yield <= 0))
            }
            className="w-full rounded-2xl bg-gradient-to-r from-[#29E7CD] to-[#D925C7] px-6 py-3 font-medium text-white shadow-lg transition-all duration-200 hover:from-[#29E7CD]/80 hover:to-[#D925C7]/80 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving
              ? 'Saving...'
              : ingredientCount === 0
                ? 'Add Ingredients First'
                : dishState.itemType === 'dish'
                  ? 'Save Dish'
                  : 'Save Recipe'}
          </button>
          {ingredientCount === 0 && (
            <p className="mt-2 text-center text-xs text-gray-400">
              Tap recipes or ingredients from the left panel to start building your{' '}
              {dishState.itemType === 'dish' ? 'dish' : 'recipe'}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

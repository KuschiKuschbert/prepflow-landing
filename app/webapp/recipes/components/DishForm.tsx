'use client';

import { Icon } from '@/components/ui/Icon';
import { X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Dish, Recipe } from '../types';
import { useDishCostCalculation } from '../hooks/useDishCostCalculation';
import DishIngredientSelector from './DishIngredientSelector';
import DishRecipeSelector from './DishRecipeSelector';

interface DishFormProps {
  dish?: Dish | null;
  onClose: () => void;
  onSave: () => void;
}

interface SelectedRecipe {
  recipe_id: string;
  quantity: number;
  recipe_name?: string;
}

interface SelectedIngredient {
  ingredient_id: string;
  quantity: number;
  unit: string;
  ingredient_name?: string;
}

export default function DishForm({ dish, onClose, onSave }: DishFormProps) {
  const [dishName, setDishName] = useState('');
  const [description, setDescription] = useState('');
  const [sellingPrice, setSellingPrice] = useState('');
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [ingredients, setIngredients] = useState<any[]>([]);
  const [selectedRecipes, setSelectedRecipes] = useState<SelectedRecipe[]>([]);
  const [selectedIngredients, setSelectedIngredients] = useState<SelectedIngredient[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [priceOverride, setPriceOverride] = useState(false);

  // Calculate dish cost and recommended price
  const {
    totalCost,
    recommendedPrice,
    foodCostPercent,
    loading: costLoading,
  } = useDishCostCalculation(selectedRecipes, selectedIngredients, recipes, ingredients);

  // Auto-update selling price when cost calculation changes (unless manually overridden or editing existing dish)
  useEffect(() => {
    if (
      !dish &&
      !priceOverride &&
      recommendedPrice > 0 &&
      (selectedRecipes.length > 0 || selectedIngredients.length > 0)
    ) {
      setSellingPrice(recommendedPrice.toFixed(2));
    }
  }, [recommendedPrice, priceOverride, dish, selectedRecipes.length, selectedIngredients.length]);

  useEffect(() => {
    // Fetch recipes and ingredients
    Promise.all([
      fetch('/api/recipes').then(r => r.json()),
      fetch('/api/ingredients?pageSize=1000').then(r => r.json()),
    ]).then(([recipesData, ingredientsData]) => {
      if (recipesData.success) setRecipes(recipesData.recipes || []);
      if (ingredientsData.success) setIngredients(ingredientsData.data?.items || []);
    });

    // Load dish data if editing
    if (dish) {
      setDishName(dish.dish_name);
      setDescription(dish.description || '');
      setSellingPrice(dish.selling_price.toString());
      // Fetch dish details
      fetch(`/api/dishes/${dish.id}`)
        .then(r => r.json())
        .then(data => {
          if (data.success && data.dish) {
            setSelectedRecipes(
              (data.dish.recipes || []).map((r: any) => ({
                recipe_id: r.recipe_id,
                quantity: r.quantity,
                recipe_name: r.recipes?.name,
              })),
            );
            setSelectedIngredients(
              (data.dish.ingredients || []).map((i: any) => ({
                ingredient_id: i.ingredient_id,
                quantity: i.quantity,
                unit: i.unit,
                ingredient_name: i.ingredients?.ingredient_name,
              })),
            );
          }
        });
    }
  }, [dish]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!dishName || !sellingPrice) {
      setError('Dish name and selling price are required');
      setLoading(false);
      return;
    }

    if (selectedRecipes.length === 0 && selectedIngredients.length === 0) {
      setError('Dish must contain at least one recipe or ingredient');
      setLoading(false);
      return;
    }

    try {
      const url = dish ? `/api/dishes/${dish.id}` : '/api/dishes';
      const method = dish ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dish_name: dishName,
          description: description || null,
          selling_price: parseFloat(sellingPrice),
          recipes: selectedRecipes,
          ingredients: selectedIngredients,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error || 'Failed to save dish');
        setLoading(false);
        return;
      }

      onSave();
    } catch (err) {
      setError('Failed to save dish');
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-[#1f1f1f] shadow-2xl">
        <div className="sticky top-0 border-b border-[#2a2a2a] bg-[#1f1f1f] p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">{dish ? 'Edit Dish' : 'Create Dish'}</h2>
            <button
              onClick={onClose}
              className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-[#2a2a2a] hover:text-white"
            >
              <Icon icon={X} size="md" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="mb-4 rounded-lg border border-red-500/20 bg-red-500/10 p-4 text-red-400">
              {error}
            </div>
          )}

          <div className="mb-6">
            <label className="mb-2 block text-sm font-medium text-gray-300">Dish Name *</label>
            <input
              type="text"
              value={dishName}
              onChange={e => setDishName(e.target.value)}
              className="w-full rounded-lg border border-[#2a2a2a] bg-[#0a0a0a] px-4 py-2 text-white focus:border-[#29E7CD] focus:ring-2 focus:ring-[#29E7CD]"
              required
            />
          </div>

          <div className="mb-6">
            <label className="mb-2 block text-sm font-medium text-gray-300">Description</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={3}
              className="w-full rounded-lg border border-[#2a2a2a] bg-[#0a0a0a] px-4 py-2 text-white focus:border-[#29E7CD] focus:ring-2 focus:ring-[#29E7CD]"
            />
          </div>

          <div className="mb-6">
            <div className="mb-2 flex items-center justify-between">
              <label className="block text-sm font-medium text-gray-300">Selling Price *</label>
              {!priceOverride && (selectedRecipes.length > 0 || selectedIngredients.length > 0) && (
                <button
                  type="button"
                  onClick={() => {
                    setPriceOverride(true);
                    setSellingPrice(recommendedPrice.toFixed(2));
                  }}
                  className="text-xs text-[#29E7CD] hover:text-[#29E7CD]/80"
                >
                  Override auto-price
                </button>
              )}
              {priceOverride && (
                <button
                  type="button"
                  onClick={() => {
                    setPriceOverride(false);
                    setSellingPrice(recommendedPrice.toFixed(2));
                  }}
                  className="text-xs text-gray-400 hover:text-gray-300"
                >
                  Use auto-price
                </button>
              )}
            </div>
            <input
              type="number"
              step="0.01"
              min="0"
              value={sellingPrice}
              onChange={e => {
                setSellingPrice(e.target.value);
                setPriceOverride(true);
              }}
              className="w-full rounded-lg border border-[#2a2a2a] bg-[#0a0a0a] px-4 py-2 text-white focus:border-[#29E7CD] focus:ring-2 focus:ring-[#29E7CD]"
              required
            />
            {(selectedRecipes.length > 0 || selectedIngredients.length > 0) && (
              <div className="mt-2 space-y-1 text-xs text-gray-400">
                <div className="flex justify-between">
                  <span>Food Cost:</span>
                  <span className={costLoading ? 'text-gray-500' : 'text-white'}>
                    {costLoading ? 'Calculating...' : `$${totalCost.toFixed(2)}`}
                  </span>
                </div>
                {!priceOverride && (
                  <div className="flex justify-between">
                    <span>Recommended Price:</span>
                    <span className="text-[#29E7CD]">${recommendedPrice.toFixed(2)}</span>
                  </div>
                )}
                {sellingPrice && parseFloat(sellingPrice) > 0 && (
                  <div className="flex justify-between">
                    <span>Food Cost %:</span>
                    <span
                      className={
                        (totalCost / parseFloat(sellingPrice)) * 100 > 35
                          ? 'text-red-400'
                          : (totalCost / parseFloat(sellingPrice)) * 100 > 30
                            ? 'text-yellow-400'
                            : 'text-green-400'
                      }
                    >
                      {((totalCost / parseFloat(sellingPrice)) * 100).toFixed(1)}%
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Recipes Section */}
          <DishRecipeSelector
            recipes={recipes}
            selectedRecipes={selectedRecipes}
            onRecipesChange={setSelectedRecipes}
          />

          {/* Ingredients Section */}
          <DishIngredientSelector
            ingredients={ingredients}
            selectedIngredients={selectedIngredients}
            onIngredientsChange={setSelectedIngredients}
          />

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border border-[#2a2a2a] bg-[#1f1f1f] px-6 py-3 text-white transition-colors hover:bg-[#2a2a2a]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 rounded-lg bg-gradient-to-r from-[#29E7CD] to-[#D925C7] px-6 py-3 font-medium text-white transition-all hover:from-[#29E7CD]/80 hover:to-[#D925C7]/80 disabled:opacity-50"
            >
              {loading ? 'Saving...' : dish ? 'Update Dish' : 'Create Dish'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

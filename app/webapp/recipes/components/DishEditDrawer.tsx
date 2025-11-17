'use client';

import { AutosaveStatus } from '@/components/ui/AutosaveStatus';
import { EditDrawer } from '@/components/ui/EditDrawer';
import { useAutosave } from '@/hooks/useAutosave';
import { deriveAutosaveId } from '@/lib/autosave-id';
import { useNotification } from '@/contexts/NotificationContext';
import { useEffect, useState } from 'react';
import { useDishCostCalculation } from '../hooks/useDishCostCalculation';
import { Dish, Recipe } from '../types';
import DishFormPricing from './DishFormPricing';
import DishIngredientSelector from './DishIngredientSelector';
import DishRecipeSelector from './DishRecipeSelector';
import { logger } from '@/lib/logger';
interface DishEditDrawerProps {
  isOpen: boolean;
  dish: Dish | null;
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

export function DishEditDrawer({ isOpen, dish, onClose, onSave }: DishEditDrawerProps) {
  const { showWarning, showError } = useNotification();
  const [dishName, setDishName] = useState('');
  const [description, setDescription] = useState('');
  const [sellingPrice, setSellingPrice] = useState('');
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [ingredients, setIngredients] = useState<any[]>([]);
  const [selectedRecipes, setSelectedRecipes] = useState<SelectedRecipe[]>([]);
  const [selectedIngredients, setSelectedIngredients] = useState<SelectedIngredient[]>([]);
  const [loading, setLoading] = useState(false);
  const [priceOverride, setPriceOverride] = useState(false);

  // Autosave integration
  const entityId = deriveAutosaveId('dishes', dish?.id, [dishName]);
  const canAutosave = Boolean(dishName && isOpen);

  const {
    status,
    error: autosaveError,
    saveNow,
  } = useAutosave({
    entityType: 'menu_dishes',
    entityId: entityId,
    data: {
      id: dish?.id,
      dish_name: dishName,
      description: description || null,
      selling_price: sellingPrice ? parseFloat(sellingPrice) : 0,
      recipes: selectedRecipes,
      ingredients: selectedIngredients,
    },
    enabled: canAutosave,
  });

  // Calculate dish cost and recommended price
  const {
    totalCost,
    recommendedPrice,
    foodCostPercent,
    loading: costLoading,
  } = useDishCostCalculation(selectedRecipes, selectedIngredients, recipes, ingredients);

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
    if (!isOpen) return;

    setLoading(true);
    Promise.all([
      fetch('/api/recipes').then(r => r.json()),
      fetch('/api/ingredients?pageSize=1000').then(r => r.json()),
    ])
      .then(([recipesData, ingredientsData]) => {
        if (recipesData.success) setRecipes(recipesData.recipes || []);
        if (ingredientsData.success) setIngredients(ingredientsData.data?.items || []);
      })
      .catch(err => {
        logger.error('Failed to fetch recipes/ingredients:', err);
        showError('Failed to load recipes and ingredients');
      });
    if (dish) {
      setDishName(dish.dish_name);
      setDescription(dish.description || '');
      setSellingPrice(dish.selling_price.toString());
      fetch(`/api/dishes/${dish.id}`)
        .then(r => {
          if (!r.ok) {
            throw new Error(`Failed to fetch dish: ${r.status} ${r.statusText}`);
          }
          return r.json();
        })
        .then(data => {
          logger.dev('Dish data loaded:', data); // Debug log
          if (data.success && data.dish) {
            const recipes = (data.dish.recipes || []).map((r: any) => ({
              recipe_id: r.recipe_id,
              quantity: r.quantity || 1,
              recipe_name: r.recipes?.recipe_name,
            }));
            const ingredients = (data.dish.ingredients || []).map((i: any) => ({
              ingredient_id: i.ingredient_id,
              quantity: i.quantity || 0,
              unit: i.unit || 'kg',
              ingredient_name: i.ingredients?.ingredient_name,
            }));
            setSelectedRecipes(recipes);
            setSelectedIngredients(ingredients);
            setLoading(false);
          } else {
            logger.error('Invalid dish data structure:', data);
            showError('Failed to load dish data: Invalid response structure');
            setLoading(false);
          }
        })
        .catch(err => {
          logger.error('Failed to fetch dish details:', err);
          showError('Failed to load dish details. Please try again.');
          setLoading(false);
        });
    } else {
      setDishName('');
      setDescription('');
      setSellingPrice('');
      setSelectedRecipes([]);
      setSelectedIngredients([]);
      setPriceOverride(false);
      setLoading(false);
    }
  }, [dish, isOpen, showError]);

  const handleSave = async () => {
    setLoading(true);

    if (!dishName || !sellingPrice) {
      showWarning('Dish name and selling price are required');
      setLoading(false);
      return;
    }

    if (selectedRecipes.length === 0 && selectedIngredients.length === 0) {
      showWarning('Dish must contain at least one recipe or ingredient');
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
        showError(result.message || result.error || 'Failed to save dish');
        setLoading(false);
        return;
      }

      onSave();
      onClose();
    } catch (err) {
      logger.error('Failed to save dish:', err);
      showError('Failed to save dish');
      setLoading(false);
    }
  };
  useEffect(() => {
    if (!isOpen) {
      setDishName('');
      setDescription('');
      setSellingPrice('');
      setSelectedRecipes([]);
      setSelectedIngredients([]);
      setPriceOverride(false);
    }
  }, [isOpen]);

  return (
    <EditDrawer
      isOpen={isOpen}
      onClose={onClose}
      title={dish ? `Edit ${dish.dish_name}` : 'Create Dish'}
      maxWidth="4xl"
      onSave={handleSave}
      saving={loading || status === 'saving'}
      footer={
        <div className="flex items-center justify-between">
          <AutosaveStatus status={status} error={autosaveError} onRetry={saveNow} />
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-2xl bg-[#2a2a2a] px-4 py-2.5 font-semibold text-white transition-all duration-300 hover:bg-[#3a3a3a]"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={loading || status === 'saving'}
              className="flex-1 rounded-2xl bg-gradient-to-r from-[#29E7CD] to-[#D925C7] px-4 py-2.5 font-semibold text-white transition-all duration-300 hover:shadow-lg hover:shadow-[#29E7CD]/25 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading || status === 'saving' ? 'Saving...' : dish ? 'Update Dish' : 'Create Dish'}
            </button>
          </div>
        </div>
      }
    >
      <form onSubmit={e => e.preventDefault()} className="space-y-6">
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-300">Dish Name *</label>
          <input
            type="text"
            value={dishName}
            onChange={e => setDishName(e.target.value)}
            className="w-full rounded-lg border border-[#2a2a2a] bg-[#0a0a0a] px-4 py-2 text-white focus:border-[#29E7CD] focus:ring-2 focus:ring-[#29E7CD] focus:outline-none"
            required
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-300">Description</label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            rows={3}
            className="w-full rounded-lg border border-[#2a2a2a] bg-[#0a0a0a] px-4 py-2 text-white focus:border-[#29E7CD] focus:ring-2 focus:ring-[#29E7CD] focus:outline-none"
          />
        </div>

        <DishFormPricing
          totalCost={totalCost}
          recommendedPrice={recommendedPrice}
          sellingPrice={sellingPrice}
          costLoading={costLoading}
          priceOverride={priceOverride}
          onPriceChange={setSellingPrice}
          onPriceOverride={() => {
            setPriceOverride(true);
            setSellingPrice(recommendedPrice.toFixed(2));
          }}
          onUseAutoPrice={() => {
            setPriceOverride(false);
            setSellingPrice(recommendedPrice.toFixed(2));
          }}
        />

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
      </form>
    </EditDrawer>
  );
}

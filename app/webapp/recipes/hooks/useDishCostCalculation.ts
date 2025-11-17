import { useEffect, useMemo, useState } from 'react';
import { Recipe } from '../types';
import { logger } from '@/lib/logger';
import {
  calculateRecipeCost,
  calculateRecommendedPrice,
  calculateStandaloneIngredientCost,
} from './utils/dishCostHelpers';

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

interface DishCostCalculation {
  totalCost: number;
  recommendedPrice: number;
  foodCostPercent: number;
  grossProfit: number;
  grossProfitMargin: number;
}

export function useDishCostCalculation(
  selectedRecipes: SelectedRecipe[],
  selectedIngredients: SelectedIngredient[],
  recipes: Recipe[],
  ingredients: any[],
) {
  const [recipeIngredients, setRecipeIngredients] = useState<
    Record<string, Array<{ quantity: number; unit: string; ingredients: any }>>
  >({});
  const [loading, setLoading] = useState(false);

  // Fetch recipe ingredients for cost calculation
  useEffect(() => {
    const fetchRecipeIngredients = async () => {
      const recipeIds = selectedRecipes.map(sr => sr.recipe_id);
      if (recipeIds.length === 0) {
        setRecipeIngredients({});
        return;
      }

      setLoading(true);
      try {
        const response = await fetch('/api/recipes/ingredients/batch', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ recipeIds }),
        });

        const data = await response.json();
        if (data.items) {
          setRecipeIngredients(data.items);
        }
      } catch (err) {
        logger.error('Failed to fetch recipe ingredients:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipeIngredients();
  }, [selectedRecipes.map(sr => sr.recipe_id).join(',')]);

  // Calculate total cost
  const calculation = useMemo<DishCostCalculation>(() => {
    let totalCost = 0;

    // Calculate cost from recipes
    selectedRecipes.forEach(sr => {
      const recipeIngs = recipeIngredients[sr.recipe_id] || [];
      totalCost += calculateRecipeCost(recipeIngs, sr.quantity);
    });

    // Calculate cost from standalone ingredients
    totalCost += calculateStandaloneIngredientCost(selectedIngredients, ingredients);

    // Calculate recommended price
    const pricing = calculateRecommendedPrice(totalCost);

    return {
      totalCost,
      ...pricing,
    };
  }, [selectedRecipes, selectedIngredients, recipeIngredients, ingredients]);

  return {
    ...calculation,
    loading,
  };
}

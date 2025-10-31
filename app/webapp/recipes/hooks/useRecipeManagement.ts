'use client';

import { supabase } from '@/lib/supabase';
import { formatRecipeName } from '@/lib/text-utils';
import { convertIngredientCost } from '@/lib/unit-conversion';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { COGSCalculation, Recipe, RecipeIngredientWithDetails, RecipePriceData } from '../types';

export function useRecipeManagement() {
  const router = useRouter();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recipePrices, setRecipePrices] = useState<Record<string, RecipePriceData>>({});

  // Use centralized formatting utility
  const capitalizeRecipeName = formatRecipeName;

  // Calculate recommended selling price for a recipe
  const calculateRecommendedPrice = useCallback(
    (recipe: Recipe, ingredients: RecipeIngredientWithDetails[]) => {
      if (!ingredients || ingredients.length === 0) return null;

      // Calculate total cost per serving
      let totalCostPerServing = 0;

      ingredients.forEach(ri => {
        const ingredient = ri.ingredients;
        const quantity = ri.quantity;
        // Convert cost to the unit being used in the recipe
        const baseCostPerUnit = ingredient.cost_per_unit;
        const costPerUnit = convertIngredientCost(
          baseCostPerUnit,
          ingredient.unit || 'g',
          ri.unit || 'g',
          ri.quantity,
        );
        const wastePercent = ingredient.trim_peel_waste_percentage || 0;
        const yieldPercent = ingredient.yield_percentage || 100;

        // Calculate cost with waste and yield adjustments
        const baseCost = quantity * costPerUnit;
        const wasteAdjustedCost = baseCost * (1 + wastePercent / 100);
        const yieldAdjustedCost = wasteAdjustedCost / (yieldPercent / 100);

        totalCostPerServing += yieldAdjustedCost;
      });

      // Apply 30% food cost target (industry standard)
      const targetFoodCostPercent = 30;
      const recommendedPrice = totalCostPerServing / (targetFoodCostPercent / 100);

      // Apply charm pricing (round to nearest .95)
      const charmPrice = Math.floor(recommendedPrice) + 0.95;

      return {
        cost_per_serving: totalCostPerServing,
        recommendedPrice: charmPrice,
        foodCostPercent: (totalCostPerServing / charmPrice) * 100,
        selling_price: charmPrice,
        gross_profit: charmPrice - totalCostPerServing,
        gross_profit_margin: ((charmPrice - totalCostPerServing) / charmPrice) * 100,
      };
    },
    [],
  );

  const fetchRecipeIngredients = useCallback(
    async (recipeId: string): Promise<RecipeIngredientWithDetails[]> => {
      try {
        const { data: ingredientsData, error: ingredientsError } = await supabase
          .from('recipe_ingredients')
          .select(
            `
          id,
          recipe_id,
          ingredient_id,
          quantity,
          unit,
          ingredients (
            id,
            ingredient_name,
            cost_per_unit,
            unit,
            trim_peel_waste_percentage,
            yield_percentage
          )
        `,
          )
          .eq('recipe_id', recipeId);

        if (ingredientsError) {
          setError(ingredientsError.message);
          return [];
        }

        return (ingredientsData || []) as unknown as RecipeIngredientWithDetails[];
      } catch (err) {
        setError('Failed to fetch recipe ingredients');
        return [];
      }
    },
    [setError],
  );

  // Calculate prices for all recipes
  const calculateAllRecipePrices = useCallback(
    async (recipesData: Recipe[]) => {
      const prices: Record<string, RecipePriceData> = {};

      for (const recipe of recipesData) {
        try {
          const ingredients = await fetchRecipeIngredients(recipe.id);
          const priceData = calculateRecommendedPrice(recipe, ingredients);
          if (priceData) {
            prices[recipe.id] = priceData;
          }
        } catch (err) {
          console.log(`Failed to calculate price for recipe ${recipe.id}:`, err);
        }
      }

      setRecipePrices(prices);
    },
    [calculateRecommendedPrice, fetchRecipeIngredients],
  );

  const fetchRecipes = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/recipes');
      const result = await response.json();

      if (!response.ok) {
        setError(result.error || 'Failed to fetch recipes');
      } else {
        setRecipes(result.recipes || []);

        // Calculate prices for each recipe
        await calculateAllRecipePrices(result.recipes || []);
      }
    } catch (err) {
      setError('Failed to fetch recipes');
    } finally {
      setLoading(false);
    }
  }, [calculateAllRecipePrices]);

  // Refresh recipe prices (for auto-updates)
  const refreshRecipePrices = useCallback(async () => {
    if (recipes.length === 0) return;

    try {
      await calculateAllRecipePrices(recipes);
    } catch (err) {
      console.log('Failed to refresh recipe prices:', err);
    }
  }, [recipes, calculateAllRecipePrices]);

  const handleEditRecipe = useCallback(
    async (recipe: Recipe) => {
      try {
        // Fetch recipe ingredients
        const ingredients = await fetchRecipeIngredients(recipe.id);

        // Convert to COGSCalculation format
        const calculations: COGSCalculation[] = ingredients.map(ri => {
          const ingredient = ri.ingredients;
          const quantity = ri.quantity;
          const costPerUnit = ingredient.cost_per_unit;
          const totalCost = quantity * costPerUnit;

          // Apply waste and yield adjustments
          const wastePercent = ingredient.trim_peel_waste_percentage || 0;
          const yieldPercent = ingredient.yield_percentage || 100;
          const wasteAdjustedCost = totalCost * (1 + wastePercent / 100);
          const yieldAdjustedCost = wasteAdjustedCost / (yieldPercent / 100);

          return {
            id: ri.id,
            ingredient_id: ingredient.id,
            ingredientId: ingredient.id,
            ingredient_name: ingredient.ingredient_name,
            ingredientName: ingredient.ingredient_name,
            quantity: quantity,
            unit: ri.unit,
            cost_per_unit: costPerUnit,
            total_cost: totalCost,
            yieldAdjustedCost: yieldAdjustedCost,
            supplier_name: ingredient.supplier_name,
            category: ingredient.category,
          };
        });

        // Store data in sessionStorage for COGS page
        sessionStorage.setItem(
          'editingRecipe',
          JSON.stringify({
            recipe,
            calculations,
            dishName: recipe.name,
            dishPortions: recipe.yield,
            dishNameLocked: true,
          }),
        );

        // Navigate to COGS page
        router.push('/webapp/cogs');
      } catch (err) {
        setError('Failed to load recipe for editing');
      }
    },
    [fetchRecipeIngredients, router],
  );

  // Listen for ingredient price changes and update recipe prices automatically
  useEffect(() => {
    if (recipes.length === 0) return;

    // Subscribe to ingredient table changes
    const subscription = supabase
      .channel('ingredient-price-changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'ingredients',
          filter: 'cost_per_unit=neq.null', // Only trigger on cost_per_unit changes
        },
        payload => {
          console.log('Ingredient price changed:', payload);
          // Refresh recipe prices when any ingredient price changes
          refreshRecipePrices();
        },
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [recipes, refreshRecipePrices]);

  useEffect(() => {
    fetchRecipes();
  }, [fetchRecipes]);

  return {
    recipes,
    loading,
    error,
    recipePrices,
    capitalizeRecipeName,
    fetchRecipes,
    fetchRecipeIngredients,
    handleEditRecipe,
    calculateRecommendedPrice,
    calculateAllRecipePrices,
    refreshRecipePrices,
    setError,
  };
}

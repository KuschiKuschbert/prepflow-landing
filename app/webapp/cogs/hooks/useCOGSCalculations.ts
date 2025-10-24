'use client';

import { supabase } from '@/lib/supabase';
import { convertIngredientCost } from '@/lib/unit-conversion';
import { useCallback, useEffect, useState } from 'react';
import { COGSCalculation, Ingredient, Recipe, RecipeIngredient } from '../types';

export const useCOGSCalculations = () => {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<string>('');
  const [recipeIngredients, setRecipeIngredients] = useState<RecipeIngredient[]>([]);
  const [calculations, setCalculations] = useState<COGSCalculation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch ingredients
      const { data: ingredientsData, error: ingredientsError } = await supabase
        .from('ingredients')
        .select('*')
        .order('ingredient_name');

      // Fetch recipes
      const { data: recipesData, error: recipesError } = await supabase
        .from('recipes')
        .select('*')
        .order('name');

      if (ingredientsError) {
        console.log('Ingredients table not found or empty:', ingredientsError.message);
        setIngredients([]);
      } else {
        console.log('Ingredients fetched:', ingredientsData?.length || 0, 'items');
        setIngredients(ingredientsData || []);
      }

      if (recipesError) {
        console.log('Recipes table not found or empty:', recipesError.message);
        setRecipes([]);
      } else {
        setRecipes(recipesData || []);
      }
    } catch (err) {
      setError('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchRecipeIngredients = useCallback(async (recipeId: string) => {
    if (!recipeId) return;

    try {
      const { data, error } = await supabase
        .from('recipe_ingredients')
        .select('*')
        .eq('recipe_id', recipeId);

      if (error) {
        setError(error.message);
      } else {
        setRecipeIngredients(data || []);
        calculateCOGS(data || []);
      }
    } catch (err) {
      setError('Failed to fetch recipe ingredients');
    }
  }, []);

  const calculateCOGS = useCallback(
    (recipeIngredients: RecipeIngredient[]) => {
      const calculations: COGSCalculation[] = recipeIngredients
        .map(ri => {
          const ingredient = ingredients.find(i => i.id === ri.ingredient_id);
          if (!ingredient) return null;

          // Use the correct cost field - prefer cost_per_unit_incl_trim if available, otherwise cost_per_unit
          const baseCostPerUnit =
            ingredient.cost_per_unit_incl_trim || ingredient.cost_per_unit || 0;
          const costPerUnit = convertIngredientCost(
            baseCostPerUnit,
            ingredient.unit || 'g',
            ri.unit || 'g',
            ri.quantity,
          );

          // Calculate base cost for the quantity used
          const totalCost = ri.quantity * costPerUnit;

          // Get waste and yield percentages
          const wastePercent = ingredient.trim_peel_waste_percentage || 0;
          const yieldPercent = ingredient.yield_percentage || 100;

          // Calculate waste-adjusted cost (if not already included in cost_per_unit_incl_trim)
          let wasteAdjustedCost = totalCost;
          if (!ingredient.cost_per_unit_incl_trim && wastePercent > 0) {
            wasteAdjustedCost = totalCost / (1 - wastePercent / 100);
          }

          // Calculate yield-adjusted cost (final cost per usable portion)
          const yieldAdjustedCost = wasteAdjustedCost * (yieldPercent / 100);

          return {
            recipeId: ri.recipe_id || 'temp',
            ingredientId: ri.ingredient_id,
            ingredientName: ingredient.ingredient_name,
            quantity: ri.quantity,
            unit: ri.unit || ingredient.unit || 'kg',
            costPerUnit,
            totalCost,
            wasteAdjustedCost,
            yieldAdjustedCost,
          };
        })
        .filter(Boolean) as COGSCalculation[];

      setCalculations(calculations);
    },
    [ingredients],
  );

  const loadExistingRecipeIngredients = useCallback(async (recipeId: string) => {
    try {
      console.log('Loading ingredients for recipe:', recipeId);

      const { data: recipeIngredients, error } = await supabase
        .from('recipe_ingredients')
        .select(
          `
          id,
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

      if (error) {
        console.log('Error loading recipe ingredients:', error);
        return;
      }

      console.log('Loaded recipe ingredients:', recipeIngredients);

      // Convert to COGSCalculation format
      const loadedCalculations: COGSCalculation[] = recipeIngredients.map(ri => {
        const ingredient = ri.ingredients as any;
        const quantity = ri.quantity;
        const baseCostPerUnit = ingredient.cost_per_unit;
        const costPerUnit = convertIngredientCost(
          baseCostPerUnit,
          ingredient.unit || 'g',
          ri.unit || 'g',
          quantity,
        );
        const totalCost = quantity * costPerUnit;

        // Apply waste and yield adjustments
        const wastePercent = ingredient.trim_peel_waste_percentage || 0;
        const yieldPercent = ingredient.yield_percentage || 100;
        const wasteAdjustedCost = totalCost * (1 + wastePercent / 100);
        const yieldAdjustedCost = wasteAdjustedCost / (yieldPercent / 100);

        return {
          recipeId: recipeId,
          ingredientId: ingredient.id,
          ingredientName: ingredient.ingredient_name,
          quantity: quantity,
          unit: ri.unit,
          costPerUnit: costPerUnit,
          totalCost: totalCost,
          wasteAdjustedCost: wasteAdjustedCost,
          yieldAdjustedCost: yieldAdjustedCost,
        };
      });

      console.log('Converted to calculations:', loadedCalculations);

      setCalculations(loadedCalculations);

      // Also update recipeIngredients state
      const loadedRecipeIngredients: RecipeIngredient[] = recipeIngredients.map(dbItem => {
        const ingredient = dbItem.ingredients as any;
        return {
          id: dbItem.id || 'temp',
          recipe_id: recipeId,
          ingredient_id: ingredient.id,
          ingredient_name: ingredient.ingredient_name,
          quantity: dbItem.quantity,
          unit: dbItem.unit,
          cost_per_unit: ingredient.cost_per_unit || 0,
          total_cost: dbItem.quantity * (ingredient.cost_per_unit || 0),
        };
      });
      setRecipeIngredients(loadedRecipeIngredients);
    } catch (err) {
      console.log('Error in loadExistingRecipeIngredients:', err);
    }
  }, []);

  const checkRecipeExists = useCallback(
    async (recipeName: string) => {
      if (!recipeName.trim()) {
        return null;
      }

      try {
        console.log('Checking for recipe:', recipeName.trim());

        const { data: existingRecipes, error } = await supabase
          .from('recipes')
          .select('id, name')
          .ilike('name', recipeName.trim());

        const existingRecipe =
          existingRecipes && existingRecipes.length > 0 ? existingRecipes[0] : null;

        console.log('Recipe check result:', { existingRecipe, error });

        if (error && error.code === 'PGRST116') {
          console.log('Recipe not found - PGRST116 error');
          return false;
        } else if (existingRecipe) {
          console.log('Recipe found:', existingRecipe);
          await loadExistingRecipeIngredients(existingRecipe.id);
          return true;
        } else {
          console.log('Recipe not found - no data returned');
          return false;
        }
      } catch (err) {
        console.log('Error checking recipe:', err);
        return null;
      }
    },
    [loadExistingRecipeIngredients],
  );

  const updateCalculation = useCallback(
    (ingredientId: string, newQuantity: number) => {
      setCalculations(prev =>
        prev.map(calc => {
          if (calc.ingredientId === ingredientId) {
            const ingredient = ingredients.find(ing => ing.id === ingredientId);
            if (ingredient) {
              const newTotalCost = newQuantity * calc.costPerUnit;
              const wastePercent = ingredient.trim_peel_waste_percentage || 0;
              const yieldPercent = ingredient.yield_percentage || 100;
              const newWasteAdjustedCost = newTotalCost * (1 + wastePercent / 100);
              const newYieldAdjustedCost = newWasteAdjustedCost / (yieldPercent / 100);

              return {
                ...calc,
                quantity: newQuantity,
                totalCost: newTotalCost,
                wasteAdjustedCost: newWasteAdjustedCost,
                yieldAdjustedCost: newYieldAdjustedCost,
              };
            }
          }
          return calc;
        }),
      );
    },
    [ingredients],
  );

  const removeCalculation = useCallback((ingredientId: string) => {
    setCalculations(prev => prev.filter(calc => calc.ingredientId !== ingredientId));
  }, []);

  const addCalculation = useCallback((calculation: COGSCalculation) => {
    setCalculations(prev => [...prev, calculation]);
  }, []);

  const clearCalculations = useCallback(() => {
    setCalculations([]);
    setRecipeIngredients([]);
  }, []);

  // Auto-fetch when selectedRecipe changes
  useEffect(() => {
    if (selectedRecipe) {
      fetchRecipeIngredients(selectedRecipe);
    }
  }, [selectedRecipe, fetchRecipeIngredients]);

  // Recalculate when ingredients change
  useEffect(() => {
    if (recipeIngredients.length > 0) {
      calculateCOGS(recipeIngredients);
    }
  }, [recipeIngredients, calculateCOGS]);

  return {
    // State
    ingredients,
    recipes,
    selectedRecipe,
    recipeIngredients,
    calculations,
    loading,
    error,

    // Actions
    fetchData,
    fetchRecipeIngredients,
    calculateCOGS,
    loadExistingRecipeIngredients,
    checkRecipeExists,
    updateCalculation,
    removeCalculation,
    addCalculation,
    clearCalculations,
    setSelectedRecipe,
    setError,
  };
};

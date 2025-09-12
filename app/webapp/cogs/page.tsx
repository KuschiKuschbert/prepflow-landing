'use client';

import { supabase } from '@/lib/supabase';
import { useEffect, useState, useMemo } from 'react';
import { convertIngredientCost, convertUnit } from '@/lib/unit-conversion';
import { formatDishName } from '@/lib/text-utils';
import { PageSkeleton } from '@/components/ui/LoadingSkeleton';

interface Ingredient {
  id: string;
  ingredient_name: string;
  unit?: string;
  cost_per_unit: number;
  cost_per_unit_as_purchased?: number;
  cost_per_unit_incl_trim?: number;
  trim_peel_waste_percentage?: number;
  yield_percentage?: number;
}

interface Recipe {
  id: string;
  name: string;
  yield?: number;
}

interface RecipeIngredient {
  recipe_id: string;
  ingredient_id: string;
  quantity: number;
  unit?: string;
}

interface COGSCalculation {
  recipeId: string;
  ingredientId: string;
  ingredientName: string;
  quantity: number;
  unit: string;
  costPerUnit: number;
  totalCost: number;
  wasteAdjustedCost: number;
  yieldAdjustedCost: number;
}

export default function COGSPage() {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<string>('');
  const [recipeIngredients, setRecipeIngredients] = useState<RecipeIngredient[]>([]);
  const [calculations, setCalculations] = useState<COGSCalculation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showAddIngredient, setShowAddIngredient] = useState(false);
  const [recipeExists, setRecipeExists] = useState<boolean | null>(null);
  const [checkingRecipe, setCheckingRecipe] = useState(false);
  const [dishNameLocked, setDishNameLocked] = useState(false);
  const [editingIngredient, setEditingIngredient] = useState<string | null>(null);
  const [editQuantity, setEditQuantity] = useState<number>(0);
  const [dishName, setDishName] = useState<string>('');
  const [dishPortions, setDishPortions] = useState<number>(1);
  const [ingredientSearch, setIngredientSearch] = useState<string>('');
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const [selectedIngredient, setSelectedIngredient] = useState<Ingredient | null>(null);
  const [newIngredient, setNewIngredient] = useState<Partial<RecipeIngredient>>({
    ingredient_id: '',
    quantity: 0,
    unit: 'kg',
  });

  // Costing Tool State
  const [targetGrossProfit, setTargetGrossProfit] = useState<number>(70); // Default 70% GP
  const [sellPriceExclGST, setSellPriceExclGST] = useState<number>(0);
  const [sellPriceInclGST, setSellPriceInclGST] = useState<number>(0);
  const [pricingStrategy, setPricingStrategy] = useState<'charm' | 'whole' | 'real'>('charm');

  useEffect(() => {
    fetchData();
  }, []);

  // Handle editing data from recipe book
  useEffect(() => {
    const editingData = sessionStorage.getItem('editingRecipe');
    if (editingData) {
      try {
        const { recipe, recipeId, calculations, dishName, dishPortions, dishNameLocked } = JSON.parse(editingData);
        
        console.log('🔍 DEBUG: Loading from sessionStorage with recipeId:', { 
          dishName, 
          recipeId, 
          calculationsCount: calculations.length 
        });
        
        // Set the editing data
        setDishName(dishName);
        setDishPortions(dishPortions);
        setDishNameLocked(dishNameLocked);
        setCalculations(calculations);
        
        // Convert calculations back to recipeIngredients format
        const recipeIngredientsData: RecipeIngredient[] = calculations.map((calc: any) => ({
          recipe_id: calc.recipeId,
          ingredient_id: calc.ingredientId,
          quantity: calc.quantity,
          unit: calc.unit
        }));
        setRecipeIngredients(recipeIngredientsData);
        
        // Set recipe exists to true since we have the specific recipe
        setRecipeExists(true);
        
        // Clear the session storage
        sessionStorage.removeItem('editingRecipe');
        
        // Show success message
        setSuccessMessage(`Recipe "${dishName}" loaded for editing!`);
        setTimeout(() => setSuccessMessage(null), 3000);
        
      } catch (err) {
        console.log('Failed to parse editing data:', err);
      }
    }
  }, []);

  useEffect(() => {
    if (selectedRecipe) {
      fetchRecipeIngredients();
    }
  }, [selectedRecipe]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      // Don't close if clicking on suggestions or search input
      if (!target.closest('.ingredient-search-container') && !target.closest('.suggestions-dropdown')) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchData = async () => {
    try {
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
        setIngredients([]); // Set empty array instead of showing error
      } else {
        console.log('Ingredients fetched:', ingredientsData?.length || 0, 'items');
        setIngredients(ingredientsData || []);
      }

      if (recipesError) {
        console.log('Recipes table not found or empty:', recipesError.message);
        setRecipes([]); // Set empty array instead of showing error
      } else {
        setRecipes(recipesData || []);
      }
    } catch (err) {
      setError('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const fetchRecipeIngredients = async () => {
    if (!selectedRecipe) return;

    try {
      const { data, error } = await supabase
        .from('recipe_ingredients')
        .select('*')
        .eq('recipe_id', selectedRecipe);

      if (error) {
        setError(error.message);
      } else {
        setRecipeIngredients(data || []);
        calculateCOGS(data || []);
      }
    } catch (err) {
      setError('Failed to fetch recipe ingredients');
    }
  };

  const calculateCOGS = (recipeIngredients: RecipeIngredient[]) => {
    const calculations: COGSCalculation[] = recipeIngredients.map(ri => {
      const ingredient = ingredients.find(i => i.id === ri.ingredient_id);
      if (!ingredient) return null;

      // Use the correct cost field - prefer cost_per_unit_incl_trim if available, otherwise cost_per_unit
      // Convert cost to the unit being used in the recipe
      const baseCostPerUnit = ingredient.cost_per_unit_incl_trim || ingredient.cost_per_unit || 0;
      const costPerUnit = convertIngredientCost(
        baseCostPerUnit,
        ingredient.unit || 'g',
        ri.unit || 'g',
        ingredient.ingredient_name
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

      // Debug logging
      console.log(`COGS Calculation for ${ingredient.ingredient_name}:`, {
        quantity: ri.quantity,
        unit: ri.unit || ingredient.unit,
        costPerUnit,
        totalCost,
        wastePercent,
        yieldPercent,
        wasteAdjustedCost,
        yieldAdjustedCost,
        hasInclTrim: !!ingredient.cost_per_unit_incl_trim
      });

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
    }).filter(Boolean) as COGSCalculation[];

    setCalculations(calculations);
  };

  // Load existing recipe ingredients
  const loadExistingRecipeIngredients = async (recipeId: string) => {
    try {
      console.log('Loading ingredients for recipe:', recipeId);
      
      const { data: recipeIngredients, error } = await supabase
        .from('recipe_ingredients')
        .select(`
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
        `)
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
        // Convert cost to the unit being used in the recipe
        const baseCostPerUnit = ingredient.cost_per_unit;
        const costPerUnit = convertIngredientCost(
          baseCostPerUnit,
          ingredient.unit || 'g',
          ri.unit || 'g',
          ingredient.ingredient_name
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
          yieldAdjustedCost: yieldAdjustedCost
        };
      });

      console.log('Converted to calculations:', loadedCalculations);
      
      // Set the calculations to show existing ingredients
      setCalculations(loadedCalculations);
      
      // Also update recipeIngredients state so new ingredients can be added to existing ones
      const loadedRecipeIngredients: RecipeIngredient[] = recipeIngredients.map(dbItem => ({
        recipe_id: recipeId,
        ingredient_id: (dbItem.ingredients as any).id,
        quantity: dbItem.quantity,
        unit: dbItem.unit
      }));
      setRecipeIngredients(loadedRecipeIngredients);
      
      // Also set the dish portions from the recipe
      const { data: recipeData } = await supabase
        .from('recipes')
        .select('yield')
        .eq('id', recipeId)
        .single();
      
      if (recipeData) {
        setDishPortions(recipeData.yield || 1);
      }
      
    } catch (err) {
      console.log('Error in loadExistingRecipeIngredients:', err);
    }
  };

  // Check if recipe exists
  const checkRecipeExists = async (recipeName: string) => {
    if (!recipeName.trim()) {
      setRecipeExists(null);
      return;
    }

    setCheckingRecipe(true);
    try {
      console.log('Checking for recipe:', recipeName.trim());
      
      const { data: existingRecipes, error } = await supabase
        .from('recipes')
        .select('id, name')
        .ilike('name', recipeName.trim());
      
      const existingRecipe = existingRecipes && existingRecipes.length > 0 ? existingRecipes[0] : null;

      console.log('Recipe check result:', { existingRecipe, error });

      if (error && error.code === 'PGRST116') {
        // No rows found - recipe doesn't exist
        console.log('Recipe not found - PGRST116 error');
        setRecipeExists(false);
      } else if (existingRecipe) {
        // Recipe exists - load its ingredients
        console.log('Recipe found:', existingRecipe);
        setRecipeExists(true);
        
        // Load the existing recipe's ingredients
        await loadExistingRecipeIngredients(existingRecipe.id);
      } else {
        console.log('Recipe not found - no data returned');
        setRecipeExists(false);
      }
    } catch (err) {
      console.log('Error checking recipe:', err);
      setRecipeExists(null);
    } finally {
      setCheckingRecipe(false);
    }
  };


  // Debounced recipe check (only for manual dish name entry, not when editing from recipe book)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (dishName.trim() && !dishNameLocked) {
        console.log('🔍 DEBUG: Running recipe check for:', dishName);
        checkRecipeExists(dishName);
      } else if (!dishName.trim()) {
        setRecipeExists(null);
      } else {
        console.log('🔍 DEBUG: Skipping recipe check - dish name locked (editing from recipe book)');
      }
    }, 500); // 500ms delay

    return () => clearTimeout(timeoutId);
  }, [dishName, dishNameLocked]);

  // Handle editing ingredient quantity
  const handleEditIngredient = (ingredientId: string, currentQuantity: number) => {
    setEditingIngredient(ingredientId);
    setEditQuantity(currentQuantity);
  };

  // Save edited ingredient quantity
  const handleSaveEdit = () => {
    if (editingIngredient && editQuantity > 0) {
      setCalculations(prev => prev.map(calc => {
        if (calc.ingredientId === editingIngredient) {
          // Get the original ingredient data to recalculate properly
          const ingredient = ingredients.find(ing => ing.id === editingIngredient);
          if (ingredient) {
            const newTotalCost = editQuantity * calc.costPerUnit;
            const wastePercent = ingredient.trim_peel_waste_percentage || 0;
            const yieldPercent = ingredient.yield_percentage || 100;
            const newWasteAdjustedCost = newTotalCost * (1 + wastePercent / 100);
            const newYieldAdjustedCost = newWasteAdjustedCost / (yieldPercent / 100);
            
            return {
              ...calc,
              quantity: editQuantity,
              totalCost: newTotalCost,
              wasteAdjustedCost: newWasteAdjustedCost,
              yieldAdjustedCost: newYieldAdjustedCost
            };
          }
        }
        return calc; // Return unchanged for other ingredients
      }));
    }
    setEditingIngredient(null);
    setEditQuantity(0);
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setEditingIngredient(null);
    setEditQuantity(0);
  };

  // Remove ingredient from calculations
  const handleRemoveIngredient = (ingredientId: string) => {
    setCalculations(prev => prev.filter(calc => calc.ingredientId !== ingredientId));
  };

  // Use centralized formatting utility
  const capitalizeRecipeName = formatDishName;

  // Use the comprehensive unit conversion utility from lib/unit-conversion.ts

  const handleSaveAsRecipe = async () => {
    if (calculations.length === 0) {
      setError('No calculations to save. Please calculate COGS first.');
      return;
    }

    const rawRecipeName = dishName || prompt('Enter a name for this recipe:');
    if (!rawRecipeName) return;
    
    const recipeName = capitalizeRecipeName(rawRecipeName);

    try {
      // Check if recipe already exists (case-insensitive)
      const { data: existingRecipes, error: checkError } = await supabase
        .from('recipes')
        .select('id, name')
        .ilike('name', recipeName);

      console.log('Recipe check results:', { existingRecipes, checkError, recipeName });

      let recipeData;
      const existingRecipe = existingRecipes && existingRecipes.length > 0 ? existingRecipes[0] : null;
      
      console.log('Existing recipe found:', existingRecipe);
      
      if (existingRecipe && !checkError) {
        // Recipe exists - update it
        const recipePortions = dishPortions || 1;
        
        const { data: updatedRecipe, error: updateError } = await supabase
          .from('recipes')
          .update({
            yield: recipePortions,
            yield_unit: 'servings',
            updated_at: new Date().toISOString()
          })
          .eq('id', existingRecipe.id)
          .select()
          .single();

        if (updateError) {
          setError(updateError.message);
          return;
        }
        
        recipeData = updatedRecipe;
      } else {
        // Recipe doesn't exist - create new one
        const recipePortions = dishPortions || 1;
        
        const { data: newRecipe, error: createError } = await supabase
        .from('recipes')
        .insert({
          name: recipeName,
            yield: recipePortions,
            yield_unit: 'servings'
        })
        .select()
        .single();

        if (createError) {
          setError(createError.message);
        return;
      }

        recipeData = newRecipe;
      }

      // Handle recipe ingredients
      const recipeIngredientInserts = calculations.map(calc => ({
        recipe_id: recipeData.id,
        ingredient_id: calc.ingredientId,
        quantity: calc.quantity,
        unit: calc.unit
      }));

      if (existingRecipe && !checkError) {
        // Recipe exists - replace all ingredients (delete old ones first, then insert new ones)
        
        // First, delete all existing ingredients for this recipe
        const { error: deleteError } = await supabase
          .from('recipe_ingredients')
          .delete()
          .eq('recipe_id', existingRecipe.id);

        if (deleteError) {
          setError(deleteError.message);
          return;
        }

        // Then insert the current ingredients (complete updated recipe)
      const { error: ingredientsError } = await supabase
        .from('recipe_ingredients')
        .insert(recipeIngredientInserts);

      if (ingredientsError) {
        setError(ingredientsError.message);
        return;
      }
      } else {
        // New recipe - insert all ingredients
        const { error: ingredientsError } = await supabase
          .from('recipe_ingredients')
          .insert(recipeIngredientInserts);

        if (ingredientsError) {
          setError(ingredientsError.message);
          return;
        }
      }

      // Clear any existing error and show success message
      setError(null);
      const actionText = existingRecipe && !checkError ? 'updated' : 'saved';
      setSuccessMessage(`Recipe "${recipeName}" ${actionText} successfully to Recipe Book!`);
      
      // Unlock dish name after successful save
      setDishNameLocked(false);
      
      // Clear success message after 5 seconds
      setTimeout(() => setSuccessMessage(null), 5000);
      
      // Refresh recipes list (don't let this error affect the success message)
      try {
        await fetchData();
      } catch (fetchErr) {
        console.log('Failed to refresh recipes list:', fetchErr);
        // Don't show error for this - the recipe was saved successfully
      }
      
    } catch (err) {
      console.log('Recipe save error:', err);
      setError('Failed to save recipe');
      setSuccessMessage(null); // Clear any success message if there was an error
      setDishNameLocked(false); // Unlock dish name on error
    }
  };

  // Pricing Calculation Functions
  const calculateRecommendedPrices = (foodCost: number, targetGP: number) => {
    // Calculate sell price excluding GST based on target gross profit
    // GP% = (Sell Price - Food Cost) / Sell Price * 100
    // Solving for Sell Price: Sell Price = Food Cost / (1 - GP/100)
    const sellPriceExclGST = foodCost / (1 - targetGP / 100);
    
    // Calculate GST (10% in Australia) on the base price
    const gstAmount = sellPriceExclGST * 0.10;
    const sellPriceInclGST = sellPriceExclGST + gstAmount;
    
    // Apply pricing strategy to the GST-inclusive price (menu price)
    let finalPriceInclGST = sellPriceInclGST;
    
    switch (pricingStrategy) {
      case 'charm':
        // Charm pricing: round to .95 or .99
        const charmRounded = Math.ceil(sellPriceInclGST);
        finalPriceInclGST = charmRounded - 0.01;
        break;
      case 'whole':
        // Whole number pricing: round up to nearest dollar
        finalPriceInclGST = Math.ceil(sellPriceInclGST);
        break;
      case 'real':
        // Real price: keep exact calculation
        finalPriceInclGST = sellPriceInclGST;
        break;
    }
    
    // Calculate the GST-exclusive price from the final menu price
    const finalPriceExclGST = finalPriceInclGST / 1.10;
    const finalGstAmount = finalPriceInclGST - finalPriceExclGST;
    
    // Calculate contributing margin (Revenue - Food Cost)
    const contributingMargin = finalPriceExclGST - foodCost;
    const contributingMarginPercent = (contributingMargin / finalPriceExclGST) * 100;
    
    return {
      sellPriceExclGST: finalPriceExclGST,
      sellPriceInclGST: finalPriceInclGST,
      gstAmount: finalGstAmount,
      actualGrossProfit: ((finalPriceExclGST - foodCost) / finalPriceExclGST) * 100,
      grossProfitDollar: finalPriceExclGST - foodCost,
      contributingMargin: contributingMargin,
      contributingMarginPercent: contributingMarginPercent
    };
  };


  const handleIngredientSelect = (ingredient: Ingredient) => {
    console.log('Ingredient selected:', ingredient.ingredient_name);
    setSelectedIngredient(ingredient);
    setNewIngredient({
      ...newIngredient,
      ingredient_id: ingredient.id,
      unit: ingredient.unit || 'kg',
    });
    setIngredientSearch(ingredient.ingredient_name);
    setShowSuggestions(false);
  };

  const handleSearchChange = (value: string) => {
    setIngredientSearch(value);
    setShowSuggestions(value.length > 0);
    setSelectedIngredient(null);
    setNewIngredient({
      ...newIngredient,
      ingredient_id: '',
    });
  };

  const handleAddIngredient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIngredient.ingredient_id || !newIngredient.quantity) {
      setError('Please select an ingredient and enter a quantity');
      return;
    }

    try {
      // Check if ingredient already exists
      const existingIngredient = recipeIngredients.find(
        ri => ri.ingredient_id === newIngredient.ingredient_id
      );

      if (existingIngredient) {
        // Update existing ingredient quantity with automatic unit conversion
        const selectedIngredientData = ingredients.find(ing => ing.id === newIngredient.ingredient_id);
        if (selectedIngredientData) {
          // Automatic unit conversion: convert user input to ingredient's base unit
          let convertedQuantity = newIngredient.quantity!;
          let convertedUnit = newIngredient.unit || 'kg';
          let conversionNote = '';

          // If user entered volume units but ingredient is measured by weight (or vice versa)
          const userUnit = (newIngredient.unit || 'kg').toLowerCase().trim();
          const ingredientUnit = (selectedIngredientData.unit || 'kg').toLowerCase().trim();
          
          // Volume units
          const volumeUnits = ['tsp', 'teaspoon', 'tbsp', 'tablespoon', 'cup', 'cups', 'ml', 'milliliter', 'l', 'liter', 'litre', 'fl oz', 'fluid ounce'];
          // Weight units  
          const weightUnits = ['g', 'gm', 'gram', 'grams', 'kg', 'kilogram', 'oz', 'ounce', 'lb', 'pound', 'mg', 'milligram'];
          
          const isUserVolume = volumeUnits.includes(userUnit);
          const isUserWeight = weightUnits.includes(userUnit);
          const isIngredientVolume = volumeUnits.includes(ingredientUnit);
          const isIngredientWeight = weightUnits.includes(ingredientUnit);

          // Convert if there's a mismatch between user input and ingredient base unit
          if ((isUserVolume && isIngredientWeight) || (isUserWeight && isIngredientVolume)) {
            const conversionResult = convertUnit(newIngredient.quantity!, newIngredient.unit || 'kg', selectedIngredientData.unit || 'kg');
            convertedQuantity = newIngredient.quantity! * conversionResult.conversionFactor;
            convertedUnit = selectedIngredientData.unit || 'kg';
            conversionNote = ` (converted from ${newIngredient.quantity} ${newIngredient.unit || 'kg'})`;
          }

          setRecipeIngredients(prev => prev.map(ri => 
            ri.ingredient_id === newIngredient.ingredient_id
              ? { ...ri, quantity: ri.quantity + convertedQuantity }
              : ri
          ));
          
          // Also update the calculations state to reflect the new quantity
          setCalculations(prev => prev.map(calc => {
            if (calc.ingredientId === newIngredient.ingredient_id) {
              const newQuantity = calc.quantity + convertedQuantity;
              const newTotalCost = newQuantity * calc.costPerUnit;
              const newWasteAdjustedCost = newTotalCost * (1 + (calc.wasteAdjustedCost / calc.totalCost - 1));
              const newYieldAdjustedCost = newWasteAdjustedCost / (calc.yieldAdjustedCost / calc.wasteAdjustedCost);
              
              return {
                ...calc,
                ingredientName: calc.ingredientName.includes('(converted from') ? calc.ingredientName : calc.ingredientName + conversionNote,
                quantity: newQuantity,
                totalCost: newTotalCost,
                wasteAdjustedCost: newWasteAdjustedCost,
                yieldAdjustedCost: newYieldAdjustedCost
              };
            }
            return calc;
          }));
        }
      } else {
        // Add new ingredient with automatic unit conversion
        const selectedIngredientData = ingredients.find(ing => ing.id === newIngredient.ingredient_id);
        if (selectedIngredientData) {
          // Automatic unit conversion: convert user input to ingredient's base unit
          let convertedQuantity = newIngredient.quantity!;
          let convertedUnit = newIngredient.unit || 'kg';
          let conversionNote = '';

          // If user entered volume units but ingredient is measured by weight (or vice versa)
          const userUnit = (newIngredient.unit || 'kg').toLowerCase().trim();
          const ingredientUnit = (selectedIngredientData.unit || 'kg').toLowerCase().trim();
          
          // Volume units
          const volumeUnits = ['tsp', 'teaspoon', 'tbsp', 'tablespoon', 'cup', 'cups', 'ml', 'milliliter', 'l', 'liter', 'litre', 'fl oz', 'fluid ounce'];
          // Weight units  
          const weightUnits = ['g', 'gm', 'gram', 'grams', 'kg', 'kilogram', 'oz', 'ounce', 'lb', 'pound', 'mg', 'milligram'];
          
          const isUserVolume = volumeUnits.includes(userUnit);
          const isUserWeight = weightUnits.includes(userUnit);
          const isIngredientVolume = volumeUnits.includes(ingredientUnit);
          const isIngredientWeight = weightUnits.includes(ingredientUnit);

          // Convert if there's a mismatch between user input and ingredient base unit
          if ((isUserVolume && isIngredientWeight) || (isUserWeight && isIngredientVolume)) {
            const conversionResult = convertUnit(newIngredient.quantity!, newIngredient.unit || 'kg', selectedIngredientData.unit || 'kg');
            convertedQuantity = newIngredient.quantity! * conversionResult.conversionFactor;
            convertedUnit = selectedIngredientData.unit || 'kg';
            conversionNote = ` (converted from ${newIngredient.quantity} ${newIngredient.unit || 'kg'})`;
          }

          const ingredientToAdd: RecipeIngredient = {
            recipe_id: selectedRecipe || 'temp',
            ingredient_id: newIngredient.ingredient_id!,
            quantity: convertedQuantity,
            unit: convertedUnit,
          };

          setRecipeIngredients(prev => [...prev, ingredientToAdd]);
          
          // Also add to calculations state for immediate UI update
          const quantity = convertedQuantity;
          // Convert cost to the unit being used in the recipe
          const baseCostPerUnit = selectedIngredientData.cost_per_unit;
          const costPerUnit = convertIngredientCost(
            baseCostPerUnit,
            selectedIngredientData.unit || 'g',
            convertedUnit,
            selectedIngredientData.ingredient_name
          );
          const totalCost = quantity * costPerUnit;
          
          // Apply waste and yield adjustments
          const wastePercent = selectedIngredientData.trim_peel_waste_percentage || 0;
          const yieldPercent = selectedIngredientData.yield_percentage || 100;
          const wasteAdjustedCost = totalCost * (1 + wastePercent / 100);
          const yieldAdjustedCost = wasteAdjustedCost / (yieldPercent / 100);
          
          const newCalculation: COGSCalculation = {
            recipeId: selectedRecipe || 'temp',
            ingredientId: newIngredient.ingredient_id!,
            ingredientName: selectedIngredientData.ingredient_name + conversionNote,
            quantity: quantity,
            unit: convertedUnit,
            costPerUnit: costPerUnit,
            totalCost: totalCost,
            wasteAdjustedCost: wasteAdjustedCost,
            yieldAdjustedCost: yieldAdjustedCost
          };
          
          setCalculations(prev => [...prev, newCalculation]);
        }
      }
      
      // Reset form
      setNewIngredient({
        ingredient_id: '',
        quantity: 0,
        unit: 'kg',
      });
      setIngredientSearch('');
      setSelectedIngredient(null);
      setShowSuggestions(false);
      
    } catch (err) {
      setError('Failed to add ingredient');
    }
  };

  const totalCOGS = calculations.reduce((sum, calc) => sum + calc.yieldAdjustedCost, 0);
  const costPerPortion = dishPortions > 0 ? totalCOGS / dishPortions : 0;

  // Calculate pricing when COGS changes
  useEffect(() => {
    if (costPerPortion > 0) {
      const pricing = calculateRecommendedPrices(costPerPortion, targetGrossProfit);
      setSellPriceExclGST(pricing.sellPriceExclGST);
      setSellPriceInclGST(pricing.sellPriceInclGST);
    }
  }, [costPerPortion, targetGrossProfit, pricingStrategy]);

  // Live search with Material Design 3 guidelines - instant filtering
  const filteredIngredients = useMemo(() => {
    console.log('Filtering ingredients:', ingredients.length, 'total, search:', ingredientSearch);
    
    if (!ingredientSearch.trim()) {
      const result = ingredients.slice(0, 50); // Show first 50 ingredients when no search
      console.log('No search term, returning first 50:', result.length);
      return result;
    }
    
    const searchTerm = ingredientSearch.toLowerCase().trim();
    const filtered = ingredients
      .filter(ingredient => 
        ingredient.ingredient_name.toLowerCase().includes(searchTerm) ||
        (ingredient.unit && ingredient.unit.toLowerCase().includes(searchTerm))
      )
      .sort((a, b) => {
        // Prioritize exact matches and starts-with matches
        const aName = a.ingredient_name.toLowerCase();
        const bName = b.ingredient_name.toLowerCase();
        
        if (aName.startsWith(searchTerm) && !bName.startsWith(searchTerm)) return -1;
        if (!aName.startsWith(searchTerm) && bName.startsWith(searchTerm)) return 1;
        if (aName === searchTerm && bName !== searchTerm) return -1;
        if (aName !== searchTerm && bName === searchTerm) return 1;
        
        return aName.localeCompare(bName);
      })
      .slice(0, 20); // Limit to 20 results for performance
    
    console.log('Search results:', filtered.length, 'matches for', searchTerm);
    return filtered;
  }, [ingredients, ingredientSearch]);

  // Debug suggestions visibility
  useEffect(() => {
    console.log('Suggestions state:', {
      showSuggestions,
      ingredientSearch,
      filteredIngredientsCount: filteredIngredients.length,
      ingredientsCount: ingredients.length
    });
  }, [showSuggestions, ingredientSearch, filteredIngredients.length, ingredients.length]);

  if (loading) {
    return <PageSkeleton />;
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            💰 COGS Calculator
          </h1>
          <p className="text-gray-400">Calculate Cost of Goods Sold and optimize your profit margins</p>
        </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {successMessage && (
        <div className="bg-gradient-to-r from-green-500 to-emerald-500 border-2 border-green-400 text-white px-6 py-5 rounded-2xl mb-6 shadow-2xl animate-in slide-in-from-top-2 duration-500 transform scale-105 hover:scale-110 transition-all duration-300">
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center animate-pulse">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <div className="flex-1">
              <p className="font-bold text-lg text-white">{successMessage}</p>
              <p className="text-sm text-green-100 mt-1 font-medium">🎉 Your recipe has been added to the Recipe Book and is ready to use!</p>
            </div>
            <button
              onClick={() => setSuccessMessage(null)}
              className="flex-shrink-0 text-white/80 hover:text-white hover:bg-white/20 rounded-full p-2 transition-all duration-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8">
        {/* Dish Creation */}
        <div className="bg-[#1f1f1f] p-4 sm:p-6 rounded-lg shadow">
          <h2 className="text-lg sm:text-xl font-semibold mb-6">Create Dish</h2>
          
          {/* Dish Name Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              🍽️ Dish Name
            </label>
            <div className="relative">
            <input
              type="text"
              placeholder="Enter dish name (e.g., Chicken Curry)"
              value={dishName}
                onChange={(e) => setDishName(capitalizeRecipeName(e.target.value))}
                disabled={dishNameLocked}
                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-200 shadow-sm hover:shadow-md ${
                  dishNameLocked
                    ? 'border-blue-400 bg-[#1a1a1a] text-gray-300 cursor-not-allowed'
                    : recipeExists === true 
                      ? 'border-orange-400 bg-[#0a0a0a] text-white focus:ring-orange-400 focus:border-orange-400' 
                      : recipeExists === false 
                        ? 'border-green-400 bg-[#0a0a0a] text-white focus:ring-green-400 focus:border-green-400'
                        : 'border-[#2a2a2a] bg-[#0a0a0a] text-white focus:ring-[#29E7CD] focus:border-[#29E7CD]'
                }`}
              />
              {dishNameLocked && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
              )}
          </div>

            {/* Recipe Status Indicator */}
            {dishName.trim() && (
              <div className="mt-2 flex items-center space-x-2">
                {checkingRecipe ? (
                  <div className="flex items-center space-x-2 text-gray-400">
                    <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-sm">Checking...</span>
                  </div>
                ) : recipeExists === true ? (
                  <div className="flex items-center space-x-2 text-orange-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                    <span className="text-sm font-medium">⚠️ Recipe exists - ingredients loaded, will update existing recipe</span>
                  </div>
                ) : recipeExists === false ? (
                  <div className="flex items-center space-x-2 text-green-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm font-medium">✅ New recipe - will create new recipe</span>
                  </div>
                ) : null}
              </div>
            )}
            
            {/* Lock Status Indicator */}
            {dishNameLocked && (
              <div className="mt-2 flex items-center space-x-2 text-blue-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span className="text-sm font-medium">🔒 Dish name locked - editing ingredients</span>
              </div>
            )}
          </div>


          {/* Add Ingredients Section - Primary */}
          <div className="mb-6">
            <div className="bg-gradient-to-r from-[#29E7CD]/10 to-[#D925C7]/10 border border-[#29E7CD]/30 p-4 rounded-2xl">
            <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-1">🥘 Add Ingredients</h3>
                  <p className="text-sm text-gray-400">Add ingredients manually to build your dish</p>
                  <p className="text-xs text-[#29E7CD] mt-1">✨ Automatic unit conversion: Use any unit (tsp, tbsp, cups, ml, g, kg) - we'll convert to the ingredient's base unit!</p>
                </div>
              <button
                  onClick={() => {
                    setShowAddIngredient(!showAddIngredient);
                    // Lock dish name when starting to add ingredients
                    if (!showAddIngredient && dishName.trim()) {
                      setDishNameLocked(true);
                    }
                    // Unlock dish name when canceling add ingredient
                    if (showAddIngredient) {
                      setDishNameLocked(false);
                    }
                  }}
                  className="bg-gradient-to-r from-[#29E7CD] to-[#D925C7] text-white px-6 py-3 rounded-xl text-sm font-medium hover:from-[#29E7CD]/80 hover:to-[#D925C7]/80 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center space-x-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <span>{showAddIngredient ? 'Cancel' : 'Add Ingredient'}</span>
              </button>
            </div>

              {showAddIngredient && (
                <form onSubmit={handleAddIngredient} className="space-y-3 p-4 bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg">
                  <div className="relative ingredient-search-container">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      🔍 Search & Select Ingredient
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Type to search ingredients..."
                        value={ingredientSearch}
                        onChange={(e) => handleSearchChange(e.target.value)}
                        onFocus={() => setShowSuggestions(ingredientSearch.length > 0)}
                        className="w-full max-w-md pl-10 pr-4 py-3 border border-[#2a2a2a] bg-[#0a0a0a] text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-[#29E7CD] focus:border-[#29E7CD] transition-all duration-200 shadow-sm hover:shadow-md"
                      />
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </div>
                      {ingredientSearch && (
                        <button
                          onClick={() => handleSearchChange('')}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white transition-colors"
                        >
                          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      )}
                    </div>
                    {ingredientSearch && (
                      <div className="mt-2 text-xs text-gray-400">
                        {filteredIngredients.length} ingredient{filteredIngredients.length !== 1 ? 's' : ''} found
                      </div>
                    )}
                  </div>
                  {/* Autocomplete Suggestions */}
                  {showSuggestions && filteredIngredients.length > 0 && (
                    <div className="absolute z-10 w-full max-w-md mt-1 bg-[#1f1f1f] border border-[#2a2a2a] rounded-xl shadow-lg max-h-60 overflow-y-auto suggestions-dropdown">
                      {filteredIngredients.slice(0, 10).map((ingredient) => {
                        const displayCost = ingredient.cost_per_unit_incl_trim || ingredient.cost_per_unit || 0;
                        return (
                          <button
                            key={ingredient.id}
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              console.log('Button clicked for:', ingredient.ingredient_name);
                              handleIngredientSelect(ingredient);
                            }}
                            className="w-full px-4 py-3 text-left hover:bg-[#2a2a2a] transition-colors border-b border-[#2a2a2a] last:border-b-0"
                          >
                            <div className="flex justify-between items-center">
                              <div>
                                <div className="text-white font-medium">{ingredient.ingredient_name}</div>
                                <div className="text-xs text-gray-400">
                                  {ingredient.unit && `${ingredient.unit} • `}
                                  ${displayCost.toFixed(2)}/{ingredient.unit || 'unit'}
                                </div>
                              </div>
                              <div className="text-[#29E7CD] text-sm">
                                {ingredient.trim_peel_waste_percentage ? `${ingredient.trim_peel_waste_percentage}% waste` : 'No waste'}
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                  
                  {/* No results message */}
                  {showSuggestions && filteredIngredients.length === 0 && ingredientSearch && (
                    <div className="absolute z-10 w-full mt-1 p-3 bg-[#1f1f1f] border border-[#2a2a2a] rounded-xl shadow-lg">
                      <p className="text-sm text-gray-400 text-center">
                        🔍 No ingredients found matching "{ingredientSearch}"
                      </p>
                      <p className="text-xs text-gray-500 text-center mt-1">
                        Try a different search term or add the ingredient to your list first
                      </p>
                    </div>
                  )}
                  
                  {/* Selected ingredient info */}
                  {selectedIngredient && (
                    <div className="mt-2 p-3 bg-[#29E7CD]/10 border border-[#29E7CD]/20 rounded-lg">
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="text-[#29E7CD] font-medium">✓ {selectedIngredient.ingredient_name}</div>
                          <div className="text-xs text-gray-400">
                            ${(selectedIngredient.cost_per_unit_incl_trim || selectedIngredient.cost_per_unit || 0).toFixed(2)}/{selectedIngredient.unit || 'unit'}
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleSearchChange('')}
                          className="text-gray-400 hover:text-white transition-colors"
                        >
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  )}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        ⚖️ Quantity
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        required
                        value={newIngredient.quantity}
                        onChange={(e) => setNewIngredient({ ...newIngredient, quantity: parseFloat(e.target.value) })}
                        onFocus={(e) => {
                          // Clear the field if it's 0 when focused
                          if (newIngredient.quantity === 0) {
                            e.target.select(); // Select all text so user can type over it
                          }
                        }}
                        className="w-full px-4 py-3 border border-[#2a2a2a] bg-[#0a0a0a] text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-[#29E7CD] focus:border-[#29E7CD] transition-all duration-200 shadow-sm hover:shadow-md"
                        placeholder="0.00"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        📏 Unit
                      </label>
                      <div className="relative">
                        <select
                          value={newIngredient.unit}
                          onChange={(e) => setNewIngredient({ ...newIngredient, unit: e.target.value })}
                          className="w-full px-4 py-3 border border-[#2a2a2a] bg-[#0a0a0a] text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-[#29E7CD] focus:border-[#29E7CD] transition-all duration-200 shadow-sm hover:shadow-md appearance-none cursor-pointer"
                        >
                          <option value="kg">kg</option>
                          <option value="g">g</option>
                          <option value="L">L</option>
                          <option value="mL">mL</option>
                          <option value="pcs">pcs</option>
                          <option value="box">box</option>
                          <option value="GM">GM</option>
                          <option value="PC">PC</option>
                          <option value="PACK">PACK</option>
                          <option value="BAG">BAG</option>
                        </select>
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                          <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-[#29E7CD] to-[#3B82F6] text-white px-6 py-3 rounded-xl hover:from-[#29E7CD]/80 hover:to-[#3B82F6]/80 transition-all duration-200 shadow-lg hover:shadow-xl font-medium flex items-center justify-center space-x-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <span>Add Ingredient to Dish</span>
                  </button>
                </form>
              )}
            </div>

            {/* Recipe Selection - Secondary Option */}
            <div className="mt-6 pt-4 border-t border-[#2a2a2a]/50">
              <div className="bg-gradient-to-r from-[#D925C7]/10 to-[#29E7CD]/10 border border-[#D925C7]/30 p-4 rounded-2xl">
                <div className="mb-4">
                  <h3 className="text-xl font-semibold text-white mb-1">📚 Or Select Existing Recipe</h3>
                  <p className="text-sm text-gray-400">Choose a recipe to load ingredients automatically</p>
                </div>
                <select
                  value={selectedRecipe}
                  onChange={(e) => setSelectedRecipe(e.target.value)}
                  className="w-full px-4 py-3 border border-[#2a2a2a] bg-[#0a0a0a] text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D925C7] focus:border-[#D925C7] transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  <option value="">Create new dish from scratch...</option>
                  {recipes.map((recipe) => (
                    <option key={recipe.id} value={recipe.id}>
                      {recipe.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Number of Portions - Moved to End */}
            <div className="mt-6 pt-4 border-t border-[#2a2a2a]/50">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                🍽️ Number of Portions
              </label>
              <div className="flex items-center space-x-3">
                <input
                  type="number"
                  min="1"
                  placeholder="1"
                  value={dishPortions}
                  onChange={(e) => setDishPortions(Number(e.target.value))}
                  className="w-24 px-4 py-3 border border-[#2a2a2a] bg-[#0a0a0a] text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-[#29E7CD] focus:border-[#29E7CD] transition-all duration-200 shadow-sm hover:shadow-md text-center font-semibold"
                />
                <span className="text-sm text-gray-400">portions</span>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                This determines the cost per portion for your pricing calculations
              </p>
            </div>
            </div>
        </div>

        {/* COGS Calculation */}
        <div className="bg-[#1f1f1f] p-4 sm:p-6 rounded-lg shadow">
          <h2 className="text-lg sm:text-xl font-semibold mb-4">Cost Analysis</h2>
          
          {calculations.length > 0 ? (
            <div className="space-y-4">
              {/* Mobile Card Layout */}
              <div className="block md:hidden">
                <div className="space-y-3">
                  {calculations.map((calc, index) => (
                    <div key={index} className="p-3 bg-[#2a2a2a] rounded-lg border border-[#3a3a3a]">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="text-sm font-medium text-white">
                          {calc.ingredientName}
                        </h4>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-bold text-[#29E7CD]">
                          ${calc.yieldAdjustedCost.toFixed(2)}
                        </span>
                          <button
                            onClick={() => handleEditIngredient(calc.ingredientId, calc.quantity)}
                            className="p-1 text-gray-400 hover:text-[#29E7CD] transition-colors duration-200"
                            title="Edit quantity"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleRemoveIngredient(calc.ingredientId)}
                            className="p-1 text-gray-400 hover:text-red-400 transition-colors duration-200"
                            title="Remove ingredient"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                      </div>
                      </div>
                      {editingIngredient === calc.ingredientId ? (
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <input
                              type="number"
                              value={editQuantity}
                              onChange={(e) => setEditQuantity(parseFloat(e.target.value) || 0)}
                              className="w-20 px-2 py-1 text-sm border border-[#3a3a3a] bg-[#0a0a0a] text-white rounded focus:outline-none focus:ring-1 focus:ring-[#29E7CD]"
                              step="0.1"
                              min="0"
                            />
                            <span className="text-xs text-gray-400">{calc.unit}</span>
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={handleSaveEdit}
                              className="px-3 py-1 text-xs bg-[#29E7CD] text-white rounded hover:bg-[#29E7CD]/80 transition-colors duration-200"
                            >
                              Save
                            </button>
                            <button
                              onClick={handleCancelEdit}
                              className="px-3 py-1 text-xs bg-gray-600 text-white rounded hover:bg-gray-500 transition-colors duration-200"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <p className="text-xs text-gray-400">
                        {calc.quantity} {calc.unit}
                      </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Desktop Table Layout */}
              <div className="hidden md:block overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                        Ingredient
                      </th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                        Qty
                      </th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                        Cost
                      </th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-[#1f1f1f] divide-y divide-gray-200">
                    {calculations.map((calc, index) => (
                      <tr key={index} className="hover:bg-[#2a2a2a]/50 transition-colors duration-200">
                        <td className="px-3 py-2 text-sm text-white">
                          {calc.ingredientName}
                        </td>
                        <td className="px-3 py-2 text-sm text-gray-500">
                          {editingIngredient === calc.ingredientId ? (
                            <div className="flex items-center space-x-2">
                              <input
                                type="number"
                                value={editQuantity}
                                onChange={(e) => setEditQuantity(parseFloat(e.target.value) || 0)}
                                className="w-20 px-2 py-1 text-sm border border-[#3a3a3a] bg-[#0a0a0a] text-white rounded focus:outline-none focus:ring-1 focus:ring-[#29E7CD]"
                                step="0.1"
                                min="0"
                              />
                              <span className="text-xs text-gray-400">{calc.unit}</span>
                            </div>
                          ) : (
                            <span>{calc.quantity} {calc.unit}</span>
                          )}
                        </td>
                        <td className="px-3 py-2 text-sm text-gray-500">
                          ${calc.yieldAdjustedCost.toFixed(2)}
                        </td>
                        <td className="px-3 py-2 text-sm">
                          <div className="flex items-center space-x-2">
                            {editingIngredient === calc.ingredientId ? (
                              <>
                                <button
                                  onClick={handleSaveEdit}
                                  className="px-2 py-1 text-xs bg-[#29E7CD] text-white rounded hover:bg-[#29E7CD]/80 transition-colors duration-200"
                                >
                                  Save
                                </button>
                                <button
                                  onClick={handleCancelEdit}
                                  className="px-2 py-1 text-xs bg-gray-600 text-white rounded hover:bg-gray-500 transition-colors duration-200"
                                >
                                  Cancel
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  onClick={() => handleEditIngredient(calc.ingredientId, calc.quantity)}
                                  className="p-1 text-gray-400 hover:text-[#29E7CD] transition-colors duration-200"
                                  title="Edit quantity"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                  </svg>
                                </button>
                                <button
                                  onClick={() => handleRemoveIngredient(calc.ingredientId)}
                                  className="p-1 text-gray-400 hover:text-red-400 transition-colors duration-200"
                                  title="Remove ingredient"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                  </svg>
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-lg font-medium text-white">Total COGS:</span>
                  <span className="text-lg font-bold text-[#29E7CD]">
                    ${totalCOGS.toFixed(2)}
                  </span>
                </div>
                {dishPortions > 0 && (
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-sm text-gray-400">Cost per portion:</span>
                    <span className="text-sm font-medium text-white">
                      ${costPerPortion.toFixed(2)}
                    </span>
                  </div>
                )}
                
                {/* Comprehensive Costing Tool */}
                {costPerPortion > 0 && (
                  <div className="mt-6 pt-4 border-t border-[#2a2a2a]">
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                        💰 Costing Tool
                        <div className="ml-2 w-2 h-2 bg-[#29E7CD] rounded-full animate-pulse"></div>
                      </h3>
                      
                      {/* Target Gross Profit Selector */}
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          🎯 Target Gross Profit %
                        </label>
                        <div className="flex space-x-2">
                          {[60, 65, 70, 75, 80].map((gp) => (
                            <button
                              key={gp}
                              onClick={() => setTargetGrossProfit(gp)}
                              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                                targetGrossProfit === gp
                                  ? 'bg-gradient-to-r from-[#29E7CD] to-[#D925C7] text-white shadow-lg'
                                  : 'bg-[#2a2a2a] text-gray-300 hover:bg-[#2a2a2a]/80'
                              }`}
                            >
                              {gp}%
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Pricing Strategy Selector */}
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          📊 Pricing Strategy
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                          <button
                            onClick={() => setPricingStrategy('charm')}
                            className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                              pricingStrategy === 'charm'
                                ? 'bg-gradient-to-r from-[#29E7CD] to-[#D925C7] text-white shadow-lg'
                                : 'bg-[#2a2a2a] text-gray-300 hover:bg-[#2a2a2a]/80'
                            }`}
                          >
                            Charm ($19.95)
                          </button>
                          <button
                            onClick={() => setPricingStrategy('whole')}
                            className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                              pricingStrategy === 'whole'
                                ? 'bg-gradient-to-r from-[#29E7CD] to-[#D925C7] text-white shadow-lg'
                                : 'bg-[#2a2a2a] text-gray-300 hover:bg-[#2a2a2a]/80'
                            }`}
                          >
                            Whole ($20)
                          </button>
                          <button
                            onClick={() => setPricingStrategy('real')}
                            className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                              pricingStrategy === 'real'
                                ? 'bg-gradient-to-r from-[#29E7CD] to-[#D925C7] text-white shadow-lg'
                                : 'bg-[#2a2a2a] text-gray-300 hover:bg-[#2a2a2a]/80'
                            }`}
                          >
                            Real ($19.47)
                          </button>
                        </div>
                      </div>


                      {/* Pricing Results */}
                      <div className="bg-gradient-to-br from-[#29E7CD]/10 to-[#D925C7]/10 border border-[#29E7CD]/30 p-4 rounded-2xl">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Food Cost */}
                          <div className="bg-[#2a2a2a]/30 p-3 rounded-xl border border-[#2a2a2a]/50">
                            <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Food Cost</div>
                            <div className="text-xl font-bold text-white">
                              ${costPerPortion.toFixed(2)}
                            </div>
                            <div className="text-xs text-gray-400">per portion</div>
                          </div>

                          {/* Sell Price Excl GST */}
                          <div className="bg-[#2a2a2a]/30 p-3 rounded-xl border border-[#2a2a2a]/50">
                            <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Sell Price (Excl GST)</div>
                            <div className="text-xl font-bold text-[#29E7CD]">
                              ${sellPriceExclGST.toFixed(2)}
                            </div>
                            <div className="text-xs text-gray-400">for your records</div>
                          </div>

                          {/* Sell Price Incl GST */}
                          <div className="bg-[#2a2a2a]/30 p-3 rounded-xl border border-[#2a2a2a]/50">
                            <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Menu Price (Incl GST)</div>
                            <div className="text-xl font-bold text-[#D925C7]">
                              ${sellPriceInclGST.toFixed(2)}
                            </div>
                            <div className="text-xs text-gray-400">what customer pays</div>
                          </div>

                          {/* Gross Profit */}
                          <div className="bg-[#2a2a2a]/30 p-3 rounded-xl border border-[#2a2a2a]/50">
                            <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Gross Profit</div>
                            <div className="text-xl font-bold text-green-400">
                              ${(sellPriceExclGST - costPerPortion).toFixed(2)}
                            </div>
                            <div className="text-xs text-gray-400">
                              {(((sellPriceExclGST - costPerPortion) / sellPriceExclGST) * 100).toFixed(1)}% margin
                            </div>
                          </div>
                        </div>

                        {/* Contributing Margin Section */}
                        <div className="mt-4 pt-4 border-t border-[#2a2a2a]/50">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Contributing Margin */}
                            <div className="bg-gradient-to-br from-[#D925C7]/20 to-[#29E7CD]/20 p-3 rounded-xl border border-[#D925C7]/30">
                              <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Contributing Margin</div>
                              <div className="text-xl font-bold text-[#D925C7]">
                                ${(sellPriceExclGST - costPerPortion).toFixed(2)}
                              </div>
                              <div className="text-xs text-gray-400">
                                {(((sellPriceExclGST - costPerPortion) / sellPriceExclGST) * 100).toFixed(1)}% of revenue
                              </div>
                            </div>

                            {/* Contributing Margin Explanation */}
                            <div className="bg-[#2a2a2a]/30 p-3 rounded-xl border border-[#2a2a2a]/50">
                              <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Formula</div>
                              <div className="text-sm text-gray-400">
                                <strong className="text-[#D925C7]">Revenue - Food Cost</strong>
                              </div>
                              <div className="text-xs text-gray-500 mt-1">
                                Amount available to cover fixed costs and generate profit
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* GST Breakdown */}
                        <div className="mt-4 pt-3 border-t border-[#2a2a2a]/50">
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-400">GST Amount (10%):</span>
                            <span className="text-white font-medium">
                              ${((sellPriceInclGST - sellPriceExclGST)).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Save as Recipe Button */}
                <div className="mt-4 pt-4 border-t border-[#2a2a2a]">
                  <button
                    onClick={handleSaveAsRecipe}
                    className="w-full bg-gradient-to-r from-[#D925C7] to-[#29E7CD] text-white px-4 py-3 rounded-lg hover:from-[#D925C7]/80 hover:to-[#29E7CD]/80 transition-all duration-200 shadow-lg hover:shadow-xl font-medium"
                  >
                    💾 Save as Recipe in Recipe Book
                  </button>
                  <p className="text-xs text-gray-400 mt-2 text-center">
                    This will save the current COGS calculation as a recipe in your Recipe Book
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              {selectedRecipe ? 'No ingredients added to this recipe yet.' : 'Select a recipe to calculate COGS.'}
            </div>
          )}
        </div>
      </div>

      {recipes.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">📊</div>
          <h3 className="text-lg font-medium text-white mb-2">No recipes available</h3>
          <p className="text-gray-500 mb-4">
            Create some recipes first to calculate their COGS.
          </p>
          <a
            href="/webapp/recipes"
            className="bg-gradient-to-r from-[#29E7CD] to-[#D925C7] text-white px-4 py-2 rounded-lg hover:from-[#29E7CD]/80 hover:to-[#D925C7]/80 transition-colors"
          >
            Go to Recipes
          </a>
        </div>
      )}
      </div>
    </div>
  );
}

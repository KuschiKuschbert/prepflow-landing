'use client';

import { supabase } from '@/lib/supabase';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { convertIngredientCost } from '@/lib/unit-conversion';
import { formatRecipeName } from '@/lib/text-utils';

interface Recipe {
  id: string;
  name: string;
  yield: number;
  yield_unit: string;
  instructions?: string;
  created_at: string;
  updated_at: string;
}

interface RecipeIngredient {
  id: string;
  recipe_id: string;
  ingredient_id: string;
  quantity: number;
  unit: string;
  ingredients: {
    id: string;
    ingredient_name: string;
    cost_per_unit: number;
    unit: string;
    trim_peel_waste_percentage: number;
    yield_percentage: number;
  };
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

export default function RecipesPage() {
  const router = useRouter();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Use centralized formatting utility
  const capitalizeRecipeName = formatRecipeName;

  // Calculate recommended selling price for a recipe
  const calculateRecommendedPrice = (recipe: Recipe, ingredients: RecipeIngredient[]) => {
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
        ingredient.ingredient_name
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
      costPerServing: totalCostPerServing,
      recommendedPrice: charmPrice,
      foodCostPercent: (totalCostPerServing / charmPrice) * 100
    };
  };
  const [showAddForm, setShowAddForm] = useState(false);
  const [newRecipe, setNewRecipe] = useState<Partial<Recipe>>({
    name: '',
    yield: 1,
    yield_unit: 'servings',
    instructions: '',
  });
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [recipeIngredients, setRecipeIngredients] = useState<RecipeIngredient[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [aiInstructions, setAiInstructions] = useState<string>('');
  const [generatingInstructions, setGeneratingInstructions] = useState(false);
  const [previewYield, setPreviewYield] = useState<number>(1);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [recipeToDelete, setRecipeToDelete] = useState<Recipe | null>(null);
  const [selectedRecipes, setSelectedRecipes] = useState<Set<string>>(new Set());
  const [showBulkDeleteConfirm, setShowBulkDeleteConfirm] = useState(false);
  const [recipePrices, setRecipePrices] = useState<Record<string, {costPerServing: number, recommendedPrice: number, foodCostPercent: number}>>({});
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const [shareLoading, setShareLoading] = useState(false);

  useEffect(() => {
    fetchRecipes();
  }, []);

  // Listen for ingredient price changes and update recipe prices automatically
  useEffect(() => {
    if (recipes.length === 0) return;

    // Subscribe to ingredient table changes
    const subscription = supabase
      .channel('ingredient-price-changes')
      .on('postgres_changes', 
        { 
          event: 'UPDATE', 
          schema: 'public', 
          table: 'ingredients',
          filter: 'cost_per_unit=neq.null' // Only trigger on cost_per_unit changes
        }, 
        (payload) => {
          console.log('Ingredient price changed:', payload);
          // Refresh recipe prices when any ingredient price changes
          refreshRecipePrices();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [recipes]);

  const fetchRecipes = async () => {
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
  };

  // Calculate prices for all recipes
  const calculateAllRecipePrices = async (recipesData: Recipe[]) => {
    const prices: Record<string, {costPerServing: number, recommendedPrice: number, foodCostPercent: number}> = {};
    
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
  };

  // Refresh recipe prices (for auto-updates)
  const refreshRecipePrices = async () => {
    if (recipes.length === 0) return;
    
    try {
      await calculateAllRecipePrices(recipes);
    } catch (err) {
      console.log('Failed to refresh recipe prices:', err);
    }
  };

  const fetchRecipeIngredients = async (recipeId: string) => {
    try {
      const { data: ingredientsData, error: ingredientsError } = await supabase
        .from('recipe_ingredients')
        .select(`
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
        `)
        .eq('recipe_id', recipeId);

      if (ingredientsError) {
        setError(ingredientsError.message);
        return [];
      }

      return (ingredientsData || []) as unknown as RecipeIngredient[];
    } catch (err) {
      setError('Failed to fetch recipe ingredients');
      return [];
    }
  };

  const handleAddRecipe = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from('recipes')
        .insert([newRecipe]);

      if (error) {
        setError(error.message);
      } else {
        setShowAddForm(false);
        setNewRecipe({
          name: '',
          yield: 1,
          yield_unit: 'servings',
          instructions: '',
        });
        fetchRecipes();
      }
    } catch (err) {
      setError('Failed to add recipe');
    }
  };

  const handleEditRecipe = async (recipe: Recipe) => {
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
          recipeId: recipe.id,
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

      // Store data in sessionStorage for COGS page
      sessionStorage.setItem('editingRecipe', JSON.stringify({
        recipe,
        calculations,
        dishName: recipe.name,
        dishPortions: recipe.yield,
        dishNameLocked: true
      }));

      // Navigate to COGS page
      router.push('/webapp/cogs');
    } catch (err) {
      setError('Failed to load recipe for editing');
    }
  };

  const handleEditFromPreview = () => {
    if (!selectedRecipe || !recipeIngredients.length) {
      setError('No recipe data available for editing');
      return;
    }

    try {
      console.log('🔍 DEBUG: Recipe ingredients from preview:', recipeIngredients);
      console.log('🔍 DEBUG: Selected recipe:', selectedRecipe);

      // Convert already loaded recipe ingredients to COGSCalculation format
      const calculations: COGSCalculation[] = recipeIngredients.map(ri => {
        const ingredient = ri.ingredients;
        const quantity = ri.quantity;
        const costPerUnit = ingredient.cost_per_unit;
        const totalCost = quantity * costPerUnit;

        // Apply waste and yield adjustments
        const wastePercent = ingredient.trim_peel_waste_percentage || 0;
        const yieldPercent = ingredient.yield_percentage || 100;
        const wasteAdjustedCost = totalCost * (1 + wastePercent / 100);
        const yieldAdjustedCost = wasteAdjustedCost / (yieldPercent / 100);

        console.log('🔍 DEBUG: Converting ingredient:', {
          ingredientName: ingredient.ingredient_name,
          quantity: quantity,
          unit: ri.unit,
          costPerUnit: costPerUnit
        });

        return {
          recipeId: selectedRecipe.id,
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

      console.log('🔍 DEBUG: Final calculations array:', calculations);

      // Store data in sessionStorage for COGS page
      sessionStorage.setItem('editingRecipe', JSON.stringify({
        recipe: selectedRecipe,
        recipeId: selectedRecipe.id, // Pass the specific recipe ID
        calculations,
        dishName: selectedRecipe.name,
        dishPortions: selectedRecipe.yield,
        dishNameLocked: true
      }));

      // Close the preview modal
      setShowPreview(false);

      // Navigate to COGS page
      router.push('/webapp/cogs');
    } catch (err) {
      console.error('❌ Error in handleEditFromPreview:', err);
      setError('Failed to load recipe for editing');
    }
  };

  const handlePreviewRecipe = async (recipe: Recipe) => {
    try {
      console.log('🔍 DEBUG: Fetching ingredients for recipe:', recipe.name, recipe.id);
      const ingredients = await fetchRecipeIngredients(recipe.id);
      console.log('🔍 DEBUG: Fetched ingredients:', ingredients);
      setSelectedRecipe(recipe);
      setRecipeIngredients(ingredients);
      setPreviewYield(recipe.yield); // Initialize with original yield
      setShowPreview(true);
      
      // Generate AI instructions
      await generateAIInstructions(recipe, ingredients);
    } catch (err) {
      console.error('❌ Error in handlePreviewRecipe:', err);
      setError('Failed to load recipe preview');
    }
  };

  const calculateTotalCost = () => {
    return recipeIngredients.reduce((total, ri) => {
      const ingredient = ri.ingredients;
      const quantity = ri.quantity;
      const costPerUnit = ingredient.cost_per_unit;
      const totalCost = quantity * costPerUnit;

      // Apply waste and yield adjustments
      const wastePercent = ingredient.trim_peel_waste_percentage || 0;
      const yieldPercent = ingredient.yield_percentage || 100;
      const wasteAdjustedCost = totalCost * (1 + wastePercent / 100);
      const yieldAdjustedCost = wasteAdjustedCost / (yieldPercent / 100);

      return total + yieldAdjustedCost;
    }, 0);
  };

  const calculateAdjustedQuantity = (originalQuantity: number) => {
    if (!selectedRecipe) return originalQuantity;
    const multiplier = previewYield / selectedRecipe.yield;
    return originalQuantity * multiplier;
  };

  const formatQuantity = (quantity: number, unit: string) => {
    const adjustedQuantity = calculateAdjustedQuantity(quantity);
    
    // Smart conversions for common units
    if (unit.toLowerCase() === 'gm' || unit.toLowerCase() === 'g' || unit.toLowerCase() === 'gram') {
      if (adjustedQuantity >= 1000) {
        return {
          value: (adjustedQuantity / 1000).toFixed(1),
          unit: 'kg',
          original: `${adjustedQuantity.toFixed(1)} ${unit}`
        };
      }
    }
    
    if (unit.toLowerCase() === 'ml' || unit.toLowerCase() === 'milliliter') {
      if (adjustedQuantity >= 1000) {
        return {
          value: (adjustedQuantity / 1000).toFixed(1),
          unit: 'L',
          original: `${adjustedQuantity.toFixed(1)} ${unit}`
        };
      }
    }
    
    if (unit.toLowerCase() === 'mg' || unit.toLowerCase() === 'milligram') {
      if (adjustedQuantity >= 1000) {
        return {
          value: (adjustedQuantity / 1000).toFixed(1),
          unit: 'g',
          original: `${adjustedQuantity.toFixed(1)} ${unit}`
        };
      }
    }
    
    if (unit.toLowerCase() === 'kg' || unit.toLowerCase() === 'kilogram') {
      if (adjustedQuantity >= 1000) {
        return {
          value: (adjustedQuantity / 1000).toFixed(1),
          unit: 'tonne',
          original: `${adjustedQuantity.toFixed(1)} ${unit}`
        };
      }
    }
    
    if (unit.toLowerCase() === 'l' || unit.toLowerCase() === 'liter' || unit.toLowerCase() === 'litre') {
      if (adjustedQuantity >= 1000) {
        return {
          value: (adjustedQuantity / 1000).toFixed(1),
          unit: 'kL',
          original: `${adjustedQuantity.toFixed(1)} ${unit}`
        };
      }
    }
    
    // For smaller quantities, show more precision
    if (adjustedQuantity < 1) {
      return {
        value: adjustedQuantity.toFixed(2),
        unit: unit,
        original: `${adjustedQuantity.toFixed(2)} ${unit}`
      };
    }
    
    // Default formatting
    return {
      value: adjustedQuantity.toFixed(1),
      unit: unit,
      original: `${adjustedQuantity.toFixed(1)} ${unit}`
    };
  };

  const generateAIInstructions = async (recipe: Recipe, ingredients: RecipeIngredient[]) => {
    console.log('🤖 DEBUG: Generating AI instructions for:', recipe.name);
    console.log('🤖 DEBUG: Ingredients:', ingredients);
    setGeneratingInstructions(true);
    try {
      // Analyze ingredients to determine cooking method
      const ingredientNames = ingredients.map(ri => ri.ingredients.ingredient_name.toLowerCase());
      console.log('🤖 DEBUG: Ingredient names:', ingredientNames);
      const hasProtein = ingredientNames.some(name => 
        name.includes('beef') || name.includes('chicken') || name.includes('pork') || 
        name.includes('fish') || name.includes('lamb') || name.includes('mince')
      );
      const hasVegetables = ingredientNames.some(name => 
        name.includes('carrot') || name.includes('onion') || name.includes('garlic') ||
        name.includes('tomato') || name.includes('pepper') || name.includes('celery')
      );
      const hasDairy = ingredientNames.some(name => 
        name.includes('cheese') || name.includes('milk') || name.includes('cream') ||
        name.includes('butter') || name.includes('yogurt')
      );
      const hasGrains = ingredientNames.some(name => 
        name.includes('rice') || name.includes('pasta') || name.includes('bread') ||
        name.includes('flour') || name.includes('quinoa')
      );

      // Determine recipe type and cooking method
      let recipeType = 'general';
      let cookingMethod = 'stovetop';
      let primaryTechnique = 'sautéing';

      if (recipe.name.toLowerCase().includes('burger') || recipe.name.toLowerCase().includes('patty')) {
        recipeType = 'burger';
        cookingMethod = 'grill/pan';
        primaryTechnique = 'grilling/pan-frying';
      } else if (recipe.name.toLowerCase().includes('soup') || recipe.name.toLowerCase().includes('stew')) {
        recipeType = 'soup';
        cookingMethod = 'stovetop';
        primaryTechnique = 'simmering';
      } else if (recipe.name.toLowerCase().includes('salad')) {
        recipeType = 'salad';
        cookingMethod = 'cold prep';
        primaryTechnique = 'mixing';
      } else if (recipe.name.toLowerCase().includes('pasta') || recipe.name.toLowerCase().includes('noodle')) {
        recipeType = 'pasta';
        cookingMethod = 'stovetop';
        primaryTechnique = 'boiling/sautéing';
      }

      // Generate specific instructions based on recipe analysis
      let generatedInstructions = '';

      if (recipeType === 'burger') {
        generatedInstructions = `**Burger Preparation:**

**Mise en Place:**
1. Gather all ingredients and equipment
2. Prepare work station with cutting board, knives, and mixing bowls
3. Preheat ${cookingMethod === 'grill/pan' ? 'grill or large skillet' : 'cooking surface'} to medium-high heat

**Ingredient Prep:**
${hasProtein ? `1. Prepare protein: ${ingredients.find(ri => 
  ri.ingredients.ingredient_name.toLowerCase().includes('beef') || 
  ri.ingredients.ingredient_name.toLowerCase().includes('mince')
)?.ingredients.ingredient_name || 'main protein'} - season and form into patties` : ''}
${hasVegetables ? `2. Prep vegetables: Wash, peel, and chop all vegetables as needed` : ''}
${hasDairy ? `3. Prepare dairy: ${ingredients.find(ri => 
  ri.ingredients.ingredient_name.toLowerCase().includes('cheese')
)?.ingredients.ingredient_name || 'cheese'} - slice or grate as needed` : ''}

**Cooking Method:**
1. Heat cooking surface to medium-high (375°F/190°C)
2. ${hasProtein ? 'Cook protein patties for 4-5 minutes per side for medium doneness' : 'Cook main ingredients'}
3. ${hasVegetables ? 'Sauté vegetables until tender-crisp' : 'Cook vegetables as needed'}
4. ${hasDairy ? 'Add cheese in final 1-2 minutes of cooking' : 'Add finishing ingredients'}

**Assembly & Service:**
1. Toast buns if desired
2. Layer ingredients: protein, vegetables, condiments
3. Serve immediately while hot
4. Yield: ${recipe.yield} ${recipe.yield_unit}

**Professional Tips:**
- Maintain consistent heat for even cooking
- Don't press patties while cooking
- Let meat rest 2-3 minutes before serving
- Keep ingredients warm during assembly`;

      } else if (recipeType === 'soup') {
        generatedInstructions = `**Soup Preparation:**

**Mise en Place:**
1. Gather all ingredients and large pot
2. Prepare cutting board and sharp knives
3. Have stock or broth ready at room temperature

**Ingredient Prep:**
${hasProtein ? `1. Prepare protein: Cut ${ingredients.find(ri => 
  ri.ingredients.ingredient_name.toLowerCase().includes('beef') || 
  ri.ingredients.ingredient_name.toLowerCase().includes('chicken')
)?.ingredients.ingredient_name || 'protein'} into bite-sized pieces` : ''}
${hasVegetables ? `2. Prep vegetables: Dice aromatics (onions, carrots, celery) uniformly` : ''}
${hasGrains ? `3. Prepare grains: ${ingredients.find(ri => 
  ri.ingredients.ingredient_name.toLowerCase().includes('rice') || 
  ri.ingredients.ingredient_name.toLowerCase().includes('pasta')
)?.ingredients.ingredient_name || 'grains'} - rinse if needed` : ''}

**Cooking Method:**
1. Heat large pot over medium heat
2. ${hasProtein ? 'Sear protein until browned, remove and set aside' : 'Start with aromatics'}
3. ${hasVegetables ? 'Sauté vegetables until softened (5-7 minutes)' : 'Cook base ingredients'}
4. Add liquid and bring to boil, then reduce to simmer
5. ${hasProtein ? 'Return protein to pot' : 'Add main ingredients'}
6. Simmer until all ingredients are tender (20-30 minutes)

**Final Steps:**
1. Taste and adjust seasoning
2. Skim any excess fat from surface
3. Serve hot with garnishes
4. Yield: ${recipe.yield} ${recipe.yield_unit}

**Professional Tips:**
- Build layers of flavor (sauté aromatics first)
- Simmer gently to avoid breaking ingredients
- Taste frequently and adjust seasoning
- Cool quickly if storing`;

      } else {
        // General recipe instructions
        generatedInstructions = `**${recipe.name} Preparation:**

**Mise en Place:**
1. Gather all ingredients and equipment
2. Prepare work station with cutting board and knives
3. Preheat cooking equipment as needed

**Ingredient Prep:**
${hasProtein ? `1. Prepare protein: ${ingredients.find(ri => 
  ri.ingredients.ingredient_name.toLowerCase().includes('beef') || 
  ri.ingredients.ingredient_name.toLowerCase().includes('chicken') ||
  ri.ingredients.ingredient_name.toLowerCase().includes('mince')
)?.ingredients.ingredient_name || 'main protein'} - cut, season, or prepare as needed` : ''}
${hasVegetables ? `2. Prep vegetables: Wash, peel, and cut vegetables uniformly` : ''}
${hasDairy ? `3. Prepare dairy: ${ingredients.find(ri => 
  ri.ingredients.ingredient_name.toLowerCase().includes('cheese') ||
  ri.ingredients.ingredient_name.toLowerCase().includes('milk')
)?.ingredients.ingredient_name || 'dairy products'} - prepare as needed` : ''}

**Cooking Method:**
1. Heat cooking surface to appropriate temperature
2. ${hasProtein ? 'Cook protein first, then remove and set aside' : 'Start with base ingredients'}
3. ${hasVegetables ? 'Cook vegetables until desired doneness' : 'Cook main ingredients'}
4. ${hasProtein ? 'Return protein to pan' : 'Combine all ingredients'}
5. Season and finish cooking

**Final Steps:**
1. Taste and adjust seasoning
2. Plate attractively for ${recipe.yield} ${recipe.yield_unit}
3. Serve immediately while hot

**Professional Tips:**
- Maintain consistent heat throughout cooking
- Use proper knife skills for uniform cuts
- Keep work area clean and organized
- Taste frequently and adjust seasoning`;
      }

      console.log('🤖 DEBUG: Generated instructions:', generatedInstructions);
      setAiInstructions(generatedInstructions);
      console.log('🤖 DEBUG: AI instructions state set');
    } catch (err) {
      console.error('🤖 DEBUG: Error generating instructions:', err);
      setError('Failed to generate cooking instructions');
    } finally {
      setGeneratingInstructions(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShareRecipe = async () => {
    if (!selectedRecipe || !recipeIngredients.length) {
      setError('No recipe data available for sharing');
      return;
    }

    setShareLoading(true);
    try {
      // Create a compressed recipe data object
      const recipeData = {
        name: selectedRecipe.name,
        yield: selectedRecipe.yield,
        yield_unit: selectedRecipe.yield_unit,
        instructions: selectedRecipe.instructions,
        ingredients: recipeIngredients.map(ri => ({
          name: ri.ingredients.ingredient_name,
          quantity: ri.quantity,
          unit: ri.unit
        })),
        aiInstructions: aiInstructions,
        created_at: selectedRecipe.created_at,
        shared_at: new Date().toISOString()
      };

      // Call the recipe share API
      const response = await fetch('/api/recipe-share', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          recipeData,
          userId: 'user-123' // You can get this from auth context
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create share link');
      }

      const result = await response.json();
      setShareUrl(result.shareUrl);
      setShowShareModal(true);
    } catch (err) {
      setError('Failed to share recipe');
    } finally {
      setShareLoading(false);
    }
  };

  const handleDeleteRecipe = (recipe: Recipe) => {
    setRecipeToDelete(recipe);
    setShowDeleteConfirm(true);
  };

  const confirmDeleteRecipe = async () => {
    if (!recipeToDelete) return;

    try {
      // First delete all recipe ingredients
      const { error: ingredientsError } = await supabase
        .from('recipe_ingredients')
        .delete()
        .eq('recipe_id', recipeToDelete.id);

      if (ingredientsError) {
        setError(ingredientsError.message);
        return;
      }

      // Then delete the recipe
      const { error: recipeError } = await supabase
        .from('recipes')
        .delete()
        .eq('id', recipeToDelete.id);

      if (recipeError) {
        setError(recipeError.message);
        return;
      }

      // Refresh the recipes list
      await fetchRecipes();
      
      // Show success message
      setSuccessMessage(`Recipe "${capitalizeRecipeName(recipeToDelete.name)}" deleted successfully!`);
      setTimeout(() => setSuccessMessage(null), 3000);

      // Close the confirmation modal
      setShowDeleteConfirm(false);
      setRecipeToDelete(null);

    } catch (err) {
      setError('Failed to delete recipe');
    }
  };

  const cancelDeleteRecipe = () => {
    setShowDeleteConfirm(false);
    setRecipeToDelete(null);
  };

  // Multi-selection functions
  const handleSelectRecipe = (recipeId: string) => {
    setSelectedRecipes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(recipeId)) {
        newSet.delete(recipeId);
      } else {
        newSet.add(recipeId);
      }
      return newSet;
    });
  };

  const handleSelectAll = () => {
    if (selectedRecipes.size === recipes.length) {
      setSelectedRecipes(new Set());
    } else {
      setSelectedRecipes(new Set(recipes.map(r => r.id)));
    }
  };

  const handleBulkDelete = () => {
    if (selectedRecipes.size === 0) return;
    setShowBulkDeleteConfirm(true);
  };

  const confirmBulkDelete = async () => {
    if (selectedRecipes.size === 0) return;

    try {
      const selectedRecipeIds = Array.from(selectedRecipes);
      
      // Delete all recipe ingredients for selected recipes
      const { error: ingredientsError } = await supabase
        .from('recipe_ingredients')
        .delete()
        .in('recipe_id', selectedRecipeIds);

      if (ingredientsError) {
        setError(ingredientsError.message);
        return;
      }

      // Delete all selected recipes
      const { error: recipesError } = await supabase
        .from('recipes')
        .delete()
        .in('id', selectedRecipeIds);

      if (recipesError) {
        setError(recipesError.message);
        return;
      }

      // Refresh the recipes list
      await fetchRecipes();
      
      // Show success message
      setSuccessMessage(`${selectedRecipes.size} recipe${selectedRecipes.size > 1 ? 's' : ''} deleted successfully!`);
      setTimeout(() => setSuccessMessage(null), 3000);

      // Clear selection and close modal
      setSelectedRecipes(new Set());
      setShowBulkDeleteConfirm(false);

    } catch (err) {
      setError('Failed to delete recipes');
    }
  };

  const cancelBulkDelete = () => {
    setShowBulkDeleteConfirm(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] p-4 sm:p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-[#2a2a2a] rounded-3xl w-1/2 mb-8"></div>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-[#1f1f1f] p-6 rounded-3xl shadow-lg border border-[#2a2a2a]">
                  <div className="h-4 bg-[#2a2a2a] rounded-xl w-3/4 mb-3"></div>
                  <div className="h-3 bg-[#2a2a2a] rounded-xl w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Image
              src="/images/prepflow-logo.png"
              alt="PrepFlow Logo"
              width={40}
              height={40}
              className="rounded-lg"
              priority
            />
            <h1 className="text-4xl font-bold text-white">
            📖 Recipe Book
          </h1>
          </div>
          <p className="text-gray-400">Manage your saved recipes and create new ones</p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 mb-8">
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-gradient-to-r from-[#29E7CD] to-[#D925C7] text-white px-6 py-3 rounded-2xl hover:from-[#29E7CD]/80 hover:to-[#D925C7]/80 transition-all duration-200 shadow-lg hover:shadow-xl font-medium"
          >
            {showAddForm ? 'Cancel' : '+ Add Manual Recipe'}
          </button>
          <a
            href="/webapp/cogs"
            className="bg-gradient-to-r from-[#3B82F6] to-[#29E7CD] text-white px-6 py-3 rounded-2xl hover:from-[#3B82F6]/80 hover:to-[#29E7CD]/80 transition-all duration-200 shadow-lg hover:shadow-xl font-medium"
          >
            Create Recipe from COGS
          </a>
          <button
            onClick={() => {
              setLoading(true);
              fetchRecipes();
            }}
            className="bg-gradient-to-r from-[#D925C7] to-[#3B82F6] text-white px-6 py-3 rounded-2xl hover:from-[#D925C7]/80 hover:to-[#3B82F6]/80 transition-all duration-200 shadow-lg hover:shadow-xl font-medium"
          >
            🔄 Refresh Recipes
          </button>
        </div>

      {/* Recipe Book Description */}
      <div className="bg-gradient-to-br from-[#29E7CD]/10 to-[#D925C7]/10 border border-[#29E7CD]/30 p-4 sm:p-6 rounded-xl mb-6">
        <h2 className="text-lg font-semibold text-white mb-2">How Recipe Book Works</h2>
        <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-300">
            <div>
              <h3 className="font-medium text-[#3B82F6] mb-2">✍️ Manual Recipes</h3>
              <p>Add recipes manually with instructions and portion counts. Perfect for documenting cooking methods and procedures.</p>
            </div>
          <div>
            <h3 className="font-medium text-[#29E7CD] mb-2">📊 From COGS Calculations</h3>
            <p>Create cost calculations in the COGS screen, then save them as recipes. These recipes include all ingredient costs and portion calculations.</p>
            </div>
          </div>
        </div>

        {/* Bulk Actions Bar */}
        {selectedRecipes.size > 0 && (
          <div className="bg-gradient-to-r from-[#ef4444]/10 to-[#dc2626]/10 border border-[#ef4444]/30 p-4 rounded-xl mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-gradient-to-r from-[#ef4444] to-[#dc2626] rounded-full flex items-center justify-center mr-3">
                  <span className="text-white font-bold text-sm">{selectedRecipes.size}</span>
          </div>
          <div>
                  <h3 className="text-white font-semibold">
                    {selectedRecipes.size} recipe{selectedRecipes.size > 1 ? 's' : ''} selected
                  </h3>
                  <p className="text-gray-400 text-sm">Choose an action for the selected recipes</p>
          </div>
        </div>
              <div className="flex gap-2">
                <button
                  onClick={handleBulkDelete}
                  className="bg-gradient-to-r from-[#ef4444] to-[#dc2626] text-white px-4 py-2 rounded-lg hover:from-[#ef4444]/80 hover:to-[#dc2626]/80 transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
                >
                  🗑️ Delete Selected
                </button>
                <button
                  onClick={() => setSelectedRecipes(new Set())}
                  className="bg-[#2a2a2a] text-gray-300 px-4 py-2 rounded-lg hover:bg-[#3a3a3a] transition-all duration-200 font-medium"
                >
                  Clear Selection
                </button>
      </div>
            </div>
          </div>
        )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

        {successMessage && (
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-6 flex items-center">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="font-medium">{successMessage}</span>
            </div>
        </div>
      )}

      {showAddForm && (
        <div className="bg-[#1f1f1f] p-4 sm:p-6 rounded-lg shadow mb-6">
          <h2 className="text-lg sm:text-xl font-semibold mb-4">Add New Recipe</h2>
          <form onSubmit={handleAddRecipe} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Recipe Name *
              </label>
              <input
                type="text"
                required
                value={newRecipe.name}
                onChange={(e) => setNewRecipe({ ...newRecipe, name: e.target.value })}
                className="w-full px-3 py-2 border border-[#2a2a2a] rounded-md focus:outline-none focus:ring-2 focus:ring-[#29E7CD]"
                placeholder="e.g., Chicken Stir-fry"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Yield Portions
              </label>
              <input
                type="number"
                min="1"
                  value={newRecipe.yield}
                  onChange={(e) => setNewRecipe({ ...newRecipe, yield: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-[#2a2a2a] rounded-md focus:outline-none focus:ring-2 focus:ring-[#29E7CD]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Instructions
              </label>
              <textarea
                value={newRecipe.instructions}
                onChange={(e) => setNewRecipe({ ...newRecipe, instructions: e.target.value })}
                rows={4}
                className="w-full px-3 py-2 border border-[#2a2a2a] rounded-md focus:outline-none focus:ring-2 focus:ring-[#29E7CD]"
                placeholder="Step-by-step cooking instructions..."
              />
            </div>
            <button
              type="submit"
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              Add Recipe
            </button>
          </form>
        </div>
      )}

        {/* Recipes List */}
      <div className="bg-[#1f1f1f] rounded-lg shadow overflow-hidden">
          <div className="sticky top-0 z-10 bg-[#1f1f1f] px-4 sm:px-6 py-4 border-b border-[#2a2a2a]">
            <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">
            Recipes ({recipes.length})
          </h2>
              {selectedRecipes.size > 0 && (
                <div className="flex items-center">
                  <div className="w-6 h-6 bg-gradient-to-r from-[#ef4444] to-[#dc2626] rounded-full flex items-center justify-center mr-2">
                    <span className="text-white font-bold text-xs">{selectedRecipes.size}</span>
                  </div>
                  <span className="text-sm text-gray-300">
                    {selectedRecipes.size} selected
                  </span>
                </div>
              )}
            </div>
        </div>
        
        {/* Mobile Card Layout */}
        <div className="block md:hidden">
            <div className="divide-y divide-[#2a2a2a]">
            {recipes.map((recipe) => (
                <div key={recipe.id} className="p-4 hover:bg-[#2a2a2a]/20 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedRecipes.has(recipe.id)}
                        onChange={() => handleSelectRecipe(recipe.id)}
                        className="w-4 h-4 text-[#29E7CD] bg-[#0a0a0a] border-[#2a2a2a] rounded focus:ring-[#29E7CD] focus:ring-2 mr-3"
                      />
                      <h3 className="text-sm font-medium text-white cursor-pointer" onClick={() => handlePreviewRecipe(recipe)}>
                    {capitalizeRecipeName(recipe.name)}
                  </h3>
                    </div>
                  <span className="text-xs text-gray-500">
                    {new Date(recipe.created_at).toLocaleDateString()}
                  </span>
                </div>
                
                  <div className="space-y-1 text-xs text-gray-500 mb-3 ml-7">
                  <div>
                      <span className="font-medium">Recommended Price:</span> 
                      {recipePrices[recipe.id] ? (
                        <span className="text-white font-semibold ml-1">
                          ${recipePrices[recipe.id].recommendedPrice.toFixed(2)}
                        </span>
                      ) : (
                        <span className="text-gray-500 ml-1">Calculating...</span>
                      )}
                  </div>
                  {recipePrices[recipe.id] && (
                    <div>
                      <span className="font-medium">Food Cost:</span> 
                      <span className="text-gray-400 ml-1">
                        {recipePrices[recipe.id].foodCostPercent.toFixed(1)}%
                      </span>
                    </div>
                  )}
                  {recipe.instructions && (
                    <div>
                      <span className="font-medium">Instructions:</span>
                      <p className="mt-1 text-gray-400 line-clamp-2">
                        {recipe.instructions}
                      </p>
                    </div>
                  )}
                </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 ml-7">
                    <button
                      onClick={() => handleEditRecipe(recipe)}
                      className="flex-1 bg-gradient-to-r from-[#29E7CD] to-[#3B82F6] text-white px-3 py-2 rounded-lg text-xs font-medium hover:from-[#29E7CD]/80 hover:to-[#3B82F6]/80 transition-all duration-200"
                    >
                      ✏️ Edit in COGS
                    </button>
                    <button
                      onClick={() => handleDeleteRecipe(recipe)}
                      className="flex-1 bg-gradient-to-r from-[#ef4444] to-[#dc2626] text-white px-3 py-2 rounded-lg text-xs font-medium hover:from-[#ef4444]/80 hover:to-[#dc2626]/80 transition-all duration-200"
                    >
                      🗑️ Delete
                    </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Desktop Table Layout */}
        <div className="hidden md:block overflow-x-auto">
            <table className="min-w-full divide-y divide-[#2a2a2a]">
              <thead className="sticky top-0 z-10 bg-gradient-to-r from-[#2a2a2a]/50 to-[#2a2a2a]/20">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedRecipes.size === recipes.length && recipes.length > 0}
                        onChange={handleSelectAll}
                        className="w-4 h-4 text-[#29E7CD] bg-[#0a0a0a] border-[#2a2a2a] rounded focus:ring-[#29E7CD] focus:ring-2"
                      />
                      <span className="ml-2">Select</span>
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Name
                </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Recommended Price
                </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Instructions
                </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Created
                </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Actions
                </th>
              </tr>
            </thead>
              <tbody className="bg-[#1f1f1f] divide-y divide-[#2a2a2a]">
              {recipes.map((recipe) => (
                  <tr key={recipe.id} className="hover:bg-[#2a2a2a]/20 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={selectedRecipes.has(recipe.id)}
                        onChange={() => handleSelectRecipe(recipe.id)}
                        className="w-4 h-4 text-[#29E7CD] bg-[#0a0a0a] border-[#2a2a2a] rounded focus:ring-[#29E7CD] focus:ring-2"
                      />
                  </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white cursor-pointer" onClick={() => handlePreviewRecipe(recipe)}>
                    {capitalizeRecipeName(recipe.name)}
                  </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 cursor-pointer" onClick={() => handlePreviewRecipe(recipe)}>
                      {recipePrices[recipe.id] ? (
                        <div className="flex flex-col">
                          <span className="text-white font-semibold">${recipePrices[recipe.id].recommendedPrice.toFixed(2)}</span>
                          <span className="text-xs text-gray-400">
                            {recipePrices[recipe.id].foodCostPercent.toFixed(1)}% food cost
                          </span>
                        </div>
                      ) : (
                        <span className="text-gray-500">Calculating...</span>
                      )}
                  </td>
                    <td className="px-6 py-4 text-sm text-gray-300 cursor-pointer" onClick={() => handlePreviewRecipe(recipe)}>
                    {recipe.instructions ? (
                      <div className="max-w-xs truncate">
                        {recipe.instructions}
                      </div>
                    ) : (
                      '-'
                    )}
                  </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 cursor-pointer" onClick={() => handlePreviewRecipe(recipe)}>
                    {new Date(recipe.created_at).toLocaleDateString()}
                  </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => handleEditRecipe(recipe)}
                          className="bg-gradient-to-r from-[#29E7CD] to-[#3B82F6] text-white px-3 py-1 rounded-lg text-xs font-medium hover:from-[#29E7CD]/80 hover:to-[#3B82F6]/80 transition-all duration-200"
                        >
                          ✏️ Edit
                        </button>
                        <button
                          onClick={() => handleDeleteRecipe(recipe)}
                          className="bg-gradient-to-r from-[#ef4444] to-[#dc2626] text-white px-3 py-1 rounded-lg text-xs font-medium hover:from-[#ef4444]/80 hover:to-[#dc2626]/80 transition-all duration-200"
                        >
                          🗑️ Delete
                        </button>
                      </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {recipes.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">🍳</div>
          <h3 className="text-lg font-medium text-white mb-2">No recipes yet</h3>
          <p className="text-gray-500 mb-4">
            Start by adding your first recipe to begin managing your kitchen costs.
          </p>
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-gradient-to-r from-[#29E7CD] to-[#3B82F6] text-white px-4 py-2 rounded-lg hover:from-[#29E7CD]/80 hover:to-[#3B82F6]/80 transition-colors"
          >
            Add Your First Recipe
          </button>
        </div>
      )}

        {/* Recipe Preview Modal */}
        {showPreview && selectedRecipe && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-[#1f1f1f] rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="p-6 border-b border-[#2a2a2a]">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-white mb-2">{capitalizeRecipeName(selectedRecipe.name)}</h2>
                    
                    {/* Yield Adjustment Section */}
                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400 text-sm">Original Yield:</span>
                        <span className="text-white font-medium">{selectedRecipe.yield} {selectedRecipe.yield_unit}</span>
      </div>
                      
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400 text-sm">Adjust for:</span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setPreviewYield(Math.max(1, previewYield - 1))}
                            className="bg-[#2a2a2a] hover:bg-[#3a3a3a] text-white w-8 h-8 rounded-lg flex items-center justify-center text-sm font-medium transition-colors"
                          >
                            −
                          </button>
                          <input
                            type="number"
                            value={previewYield}
                            onChange={(e) => setPreviewYield(Math.max(1, parseInt(e.target.value) || 1))}
                            className="bg-[#0a0a0a] border border-[#2a2a2a] text-white text-center w-16 h-8 rounded-lg text-sm font-medium focus:ring-2 focus:ring-[#29E7CD] focus:border-transparent"
                            min="1"
                          />
                          <button
                            onClick={() => setPreviewYield(previewYield + 1)}
                            className="bg-[#2a2a2a] hover:bg-[#3a3a3a] text-white w-8 h-8 rounded-lg flex items-center justify-center text-sm font-medium transition-colors"
                          >
                            +
                          </button>
    </div>
                        <span className="text-white font-medium">{selectedRecipe.yield_unit}</span>
                      </div>
                      
                      {previewYield !== selectedRecipe.yield && (
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-400">Scale:</span>
                          <span className={`text-sm font-medium ${previewYield > selectedRecipe.yield ? 'text-[#29E7CD]' : 'text-[#3B82F6]'}`}>
                            {previewYield > selectedRecipe.yield ? '+' : ''}{((previewYield / selectedRecipe.yield - 1) * 100).toFixed(0)}%
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditFromPreview()}
                      className="bg-gradient-to-r from-[#29E7CD] to-[#3B82F6] text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-[#29E7CD]/80 hover:to-[#3B82F6]/80 transition-all duration-200"
                    >
                      ✏️ Edit Recipe
                    </button>
                    <button
                      onClick={handleShareRecipe}
                      disabled={shareLoading}
                      className="bg-gradient-to-r from-[#10B981] to-[#059669] text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-[#10B981]/80 hover:to-[#059669]/80 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {shareLoading ? '⏳ Sharing...' : '📤 Share Recipe'}
                    </button>
                    <button
                      onClick={handlePrint}
                      className="bg-gradient-to-r from-[#D925C7] to-[#29E7CD] text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-[#D925C7]/80 hover:to-[#29E7CD]/80 transition-all duration-200"
                    >
                      🖨️ Print
                    </button>
                    <button
                      onClick={() => setShowPreview(false)}
                      className="bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors"
                    >
                      ✕ Close
                    </button>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Ingredients */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <span className="text-2xl">📋</span>
                    Ingredients
                    <span className="text-sm font-normal text-gray-400 ml-2">
                      ({recipeIngredients.length} item{recipeIngredients.length !== 1 ? 's' : ''})
                    </span>
                  </h3>
                  
                  <div className="bg-[#0a0a0a] rounded-xl border border-[#2a2a2a]/50 overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-[#2a2a2a]/50 to-[#2a2a2a]/20 px-4 py-3 border-b border-[#2a2a2a]/50">
                      <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-300">
                        <div className="col-span-1 text-center">#</div>
                        <div className="col-span-8">Ingredient</div>
                        <div className="col-span-3 text-center">Quantity</div>
                      </div>
                    </div>
                    
                    {/* Ingredients List */}
                    <div className="divide-y divide-[#2a2a2a]/30">
                      {recipeIngredients.map((ri, index) => {
                        const ingredient = ri.ingredients;
                        const quantity = ri.quantity;

                        return (
                          <div key={ri.id} className="px-4 py-3 hover:bg-[#2a2a2a]/20 transition-colors">
                            <div className="grid grid-cols-12 gap-4 items-center">
                              {/* Index */}
                              <div className="col-span-1 text-center">
                                <span className="text-sm text-gray-400 font-mono">
                                  {String(index + 1).padStart(2, '0')}
                                </span>
                              </div>
                              
                              {/* Ingredient Name */}
                              <div className="col-span-8">
                                <div className="text-white font-medium">{ingredient.ingredient_name}</div>
                              </div>
                              
                              {/* Quantity */}
                              <div className="col-span-3 text-center">
                                <span className="text-white font-medium">
                                  {(() => {
                                    const formatted = formatQuantity(quantity, ri.unit);
                                    const isConverted = formatted.unit !== ri.unit.toLowerCase();
                                    
                                    return (
                                      <>
                                        {formatted.value} {formatted.unit}
                                        {isConverted && (
                                          <div className="text-xs text-gray-400 mt-1">
                                            ({formatted.original})
                                          </div>
                                        )}
                                        {previewYield !== selectedRecipe.yield && !isConverted && (
                                          <div className="text-xs text-gray-400 mt-1">
                                            (orig: {quantity} {ri.unit})
                                          </div>
                                        )}
                                      </>
                                    );
                                  })()}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* AI-Generated Cooking Instructions */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-white mb-4">🤖 AI-Generated Cooking Method</h3>
                  <div className="bg-[#0a0a0a] rounded-lg p-4">
                    {generatingInstructions ? (
                      <div className="flex items-center justify-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#29E7CD]"></div>
                        <span className="ml-3 text-gray-400">Generating cooking instructions...</span>
                      </div>
                    ) : (
                      <div className="text-gray-300 whitespace-pre-wrap">
                        {aiInstructions}
                      </div>
                    )}
                  </div>
                </div>

                {/* Manual Instructions (if available) */}
                {selectedRecipe.instructions && (
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">👨‍🍳 Manual Instructions</h3>
                    <div className="bg-[#0a0a0a] rounded-lg p-4">
                      <div className="text-gray-300 whitespace-pre-wrap">
                        {selectedRecipe.instructions}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Custom Delete Confirmation Modal */}
        {showDeleteConfirm && recipeToDelete && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-[#1f1f1f] rounded-2xl shadow-2xl max-w-md w-full border border-[#2a2a2a]">
              {/* Header */}
              <div className="p-6 border-b border-[#2a2a2a]">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-[#ef4444] to-[#dc2626] rounded-full flex items-center justify-center mr-4">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Delete Recipe</h3>
                    <p className="text-gray-400 text-sm">This action cannot be undone</p>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <p className="text-gray-300 mb-6">
                  Are you sure you want to delete <span className="font-semibold text-white">"{capitalizeRecipeName(recipeToDelete.name)}"</span>? 
                  This will permanently remove the recipe and all its ingredients from your Recipe Book.
                </p>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={cancelDeleteRecipe}
                    className="flex-1 bg-[#2a2a2a] text-gray-300 px-4 py-3 rounded-xl hover:bg-[#3a3a3a] transition-all duration-200 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmDeleteRecipe}
                    className="flex-1 bg-gradient-to-r from-[#ef4444] to-[#dc2626] text-white px-4 py-3 rounded-xl hover:from-[#ef4444]/80 hover:to-[#dc2626]/80 transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
                  >
                    Delete Recipe
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Bulk Delete Confirmation Modal */}
        {showBulkDeleteConfirm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-[#1f1f1f] rounded-2xl shadow-2xl max-w-md w-full border border-[#2a2a2a]">
              {/* Header */}
              <div className="p-6 border-b border-[#2a2a2a]">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-[#ef4444] to-[#dc2626] rounded-full flex items-center justify-center mr-4">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Delete Multiple Recipes</h3>
                    <p className="text-gray-400 text-sm">This action cannot be undone</p>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <p className="text-gray-300 mb-6">
                  Are you sure you want to delete <span className="font-semibold text-white">{selectedRecipes.size} recipe{selectedRecipes.size > 1 ? 's' : ''}</span>? 
                  This will permanently remove all selected recipes and their ingredients from your Recipe Book.
                </p>

                {/* Selected Recipes List */}
                <div className="bg-[#0a0a0a] rounded-lg p-4 mb-6 max-h-32 overflow-y-auto">
                  <h4 className="text-sm font-medium text-white mb-2">Selected Recipes:</h4>
                  <div className="space-y-1">
                    {Array.from(selectedRecipes).map(recipeId => {
                      const recipe = recipes.find(r => r.id === recipeId);
                      return recipe ? (
                        <div key={recipeId} className="text-xs text-gray-400">• {capitalizeRecipeName(recipe.name)}</div>
                      ) : null;
                    })}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={cancelBulkDelete}
                    className="flex-1 bg-[#2a2a2a] text-gray-300 px-4 py-3 rounded-xl hover:bg-[#3a3a3a] transition-all duration-200 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmBulkDelete}
                    className="flex-1 bg-gradient-to-r from-[#ef4444] to-[#dc2626] text-white px-4 py-3 rounded-xl hover:from-[#ef4444]/80 hover:to-[#dc2626]/80 transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
                  >
                    Delete {selectedRecipes.size} Recipe{selectedRecipes.size > 1 ? 's' : ''}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Print-Only Recipe Card */}
        {selectedRecipe && (
          <div className="hidden print-recipe-card print:block print:fixed print:inset-0 print:bg-white print:p-8 print:z-[9999] print:m-0">
            <div className="print:max-w-none print:w-full print:h-full print:overflow-visible print:m-0 print:p-0">
              {/* Print Header with Logo */}
              <div className="print:flex print:justify-between print:items-center print:mb-8 print:border-b print:border-gray-300 print:pb-4">
                <div>
                  <h1 className="print:text-3xl print:font-bold print:text-black print:mb-2">
                    {capitalizeRecipeName(selectedRecipe.name)}
                  </h1>
                  <p className="print:text-lg print:text-gray-600">
                    Yield: {previewYield} {selectedRecipe.yield_unit}
                    {previewYield !== selectedRecipe.yield && (
                      <span className="print:ml-2 print:text-sm print:text-gray-500">
                        (scaled from {selectedRecipe.yield} {selectedRecipe.yield_unit})
                      </span>
                    )}
                  </p>
                </div>
                <div className="print:flex print:items-center print:gap-3">
                  <Image 
                    src="/images/prepflow-logo.png" 
                    alt="PrepFlow" 
                    width={64}
                    height={64}
                    className="print:w-16 print:h-16 print:object-contain"
                  />
                  <div className="print:text-right">
                    <div className="print:text-sm print:font-semibold print:text-black">PrepFlow</div>
                    <div className="print:text-xs print:text-gray-500">Kitchen Management</div>
                  </div>
                </div>
              </div>

              {/* Print Ingredients Section */}
              <div className="print:mb-8">
                <h2 className="print:text-2xl print:font-bold print:text-black print:mb-4 print:border-b print:border-gray-300 print:pb-2">
                  📋 Ingredients
                </h2>
                <div className="print:space-y-2">
                  {recipeIngredients.map((ri, index) => {
                    const ingredient = ri.ingredients;
                    const quantity = ri.quantity;
                    const formatted = formatQuantity(quantity, ri.unit);

                    return (
                      <div key={ri.id} className="print:flex print:justify-between print:items-center print:py-1 print:border-b print:border-gray-100 print:last:border-b-0">
                        <div className="print:flex print:items-center print:gap-3">
                          <span className="print:text-sm print:text-gray-500 print:font-mono print:w-6">
                            {String(index + 1).padStart(2, '0')}.
                          </span>
                          <span className="print:text-black print:font-medium">
                            {ingredient.ingredient_name}
                          </span>
                        </div>
                        <span className="print:text-black print:font-semibold">
                          {formatted.value} {formatted.unit}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Print Instructions Section */}
              <div className="print:mb-8">
                <h2 className="print:text-2xl print:font-bold print:text-black print:mb-4 print:border-b print:border-gray-300 print:pb-2">
                  🤖 Cooking Instructions
                </h2>
                <div className="print:text-black print:leading-relaxed print:whitespace-pre-line">
                  {aiInstructions}
                </div>
              </div>

              {/* Print Footer */}
              <div className="print:mt-12 print:pt-4 print:border-t print:border-gray-300 print:text-center print:text-xs print:text-gray-500">
                <p>Generated by PrepFlow Kitchen Management System</p>
                <p>Printed on {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}</p>
              </div>
            </div>
          </div>
        )}

        {/* Share Recipe Modal */}
        {showShareModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-[#1f1f1f] rounded-2xl shadow-2xl max-w-md w-full border border-[#2a2a2a]">
              {/* Header */}
              <div className="p-6 border-b border-[#2a2a2a]">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-[#10B981] to-[#059669] rounded-full flex items-center justify-center mr-4">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Recipe Shared!</h3>
                    <p className="text-gray-400 text-sm">Your recipe is ready to share</p>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <p className="text-gray-300 mb-4">
                  Your recipe <span className="font-semibold text-white">"{selectedRecipe?.name}"</span> has been shared successfully!
                </p>
                
                <div className="bg-[#0a0a0a] rounded-lg p-4 mb-6">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Share Link:
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={shareUrl}
                      readOnly
                      className="flex-1 bg-[#2a2a2a] border border-[#3a3a3a] text-white px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#29E7CD]"
                    />
                    <button
                      onClick={() => navigator.clipboard.writeText(shareUrl)}
                      className="bg-gradient-to-r from-[#29E7CD] to-[#3B82F6] text-white px-3 py-2 rounded-lg text-sm font-medium hover:from-[#29E7CD]/80 hover:to-[#3B82F6]/80 transition-all duration-200"
                    >
                      📋 Copy
                    </button>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-[#10B981]/10 to-[#059669]/10 border border-[#10B981]/30 rounded-lg p-4 mb-6">
                  <h4 className="text-sm font-medium text-white mb-2">📤 Share Options:</h4>
                  <div className="space-y-2 text-sm text-gray-300">
                    <p>• <strong>Copy Link:</strong> Share the link with anyone</p>
                    <p>• <strong>PDF Export:</strong> Generate a printable PDF</p>
                    <p>• <strong>Social Media:</strong> Share on your platforms</p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowShareModal(false)}
                    className="flex-1 bg-[#2a2a2a] text-gray-300 px-4 py-3 rounded-xl hover:bg-[#3a3a3a] transition-all duration-200 font-medium"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(shareUrl);
                      setSuccessMessage('Share link copied to clipboard!');
                      setTimeout(() => setSuccessMessage(null), 3000);
                    }}
                    className="flex-1 bg-gradient-to-r from-[#10B981] to-[#059669] text-white px-4 py-3 rounded-xl hover:from-[#10B981]/80 hover:to-[#059669]/80 transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
                  >
                    📋 Copy & Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
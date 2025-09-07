'use client';

import { supabase } from '@/lib/supabase';
import { useEffect, useState, useMemo } from 'react';

interface Ingredient {
  id: string;
  ingredient_name: string;
  unit?: string;
  cost_per_unit: number;
  trim_peel_waste_percentage?: number;
  yield_percentage?: number;
}

interface Recipe {
  id: string;
  name: string;
  yield_portions?: number;
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
  const [showAddIngredient, setShowAddIngredient] = useState(false);
  const [dishName, setDishName] = useState<string>('');
  const [dishPortions, setDishPortions] = useState<number>(1);
  const [ingredientSearch, setIngredientSearch] = useState<string>('');
  const [newIngredient, setNewIngredient] = useState<Partial<RecipeIngredient>>({
    ingredient_id: '',
    quantity: 0,
    unit: 'kg',
  });

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedRecipe) {
      fetchRecipeIngredients();
    }
  }, [selectedRecipe]);

  const fetchData = async () => {
    try {
      // Fetch ingredients
      const { data: ingredientsData, error: ingredientsError } = await supabase
        .from('ingredients')
        .select('*')
        .order('name');

      // Fetch recipes
      const { data: recipesData, error: recipesError } = await supabase
        .from('recipes')
        .select('*')
        .order('name');

      if (ingredientsError) {
        setError(ingredientsError.message);
      } else {
        setIngredients(ingredientsData || []);
      }

      if (recipesError) {
        setError(recipesError.message);
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

      const costPerUnit = ingredient.cost_per_unit;
      const totalCost = ri.quantity * costPerUnit;
      const wastePercent = ingredient.trim_peel_waste_percentage || 0;
      const yieldPercent = ingredient.yield_percentage || 100;
      
      const wasteAdjustedCost = totalCost / (1 - wastePercent / 100);
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
    }).filter(Boolean) as COGSCalculation[];

    setCalculations(calculations);
  };

  const handleSaveAsRecipe = async () => {
    if (calculations.length === 0) {
      setError('No calculations to save. Please calculate COGS first.');
      return;
    }

    const recipeName = dishName || prompt('Enter a name for this recipe:');
    if (!recipeName) return;

    try {
      // Create the recipe
      const { data: recipeData, error: recipeError } = await supabase
        .from('recipes')
        .insert({
          name: recipeName,
          yield_portions: dishPortions || selectedRecipeData?.yield_portions || 1,
          instructions: `Recipe created from COGS calculation on ${new Date().toLocaleDateString()}`,
          total_cost: totalCOGS,
          cost_per_portion: costPerPortion,
          source: 'cogs'
        })
        .select()
        .single();

      if (recipeError) {
        setError(recipeError.message);
        return;
      }

      // Create recipe ingredients
      const recipeIngredientInserts = calculations.map(calc => ({
        recipe_id: recipeData.id,
        ingredient_id: calc.ingredientId,
        quantity: calc.quantity,
        unit: calc.unit
      }));

      const { error: ingredientsError } = await supabase
        .from('recipe_ingredients')
        .insert(recipeIngredientInserts);

      if (ingredientsError) {
        setError(ingredientsError.message);
        return;
      }

      alert(`Recipe "${recipeName}" saved successfully to Recipe Book!`);
      
    } catch (err) {
      setError('Failed to save recipe');
    }
  };

  const handleAddIngredient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIngredient.ingredient_id || !newIngredient.quantity) {
      setError('Please select an ingredient and enter a quantity');
      return;
    }

    try {
      // Add ingredient to local state (no database save yet)
      const ingredientToAdd: RecipeIngredient = {
        recipe_id: selectedRecipe || 'temp',
        ingredient_id: newIngredient.ingredient_id!,
        quantity: newIngredient.quantity!,
        unit: newIngredient.unit || 'kg',
      };

      setRecipeIngredients(prev => [...prev, ingredientToAdd]);
      
      // Reset form
      setNewIngredient({
        ingredient_id: '',
        quantity: 0,
        unit: 'kg',
      });
      
      // Calculate COGS with updated ingredients
      calculateCOGS([...recipeIngredients, ingredientToAdd]);
      
    } catch (err) {
      setError('Failed to add ingredient');
    }
  };

  const totalCOGS = calculations.reduce((sum, calc) => sum + calc.yieldAdjustedCost, 0);
  const selectedRecipeData = recipes.find(r => r.id === selectedRecipe);
  const costPerPortion = dishPortions > 0 
    ? totalCOGS / dishPortions 
    : (selectedRecipeData?.yield_portions ? totalCOGS / selectedRecipeData.yield_portions : 0);

  // Live search with Material Design 3 guidelines - instant filtering
  const filteredIngredients = useMemo(() => {
    if (!ingredientSearch.trim()) {
      return ingredients.slice(0, 50); // Show first 50 ingredients when no search
    }
    
    const searchTerm = ingredientSearch.toLowerCase().trim();
    return ingredients
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
  }, [ingredients, ingredientSearch]);

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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8">
        {/* Dish Creation */}
        <div className="bg-[#1f1f1f] p-4 sm:p-6 rounded-lg shadow">
          <h2 className="text-lg sm:text-xl font-semibold mb-4">Create Dish</h2>
          
          {/* Dish Name Input */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Dish Name
            </label>
            <input
              type="text"
              placeholder="Enter dish name (e.g., Chicken Curry)"
              value={dishName}
              onChange={(e) => setDishName(e.target.value)}
              className="w-full px-3 py-2 border border-[#2a2a2a] bg-[#0a0a0a] text-white rounded-md focus:outline-none focus:ring-2 focus:ring-[#29E7CD]"
            />
          </div>

          {/* Portions Input */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Number of Portions
            </label>
            <input
              type="number"
              min="1"
              placeholder="1"
              value={dishPortions}
              onChange={(e) => setDishPortions(Number(e.target.value))}
              className="w-full px-3 py-2 border border-[#2a2a2a] bg-[#0a0a0a] text-white rounded-md focus:outline-none focus:ring-2 focus:ring-[#29E7CD]"
            />
          </div>

          {/* Recipe Selection (Optional) */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Or Select Existing Recipe (Optional)
            </label>
            <select
              value={selectedRecipe}
              onChange={(e) => setSelectedRecipe(e.target.value)}
              className="w-full px-3 py-2 border border-[#2a2a2a] bg-[#0a0a0a] text-white rounded-md focus:outline-none focus:ring-2 focus:ring-[#29E7CD]"
            >
              <option value="">Create new dish...</option>
              {recipes.map((recipe) => (
                <option key={recipe.id} value={recipe.id}>
                  {recipe.name}
                </option>
              ))}
            </select>
          </div>

          {/* Add Ingredients Section */}
          <div className="mt-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-white">Add Ingredients</h3>
              <button
                onClick={() => setShowAddIngredient(!showAddIngredient)}
                className="bg-gradient-to-r from-[#29E7CD] to-[#D925C7] text-white px-3 py-1 rounded text-sm hover:from-[#29E7CD]/80 hover:to-[#D925C7]/80 transition-colors"
              >
                {showAddIngredient ? 'Cancel' : 'Add Ingredient'}
              </button>
            </div>

              {showAddIngredient && (
                <form onSubmit={handleAddIngredient} className="space-y-3 p-4 bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg">
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      🔍 Search Ingredients
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Type to search ingredients..."
                        value={ingredientSearch}
                        onChange={(e) => setIngredientSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-[#2a2a2a] bg-[#0a0a0a] text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-[#29E7CD] focus:border-[#29E7CD] transition-all duration-200 shadow-sm hover:shadow-md"
                      />
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </div>
                      {ingredientSearch && (
                        <button
                          onClick={() => setIngredientSearch('')}
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
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      📋 Select Ingredient
                    </label>
                    <div className="relative">
                      <select
                        required
                        value={newIngredient.ingredient_id}
                        onChange={(e) => setNewIngredient({ ...newIngredient, ingredient_id: e.target.value })}
                        className="w-full px-4 py-3 border border-[#2a2a2a] bg-[#0a0a0a] text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-[#29E7CD] focus:border-[#29E7CD] transition-all duration-200 shadow-sm hover:shadow-md appearance-none cursor-pointer"
                      >
                        <option value="">Choose an ingredient...</option>
                        {filteredIngredients.map((ingredient) => (
                          <option key={ingredient.id} value={ingredient.id}>
                            {ingredient.ingredient_name} - ${ingredient.cost_per_unit.toFixed(2)}/{ingredient.unit || 'unit'}
                          </option>
                        ))}
                      </select>
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                    {filteredIngredients.length === 0 && ingredientSearch && (
                      <div className="mt-3 p-3 bg-[#1f1f1f] border border-[#2a2a2a] rounded-lg">
                        <p className="text-sm text-gray-400 text-center">
                          🔍 No ingredients found matching "{ingredientSearch}"
                        </p>
                        <p className="text-xs text-gray-500 text-center mt-1">
                          Try a different search term or check your ingredients list
                        </p>
                      </div>
                    )}
                    {filteredIngredients.length > 0 && ingredientSearch && (
                      <div className="mt-2 text-xs text-[#29E7CD]">
                        ✨ Showing best matches for "{ingredientSearch}"
                      </div>
                    )}
                  </div>
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
                    <div key={index} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="text-sm font-medium text-white">
                          {calc.ingredientName}
                        </h4>
                        <span className="text-sm font-bold text-blue-600">
                          ${calc.yieldAdjustedCost.toFixed(2)}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500">
                        {calc.quantity} {calc.unit}
                      </p>
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
                    </tr>
                  </thead>
                  <tbody className="bg-[#1f1f1f] divide-y divide-gray-200">
                    {calculations.map((calc, index) => (
                      <tr key={index}>
                        <td className="px-3 py-2 text-sm text-white">
                          {calc.ingredientName}
                        </td>
                        <td className="px-3 py-2 text-sm text-gray-500">
                          {calc.quantity} {calc.unit}
                        </td>
                        <td className="px-3 py-2 text-sm text-gray-500">
                          ${calc.yieldAdjustedCost.toFixed(2)}
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
                {(dishPortions > 0 || selectedRecipeData?.yield_portions) && (
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-sm text-gray-400">Cost per portion:</span>
                    <span className="text-sm font-medium text-white">
                      ${costPerPortion.toFixed(2)}
                    </span>
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

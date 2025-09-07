'use client';

import { supabase } from '@/lib/supabase';
import { useEffect, useState } from 'react';

interface Recipe {
  id: string;
  name: string;
  yield_portions?: number;
  instructions?: string;
  created_at: string;
  total_cost?: number;
  cost_per_portion?: number;
  source?: 'manual' | 'cogs'; // Track if recipe came from COGS calculation
}

interface Ingredient {
  id: string;
  name: string;
  unit?: string;
  cost_per_unit: number;
}

export default function RecipesPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newRecipe, setNewRecipe] = useState<Partial<Recipe>>({
    name: '',
    yield_portions: 1,
    instructions: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch recipes
      const { data: recipesData, error: recipesError } = await supabase
        .from('recipes')
        .select('*')
        .order('name');

      // Fetch ingredients
      const { data: ingredientsData, error: ingredientsError } = await supabase
        .from('ingredients')
        .select('id, name, unit, cost_per_unit')
        .order('name');

      if (recipesError) {
        setError(recipesError.message);
      } else {
        setRecipes(recipesData || []);
      }

      if (ingredientsError) {
        setError(ingredientsError.message);
      } else {
        setIngredients(ingredientsData || []);
      }
    } catch (err) {
      setError('Failed to fetch data');
    } finally {
      setLoading(false);
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
          yield_portions: 1,
          instructions: '',
        });
        fetchData();
      }
    } catch (err) {
      setError('Failed to add recipe');
    }
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
          <h1 className="text-4xl font-bold text-white mb-2">
            📖 Recipe Book
          </h1>
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
        </div>

      {/* Recipe Book Description */}
      <div className="bg-gradient-to-br from-[#29E7CD]/10 to-[#D925C7]/10 border border-[#29E7CD]/30 p-4 sm:p-6 rounded-xl mb-6">
        <h2 className="text-lg font-semibold text-white mb-2">How Recipe Book Works</h2>
        <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-300">
          <div>
            <h3 className="font-medium text-[#29E7CD] mb-2">📊 From COGS Calculations</h3>
            <p>Create cost calculations in the COGS screen, then save them as recipes. These recipes include all ingredient costs and portion calculations.</p>
          </div>
          <div>
            <h3 className="font-medium text-[#3B82F6] mb-2">✍️ Manual Recipes</h3>
            <p>Add recipes manually with instructions and portion counts. Perfect for documenting cooking methods and procedures.</p>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
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
                value={newRecipe.yield_portions}
                onChange={(e) => setNewRecipe({ ...newRecipe, yield_portions: parseInt(e.target.value) })}
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

      <div className="bg-[#1f1f1f] rounded-lg shadow overflow-hidden">
        <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-white">
            Recipes ({recipes.length})
          </h2>
        </div>
        
        {/* Mobile Card Layout */}
        <div className="block md:hidden">
          <div className="divide-y divide-gray-200">
            {recipes.map((recipe) => (
              <div key={recipe.id} className="p-4 hover:bg-gray-50">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-sm font-medium text-white">
                    {recipe.name}
                  </h3>
                  <span className="text-xs text-gray-500">
                    {new Date(recipe.created_at).toLocaleDateString()}
                  </span>
                </div>
                
                <div className="space-y-1 text-xs text-gray-500">
                  <div>
                    <span className="font-medium">Yield:</span> {recipe.yield_portions || '-'} portions
                  </div>
                  {recipe.instructions && (
                    <div>
                      <span className="font-medium">Instructions:</span>
                      <p className="mt-1 text-gray-400 line-clamp-2">
                        {recipe.instructions}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Desktop Table Layout */}
        <div className="hidden md:block overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Yield Portions
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Instructions
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
              </tr>
            </thead>
            <tbody className="bg-[#1f1f1f] divide-y divide-gray-200">
              {recipes.map((recipe) => (
                <tr key={recipe.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                    {recipe.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {recipe.yield_portions || '-'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {recipe.instructions ? (
                      <div className="max-w-xs truncate">
                        {recipe.instructions}
                      </div>
                    ) : (
                      '-'
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(recipe.created_at).toLocaleDateString()}
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
      </div>
    </div>
  );
}

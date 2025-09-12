'use client';

import { useState } from 'react';

interface RecipesSetupProps {
  setupProgress: {
    ingredients: boolean;
    recipes: boolean;
    equipment: boolean;
    country: boolean;
  };
  onProgressUpdate: (progress: { ingredients: boolean; recipes: boolean; equipment: boolean; country: boolean }) => void;
}

export default function RecipesSetup({ setupProgress, onProgressUpdate }: RecipesSetupProps) {
  const [recipesLoading, setRecipesLoading] = useState(false);
  const [recipesResult, setRecipesResult] = useState<string | null>(null);
  const [recipesError, setRecipesError] = useState<string | null>(null);

  const populateRecipes = async () => {
    setRecipesLoading(true);
    setRecipesError(null);
    setRecipesResult(null);

    try {
      const response = await fetch('/api/populate-recipes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ populateRecipes: true })
      });

      const data = await response.json();

      if (response.ok) {
        setRecipesResult(data.message);
        onProgressUpdate({ ...setupProgress, recipes: true });
      } else {
        setRecipesError(data.error || 'Failed to populate recipes');
      }
    } catch (err) {
      setRecipesError('Network error occurred');
    } finally {
      setRecipesLoading(false);
    }
  };

  return (
    <div className="bg-[#1f1f1f] p-8 rounded-3xl shadow-lg border border-[#2a2a2a]">
      <div className="text-center mb-8">
        <div className="text-6xl mb-4">🍲</div>
        <h3 className="text-2xl font-bold text-white mb-2">Sample Recipes</h3>
        <p className="text-gray-400 text-lg">
          Add sample recipes to get started with recipe management and COGS calculations
        </p>
      </div>

      <div className="max-w-2xl mx-auto">
        <div className="bg-[#2a2a2a]/50 p-6 rounded-2xl border border-[#2a2a2a] mb-6">
          <h4 className="text-lg font-semibold text-white mb-4">Sample recipes include:</h4>
          <ul className="space-y-2 text-gray-300">
            <li className="flex items-center space-x-2">
              <span className="text-[#29E7CD]">✓</span>
              <span>Classic dishes (Caesar Salad, Fish & Chips, Beef Burger)</span>
            </li>
            <li className="flex items-center space-x-2">
              <span className="text-[#29E7CD]">✓</span>
              <span>Proper ingredient quantities and units</span>
            </li>
            <li className="flex items-center space-x-2">
              <span className="text-[#29E7CD]">✓</span>
              <span>Yield calculations for different portion sizes</span>
            </li>
            <li className="flex items-center space-x-2">
              <span className="text-[#29E7CD]">✓</span>
              <span>Ready for COGS calculations and pricing</span>
            </li>
            <li className="flex items-center space-x-2">
              <span className="text-[#29E7CD]">✓</span>
              <span>Perfect examples for creating your own recipes</span>
            </li>
          </ul>
        </div>

        {recipesError && (
          <div className="bg-red-900/20 border border-red-500/30 text-red-300 p-4 rounded-2xl mb-6">
            <div className="flex items-center space-x-2">
              <span className="text-red-400">⚠️</span>
              <span>{recipesError}</span>
            </div>
          </div>
        )}

        {recipesResult && (
          <div className="bg-green-900/20 border border-green-500/30 text-green-300 p-4 rounded-2xl mb-6">
            <div className="flex items-center space-x-2">
              <span className="text-green-400">✅</span>
              <span>{recipesResult}</span>
            </div>
          </div>
        )}

        <div className="text-center">
          <button
            onClick={populateRecipes}
            disabled={recipesLoading || setupProgress.recipes}
            className={`px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-200 ${
              setupProgress.recipes
                ? 'bg-green-600 text-white cursor-not-allowed'
                : recipesLoading
                ? 'bg-[#2a2a2a] text-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-[#29E7CD] to-[#3B82F6] text-white hover:from-[#29E7CD]/80 hover:to-[#3B82F6]/80 shadow-lg hover:shadow-xl'
            }`}
          >
            {setupProgress.recipes ? (
              <span className="flex items-center justify-center space-x-2">
                <span>✅</span>
                <span>Sample Recipes Added!</span>
              </span>
            ) : recipesLoading ? (
              <span className="flex items-center justify-center space-x-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-400"></div>
                <span>Adding Recipes...</span>
              </span>
            ) : (
              <span className="flex items-center justify-center space-x-2">
                <span>🍲</span>
                <span>Add Sample Recipes</span>
              </span>
            )}
          </button>
          
          {!setupProgress.recipes && (
            <p className="text-gray-400 text-sm mt-4">
              This will add several sample recipes to help you get started
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

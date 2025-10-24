'use client';

import { useState } from 'react';

interface RecipesSetupProps {
  setupProgress: {
    ingredients: boolean;
    recipes: boolean;
    equipment: boolean;
    country: boolean;
  };
  onProgressUpdate: (progress: {
    ingredients: boolean;
    recipes: boolean;
    equipment: boolean;
    country: boolean;
  }) => void;
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
        body: JSON.stringify({ populateRecipes: true }),
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
    <div className="rounded-3xl border border-[#2a2a2a] bg-[#1f1f1f] p-8 shadow-lg">
      <div className="mb-8 text-center">
        <div className="mb-4 text-6xl">🍲</div>
        <h3 className="mb-2 text-2xl font-bold text-white">Sample Recipes</h3>
        <p className="text-lg text-gray-400">
          Add sample recipes to get started with recipe management and COGS calculations
        </p>
      </div>

      <div className="mx-auto max-w-2xl">
        <div className="mb-6 rounded-2xl border border-[#2a2a2a] bg-[#2a2a2a]/50 p-6">
          <h4 className="mb-4 text-lg font-semibold text-white">Sample recipes include:</h4>
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
          <div className="mb-6 rounded-2xl border border-red-500/30 bg-red-900/20 p-4 text-red-300">
            <div className="flex items-center space-x-2">
              <span className="text-red-400">⚠️</span>
              <span>{recipesError}</span>
            </div>
          </div>
        )}

        {recipesResult && (
          <div className="mb-6 rounded-2xl border border-green-500/30 bg-green-900/20 p-4 text-green-300">
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
            className={`rounded-2xl px-8 py-4 text-lg font-semibold transition-all duration-200 ${
              setupProgress.recipes
                ? 'cursor-not-allowed bg-green-600 text-white'
                : recipesLoading
                  ? 'cursor-not-allowed bg-[#2a2a2a] text-gray-400'
                  : 'bg-gradient-to-r from-[#29E7CD] to-[#3B82F6] text-white shadow-lg hover:from-[#29E7CD]/80 hover:to-[#3B82F6]/80 hover:shadow-xl'
            }`}
          >
            {setupProgress.recipes ? (
              <span className="flex items-center justify-center space-x-2">
                <span>✅</span>
                <span>Sample Recipes Added!</span>
              </span>
            ) : recipesLoading ? (
              <span className="flex items-center justify-center space-x-2">
                <div className="h-5 w-5 animate-spin rounded-full border-b-2 border-gray-400"></div>
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
            <p className="mt-4 text-sm text-gray-400">
              This will add several sample recipes to help you get started
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

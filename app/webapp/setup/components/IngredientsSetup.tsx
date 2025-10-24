'use client';

import { useState } from 'react';

interface IngredientsSetupProps {
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

export default function IngredientsSetup({
  setupProgress,
  onProgressUpdate,
}: IngredientsSetupProps) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const populateIngredients = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/setup-database', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ populateIngredients: true }),
      });

      const data = await response.json();

      if (response.ok) {
        setResult(data.message);
        onProgressUpdate({ ...setupProgress, ingredients: true });
      } else {
        setError(data.error || 'Failed to populate ingredients');
      }
    } catch (err) {
      setError('Network error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-3xl border border-[#2a2a2a] bg-[#1f1f1f] p-8 shadow-lg">
      <div className="mb-8 text-center">
        <div className="mb-4 text-6xl">🥕</div>
        <h3 className="mb-2 text-2xl font-bold text-white">Ingredients Database</h3>
        <p className="text-lg text-gray-400">
          Populate your database with 300+ common kitchen ingredients including costs, units, and
          yield percentages
        </p>
      </div>

      <div className="mx-auto max-w-2xl">
        <div className="mb-6 rounded-2xl border border-[#2a2a2a] bg-[#2a2a2a]/50 p-6">
          <h4 className="mb-4 text-lg font-semibold text-white">What you'll get:</h4>
          <ul className="space-y-2 text-gray-300">
            <li className="flex items-center space-x-2">
              <span className="text-[#29E7CD]">✓</span>
              <span>300+ common ingredients (vegetables, meats, dairy, spices)</span>
            </li>
            <li className="flex items-center space-x-2">
              <span className="text-[#29E7CD]">✓</span>
              <span>Realistic cost data for Australian suppliers</span>
            </li>
            <li className="flex items-center space-x-2">
              <span className="text-[#29E7CD]">✓</span>
              <span>Proper units (kg, g, L, mL, each, etc.)</span>
            </li>
            <li className="flex items-center space-x-2">
              <span className="text-[#29E7CD]">✓</span>
              <span>Yield percentages and waste factors</span>
            </li>
            <li className="flex items-center space-x-2">
              <span className="text-[#29E7CD]">✓</span>
              <span>Trim and peel waste calculations</span>
            </li>
          </ul>
        </div>

        {error && (
          <div className="mb-6 rounded-2xl border border-red-500/30 bg-red-900/20 p-4 text-red-300">
            <div className="flex items-center space-x-2">
              <span className="text-red-400">⚠️</span>
              <span>{error}</span>
            </div>
          </div>
        )}

        {result && (
          <div className="mb-6 rounded-2xl border border-green-500/30 bg-green-900/20 p-4 text-green-300">
            <div className="flex items-center space-x-2">
              <span className="text-green-400">✅</span>
              <span>{result}</span>
            </div>
          </div>
        )}

        <div className="text-center">
          <button
            onClick={populateIngredients}
            disabled={loading || setupProgress.ingredients}
            className={`rounded-2xl px-8 py-4 text-lg font-semibold transition-all duration-200 ${
              setupProgress.ingredients
                ? 'cursor-not-allowed bg-green-600 text-white'
                : loading
                  ? 'cursor-not-allowed bg-[#2a2a2a] text-gray-400'
                  : 'bg-gradient-to-r from-[#29E7CD] to-[#3B82F6] text-white shadow-lg hover:from-[#29E7CD]/80 hover:to-[#3B82F6]/80 hover:shadow-xl'
            }`}
          >
            {setupProgress.ingredients ? (
              <span className="flex items-center justify-center space-x-2">
                <span>✅</span>
                <span>Ingredients Added Successfully!</span>
              </span>
            ) : loading ? (
              <span className="flex items-center justify-center space-x-2">
                <div className="h-5 w-5 animate-spin rounded-full border-b-2 border-gray-400"></div>
                <span>Adding Ingredients...</span>
              </span>
            ) : (
              <span className="flex items-center justify-center space-x-2">
                <span>🥕</span>
                <span>Add 300+ Ingredients</span>
              </span>
            )}
          </button>

          {!setupProgress.ingredients && (
            <p className="mt-4 text-sm text-gray-400">
              This will take about 10-15 seconds to complete
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

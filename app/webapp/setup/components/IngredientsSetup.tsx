'use client';

import { useState } from 'react';

interface IngredientsSetupProps {
  setupProgress: {
    ingredients: boolean;
    recipes: boolean;
    equipment: boolean;
    country: boolean;
  };
  onProgressUpdate: (progress: { ingredients: boolean; recipes: boolean; equipment: boolean; country: boolean }) => void;
}

export default function IngredientsSetup({ setupProgress, onProgressUpdate }: IngredientsSetupProps) {
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
        body: JSON.stringify({ populateIngredients: true })
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
    <div className="bg-[#1f1f1f] p-8 rounded-3xl shadow-lg border border-[#2a2a2a]">
      <div className="text-center mb-8">
        <div className="text-6xl mb-4">🥕</div>
        <h3 className="text-2xl font-bold text-white mb-2">Ingredients Database</h3>
        <p className="text-gray-400 text-lg">
          Populate your database with 300+ common kitchen ingredients including costs, units, and yield percentages
        </p>
      </div>

      <div className="max-w-2xl mx-auto">
        <div className="bg-[#2a2a2a]/50 p-6 rounded-2xl border border-[#2a2a2a] mb-6">
          <h4 className="text-lg font-semibold text-white mb-4">What you'll get:</h4>
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
          <div className="bg-red-900/20 border border-red-500/30 text-red-300 p-4 rounded-2xl mb-6">
            <div className="flex items-center space-x-2">
              <span className="text-red-400">⚠️</span>
              <span>{error}</span>
            </div>
          </div>
        )}

        {result && (
          <div className="bg-green-900/20 border border-green-500/30 text-green-300 p-4 rounded-2xl mb-6">
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
            className={`px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-200 ${
              setupProgress.ingredients
                ? 'bg-green-600 text-white cursor-not-allowed'
                : loading
                ? 'bg-[#2a2a2a] text-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-[#29E7CD] to-[#3B82F6] text-white hover:from-[#29E7CD]/80 hover:to-[#3B82F6]/80 shadow-lg hover:shadow-xl'
            }`}
          >
            {setupProgress.ingredients ? (
              <span className="flex items-center justify-center space-x-2">
                <span>✅</span>
                <span>Ingredients Added Successfully!</span>
              </span>
            ) : loading ? (
              <span className="flex items-center justify-center space-x-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-400"></div>
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
            <p className="text-gray-400 text-sm mt-4">
              This will take about 10-15 seconds to complete
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';
import Image from 'next/image';
import I18nTest from '../../../components/I18nTest';

export default function SetupPage() {
  const [loading, setLoading] = useState(false);
  const [recipesLoading, setRecipesLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [recipesResult, setRecipesResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [recipesError, setRecipesError] = useState<string | null>(null);

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
      });

      const data = await response.json();

      if (response.ok) {
        setResult(data.message);
      } else {
        setError(data.error || 'Failed to populate ingredients');
      }
    } catch (err) {
      setError('Network error occurred');
    } finally {
      setLoading(false);
    }
  };

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
      });

      const data = await response.json();

      if (response.ok) {
        setRecipesResult(data.message);
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
    <div className="min-h-screen bg-[#0a0a0a] p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header with Logo */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <Image
              src="/images/prepflow-logo.png"
              alt="PrepFlow Logo"
              width={120}
              height={40}
              className="h-8 w-auto"
            />
            <div className="h-8 w-px bg-[#2a2a2a]"></div>
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">
                🛠️ Database Setup
              </h1>
              <p className="text-gray-400">Initialize your PrepFlow database with sample data</p>
            </div>
          </div>
        </div>

        {/* Ingredients Setup Card */}
        <div className="bg-[#1f1f1f] p-6 rounded-3xl shadow-lg border border-[#2a2a2a] max-w-4xl mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-semibold text-white mb-2">📊 Populate Sample Ingredients</h2>
              <p className="text-gray-400">Add realistic Australian kitchen ingredients to get started</p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-[#29E7CD] rounded-full animate-pulse"></div>
              <span className="text-xs text-gray-400">Ready</span>
            </div>
          </div>
          
          <div className="bg-[#2a2a2a]/30 p-4 rounded-2xl border border-[#2a2a2a]/50 mb-6">
            <p className="text-gray-300 leading-relaxed">
              This will add 50+ realistic Australian kitchen ingredients to your database, including proper cost data, 
              waste percentages, and supplier information. Perfect for testing the COGS calculator and recipe management features.
            </p>
          </div>
          
          {/* Action Button */}
          <div className="flex justify-center mb-6">
            <button
              onClick={populateIngredients}
              disabled={loading}
              className="bg-gradient-to-r from-[#29E7CD] to-[#D925C7] text-white px-8 py-4 rounded-2xl hover:from-[#29E7CD]/80 hover:to-[#D925C7]/80 transition-all duration-200 shadow-lg hover:shadow-xl font-medium text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Populating Database...</span>
                </div>
              ) : (
                '🚀 Populate Sample Ingredients'
              )}
            </button>
          </div>

          {/* Status Messages */}
          {result && (
            <div className="mb-6 p-4 bg-gradient-to-r from-green-500/10 to-green-600/10 border border-green-500/30 text-green-400 rounded-2xl">
              <div className="flex items-center space-x-2">
                <span className="text-xl">✅</span>
                <span className="font-medium">{result}</span>
              </div>
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-gradient-to-r from-red-500/10 to-red-600/10 border border-red-500/30 text-red-400 rounded-2xl">
              <div className="flex items-center space-x-2">
                <span className="text-xl">❌</span>
                <span className="font-medium">{error}</span>
              </div>
            </div>
          )}
        </div>

        {/* Recipes Setup Card */}
        <div className="bg-[#1f1f1f] p-6 rounded-3xl shadow-lg border border-[#2a2a2a] max-w-4xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-semibold text-white mb-2">🍽️ Populate Sample Recipes</h2>
              <p className="text-gray-400">Add 12 complete restaurant dishes with full ingredient lists</p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-[#D925C7] rounded-full animate-pulse"></div>
              <span className="text-xs text-gray-400">Ready</span>
            </div>
          </div>
          
          <div className="bg-[#2a2a2a]/30 p-4 rounded-2xl border border-[#2a2a2a]/50 mb-6">
            <p className="text-gray-300 leading-relaxed">
              This will add 12 complete restaurant recipes including Classic Beef Burger, Margherita Pizza, Chicken Caesar Salad, 
              Fish and Chips, Spaghetti Carbonara, Beef Stir Fry, Chocolate Lava Cake, Chicken Tikka Masala, Caesar Salad (Vegetarian), 
              Beef Tacos, Pan-Seared Salmon Fillet, and Apple Crumble. Each recipe includes detailed instructions and complete ingredient lists.
            </p>
          </div>
          
          {/* Action Button */}
          <div className="flex justify-center mb-6">
            <button
              onClick={populateRecipes}
              disabled={recipesLoading}
              className="bg-gradient-to-r from-[#D925C7] to-[#29E7CD] text-white px-8 py-4 rounded-2xl hover:from-[#D925C7]/80 hover:to-[#29E7CD]/80 transition-all duration-200 shadow-lg hover:shadow-xl font-medium text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {recipesLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Adding Recipes...</span>
                </div>
              ) : (
                '🍽️ Populate Sample Recipes'
              )}
            </button>
          </div>

          {/* Status Messages */}
          {recipesResult && (
            <div className="mb-6 p-4 bg-gradient-to-r from-green-500/10 to-green-600/10 border border-green-500/30 text-green-400 rounded-2xl">
              <div className="flex items-center space-x-2">
                <span className="text-xl">✅</span>
                <span className="font-medium">{recipesResult}</span>
              </div>
            </div>
          )}

          {recipesError && (
            <div className="mb-6 p-4 bg-gradient-to-r from-red-500/10 to-red-600/10 border border-red-500/30 text-red-400 rounded-2xl">
              <div className="flex items-center space-x-2">
                <span className="text-xl">❌</span>
                <span className="font-medium">{recipesError}</span>
              </div>
            </div>
          )}

          {/* Information Card */}
          <div className="bg-gradient-to-br from-[#D925C7]/10 to-[#29E7CD]/10 border border-[#D925C7]/30 p-6 rounded-2xl">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#D925C7]/20 to-[#29E7CD]/20 flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">🍽️</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-3">Sample Recipes Include:</h3>
                <ul className="text-gray-300 space-y-2">
                  <li className="flex items-center space-x-2">
                    <span className="w-2 h-2 bg-[#D925C7] rounded-full"></span>
                    <span>Classic Beef Burger with fresh vegetables</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="w-2 h-2 bg-[#D925C7] rounded-full"></span>
                    <span>Margherita Pizza with mozzarella and basil</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="w-2 h-2 bg-[#D925C7] rounded-full"></span>
                    <span>Chicken Caesar Salad with grilled chicken</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="w-2 h-2 bg-[#D925C7] rounded-full"></span>
                    <span>Fish and Chips with beer batter</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="w-2 h-2 bg-[#D925C7] rounded-full"></span>
                    <span>Spaghetti Carbonara with pancetta</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="w-2 h-2 bg-[#D925C7] rounded-full"></span>
                    <span>And 6 more complete restaurant dishes!</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Internationalization Test Component */}
        <div className="mt-8">
          <I18nTest />
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';

export default function PopulateAllCleanData() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isProduction, setIsProduction] = useState(false);

  // Check if we're in production
  useEffect(() => {
    const isProd =
      typeof window !== 'undefined' &&
      (window.location.hostname === 'prepflow.org' ||
        window.location.hostname.includes('vercel.app') ||
        process.env.NODE_ENV === 'production');
    setIsProduction(isProd);
  }, []);

  const populateAllCleanData = async () => {
    if (
      !confirm(
        'This will DELETE all existing test data and replace it with clean test data (~40 ingredients, ~10 recipes, suppliers, equipment, etc.). Continue?',
      )
    ) {
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/populate-clean-test-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (response.ok) {
        setResult(data.message || 'Successfully populated clean test data!');
      } else {
        setError(data.error || 'Failed to populate clean test data');
      }
    } catch (err) {
      setError('Network error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-3xl border border-[#2a2a2a] bg-[#1f1f1f] p-8 shadow-lg">
      <div className="mx-auto max-w-2xl">
        <div className="mb-6 rounded-2xl border border-[#2a2a2a] bg-[#2a2a2a]/50 p-6">
          <h4 className="mb-4 text-lg font-semibold text-white">What you&apos;ll get:</h4>
          <ul className="space-y-2 text-gray-300">
            <li className="flex items-center space-x-2">
              <span className="text-[#29E7CD]">✓</span>
              <span>~40 ingredients (meat, vegetables, dairy, dry goods)</span>
            </li>
            <li className="flex items-center space-x-2">
              <span className="text-[#29E7CD]">✓</span>
              <span>~10 recipes with complete ingredient lists</span>
            </li>
            <li className="flex items-center space-x-2">
              <span className="text-[#29E7CD]">✓</span>
              <span>15-20 suppliers (Australian business names)</span>
            </li>
            <li className="flex items-center space-x-2">
              <span className="text-[#29E7CD]">✓</span>
              <span>15-20 temperature equipment pieces</span>
            </li>
            <li className="flex items-center space-x-2">
              <span className="text-[#29E7CD]">✓</span>
              <span>Cleaning areas, tasks, compliance types, kitchen sections</span>
            </li>
            <li className="flex items-center space-x-2">
              <span className="text-[#29E7CD]">✓</span>
              <span>All data properly linked (recipes to ingredients, etc.)</span>
            </li>
          </ul>
        </div>

        {isProduction && (
          <div className="mb-6 rounded-2xl border border-[#29E7CD]/30 bg-[#29E7CD]/10 p-4 text-[#29E7CD]">
            <div className="flex items-start space-x-2">
              <span className="text-[#29E7CD]">ℹ️</span>
              <div className="flex-1">
                <p className="font-semibold">Development Feature</p>
                <p className="mt-1 text-sm text-gray-300">
                  Test data population is only available in development mode. In production, you
                  should manage your data manually through the respective pages (Ingredients,
                  Recipes, Suppliers, etc.).
                </p>
              </div>
            </div>
          </div>
        )}

        {error && !isProduction && (
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
            onClick={populateAllCleanData}
            disabled={loading || isProduction}
            className={`rounded-2xl px-8 py-4 text-lg font-semibold transition-all duration-200 ${
              loading
                ? 'cursor-not-allowed bg-[#2a2a2a] text-gray-400'
                : 'bg-gradient-to-r from-[#29E7CD] to-[#D925C7] text-white shadow-lg hover:from-[#29E7CD]/80 hover:to-[#D925C7]/80 hover:shadow-xl'
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center space-x-2">
                <div className="h-5 w-5 animate-spin rounded-full border-b-2 border-gray-400"></div>
                <span>Populating Clean Test Data...</span>
              </span>
            ) : (
              <span className="flex items-center justify-center space-x-2">
                <span>✨</span>
                <span>Populate All Clean Test Data</span>
              </span>
            )}
          </button>

          {!loading && (
            <p className="mt-4 text-sm text-gray-400">
              This will delete all existing data and populate clean, moderate test data
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

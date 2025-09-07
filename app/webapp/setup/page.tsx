'use client';

import { useState } from 'react';

export default function SetupPage() {
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

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Database Setup</h1>
      
      <div className="bg-white p-6 rounded-lg shadow max-w-2xl">
        <h2 className="text-xl font-semibold mb-4">Populate Sample Ingredients</h2>
        <p className="text-gray-600 mb-6">
          This will add sample ingredients to your database to get you started with testing the COGS calculator.
        </p>
        
        <button
          onClick={populateIngredients}
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
        >
          {loading ? 'Populating...' : 'Populate Ingredients'}
        </button>

        {result && (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 text-green-700 rounded">
            ✅ {result}
          </div>
        )}

        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded">
            ❌ {error}
          </div>
        )}

        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded">
          <h3 className="font-semibold text-blue-900 mb-2">What this does:</h3>
          <ul className="text-blue-700 text-sm space-y-1">
            <li>• Adds 10 sample ingredients to your database</li>
            <li>• Includes realistic cost data and waste percentages</li>
            <li>• Sets up proper storage and supplier information</li>
            <li>• Ready for immediate COGS calculation testing</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

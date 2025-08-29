'use client';

import { useState, useEffect } from 'react';
import { getTestResults, getActiveTests, getVariantInfo } from '../lib/analytics';

interface ABTestDashboardProps {
  testId?: string;
  className?: string;
}

export default function ABTestDashboard({ testId = 'landing_page_variants', className = '' }: ABTestDashboardProps) {
  const [results, setResults] = useState<any[]>([]);
  const [activeTests, setActiveTests] = useState<string[]>([]);
  const [selectedTest, setSelectedTest] = useState<string>(testId);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadResults = () => {
      try {
        const testResults = getTestResults(selectedTest);
        const tests = getActiveTests();
        
        setResults(testResults);
        setActiveTests(tests);
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading AB test results:', error);
        setIsLoading(false);
      }
    };

    // Load results immediately
    loadResults();

    // Refresh results every 30 seconds
    const interval = setInterval(loadResults, 30000);

    return () => clearInterval(interval);
  }, [selectedTest]);

  if (isLoading) {
    return (
      <div className={`p-6 bg-gray-900 rounded-lg ${className}`}>
        <div className="animate-pulse">
          <div className="h-6 bg-gray-700 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-700 rounded"></div>
            <div className="h-4 bg-gray-700 rounded w-5/6"></div>
            <div className="h-4 bg-gray-700 rounded w-4/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className={`p-6 bg-gray-900 rounded-lg ${className}`}>
        <h3 className="text-lg font-semibold text-white mb-2">A/B Test Results</h3>
        <p className="text-gray-400">No test results available yet. Start testing to see data.</p>
      </div>
    );
  }

  const bestPerformingVariant = results[0];
  const controlVariant = results.find(r => r.variantId === 'control');

  return (
    <div className={`p-6 bg-gray-900 rounded-lg ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white">A/B Test Dashboard</h3>
        <select
          value={selectedTest}
          onChange={(e) => setSelectedTest(e.target.value)}
          className="px-3 py-2 bg-gray-800 text-white rounded border border-gray-600 focus:border-primary focus:outline-none"
        >
          {activeTests.map(test => (
            <option key={test} value={test}>
              {test.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </option>
          ))}
        </select>
      </div>

      {/* Test Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-800 p-4 rounded-lg">
          <div className="text-sm text-gray-400">Total Users</div>
          <div className="text-2xl font-bold text-white">
            {results.reduce((sum, r) => sum + r.totalUsers, 0)}
          </div>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg">
          <div className="text-sm text-gray-400">Total Conversions</div>
          <div className="text-2xl font-bold text-white">
            {results.reduce((sum, r) => sum + r.conversions, 0)}
          </div>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg">
          <div className="text-sm text-gray-400">Best Variant</div>
          <div className="text-2xl font-bold text-green-400">
            {bestPerformingVariant?.variantId.replace('_', ' ').toUpperCase()}
          </div>
        </div>
      </div>

      {/* Variant Results */}
      <div className="space-y-4">
        <h4 className="text-lg font-semibold text-white">Variant Performance</h4>
        {results.map((result, index) => {
          const variantInfo = getVariantInfo(selectedTest, result.variantId);
          const isBest = index === 0;
          const isControl = result.variantId === 'control';
          const improvement = controlVariant && result.variantId !== 'control' 
            ? ((result.conversionRate - controlVariant.conversionRate) / controlVariant.conversionRate * 100).toFixed(1)
            : null;

          return (
            <div
              key={result.variantId}
              className={`p-4 rounded-lg border ${
                isBest ? 'bg-green-900/20 border-green-500' : 
                isControl ? 'bg-blue-900/20 border-blue-500' : 
                'bg-gray-800 border-gray-600'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    isBest ? 'bg-green-500' : 
                    isControl ? 'bg-blue-500' : 'bg-gray-500'
                  }`}></div>
                  <div>
                    <div className="font-semibold text-white">
                      {variantInfo?.name || result.variantId.replace('_', ' ').toUpperCase()}
                      {isBest && <span className="ml-2 text-green-400">🏆 Best</span>}
                      {isControl && <span className="ml-2 text-blue-400">Control</span>}
                    </div>
                    <div className="text-sm text-gray-400">
                      {variantInfo?.description || 'Variant description'}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-white">
                    {result.conversionRate.toFixed(2)}%
                  </div>
                  <div className="text-sm text-gray-400">
                    {result.conversions} / {result.totalUsers} users
                  </div>
                  {improvement && (
                    <div className={`text-sm ${parseFloat(improvement) > 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {parseFloat(improvement) > 0 ? '+' : ''}{improvement}% vs control
                    </div>
                  )}
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-3">
                <div className="flex justify-between text-sm text-gray-400 mb-1">
                  <span>Traffic Split</span>
                  <span>{variantInfo?.trafficSplit || 25}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      isBest ? 'bg-green-500' : 
                      isControl ? 'bg-blue-500' : 'bg-gray-500'
                    }`}
                    style={{ width: `${variantInfo?.trafficSplit || 25}%` }}
                  ></div>
                </div>
              </div>

              {/* Statistical Significance */}
              {result.statisticalSignificance !== undefined && (
                <div className="mt-3 text-sm">
                  <span className="text-gray-400">Statistical Significance: </span>
                  <span className={`font-semibold ${
                    result.statisticalSignificance > 80 ? 'text-green-400' :
                    result.statisticalSignificance > 60 ? 'text-yellow-400' :
                    'text-red-400'
                  }`}>
                    {result.statisticalSignificance}%
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Recommendations */}
      {bestPerformingVariant && bestPerformingVariant.variantId !== 'control' && (
        <div className="mt-6 p-4 bg-green-900/20 border border-green-500 rounded-lg">
          <h5 className="font-semibold text-green-400 mb-2">🎯 Recommendation</h5>
          <p className="text-green-300">
            <strong>{bestPerformingVariant.variantId.replace('_', ' ').toUpperCase()}</strong> is performing{' '}
            {controlVariant ? `${((bestPerformingVariant.conversionRate - controlVariant.conversionRate) / controlVariant.conversionRate * 100).toFixed(1)}%` : 'significantly'} 
            better than the control variant. Consider implementing this version permanently.
          </p>
        </div>
      )}
    </div>
  );
}

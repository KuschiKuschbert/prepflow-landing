'use client';
import { useState } from 'react';
import { BarChart3, Sparkles, TrendingUp, ArrowRight } from 'lucide-react';
import { Icon } from '@/components/ui/Icon';
import Link from 'next/link';

import { logger } from '@/lib/logger';

interface PerformanceEmptyStateProps {
  onDataGenerated?: () => void;
}

export default function PerformanceEmptyState({ onDataGenerated }: PerformanceEmptyStateProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleGenerateSalesData = async () => {
    setIsGenerating(true);
    setError(null);
    setSuccessMessage(null);

    try {
      logger.dev('🔄 Starting sales data generation...');
      const response = await fetch('/api/generate-sales-data', { method: 'POST' });
      logger.dev('📡 Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch {
          errorData = { error: errorText || `HTTP ${response.status}` };
        }
        const errorMsg =
          errorData.message || errorData.error || `HTTP ${response.status}: ${response.statusText}`;
        logger.error('❌ API Error:', {
          message: errorMsg,
          status: response.status,
          statusText: response.statusText,
          response: errorText,
        });
        setError(errorMsg);
        throw new Error(errorMsg);
      }

      const data = await response.json();
      logger.dev('✅ Response data:', data);

      if (data.success) {
        const successMsg = `Successfully generated sales data for ${data.summary.recipesProcessed} recipes over ${data.summary.daysGenerated} days. ${data.summary.salesRecordsCreated} sales records created.`;
        setSuccessMessage(successMsg);

        // Clear cache and trigger data refresh
        if (typeof window !== 'undefined') {
          sessionStorage.removeItem('performance_data');
        }

        // Call the callback to refresh data
        if (onDataGenerated) {
          // Wait a moment for the database to be ready
          setTimeout(() => {
            onDataGenerated();
          }, 1000);
        } else {
          // Fallback to page reload
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        }
      } else {
        const errorMsg = data.message || data.error || 'Unknown error';
        setError(errorMsg);
      }
    } catch (error) {
      logger.error('❌ Error generating sales data:', error);
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      setError(errorMsg);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="tablet:p-12 overflow-hidden rounded-3xl border border-[#2a2a2a] bg-[#1f1f1f] p-8 text-center">
      <div className="mb-6 flex justify-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-r from-[#29E7CD]/20 to-[#D925C7]/20">
          <Icon icon={BarChart3} size="xl" className="text-[#29E7CD]" />
        </div>
      </div>

      <h3 className="mb-3 text-2xl font-semibold text-white">No Performance Data Yet</h3>
      <p className="mx-auto mb-8 max-w-2xl text-gray-400">
        Performance analysis helps you understand which menu items are profitable, which are
        popular, and which need attention. Generate sales data from your recipes to see insights and
        recommendations.
      </p>

      {/* What You'll Get Section */}
      <div className="tablet:grid-cols-3 mx-auto mb-8 grid max-w-3xl grid-cols-1 gap-4">
        <div className="rounded-xl border border-[#2a2a2a] bg-[#2a2a2a]/30 p-4">
          <Icon icon={Sparkles} size="md" className="mx-auto mb-2 text-[#29E7CD]" />
          <h4 className="mb-1 text-sm font-semibold text-white">Smart Insights</h4>
          <p className="text-xs text-gray-400">Automatic categorization of menu items</p>
        </div>
        <div className="rounded-xl border border-[#2a2a2a] bg-[#2a2a2a]/30 p-4">
          <Icon icon={TrendingUp} size="md" className="mx-auto mb-2 text-[#3B82F6]" />
          <h4 className="mb-1 text-sm font-semibold text-white">Profit Analysis</h4>
          <p className="text-xs text-gray-400">See which items make you money</p>
        </div>
        <div className="rounded-xl border border-[#2a2a2a] bg-[#2a2a2a]/30 p-4">
          <Icon icon={BarChart3} size="md" className="mx-auto mb-2 text-[#D925C7]" />
          <h4 className="mb-1 text-sm font-semibold text-white">Recommendations</h4>
          <p className="text-xs text-gray-400">Actionable advice to improve margins</p>
        </div>
      </div>

      {successMessage && (
        <div className="mx-auto mb-6 max-w-md rounded-lg border border-green-500/30 bg-green-900/20 p-4 text-left">
          <p className="text-sm text-green-400">{successMessage}</p>
          <p className="mt-2 text-xs text-green-300">Refreshing data...</p>
        </div>
      )}

      {error && (
        <div className="mx-auto mb-6 max-w-md rounded-lg border border-red-500/30 bg-red-900/20 p-4 text-left">
          <p className="mb-1 text-sm font-semibold text-red-400">Error generating sales data:</p>
          <p className="text-sm text-red-300">{error}</p>
          {error.includes('No recipes found') && (
            <p className="mt-2 text-xs text-red-200">
              Please create recipes first by visiting the{' '}
              <Link href="/webapp/recipes" className="underline hover:text-red-100">
                Recipes page
              </Link>
              .
            </p>
          )}
        </div>
      )}

      <div className="tablet:flex-row flex flex-col items-center justify-center gap-4">
        <button
          onClick={handleGenerateSalesData}
          disabled={isGenerating}
          className={`rounded-2xl bg-gradient-to-r from-[#29E7CD] to-[#D925C7] px-8 py-4 font-semibold text-white transition-all hover:shadow-xl hover:shadow-[#29E7CD]/20 ${
            isGenerating ? 'cursor-not-allowed opacity-50' : ''
          }`}
        >
          {isGenerating ? (
            <span className="flex items-center gap-2">
              <svg className="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Generating...
            </span>
          ) : (
            'Generate Sales Data'
          )}
        </button>

        <Link
          href="/webapp/recipes"
          className="flex items-center gap-2 rounded-2xl border border-[#2a2a2a] bg-[#2a2a2a] px-6 py-4 font-semibold text-white transition-all hover:border-[#29E7CD]/50 hover:text-[#29E7CD]"
        >
          <span>Add Recipes First</span>
          <Icon icon={ArrowRight} size="sm" />
        </Link>
      </div>

      <p className="mt-6 text-sm text-gray-500">
        Or use the browser console:{' '}
        <code className="rounded bg-[#2a2a2a] px-2 py-1 text-xs">
          fetch(&apos;/api/generate-sales-data&apos;, {'{'} method: &apos;POST&apos; {'}'})
        </code>
      </p>
    </div>
  );
}

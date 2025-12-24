'use client';
import { useState } from 'react';
import { BarChart3, Sparkles, TrendingUp, ArrowRight } from 'lucide-react';
import { Icon } from '@/components/ui/Icon';
import { Button } from '@/components/ui/Button';
import { LANDING_COLORS, LANDING_TYPOGRAPHY } from '@/lib/landing-styles';
import Link from 'next/link';
import { useNotification } from '@/contexts/NotificationContext';

import { logger } from '@/lib/logger';

interface PerformanceEmptyStateProps {
  onDataGenerated?: () => void;
}

export default function PerformanceEmptyState({ onDataGenerated }: PerformanceEmptyStateProps) {
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const { showSuccess, showError: showNotificationError } = useNotification();

  const handleGenerateSalesData = async () => {
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
        showNotificationError(errorMsg);
        throw new Error(errorMsg);
      }

      const data = await response.json();
      logger.dev('✅ Response data:', data);

      if (data.success) {
        const successMsg = `Successfully generated sales data for ${data.summary.recipesProcessed} recipes over ${data.summary.daysGenerated} days. ${data.summary.salesRecordsCreated} sales records created.`;
        setSuccessMessage(successMsg);
        showSuccess(successMsg);

        // Clear cache and trigger data refresh
        if (typeof window !== 'undefined') {
          sessionStorage.removeItem('performance_data');
        }

        // Call the callback to refresh data (non-blocking)
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
        showNotificationError(errorMsg);
      }
    } catch (error) {
      logger.error('❌ Error generating sales data:', error);
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      setError(errorMsg);
      showNotificationError(errorMsg);
    }
  };

  return (
    <div className="tablet:p-12 overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-8 text-center">
      <div className="mb-6 flex justify-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-r from-[var(--primary)]/20 to-[var(--accent)]/20">
          <Icon icon={BarChart3} size="xl" className="text-[var(--primary)]" />
        </div>
      </div>

      <h3 className={`${LANDING_TYPOGRAPHY['2xl']} mb-3 font-semibold text-[var(--foreground)]`}>
        No Performance Data Yet
      </h3>
      <p
        className={`${LANDING_TYPOGRAPHY.base} mx-auto mb-8 max-w-2xl text-[var(--foreground-muted)]`}
      >
        Performance analysis helps you understand which menu items are profitable, which are
        popular, and which need attention. Generate sales data from your recipes to see insights and
        recommendations.
      </p>

      {/* What You'll Get Section */}
      <div className="tablet:grid-cols-3 mx-auto mb-8 grid max-w-3xl grid-cols-1 gap-4">
        <div className="rounded-xl border border-[var(--border)] bg-[var(--muted)]/30 p-4">
          <Icon icon={Sparkles} size="md" className="mx-auto mb-2 text-[var(--primary)]" />
          <h4 className="mb-1 text-sm font-semibold text-[var(--foreground)]">Smart Insights</h4>
          <p className="text-xs text-[var(--foreground-muted)]">
            Automatic categorization of menu items
          </p>
        </div>
        <div className="rounded-xl border border-[var(--border)] bg-[var(--muted)]/30 p-4">
          <Icon icon={TrendingUp} size="md" className="mx-auto mb-2 text-[var(--color-info)]" />
          <h4 className="mb-1 text-sm font-semibold text-[var(--foreground)]">Profit Analysis</h4>
          <p className="text-xs text-[var(--foreground-muted)]">See which items make you money</p>
        </div>
        <div className="rounded-xl border border-[var(--border)] bg-[var(--muted)]/30 p-4">
          <Icon icon={BarChart3} size="md" className="mx-auto mb-2 text-[var(--accent)]" />
          <h4 className="mb-1 text-sm font-semibold text-[var(--foreground)]">Recommendations</h4>
          <p className="text-xs text-[var(--foreground-muted)]">
            Actionable advice to improve margins
          </p>
        </div>
      </div>

      {successMessage && (
        <div className="mx-auto mb-6 max-w-md rounded-lg border border-[var(--color-success)]/30 bg-green-900/20 p-4 text-left">
          <p className="text-sm text-[var(--color-success)]">{successMessage}</p>
          <p className="mt-2 text-xs text-green-300">Refreshing data...</p>
        </div>
      )}

      {error && (
        <div className="mx-auto mb-6 max-w-md rounded-lg border border-[var(--color-error)]/30 bg-red-900/20 p-4 text-left">
          <p className="mb-1 text-sm font-semibold text-[var(--color-error)]">
            Error generating sales data:
          </p>
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
        <Button
          onClick={handleGenerateSalesData}
          variant="primary"
          landingStyle={true}
          glow={true}
          className="bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] px-8 py-4"
        >
          Generate Sales Data
        </Button>

        <Link
          href="/webapp/recipes"
          className="flex items-center gap-2 rounded-2xl border border-[var(--border)] bg-[var(--muted)] px-6 py-4 font-semibold text-[var(--foreground)] transition-all hover:border-[var(--primary)]/50 hover:text-[var(--primary)]"
        >
          <span>Add Recipes First</span>
          <Icon icon={ArrowRight} size="sm" />
        </Link>
      </div>

      <p className="mt-6 text-sm text-[var(--foreground-subtle)]">
        Or use the browser console:{' '}
        <code className="rounded bg-[var(--muted)] px-2 py-1 text-xs">
          fetch(&apos;/api/generate-sales-data&apos;, {'{'} method: &apos;POST&apos; {'}'})
        </code>
      </p>
    </div>
  );
}

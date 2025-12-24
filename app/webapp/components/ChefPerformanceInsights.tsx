'use client';

import { Icon } from '@/components/ui/Icon';
import { cacheData, getCachedData } from '@/lib/cache/data-cache';
import { ExternalLink, Sparkles, TrendingDown, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { logger } from '@/lib/logger';

interface PerformanceSummary {
  topSellers: Array<{
    id: string;
    name: string;
    number_sold: number;
    menu_item_class: string;
  }>;
  bottomSellers: Array<{
    id: string;
    name: string;
    number_sold: number;
    menu_item_class: string;
  }>;
  hiddenGems: Array<{
    id: string;
    name: string;
    gross_profit_percentage: number;
    number_sold: number;
  }>;
  categoryCounts: {
    chefsKiss: number;
    hiddenGem: number;
    bargainBucket: number;
    burntToast: number;
  };
}

export default function ChefPerformanceInsights() {
  const [data, setData] = useState<PerformanceSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      // Check cache first (only available on client)
      const cached = getCachedData<PerformanceSummary>('dashboard_performance_summary');
      if (cached) {
        setData(cached);
        setLoading(false);
      }

      try {
        // Filter by locked menu if available
        const response = await fetch('/api/dashboard/performance-summary?lockedMenuOnly=true');
        if (!response.ok) {
          throw new Error('Failed to fetch performance summary');
        }

        const result = await response.json();
        if (result.success) {
          setData(result);
          cacheData('dashboard_performance_summary', result);
          setError(null);
        } else {
          throw new Error(result.message || 'Failed to load performance data');
        }
      } catch (err) {
        logger.error('[ChefPerformanceInsights.tsx] Error in catch block:', {
          error: err instanceof Error ? err.message : String(err),
          stack: err instanceof Error ? err.stack : undefined,
        });

        setError(err instanceof Error ? err.message : 'Failed to load performance insights');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading && !data) {
    return (
      <div className="tablet:rounded-3xl tablet:p-6 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-lg">
        <div className="animate-pulse space-y-4">
          <div className="h-6 w-32 rounded bg-[var(--muted)]" />
          <div className="space-y-2">
            <div className="h-4 w-full rounded bg-[var(--muted)]" />
            <div className="h-4 w-3/4 rounded bg-[var(--muted)]" />
          </div>
        </div>
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="tablet:rounded-3xl tablet:p-6 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-lg">
        <p className="text-sm text-[var(--color-error)]">{error}</p>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <div className="tablet:mb-8 tablet:rounded-3xl tablet:p-6 mb-6 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-lg">
      <div className="tablet:mb-6 mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-fluid-lg tablet:text-fluid-xl font-semibold text-[var(--foreground)]">
            Performance Insights
          </h2>
          <p className="text-fluid-xs tablet:text-fluid-sm mt-1 text-[var(--foreground-muted)]">
            What to cook more/less of this week
          </p>
        </div>
        <Link
          href="/webapp/performance"
          className="text-fluid-xs tablet:text-fluid-sm flex items-center gap-1 text-[var(--primary)] transition-colors hover:text-[var(--accent)]"
        >
          View Full
          <Icon icon={ExternalLink} size="xs" aria-hidden={true} />
        </Link>
      </div>

      <div className="space-y-4">
        {/* Top Sellers */}
        {data.topSellers.length > 0 && (
          <div className="tablet:rounded-2xl tablet:p-4 rounded-xl border border-[var(--border)] bg-[var(--muted)]/30 p-3">
            <div className="mb-2 flex items-center gap-2">
              <Icon
                icon={TrendingUp}
                size="sm"
                className="text-[var(--color-success)]"
                aria-hidden={true}
              />
              <h3 className="text-fluid-sm tablet:text-fluid-base font-medium text-[var(--foreground)]">
                Top 3 Selling Items
              </h3>
            </div>
            <p className="text-fluid-xs tablet:text-fluid-sm mb-3 text-[var(--foreground-muted)]">
              Keep making these - they&apos;re popular!
            </p>
            <div className="space-y-2">
              {data.topSellers.map((item, index) => (
                <div
                  key={`top-seller-${item.id}`}
                  className="tablet:p-3 flex items-center justify-between rounded-lg bg-[var(--surface)] p-2"
                >
                  <div className="flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--color-success)]/20 text-xs font-medium text-[var(--color-success)]">
                      {index + 1}
                    </span>
                    <span className="text-fluid-xs tablet:text-fluid-sm font-medium text-[var(--foreground)]">
                      {item.name}
                    </span>
                  </div>
                  <span className="text-fluid-xs tablet:text-fluid-sm text-[var(--foreground-muted)]">
                    {item.number_sold} sold
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Items Needing Attention */}
        {data.bottomSellers.length > 0 && (
          <div className="tablet:rounded-2xl tablet:p-4 rounded-xl border border-[var(--border)] bg-[var(--muted)]/30 p-3">
            <div className="mb-2 flex items-center gap-2">
              <Icon
                icon={TrendingDown}
                size="sm"
                className="text-[var(--color-error)]"
                aria-hidden={true}
              />
              <h3 className="text-fluid-sm tablet:text-fluid-base font-medium text-[var(--foreground)]">
                Items Needing Attention
              </h3>
            </div>
            <p className="text-fluid-xs tablet:text-fluid-sm mb-3 text-[var(--foreground-muted)]">
              Low sales - consider removing or improving
            </p>
            <div className="space-y-2">
              {data.bottomSellers.map((item, index) => (
                <div
                  key={`bottom-seller-${item.id}`}
                  className="tablet:p-3 flex items-center justify-between rounded-lg bg-[var(--surface)] p-2"
                >
                  <div className="flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--color-error)]/20 text-xs font-medium text-[var(--color-error)]">
                      {index + 1}
                    </span>
                    <span className="text-fluid-xs tablet:text-fluid-sm font-medium text-[var(--foreground)]">
                      {item.name}
                    </span>
                  </div>
                  <span className="text-fluid-xs tablet:text-fluid-sm text-[var(--foreground-muted)]">
                    {item.number_sold} sold
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Hidden Gems */}
        {data.hiddenGems.length > 0 && (
          <div className="tablet:rounded-2xl tablet:p-4 rounded-xl border border-[var(--border)] bg-[var(--muted)]/30 p-3">
            <div className="mb-2 flex items-center gap-2">
              <Icon
                icon={Sparkles}
                size="sm"
                className="text-[var(--primary)]"
                aria-hidden={true}
              />
              <h3 className="text-fluid-sm tablet:text-fluid-base font-medium text-[var(--foreground)]">
                Hidden Gems
              </h3>
            </div>
            <p className="text-fluid-xs tablet:text-fluid-sm mb-3 text-[var(--foreground-muted)]">
              Profitable but not selling - promote these!
            </p>
            <div className="space-y-2">
              {data.hiddenGems.map(item => (
                <Link
                  key={`hidden-gem-${item.id}`}
                  href="/webapp/recipes#menu-builder"
                  className="tablet:p-3 flex items-center justify-between rounded-lg bg-[var(--surface)] p-2 transition-colors hover:bg-[var(--muted)]"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-fluid-xs tablet:text-fluid-sm font-medium text-[var(--foreground)]">
                      {item.name}
                    </span>
                    <span className="rounded-full bg-[var(--primary)]/20 px-2 py-0.5 text-xs text-[var(--primary)]">
                      {item.gross_profit_percentage.toFixed(0)}% profit
                    </span>
                  </div>
                  <span className="text-fluid-xs tablet:text-fluid-sm text-[var(--foreground-muted)]">
                    {item.number_sold} sold
                  </span>
                </Link>
              ))}
            </div>
            <Link
              href="/webapp/menu-builder"
              className="text-fluid-xs tablet:text-fluid-sm mt-3 block text-center font-medium text-[var(--primary)] transition-colors hover:text-[var(--accent)]"
            >
              Feature Hidden Gem →
            </Link>
          </div>
        )}

        {/* Category Summary */}
        <div className="tablet:rounded-2xl tablet:p-4 rounded-xl border border-[var(--border)] bg-[var(--muted)]/30 p-3">
          <h3 className="text-fluid-sm tablet:text-fluid-base mb-3 font-medium text-[var(--foreground)]">
            Category Breakdown
          </h3>
          <div className="tablet:grid-cols-4 grid grid-cols-2 gap-2">
            <div className="tablet:p-3 rounded-lg bg-[var(--surface)] p-2 text-center">
              <p className="text-fluid-xs tablet:text-fluid-sm text-[var(--foreground-muted)]">
                Chef&apos;s Kiss
              </p>
              <p className="text-fluid-lg tablet:text-fluid-xl font-bold text-[var(--color-success)]">
                {data.categoryCounts.chefsKiss}
              </p>
            </div>
            <div className="tablet:p-3 rounded-lg bg-[var(--surface)] p-2 text-center">
              <p className="text-fluid-xs tablet:text-fluid-sm text-[var(--foreground-muted)]">
                Hidden Gem
              </p>
              <p className="text-fluid-lg tablet:text-fluid-xl font-bold text-[var(--primary)]">
                {data.categoryCounts.hiddenGem}
              </p>
            </div>
            <div className="tablet:p-3 rounded-lg bg-[var(--surface)] p-2 text-center">
              <p className="text-fluid-xs tablet:text-fluid-sm text-[var(--foreground-muted)]">
                Bargain Bucket
              </p>
              <p className="text-fluid-lg tablet:text-fluid-xl font-bold text-[var(--color-warning)]">
                {data.categoryCounts.bargainBucket}
              </p>
            </div>
            <div className="tablet:p-3 rounded-lg bg-[var(--surface)] p-2 text-center">
              <p className="text-fluid-xs tablet:text-fluid-sm text-[var(--foreground-muted)]">
                Burnt Toast
              </p>
              <p className="text-fluid-lg tablet:text-fluid-xl font-bold text-[var(--color-error)]">
                {data.categoryCounts.burntToast}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

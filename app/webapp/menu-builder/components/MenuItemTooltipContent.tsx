'use client';
import { StatisticsGrid } from './MenuItemHoverStatistics';

interface ItemStatistics {
  cogs: number;
  recommended_selling_price: number | null;
  actual_selling_price: number | null;
  selling_price: number;
  gross_profit: number;
  gross_profit_margin: number;
  food_cost_percent: number;
  cogs_error?: string; // Optional error message if COGS calculation failed
}

interface MenuItemTooltipContentProps {
  statistics: ItemStatistics | null;
  loading: boolean;
  error: string | null;
}

export function MenuItemTooltipContent({
  statistics,
  loading,
  error,
}: MenuItemTooltipContentProps) {
  if (loading) {
    return (
      <div className="animate-pulse text-xs text-[var(--foreground-muted)] transition-opacity duration-200">
        Loading statistics...
      </div>
    );
  }
  if (error) {
    return (
      <div className="text-xs text-[var(--color-error)] transition-opacity duration-200">
        {error}
      </div>
    );
  }
  if (!statistics) return null;

  // Show error message if COGS calculation failed
  const hasCogsError = statistics.cogs_error != null;
  const hasValidCogs = statistics.cogs > 0 || !hasCogsError;
  const hasMenuPrice = statistics.selling_price > 0;

  // Determine recommended price display and highlighting
  const hasRecommendedPrice = statistics.recommended_selling_price != null;
  const recommendedHigher =
    hasRecommendedPrice &&
    statistics.recommended_selling_price! > statistics.selling_price &&
    Math.abs(statistics.recommended_selling_price! - statistics.selling_price) > 0.01;

  return (
    <div className="space-y-3 transition-opacity duration-200">
      {hasCogsError && (
        <div className="mb-2 rounded-lg border border-[var(--color-warning)]/30 bg-[var(--color-warning)]/10 p-2">
          <div className="text-xs font-medium text-[var(--color-warning)]">
            ⚠️ Calculation Warning
          </div>
          <div className="mt-1 text-xs text-yellow-300/80">{statistics.cogs_error}</div>
        </div>
      )}
      {hasMenuPrice ? (
        <>
          <div className="mb-2 border-b border-[var(--border)] pb-2">
            <div className="text-xs text-[var(--foreground-muted)]">Selling Price</div>
            <div className="flex items-baseline gap-2">
              <div className="text-sm font-semibold text-[var(--foreground)]">
                ${statistics.selling_price.toFixed(2)}
              </div>
              {hasRecommendedPrice && (
                <div
                  className={`text-xs ${
                    recommendedHigher
                      ? 'font-medium text-[var(--color-warning)]'
                      : 'text-[var(--foreground-subtle)]'
                  }`}
                >
                  (${statistics.recommended_selling_price!.toFixed(2)})
                </div>
              )}
            </div>
          </div>
          {hasValidCogs ? (
            <StatisticsGrid statistics={statistics} />
          ) : (
            <div className="text-xs text-[var(--foreground-muted)]">
              Unable to calculate profit metrics - missing cost data
            </div>
          )}
        </>
      ) : (
        <>
          {hasValidCogs ? (
            <StatisticsGrid statistics={statistics} />
          ) : (
            <div className="text-xs text-[var(--foreground-muted)]">
              Unable to calculate statistics - missing cost or price data
            </div>
          )}
        </>
      )}
    </div>
  );
}

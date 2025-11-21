'use client';
import { StatisticsGrid } from './MenuItemHoverStatistics';
import { RecommendedPriceGrid } from './MenuItemHoverStatistics';

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
      <div className="animate-pulse text-xs text-gray-400 transition-opacity duration-200">
        Loading statistics...
      </div>
    );
  }
  if (error) {
    return <div className="text-xs text-red-400 transition-opacity duration-200">{error}</div>;
  }
  if (!statistics) return null;

  // Show error message if COGS calculation failed
  const hasCogsError = statistics.cogs_error != null;
  const hasValidCogs = statistics.cogs > 0 || !hasCogsError;

  return (
    <div className="space-y-3 transition-opacity duration-200">
      {hasCogsError && (
        <div className="mb-2 rounded-lg border border-yellow-500/30 bg-yellow-500/10 p-2">
          <div className="text-xs font-medium text-yellow-400">⚠️ Calculation Warning</div>
          <div className="mt-1 text-xs text-yellow-300/80">{statistics.cogs_error}</div>
        </div>
      )}
      {statistics.actual_selling_price != null ? (
        <>
          <div className="mb-2 border-b border-[#2a2a2a] pb-2">
            <div className="text-xs text-gray-400">Selling Price</div>
            <div className="text-sm font-semibold text-white">
              ${statistics.actual_selling_price.toFixed(2)}
            </div>
            {statistics.recommended_selling_price != null &&
              Math.abs(statistics.actual_selling_price - statistics.recommended_selling_price) >
                0.01 && (
                <div className="mt-1 text-xs text-gray-500">
                  Recommended: ${statistics.recommended_selling_price.toFixed(2)}
                </div>
              )}
          </div>
          {hasValidCogs ? (
            <StatisticsGrid statistics={statistics} />
          ) : (
            <div className="text-xs text-gray-400">
              Unable to calculate profit metrics - missing cost data
            </div>
          )}
        </>
      ) : statistics.recommended_selling_price != null ? (
        <>
          <div className="mb-2 rounded-lg border border-[#29E7CD]/20 bg-[#29E7CD]/5 p-2">
            <div className="mb-1 flex items-center gap-1.5">
              <div className="text-xs font-medium text-[#29E7CD]">Recommended Price</div>
              <div className="text-xs text-gray-400">(Projected)</div>
            </div>
            <div className="text-sm font-semibold text-[#29E7CD]">
              ${statistics.recommended_selling_price.toFixed(2)}
            </div>
          </div>
          {hasValidCogs ? (
            <RecommendedPriceGrid statistics={statistics} />
          ) : (
            <div className="text-xs text-gray-400">
              Unable to calculate profit metrics - missing cost data
            </div>
          )}
        </>
      ) : (
        <>
          {hasValidCogs ? (
            <StatisticsGrid statistics={statistics} />
          ) : (
            <div className="text-xs text-gray-400">
              Unable to calculate statistics - missing cost or price data
            </div>
          )}
        </>
      )}
    </div>
  );
}

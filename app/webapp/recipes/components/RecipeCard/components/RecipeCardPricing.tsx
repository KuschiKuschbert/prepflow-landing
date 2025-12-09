import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import type { RecipePriceData } from '../../../types';

interface RecipeCardPricingProps {
  recipeId: string;
  recipePrices: Record<string, RecipePriceData>;
  yield: number;
}

/**
 * Recipe card pricing information component
 */
export function RecipeCardPricing({
  recipeId,
  recipePrices,
  yield: recipeYield,
}: RecipeCardPricingProps) {
  const priceData = recipePrices[recipeId];

  if (!priceData) {
    return (
      <div className="mb-3 ml-7 space-y-1 text-xs text-gray-500">
        <div title="Recommended selling price based on ingredient costs and target profit margin">
          <span className="font-medium">Recommended Price:</span>
          <LoadingSkeleton variant="text" width="w-24" height="h-4" className="ml-1" />
        </div>
        <div className="text-xs text-gray-600 italic" title="Click Preview to see cost breakdown">
          Price calculation pending...
        </div>
      </div>
    );
  }

  return (
    <div className="mb-3 ml-7 space-y-1 text-xs text-gray-500">
      <div title="Recommended selling price based on ingredient costs and target profit margin">
        <span className="font-medium">Recommended Price:</span>
        <span className="ml-1 font-semibold text-white">
          ${priceData.recommendedPrice.toFixed(2)}
          {recipeYield > 1 && (
            <>
              <span className="ml-1">/portion</span>
              <span className="ml-1 text-xs font-normal text-gray-400">
                (${(priceData.recommendedPrice * recipeYield).toFixed(2)} total)
              </span>
            </>
          )}
        </span>
      </div>
      <div
        title={`Profit margin: ${priceData.gross_profit_margin >= 30 ? 'Excellent' : 'Good'} - Percentage of profit relative to selling price`}
      >
        <span className="font-medium">Profit Margin:</span>
        <span className="ml-1 text-white">{priceData.gross_profit_margin.toFixed(1)}%</span>
        <span className="ml-1 text-gray-400">
          (${priceData.gross_profit.toFixed(2)} profit/portion)
        </span>
      </div>
      <div title="Contributing margin: Profit after variable costs - helps cover fixed costs">
        <span className="font-medium">Contributing Margin:</span>
        <span className="ml-1 font-semibold text-[#D925C7]">
          ${priceData.contributingMargin.toFixed(2)}
        </span>
        <span className="ml-1 text-gray-400">
          ({priceData.contributingMarginPercent.toFixed(1)}% of revenue/portion)
        </span>
      </div>
    </div>
  );
}

'use client';

import { Icon } from '@/components/ui/Icon';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import { Calculator } from 'lucide-react';
import { COGSCalculation } from '@/lib/types/recipes';
import { RecipePriceData } from '@/lib/types/recipes';

interface RecipeSidePanelCostSummaryProps {
  calculations: COGSCalculation[];
  totalCOGS: number;
  costPerPortion: number;
  recipePrice: RecipePriceData | null;
}

export function RecipeSidePanelCostSummary({
  calculations,
  totalCOGS,
  costPerPortion,
  recipePrice,
}: RecipeSidePanelCostSummaryProps) {
  if (calculations.length === 0) return null;

  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--background)] p-4">
      <div className="mb-3 flex items-center gap-2">
        <Icon icon={Calculator} size="sm" className="text-[var(--primary)]" aria-hidden={true} />
        <h3 className="text-sm font-semibold text-[var(--foreground)]">Cost Information</h3>
      </div>
      {recipePrice ? (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-xs text-[var(--foreground-muted)]">Recommended Price</div>
            <div className="text-lg font-semibold text-[var(--foreground)]">
              ${recipePrice.recommendedPrice.toFixed(2)}
            </div>
          </div>
          <div>
            <div className="text-xs text-[var(--foreground-muted)]">Total Cost</div>
            <div className="text-lg font-semibold text-[var(--foreground)]">
              ${costPerPortion.toFixed(2)}
            </div>
          </div>
          <div>
            <div className="text-xs text-[var(--foreground-muted)]">Gross Profit</div>
            <div className="text-lg font-semibold text-[var(--color-success)]">
              ${recipePrice.gross_profit.toFixed(2)}
            </div>
          </div>
          <div>
            <div className="text-xs text-[var(--foreground-muted)]">Profit Margin</div>
            <div
              className={`text-lg font-semibold ${
                recipePrice.gross_profit_margin >= 30
                  ? 'text-[var(--color-success)]'
                  : 'text-[var(--color-warning)]'
              }`}
            >
              {recipePrice.gross_profit_margin.toFixed(1)}%
            </div>
          </div>
          <div className="col-span-2">
            <div className="text-xs text-[var(--foreground-muted)]">Contributing Margin</div>
            <div className="flex items-baseline gap-2">
              <div className="text-lg font-semibold text-[var(--accent)]">
                ${recipePrice.contributingMargin.toFixed(2)}
              </div>
              <div className="text-sm text-[var(--foreground-muted)]">
                ({recipePrice.contributingMarginPercent.toFixed(1)}%)
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-xs text-[var(--foreground-muted)]">Total Cost</div>
            <div className="text-lg font-semibold text-[var(--foreground)]">
              ${totalCOGS.toFixed(2)}
            </div>
          </div>
          <div>
            <div className="text-xs text-[var(--foreground-muted)]">Cost per Portion</div>
            <div className="text-lg font-semibold text-[var(--primary)]">
              ${costPerPortion.toFixed(2)}
            </div>
          </div>
          <div className="col-span-2">
            <LoadingSkeleton variant="text" width="w-full" height="h-4" />
          </div>
        </div>
      )}
    </div>
  );
}

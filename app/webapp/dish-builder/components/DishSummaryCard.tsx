'use client';

import { Icon } from '@/components/ui/Icon';
import { Package, DollarSign, Calculator, TrendingUp } from 'lucide-react';
import { PricingCalculation } from '../../cogs/types';

interface DishSummaryCardProps {
  ingredientCount: number;
  totalCOGS: number;
  costPerPortion: number;
  pricingCalculation: PricingCalculation | null;
}

export default function DishSummaryCard({
  ingredientCount,
  totalCOGS,
  costPerPortion,
  pricingCalculation,
}: DishSummaryCardProps) {
  return (
    <div className="rounded-3xl border border-[var(--primary)]/30 bg-gradient-to-br from-[var(--primary)]/10 via-[var(--accent)]/10 to-[var(--primary)]/10 p-6 shadow-lg">
      <div className="tablet:grid-cols-4 grid grid-cols-2 gap-4">
        {/* Ingredient Count */}
        <div className="rounded-xl border border-[var(--border)]/50 bg-[var(--surface)]/50 p-4">
          <div className="mb-2 flex items-center gap-2">
            <Icon icon={Package} size="sm" className="text-[var(--primary)]" aria-hidden={true} />
            <span className="text-xs font-medium tracking-wide text-[var(--foreground-muted)] uppercase">
              Ingredients
            </span>
          </div>
          <div className="text-2xl font-bold text-[var(--foreground)]">{ingredientCount}</div>
          <div className="text-xs text-[var(--foreground-muted)]">items added</div>
        </div>

        {/* Total COGS */}
        <div className="rounded-xl border border-[var(--border)]/50 bg-[var(--surface)]/50 p-4">
          <div className="mb-2 flex items-center gap-2">
            <Icon
              icon={Calculator}
              size="sm"
              className="text-[var(--color-info)]"
              aria-hidden={true}
            />
            <span className="text-xs font-medium tracking-wide text-[var(--foreground-muted)] uppercase">
              Total COGS
            </span>
          </div>
          <div className="text-2xl font-bold text-[var(--foreground)]">${totalCOGS.toFixed(2)}</div>
          <div className="text-xs text-[var(--foreground-muted)]">total cost</div>
        </div>

        {/* Cost Per Portion */}
        <div className="rounded-xl border border-[var(--border)]/50 bg-[var(--surface)]/50 p-4">
          <div className="mb-2 flex items-center gap-2">
            <Icon icon={DollarSign} size="sm" className="text-[var(--accent)]" aria-hidden={true} />
            <span className="text-xs font-medium tracking-wide text-[var(--foreground-muted)] uppercase">
              Per Portion
            </span>
          </div>
          <div className="text-2xl font-bold text-[var(--foreground)]">
            ${costPerPortion.toFixed(2)}
          </div>
          <div className="text-xs text-[var(--foreground-muted)]">cost per serving</div>
        </div>

        {/* Recommended Price */}
        <div className="rounded-xl border border-[var(--primary)]/50 bg-gradient-to-br from-[var(--primary)]/20 to-[var(--accent)]/20 p-4">
          <div className="mb-2 flex items-center gap-2">
            <Icon
              icon={TrendingUp}
              size="sm"
              className="text-[var(--primary)]"
              aria-hidden={true}
            />
            <span className="text-xs font-medium tracking-wide text-[var(--primary)] uppercase">
              Recommended
            </span>
          </div>
          {pricingCalculation ? (
            <>
              <div className="text-2xl font-bold text-[var(--foreground)]">
                ${pricingCalculation.sellPriceInclGST.toFixed(2)}
              </div>
              <div className="text-xs text-[var(--foreground-secondary)]">
                {pricingCalculation.actualGrossProfit.toFixed(1)}% GP
              </div>
            </>
          ) : (
            <>
              <div className="text-2xl font-bold text-[var(--foreground-muted)]">$0.00</div>
              <div className="text-xs text-[var(--foreground-subtle)]">add ingredients</div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

'use client';

import { COGSTable } from '../../cogs/components/COGSTable';
import { COGSTableSummary } from '../../cogs/components/COGSTableSummary';
import { PricingTool } from '../../cogs/components/PricingTool';
import { usePricing } from '../../cogs/hooks/usePricing';
import { COGSCalculation } from '../../cogs/types';

interface UnifiedRecipeModalCogsTabProps {
  calculations: COGSCalculation[];
  totalCOGS: number;
  costPerPortion: number;
  dishPortions: number;
}

export function UnifiedRecipeModalCogsTab({
  calculations,
  totalCOGS,
  costPerPortion,
  dishPortions,
}: UnifiedRecipeModalCogsTabProps) {
  const {
    targetGrossProfit,
    pricingStrategy,
    pricingCalculation,
    allStrategyPrices,
    setTargetGrossProfit,
    setPricingStrategy,
  } = usePricing(costPerPortion);

  if (calculations.length === 0) {
    return (
      <div className="py-12 text-center text-gray-400">
        No ingredients found. Add ingredients to see COGS breakdown.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <COGSTable
        calculations={calculations}
        editingIngredient={null}
        editQuantity={0}
        onEditIngredient={() => {}}
        onSaveEdit={() => {}}
        onCancelEdit={() => {}}
        onRemoveIngredient={() => {}}
        onEditQuantityChange={() => {}}
        totalCOGS={totalCOGS}
        costPerPortion={costPerPortion}
        dishPortions={dishPortions}
      />
      <COGSTableSummary
        totalCOGS={totalCOGS}
        costPerPortion={costPerPortion}
        dishPortions={dishPortions}
      />
      {costPerPortion > 0 && (
        <PricingTool
          costPerPortion={costPerPortion}
          targetGrossProfit={targetGrossProfit}
          pricingStrategy={pricingStrategy}
          pricingCalculation={pricingCalculation}
          allStrategyPrices={allStrategyPrices}
          onTargetGrossProfitChange={setTargetGrossProfit}
          onPricingStrategyChange={setPricingStrategy}
        />
      )}
    </div>
  );
}


'use client';

import { COGSCalculation, PricingCalculation } from '../../cogs/types';
import { PricingTool } from '../../cogs/components/PricingTool';
import { DishIngredientTable } from './DishIngredientTable';

interface CostAnalysisSectionProps {
  calculations: COGSCalculation[];
  editingIngredient: string | null;
  editQuantity: number;
  onEditIngredient: (ingredientId: string, currentQuantity: number) => void;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
  onRemoveIngredient: (ingredientId: string) => void | Promise<void>;
  onEditQuantityChange: (quantity: number) => void;
  totalCOGS: number;
  costPerPortion: number;
  targetGrossProfit: number;
  pricingStrategy: 'charm' | 'whole' | 'real';
  pricingCalculation: PricingCalculation | null;
  allStrategyPrices: {
    charm: PricingCalculation;
    whole: PricingCalculation;
    real: PricingCalculation;
  } | null;
  onTargetGrossProfitChange: (gp: number) => void;
  onPricingStrategyChange: (strategy: 'charm' | 'whole' | 'real') => void;
}

export default function CostAnalysisSection({
  calculations,
  editingIngredient,
  editQuantity,
  onEditIngredient,
  onSaveEdit,
  onCancelEdit,
  onRemoveIngredient,
  onEditQuantityChange,
  totalCOGS,
  costPerPortion,
  targetGrossProfit,
  pricingStrategy,
  pricingCalculation,
  allStrategyPrices,
  onTargetGrossProfitChange,
  onPricingStrategyChange,
}: CostAnalysisSectionProps) {
  return (
    <div className="tablet:p-6 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow">
      <h2 className="tablet:text-xl mb-4 text-lg font-semibold text-[var(--foreground)]">Cost Analysis</h2>

      {/* Ingredients Table */}
      <DishIngredientTable
        calculations={calculations}
        editingIngredient={editingIngredient}
        editQuantity={editQuantity}
        onEditIngredient={onEditIngredient}
        onSaveEdit={onSaveEdit}
        onCancelEdit={onCancelEdit}
        onRemoveIngredient={onRemoveIngredient}
        onEditQuantityChange={onEditQuantityChange}
        totalCOGS={totalCOGS}
        costPerPortion={costPerPortion}
      />

      {/* Pricing Tool */}
      {costPerPortion > 0 && pricingCalculation && allStrategyPrices && (
        <PricingTool
          costPerPortion={costPerPortion}
          targetGrossProfit={targetGrossProfit}
          pricingStrategy={pricingStrategy}
          pricingCalculation={pricingCalculation}
          allStrategyPrices={allStrategyPrices}
          onTargetGrossProfitChange={onTargetGrossProfitChange}
          onPricingStrategyChange={onPricingStrategyChange}
        />
      )}
    </div>
  );
}

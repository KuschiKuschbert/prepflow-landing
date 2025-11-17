interface CostSummaryProps {
  totalCOGS: number;
  costPerPortion: number;
  ingredientCount: number;
  itemType: 'recipe' | 'dish';
}

export function CostSummary({
  totalCOGS,
  costPerPortion,
  ingredientCount,
  itemType,
}: CostSummaryProps) {
  return (
    <div className="mb-6 rounded-xl border border-[#2a2a2a] bg-[#0a0a0a] p-4">
      <div className="grid grid-cols-3 gap-4">
        <div>
          <p className="text-xs text-gray-400">Total Cost</p>
          <p className="text-xl font-bold text-white">${totalCOGS.toFixed(2)}</p>
        </div>
        <div>
          <p className="text-xs text-gray-400">
            Cost per {itemType === 'recipe' ? 'Portion' : 'Serving'}
          </p>
          <p className="text-xl font-bold text-[#29E7CD]">${costPerPortion.toFixed(2)}</p>
        </div>
        <div>
          <p className="text-xs text-gray-400">Ingredients</p>
          <p className="text-xl font-bold text-white">{ingredientCount}</p>
        </div>
      </div>
    </div>
  );
}

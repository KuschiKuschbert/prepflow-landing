interface CostSummaryProps {
  totalCOGS: number;
  costPerPortion: number;
  ingredientCount: number;
  consumableCount?: number;
  itemType: 'recipe' | 'dish';
}

export function CostSummary({
  totalCOGS,
  costPerPortion,
  ingredientCount,
  consumableCount = 0,
  itemType,
}: CostSummaryProps) {
  const totalItems = ingredientCount + consumableCount;
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
          <p className="text-xs text-gray-400">Items</p>
          <p className="text-xl font-bold text-white">
            {totalItems}
            {consumableCount > 0 && (
              <span className="ml-1 text-sm text-gray-400">
                ({ingredientCount} ing. + {consumableCount} cons.)
              </span>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}

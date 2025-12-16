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
    <div className="mb-6 rounded-xl border border-[var(--border)] bg-[var(--background)] p-4">
      <div className="grid grid-cols-3 gap-4">
        <div>
          <p className="text-xs text-[var(--foreground-muted)]">Total Cost</p>
          <p className="text-xl font-bold text-[var(--foreground)]">${totalCOGS.toFixed(2)}</p>
        </div>
        <div>
          <p className="text-xs text-[var(--foreground-muted)]">
            Cost per {itemType === 'recipe' ? 'Portion' : 'Serving'}
          </p>
          <p className="text-xl font-bold text-[var(--primary)]">${costPerPortion.toFixed(2)}</p>
        </div>
        <div>
          <p className="text-xs text-[var(--foreground-muted)]">Items</p>
          <p className="text-xl font-bold text-[var(--foreground)]">
            {totalItems}
            {consumableCount > 0 && (
              <span className="ml-1 text-sm text-[var(--foreground-muted)]">
                ({ingredientCount} ing. + {consumableCount} cons.)
              </span>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}

'use client';

interface DishFormPricingProps {
  totalCost: number;
  recommendedPrice: number;
  sellingPrice: string;
  costLoading: boolean;
  priceOverride: boolean;
  onPriceChange: (value: string) => void;
  onPriceOverride: () => void;
  onUseAutoPrice: () => void;
}

export default function DishFormPricing({
  totalCost,
  recommendedPrice,
  sellingPrice,
  costLoading,
  priceOverride,
  onPriceChange,
  onPriceOverride,
  onUseAutoPrice,
}: DishFormPricingProps) {
  return (
    <div className="mb-6">
      <div className="mb-2 flex items-center justify-between">
        <label className="block text-sm font-medium text-[var(--foreground-secondary)]">
          Selling Price *
        </label>
        {!priceOverride && totalCost > 0 && (
          <button
            type="button"
            onClick={onPriceOverride}
            className="text-xs text-[var(--primary)] hover:text-[var(--primary)]/80"
          >
            Override auto-price
          </button>
        )}
        {priceOverride && (
          <button
            type="button"
            onClick={onUseAutoPrice}
            className="text-xs text-[var(--foreground-muted)] hover:text-[var(--foreground-secondary)]"
          >
            Use auto-price
          </button>
        )}
      </div>
      <input
        type="number"
        step="0.01"
        min="0"
        value={sellingPrice}
        onChange={e => {
          onPriceChange(e.target.value);
          onPriceOverride();
        }}
        className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-4 py-2 text-[var(--foreground)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]"
        required
      />
      {totalCost > 0 && (
        <div className="mt-2 space-y-1 text-xs text-[var(--foreground-muted)]">
          <div className="flex justify-between">
            <span>Food Cost:</span>
            <span
              className={
                costLoading ? 'text-[var(--foreground-subtle)]' : 'text-[var(--foreground)]'
              }
            >
              {costLoading ? 'Calculating...' : `$${totalCost.toFixed(2)}`}
            </span>
          </div>
          {!priceOverride && (
            <div className="flex justify-between">
              <span>Recommended Price:</span>
              <span className="text-[var(--primary)]">${recommendedPrice.toFixed(2)}</span>
            </div>
          )}
          {sellingPrice && parseFloat(sellingPrice) > 0 && (
            <div className="flex justify-between">
              <span>Food Cost %:</span>
              <span
                className={
                  (totalCost / parseFloat(sellingPrice)) * 100 > 35
                    ? 'text-[var(--color-error)]'
                    : (totalCost / parseFloat(sellingPrice)) * 100 > 30
                      ? 'text-[var(--color-warning)]'
                      : 'text-[var(--color-success)]'
                }
              >
                {((totalCost / parseFloat(sellingPrice)) * 100).toFixed(1)}%
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

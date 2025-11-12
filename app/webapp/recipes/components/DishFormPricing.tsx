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
        <label className="block text-sm font-medium text-gray-300">Selling Price *</label>
        {!priceOverride && totalCost > 0 && (
          <button
            type="button"
            onClick={onPriceOverride}
            className="text-xs text-[#29E7CD] hover:text-[#29E7CD]/80"
          >
            Override auto-price
          </button>
        )}
        {priceOverride && (
          <button
            type="button"
            onClick={onUseAutoPrice}
            className="text-xs text-gray-400 hover:text-gray-300"
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
        className="w-full rounded-lg border border-[#2a2a2a] bg-[#0a0a0a] px-4 py-2 text-white focus:border-[#29E7CD] focus:ring-2 focus:ring-[#29E7CD]"
        required
      />
      {totalCost > 0 && (
        <div className="mt-2 space-y-1 text-xs text-gray-400">
          <div className="flex justify-between">
            <span>Food Cost:</span>
            <span className={costLoading ? 'text-gray-500' : 'text-white'}>
              {costLoading ? 'Calculating...' : `$${totalCost.toFixed(2)}`}
            </span>
          </div>
          {!priceOverride && (
            <div className="flex justify-between">
              <span>Recommended Price:</span>
              <span className="text-[#29E7CD]">${recommendedPrice.toFixed(2)}</span>
            </div>
          )}
          {sellingPrice && parseFloat(sellingPrice) > 0 && (
            <div className="flex justify-between">
              <span>Food Cost %:</span>
              <span
                className={
                  (totalCost / parseFloat(sellingPrice)) * 100 > 35
                    ? 'text-red-400'
                    : (totalCost / parseFloat(sellingPrice)) * 100 > 30
                      ? 'text-yellow-400'
                      : 'text-green-400'
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

'use client';

interface COGSTableSummaryProps {
  totalCOGS: number;
  costPerPortion: number;
  dishPortions: number;
}

export function COGSTableSummary({
  totalCOGS,
  costPerPortion,
  dishPortions,
}: COGSTableSummaryProps) {
  return (
    <div className="border-t pt-4">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-lg font-medium text-white">Total COGS:</span>
        <span className="text-lg font-bold text-[#29E7CD]">${totalCOGS.toFixed(2)}</span>
      </div>
      {dishPortions > 0 && (
        <div className="mb-4 flex items-center justify-between">
          <span className="text-sm text-gray-400">Cost per portion:</span>
          <span className="text-sm font-medium text-white">${costPerPortion.toFixed(2)}</span>
        </div>
      )}
    </div>
  );
}


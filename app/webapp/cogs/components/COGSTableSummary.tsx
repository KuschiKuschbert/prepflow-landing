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
        <span className="text-lg font-medium text-[var(--foreground)]">Total COGS:</span>
        <span className="text-lg font-bold text-[var(--primary)]">${totalCOGS.toFixed(2)}</span>
      </div>
      {dishPortions > 0 && (
        <div className="mb-4 flex items-center justify-between">
          <span className="text-sm text-[var(--foreground-muted)]">Cost per portion:</span>
          <span className="text-sm font-medium text-[var(--foreground)]">
            ${costPerPortion.toFixed(2)}
          </span>
        </div>
      )}
    </div>
  );
}

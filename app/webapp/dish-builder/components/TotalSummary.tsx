'use client';

interface TotalSummaryProps {
  totalCOGS: number;
  costPerPortion: number;
}

/** Summary section showing Total COGS and Cost per Portion */
export function TotalSummary({ totalCOGS, costPerPortion }: TotalSummaryProps) {
  return (
    <div className="border-t border-[var(--border)] pt-4">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-lg font-medium text-[var(--foreground)]">Total COGS:</span>
        <span className="text-lg font-bold text-[var(--primary)]">${totalCOGS.toFixed(2)}</span>
      </div>
      {costPerPortion > 0 && (
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

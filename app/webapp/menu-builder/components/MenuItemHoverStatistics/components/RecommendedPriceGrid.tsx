interface ItemStatistics {
  cogs: number;
  recommended_selling_price: number | null;
  actual_selling_price: number | null;
  selling_price: number;
  gross_profit: number;
  gross_profit_margin: number;
  food_cost_percent: number;
  cogs_error?: string;
}

export function RecommendedPriceGrid({ statistics }: { statistics: ItemStatistics }) {
  const profit = statistics.recommended_selling_price! - statistics.cogs;
  const margin =
    statistics.recommended_selling_price! > 0
      ? (profit / statistics.recommended_selling_price!) * 100
      : 0;
  const profitColor = profit >= 0 ? 'text-[var(--primary)]' : 'text-[var(--color-error)]';
  const marginColor = margin >= 0 ? 'text-[var(--primary)]' : 'text-[var(--color-error)]';
  return (
    <div className="grid grid-cols-2 gap-2 text-xs">
      <div>
        <div className="text-[var(--foreground-muted)]">COGS</div>
        <div className="font-medium text-[var(--foreground)]">${statistics.cogs.toFixed(2)}</div>
      </div>
      <div>
        <div className="text-[var(--foreground-muted)]">Revenue</div>
        <div className="font-medium text-[var(--foreground)]">
          ${statistics.recommended_selling_price!.toFixed(2)}
        </div>
      </div>
      <div>
        <div className="text-[var(--foreground-muted)]">Gross Profit</div>
        <div className={`font-medium ${profitColor}`}>${profit.toFixed(2)}</div>
      </div>
      <div>
        <div className="text-[var(--foreground-muted)]">Profit Margin</div>
        <div className={`font-medium ${marginColor}`}>{margin.toFixed(1)}%</div>
      </div>
    </div>
  );
}




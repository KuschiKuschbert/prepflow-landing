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
  const profitColor = profit >= 0 ? 'text-[#29E7CD]' : 'text-red-400';
  const marginColor = margin >= 0 ? 'text-[#29E7CD]' : 'text-red-400';
  return (
    <div className="grid grid-cols-2 gap-2 text-xs">
      <div>
        <div className="text-gray-400">COGS</div>
        <div className="font-medium text-white">${statistics.cogs.toFixed(2)}</div>
      </div>
      <div>
        <div className="text-gray-400">Revenue</div>
        <div className="font-medium text-white">
          ${statistics.recommended_selling_price!.toFixed(2)}
        </div>
      </div>
      <div>
        <div className="text-gray-400">Gross Profit</div>
        <div className={`font-medium ${profitColor}`}>${profit.toFixed(2)}</div>
      </div>
      <div>
        <div className="text-gray-400">Profit Margin</div>
        <div className={`font-medium ${marginColor}`}>{margin.toFixed(1)}%</div>
      </div>
    </div>
  );
}

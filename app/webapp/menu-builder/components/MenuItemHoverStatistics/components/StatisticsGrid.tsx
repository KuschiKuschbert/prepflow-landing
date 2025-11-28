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

/**
 * Get color class for profit margin based on thresholds
 * ≥ 65%: Good (cyan), 50-65%: Warning (yellow), < 50%: Critical (red)
 */
function getProfitMarginColor(margin: number): string {
  if (margin >= 65) {
    return 'text-[#29E7CD]'; // Good - cyan
  } else if (margin >= 50) {
    return 'text-yellow-400'; // Warning - yellow
  } else {
    return 'text-red-400'; // Critical - red
  }
}

/**
 * Get color class for food cost % based on thresholds
 * ≤ 30%: Good (green), 30-35%: Warning (yellow), > 35%: Critical (red)
 */
function getFoodCostColor(foodCostPercent: number): string {
  if (foodCostPercent <= 30) {
    return 'text-green-400'; // Good - green
  } else if (foodCostPercent <= 35) {
    return 'text-yellow-400'; // Warning - yellow
  } else {
    return 'text-red-400'; // Critical - red
  }
}

export function StatisticsGrid({ statistics }: { statistics: ItemStatistics }) {
  // Gross Profit (dollar amount) uses positive/negative logic
  const profitColor = (value: number) => (value >= 0 ? 'text-[#29E7CD]' : 'text-red-400');

  return (
    <div className="grid grid-cols-2 gap-2 text-xs">
      <div>
        <div className="text-gray-400">COGS</div>
        <div className="font-medium text-white">${statistics.cogs.toFixed(2)}</div>
      </div>
      <div>
        <div className="text-gray-400">Revenue</div>
        <div className="font-medium text-white">${statistics.selling_price.toFixed(2)}</div>
      </div>
      <div>
        <div className="text-gray-400">Gross Profit</div>
        <div className={`font-medium ${profitColor(statistics.gross_profit)}`}>
          ${statistics.gross_profit.toFixed(2)}
        </div>
      </div>
      <div>
        <div className="text-gray-400">Profit Margin</div>
        <div className={`font-medium ${getProfitMarginColor(statistics.gross_profit_margin)}`}>
          {statistics.gross_profit_margin.toFixed(1)}%
        </div>
      </div>
      <div className="col-span-2">
        <div className="text-gray-400">Food Cost %</div>
        <div className={`font-medium ${getFoodCostColor(statistics.food_cost_percent)}`}>
          {statistics.food_cost_percent.toFixed(1)}%
        </div>
      </div>
    </div>
  );
}

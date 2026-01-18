import type { TemperatureEquipment } from '@/app/webapp/temperature/types';

interface ChartDataPoint {
  timestamp: string;
  temperature: number;
  date: string;
  time: string;
  timeValue: number;
  xIndex: number;
}

/**
 * Prepare chart data with red area boundaries for ComposedChart
 */
export function prepareChartData(
  chartData: ChartDataPoint[],
  equipment: TemperatureEquipment,
  yMin: number,
  yMax: number,
) {
  return chartData.map((point, _index) => ({
    ...point,
    redAreaBelow: equipment.min_temp_celsius !== null ? equipment.min_temp_celsius : yMin,
    redAreaAbove: yMax,
    topBoundary: yMax,
  }));
}

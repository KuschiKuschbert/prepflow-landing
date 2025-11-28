import { TemperatureEquipment } from '../../types';

interface ChartDataPoint {
  temperature: number;
}

/**
 * Calculate Y-axis bounds for temperature chart
 */
export function calculateYAxisBounds(
  chartData: ChartDataPoint[],
  equipment: TemperatureEquipment,
): { yMin: number; yMax: number } {
  const dataMin = chartData.length > 0 ? Math.min(...chartData.map(d => d.temperature)) : -30;
  const dataMax = chartData.length > 0 ? Math.max(...chartData.map(d => d.temperature)) : 30;

  const minWithThreshold =
    equipment.min_temp_celsius !== null ? Math.min(dataMin, equipment.min_temp_celsius) : dataMin;
  const maxWithThreshold =
    equipment.max_temp_celsius !== null ? Math.max(dataMax, equipment.max_temp_celsius) : dataMax;
  const padding = Math.max(1, (maxWithThreshold - minWithThreshold) * 0.1);
  const yMin = minWithThreshold - padding;
  const yMax = maxWithThreshold + padding;

  return { yMin, yMax };
}

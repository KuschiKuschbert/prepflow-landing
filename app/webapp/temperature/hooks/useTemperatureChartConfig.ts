'use client';

import { useMemo } from 'react';
import { TemperatureEquipment } from '../types';

interface ChartDataPoint {
  temperature: number;
  timeValue: number;
  xIndex: number;
}

export function useTemperatureChartConfig(
  chartData: ChartDataPoint[],
  equipment: TemperatureEquipment,
) {
  const { yAxisMin, yAxisMax, xAxisDomain, xAxisTicks } = useMemo(() => {
    const dataMin = chartData.length > 0 ? Math.min(...chartData.map(d => d.temperature)) : null;
    const dataMax = chartData.length > 0 ? Math.max(...chartData.map(d => d.temperature)) : null;

    let yMin: number | string = 'dataMin - 1';
    let yMax: number | string = 'dataMax + 1';

    if (dataMin !== null && dataMax !== null) {
      const minWithThreshold =
        equipment.min_temp_celsius !== null
          ? Math.min(dataMin, equipment.min_temp_celsius)
          : dataMin;
      const maxWithThreshold =
        equipment.max_temp_celsius !== null
          ? Math.max(dataMax, equipment.max_temp_celsius)
          : dataMax;
      const padding = Math.max(1, (maxWithThreshold - minWithThreshold) * 0.1);
      yMin = minWithThreshold - padding;
      yMax = maxWithThreshold + padding;
    }

    const xMin = chartData.length > 0 ? 0 : 0;
    const xMax = chartData.length > 0 ? chartData.length - 1 : 10;
    const xDomain: [number, number] = [xMin, xMax];
    const numTicks = Math.min(6, chartData.length);
    const xTicks = Array.from({ length: numTicks }, (_, i) => {
      const index = Math.round((i / (numTicks - 1)) * (chartData.length - 1));
      return index;
    }).filter(tick => tick >= 0 && tick < chartData.length);

    return {
      yAxisMin: yMin,
      yAxisMax: yMax,
      xAxisDomain: xDomain,
      xAxisTicks: xTicks,
    };
  }, [chartData, equipment]);

  return { yAxisMin, yAxisMax, xAxisDomain, xAxisTicks };
}

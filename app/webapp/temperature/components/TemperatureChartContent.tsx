'use client';

// Temporarily import directly to debug why dynamic import isn't working
import TemperatureChartLazy from './TemperatureChartLazy';
import { TemperatureEquipment } from '../types';
import { logger } from '@/lib/logger';

interface ChartDataPoint {
  timestamp: string;
  temperature: number;
  date: string;
  time: string;
  timeValue: number;
  xIndex: number;
}

interface TemperatureChartContentProps {
  chartData: ChartDataPoint[];
  equipment: TemperatureEquipment;
  yAxisMin: number | string;
  yAxisMax: number | string;
  xAxisDomain: [number, number];
  xAxisTicks: number[];
  formatXAxisLabel: (tickItem: number | string) => string;
  formatTooltipLabel: (label: number | string) => string;
  formatTooltipValue: (value: number) => string;
  statistics?: import('./utils').TemperatureStatistics | null;
}

export function TemperatureChartContent(props: TemperatureChartContentProps) {
  logger.dev('[TemperatureChartContent] Rendering, props:', {
    chartDataLength: props.chartData.length,
    equipmentName: props.equipment.name,
    min_temp: props.equipment.min_temp_celsius,
    max_temp: props.equipment.max_temp_celsius,
  });
  return <TemperatureChartLazy {...props} />;
}

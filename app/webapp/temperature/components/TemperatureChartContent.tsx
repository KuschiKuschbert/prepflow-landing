'use client';

import dynamic from 'next/dynamic';
import { TemperatureEquipment } from '../types';
import { logger } from '@/lib/logger';

// Lazy load Recharts component to reduce initial bundle size
const TemperatureChartLazy = dynamic(() => import('./TemperatureChartLazy'), {
  ssr: false,
  loading: () => null, // Chart handles its own loading state
});

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

'use client';

import dynamic from 'next/dynamic';
import { TemperatureEquipment } from '../types';

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
}

// Lazy load Recharts to reduce initial bundle size
const TemperatureChart = dynamic(() => import('./TemperatureChartLazy'), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#29E7CD] border-t-transparent" />
    </div>
  ),
});

export function TemperatureChartContent(props: TemperatureChartContentProps) {
  return <TemperatureChart {...props} />;
}

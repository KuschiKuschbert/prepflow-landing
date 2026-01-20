'use client';

import { ReferenceAreas } from '@/app/webapp/temperature/components/TemperatureChartLazy/components/ReferenceAreas';
import { calculateYAxisBounds } from '@/app/webapp/temperature/components/TemperatureChartLazy/utils/calculateYAxisBounds';
import { prepareChartData } from '@/app/webapp/temperature/components/TemperatureChartLazy/utils/prepareChartData';
import { logger } from '@/lib/logger';
import {
    Area,
    CartesianGrid,
    ComposedChart,
    Line,
    ReferenceLine,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';
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
  dataMin?: number;
  dataMax?: number;
}

export default function TemperatureChartLazy({
  chartData,
  equipment,
  yAxisMin,
  yAxisMax,
  xAxisDomain,
  xAxisTicks,
  formatXAxisLabel,
  formatTooltipLabel,
  formatTooltipValue,
}: TemperatureChartContentProps) {
  try {
    // Debug: Log immediately to confirm component is rendering
    logger.dev('[TemperatureChartLazy] Component rendering', {
      chartDataLength: chartData.length,
      equipmentName: equipment.name,
      min_temp: equipment.min_temp_celsius,
      max_temp: equipment.max_temp_celsius,
    });
  } catch (err) {
    logger.error('[TemperatureChartLazy] Error in component:', err);
    throw err;
  }

  const { yMin, yMax } = calculateYAxisBounds(chartData, equipment);

  // Debug logging - always log to see what's happening
  const temperatures = chartData.map(d => d.temperature);
  const dataMin = temperatures.length > 0 ? Math.min(...temperatures) : 0;
  const dataMax = temperatures.length > 0 ? Math.max(...temperatures) : 0;
  const tempsBelowMin = temperatures.filter(
    t => equipment.min_temp_celsius !== null && t < equipment.min_temp_celsius,
  );
  const tempsAboveMax = temperatures.filter(
    t => equipment.max_temp_celsius !== null && t > equipment.max_temp_celsius,
  );

  logger.dev('[TemperatureChartLazy] Debug:', {
    chartDataLength: chartData.length,
    xAxisDomain,
    yMin,
    yMax,
    dataMin,
    dataMax,
    min_temp_celsius: equipment.min_temp_celsius,
    max_temp_celsius: equipment.max_temp_celsius,
    yAxisMin,
    yAxisMax,
    equipmentName: equipment.name,
    hasMinThreshold: equipment.min_temp_celsius !== null,
    hasMaxThreshold: equipment.max_temp_celsius !== null,
    temperatures: temperatures.slice(0, 5), // First 5 temps
    tempsBelowMin: tempsBelowMin.length,
    tempsAboveMax: tempsAboveMax.length,
    willShowRedBelow: tempsBelowMin.length > 0,
    willShowRedAbove: tempsAboveMax.length > 0,
  });

  const chartDataWithAreas = prepareChartData(chartData, equipment, yMin, yMax);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart
        data={chartDataWithAreas}
        margin={{ top: 10, right: 20, left: 10, bottom: 30 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="var(--muted)" opacity={0.5} />
        <ReferenceAreas
          chartDataLength={chartData.length}
          equipment={equipment}
          xAxisDomain={xAxisDomain}
          yMin={yMin}
          yMax={yMax}
        />
        {renderChartAxes(xAxisDomain, xAxisTicks, formatXAxisLabel, yAxisMin, yAxisMax)}
        <Tooltip
          labelFormatter={formatTooltipLabel}
          formatter={(value: number | string | Array<number | string>) => [
            formatTooltipValue(Number(value)),
            'Temp',
          ]}
          contentStyle={{
            backgroundColor: 'var(--surface)',
            border: '1px solid var(--border)',
            color: 'var(--foreground)',
            borderRadius: '8px',
          }}
        />
        {renderThresholdLines(equipment)}
        {renderThresholdAreas(equipment, yMin)}
        <Line
          type="monotone"
          dataKey="temperature"
          stroke="var(--primary)"
          strokeWidth={4}
          dot={{ fill: 'var(--primary)', r: 5, strokeWidth: 2, stroke: 'var(--background)' }}
          activeDot={{ r: 7, fill: 'var(--primary)', strokeWidth: 2, stroke: 'var(--background)' }}
          isAnimationActive={true}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
}

function renderChartAxes(
  xAxisDomain: [number, number],
  xAxisTicks: number[],
  formatXAxisLabel: (tickItem: number | string) => string,
  yAxisMin: number | string,
  yAxisMax: number | string,
) {
  return (
    <>
      <XAxis
        dataKey="xIndex"
        type="number"
        domain={xAxisDomain}
        ticks={xAxisTicks}
        tickFormatter={formatXAxisLabel}
        stroke="var(--foreground-muted)"
        style={{ fontSize: '12px', fontWeight: '500' }}
        tick={{ fill: 'var(--foreground-muted)' }}
        scale="linear"
      />
      <YAxis
        domain={[yAxisMin, yAxisMax]}
        stroke="var(--foreground-muted)"
        tickFormatter={(v: number | string) => {
          const num = typeof v === 'number' ? v : parseFloat(String(v));
          return isNaN(num) ? String(v) : `${num.toFixed(1)}°`;
        }}
        style={{ fontSize: '12px', fontWeight: '500' }}
        tick={{ fill: 'var(--foreground-muted)' }}
      />
    </>
  );
}

function renderThresholdLines(equipment: TemperatureEquipment) {
  return (
    <>
      {equipment.min_temp_celsius !== null && (
        <ReferenceLine
          y={equipment.min_temp_celsius}
          stroke="var(--primary)"
          strokeWidth={3}
          strokeDasharray="6 4"
          strokeOpacity={0.9}
          label={{
            value: `Min: ${equipment.min_temp_celsius}°C`,
            position: 'right',
            fill: 'var(--primary)',
            fontSize: 12,
            fontWeight: 'bold',
            offset: 10,
          }}
          ifOverflow="extendDomain"
        />
      )}
      {equipment.max_temp_celsius !== null && (
        <ReferenceLine
          y={equipment.max_temp_celsius}
          stroke="var(--primary)"
          strokeWidth={3}
          strokeDasharray="6 4"
          strokeOpacity={0.9}
          label={{
            value: `Max: ${equipment.max_temp_celsius}°C`,
            position: 'right',
            fill: 'var(--primary)',
            fontSize: 12,
            fontWeight: 'bold',
            offset: 10,
          }}
          ifOverflow="extendDomain"
        />
      )}
    </>
  );
}

function renderThresholdAreas(equipment: TemperatureEquipment, yMin: number) {
  return (
    <>
      {equipment.min_temp_celsius !== null && (
        <Area
          type="monotone"
          dataKey="redAreaBelow"
          baseValue={yMin}
          fill="var(--color-error)"
          fillOpacity={0.25}
          stroke="none"
          isAnimationActive={false}
        />
      )}
      {equipment.max_temp_celsius !== null && (
        <Area
          type="monotone"
          dataKey="topBoundary"
          baseValue={equipment.max_temp_celsius}
          fill="var(--color-error)"
          fillOpacity={0.25}
          stroke="none"
          isAnimationActive={false}
        />
      )}
    </>
  );
}

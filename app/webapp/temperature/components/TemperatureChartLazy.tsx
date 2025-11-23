'use client';

import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
  ReferenceArea,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { logger } from '@/lib/logger';
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

  // Calculate actual numeric Y-axis bounds
  // yAxisMin/yAxisMax can be strings like 'dataMin - 1', so we need to calculate from data
  const dataMin = chartData.length > 0 ? Math.min(...chartData.map(d => d.temperature)) : -30;
  const dataMax = chartData.length > 0 ? Math.max(...chartData.map(d => d.temperature)) : 30;

  const minWithThreshold =
    equipment.min_temp_celsius !== null ? Math.min(dataMin, equipment.min_temp_celsius) : dataMin;
  const maxWithThreshold =
    equipment.max_temp_celsius !== null ? Math.max(dataMax, equipment.max_temp_celsius) : dataMax;
  const padding = Math.max(1, (maxWithThreshold - minWithThreshold) * 0.1);
  const yMin = minWithThreshold - padding;
  const yMax = maxWithThreshold + padding;

  // Debug logging - always log to see what's happening
  const temperatures = chartData.map(d => d.temperature);
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

  // Create data with red area boundaries for ComposedChart
  // For red area below: fill from yMin to min_temp_celsius
  // For red area above: fill from max_temp_celsius to yMax
  const chartDataWithAreas = chartData.map((point, index) => ({
    ...point,
    // Red area below threshold - constant value at min_temp_celsius (fills from yMin to this)
    redAreaBelow: equipment.min_temp_celsius !== null ? equipment.min_temp_celsius : yMin,
    // Red area above threshold - constant value at yMax (fills from max_temp_celsius to this)
    // Use a value higher than max_temp_celsius to ensure it fills to the top
    redAreaAbove: yMax, // Always set to yMax to fill the entire top area
    // Also add a helper value for the top boundary
    topBoundary: yMax,
  }));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart
        data={chartDataWithAreas}
        margin={{ top: 10, right: 20, left: 10, bottom: 30 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" opacity={0.5} />
        {/* ReferenceArea components - MUST render BEFORE axes to appear behind */}
        {(() => {
          const shouldRenderBoth =
            chartData.length > 0 &&
            equipment.min_temp_celsius !== null &&
            equipment.max_temp_celsius !== null;
          const shouldRenderMinOnly =
            chartData.length > 0 &&
            equipment.min_temp_celsius !== null &&
            equipment.max_temp_celsius === null;
          const shouldRenderMaxOnly =
            chartData.length > 0 &&
            equipment.min_temp_celsius === null &&
            equipment.max_temp_celsius !== null;

          logger.dev('[ReferenceArea] Render conditions:', {
            shouldRenderBoth,
            shouldRenderMinOnly,
            shouldRenderMaxOnly,
            chartDataLength: chartData.length,
            min_temp_celsius: equipment.min_temp_celsius,
            max_temp_celsius: equipment.max_temp_celsius,
          });

          if (shouldRenderBoth) {
            logger.dev('[ReferenceArea] Rendering both thresholds:', {
              x1: xAxisDomain[0],
              x2: xAxisDomain[1],
              redBelow: { y1: yMin, y2: equipment.min_temp_celsius },
              redAbove: { y1: equipment.max_temp_celsius, y2: yMax },
            });
            return (
              <>
                {/* Red area below minimum threshold */}
                <ReferenceArea
                  x1={xAxisDomain[0]}
                  x2={xAxisDomain[1]}
                  y1={yMin}
                  y2={equipment.min_temp_celsius}
                  fill="#dc2626"
                  fillOpacity={0.9}
                  stroke="none"
                  ifOverflow="extendDomain"
                />
                {/* Red area above maximum threshold */}
                <ReferenceArea
                  x1={xAxisDomain[0]}
                  x2={xAxisDomain[1]}
                  y1={equipment.max_temp_celsius}
                  y2={yMax}
                  fill="#dc2626"
                  fillOpacity={0.9}
                  stroke="none"
                  ifOverflow="extendDomain"
                />
              </>
            );
          }
          return null;
        })()}
        {(() => {
          const shouldRenderMinOnly =
            chartData.length > 0 &&
            equipment.min_temp_celsius !== null &&
            equipment.max_temp_celsius === null;
          if (shouldRenderMinOnly) {
            logger.dev('[ReferenceArea] Rendering min only:', {
              x1: xAxisDomain[0],
              x2: xAxisDomain[1],
              redBelow: { y1: yMin, y2: equipment.min_temp_celsius },
            });
            return (
              <ReferenceArea
                x1={xAxisDomain[0]}
                x2={xAxisDomain[1]}
                y1={yMin}
                y2={equipment.min_temp_celsius}
                fill="#dc2626"
                fillOpacity={0.9}
                stroke="none"
                ifOverflow="extendDomain"
              />
            );
          }
          return null;
        })()}
        {(() => {
          const shouldRenderMaxOnly =
            chartData.length > 0 &&
            equipment.min_temp_celsius === null &&
            equipment.max_temp_celsius !== null;
          if (shouldRenderMaxOnly) {
            logger.dev('[ReferenceArea] Rendering max only:', {
              x1: xAxisDomain[0],
              x2: xAxisDomain[1],
              redAbove: { y1: equipment.max_temp_celsius, y2: yMax },
            });
            return (
              <ReferenceArea
                x1={xAxisDomain[0]}
                x2={xAxisDomain[1]}
                y1={equipment.max_temp_celsius}
                y2={yMax}
                fill="#dc2626"
                fillOpacity={0.9}
                stroke="none"
                ifOverflow="extendDomain"
              />
            );
          }
          return null;
        })()}
        <XAxis
          dataKey="xIndex"
          type="number"
          domain={xAxisDomain}
          ticks={xAxisTicks}
          tickFormatter={formatXAxisLabel}
          stroke="#ffffff"
          style={{ fontSize: '12px' }}
          tick={{ fill: '#ffffff' }}
          scale="linear"
        />
        <YAxis
          domain={[yAxisMin, yAxisMax]}
          stroke="#ffffff"
          tickFormatter={(v: number | string) => {
            const num = typeof v === 'number' ? v : parseFloat(String(v));
            return isNaN(num) ? String(v) : `${num.toFixed(1)}°`;
          }}
          style={{ fontSize: '12px' }}
          tick={{ fill: '#ffffff' }}
        />
        <Tooltip
          labelFormatter={formatTooltipLabel}
          formatter={(value: any) => [formatTooltipValue(value as number), 'Temp']}
          contentStyle={{
            backgroundColor: '#1f1f1f',
            border: '1px solid #2a2a2a',
            color: '#fff',
            borderRadius: '8px',
          }}
        />
        {equipment.min_temp_celsius !== null && (
          <ReferenceLine
            y={equipment.min_temp_celsius}
            stroke="#29E7CD"
            strokeWidth={3}
            strokeDasharray="6 4"
            strokeOpacity={0.9}
            label={{
              value: `Min: ${equipment.min_temp_celsius}°C`,
              position: 'right',
              fill: '#29E7CD',
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
            stroke="#29E7CD"
            strokeWidth={3}
            strokeDasharray="6 4"
            strokeOpacity={0.9}
            label={{
              value: `Max: ${equipment.max_temp_celsius}°C`,
              position: 'right',
              fill: '#29E7CD',
              fontSize: 12,
              fontWeight: 'bold',
              offset: 10,
            }}
            ifOverflow="extendDomain"
          />
        )}
        {/* Red area below minimum threshold - fills from yMin to min_temp_celsius */}
        {equipment.min_temp_celsius !== null && (
          <Area
            type="monotone"
            dataKey="redAreaBelow"
            baseValue={yMin}
            fill="#f87171"
            fillOpacity={0.3}
            stroke="none"
            isAnimationActive={false}
          />
        )}
        {/* Red area above maximum threshold - fills from max_temp_celsius to yMax */}
        {equipment.max_temp_celsius !== null && (
          <Area
            type="monotone"
            dataKey="topBoundary"
            baseValue={equipment.max_temp_celsius}
            fill="#f87171"
            fillOpacity={0.3}
            stroke="none"
            isAnimationActive={false}
          />
        )}
        <Line
          type="monotone"
          dataKey="temperature"
          stroke="#29E7CD"
          strokeWidth={3}
          dot={{ fill: '#29E7CD', r: 4, strokeWidth: 0 }}
          activeDot={{ r: 6, fill: '#29E7CD' }}
          isAnimationActive={true}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
}

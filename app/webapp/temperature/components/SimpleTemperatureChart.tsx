'use client';

import { useRef } from 'react';
import { logger } from '@/lib/logger';
import { useTemperatureChartConfig } from '../hooks/useTemperatureChartConfig';
import { useTemperatureChartData } from '../hooks/useTemperatureChartData';
import { TemperatureEquipment, TemperatureLog } from '../types';
import { useChartFormatters } from '../utils/chart-formatters';
import { TemperatureChartContent } from './TemperatureChartContent';
import { TemperatureChartEmptyState } from './TemperatureChartEmptyState';
import { TemperatureStatistics } from './utils';

interface SimpleTemperatureChartProps {
  logs: TemperatureLog[];
  equipment: TemperatureEquipment;
  timeFilter: '24h' | '7d' | '30d' | 'all';
  height?: number;
  statistics?: TemperatureStatistics | null;
}

export default function SimpleTemperatureChart({
  logs,
  equipment,
  timeFilter,
  height,
  statistics,
}: SimpleTemperatureChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartData = useTemperatureChartData(logs, equipment);
  const { yAxisMin, yAxisMax, xAxisDomain, xAxisTicks } = useTemperatureChartConfig(
    chartData,
    equipment,
  );

  // Debug logging
  logger.dev('[SimpleTemperatureChart] Rendering:', {
    logsCount: logs.length,
    chartDataLength: chartData.length,
    equipmentName: equipment.name,
    min_temp_celsius: equipment.min_temp_celsius,
    max_temp_celsius: equipment.max_temp_celsius,
    hasThresholds: equipment.min_temp_celsius !== null || equipment.max_temp_celsius !== null,
  });
  const { formatXAxisLabel, formatTooltipLabel, formatTooltipValue } = useChartFormatters(
    chartData,
    timeFilter,
  );

  const isTemperatureInRange = (temp: number) => {
    if (equipment.min_temp_celsius === null || equipment.max_temp_celsius === null) return true;
    return temp >= equipment.min_temp_celsius && temp <= equipment.max_temp_celsius;
  };

  const latestLog = logs.length > 0 ? logs[logs.length - 1] : null;
  const latestTemperature = latestLog?.temperature_celsius;
  const latestStatus =
    latestTemperature !== null && latestTemperature !== undefined
      ? isTemperatureInRange(latestTemperature)
        ? 'In Range'
        : 'Out of Range'
      : 'N/A';
  const statusColor = latestStatus === 'In Range' ? 'text-green-400' : 'text-red-400';

  if (!chartData || chartData.length === 0) {
    return (
      <TemperatureChartEmptyState
        equipment={equipment}
        latestStatus={latestStatus}
        statusColor={statusColor}
      />
    );
  }

  return (
    <div className="tablet:p-6 rounded-3xl border border-[#2a2a2a] bg-[#1f1f1f] p-4 shadow-lg">
      <div
        ref={chartContainerRef}
        className="relative w-full overflow-visible"
        style={{
          height: height ? `${height}px` : '300px',
          minHeight: height ? `${height}px` : '300px',
        }}
      >
        {chartData.length > 0 ? (
          <div
            className="temperature-chart-container h-full w-full"
            style={{ position: 'relative', overflow: 'visible' }}
          >
            <TemperatureChartContent
              chartData={chartData}
              equipment={equipment}
              yAxisMin={yAxisMin}
              yAxisMax={yAxisMax}
              xAxisDomain={xAxisDomain || [0, chartData.length - 1]}
              xAxisTicks={xAxisTicks || []}
              formatXAxisLabel={formatXAxisLabel}
              formatTooltipLabel={formatTooltipLabel}
              formatTooltipValue={formatTooltipValue}
              statistics={statistics}
            />

            {/* Safe Range Indicator - Overlay in top-right */}
            {equipment.min_temp_celsius !== null && equipment.max_temp_celsius !== null && (
              <div className="absolute top-4 right-4 z-10 rounded-2xl border border-[#29E7CD]/30 bg-[#29E7CD]/10 px-3 py-2 backdrop-blur-sm">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-[#29E7CD]" />
                  <span className="text-xs font-medium text-[#29E7CD]">
                    Safe Range: {equipment.min_temp_celsius}°C - {equipment.max_temp_celsius}°C
                  </span>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex h-full items-center justify-center text-gray-400">
            No chart data available
          </div>
        )}
      </div>
    </div>
  );
}

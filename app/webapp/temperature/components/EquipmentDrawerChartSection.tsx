'use client';

import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import { TemperatureEquipment, TemperatureLog } from '../types';
import SimpleTemperatureChart from './SimpleTemperatureChart';

interface EquipmentDrawerChartSectionProps {
  logs: TemperatureLog[];
  equipment: TemperatureEquipment;
  timeFilter: '24h' | '7d' | '30d' | 'all';
  chartHeight: number;
  isLoading: boolean;
}

export function EquipmentDrawerChartSection({
  logs,
  equipment,
  timeFilter,
  chartHeight,
  isLoading,
}: EquipmentDrawerChartSectionProps) {
  if (isLoading) {
    return <LoadingSkeleton variant="chart" height={`${chartHeight}px`} />;
  }

  if (logs.length === 0) {
    return (
      <div className="flex h-[200px] items-center justify-center rounded-3xl border border-[#2a2a2a] bg-[#1f1f1f] p-6 text-center shadow-lg tablet:h-[250px]">
        <div>
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#29E7CD]/20 to-[#D925C7]/20 mx-auto tablet:h-20 tablet:w-20">
            <svg
              className="h-8 w-8 text-gray-400 tablet:h-10 tablet:w-10"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
          </div>
          <h4 className="mb-2 text-fluid-base font-medium text-white tablet:text-fluid-lg">
            No Temperature Data
          </h4>
          <p className="text-fluid-xs text-gray-400 tablet:text-fluid-sm">
            No temperature logs found for this equipment. Add some temperature readings to see the chart.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ height: `${chartHeight}px` }}>
      <SimpleTemperatureChart
        logs={logs}
        equipment={equipment}
        timeFilter={timeFilter}
        height={chartHeight}
      />
    </div>
  );
}

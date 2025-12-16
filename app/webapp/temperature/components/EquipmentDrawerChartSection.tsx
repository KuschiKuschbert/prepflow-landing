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
  statistics?: import('./utils').TemperatureStatistics | null;
}

export function EquipmentDrawerChartSection({
  logs,
  equipment,
  timeFilter,
  chartHeight,
  isLoading,
  statistics,
}: EquipmentDrawerChartSectionProps) {
  if (isLoading) {
    return <LoadingSkeleton variant="chart" height={`${chartHeight}px`} />;
  }

  if (logs.length === 0) {
    return (
      <div className="tablet:h-[250px] flex h-[200px] items-center justify-center rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 text-center shadow-lg">
        <div>
          <div className="tablet:h-20 tablet:w-20 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[var(--primary)]/20 to-[var(--accent)]/20">
            <svg
              className="tablet:h-10 tablet:w-10 h-8 w-8 text-[var(--foreground-muted)]"
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
          <h4 className="text-fluid-base tablet:text-fluid-lg mb-2 font-medium text-[var(--foreground)]">
            No Temperature Data
          </h4>
          <p className="text-fluid-xs tablet:text-fluid-sm text-[var(--foreground-muted)]">
            No temperature logs found for this equipment. Add some temperature readings to see the
            chart.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full" style={{ minHeight: `${chartHeight}px`, height: `${chartHeight}px` }}>
      <SimpleTemperatureChart
        logs={logs}
        equipment={equipment}
        timeFilter={timeFilter}
        height={chartHeight}
        statistics={statistics}
      />
    </div>
  );
}

'use client';

import { TemperatureEquipment } from '../types';

interface TemperatureChartEmptyStateProps {
  equipment: TemperatureEquipment;
  latestStatus: string;
  statusColor: string;
}

export function TemperatureChartEmptyState({
  equipment,
  latestStatus,
  statusColor,
}: TemperatureChartEmptyStateProps) {
  return (
    <div className="rounded-3xl border border-[#2a2a2a] bg-[#1f1f1f] p-6 shadow-lg">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">{equipment.name}</h3>
        <div className="flex items-center space-x-2">
          <div className={`h-2 w-2 rounded-full ${statusColor.replace('text-', 'bg-')}`}></div>
          <span className={`text-sm ${statusColor}`}>{latestStatus}</span>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[#29E7CD]/20 to-[#D925C7]/20">
          <svg
            className="h-10 w-10 text-gray-400"
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
        <h4 className="mb-2 text-lg font-medium text-white">No Temperature Data</h4>
        <p className="max-w-sm text-sm text-gray-400">
          No temperature logs found for this equipment. Add some temperature readings to see the
          chart.
        </p>
      </div>
    </div>
  );
}


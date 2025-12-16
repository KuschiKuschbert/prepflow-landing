'use client';

import { EmptyState } from '@/components/ui/EmptyState';
import { TemperatureEquipment } from '../types';
import { BarChart3 } from 'lucide-react';

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
    <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-lg">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-[var(--foreground)]">{equipment.name}</h3>
        <div className="flex items-center space-x-2">
          <div className={`h-2 w-2 rounded-full ${statusColor.replace('text-', 'bg-')}`}></div>
          <span className={`text-sm ${statusColor}`}>{latestStatus}</span>
        </div>
      </div>
      <EmptyState
        title="No Temperature Data"
        message="No temperature logs found for this equipment. Add some temperature readings to see the chart."
        icon={BarChart3}
        useLandingStyles={true}
        variant="landing"
        animated={false}
        className="border-0 bg-transparent p-0"
      />
    </div>
  );
}

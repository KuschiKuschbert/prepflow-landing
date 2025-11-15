'use client';

import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import { useTranslation } from '@/lib/useTranslation';
import { TemperatureEquipment, TemperatureLog } from '../types';
import { EquipmentStatistics } from './EquipmentStatistics';

interface EquipmentDrawerStatisticsSectionProps {
  logs: TemperatureLog[];
  equipment: TemperatureEquipment;
  isLoading: boolean;
}

export function EquipmentDrawerStatisticsSection({
  logs,
  equipment,
  isLoading,
}: EquipmentDrawerStatisticsSectionProps) {
  const { t } = useTranslation();

  if (isLoading) {
    return (
      <div className="space-y-4">
        <LoadingSkeleton variant="card" height="120px" />
        <div className="grid grid-cols-1 gap-4 tablet:grid-cols-2 desktop:grid-cols-1">
          <LoadingSkeleton variant="card" height="180px" />
          <LoadingSkeleton variant="card" height="180px" />
          <LoadingSkeleton variant="card" height="180px" />
          <LoadingSkeleton variant="card" height="180px" />
        </div>
      </div>
    );
  }

  if (logs.length === 0) {
    return (
      <div className="rounded-3xl border border-[#2a2a2a] bg-[#1f1f1f] p-8 text-center shadow-lg">
        <p className="text-gray-400">
          {t('temperature.noLogsForEquipment', 'No temperature logs found for this equipment')}
        </p>
      </div>
    );
  }

  return <EquipmentStatistics logs={logs} equipment={equipment} />;
}

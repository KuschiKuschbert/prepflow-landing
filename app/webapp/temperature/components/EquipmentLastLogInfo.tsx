'use client';

import { useTranslation } from '@/lib/useTranslation';

interface EquipmentLastLogInfoProps {
  lastLogInfo: {
    date: string;
    temperature: number;
    isInRange: boolean | null;
  } | null;
  formatDate?: (date: Date) => string;
}

export function EquipmentLastLogInfo({
  lastLogInfo,
  formatDate,
}: EquipmentLastLogInfoProps) {
  const { t } = useTranslation();

  if (!lastLogInfo) {
    return null;
  }

  const date = new Date(lastLogInfo.date);
  const formattedDate = formatDate ? formatDate(date) : lastLogInfo.date;

  return (
    <div className="mb-4 rounded-2xl border border-[#2a2a2a] bg-[#2a2a2a]/30 p-4">
      <div className="mb-2 text-xs font-medium uppercase tracking-wide text-gray-400">
        Last Logged Temperature
      </div>
      <div className="flex items-center justify-between">
        <div>
          <div className="text-lg font-bold text-white">
            {lastLogInfo.temperature.toFixed(1)}°C
          </div>
          <div className="text-xs text-gray-400">{formattedDate}</div>
        </div>
        {lastLogInfo.isInRange !== null && (
          <div className="flex items-center gap-2 rounded-full border border-[#2a2a2a] bg-[#2a2a2a]/50 px-3 py-1.5">
            <div
              className={`h-2 w-2 rounded-full shadow-lg ${
                lastLogInfo.isInRange ? 'bg-green-500 animate-pulse' : 'bg-red-500 animate-pulse'
              }`}
            />
            <span
              className={`text-xs font-semibold ${
                lastLogInfo.isInRange ? 'text-green-400' : 'text-red-400'
              }`}
            >
              {lastLogInfo.isInRange ? 'In Range' : 'Out of Range'}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

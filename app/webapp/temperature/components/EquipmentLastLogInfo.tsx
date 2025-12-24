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

export function EquipmentLastLogInfo({ lastLogInfo, formatDate }: EquipmentLastLogInfoProps) {
  const { t } = useTranslation();

  if (!lastLogInfo) {
    return null;
  }

  const date = new Date(lastLogInfo.date);
  const formattedDate = formatDate ? formatDate(date) : lastLogInfo.date;

  return (
    <div className="mb-4 rounded-2xl border border-[var(--border)] bg-[var(--muted)]/30 p-4">
      <div className="mb-2 text-xs font-medium tracking-wide text-[var(--foreground-muted)] uppercase">
        Last Logged Temperature
      </div>
      <div className="flex items-center justify-between">
        <div>
          <div className="text-lg font-bold text-[var(--foreground)]">
            {lastLogInfo.temperature.toFixed(1)}°C
          </div>
          <div className="text-xs text-[var(--foreground-muted)]">{formattedDate}</div>
        </div>
        {lastLogInfo.isInRange !== null && (
          <div className="flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--muted)]/50 px-3 py-1.5">
            <div
              className={`h-2 w-2 rounded-full shadow-lg ${
                lastLogInfo.isInRange
                  ? 'animate-pulse bg-[var(--color-success)]'
                  : 'animate-pulse bg-[var(--color-error)]'
              }`}
            />
            <span
              className={`text-xs font-semibold ${
                lastLogInfo.isInRange ? 'text-[var(--color-success)]' : 'text-[var(--color-error)]'
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

'use client';

import { Icon } from '@/components/ui/Icon';
import { LucideIcon } from 'lucide-react';

interface TemperatureLogsTimePeriodHeaderProps {
  period: string;
  icon: LucideIcon;
  label: string;
  logCount: number;
}

export function TemperatureLogsTimePeriodHeader({
  period: _period,
  icon,
  label,
  logCount,
}: TemperatureLogsTimePeriodHeaderProps) {
  return (
    <div className="mb-6 flex items-center gap-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-lg">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--primary)]/20 to-[var(--accent)]/20 shadow-lg">
        <Icon icon={icon} size="xl" className="text-[var(--primary)]" aria-hidden={true} />
      </div>
      <div className="flex-1">
        <h3 className="text-xl font-bold text-[var(--foreground)]">{label}</h3>
        <p className="text-sm text-[var(--foreground-muted)]">
          {logCount} temperature reading{logCount !== 1 ? 's' : ''}
        </p>
      </div>
    </div>
  );
}

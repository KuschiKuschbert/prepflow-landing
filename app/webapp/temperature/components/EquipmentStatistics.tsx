'use client';

import { Icon } from '@/components/ui/Icon';
import { useCountryFormatting } from '@/hooks/useCountryFormatting';
import { useTranslation } from '@/lib/useTranslation';
import { CheckCircle2, Thermometer, XCircle } from 'lucide-react';
import { TemperatureEquipment, TemperatureLog } from '../types';
import { calculateTemperatureStatistics, formatDateString, formatTime } from './utils';

interface EquipmentStatisticsProps {
  logs: TemperatureLog[];
  equipment: TemperatureEquipment;
}

export function EquipmentStatistics({ logs, equipment }: EquipmentStatisticsProps) {
  const { t } = useTranslation();
  const { formatDate } = useCountryFormatting();
  const stats = calculateTemperatureStatistics(logs, equipment);

  const isFoodEquipment =
    equipment.equipment_type === 'food_cooking' ||
    equipment.equipment_type === 'food_hot_holding' ||
    equipment.equipment_type === 'food_cold_holding';

  return (
    <div className="space-y-1.5">
      {/* Statistics Grid - 2 Columns */}
      <div className="grid grid-cols-2 gap-2">
        {/* Current Status Card - Compact */}
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-2 shadow-lg">
          <div className="mb-1 flex items-center gap-1">
            <Icon icon={Thermometer} size="xs" className="text-[var(--primary)]" />
            <h3 className="text-[10px] font-semibold tracking-wide text-[var(--foreground-secondary)] uppercase">
              {t('temperature.currentStatus', 'Current')}
            </h3>
          </div>
          <div className="space-y-1">
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-bold text-[var(--foreground)]">
                {stats.currentStatus.latestTemp}°C
              </span>
            </div>
            {stats.currentStatus.status === 'in-range' ? (
              <div className="flex items-center gap-0.5 rounded-full bg-[var(--color-success)]/10 px-1 py-0.5 text-[var(--color-success)]">
                <Icon icon={CheckCircle2} size="xs" />
                <span className="text-[9px] font-medium">
                  {t('temperature.inRange', 'In Range')}
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-0.5 rounded-full bg-[var(--color-error)]/10 px-1 py-0.5 text-[var(--color-error)]">
                <Icon icon={XCircle} size="xs" />
                <span className="text-[9px] font-medium">
                  {t('temperature.outOfRange', 'Out of Range')}
                </span>
              </div>
            )}
            <p className="text-[9px] leading-tight text-[var(--foreground-subtle)]">
              {stats.currentStatus.lastReadingDate &&
                formatDateString(stats.currentStatus.lastReadingDate, formatDate)}
              {stats.currentStatus.lastReadingTime &&
                ` ${formatTime(stats.currentStatus.lastReadingTime)}`}
            </p>
          </div>
        </div>

        {/* Compliance Card */}
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-2 shadow-lg">
          <div className="mb-1 flex items-center gap-1">
            <Icon icon={CheckCircle2} size="xs" className="text-[var(--primary)]" />
            <h3 className="text-[10px] font-semibold tracking-wide text-[var(--foreground-secondary)] uppercase">
              {t('temperature.compliance', 'Compliance')}
            </h3>
          </div>
          <div className="space-y-1">
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-bold text-[var(--foreground)]">
                {stats.compliance.rate}%
              </span>
            </div>
            <div className="h-1 w-full overflow-hidden rounded-full bg-[var(--muted)]">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] transition-all duration-500"
                style={{ width: `${stats.compliance.rate}%` }}
              />
            </div>
            <p className="text-[9px] leading-tight text-[var(--foreground-subtle)]">
              {stats.compliance.compliantCount}/{stats.compliance.totalCount}{' '}
              {t('temperature.readings', 'readings')}
            </p>
          </div>
        </div>

        {/* Danger Zone Card (only for food equipment) */}
        {isFoodEquipment && (
          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-2 shadow-lg">
            <div className="mb-1 flex items-center gap-1">
              {stats.dangerZone.status === 'safe' ? (
                <Icon icon={CheckCircle2} size="xs" className="text-[var(--color-success)]" />
              ) : stats.dangerZone.status === 'warning' ? (
                <Icon icon={XCircle} size="xs" className="text-[var(--color-warning)]" />
              ) : (
                <Icon icon={XCircle} size="xs" className="text-[var(--color-error)]" />
              )}
              <h3 className="text-[10px] font-semibold tracking-wide text-[var(--foreground-secondary)] uppercase">
                {t('temperature.dangerZone', 'Danger Zone')}
              </h3>
            </div>
            <div className="space-y-1">
              <div className="flex items-baseline gap-1">
                <span
                  className={`text-base font-bold ${
                    stats.dangerZone.status === 'safe'
                      ? 'text-[var(--color-success)]'
                      : stats.dangerZone.status === 'warning'
                        ? 'text-[var(--color-warning)]'
                        : 'text-[var(--color-error)]'
                  }`}
                >
                  {stats.dangerZone.totalHours}h
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[9px] text-[var(--foreground-subtle)]">
                  {t('temperature.violations', 'Violations')}
                </span>
                <span className="text-xs font-semibold text-[var(--foreground)]">
                  {stats.dangerZone.violationCount}
                </span>
              </div>
              <div
                className={`rounded-full px-1 py-0.5 text-center text-[9px] font-medium ${
                  stats.dangerZone.status === 'safe'
                    ? 'bg-[var(--color-success)]/10 text-[var(--color-success)]'
                    : stats.dangerZone.status === 'warning'
                      ? 'bg-[var(--color-warning)]/10 text-[var(--color-warning)]'
                      : 'bg-[var(--color-error)]/10 text-[var(--color-error)]'
                }`}
              >
                {stats.dangerZone.status === 'safe'
                  ? t('temperature.safe', 'Safe')
                  : stats.dangerZone.status === 'warning'
                    ? t('temperature.warning', 'Warning')
                    : t('temperature.danger', 'Danger')}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

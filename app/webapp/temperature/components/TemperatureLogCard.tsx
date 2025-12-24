'use client';

import { Icon } from '@/components/ui/Icon';
import OptimizedImage from '@/components/OptimizedImage';
import { useTranslation } from '@/lib/useTranslation';
import { TemperatureEquipment, TemperatureLog } from '../types';
import { getStatusColor } from './utils';
import {
  LucideIcon,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  User,
  Camera,
  Pencil,
} from 'lucide-react';

interface TemperatureLogCardProps {
  log: TemperatureLog;
  equipment: TemperatureEquipment[];
  temperatureTypes: Array<{ value: string; label: string; icon: string }>;
  formatDateString: (dateString: string) => string;
  getTemperatureStatus: (temp: number, location: string) => string;
  getFoodSafetyStatus: (temp: number, logTime: string, logDate: string, type: string) => any;
  getTypeIcon: (type: string) => LucideIcon;
  getTypeLabel: (type: string) => string;
  onLogClick: (log: TemperatureLog) => void;
}

export function TemperatureLogCard({
  log,
  equipment,
  temperatureTypes,
  formatDateString,
  getTemperatureStatus,
  getFoodSafetyStatus,
  getTypeIcon,
  getTypeLabel,
  onLogClick,
}: TemperatureLogCardProps) {
  const { t } = useTranslation();
  const status = getTemperatureStatus(log.temperature_celsius, log.location || '');
  const foodSafety = getFoodSafetyStatus(
    log.temperature_celsius,
    log.log_time,
    log.log_date,
    log.temperature_type,
  );
  const matchingEquipment = log.location
    ? equipment.find(eq => eq.name === log.location || eq.location === log.location)
    : null;
  const isClickable = !!matchingEquipment;

  return (
    <div
      onClick={() => isClickable && onLogClick(log)}
      className={`group relative overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-lg transition-all duration-300 ${
        isClickable
          ? 'cursor-pointer hover:border-[var(--primary)]/30 hover:shadow-2xl'
          : 'hover:border-[var(--primary)]/30 hover:shadow-2xl'
      }`}
    >
      {/* Gradient accent */}
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary)]/5 to-[var(--accent)]/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <div className="relative">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div className="flex min-w-0 flex-1 items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--primary)]/20 to-[var(--primary)]/10 shadow-lg">
              <Icon
                icon={getTypeIcon(log.temperature_type)}
                size="lg"
                className="text-[var(--primary)]"
                aria-hidden={true}
              />
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="mb-1 truncate text-lg font-semibold text-[var(--foreground)]">
                {log.location || getTypeLabel(log.temperature_type)}
              </h4>
              <div className="flex flex-wrap items-center gap-2 text-sm text-[var(--foreground-muted)]">
                <span>{formatDateString(log.log_date)}</span>
                <span className="text-[var(--foreground-subtle)]">•</span>
                <span>{log.log_time}</span>
                <span className="text-[var(--foreground-subtle)]">•</span>
                <span className="text-xs">{getTypeLabel(log.temperature_type)}</span>
              </div>
            </div>
          </div>
          <div className="flex shrink-0 flex-col items-end gap-2">
            <span className="text-3xl font-bold text-[var(--primary)]">
              {log.temperature_celsius}°C
            </span>
            <span
              className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${getStatusColor(status)}`}
            >
              {status === 'high' ? (
                <>
                  <Icon
                    icon={AlertTriangle}
                    size="xs"
                    className="text-[var(--color-error)]"
                    aria-hidden={true}
                  />
                  High
                </>
              ) : status === 'low' ? (
                <>
                  <Icon
                    icon={AlertTriangle}
                    size="xs"
                    className="text-[var(--color-info)]"
                    aria-hidden={true}
                  />
                  Low
                </>
              ) : (
                <>
                  <Icon
                    icon={CheckCircle2}
                    size="xs"
                    className="text-[var(--color-success)]"
                    aria-hidden={true}
                  />
                  Normal
                </>
              )}
            </span>
          </div>
        </div>

        {/* Additional Info */}
        {(log.location || log.logged_by || log.notes) && (
          <div className="mb-4 space-y-2 rounded-2xl bg-[var(--muted)]/30 p-3">
            {log.location && log.location !== getTypeLabel(log.temperature_type) && (
              <div className="flex items-center gap-2 text-sm text-[var(--foreground-secondary)]">
                <Icon
                  icon={MapPin}
                  size="sm"
                  className="text-[var(--foreground-secondary)]"
                  aria-hidden={true}
                />
                <span>{log.location}</span>
              </div>
            )}
            {log.logged_by && (
              <div className="flex items-center gap-2 text-xs text-[var(--foreground-muted)]">
                <Icon
                  icon={User}
                  size="sm"
                  className="text-[var(--foreground-muted)]"
                  aria-hidden={true}
                />
                <span>
                  {t('temperature.loggedBy', 'Logged by')}: {log.logged_by}
                </span>
              </div>
            )}
            {log.notes && (
              <p className="text-sm leading-relaxed text-[var(--foreground-secondary)]">
                {log.notes}
              </p>
            )}
          </div>
        )}

        {/* Food Safety Status (2-Hour/4-Hour Rule) */}
        {foodSafety && (
          <div
            className={`mb-4 rounded-2xl border p-4 ${
              foodSafety.status === 'safe'
                ? 'border-[var(--color-success)]/20 bg-[var(--color-success)]/10'
                : foodSafety.status === 'warning'
                  ? 'border-[var(--color-warning)]/20 bg-[var(--color-warning)]/10'
                  : 'border-[var(--color-error)]/20 bg-[var(--color-error)]/10'
            }`}
          >
            <div className="flex items-start gap-3">
              <Icon
                icon={foodSafety.icon}
                size="lg"
                className={foodSafety.color}
                aria-hidden={true}
              />
              <div className="flex-1">
                <p className={`mb-1 text-sm font-semibold ${foodSafety.color}`}>
                  Queensland 2-Hour/4-Hour Rule
                </p>
                <p className={`text-xs ${foodSafety.color} leading-relaxed`}>
                  {foodSafety.message}
                </p>
              </div>
            </div>
          </div>
        )}

        {log.photo_url && (
          <div className="mb-4 overflow-hidden rounded-2xl">
            <OptimizedImage
              src={log.photo_url}
              alt="Temperature reading"
              width={200}
              height={200}
              className="h-32 w-full rounded-2xl border border-[var(--border)] object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={e => e.stopPropagation()}
            className="flex items-center justify-center gap-2 rounded-xl bg-[var(--muted)] px-4 py-2 text-sm font-medium text-[var(--foreground)] transition-all duration-200 hover:bg-[var(--surface-variant)] hover:shadow-lg"
          >
            <Icon icon={Camera} size="sm" className="text-[var(--foreground)]" aria-hidden={true} />
            {t('temperature.addPhoto', 'Add Photo')}
          </button>
          <button
            onClick={e => e.stopPropagation()}
            className="flex items-center justify-center gap-2 rounded-xl bg-[var(--muted)] px-4 py-2 text-sm font-medium text-[var(--foreground)] transition-all duration-200 hover:bg-[var(--surface-variant)] hover:shadow-lg"
          >
            <Icon icon={Pencil} size="sm" className="text-[var(--foreground)]" aria-hidden={true} />
            {t('temperature.edit', 'Edit')}
          </button>
        </div>
      </div>
    </div>
  );
}

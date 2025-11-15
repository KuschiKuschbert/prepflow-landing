'use client';

import OptimizedImage from '@/components/OptimizedImage';
import { useTranslation } from '@/lib/useTranslation';
import { TemperatureEquipment, TemperatureLog } from '../types';
import { getStatusColor } from './utils';

interface TemperatureLogCardProps {
  log: TemperatureLog;
  equipment: TemperatureEquipment[];
  temperatureTypes: Array<{ value: string; label: string; icon: string }>;
  formatDateString: (dateString: string) => string;
  getTemperatureStatus: (temp: number, location: string) => string;
  getFoodSafetyStatus: (temp: number, logTime: string, logDate: string, type: string) => any;
  getTypeIcon: (type: string) => string;
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
      className={`group relative overflow-hidden rounded-3xl border border-[#2a2a2a] bg-[#1f1f1f] p-6 shadow-lg transition-all duration-300 ${
        isClickable
          ? 'cursor-pointer hover:border-[#29E7CD]/30 hover:shadow-2xl'
          : 'hover:border-[#29E7CD]/30 hover:shadow-2xl'
      }`}
    >
      {/* Gradient accent */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#29E7CD]/5 to-[#D925C7]/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <div className="relative">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div className="flex items-start gap-4 flex-1 min-w-0">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#29E7CD]/20 to-[#29E7CD]/10 shadow-lg">
              <span className="text-2xl">{getTypeIcon(log.temperature_type)}</span>
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="mb-1 text-lg font-semibold text-white truncate">
                {log.location || getTypeLabel(log.temperature_type)}
              </h4>
              <div className="flex flex-wrap items-center gap-2 text-sm text-gray-400">
                <span>{formatDateString(log.log_date)}</span>
                <span className="text-gray-600">•</span>
                <span>{log.log_time}</span>
                <span className="text-gray-600">•</span>
                <span className="text-xs">{getTypeLabel(log.temperature_type)}</span>
              </div>
            </div>
          </div>
          <div className="flex shrink-0 flex-col items-end gap-2">
            <span className="text-3xl font-bold text-[#29E7CD]">
              {log.temperature_celsius}°C
            </span>
            <span
              className={`rounded-full border px-3 py-1 text-xs font-semibold ${getStatusColor(status)}`}
            >
              {status === 'high'
                ? '⚠️ High'
                : status === 'low'
                  ? '⚠️ Low'
                  : '✅ Normal'}
            </span>
          </div>
        </div>

        {/* Additional Info */}
        {(log.location || log.logged_by || log.notes) && (
          <div className="mb-4 space-y-2 rounded-2xl bg-[#2a2a2a]/30 p-3">
            {log.location && log.location !== getTypeLabel(log.temperature_type) && (
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <span>📍</span>
                <span>{log.location}</span>
              </div>
            )}
            {log.logged_by && (
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <span>👤</span>
                <span>
                  {t('temperature.loggedBy', 'Logged by')}: {log.logged_by}
                </span>
              </div>
            )}
            {log.notes && (
              <p className="text-sm text-gray-300 leading-relaxed">{log.notes}</p>
            )}
          </div>
        )}

        {/* Food Safety Status (2-Hour/4-Hour Rule) */}
        {foodSafety && (
          <div
            className={`mb-4 rounded-2xl border p-4 ${
              foodSafety.status === 'safe'
                ? 'bg-green-400/10 border-green-400/20'
                : foodSafety.status === 'warning'
                  ? 'bg-yellow-400/10 border-yellow-400/20'
                  : 'bg-red-400/10 border-red-400/20'
            }`}
          >
            <div className="flex items-start gap-3">
              <span className="text-xl">{foodSafety.icon}</span>
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
              className="h-32 w-full rounded-2xl border border-[#2a2a2a] object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={e => e.stopPropagation()}
            className="flex-1 rounded-xl bg-[#2a2a2a] px-4 py-2 text-sm font-medium text-white transition-all duration-200 hover:bg-[#3a3a3a] hover:shadow-lg"
          >
            📷 {t('temperature.addPhoto', 'Add Photo')}
          </button>
          <button
            onClick={e => e.stopPropagation()}
            className="flex-1 rounded-xl bg-[#2a2a2a] px-4 py-2 text-sm font-medium text-white transition-all duration-200 hover:bg-[#3a3a3a] hover:shadow-lg"
          >
            ✏️ {t('temperature.edit', 'Edit')}
          </button>
        </div>
      </div>
    </div>
  );
}

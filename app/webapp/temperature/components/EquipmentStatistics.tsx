'use client';

import { Icon } from '@/components/ui/Icon';
import { useCountryFormatting } from '@/hooks/useCountryFormatting';
import { useTranslation } from '@/lib/useTranslation';
import { ArrowDown, ArrowUp, CheckCircle2, Minus, Thermometer, TrendingDown, TrendingUp, XCircle } from 'lucide-react';
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
    <div className="space-y-4">
      {/* Statistics Grid - Compact Layout */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Current Status Card - Compact */}
        <div className="rounded-3xl border border-[#2a2a2a] bg-[#1f1f1f] p-5 shadow-lg">
          <div className="mb-3 flex items-center gap-2">
            <Icon icon={Thermometer} size="sm" className="text-[#29E7CD]" />
            <h3 className="text-sm font-semibold text-white">
              {t('temperature.currentStatus', 'Current')}
            </h3>
          </div>
          <div className="space-y-2">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-white">{stats.currentStatus.latestTemp}°C</span>
            </div>
            {stats.currentStatus.status === 'in-range' ? (
              <div className="flex items-center gap-1.5 rounded-full bg-green-400/10 px-2 py-1 text-green-400">
                <Icon icon={CheckCircle2} size="xs" />
                <span className="text-xs font-medium">
                  {t('temperature.inRange', 'In Range')}
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 rounded-full bg-red-400/10 px-2 py-1 text-red-400">
                <Icon icon={XCircle} size="xs" />
                <span className="text-xs font-medium">
                  {t('temperature.outOfRange', 'Out of Range')}
                </span>
              </div>
            )}
            <p className="text-xs text-gray-400">
              {stats.currentStatus.lastReadingDate &&
                formatDateString(stats.currentStatus.lastReadingDate, formatDate)}
              {stats.currentStatus.lastReadingTime && ` ${formatTime(stats.currentStatus.lastReadingTime)}`}
            </p>
          </div>
        </div>

        {/* Temperature Range Card */}
        <div className="rounded-3xl border border-[#2a2a2a] bg-[#1f1f1f] p-5 shadow-lg">
          <div className="mb-3 flex items-center gap-2">
            <Icon icon={Thermometer} size="sm" className="text-[#29E7CD]" />
            <h3 className="text-sm font-semibold text-white">
              {t('temperature.range', 'Range')}
            </h3>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400">
                {t('temperature.minimum', 'Min')}
              </span>
              <span className="text-base font-semibold text-blue-400">{stats.temperatureRange.min}°C</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400">
                {t('temperature.average', 'Avg')}
              </span>
              <span className="text-base font-semibold text-white">{stats.temperatureRange.average}°C</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400">
                {t('temperature.maximum', 'Max')}
              </span>
              <span className="text-base font-semibold text-red-400">{stats.temperatureRange.max}°C</span>
            </div>
          </div>
        </div>

        {/* Compliance Card */}
        <div className="rounded-3xl border border-[#2a2a2a] bg-[#1f1f1f] p-5 shadow-lg">
          <div className="mb-3 flex items-center gap-2">
            <Icon icon={CheckCircle2} size="sm" className="text-[#29E7CD]" />
            <h3 className="text-sm font-semibold text-white">
              {t('temperature.compliance', 'Compliance')}
            </h3>
          </div>
          <div className="space-y-2">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-white">{stats.compliance.rate}%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-[#2a2a2a]">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#29E7CD] to-[#D925C7] transition-all duration-500"
                style={{ width: `${stats.compliance.rate}%` }}
              />
            </div>
            <p className="text-xs text-gray-400">
              {stats.compliance.compliantCount}/{stats.compliance.totalCount} {t('temperature.readings', 'readings')}
            </p>
          </div>
        </div>

        {/* Trend Card */}
        <div className="rounded-3xl border border-[#2a2a2a] bg-[#1f1f1f] p-5 shadow-lg">
          <div className="mb-3 flex items-center gap-2">
            {stats.trend.direction === 'improving' ? (
              <Icon icon={TrendingUp} size="sm" className="text-green-400" />
            ) : stats.trend.direction === 'declining' ? (
              <Icon icon={TrendingDown} size="sm" className="text-red-400" />
            ) : (
              <Icon icon={Minus} size="sm" className="text-gray-400" />
            )}
            <h3 className="text-sm font-semibold text-white">
              {t('temperature.trend', 'Trend')}
            </h3>
          </div>
          <div className="space-y-2">
            <div className="flex items-baseline gap-2">
              {stats.trend.direction === 'improving' ? (
                <>
                  <Icon icon={ArrowDown} size="xs" className="text-green-400" />
                  <span className="text-xl font-bold text-green-400">
                    {Math.abs(stats.trend.percentageChange)}%
                  </span>
                </>
              ) : stats.trend.direction === 'declining' ? (
                <>
                  <Icon icon={ArrowUp} size="xs" className="text-red-400" />
                  <span className="text-xl font-bold text-red-400">
                    {Math.abs(stats.trend.percentageChange)}%
                  </span>
                </>
              ) : (
                <span className="text-xl font-bold text-gray-400">
                  {t('temperature.stable', 'Stable')}
                </span>
              )}
            </div>
            <p className="text-xs text-gray-400">
              {stats.trend.direction === 'improving'
                ? t('temperature.improving', 'Improving')
                : stats.trend.direction === 'declining'
                  ? t('temperature.declining', 'Declining')
                  : ''}
            </p>
            <p className="text-xs text-gray-500">
              {t('temperature.last7Days', 'vs prev 7d')}
            </p>
          </div>
        </div>

        {/* Danger Zone Card (only for food equipment) */}
        {isFoodEquipment && (
          <div className="rounded-3xl border border-[#2a2a2a] bg-[#1f1f1f] p-5 shadow-lg">
            <div className="mb-3 flex items-center gap-2">
              {stats.dangerZone.status === 'safe' ? (
                <Icon icon={CheckCircle2} size="sm" className="text-green-400" />
              ) : stats.dangerZone.status === 'warning' ? (
                <Icon icon={XCircle} size="sm" className="text-yellow-400" />
              ) : (
                <Icon icon={XCircle} size="sm" className="text-red-400" />
              )}
              <h3 className="text-sm font-semibold text-white">
                {t('temperature.dangerZone', 'Danger Zone')}
              </h3>
            </div>
            <div className="space-y-2">
              <div className="flex items-baseline gap-2">
                <span
                  className={`text-xl font-bold ${
                    stats.dangerZone.status === 'safe'
                      ? 'text-green-400'
                      : stats.dangerZone.status === 'warning'
                        ? 'text-yellow-400'
                        : 'text-red-400'
                  }`}
                >
                  {stats.dangerZone.totalHours}h
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">
                  {t('temperature.violations', 'Violations')}
                </span>
                <span className="text-base font-semibold text-white">{stats.dangerZone.violationCount}</span>
              </div>
              <div
                className={`rounded-full px-2 py-1 text-center text-xs font-medium ${
                  stats.dangerZone.status === 'safe'
                    ? 'bg-green-400/10 text-green-400'
                    : stats.dangerZone.status === 'warning'
                      ? 'bg-yellow-400/10 text-yellow-400'
                      : 'bg-red-400/10 text-red-400'
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

import { Icon } from '@/components/ui/Icon';
import { useCountryFormatting } from '@/hooks/useCountryFormatting';
import { useTranslation } from '@/lib/useTranslation';
import { ArrowDown, ArrowUp, CheckCircle2, Minus, Thermometer, TrendingDown, TrendingUp, XCircle } from 'lucide-react';
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
    <div className="space-y-4">
      {/* Statistics Grid - Compact Layout */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Current Status Card - Compact */}
        <div className="rounded-3xl border border-[#2a2a2a] bg-[#1f1f1f] p-5 shadow-lg">
          <div className="mb-3 flex items-center gap-2">
            <Icon icon={Thermometer} size="sm" className="text-[#29E7CD]" />
            <h3 className="text-sm font-semibold text-white">
              {t('temperature.currentStatus', 'Current')}
            </h3>
          </div>
          <div className="space-y-2">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-white">{stats.currentStatus.latestTemp}°C</span>
            </div>
            {stats.currentStatus.status === 'in-range' ? (
              <div className="flex items-center gap-1.5 rounded-full bg-green-400/10 px-2 py-1 text-green-400">
                <Icon icon={CheckCircle2} size="xs" />
                <span className="text-xs font-medium">
                  {t('temperature.inRange', 'In Range')}
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 rounded-full bg-red-400/10 px-2 py-1 text-red-400">
                <Icon icon={XCircle} size="xs" />
                <span className="text-xs font-medium">
                  {t('temperature.outOfRange', 'Out of Range')}
                </span>
              </div>
            )}
            <p className="text-xs text-gray-400">
              {stats.currentStatus.lastReadingDate &&
                formatDateString(stats.currentStatus.lastReadingDate, formatDate)}
              {stats.currentStatus.lastReadingTime && ` ${formatTime(stats.currentStatus.lastReadingTime)}`}
            </p>
          </div>
        </div>

        {/* Temperature Range Card */}
        <div className="rounded-3xl border border-[#2a2a2a] bg-[#1f1f1f] p-5 shadow-lg">
          <div className="mb-3 flex items-center gap-2">
            <Icon icon={Thermometer} size="sm" className="text-[#29E7CD]" />
            <h3 className="text-sm font-semibold text-white">
              {t('temperature.range', 'Range')}
            </h3>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400">
                {t('temperature.minimum', 'Min')}
              </span>
              <span className="text-base font-semibold text-blue-400">{stats.temperatureRange.min}°C</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400">
                {t('temperature.average', 'Avg')}
              </span>
              <span className="text-base font-semibold text-white">{stats.temperatureRange.average}°C</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400">
                {t('temperature.maximum', 'Max')}
              </span>
              <span className="text-base font-semibold text-red-400">{stats.temperatureRange.max}°C</span>
            </div>
          </div>
        </div>

        {/* Compliance Card */}
        <div className="rounded-3xl border border-[#2a2a2a] bg-[#1f1f1f] p-5 shadow-lg">
          <div className="mb-3 flex items-center gap-2">
            <Icon icon={CheckCircle2} size="sm" className="text-[#29E7CD]" />
            <h3 className="text-sm font-semibold text-white">
              {t('temperature.compliance', 'Compliance')}
            </h3>
          </div>
          <div className="space-y-2">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-white">{stats.compliance.rate}%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-[#2a2a2a]">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#29E7CD] to-[#D925C7] transition-all duration-500"
                style={{ width: `${stats.compliance.rate}%` }}
              />
            </div>
            <p className="text-xs text-gray-400">
              {stats.compliance.compliantCount}/{stats.compliance.totalCount} {t('temperature.readings', 'readings')}
            </p>
          </div>
        </div>

        {/* Trend Card */}
        <div className="rounded-3xl border border-[#2a2a2a] bg-[#1f1f1f] p-5 shadow-lg">
          <div className="mb-3 flex items-center gap-2">
            {stats.trend.direction === 'improving' ? (
              <Icon icon={TrendingUp} size="sm" className="text-green-400" />
            ) : stats.trend.direction === 'declining' ? (
              <Icon icon={TrendingDown} size="sm" className="text-red-400" />
            ) : (
              <Icon icon={Minus} size="sm" className="text-gray-400" />
            )}
            <h3 className="text-sm font-semibold text-white">
              {t('temperature.trend', 'Trend')}
            </h3>
          </div>
          <div className="space-y-2">
            <div className="flex items-baseline gap-2">
              {stats.trend.direction === 'improving' ? (
                <>
                  <Icon icon={ArrowDown} size="xs" className="text-green-400" />
                  <span className="text-xl font-bold text-green-400">
                    {Math.abs(stats.trend.percentageChange)}%
                  </span>
                </>
              ) : stats.trend.direction === 'declining' ? (
                <>
                  <Icon icon={ArrowUp} size="xs" className="text-red-400" />
                  <span className="text-xl font-bold text-red-400">
                    {Math.abs(stats.trend.percentageChange)}%
                  </span>
                </>
              ) : (
                <span className="text-xl font-bold text-gray-400">
                  {t('temperature.stable', 'Stable')}
                </span>
              )}
            </div>
            <p className="text-xs text-gray-400">
              {stats.trend.direction === 'improving'
                ? t('temperature.improving', 'Improving')
                : stats.trend.direction === 'declining'
                  ? t('temperature.declining', 'Declining')
                  : ''}
            </p>
            <p className="text-xs text-gray-500">
              {t('temperature.last7Days', 'vs prev 7d')}
            </p>
          </div>
        </div>

        {/* Danger Zone Card (only for food equipment) */}
        {isFoodEquipment && (
          <div className="rounded-3xl border border-[#2a2a2a] bg-[#1f1f1f] p-5 shadow-lg">
            <div className="mb-3 flex items-center gap-2">
              {stats.dangerZone.status === 'safe' ? (
                <Icon icon={CheckCircle2} size="sm" className="text-green-400" />
              ) : stats.dangerZone.status === 'warning' ? (
                <Icon icon={XCircle} size="sm" className="text-yellow-400" />
              ) : (
                <Icon icon={XCircle} size="sm" className="text-red-400" />
              )}
              <h3 className="text-sm font-semibold text-white">
                {t('temperature.dangerZone', 'Danger Zone')}
              </h3>
            </div>
            <div className="space-y-2">
              <div className="flex items-baseline gap-2">
                <span
                  className={`text-xl font-bold ${
                    stats.dangerZone.status === 'safe'
                      ? 'text-green-400'
                      : stats.dangerZone.status === 'warning'
                        ? 'text-yellow-400'
                        : 'text-red-400'
                  }`}
                >
                  {stats.dangerZone.totalHours}h
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">
                  {t('temperature.violations', 'Violations')}
                </span>
                <span className="text-base font-semibold text-white">{stats.dangerZone.violationCount}</span>
              </div>
              <div
                className={`rounded-full px-2 py-1 text-center text-xs font-medium ${
                  stats.dangerZone.status === 'safe'
                    ? 'bg-green-400/10 text-green-400'
                    : stats.dangerZone.status === 'warning'
                      ? 'bg-yellow-400/10 text-yellow-400'
                      : 'bg-red-400/10 text-red-400'
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

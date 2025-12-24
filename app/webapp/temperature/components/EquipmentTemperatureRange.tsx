'use client';

import { useTranslation } from '@/lib/useTranslation';
import { getDefaultTemperatureRange } from '../utils/getDefaultTemperatureRange';

interface EquipmentTemperatureRangeProps {
  equipmentType: string;
  equipmentName: string;
  minTemp: number | null;
  maxTemp: number | null;
  isActive: boolean;
}

export function EquipmentTemperatureRange({
  equipmentType,
  equipmentName,
  minTemp,
  maxTemp,
  isActive,
}: EquipmentTemperatureRangeProps) {
  const { t } = useTranslation();
  const hasSavedRange = minTemp !== null && maxTemp !== null;
  const defaultRange = getDefaultTemperatureRange(equipmentType, equipmentName);

  let displayText: string;
  let isRecommended = false;

  if (hasSavedRange) {
    if (maxTemp !== null) {
      displayText = `${minTemp}°C - ${maxTemp}°C`;
    } else {
      displayText = `≥${minTemp}°C`;
    }
  } else if (defaultRange.minTemp !== null) {
    isRecommended = true;
    if (defaultRange.maxTemp !== null) {
      displayText = `${defaultRange.minTemp}°C - ${defaultRange.maxTemp}°C`;
    } else {
      displayText = `≥${defaultRange.minTemp}°C`;
    }
  } else {
    displayText = String(t('temperature.notSet', 'Not set'));
  }

  return (
    <div className="tablet:items-start flex shrink-0 flex-col items-end gap-2">
      <div className="tablet:text-left text-right">
        <div className="mb-1 text-xs font-medium tracking-wide text-[var(--foreground-muted)] uppercase">
          {t('temperature.range', 'Temperature Range')}
        </div>
        <div className="flex flex-col gap-1">
          <div className="text-xl font-bold text-[var(--primary)]">{displayText}</div>
          {isRecommended && (
            <span className="text-xs text-[var(--foreground-subtle)] italic">(Recommended)</span>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--muted)]/50 px-3 py-1.5">
        <div
          className={`h-2 w-2 rounded-full shadow-lg ${isActive ? 'bg-[var(--color-info)]' : 'bg-gray-500'}`}
        />
        <span className="text-xs font-semibold text-[var(--foreground-secondary)]">
          {isActive ? t('common.active', 'Active') : t('common.inactive', 'Inactive')}
        </span>
      </div>
    </div>
  );
}

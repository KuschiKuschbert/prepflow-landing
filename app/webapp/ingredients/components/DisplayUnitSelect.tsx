'use client';

import { useTranslation } from '@/lib/useTranslation';
import { UNIT_GROUPS } from './ingredient-units';

interface DisplayUnitSelectProps {
  value: string;
  onChange: (unit: string) => void;
}

export function DisplayUnitSelect({ value, onChange }: DisplayUnitSelectProps) {
  const { t } = useTranslation();

  return (
    <div className="flex items-center gap-3">
      <label htmlFor="ingredients-display-unit" className="text-sm font-medium text-gray-300">
        {t('ingredients.displayUnitLabel', 'Show costs per:')}
      </label>
      <select
        id="ingredients-display-unit"
        value={value}
        onChange={event => onChange(event.target.value)}
        className="flex min-h-[44px] items-center justify-center rounded-lg border border-[#2a2a2a] bg-[#0a0a0a] px-4 py-3 text-white focus:border-transparent focus:ring-2 focus:ring-[#29E7CD]"
      >
        {UNIT_GROUPS.map(group => (
          <optgroup key={group.labelKey} label={t(group.labelKey, group.defaultLabel)}>
            {group.options.map(option => (
              <option key={option.value} value={option.value}>
                {t(option.labelKey, option.defaultLabel)}
              </option>
            ))}
          </optgroup>
        ))}
      </select>
    </div>
  );
}

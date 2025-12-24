'use client';

/**
 * Frequency selection field component
 */

import { Icon } from '@/components/ui/Icon';
import type { FrequencyType } from '@/lib/cleaning/frequency-calculator';
import { Info } from 'lucide-react';
import { FrequencyPreview } from '../../FrequencyPreview';

interface FrequencyFieldProps {
  value: FrequencyType | string;
  customDaysInterval: number;
  onChange: (value: FrequencyType | string) => void;
  onCustomDaysChange: (days: number) => void;
  onBlur: (value: string) => void;
  error?: string;
  suggestedFrequency?: string | null;
  areaId: string;
  onManualSet: () => void;
}

export function FrequencyField({
  value,
  customDaysInterval,
  onChange,
  onCustomDaysChange,
  onBlur,
  error,
  suggestedFrequency,
  areaId,
  onManualSet,
}: FrequencyFieldProps) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-semibold text-[var(--foreground-secondary)]">
        Frequency <span className="text-[var(--color-error)]">*</span>
      </label>

      {/* Quick frequency buttons */}
      <div className="mb-2 grid grid-cols-3 gap-2">
        {(['daily', 'weekly', 'monthly'] as const).map(freq => (
          <button
            key={freq}
            type="button"
            onClick={() => {
              onManualSet();
              onChange(freq);
            }}
            className={`rounded-xl border px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
              value === freq
                ? 'border-[var(--primary)] bg-[var(--primary)]/20 text-[var(--primary)] shadow-[var(--primary)]/20 shadow-lg'
                : 'border-[var(--border)] bg-[var(--muted)] text-[var(--foreground-secondary)] hover:border-[var(--primary)]/50 hover:bg-[var(--muted)]/80'
            }`}
          >
            {freq.charAt(0).toUpperCase() + freq.slice(1)}
          </button>
        ))}
      </div>

      {/* Dropdown for all frequency options */}
      <select
        value={value}
        onChange={e => {
          onManualSet();
          onChange(e.target.value);
        }}
        onBlur={e => onBlur(e.target.value)}
        className={`w-full rounded-2xl border ${
          error ? 'border-[var(--color-error)]/50' : 'border-[var(--border)]'
        } bg-[var(--muted)] px-4 py-2.5 text-[var(--foreground)] focus:border-transparent focus:ring-2 focus:ring-[var(--primary)]`}
        required
      >
        <optgroup label="Quick Options">
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </optgroup>
        <optgroup label="Regular Intervals">
          <option value="bi-daily">Bi-daily (Every 2 days)</option>
          <option value="3-monthly">3-Monthly (Quarterly)</option>
        </optgroup>
        <optgroup label="Specific Days">
          <option value="monday">Every Monday</option>
          <option value="tuesday">Every Tuesday</option>
          <option value="wednesday">Every Wednesday</option>
          <option value="thursday">Every Thursday</option>
          <option value="friday">Every Friday</option>
          <option value="saturday">Every Saturday</option>
          <option value="sunday">Every Sunday</option>
        </optgroup>
        <optgroup label="Custom Interval">
          <option value="custom-days">Every X days (custom)</option>
        </optgroup>
      </select>

      {suggestedFrequency && value === suggestedFrequency && (
        <p className="mt-2 flex items-center gap-1 text-xs text-[var(--primary)]">
          <Icon icon={Info} size="xs" aria-hidden={true} />
          Auto-selected {suggestedFrequency.charAt(0).toUpperCase() +
            suggestedFrequency.slice(1)}{' '}
          based on task name
        </p>
      )}

      {value === 'custom-days' && (
        <div className="mt-2">
          <label className="mb-1.5 block text-sm font-medium text-[var(--foreground-secondary)]">
            Number of Days
          </label>
          <input
            type="number"
            min="1"
            max="365"
            value={customDaysInterval}
            onChange={e => {
              const days = parseInt(e.target.value) || 3;
              onCustomDaysChange(days);
            }}
            className="w-full rounded-2xl border border-[var(--border)] bg-[var(--muted)] px-4 py-2.5 text-[var(--foreground)] focus:border-transparent focus:ring-2 focus:ring-[var(--primary)]"
          />
          <p className="mt-1 text-xs text-[var(--foreground-subtle)]">
            Task will repeat every {customDaysInterval} {customDaysInterval === 1 ? 'day' : 'days'}
          </p>
        </div>
      )}

      {/* Frequency Preview */}
      {value && areaId && (
        <div className="mt-2">
          <FrequencyPreview frequencyType={value} />
        </div>
      )}

      {error && (
        <p className="mt-1 text-xs text-[var(--color-error)]" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

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
      <label className="mb-1.5 block text-sm font-semibold text-gray-300">
        Frequency <span className="text-red-400">*</span>
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
                ? 'border-[#29E7CD] bg-[#29E7CD]/20 text-[#29E7CD] shadow-lg shadow-[#29E7CD]/20'
                : 'border-[#2a2a2a] bg-[#2a2a2a] text-gray-300 hover:border-[#29E7CD]/50 hover:bg-[#2a2a2a]/80'
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
          error ? 'border-red-500/50' : 'border-[#2a2a2a]'
        } bg-[#2a2a2a] px-4 py-2.5 text-white focus:border-transparent focus:ring-2 focus:ring-[#29E7CD]`}
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
        <p className="mt-2 flex items-center gap-1 text-xs text-[#29E7CD]">
          <Icon icon={Info} size="xs" aria-hidden={true} />
          Auto-selected {suggestedFrequency.charAt(0).toUpperCase() +
            suggestedFrequency.slice(1)}{' '}
          based on task name
        </p>
      )}

      {value === 'custom-days' && (
        <div className="mt-2">
          <label className="mb-1.5 block text-sm font-medium text-gray-300">Number of Days</label>
          <input
            type="number"
            min="1"
            max="365"
            value={customDaysInterval}
            onChange={e => {
              const days = parseInt(e.target.value) || 3;
              onCustomDaysChange(days);
            }}
            className="w-full rounded-2xl border border-[#2a2a2a] bg-[#2a2a2a] px-4 py-2.5 text-white focus:border-transparent focus:ring-2 focus:ring-[#29E7CD]"
          />
          <p className="mt-1 text-xs text-gray-500">
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
        <p className="mt-1 text-xs text-red-400" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

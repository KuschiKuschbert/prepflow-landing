'use client';

import { Icon } from '@/components/ui/Icon';
import { Clock } from 'lucide-react';
import { useMemo } from 'react';

const HOURS = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));
const MINUTES_15 = ['00', '15', '30', '45'];

interface TimeSelectProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
  id?: string;
}

/**
 * Time select with hour and minute dropdowns (15-minute steps).
 * Value format: "HH:mm" (24-hour) or empty string.
 */
export function TimeSelect({
  value,
  onChange,
  disabled = false,
  className = '',
  id,
}: TimeSelectProps) {
  const [hour, minute] = useMemo(() => {
    if (!value || !/^\d{2}:\d{2}$/.test(value)) return ['', ''];
    const [h, m] = value.split(':');
    return [h, m];
  }, [value]);

  const handleHourChange = (h: string) => {
    if (!h) {
      onChange('');
      return;
    }
    onChange(minute ? `${h}:${minute}` : `${h}:00`);
  };

  const handleMinuteChange = (m: string) => {
    if (!hour) return;
    onChange(`${hour}:${m || '00'}`);
  };

  const formatHourLabel = (h: string) => `${h}:00`;

  const formatMinuteLabel = (m: string) => (m === '00' ? '00' : m);

  const selectClasses =
    'flex-1 min-w-0 rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--foreground)] focus:border-transparent focus:ring-2 focus:ring-[var(--primary)] focus:outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed';

  return (
    <div className={`flex items-center gap-2 ${className}`} id={id}>
      <Icon
        icon={Clock}
        size="sm"
        className="shrink-0 text-[var(--foreground-muted)]"
        aria-hidden
      />
      <div className="flex flex-1 gap-1.5">
        <select
          value={hour}
          onChange={e => handleHourChange(e.target.value)}
          onBlur={e => {
            if (!e.target.value && minute) onChange('');
          }}
          disabled={disabled}
          className={selectClasses}
          aria-label="Hour"
        >
          <option value="">—</option>
          {HOURS.map(h => (
            <option key={h} value={h}>
              {formatHourLabel(h)}
            </option>
          ))}
        </select>
        <select
          value={hour ? minute : '00'}
          onChange={e => handleMinuteChange(e.target.value)}
          disabled={disabled || !hour}
          className={selectClasses}
          aria-label="Minute"
        >
          {MINUTES_15.map(m => (
            <option key={m} value={m}>
              {formatMinuteLabel(m)}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

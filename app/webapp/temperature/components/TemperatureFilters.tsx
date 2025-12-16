'use client';

import { Icon } from '@/components/ui/Icon';
import { Plus } from 'lucide-react';
import { useEffect, useState } from 'react';

export interface TemperatureFiltersProps {
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  selectedType: string;
  setSelectedType: (type: string) => void;
  equipment: Array<{ id?: number; name: string; equipment_type: string; is_active: boolean }>;
  temperatureTypes: Array<{ value: string; label: string; icon: string }>;
  onAddClick: () => void;
  t: (key: string, fallback: string) => string;
}

export function TemperatureFilters({
  selectedDate,
  setSelectedDate,
  selectedType,
  setSelectedType,
  equipment,
  temperatureTypes,
  onAddClick,
  t,
}: TemperatureFiltersProps) {
  const [isMounted, setIsMounted] = useState(false);

  // Only render equipment options after mount to prevent hydration mismatch
  useEffect(() => {
    setIsMounted(true);
  }, []);

  /**
   * Safely converts an icon value to a string for rendering in select options.
   * Prevents React component objects from being rendered directly.
   * Returns empty string if icon is a React component or other non-string value.
   */
  const getIconString = (icon: unknown): string => {
    if (typeof icon === 'string') {
      return icon;
    }
    // If it's a React component or other object, return empty string
    // (can't render React components in <option> elements)
    return '';
  };

  /**
   * Gets the icon string for a given equipment type (for use in select options).
   * Uses a deterministic lookup to prevent hydration mismatches.
   * Normalizes the type comparison to ensure consistency between server and client.
   * Note: Returns emoji string for select options compatibility.
   */
  const getTypeIcon = (type: string): string => {
    if (!type) return '';
    // Normalize type for comparison (trim and lowercase)
    const normalizedType = type.trim().toLowerCase();
    const matched = temperatureTypes.find(
      tt => tt.value.toLowerCase() === normalizedType || tt.value === type,
    );
    // Return emoji string for select options (can't use React components in <option>)
    return getIconString(matched?.icon) || '';
  };

  /**
   * Validates and normalizes a date string to ensure it's valid.
   * Returns a valid date string in YYYY-MM-DD format, or today's date if invalid.
   */
  const getValidDate = (dateString: string): string => {
    if (!dateString) {
      return new Date().toISOString().split('T')[0];
    }

    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return new Date().toISOString().split('T')[0];
    }

    return date.toISOString().split('T')[0];
  };

  /**
   * Safely adjusts the selected date by the specified number of days.
   */
  const adjustDate = (days: number) => {
    const validDate = getValidDate(selectedDate);
    const currentDate = new Date(validDate);
    currentDate.setDate(currentDate.getDate() + days);
    setSelectedDate(currentDate.toISOString().split('T')[0]);
  };

  return (
    <div className="tablet:flex-row tablet:items-center flex flex-col items-start justify-between gap-4">
      <div className="tablet:flex-row flex flex-col gap-4">
        <div>
          <label className="mb-2 block text-sm font-medium text-[var(--foreground-secondary)]">
            {t('temperature.filterDate', 'Filter by Date')}
          </label>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => adjustDate(-1)}
              className="flex items-center justify-center rounded-xl bg-[var(--muted)] px-3 py-2 text-[var(--foreground)] transition-all duration-200 hover:bg-[var(--surface-variant)]"
              title="Previous day"
            >
              <span className="text-lg">←</span>
            </button>
            <input
              type="date"
              value={getValidDate(selectedDate)}
              onChange={e => setSelectedDate(e.target.value)}
              className="rounded-xl border border-[var(--border)] bg-[var(--muted)] px-4 py-2 text-[var(--foreground)] focus:border-transparent focus:ring-2 focus:ring-[var(--primary)]"
            />
            <button
              onClick={() => adjustDate(1)}
              className="flex items-center justify-center rounded-xl bg-[var(--muted)] px-3 py-2 text-[var(--foreground)] transition-all duration-200 hover:bg-[var(--surface-variant)]"
              title="Next day"
            >
              <span className="text-lg">→</span>
            </button>
            <button
              onClick={() => {
                setSelectedDate(new Date().toISOString().split('T')[0]);
              }}
              className="rounded-xl bg-[var(--primary)]/10 px-3 py-2 text-sm font-medium text-[var(--primary)] transition-all duration-200 hover:bg-[var(--primary)]/20"
              title="Go to today"
            >
              Today
            </button>
          </div>
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-[var(--foreground-secondary)]">
            {t('temperature.filterEquipment', 'Filter by Equipment')}
          </label>
          <select
            value={selectedType}
            onChange={e => setSelectedType(e.target.value)}
            className="rounded-xl border border-[var(--border)] bg-[var(--muted)] px-4 py-2 text-[var(--foreground)] focus:border-transparent focus:ring-2 focus:ring-[var(--primary)]"
          >
            <option value="all">{t('temperature.allEquipment', 'All Equipment')}</option>
            {isMounted &&
              equipment
                .filter(eq => eq.is_active)
                .map((item, index) => {
                  // Create a unique key combining id, name, and index to prevent duplicates
                  const uniqueKey =
                    item.id !== undefined
                      ? `eq-${item.id}-${item.name}-${index}`
                      : `eq-${item.name}-${item.equipment_type}-${index}`;
                  const icon = getTypeIcon(item.equipment_type);
                  return (
                    <option key={uniqueKey} value={item.equipment_type}>
                      {icon} {item.name}
                    </option>
                  );
                })}
            {temperatureTypes
              .filter(
                type =>
                  type.value === 'food_cooking' ||
                  type.value === 'food_hot_holding' ||
                  type.value === 'food_cold_holding',
              )
              .map(type => (
                <option key={type.value} value={type.value}>
                  {getIconString(type.icon)} {type.label}
                </option>
              ))}
          </select>
        </div>
      </div>
      <button
        onClick={onAddClick}
        className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] px-6 py-3 font-semibold text-[var(--button-active-text)] transition-all duration-200 hover:shadow-xl"
      >
        <Icon icon={Plus} size="md" className="text-[var(--button-active-text)]" aria-hidden={true} />
        {t('temperature.addLog', 'Add Temperature Log')}
      </button>
    </div>
  );
}

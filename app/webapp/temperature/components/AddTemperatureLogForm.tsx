'use client';

import { AutosaveStatus } from '@/components/ui/AutosaveStatus';
import { Icon } from '@/components/ui/Icon';
import { useAutosave } from '@/hooks/useAutosave';
import { useCountryFormatting } from '@/hooks/useCountryFormatting';
import { useStaff } from '@/hooks/useStaff';
import { useTranslation } from '@/lib/useTranslation';
import { Lightbulb } from 'lucide-react';
import { useEffect, useState } from 'react';

export interface AddTemperatureLogFormProps {
  show: boolean;
  setShow: (v: boolean) => void;
  newLog: any;
  setNewLog: (v: any) => void;
  onAddLog: (e: React.FormEvent) => void;
  equipment: Array<{ id?: number; name: string; equipment_type: string; is_active: boolean }>;
  temperatureTypes: Array<{ value: string; label: string; icon: string }>;
}

export function AddTemperatureLogForm({
  show,
  setShow,
  newLog,
  setNewLog,
  onAddLog,
  equipment,
  temperatureTypes,
}: AddTemperatureLogFormProps) {
  const { t } = useTranslation();
  const { countryConfig } = useCountryFormatting();
  const { staff, loading: staffLoading } = useStaff();
  const [showNotes, setShowNotes] = useState(false);

  // Ensure date/time are set when form opens
  useEffect(() => {
    if (show) {
      const currentDate = new Date().toISOString().split('T')[0];
      const currentTime = new Date().toTimeString().split(' ')[0].substring(0, 5);
      if (!newLog.log_date || !newLog.log_time) {
        setNewLog({
          ...newLog,
          log_date: currentDate,
          log_time: currentTime,
        });
      }
    }
  }, [show, newLog, setNewLog]);

  // Format date/time for display
  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString(countryConfig.locale || 'en-AU', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (timeStr: string) => {
    if (!timeStr) return '';
    return timeStr;
  };
  /**
   * Gets the icon string for a given equipment type (for use in select options).
   * Note: Returns emoji string for select options compatibility (can't use React components in <option>).
   */
  const getTypeIcon = (type: string) => temperatureTypes.find(tt => tt.value === type)?.icon || '';
  const getTypeLabel = (type: string) =>
    temperatureTypes.find(tt => tt.value === type)?.label || type;

  // Autosave integration
  const entityId = (newLog as any).id || 'new';
  const canAutosave =
    entityId !== 'new' ||
    Boolean(newLog.equipment_id && newLog.log_date && newLog.temperature_celsius);

  const {
    status,
    error: autosaveError,
    saveNow,
  } = useAutosave({
    entityType: 'temperature_logs',
    entityId: entityId,
    data: newLog,
    enabled: canAutosave && show,
  });

  if (!show) return null;

  return (
    <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-lg">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-xl font-semibold text-[var(--foreground)]">
          {t('temperature.addNewLog', 'Add New Temperature Log')}
        </h3>
        <AutosaveStatus status={status} error={autosaveError} onRetry={saveNow} />
      </div>
      <p className="mb-4 text-sm text-[var(--foreground-muted)]">
        <Icon
          icon={Lightbulb}
          size="sm"
          className="mr-1 inline text-[var(--primary)]"
          aria-hidden={true}
        />{' '}
        You can log multiple temperatures per day for the same equipment.
      </p>
      <form onSubmit={onAddLog} className="desktop:grid-cols-2 grid grid-cols-1 gap-4">
        <div className="desktop:col-span-2">
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--muted)]/50 px-4 py-3">
            <p className="text-sm text-[var(--foreground-muted)]">
              <span className="font-medium text-[var(--foreground-secondary)]">Date & Time:</span>{' '}
              {formatDate(newLog.log_date)} at {formatTime(newLog.log_time)}
            </p>
          </div>
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-[var(--foreground-secondary)]">
            {t('temperature.equipment', 'Equipment')}
          </label>
          <select
            value={newLog.temperature_type}
            onChange={e => {
              const selectedEquipment = equipment.find(eq => eq.equipment_type === e.target.value);
              setNewLog({
                ...newLog,
                temperature_type: e.target.value,
                location: selectedEquipment?.name || '',
              });
            }}
            className="w-full rounded-2xl border border-[var(--border)] bg-[var(--muted)] px-4 py-3 text-[var(--foreground)] focus:border-transparent focus:ring-2 focus:ring-[var(--primary)]"
            required
          >
            <option value="">{t('temperature.selectEquipment', 'Select Equipment')}</option>
            {equipment
              .filter(eq => eq.is_active)
              .map((item, index) => (
                <option
                  key={`equipment-${item.id ?? index}-${item.equipment_type}-${item.name}`}
                  value={item.equipment_type}
                >
                  {getTypeIcon(item.equipment_type)} {item.name} (
                  {getTypeLabel(item.equipment_type)})
                </option>
              ))}
            {temperatureTypes
              .filter(
                type =>
                  type.value === 'food_cooking' ||
                  type.value === 'food_hot_holding' ||
                  type.value === 'food_cold_holding',
              )
              .map(type => (
                <option key={`type-${type.value}`} value={type.value}>
                  {type.icon} {type.label} (Food Safety)
                </option>
              ))}
          </select>
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-[var(--foreground-secondary)]">
            {t('temperature.temperature', 'Temperature (°C)')}
          </label>
          <input
            type="number"
            step="0.1"
            value={newLog.temperature_celsius}
            onChange={e => setNewLog({ ...newLog, temperature_celsius: e.target.value })}
            className="w-full rounded-2xl border border-[var(--border)] bg-[var(--muted)] px-4 py-3 text-[var(--foreground)] focus:border-transparent focus:ring-2 focus:ring-[var(--primary)]"
            placeholder="e.g., 3.5"
            required
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-[var(--foreground-secondary)]">
            {['food_cooking', 'food_hot_holding', 'food_cold_holding'].includes(
              newLog.temperature_type,
            )
              ? t('temperature.foodItem', 'Food Item')
              : t('temperature.location', 'Location')}
          </label>
          <input
            type="text"
            value={newLog.location}
            onChange={e => setNewLog({ ...newLog, location: e.target.value })}
            className="w-full rounded-2xl border border-[var(--border)] bg-[var(--muted)] px-4 py-3 text-[var(--foreground)] focus:border-transparent focus:ring-2 focus:ring-[var(--primary)]"
            placeholder={
              ['food_cooking', 'food_hot_holding', 'food_cold_holding'].includes(
                newLog.temperature_type,
              )
                ? 'e.g., Chicken Curry, Soup Station 1, Salad Bar'
                : 'e.g., Main Fridge, Freezer 1'
            }
            required={['food_cooking', 'food_hot_holding', 'food_cold_holding'].includes(
              newLog.temperature_type,
            )}
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-[var(--foreground-secondary)]">
            {t('temperature.loggedBy', 'Logged By')}
          </label>
          <select
            value={staff.find(s => s.full_name === newLog.logged_by)?.id || ''}
            onChange={e => {
              const selectedStaff = staff.find(s => s.id === e.target.value);
              setNewLog({
                ...newLog,
                logged_by: selectedStaff ? selectedStaff.full_name : '',
              });
            }}
            className="w-full rounded-2xl border border-[var(--border)] bg-[var(--muted)] px-4 py-3 text-[var(--foreground)] focus:border-transparent focus:ring-2 focus:ring-[var(--primary)]"
            disabled={staffLoading}
          >
            <option value="">{staffLoading ? 'Loading staff...' : 'Select staff member'}</option>
            {staff.map(member => (
              <option key={member.id} value={member.id}>
                {member.full_name}
                {member.role ? ` (${member.role})` : ''}
              </option>
            ))}
          </select>
        </div>
        <div className="desktop:col-span-2">
          <label className="mb-3 flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              checked={showNotes}
              onChange={e => setShowNotes(e.target.checked)}
              className="h-4 w-4 rounded border-[var(--border)] bg-[var(--muted)] text-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]"
            />
            <span className="text-sm font-medium text-[var(--foreground-secondary)]">
              {t('temperature.addNotes', 'Add Notes')}
            </span>
          </label>
          {showNotes && (
            <textarea
              value={newLog.notes}
              onChange={e => setNewLog({ ...newLog, notes: e.target.value })}
              className="w-full rounded-2xl border border-[var(--border)] bg-[var(--muted)] px-4 py-3 text-[var(--foreground)] focus:border-transparent focus:ring-2 focus:ring-[var(--primary)]"
              placeholder="Additional notes or observations"
              rows={3}
            />
          )}
        </div>
        <div className="desktop:col-span-2 flex space-x-4">
          <button
            type="submit"
            className="rounded-2xl bg-[var(--primary)] px-6 py-3 font-semibold text-[var(--button-active-text)] transition-all duration-200 hover:shadow-xl"
          >
            {t('temperature.save', 'Save Log')}
          </button>
          <button
            type="button"
            onClick={() => setShow(false)}
            className="rounded-2xl bg-[var(--muted)] px-6 py-3 font-semibold text-[var(--foreground)] transition-all duration-200 hover:bg-[var(--surface-variant)]"
          >
            {t('temperature.cancel', 'Cancel')}
          </button>
        </div>
      </form>
    </div>
  );
}

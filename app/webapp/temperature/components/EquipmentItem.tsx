import { useTranslation } from '@/lib/useTranslation';
import { getDefaultTemperatureRange } from '../utils/getDefaultTemperatureRange';

interface TemperatureEquipment {
  id: string;
  name: string;
  equipment_type: string;
  location: string | null;
  min_temp_celsius: number | null;
  max_temp_celsius: number | null;
  is_active: boolean;
}

interface EquipmentItemProps {
  item: TemperatureEquipment;
  editingId: string | null;
  setEditingId: (id: string | null) => void;
  temperatureTypes: Array<{ value: string; label: string; icon: string }>;
  quickTempLoading: Record<string, boolean>;
  onQuickTempLog: (id: string, name: string, type: string) => Promise<void>;
  onToggleStatus: (id: string, current: boolean) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, updates: Partial<TemperatureEquipment>) => void;
  onEquipmentClick?: (equipment: TemperatureEquipment) => void;
}

export function EquipmentItem({
  item,
  editingId,
  setEditingId,
  temperatureTypes,
  quickTempLoading,
  onQuickTempLog,
  onToggleStatus,
  onDelete,
  onUpdate,
  onEquipmentClick,
  getLastLogInfo,
  formatDate,
}: EquipmentItemProps) {
  const { t } = useTranslation();
  const getTypeIcon = (type: string) => temperatureTypes.find(t => t.value === type)?.icon || '🌡️';
  const getTypeLabel = (type: string) =>
    temperatureTypes.find(t => t.value === type)?.label || type;

  const handleCardClick = () => {
    if (onEquipmentClick && !editingId) {
      onEquipmentClick(item);
    }
  };

  const handleButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div
      onClick={handleCardClick}
      className={`group relative overflow-hidden rounded-3xl border border-[#2a2a2a] bg-[#1f1f1f] p-6 shadow-lg transition-all duration-300 ${
        onEquipmentClick && !editingId
          ? 'cursor-pointer hover:border-[#29E7CD]/30 hover:shadow-2xl'
          : 'hover:border-[#29E7CD]/30 hover:shadow-2xl'
      }`}
    >
      {/* Gradient accent */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#29E7CD]/5 to-[#D925C7]/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>

      <div className="relative">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-4 flex-1 min-w-0">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#29E7CD]/20 to-[#29E7CD]/10 shadow-lg">
              <span className="text-3xl">{getTypeIcon(item.equipment_type)}</span>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="mb-1 text-xl font-bold text-white truncate">{item.name}</h3>
              <p className="mb-2 text-sm font-medium text-gray-400">{getTypeLabel(item.equipment_type)}</p>
              {item.location && (
                <div className="flex items-center gap-1.5 text-sm text-gray-500">
                  <span>📍</span>
                  <span>{item.location}</span>
                </div>
              )}
            </div>
          </div>
          <div className="flex shrink-0 flex-col items-end gap-2 sm:items-start">
            <div className="text-right sm:text-left">
              <div className="mb-1 text-xs font-medium text-gray-400 uppercase tracking-wide">
                {t('temperature.range', 'Temperature Range')}
              </div>
              {(() => {
                // Use saved range if available, otherwise use default range based on equipment type
                const hasSavedRange = item.min_temp_celsius !== null && item.max_temp_celsius !== null;
                const defaultRange = getDefaultTemperatureRange(item.equipment_type, item.name);

                // Determine what to display
                let displayText: string;
                let isRecommended = false;

                if (hasSavedRange) {
                  // Use saved range
                  if (item.max_temp_celsius !== null) {
                    displayText = `${item.min_temp_celsius}°C - ${item.max_temp_celsius}°C`;
                  } else {
                    displayText = `≥${item.min_temp_celsius}°C`;
                  }
                } else if (defaultRange.minTemp !== null) {
                  // Use default range
                  isRecommended = true;
                  if (defaultRange.maxTemp !== null) {
                    displayText = `${defaultRange.minTemp}°C - ${defaultRange.maxTemp}°C`;
                  } else {
                    displayText = `≥${defaultRange.minTemp}°C`;
                  }
                } else {
                  displayText = t('temperature.notSet', 'Not set');
                }

                return (
                  <div className="flex flex-col gap-1">
                    <div className="text-xl font-bold text-[#29E7CD]">
                      {displayText}
                    </div>
                    {isRecommended && (
                      <span className="text-xs text-gray-500 italic">
                        (Recommended)
                      </span>
                    )}
                  </div>
                );
              })()}
            </div>
            <div className="flex items-center gap-2 rounded-full border border-[#2a2a2a] bg-[#2a2a2a]/50 px-3 py-1.5">
              <div
                className={`h-2 w-2 rounded-full shadow-lg ${item.is_active ? 'bg-blue-400' : 'bg-gray-500'}`}
              />
              <span className="text-xs font-semibold text-gray-300">
                {item.is_active ? t('common.active', 'Active') : t('common.inactive', 'Inactive')}
              </span>
            </div>
          </div>
        </div>

        {/* Last Log Info */}
        {(() => {
          const lastLogInfo = getLastLogInfo ? getLastLogInfo(item) : null;
          if (lastLogInfo) {
            const date = new Date(lastLogInfo.date);
            const formattedDate = formatDate ? formatDate(date) : lastLogInfo.date;
            return (
              <div className="mb-4 rounded-2xl border border-[#2a2a2a] bg-[#2a2a2a]/30 p-4">
                <div className="mb-2 text-xs font-medium text-gray-400 uppercase tracking-wide">
                  Last Logged Temperature
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-lg font-bold text-white">
                      {lastLogInfo.temperature.toFixed(1)}°C
                    </div>
                    <div className="text-xs text-gray-400">{formattedDate}</div>
                  </div>
                  {lastLogInfo.isInRange !== null && (
                    <div className="flex items-center gap-2 rounded-full border border-[#2a2a2a] bg-[#2a2a2a]/50 px-3 py-1.5">
                      <div
                        className={`h-2 w-2 rounded-full shadow-lg ${
                          lastLogInfo.isInRange ? 'bg-green-500 animate-pulse' : 'bg-red-500 animate-pulse'
                        }`}
                      />
                      <span
                        className={`text-xs font-semibold ${
                          lastLogInfo.isInRange ? 'text-green-400' : 'text-red-400'
                        }`}
                      >
                        {lastLogInfo.isInRange ? 'In Range' : 'Out of Range'}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          }
          return null;
        })()}

        {/* Actions */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={e => {
              handleButtonClick(e);
              onQuickTempLog(item.id, item.name, item.equipment_type);
            }}
            disabled={quickTempLoading[item.id] || !item.is_active}
            className="flex-1 rounded-xl bg-gradient-to-r from-[#29E7CD] to-[#D925C7] px-4 py-2.5 text-sm font-semibold text-black shadow-lg transition-all duration-200 hover:scale-105 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
          >
            {quickTempLoading[item.id]
              ? t('temperature.logging', 'Logging...')
              : t('temperature.quickLog', 'Quick Log')}
          </button>
          <button
            onClick={e => {
              handleButtonClick(e);
              onToggleStatus(item.id, item.is_active);
            }}
            className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-200 ${
              item.is_active
                ? 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30 hover:shadow-lg'
                : 'bg-green-500/20 text-green-400 hover:bg-green-500/30 hover:shadow-lg'
            }`}
          >
            {item.is_active
              ? t('common.deactivate', 'Deactivate')
              : t('common.activate', 'Activate')}
          </button>
          <button
            onClick={e => {
              handleButtonClick(e);
              setEditingId(editingId === item.id ? null : item.id);
            }}
            className="rounded-xl bg-[#2a2a2a] px-4 py-2.5 text-sm font-medium text-gray-300 transition-all duration-200 hover:bg-[#3a3a3a] hover:text-white hover:shadow-lg"
          >
            {editingId === item.id ? t('common.cancel', 'Cancel') : t('common.edit', 'Edit')}
          </button>
          <button
            onClick={e => {
              handleButtonClick(e);
              onDelete(item.id);
            }}
            className="rounded-xl bg-red-500/20 px-4 py-2.5 text-sm font-medium text-red-400 transition-all duration-200 hover:bg-red-500/30 hover:shadow-lg"
          >
            {t('common.delete', 'Delete')}
          </button>
        </div>
      </div>
        {editingId === item.id && (
          <div className="mt-6 rounded-2xl border-t border-[#2a2a2a] bg-[#2a2a2a]/30 pt-6">
            <form
              onSubmit={e => {
                e.preventDefault();
                e.stopPropagation();
                const formData = new FormData(e.currentTarget);
                onUpdate(item.id, {
                  name: formData.get('name') as string,
                  equipment_type: formData.get('equipmentType') as string,
                  location: (formData.get('location') as string) || null,
                  min_temp_celsius: formData.get('minTemp')
                    ? parseFloat(formData.get('minTemp') as string)
                    : null,
                  max_temp_celsius: formData.get('maxTemp')
                    ? parseFloat(formData.get('maxTemp') as string)
                    : null,
                });
              }}
              onClick={handleButtonClick}
              className="space-y-4"
            >
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-300">
                  {t('temperature.equipmentName', 'Equipment Name')}
                </label>
                <input
                  type="text"
                  name="name"
                  defaultValue={item.name}
                  className="w-full rounded-xl border border-[#3a3a3a] bg-[#1f1f1f] px-4 py-3 text-white transition-all focus:border-[#29E7CD] focus:ring-2 focus:ring-[#29E7CD]/20 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-300">
                  {t('temperature.equipmentType', 'Equipment Type')}
                </label>
                <select
                  name="equipmentType"
                  defaultValue={item.equipment_type}
                  onChange={e => {
                    const selectedType = e.target.value;
                    const defaultRange = getDefaultTemperatureRange(selectedType, item.name);
                    // Update the form fields with default range
                    const minTempInput = e.currentTarget.form?.querySelector<HTMLInputElement>('input[name="minTemp"]');
                    const maxTempInput = e.currentTarget.form?.querySelector<HTMLInputElement>('input[name="maxTemp"]');
                    if (minTempInput) minTempInput.value = defaultRange.minTemp?.toString() || '';
                    if (maxTempInput) maxTempInput.value = defaultRange.maxTemp?.toString() || '';
                  }}
                  className="w-full rounded-xl border border-[#3a3a3a] bg-[#1f1f1f] px-4 py-3 text-white transition-all focus:border-[#29E7CD] focus:ring-2 focus:ring-[#29E7CD]/20 focus:outline-none"
                  required
                >
                  {temperatureTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.icon} {type.label}
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-xs text-gray-400">
                  Changing type will auto-set temperature range (Queensland standards)
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-300">
                  {t('temperature.location', 'Location')}
                </label>
                <input
                  type="text"
                  name="location"
                  defaultValue={item.location || ''}
                  className="w-full rounded-xl border border-[#3a3a3a] bg-[#1f1f1f] px-4 py-3 text-white transition-all focus:border-[#29E7CD] focus:ring-2 focus:ring-[#29E7CD]/20 focus:outline-none"
                  placeholder={String(t('common.optional', 'Optional'))}
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-300">
                  {t('temperature.minTemp', 'Min Temperature (°C)')}
                </label>
                <input
                  type="number"
                  step="0.1"
                  name="minTemp"
                  defaultValue={item.min_temp_celsius || ''}
                  className="w-full rounded-xl border border-[#3a3a3a] bg-[#1f1f1f] px-4 py-3 text-white transition-all focus:border-[#29E7CD] focus:ring-2 focus:ring-[#29E7CD]/20 focus:outline-none"
                  placeholder={String(t('common.optional', 'Optional'))}
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-300">
                  {t('temperature.maxTemp', 'Max Temperature (°C)')}
                </label>
                <input
                  type="number"
                  step="0.1"
                  name="maxTemp"
                  defaultValue={item.max_temp_celsius || ''}
                  className="w-full rounded-xl border border-[#3a3a3a] bg-[#1f1f1f] px-4 py-3 text-white transition-all focus:border-[#29E7CD] focus:ring-2 focus:ring-[#29E7CD]/20 focus:outline-none"
                  placeholder={String(t('common.optional', 'Optional'))}
                />
              </div>
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                className="rounded-xl bg-gradient-to-r from-[#29E7CD] to-[#D925C7] px-6 py-3 font-semibold text-black shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
              >
                {t('temperature.updateEquipment', 'Update Equipment')}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

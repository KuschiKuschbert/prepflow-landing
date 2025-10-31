import { useTranslation } from '@/lib/useTranslation';

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
}: EquipmentItemProps) {
  const { t } = useTranslation();
  const getTypeIcon = (type: string) => temperatureTypes.find(t => t.value === type)?.icon || '🌡️';
  const getTypeLabel = (type: string) =>
    temperatureTypes.find(t => t.value === type)?.label || type;

  return (
    <div className="rounded-3xl border border-[#2a2a2a] bg-[#1f1f1f] p-6 shadow-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="text-3xl">{getTypeIcon(item.equipment_type)}</div>
          <div>
            <h3 className="text-lg font-semibold text-white">{item.name}</h3>
            <p className="text-gray-400">{getTypeLabel(item.equipment_type)}</p>
            {item.location && <p className="text-sm text-gray-500">📍 {item.location}</p>}
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <div className="text-sm text-gray-400">
              {t('temperature.range', 'Temperature Range')}
            </div>
            <div className="text-lg font-semibold text-white">
              {item.min_temp_celsius && item.max_temp_celsius
                ? `${item.min_temp_celsius}°C - ${item.max_temp_celsius}°C`
                : t('temperature.notSet', 'Not set')}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div
              className={`h-3 w-3 rounded-full ${item.is_active ? 'bg-green-400' : 'bg-gray-400'}`}
            ></div>
            <span className="text-sm text-gray-300">
              {item.is_active ? t('common.active', 'Active') : t('common.inactive', 'Inactive')}
            </span>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => onQuickTempLog(item.id, item.name, item.equipment_type)}
              disabled={quickTempLoading[item.id] || !item.is_active}
              className="rounded-xl bg-gradient-to-r from-[#29E7CD] to-[#D925C7] px-4 py-2 text-sm font-semibold text-black transition-all duration-200 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
            >
              {quickTempLoading[item.id]
                ? t('temperature.logging', 'Logging...')
                : t('temperature.quickLog', 'Quick Log')}
            </button>
            <button
              onClick={() => onToggleStatus(item.id, item.is_active)}
              className={`rounded-xl px-3 py-2 text-sm font-semibold transition-all duration-200 ${item.is_active ? 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30' : 'bg-green-500/20 text-green-400 hover:bg-green-500/30'}`}
            >
              {item.is_active
                ? t('common.deactivate', 'Deactivate')
                : t('common.activate', 'Activate')}
            </button>
            <button
              onClick={() => setEditingId(editingId === item.id ? null : item.id)}
              className="rounded-xl bg-[#2a2a2a] px-3 py-2 text-sm text-gray-300 transition-all duration-200 hover:bg-[#3a3a3a]"
            >
              {editingId === item.id ? t('common.cancel', 'Cancel') : t('common.edit', 'Edit')}
            </button>
            <button
              onClick={() => onDelete(item.id)}
              className="rounded-xl bg-red-500/20 px-3 py-2 text-sm text-red-400 transition-all duration-200 hover:bg-red-500/30"
            >
              {t('common.delete', 'Delete')}
            </button>
          </div>
        </div>
      </div>
      {editingId === item.id && (
        <div className="mt-6 border-t border-[#2a2a2a] pt-6">
          <form
            onSubmit={e => {
              e.preventDefault();
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
                  className="w-full rounded-xl border border-[#3a3a3a] bg-[#2a2a2a] px-4 py-3 text-white focus:border-transparent focus:ring-2 focus:ring-[#29E7CD]"
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
                  className="w-full rounded-xl border border-[#3a3a3a] bg-[#2a2a2a] px-4 py-3 text-white focus:border-transparent focus:ring-2 focus:ring-[#29E7CD]"
                  required
                >
                  {temperatureTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.icon} {type.label}
                    </option>
                  ))}
                </select>
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
                  className="w-full rounded-xl border border-[#3a3a3a] bg-[#2a2a2a] px-4 py-3 text-white focus:border-transparent focus:ring-2 focus:ring-[#29E7CD]"
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
                  className="w-full rounded-xl border border-[#3a3a3a] bg-[#2a2a2a] px-4 py-3 text-white focus:border-transparent focus:ring-2 focus:ring-[#29E7CD]"
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
                  className="w-full rounded-xl border border-[#3a3a3a] bg-[#2a2a2a] px-4 py-3 text-white focus:border-transparent focus:ring-2 focus:ring-[#29E7CD]"
                  placeholder={String(t('common.optional', 'Optional'))}
                />
              </div>
            </div>
            <div className="flex space-x-3">
              <button
                type="submit"
                className="rounded-xl bg-gradient-to-r from-[#29E7CD] to-[#D925C7] px-6 py-3 font-semibold text-black transition-all duration-200 hover:shadow-xl"
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

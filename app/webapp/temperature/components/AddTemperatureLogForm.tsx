import { useTranslation } from '@/lib/useTranslation';

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
  const getTypeIcon = (type: string) =>
    temperatureTypes.find(tt => tt.value === type)?.icon || '🌡️';
  const getTypeLabel = (type: string) =>
    temperatureTypes.find(tt => tt.value === type)?.label || type;

  if (!show) return null;

  return (
    <div className="rounded-3xl border border-[#2a2a2a] bg-[#1f1f1f] p-6 shadow-lg">
      <h3 className="mb-2 text-xl font-semibold text-white">
        {t('temperature.addNewLog', 'Add New Temperature Log')}
      </h3>
      <p className="mb-4 text-sm text-gray-400">
        💡 You can log multiple temperatures per day for the same equipment (e.g., morning and
        evening checks). There&apos;s a 5-minute cooling off period between entries for the same
        equipment.
      </p>
      <div className="mb-4 rounded-2xl border border-blue-400/20 bg-blue-400/10 p-4">
        <h4 className="mb-2 text-sm font-semibold text-blue-400">
          🍽️ Queensland 2-Hour/4-Hour Rule
        </h4>
        <div className="space-y-1 text-xs text-gray-300">
          <p>
            • <span className="text-green-400">0-2 hours</span> in danger zone (5°C-60°C): Can
            refrigerate for later use
          </p>
          <p>
            • <span className="text-yellow-400">2-4 hours</span> in danger zone: Must use
            immediately
          </p>
          <p>
            • <span className="text-red-400">4+ hours</span> in danger zone: Must discard
          </p>
        </div>
      </div>
      <form onSubmit={onAddLog} className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-300">
            {t('temperature.date', 'Date')}
          </label>
          <input
            type="date"
            value={newLog.log_date}
            onChange={e => setNewLog({ ...newLog, log_date: e.target.value })}
            className="w-full rounded-2xl border border-[#2a2a2a] bg-[#2a2a2a] px-4 py-3 text-white focus:border-transparent focus:ring-2 focus:ring-[#29E7CD]"
            required
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-300">
            {t('temperature.time', 'Time')}
          </label>
          <input
            type="time"
            value={newLog.log_time}
            onChange={e => setNewLog({ ...newLog, log_time: e.target.value })}
            className="w-full rounded-2xl border border-[#2a2a2a] bg-[#2a2a2a] px-4 py-3 text-white focus:border-transparent focus:ring-2 focus:ring-[#29E7CD]"
            required
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-300">
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
            className="w-full rounded-2xl border border-[#2a2a2a] bg-[#2a2a2a] px-4 py-3 text-white focus:border-transparent focus:ring-2 focus:ring-[#29E7CD]"
            required
          >
            <option value="">{t('temperature.selectEquipment', 'Select Equipment')}</option>
            {equipment
              .filter(eq => eq.is_active)
              .map(item => (
                <option key={item.id} value={item.equipment_type}>
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
                <option key={type.value} value={type.value}>
                  {type.icon} {type.label} (Food Safety)
                </option>
              ))}
          </select>
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-300">
            {t('temperature.temperature', 'Temperature (°C)')}
          </label>
          <input
            type="number"
            step="0.1"
            value={newLog.temperature_celsius}
            onChange={e => setNewLog({ ...newLog, temperature_celsius: e.target.value })}
            className="w-full rounded-2xl border border-[#2a2a2a] bg-[#2a2a2a] px-4 py-3 text-white focus:border-transparent focus:ring-2 focus:ring-[#29E7CD]"
            placeholder="e.g., 3.5"
            required
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-300">
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
            className="w-full rounded-2xl border border-[#2a2a2a] bg-[#2a2a2a] px-4 py-3 text-white focus:border-transparent focus:ring-2 focus:ring-[#29E7CD]"
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
          {['food_cooking', 'food_hot_holding', 'food_cold_holding'].includes(
            newLog.temperature_type,
          ) && (
            <p className="mt-1 text-xs text-gray-400">
              💡 Specify the exact food item for proper 2-hour/4-hour rule tracking
            </p>
          )}
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-300">
            {t('temperature.loggedBy', 'Logged By')}
          </label>
          <input
            type="text"
            value={newLog.logged_by}
            onChange={e => setNewLog({ ...newLog, logged_by: e.target.value })}
            className="w-full rounded-2xl border border-[#2a2a2a] bg-[#2a2a2a] px-4 py-3 text-white focus:border-transparent focus:ring-2 focus:ring-[#29E7CD]"
            placeholder="Staff member name"
          />
        </div>
        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-medium text-gray-300">
            {t('temperature.notes', 'Notes')}
          </label>
          <textarea
            value={newLog.notes}
            onChange={e => setNewLog({ ...newLog, notes: e.target.value })}
            className="w-full rounded-2xl border border-[#2a2a2a] bg-[#2a2a2a] px-4 py-3 text-white focus:border-transparent focus:ring-2 focus:ring-[#29E7CD]"
            placeholder="Additional notes or observations"
            rows={3}
          />
        </div>
        <div className="flex space-x-4 md:col-span-2">
          <button
            type="submit"
            className="rounded-2xl bg-[#29E7CD] px-6 py-3 font-semibold text-black transition-all duration-200 hover:shadow-xl"
          >
            {t('temperature.save', 'Save Log')}
          </button>
          <button
            type="button"
            onClick={() => setShow(false)}
            className="rounded-2xl bg-[#2a2a2a] px-6 py-3 font-semibold text-white transition-all duration-200 hover:bg-[#3a3a3a]"
          >
            {t('temperature.cancel', 'Cancel')}
          </button>
        </div>
      </form>
    </div>
  );
}

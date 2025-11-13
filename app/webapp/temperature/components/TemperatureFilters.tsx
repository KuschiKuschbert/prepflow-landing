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
  const getTypeIcon = (type: string) =>
    temperatureTypes.find(tt => tt.value === type)?.icon || '🌡️';

  return (
    <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
      <div className="flex flex-col gap-4 sm:flex-row">
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-300">
            {t('temperature.filterDate', 'Filter by Date')}
          </label>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                const currentDate = new Date(selectedDate);
                currentDate.setDate(currentDate.getDate() - 1);
                setSelectedDate(currentDate.toISOString().split('T')[0]);
              }}
              className="flex items-center justify-center rounded-xl bg-[#2a2a2a] px-3 py-2 text-white transition-all duration-200 hover:bg-[#3a3a3a]"
              title="Previous day"
            >
              <span className="text-lg">←</span>
            </button>
            <input
              type="date"
              value={selectedDate}
              onChange={e => setSelectedDate(e.target.value)}
              className="rounded-xl border border-[#2a2a2a] bg-[#2a2a2a] px-4 py-2 text-white focus:border-transparent focus:ring-2 focus:ring-[#29E7CD]"
            />
            <button
              onClick={() => {
                const currentDate = new Date(selectedDate);
                currentDate.setDate(currentDate.getDate() + 1);
                setSelectedDate(currentDate.toISOString().split('T')[0]);
              }}
              className="flex items-center justify-center rounded-xl bg-[#2a2a2a] px-3 py-2 text-white transition-all duration-200 hover:bg-[#3a3a3a]"
              title="Next day"
            >
              <span className="text-lg">→</span>
            </button>
            <button
              onClick={() => {
                setSelectedDate(new Date().toISOString().split('T')[0]);
              }}
              className="rounded-xl bg-[#29E7CD]/10 px-3 py-2 text-sm font-medium text-[#29E7CD] transition-all duration-200 hover:bg-[#29E7CD]/20"
              title="Go to today"
            >
              Today
            </button>
          </div>
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-300">
            {t('temperature.filterEquipment', 'Filter by Equipment')}
          </label>
          <select
            value={selectedType}
            onChange={e => setSelectedType(e.target.value)}
            className="rounded-xl border border-[#2a2a2a] bg-[#2a2a2a] px-4 py-2 text-white focus:border-transparent focus:ring-2 focus:ring-[#29E7CD]"
          >
            <option value="all">{t('temperature.allEquipment', 'All Equipment')}</option>
            {equipment
              .filter(eq => eq.is_active)
              .map((item, index) => (
                <option key={item.id ?? `eq-${index}`} value={item.equipment_type}>
                  {getTypeIcon(item.equipment_type)} {item.name}
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
                  {type.icon} {type.label}
                </option>
              ))}
          </select>
        </div>
      </div>
      <button
        onClick={onAddClick}
        className="rounded-2xl bg-gradient-to-r from-[#29E7CD] to-[#D925C7] px-6 py-3 font-semibold text-black transition-all duration-200 hover:shadow-xl"
      >
        ➕ {t('temperature.addLog', 'Add Temperature Log')}
      </button>
    </div>
  );
}

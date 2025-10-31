import { useTranslation } from '@/lib/useTranslation';

interface CreateEquipmentFormProps {
  show: boolean;
  temperatureTypes: Array<{ value: string; label: string; icon: string }>;
  newEquipment: {
    name: string;
    equipmentType: string;
    location: string;
    minTemp: number | null;
    maxTemp: number | null;
  };
  setNewEquipment: (v: {
    name: string;
    equipmentType: string;
    location: string;
    minTemp: number | null;
    maxTemp: number | null;
  }) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

export function CreateEquipmentForm({
  show,
  temperatureTypes,
  newEquipment,
  setNewEquipment,
  onSubmit,
  onCancel,
}: CreateEquipmentFormProps) {
  const { t } = useTranslation();
  if (!show) return null;

  return (
    <div className="rounded-3xl border border-[#2a2a2a] bg-[#1f1f1f] p-6 shadow-lg">
      <h3 className="mb-4 text-lg font-semibold text-white">➕ Add New Equipment</h3>
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300">Equipment Name</label>
            <input
              type="text"
              value={newEquipment.name}
              onChange={e => setNewEquipment({ ...newEquipment, name: e.target.value })}
              className="w-full rounded-xl border border-[#3a3a3a] bg-[#2a2a2a] px-4 py-3 text-white focus:border-transparent focus:ring-2 focus:ring-[#29E7CD]"
              placeholder="e.g., Main Fridge, Freezer 1"
              required
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300">Equipment Type</label>
            <select
              value={newEquipment.equipmentType}
              onChange={e => setNewEquipment({ ...newEquipment, equipmentType: e.target.value })}
              className="w-full rounded-xl border border-[#3a3a3a] bg-[#2a2a2a] px-4 py-3 text-white focus:border-transparent focus:ring-2 focus:ring-[#29E7CD]"
              required
            >
              <option value="">Select type...</option>
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
              Location (Optional)
            </label>
            <input
              type="text"
              value={newEquipment.location}
              onChange={e => setNewEquipment({ ...newEquipment, location: e.target.value })}
              className="w-full rounded-xl border border-[#3a3a3a] bg-[#2a2a2a] px-4 py-3 text-white focus:border-transparent focus:ring-2 focus:ring-[#29E7CD]"
              placeholder="e.g., Kitchen, Storage Room"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300">
              Min Temperature (°C)
            </label>
            <input
              type="number"
              step="0.1"
              value={newEquipment.minTemp || ''}
              onChange={e =>
                setNewEquipment({
                  ...newEquipment,
                  minTemp: e.target.value ? parseFloat(e.target.value) : null,
                })
              }
              className="w-full rounded-xl border border-[#3a3a3a] bg-[#2a2a2a] px-4 py-3 text-white focus:border-transparent focus:ring-2 focus:ring-[#29E7CD]"
              placeholder="Optional"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300">
              Max Temperature (°C)
            </label>
            <input
              type="number"
              step="0.1"
              value={newEquipment.maxTemp || ''}
              onChange={e =>
                setNewEquipment({
                  ...newEquipment,
                  maxTemp: e.target.value ? parseFloat(e.target.value) : null,
                })
              }
              className="w-full rounded-xl border border-[#3a3a3a] bg-[#2a2a2a] px-4 py-3 text-white focus:border-transparent focus:ring-2 focus:ring-[#29E7CD]"
              placeholder="Optional"
            />
          </div>
        </div>
        <div className="flex space-x-3">
          <button
            type="submit"
            className="rounded-xl bg-gradient-to-r from-[#29E7CD] to-[#D925C7] px-6 py-3 font-semibold text-black transition-all duration-200 hover:shadow-xl"
          >
            {t('temperature.addEquipment', 'Add Equipment')}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl bg-[#2a2a2a] px-6 py-3 font-semibold text-gray-300 transition-all duration-200 hover:bg-[#3a3a3a]"
          >
            {t('common.cancel', 'Cancel')}
          </button>
        </div>
      </form>
    </div>
  );
}
